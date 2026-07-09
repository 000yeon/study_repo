# 비밀번호를 DB에 “어떻게” 저장해야 할까

> 개발자(백엔드·프론트 포함)가 사용자 로그인 비밀번호를 DB에 저장할 때 고려해야 할 보안 원칙과 구현 패턴을 나쁜 예 → 덜 나쁜 예 → 권장 예 순으로 정리해보자

## 0. 비밀번호 저장의 목표와 위협 모델

### 목표
- DB 유출 시에도 **원문 비밀번호 역산이 불가능**해야 함
- 같은 비밀번호라도 사용자마다 **다른 해시 결과**가 나오도록
- **대량 크래킹 비용을 높이기**
- 시간이 지남에 따라 **보안 강도 상향 조정 가능**

### 위협
- **오프라인 크래킹**: DB만 들고 무제한 시도로 깨는 공격
- **레인보우 테이블**: 미리 계산된 해시 대입 공격
- **GPU 병렬화**: 빠른 해시일수록 수십억 번 시도 가능

---

## 1. 저장 방식의 단계별 비교

| 단계 | 방식 | 설명 | 위험성/권장여부 |
|---|---|---|---|
| 1 | **평문 저장** | 비밀번호 그대로 저장 | **즉시 금지** |
| 2 | **난독화 수준** | Base64, ROT 등 | 보안 아님 |
| 3 | **단순 해시** | `SHA-256(password)` | 레인보우 테이블에 취약 |
| 4 | **공통 솔트 + 해시** | 모든 사용자 동일 솔트 | 여전히 위험 |
| 5 | **개별 솔트 + 빠른 해시** | `SHA-256(salt+password)` | GPU에 취약 |
| 6 | **PBKDF2** | 반복 횟수로 느리게 | **가능** |
| 7 | **bcrypt** | cost 기반 지연 | **권장** |
| 8 | **scrypt/Argon2id** | 메모리-하드 KDF | **최권장** |

---

## 2. 솔트·페퍼·KDF

- **솔트(Salt)**: 사용자별 랜덤 값, 레인보우 테이블 무력화. DB에 저장해도 OK
- **페퍼(Pepper)**: 앱/환경변수에 저장된 비밀 키. DB만 유출되어도 보호 강화
- **KDF**: 고의로 느린 함수(PBKDF2, bcrypt, scrypt, Argon2). 크래킹 비용 상승

---

## 3. 저장 형식(스키마)과 예시

### PHC 문자열 형식(권장)
- 해시 결과에 알고리즘/버전/파라미터/솔트/해시를 함께 문자열로 저장.
- 예) $argon2id$v=19$m=65536,t=3,p=1$<base64(salt)>$<base64(hash)>
- 장점: 검증 시 무슨 알고리즘·파라미터로 생성됐는지 한 번에 파악 → 자동 마이그레이션 용이.

### 테이블 컬럼 예시
```
users(
  id PK,
  username UNIQUE,
  password_hash TEXT,          -- PHC string 보관
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

## 4. 권장 알고리즘과 파라미터 튜닝 가이드

> **정답은 “벤치마크”**입니다. 운영 서버(코어 수/메모리/트래픽)에 맞춰 로그인 1회 해시가 100250ms 나오도록 조정하세요.

###  Argon2id (최권장)
- 파라미터: timeCost(회수), memoryCost(메모리), parallelism(병렬)
- 시작점: time=2~3, memory=64~128MiB, parallelism=1~2 → 실제 서버에서 측정 후 상향/하향
### ypt (권장)
- 파라미터: N(CPU/메모리 비용), r, p
- 예시 시작점: N=2^15, r=8, p=1 → 서버에서 측정 후 조정
### bcrypt (양호)
- 파라미터: cost(작업량)
- 예시 시작점: cost=12~14 → 서버에서 측정 후 조정
### PBKDF2-HMAC (가능)
- 파라미터: iterations
- 시작점: 수십만~수백만 회(서버에서 100~250ms 나오게)
-  표준/광범위 지원, 단점: 메모리-하드 특성이 약함

---

## 5. 구현 예시

### Node.js (argon2id)
```
// npm i argon2
const argon2 = require('argon2');

// 해시 생성
async function hashPassword(password, pepper) {
  const prehash = password + pepper; // 또는 HMAC으로 결합
  return argon2.hash(prehash, {
    type: argon2.argon2id,
    timeCost: 3,
    memoryCost: 65536, // 64 MiB
    parallelism: 1,
  }); // PHC 문자열 반환
}

// 검증
async function verifyPassword(storedPHC, inputPassword, pepper) {
  const prehash = inputPassword + pepper;
  return argon2.verify(storedPHC, prehash);
}
```

### Java / Spring Security (bcrypt 또는 Argon2)
```
// build.gradle: implementation 'org.springframework.security:spring-security-crypto'

// BCrypt
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // 서버에서 벤치마크로 cost 결정
}

// Argon2
@Bean
public PasswordEncoder argon2() {
    // (saltLength, hashLength, parallelism, memory, iterations)
    return new Argon2PasswordEncoder(16, 32, 1, 1 << 16, 3);
}

```
검증/업그레이드(권장: DelegatingPasswordEncoder로 알고리즘 표기 접두어 사용):
```
@Bean
public PasswordEncoder delegatingEncoder() {
    String idForEncode = "argon2";
    Map<String, PasswordEncoder> encoders = new HashMap<>();
    encoders.put("argon2", new Argon2PasswordEncoder(16, 32, 1, 1 << 16, 3));
    encoders.put("bcrypt", new BCryptPasswordEncoder(12));
    return new DelegatingPasswordEncoder(idForEncode, encoders);
}
// 이후 matches()가 old 해시도 인식 → 로그인 성공 시 needsUpgrade 판단 후 재해시
```

### Python (passlib)
```
# pip install passlib[argon2]
from passlib.hash import argon2

def hash_password(password, pepper=""):
    return argon2.using(rounds=3, memory_cost=65536, parallelism=1)\
                 .hash(password + pepper)  # PHC 형태

def verify_password(stored, password, pepper=""):
    return argon2.verify(password + pepper, stored)
```

---

## 6. 운영 팁: 점진적 업그레이드(리해시) 전략
- 로그인 시점 리해시: 검증 후 “파라미터가 약함/알고리즘 구식”이면 즉시 최신 파라미터로 재해시 → DB 업데이트.
- 알고리즘 교체: bcrypt → Argon2id 등도 사용자 경험 손상 없이 점진 적용 가능(Delegating/PHC 문자열로 구분).
- 페퍼 롤오버: 페퍼 키 교체 시, 로그인 성공 시 재해시 전략으로 자연스럽게 최신 키로 전환.

---

## 7. 함께 고려할 보안 조치(저장 외 영역)
- TLS 강제: 전송 구간 보호(HTTPS만).
- 레이트 리미팅/지연: 로그인 시도 제한, CAPTCHA, 지수 백오프.
- 계정 잠금 정책: 과도한 실패 시 일시 잠금+알림(과도 잠금은 악용 여지→밸런스 필요).
- MFA: 비밀번호 유출 대비 2차 방어선.
- 비밀번호 정책: 길이 중심(예: 패스프레이즈 허용) + 유출된 비밀번호 사용 금지(서버 측 사전 대조).
- 비밀번호 재설정: 토큰 일회성/만료, 이메일/문자 링크 보호.
- 감사 로그: 민감정보 제외, 이상 징후 모니터링.
- 비밀번호 미재사용 권고: 서비스 간 동일 비밀번호 사용 지양.

---

## 8. 안티 패턴(반드시 피하기)
- 평문/복호화 가능한 대칭키 암호화 저장
로그인 검증에 “복호화”는 필요 없다. 해시로 일치 여부만 확인.
- 솔트 재사용/고정 솔트
사용자별 랜덤 솔트를 써야 한다.
- 빠른 해시 사용(SHA-256/512 단독)
“빠름=깨기 쉬움”.
- 파라미터 고정
하드웨어 성능은 계속 좋아집니다. 주기적으로 상향 조정.
- 직접 알고리즘 구현
표준/검증된 라이브러리를 사용.

---

## 9. 체크리스트
- Argon2id(또는 scrypt/bcrypt/PBKDF2)로 KDF 기반 저장
- PHC 문자열로 알고리즘/파라미터 함께 저장
- 사용자별 랜덤 솔트 사용
- (선택) 페퍼 적용 및 KMS/HSM 보관
- 서버 기준 100~250ms로 파라미터 튜닝(벤치마크)
- 로그인 시 리해시 업그레이드 로직 구현
- 레이트 리미팅·MFA·TLS·유출 비번 차단 등 보조 대책 적용
- 보안 로그/모니터링/침해 대응 절차 준비

---

## 10. 마무리
비밀번호 저장의 본질은 유출을 가정한 방어.
가장 효과적인 현대적 선택은 **Argon2id(또는 scrypt)**이며, 어떤 알고리즘을 쓰더라도 환경에 맞게 만들고, 파라미터와 알고리즘을 시간이 지날수록 업그레이드할 수 있는 구조(예: PHC 문자열 + 로그인 시 리해시)를 마련하는 것이 장기적으로 가장 안전.
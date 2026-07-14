# Part 2 — 기술 선택과 근거: 2025/2026 트렌드 기반 개발 환경 설계

> 도구를 고를 때는 "유명해서"가 아니라 "왜 이게 더 나은가"를 설명할 수 있어야 한다.

---

## 기술 선택의 원칙

개발 환경을 설계할 때 기준은 하나였다.

**"2025년 기준 커뮤니티에서 실질적으로 권장되고 있는가?"**

유행을 쫓는 게 아니라, 시간이 지날수록 레거시가 되는 선택을 피하는 것이 목적이었다. 각 도구에 대해 "왜 이걸 쓰는가"를 팀원에게 설명할 수 있는 근거를 먼저 정리했다.

---

## 1. 패키지 매니저 — pnpm

### 왜 npm/yarn이 아닌가

`npm`은 오랫동안 Node.js 생태계의 기본이었다. `yarn`은 npm의 속도 문제를 해결하며 한동안 인기를 끌었다. 그러나 두 도구 모두 **의존성 중복 설치** 문제를 근본적으로 해결하지 못했다.

프로젝트 A와 프로젝트 B 둘 다 `react@18.3.0`을 쓴다면, npm/yarn은 이를 각각 `node_modules/`에 복사한다. 팀에 Admin 프로젝트가 3개 있다면 같은 패키지가 세 번 복사된다.

### pnpm의 차별점

pnpm은 **content-addressable store** 방식을 사용한다.

- 패키지는 전역 스토어에 단 한 번만 저장된다
- 각 프로젝트의 `node_modules/`는 스토어를 가리키는 **하드링크**로 구성된다
- 결과적으로 디스크 사용량이 npm 대비 **60~80% 절약**된다

| 항목 | npm | pnpm |
|------|-----|------|
| 설치 속도 (캐시 있음) | 기준 | 약 2배 빠름 |
| 디스크 사용량 | 기준 | 60~80% 절감 |
| 의존성 격리 | 느슨함 | 엄격 (phantom dependency 차단) |
| 모노레포 지원 | 별도 설정 | 기본 내장 |

### phantom dependency 문제

npm/yarn의 flat `node_modules` 구조에서는 직접 설치하지 않은 패키지도 `require()`로 불러올 수 있다 — 이것이 **phantom dependency**다. 이 코드는 해당 패키지가 peer dependency로 설치된 다른 패키지를 업그레이드하면 갑자기 런타임 에러가 난다. pnpm의 strict isolation은 이 문제를 원천 차단한다.

### 선택 이유 요약

> 팀 프로젝트 3개를 동시 운영하는 환경에서 디스크 절약 + 엄격한 의존성 격리 + 빠른 CI — 세 가지 모두 pnpm이 우위다.

---

## 2. 빌드 도구 — Vite (for Admin SPA)

### Admin 프로젝트에 Next.js가 필요한가

Next.js는 강력하다. SSR, SSG, ISR, App Router — 강력한 기능들이 있다. 그런데 이 기능들이 Admin 프로젝트에서 실제로 필요한가?

Admin 대시보드의 특성을 생각해보면:
- 검색 엔진 노출이 필요 없다 (로그인 후에만 접근)
- 초기 HTML에 데이터가 있을 필요 없다 (대시보드는 인증 후 API 호출)
- 페이지 전환보다 데이터 필터링과 테이블 조작이 UX 핵심이다

**Admin은 CSR(Client-Side Rendering)에 최적화된 SPA다.** Next.js의 SSR 기능은 대부분 사용되지 않는 오버헤드가 된다.

### Vite의 강점

| 항목 | Webpack (CRA) | Vite |
|------|--------------|------|
| 개발 서버 시작 | 수십 초 | 수백 ms (ESM 기반) |
| HMR 속도 | 1~3초 | 즉각적 |
| 프로덕션 빌드 | Webpack | Rollup (더 작은 번들) |
| 설정 복잡도 | 높음 | 낮음 |

Vite는 개발 환경에서 번들링 자체를 하지 않는다. 브라우저가 ESM을 직접 처리하게 하고, 변경된 파일만 다시 처리한다. 팀에서 Vite를 도입한 후 개발 서버 시작 시간이 **평균 40초 → 1초 미만**으로 줄었다.

### 언제 Next.js를 선택하는가

SSR이 필요한 경우는 명확하다: SEO가 필요한 페이지, 초기 렌더링 속도가 비즈니스 KPI인 서비스, Edge 기능이 필요한 경우. Admin은 이 경우에 해당하지 않는다.

---

## 3. ESLint — v9 Flat Config

### .eslintrc의 퇴장

ESLint v9부터 기존 `.eslintrc.js`, `.eslintrc.json` 형식은 **deprecated** 됐다. 대신 `eslint.config.mjs` (Flat Config)가 기본이 됐다.

이 변화의 배경은:
- 기존 cascade 방식의 설정 병합이 예측하기 어려웠다
- `.eslintignore`가 별도 파일로 분리된 것이 혼란을 일으켰다
- TypeScript 설정과 통합이 불자연스러웠다

Flat Config는 모든 설정이 하나의 배열로 명확하게 선언된다. 어떤 규칙이 적용되는지 순서대로 읽으면 바로 알 수 있다.

### 선택한 규칙 조합

```javascript
// 핵심 규칙 선택 근거
'@typescript-eslint/consistent-type-imports': 'error'
// → import type 강제 — 런타임 번들에서 타입이 제거되어 번들 크기 감소

'react-hooks/exhaustive-deps': 'warn'
// → stale closure 버그의 가장 흔한 원인, 경고로 두어 인지하게 만듦

'no-restricted-imports': ['error', { patterns: ['../../*', '../../../*'] }]
// → @ alias 강제 — 파일 이동 시 상대경로 전부 수정하는 문제 차단
```

---

## 4. Prettier — 포맷 자동화 + Tailwind 클래스 정렬

### ESLint와 역할 분리

많은 팀이 ESLint로 포맷까지 잡으려 한다. 이는 두 가지 문제를 만든다:
1. ESLint 포맷 규칙과 Prettier 규칙이 충돌해서 저장할 때마다 파일이 바뀐다
2. ESLint는 코드 품질 검사, Prettier는 포맷 — 역할이 분리되어야 설정이 명확하다

`eslint-config-prettier`를 ESLint 설정의 마지막에 추가해서 충돌하는 ESLint 포맷 규칙을 전부 비활성화했다.

### Tailwind 클래스 자동 정렬

Tailwind를 쓰는 팀의 공통 고통: `className`에 클래스가 무질서하게 쌓인다. 코드 리뷰에서 Tailwind 클래스 순서 때문에 diff가 지저분해진다.

`prettier-plugin-tailwindcss`는 저장할 때마다 Tailwind 권장 순서로 클래스를 자동 정렬한다. 이 플러그인 도입 후 Tailwind 클래스 순서와 관련된 리뷰 코멘트가 **완전히 사라졌다**.

---

## 5. Husky v9 + lint-staged + commitlint

### 왜 pre-commit 훅이 필요한가

CI에서 lint 실패를 잡는 것보다, **커밋 전에 잡는 것이 훨씬 싸다.** CI 빌드는 평균 4~8분이 걸린다. 포맷 오류 하나 때문에 PR을 다시 올리는 사이클이 생기면 개발자의 흐름이 끊긴다.

### lint-staged의 역할

전체 프로젝트를 lint하는 것이 아니라 **스테이징된 파일에만** 실행한다. Admin 프로젝트에서 파일이 200개를 넘어도 커밋 시 lint 시간은 변하지 않는다.

### commitlint + Conventional Commits

커밋 메시지 컨벤션이 팀에 없으면:
- `git log`가 의미 없는 로그 창고가 된다
- 자동 changelog 생성이 불가능하다
- 어떤 커밋이 기능인지 버그픽스인지 한눈에 알 수 없다

Conventional Commits (`feat:`, `fix:`, `refactor:` 등)을 강제하고, 한국어 제목을 허용(`subject-case: [0]`)하도록 설정했다. 팀 내에서 **커밋 메시지 형식을 별도로 설명한 적이 한 번도 없었지만**, 도입 이후 컨벤션 준수율은 100%를 유지했다.

---

## 기술 선택 요약

| 도구 | 선택 | 핵심 이유 |
|------|------|----------|
| 패키지 매니저 | **pnpm** | 디스크 절약 + strict isolation |
| 빌드 | **Vite** | Admin SPA = CSR, SSR 불필요 |
| Lint | **ESLint v9 Flat Config** | deprecated .eslintrc 탈피 |
| 포맷 | **Prettier + tailwindcss plugin** | 팀 포맷 통일 + Tailwind 클래스 정렬 |
| 커밋 게이팅 | **Husky v9 + lint-staged + commitlint** | CI 전에 오류 차단 |

모든 선택에는 "나중에 바꾸기 어렵다"는 비용이 따른다. 그래서 각 선택을 결정할 때 **현재 커뮤니티의 방향성과 일치하는가**를 기준으로 삼았다. 레거시를 선택하는 것이 가장 비싼 기술 부채다.

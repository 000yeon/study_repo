# Bun이란? 

[Bun](https://bun.sh)은 JavaScript 생태계를 더 빠르고 단순하게 만들기 위해 탄생한 **런타임 + 번들러 + 패키지 매니저 + 테스트 러너**입니다. 기존의 Node.js + npm/yarn + Webpack/Vite 조합을 하나로 통합하며, 놀라운 속도와 개발자 경험을 제공합니다.

---

##  주요 특징

| 기능           | 설명 |
|----------------|------|
| **런타임**       | Node.js처럼 JavaScript/TypeScript 코드를 실행 가능 |
| **패키지 매니저** | `bun install`은 npm/yarn보다 훨씬 빠르고, lockfile도 자체 포맷 사용 |
| **번들러**       | JS, TS, JSX, CSS, JSON 등을 번들링하는 내장 기능 제공 |
| **테스트 러너**   | Jest 스타일의 테스트 지원 (`bun test`) |
| **ESM 기본 지원** | ECMAScript Modules(ESM)을 기본으로 사용, CJS도 일부 호환 |
| **개발 서버**     | Vite처럼 핫 리로딩이 가능한 `bun dev` 제공 |

---

## 기술 스택

- **Rust**로 구현 → 매우 빠름
- **V8 JavaScript 엔진** 사용 (Node.js와 동일)
- 모듈 캐싱과 병렬 실행으로 빠른 빌드/실행 성능 제공

---

## Bun vs Node.js 

| 항목             | Bun               | Node.js       |
|------------------|-------------------|---------------|
| 런타임 속도        | 매우 빠름           | 보통            |
| 패키지 매니저      | 내장 (`bun install`) | 외부 (`npm`)    |
| 모듈 시스템        | ESM 기본 + CJS 일부 | CJS 기본        |
| 번들러           | ✅ 내장             | ❌ 없음          |
| TypeScript 지원   | ✅ 자동 변환         | ❌ (ts-node 필요) |
| npm 호환성       | ✅ (거의 완벽)       | ✅ 완벽          |

---

## 기본 사용법

```bash
bun init           # 프로젝트 초기화
bun install        # 패키지 설치 (npm보다 훨씬 빠름)
bun dev            # 개발 서버 실행 (핫 리로드 포함)
bun run index.ts   # 스크립트 실행
bun test           # 테스트 실행
#  Turbopack vs ⚡ Vite

##  1. Turbopack

- **제작사**: Vercel (Next.js 제작사)
- **언어 기반**: Rust로 작성됨 (고성능)

###  특징:
- Next.js 공식 번들러 (Webpack의 후속)
- 빠른 HMR (Hot Module Replacement)
- 모노레포, 서버 사이드 렌더링(SSR), 코드 분할 등에 강함
- Webpack과 비슷한 설정을 가지면서도 더 빠름

###  장점:
- 대규모 프로젝트에 적합 (Next.js와 완벽한 통합)
- 미래 지향적 아키텍처
- Rust 기반으로 성능 우수

---

##  2. Vite

- **제작사**: Evan You (Vue.js 제작자)
- **언어 기반**: JavaScript + ESBuild (Go로 작성됨)

###  특징:
- 개발 서버는 ESBuild, 프로덕션 번들은 Rollup 사용
- 빠른 시작 속도 (native ESM 지원)
- Vue, React, Svelte 등 다양한 프레임워크 지원

###  장점:
- 소규모부터 중간 규모까지 뛰어난 성능
- 빠른 초기 빌드와 핫 리로드
- 설정이 간단하고 문서화가 잘 되어 있음

---

##  요약 비교표

| 항목             | **Turbopack**             | **Vite**                             |
|------------------|----------------------------|--------------------------------------|
| **개발사**        | Vercel (Next.js)           | Evan You (Vue.js)                    |
| **언어 기반**     | Rust                       | JavaScript + Go (ESBuild + Rollup)  |
| **속도**          | 매우 빠름 (Rust)           | 매우 빠름 (ESBuild)                 |
| **프레임워크 특화** | Next.js 특화               | Vue/React 등 다양한 프레임워크      |
| **설정 복잡도**    | 약간 복잡함                | 매우 간단함                          |
| **프로덕션 번들**  | 자체 빌드 시스템            | Rollup 기반                          |

---

##  어떤 걸 선택해야 할까?

| 상황                     | 추천 도구   |
|-------------------------------|-------------|
| Next.js를 사용 중이라면         | **Turbopack** |
| Vue/React를 가볍게 사용         | **Vite**      |
| 대규모 기업용 서비스 구축       | **Turbopack** |
| 빠른 프로토타이핑 또는 소규모 프로젝트 | **Vite**      |

# Next.js 9 → 16 버전별 변화 총정리

Next.js는 9버전 이후로 매년 완전히 새로운 패러다임을 제시하며 React 생태계를 이끌어왔습니다.  
App Router, RSC, Turbopack, React Compiler, Partial Prerendering(PPR)…  
기능이 많아질수록 흐름을 이해하는 것이 훨씬 중요해졌죠.

그래서 버전별 핵심 변화 + 예시 코드 + 실무 적용 포인트를 정리하려 합니다.

---

# Next.js 9 — 현대 Next.js의 시작점

##  주요 변화
- TypeScript 공식 지원
- Dynamic Routing (pages/[id].tsx)
- API Routes (pages/api/*.ts)
- Automatic Static Optimization (기본 SSG)

##  예시: Dynamic Routing
    // pages/post/[id].tsx
    import { useRouter } from 'next/router';

    export default function PostPage() {
      const { query } = useRouter();
      return <h1>Post ID: {query.id}</h1>;
    }

##  예시: API Route
    // pages/api/hello.ts
    export default function handler(req, res) {
      res.status(200).json({ message: "Hello Next.js!" });
    }

## 실무 포인트
Next.js가 프론트 + 백엔드의 뼈대를 갖추기 시작한 시기.

---


# Next.js 10 — 이미지 최적화 시대

## 주요 변화
- next/image 도입
- i18n 라우팅 제공

## 예시: next/image 기본 사용
    import Image from 'next/image';

    export default function Home() {
      return (
        <Image
          src="/profile.png"
          width={200}
          height={200}
          alt="Profile"
          priority
        />
      );
    }

## 실무 포인트
LCP 성능 개선에 압도적으로 효과적.  
이미지 최적화는 이제 사실상 필수로 자리잡음.

---

# Next.js 11 — webpack 5 기반

## 주요 변화
- webpack 5 기본 번들러 적용
- Fast Refresh 안정화

## 예시: webpack 커스텀 설정
    // next.config.js
    module.exports = {
      webpack(config) {
        config.resolve.fallback = { fs: false };
        return config;
      },
    };

## 실무 포인트
webpack 4 대비 성능 향상 눈에 띔.  
레거시 플러그인은 호환성 문제 발생 가능.

---

# Next.js 12 — SWC 컴파일러 시대

## 주요 변화
- Rust 기반 SWC (Babel 대체)
- Middleware 도입
- React 18 지원

## 예시: Middleware 인증 체크
    // middleware.ts
    import { NextResponse } from 'next/server';

    export function middleware(req) {
      const isLoggedIn = req.cookies.get("token");

      if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

## 실무 포인트
런타임이 Edge이기 때문에 Node.js API 사용 불가.  
빌드 속도는 이전 대비 압도적으로 빨라짐.

---

# Next.js 13 / 13.4 — App Router 공식 등장

13.4에서 App Router가 Stable 되면서 Next.js의 방향성이 완전히 바뀜.

## 주요 기능
- app/ 디렉터리 기반 라우팅
- React Server Components (RSC)
- 중첩 레이아웃
- Route Handlers (app/api/route.ts)
- Streaming 렌더링

## 예시: Server Component 기본
    // app/page.tsx
    export default async function Home() {
      const data = await fetch('https://api.example.com/data').then(r => r.json());
      return <div>{data.title}</div>;
    }

## 예시: Route Handler
    // app/api/hello/route.ts
    export async function GET() {
      return Response.json({ message: 'Hello App Router!' });
    }

## 예시: 중첩 레이아웃
    // app/layout.tsx
    export default function RootLayout({ children }) {
      return (
        <html>
          <body>{children}</body>
        </html>
      );
    }

    // app/dashboard/layout.tsx
    export default function DashboardLayout({ children }) {
      return (
        <section>
          <nav>Dashboard Menu</nav>
          {children}
        </section>
      );
    }

## 실무 포인트
Server Component 구조로 인해 클라이언트 JS가 획기적으로 감소.  
SSR/CSR의 경계가 흐려지며 서버 중심 아키텍처로 전환됨.

---

# Next.js 14 — PPR 프리뷰 & Server Actions 안정화

## 주요 변화
- Partial Prerendering (PPR) 프리뷰
- Server Actions 정식화
- Turbopack dev 성능 개선

## 예시: Server Action
    // app/actions.ts
    "use server";

    export async function createPost(formData) {
      const title = formData.get("title");
      await db.post.create({ title });
    }

사용 예:
<form action={createPost}>
<input name="title" />
<button type="submit">Create</button>
</form>

## 실무 포인트
API Route 없이도 POST 처리 가능.  
Form 기반 서버 모델이 다시 부활하는 흐름.

---

# Next.js 15 — React 19 + Cache Components

## 주요 변화
- React 19 공식 지원
- Cache Components
- React Compiler
- Turbopack 기본 번들러
- Build Adapter API

## 예시: Cache Component
    import { cache } from 'react';

    const getCachedData = cache(async function () {
      const res = await fetch('https://api.example.com');
      return res.json();
    });

    export default async function Page() {
      const data = await getCachedData();
      return <pre>{JSON.stringify(data)}</pre>;
    }

## 예시: React Compiler 이후 코드
과거:
const handler = useCallback(() => doSomething(), []);

현재:
const handler = () => doSomething();

## 실무 포인트
useMemo/useCallback 남발하던 시절이 끝나감.  
Cache Component와 fetch 캐싱으로 서버 중심 아키텍처 완성.

---

# Next.js 16 — Server-first 완성판

## 주요 변화 (2025 최신 전망 + 베타 기준)
- React Compiler 기본 활성화
- PPR(Partial Prerendering) Stable
- Turbopack 완전 기본값
- Edge-first 구조
- Data Cache 자동 최적화

## 예시: PPR 기반 구조
    // app/page.tsx
    export const dynamic = 'force-dynamic';

    export default function Page() {
      return (
        <div>
          <Header />         // 정적 프리렌더
          <LiveUserStatus /> // 동적 섹션 + 스트리밍
        </div>
      );
    }

## 실무 포인트
서버 주도 렌더링이 표준.  
SSG/SSR/CSR 구분이 거의 필요 없고, 섹션별 렌더링이 가능해짐.

---

# 실무용 버전 선택 가이드

## 새 프로젝트 추천 조합
Next.js 16 + React 19 + App Router + Turbopack

## Pages Router 레거시 이관 전략
1) Next 버전만 15~16으로 올림
2) pages/ 유지
3) app/으로 화면 단위 점진 이전

---

# 마무리: Next.js는 어디로 향하는가?

Next.js는 프레임워크에서 플랫폼으로 진화 중  
최적화, 캐싱, 렌더링 모델 등 모든 것이 자동화 방향으로 이동하고 있어  
더 적은 코드로 더 빠른 웹을 만드는 시대가 오고 있습니다.

Server Components + Cache Components + PPR + Turbopack + React Compiler  
이 조합이 앞으로의 웹 개발의 표준이 될 가능성이 있다.

---


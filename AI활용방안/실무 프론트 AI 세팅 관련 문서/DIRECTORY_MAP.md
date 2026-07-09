# DIRECTORY_MAP — 폴더 구조

## 전체 구조

```
example-frontend-admin/
├── AI_CONTEXT/                      # AI 작업 온보딩/구현 규칙 문서
│   ├── AI_ONBOARDING.md             # 새 세션 시작점과 읽기 순서
│   ├── FIGMA_MCP_WORKFLOW.md        # Figma MCP 분석·구현 절차
│   ├── CLAUDE_TASK_TEMPLATE.md      # Claude 작업 요청 표준 템플릿
│   ├── VIBE_CODING_PROCESS.md       # AI 바이브 코딩 운영 프로세스
│   ├── COMMON_FLOWS.md              # 목록/등록/상세/수정/모달 공통 흐름
│   ├── DESIGN_SYSTEM.md             # admin token, icon registry, 스타일 규칙
│   ├── COMPONENT_RULES.md           # ui/shared 컴포넌트 사용 규칙
│   ├── UI_DEFAULTS.md               # table empty/sort/dropdown/leave guard 기본값
│   ├── FORM_RULES.md                # RHF + Zod form 규칙
│   ├── QUERY_RULES.md               # TanStack Query + agent API 규칙
│   ├── RENDERING_RULES.md           # App Router server/client boundary
│   └── FEATURES/                    # 도메인별 작업 프롬프트와 구현 가이드
│
├── src/
│   ├── app/                        # Next.js App Router 라우트
│   │   ├── (auth)/                 # 인증 필요 영역 — Sidebar+Header 레이아웃
│   │   │   ├── layout.tsx          # SideMenu + Header + <main bg-admin-gray-1 p-6>
│   │   │   ├── dashboard/page.tsx  # /dashboard → DashboardView
│   │   │   └── users/              # /users CRUD
│   │   │       ├── page.tsx        # 목록 → UserListView
│   │   │       ├── [id]/page.tsx   # 수정 → UserCrudView(id)
│   │   │       └── create/page.tsx # 생성 → UserCrudView()
│   │   ├── (no-auth)/
│   │   │   └── sign-in/page.tsx    # /sign-in → SignInView
│   │   ├── layout.tsx              # 루트 레이아웃 — RootProvider + Pretendard 폰트
│   │   ├── page.tsx                # / → redirect('/dashboard')
│   │   └── globals.css             # Tailwind v4 @theme, admin 토큰 전체 정의
│   │
│   ├── components/
│   │   ├── ui/                     # Radix 기반 원자 컴포넌트 (admin 토큰 커스텀)
│   │   │   ├── button.tsx          # variants: default/destructive/outline/secondary/ghost/link/navy/icon-action
│   │   │   ├── input.tsx           # error prop 포함, admin 토큰 스타일
│   │   │   ├── label.tsx           # required(asterisk), subText prop 포함
│   │   │   ├── select.tsx          # SelectTrigger error prop, max-h 250px(5.5행)
│   │   │   ├── checkbox.tsx        # Radix Checkbox
│   │   │   ├── badge.tsx           # variants: default/secondary/outline/success
│   │   │   ├── card.tsx            # Card/CardHeader/CardContent/CardTitle/CardDescription
│   │   │   ├── dialog.tsx          # Radix Dialog
│   │   │   ├── alert-dialog.tsx    # AlertProvider에서 사용
│   │   │   ├── dropdown-menu.tsx   # Radix DropdownMenu
│   │   │   ├── form.tsx            # RHF + Radix Label 연동
│   │   │   ├── textarea.tsx        # Radix Textarea
│   │   │   ├── separator.tsx       # Radix Separator
│   │   │   ├── table.tsx           # HTML table 스타일 래퍼
│   │   │   ├── icon.tsx            # SVG 아이콘 레지스트리 — Icons.* 로 참조
│   │   │   └── icons/
│   │   │       └── sort-icon.tsx   # 테이블 헤더 정렬 아이콘
│   │   │
│   │   ├── shared/                 # admin 도메인 복합 컴포넌트
│   │   │   ├── side-bar.tsx        # (레거시 파일, SideMenu로 교체됨)
│   │   │   ├── header.tsx          # 상단 헤더 — 햄버거 + 사용자 드롭다운
│   │   │   ├── bread-crumb.tsx     # pathname 기반 자동 브레드크럼
│   │   │   ├── data-table.tsx      # TanStack Table + 페이지네이션
│   │   │   ├── Pagination.tsx      # DataTable 하단 페이지네이션
│   │   │   ├── detail-panel.tsx    # key-value 상세 패널 (DetailPanel + DetailItem)
│   │   │   ├── loading.tsx         # 로딩 스피너
│   │   │   ├── no-data.tsx         # 빈 상태 표시
│   │   │   ├── editor/             # 공통 Tiptap editor
│   │   │   │   ├── index.tsx       # editor entry component
│   │   │   │   ├── toolbar.tsx     # editor toolbar
│   │   │   │   ├── upload-image.tsx
│   │   │   │   └── editor.css
│   │   │   ├── form-fields/        # RHF 연동 폼 필드 래퍼
│   │   │   │   └── index.tsx       # FormFields(enum) + FormInput 재내보내기
│   │   │   ├── FormInput.tsx       # 독립형 인풋 — label/error/helperText/count 통합
│   │   │   ├── PasswordInput.tsx   # Eye/EyeOff 토글 인풋
│   │   │   ├── ValidationInput.tsx # CheckCircle/XCircle suffix 인풋
│   │   │   ├── MultiSelectDropdown.tsx  # single/multi/searchable/all sort
│   │   │   ├── FileAttachmentInput.tsx  # 파일 첨부 인풋
│   │   │   ├── ImageUploadBox.tsx  # 200×200 이미지 업로드 박스
│   │   │   ├── DateTimeInput.tsx   # date/time/datetime/period 6가지 mode
│   │   │   ├── PeriodFilter.tsx    # 대시보드 차트 기간 필터
│   │   │   └── PeriodPicker.tsx    # 대시보드 기간 선택 인풋
│   │   │
│   │   ├── side-menu/              # 사이드바 메뉴 구성 컴포넌트
│   │   │   ├── SideMenu.tsx        # 사이드바 쉘 — 로고, 메뉴 목록, 접기 버튼
│   │   │   ├── MenuGroup.tsx       # 2-depth 아코디언 그룹
│   │   │   └── SideMenuItem.tsx    # CVA 기반 단일 메뉴 아이템 (sort: first/second/third)
│   │   │
│   │   ├── table-columns/          # feature별 TanStack Table ColumnDef
│   │   │   └── user/index.tsx      # 사용자 목록 칼럼 정의
│   │   │
│   │   └── views/                  # 페이지 뷰 컴포넌트 (page.tsx에서 import)
│   │       ├── dashboard/index.tsx
│   │       ├── sign-in/index.tsx
│   │       └── user/
│   │           ├── index.tsx       # 사용자 목록
│   │           └── crud.tsx        # 사용자 생성/수정 통합 폼
│   │
│   ├── constants/
│   │   ├── routes.ts               # ROUTES(1-depth) + MENU(2-depth 트리, SVG 아이콘 쌍)
│   │   ├── queryKeys.ts            # TanStack Query 캐시 키 상수
│   │   └── tokens.ts               # 쿠키 키 상수 (ACCESS_TOKEN / REFRESH_TOKEN / ROLE)
│   │
│   ├── hook/                       # TanStack Query 훅 (feature별 서브폴더)
│   │   ├── usePagination.ts        # URL searchParam 기반 페이지네이션
│   │   └── user/                   # 사용자 CRUD 5개 훅
│   │       ├── useGetUserList.ts
│   │       ├── useGetUserDetail.ts
│   │       ├── usePostUser.ts
│   │       ├── useUpdateUser.ts
│   │       └── useDeleteUser.ts
│   │
│   ├── lib/
│   │   └── utils.ts                # cn() — clsx + tailwind-merge
│   │
│   ├── middleware.ts               # 인증 가드 — 현재 주석 처리 상태
│   │
│   ├── providers/
│   │   ├── root-provider.tsx       # QueryProvider + AlertProvider + Suspense 조합
│   │   ├── query-provider.tsx      # QueryClient(stale 60s, gcTime 5분, retry 1)
│   │   └── alert-provider.tsx      # Promise 기반 전역 confirm 다이얼로그
│   │
│   ├── stores/
│   │   └── sidebar-store.ts        # Zustand: isOpen + openGroups 배열
│   │
│   ├── types/
│   │   └── type.d.ts               # 전역 타입 선언 (IResponsePaged, ErrorData, SVG 모듈)
│   │
│   └── utils/
│       ├── fetch.ts                # agent() — 공통 fetch 래퍼
│       └── validations.ts          # Zod 스키마 모음 (loginSchema, userSchema)
│
├── AI_CONTEXT/                     # AI 에이전트용 컨텍스트 문서
├── .storybook/                     # Storybook 설정 (nextjs-vite, SVGR 플러그인)
├── CLAUDE.md                       # Claude Code 행동 지침
├── AGENTS.md                       # AI 에이전트 공통 행동 지침
└── next.config.mjs                 # SVG → React 컴포넌트 변환 (replaceAttrValues)
```

---

## 미구현 라우트 (routes.ts에는 정의됨)

아래 경로는 `MENU` 배열에 정의되어 사이드바에 표시되지만 `page.tsx`가 없다.

| path | 메뉴 그룹 | 하위 메뉴 |
|---|---|---|
| /members | 회원 관리 | /members, /members/withdrawal |
| /about | 회사 소개 관리 | /about/history, /about/map |
| /support | 고객센터 관리 | /support/faq, /support/notices, /support/inquiries |
| /terms | 약관 관리 | /terms/usage, /terms/privacy |
| /admins | 관리자 관리 | /admins/accounts, /admins/roles |

# React 15 → React 19 총정리

React는 단순 UI 라이브러리로 시작했지만,  
React 15 → 16 → 18 → 19에 걸쳐 **렌더링 엔진 자체가 완전히 재구성되는** 극적인 변화를 겪었습니다.

이 글은 **4가지 관점**을 모두 아우르는 React 종합 정리입니다.

1. **버전별 핵심 변화(Next.js 버전 정리 스타일)**
2. **기술 중심(Fiber, Hooks, Concurrent Rendering, RSC, Compiler)**
3. **역사 흐름(React 15 → 19)**
4. **실무 위주 요약 + 예시 코드**

---

# 1. React 15 → 19 버전별 핵심 변화 정리

React는 단순히 API가 늘어난 것이 아니라,  
**리렌더링 엔진 → 상태 관리 모델 → 렌더링 방식 → 서버·클라이언트 구조 → 컴파일러**  
까지 전부 진화했습니다.

아래는 버전별 주요 변화입니다.

---

## React 15 — “Old Stack Reconciler” 시대의 끝

React 15까지는:

- 재조정(Reconciliation)이 **동기(blocking)**
- 렌더링 중 UI가 멈출 수 있음
- 거대한 컴포넌트 트리에서 렌더링이 오래 걸리면 브라우저가 “멈춘 것처럼” 보임

이 한계 때문에 **React 팀은 새로운 엔진을 내부적으로 설계 중**이었습니다.

---

## React 16 — Fiber 아키텍처의 탄생 (대격변)

React 역사에서 가장 중요한 버전.

### 핵심 변화
- **Fiber Rendering Engine 도입 (React 16 내부 전체 재작성)**
- 렌더링이 "작은 작업 단위로 쪼개져" → 중단 가능 / 재개 가능
- 에러 바운더리 등장
- Portal, Fragment 등 UI 편의 기능 추가

### 예시: 에러 바운더리
    class ErrorBoundary extends React.Component {
      state = { hasError: false };

      componentDidCatch(error, info) {
        this.setState({ hasError: true });
      }

      render() {
        if (this.state.hasError) return <h1>Error!</h1>;
        return this.props.children;
      }
    }

### 실무 포인트
- Fiber의 도입으로 이후 등장하는 **Concurrent Rendering**, **Suspense**, **Transition**의 기초가 완성됨.

---

## React 16.8 — Hooks의 등장 (현대 React의 시작)

### 핵심 변화
- useState
- useEffect
- useRef
- useMemo / useCallback
- 커스텀 훅  
  = **클래스 시대의 종료**

### 예시: useState / useEffect
    function Counter() {
      const [count, setCount] = useState(0);

      useEffect(() => {
        console.log("Render!");
      }, [count]);

      return (
        <button onClick={() => setCount(count + 1)}>
          {count}
        </button>
      );
    }

### 실무 포인트
- 모든 UI 상태 관리 패턴이 Hooks 중심으로 개편
- 전역 상태 라이브러리들(recoil, jotai 등)도 Hooks 기반으로 재탄생

---

## React 17 — “무난한 연결 버전”, 내부 안정화

React 17은 **대규모 변화 없음**이 오히려 특징.

- 대규모 마이그레이션 시 “점진적 업그레이드” 가능하도록 구조 변경
- 이벤트 시스템 개선(버블링 root 변경)

→ React 18을 위한 준비 버전

---

## React 18 — 동시성(Concurrency) 시대의 공식 개막

### 핵심 변화
- **자동 배칭 (Automatic Batching)**
- **useTransition**
- **useDeferredValue**
- **Concurrent Rendering**
- **Suspense for Data Fetching (기초)**

### 예시: 자동 배칭
과거:
setCount(x + 1);
setValue("abc");
// 렌더 2번 발생

React18:
setCount(x + 1);
setValue("abc");
// 렌더 1번만 발생 (자동 배칭)

### 예시: useTransition
    const [isPending, startTransition] = useTransition();

    startTransition(() => {
      setSearch(value);
    });

### 실무 포인트
- 렌더링 중단/재개 가능 → 대규모 UI도 부드럽게 동작
- 검색, 필터링 같은 무거운 작업에 Transition이 필수 기능이 됨
- Next.js 13 App Router 기반에서 React18 기능이 본격적으로 활용됨

---

## React 19 — “Server-first + Compiler” 시대 확립 (2024~2025)

### 핵심 변화
- React **Compiler(자동 최적화)** 등장  
  → useCallback/useMemo 대부분 불필요
- **Actions API** (폼 + 서버 변환)
- **`use()`** API 정식화 (Promise 직접 await 가능)
- Server Components(Next.js) 정식 안정화와 완전한 연동

### 예시: use()로 Promise 직접 처리
    const data = use(fetch("/api/data").then(res => res.json()));

### 예시: React Compiler 이후
과거:
const onClick = useCallback(() => doSomething(), []);

React19 + Compiler:
const onClick = () => doSomething(); // 최적화 자동 처리됨

### 실무 포인트
- “최적화 코드를 위한 코드”가 필요 없는 시대
- Server Components + Actions로 **클라이언트 복잡도 급감**
- Next.js 15~16과 아주 강한 시너지를 냄

---

# 2. 기술 중심 흐름 정리 (버전 무관 핵심 기술)

React 발전의 핵심 기술 요소를 버전 구분 없이 기술 중심으로 정리해봅니다.

---

## Fiber Architecture (React16)

- 렌더링 작업을 “쪼갤 수 있는 단위”로 재설계  
  → 브라우저를 멈추지 않는 자연스러운 렌더링 가능  
  → Concurrent Mode의 기반

---

## Hooks (React16.8)

클래스 단점을 해결:
- 복잡한 상태 공유 → 커스텀 훅으로 분리
- this 문맥 문제 제거
- 재사용성 증가
- 렌더링되며 상태 유지 가능

---

## Concurrent Rendering (React18)

사용자 입력에 즉시 반응하고,  
무거운 UI 업데이트는 “중단해서 뒤로 미룸”.

- Transition
- Suspense
- 자동 배칭  
  → UX 품질이 대폭 상승

---

## Suspense, Lazy Loading

- 로딩 UI를 선언형으로 작성
- Router / Image / Streaming 등에 활용

예시:
<Suspense fallback={<Spinner />}>
<UserProfile />
</Suspense>

---

## 🟦 Server Components (React18~19)

RSC는 완전히 새로운 개념:

- 렌더링이 서버에서 실행
- 클라이언트 JS 번들 감소
- 데이터 패칭이 서버에서 자연스럽게 처리됨

Next.js App Router가 본격적으로 사용

---

## React Compiler (React19)

이전까지의 성능 최적화 방식은:

- useMemo
- useCallback
- memo()
- 렌더링 비용 계산

이제는 필요 없음.  
컴파일 단계에서 자동 최적화.

---

# 3. React 15 → 19 전체 역사 흐름 요약

React의 발전을 “하나의 서사”로 정리하면 아래와 같습니다.

1. **React 15 — UI 라이브러리 시절**  
   blocking 렌더링 + 클래스 컴포넌트 중심

2. **React 16 — 엔진 교체(Fiber)**  
   내부 완전 갈아엎고 동시성 기초 제공

3. **React 16.8 — 현대 React의 시작(Hooks)**  
   상태 관리와 UI 구조의 혁신

4. **React 17 — 준비 작업**  
   React18을 위한 연결 버전

5. **React 18 — 동시성 렌더링**  
   자동 배칭, Transition, Suspense 강화, 데이터 패칭 패러다임 변화

6. **React 19 — 서버 + 컴파일러 중심 시대**  
   use(), Actions, Compiler → React가 내부적으로 훨씬 똑똑해짐

정리하면:

> React의 역사는  
> “UI 로직 단순화 → 렌더링 최적화 → 서버 중심 아키텍처 → 자동 최적화 시대”  
> 로 발전해 왔습니다.

---

# 4. 실무 위주 요약 + 코드 예시

## “지금 당장 알아야 할 핵심만” 요약

### 1) React18 → 19 시대의 실무 핵심
- 최적화 코드를 줄이고 “비즈니스 로직에 집중” 가능
- Server Components가 실제 서비스에서 채택 증가
- 클라이언트 JS 최소화가 SEO와 성능의 핵심

---

## 최적화 패턴 2025 버전

과거:
useCallback(() => {...}, [])

2025 현재:
const f = () => {...}; // React Compiler가 최적화

---

## 데이터 패칭 패턴 변화

과거(React17):
```
useEffect(() => {
fetch().then(setData);
}, []);
```

React18:
```
const data = use(fetchPromise);
```

React19 + Next.js App Router:
```
// Server Component
const data = await getData();
```
→ 클라이언트 훅 기반 패칭은 점점 줄어듦

---

## 폼 전송 방식 변화

과거:
onSubmit → axios → 상태 업데이트

React19:
```
<form action={addTodo}> ... </form>
```

→ React Server Actions로 간결해짐

---

# 결론: React의 미래는?

React는 이제 단순한 “UI를 만드는 라이브러리” 단계를 넘어  
**서버 중심(Server-first) + 컴파일 기반(Compiler-first)** 으로 이동했습니다.

- Fiber → Concurrent → Suspense → RSC → Compiler  
  이 흐름은 React 팀이 **10년**에 걸쳐 설계한 방향이며,  
  React19를 기점으로 완성도 높은 생태계가 만들어졌습니다.

앞으로의 React 개발자는:

- 불필요한 최적화 코드를 덜고
- 클라이언트 JS를 줄이고
- 서버의 힘을 활용한 RSC 기반 구조
- 자동 최적화된 컴파일러 기반 렌더링

에 집중하는 것이 핵심이 될 것입니다.

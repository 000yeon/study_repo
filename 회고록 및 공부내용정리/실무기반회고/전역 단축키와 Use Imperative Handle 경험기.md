# 전역 단축키 구현을 위해 useImperativeHandle을 쓰게 된 이유

이번에 백오피스 응용프로그램을 웹 관리자 페이지로 리뉴얼 하는 과정에서 전역 단축키(F1: 신규, F2: 저장 …) 요구사항이 있었다.
나는 레이어 위에 데이터 리스트 테이블 + 사이드 상세 패널 구조의 화면을 만들던 중 이 요구를 받았고, 그 과정에서 평소라면 피했을 useImperativeHandle을 실제로 사용하게 됐다.
왜 이런 선택을 하게 됐는지, 그리고 어디까지는 괜찮고 어디서부터는 위험하다고 느꼈는지를 정리한 개인적인 경험 공유를 작성하려한다.

---

## 문제의 시작: 단축키는 항상 화면 거의 최상단에 존재한다.

구조는 단순했다.

- 좌측: 유저 목록 테이블
- 우측: 선택된 유저의 상세 / 수정 / 생성 폼
- 화면 전체에 useFunctionKeys로 단축키를 바인딩

문제는 저장(F2) 이었다.

- 단축키는 최상위 신규, 저장, 출력 등의 UI 를 모두 포함한 UserListView 에서 처리해야 함

- 실제 저장 로직은 하위 컴포넌트(CrudUserView)의 form submit

즉,
> 부모는 저장하라는 의도만 알고 자식은 어떻게 저장하는지를 알고 있는 상황

---

## 자연스럽게 막힌 선택지들

#### 1. 저장 로직을 부모로 끌어올릴까?

- form state, validation, react-hook-form 전부 상위로 이동

- 컴포넌트 책임이 무너짐

#### 2. 전역 상태(Zustand, Context)로 submit 트리거?

- 단순 submit에 비해 과도한 복잡도
 
- 디버깅 난이도 증가

#### 3.이벤트 버스?

- React 철학과 거리감

여기까지 고민하고 나니, 남은 선택지는 하나였다.

---

## 결국 선택한 방법: useImperativeHandle

부모가 자식에게 "지금 submit 해" 라고 명령할 수 있도록, 최소한의 imperative API만 열어주기로 했다.

```
export type CrudUserViewRef = {
  submit: () => void;
};

useImperativeHandle(ref, () => ({
  submit: () => form.handleSubmit(onSubmit)(),
}));
```

부모에서는 이렇게 사용한다.

```
const crudRef = useRef<CrudUserViewRef>(null);

const handleSave = () => {
  crudRef.current?.submit();
};
```
핵심은 이거였다.

- 부모는 구현을 모른다

- 부모는 의도만 전달한다 (submit)

- 자식은 여전히 form과 로직의 주인이다

---

## 사용 후, 이 방법이 괜찮다고 느낀 이유

내 기준에서 이 사용은 충분히 합리적이었다.

- 단방향 데이터 흐름은 유지됨

- imperative API가 아주 작다

- 단축키라는 UI 외부 트리거에 잘 맞음

### ***중요한 건 useImperativeHandle을 막 쓰지 않는 것이다.***

---

## 그래서 내가 정한 useImperativeHandle 사용 기준

이후 비슷한 상황에서 아래 기준을 잡았다.

### 써도 되는 경우

- 전역 단축키
- 외부 버튼이 내부 form을 트리거해야 할 때
- focus / scroll / submit 같은 행위 명령

### 피해야 하는 경우

- 비즈니스 로직 호출
- 상태 조회 / 조작
- 여러 메서드를 무분별하게 노출

> useImperativeHandle은 명령 버튼 하나 정도까지만 허용

---

## 마치며

useImperativeHandle은 흔히 "안티패턴" 이라고 불리지만,

상황이 명확하고 API를 절제해서 의도 전달용으로만 쓴다면

충분히 좋은 선택지가 될 수 있다고 느꼈다.

특히 전역 단축키 + 폼 UI 조합에서는 꽤 현실적인 해법인 것 같다.

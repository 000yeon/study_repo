# React Hook Form에서 form 외부 버튼으로 submit 처리하는 방법 정리

### 실무에서 페이지 하단 고정 버튼, Footer 영역 버튼, 레이아웃 분리 구조를 사용하다 보면 form 태그 밖에 submit 버튼을 두어야 하는 상황이 자주 발생합니다.

### React Hook Form을 기준으로, form 외부 버튼에서 안전하고 권장되는 방식으로 form submit을 처리하는 방법을 정리합니다.

⸻

## 문제 상황

아래와 같은 구조를 자주 보게 됩니다.

- 상단: 입력 폼 영역 (< form > 내부)
- 하단: 고정 버튼 영역 (레이아웃상 < form > 외부)

```
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 입력 필드들 */}
      </form>
    </Form>

    {/* 하단 고정 버튼 */}
    <Button>저장</Button>
```

이때 자연스럽게 드는 질문은 다음과 같습니다.

- form 밖에 있는 버튼으로 form 데이터를 어떻게 submit 하지?

--- 

### 잘못된 접근 방식들

1. onSubmit 함수를 직접 호출
```
    <Button onClick={() => onSubmit(form.getValues())}>저장</Button>
```
#### 문제점
- Zod / Yup validation이 실행되지 않음 
- formState (isValid, errors) 무시됨 
- React Hook Form의 핵심 흐름을 깨뜨림

> 절대 권장되지 않는 방식입니다.

⸻

2. form DOM을 직접 submit
```
<Button onClick={() => document.querySelector('form')?.submit()}>
```
#### 문제점
- React Hook Form의 handleSubmit을 거치지 않음 
- validation / resolver 동작하지 않음 
- React 방식이 아님

--- 

## 권장 방식

> form.handleSubmit을 외부 버튼에서 직접 호출

React Hook Form은 submit 로직을 함수로 분리해서 사용할 수 있도록 설계되어 있습니다.
```
<Button
    onClick={() => {
    form.handleSubmit(onSubmit)();
    }}
>
저장
</Button>
```

#### 왜 이 방식이 좋은가?
- resolver (Zod, Yup 등) 정상 실행 
- validation 통과 시에만 onSubmit 호출 
- formState.errors 정상 처리 
- submit 흐름이 일관됨

--- 

### 실제 코드 예제

아래는 실무에서 자주 사용하는 구조입니다.
```
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* 입력 필드 영역 */}
  </form>
</Form>

{/* form 외부 버튼 영역 */}
{pageMode !== 'view' && (
<Button
variant="default"
size="md"
onClick={() => {
form.handleSubmit(onSubmit)();
}}
>
    저장
  </Button>
)}
```

- form 내부 submit
- 외부 버튼 submit

동일한 submit 로직 공유

--- 

🔍 추가 팁

1. Enter 키 submit도 유지 가능
```
<form onSubmit={form.handleSubmit(onSubmit)}>
```

- 입력 중 Enter 키 → submit 정상 동작 
- 버튼 클릭 → 동일한 submit 로직

---

2. View / Edit 모드 분기에도 유용
```
{pageMode !== 'view' && (
<Button onClick={() => form.handleSubmit(onSubmit)()}>
저장
</Button>
)}
```

- 보기 화면에서는 버튼 숨김 / 등록 화면에서만 submit

---

3. confirm, alert와 조합 가능
```
const onClickSave = () => {
    alert.confirm('저장하시겠습니까?', () => {
        form.handleSubmit(onSubmit)();
    });
};
```

---

### 자주 묻는 질문

Q. type="submit" 버튼을 못 쓰는 이유는?
- type="submit"은 반드시 form 내부에 있어야만 동작
- 레이아웃 구조상 불가능한 경우가 많음 (Footer, Fixed 영역)

---

Q. useRef로 form을 submit하면 안 되나요?
- 가능은 하지만 비권장
- React Hook Form의 설계 의도를 벗어남

---

### 정리

| 상황 |	권장 | 방법 |
|---|---|---|
|form | 내부 버튼 |	type="submit"
|form |외부 버튼 |	form.handleSubmit(onSubmit)()
|validation | 필요 |	반드시 handleSubmit 사용


---

React Hook Form에서 form 외부 버튼으로 submit 해야 한다면

> form.handleSubmit(onSubmit)()을 호출하자.

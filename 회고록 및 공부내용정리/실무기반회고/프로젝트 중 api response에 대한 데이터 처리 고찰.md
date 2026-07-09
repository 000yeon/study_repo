# 프로젝트 중 Api Response에 대한 데이터 처리 고찰

### 계기

Api Response를 받다보면 interface로 모든 응답을 처리해도 컴포넌트를 사용하는 부분에서 데이터가 간혹 누락되거나 interface에서 막아두기 애매한 데이터의 경우 조건문을 걸어서 렌더링 해주는 처리를 할 수 밖에 없는데 아래의 코드 예시를 보면

```
{reportDetail?.report.reportImageList.map((image, index) => (
<Image
  key={index}
  src={getSafeImageUrl(image.link)}
  alt={image.originalName}
  width={100}
  height={100}
    className="object-cover"
  />
))}
```

이러한 코드의 경우 reportImageList가 빈배열로 내려오면 image가 없으므로 image.link 같은 곳에서 에러가 나고 화면이 망가지게 된다.
이럴때 타입 가드 + 안전한 배열 반환을 해주는 유틸을 만들어 사용하면 좋을 것 같다고 생각하였다.

```
export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}
```

이런 식으로 사용하면 reportImageList가 null이거나 undefined면 빈 배열을 리턴받아 사용할 수 있지만 여전히 image안의 데이터를 정확하게 방어해주지 못하므로 image.link에서 똑같은 에러가 터진다.

그래서 조건부 필터까지 포함하고, null / undefined까지 걸러내는걸 적용하면 아래와 같다.

```
export function safeArray<T>(value: (T | null | undefined)[] | null | undefined): T[] {
  return Array.isArray(value) ? value.filter(Boolean) as T[] : [];
}
```
이렇게 하면 null/undefined 값도 자동으로 제거돼서, image && (...) 체크도 필요 없어진다.

그러면 최초 코드도

```
{safeArray(reportDetail?.report?.reportImageList).map((image, index) => (
  <Image
    key={index}
    src={getSafeImageUrl(image.link)}
    alt={image.originalName}
    width={100}
    height={100}
    className="object-cover"
  />
))}
```

- undefined / null / 빈 배열 → [] 반환
- 내부 요소가 null/undefined → 자동 필터링
- 유효한 값만 map 실행

이렇게 3가지 기능을 수행하도록 수정할 수 있다.

앞으로 조건부 렌더링이 필요할때 이러한 처리를 하는 공통 유틸함수를 통해 유효성 검사를 간단히 진행하여 오류를 사전에 막는데에 도움이 될 것 같다.
# Context & Provider
Context는 전역 상태를 저장하는 곳이다. Context 내부에 Provider와 Consumer가 정의되어있고, Consumer는 Context를 통해서 상태에 접근이 가능하다. Provider는 전역 상태를 제공하는 역할을 한다



## React Provider의 정의
### React Provider는 Context API의 구성 요소 중 하나로, 특정 데이터를 React 컴포넌트 트리 전체에 전달할 수 있게 해주는 역할을 합니다.

이때 데이터를 "전달"한다고 해서 props를 계속 아래로 넘기는 방식은 아니며, 트리의 깊은 곳에 있는 컴포넌트도 직접적으로 데이터에 접근할 수 있게 됩니다.


## 1. Context의 동작 원리

#### 1. Context 생성

```
import React from 'react';

const ThemeContext = React.createContext('light');
```
- createContext 를 호출 하면 provider 와 consumer가 포함된 객체 생성

#### 2. Provider로 값 전달

```
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>
```

- value에 설정한 값("dark")은 하위 컴포넌트에서 사용할 수 있게 됩니다.
- provider로 감싼 컴포넌트의 자손 컴포넌트들은 ThemeContext에 접근할 수 있습니다.


#### 3.  Consumer 또는 useContext로 값 사용

```
import { useContext } from 'react';

const MyComponent = () => {
  const theme = useContext(ThemeContext);
  return <div>현재 테마: {theme}</div>;
};
```

- useContext(ThemeContext)를 통해 현재 Context의 값을 가져올 수 있습니다.



## 2. Context의 동작 위치

- `Context.Provider`는 **React 컴포넌트 트리 안에서 동작**
- 하위 컴포넌트는 `useContext()` 또는 `Consumer`를 통해 값에 접근
- 실제 동작은 **React의 Virtual DOM 트리 구조에서** 처리됨

> 값은 DOM이 아니라 **React 렌더 구조 내부에서 흐름을 따름**


## 3. 메모리 구조와 위치

| 구분 | 설명 |
|------|------|
| 저장 위치 | `Provider` 컴포넌트의 메모리 공간 |
| 작동 방식 | React가 내부적으로 트리를 따라 전달 |
| 전역 여부 | 진짜 전역 변수는 아니며, 구조상 전역처럼 작동함 |

- `React.createContext()`로 만든 객체는 단순한 구조체
- `value`는 `Provider` 컴포넌트가 렌더링될 때 전달됨
- 하위 컴포넌트에서 `useContext()`로 접근하면, 가장 가까운 `Provider`의 값을 찾아옴

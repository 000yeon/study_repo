# Virtual DOM이란?
#### Virtual DOM(VDOM)은 실제 DOM을 직접 조작하는 대신, 가상의 DOM을 메모리에 유지하고 이를 기반으로 변경 사항을 최소화하여 실제 DOM에 적용하는 개념.

- ️목적: 성능 최적화
- 작동 방식: 변경 사항을 비교하고, 꼭 필요한 부분만 실제 DOM에 업데이트


# Virtual DOM의 동작 원리
### 1. UI를 JavaScript 객체(VDOM)로 표현

React나 Vue는 컴포넌트의 구조를 JavaScript 객체로 변환하여 Virtual DOM을 만듦.
### 2. 상태(State) 변경 감지 후 새로운 Virtual DOM 생성

사용자의 입력, 데이터 변경 등으로 컴포넌트의 상태(State)가 변경되면 새로운 Virtual DOM을 생성.

### 3. 새로운 Virtual DOM과 기존 Virtual DOM을 비교 (Diffing)

React는 Reconciliation(재조정) 알고리즘을 사용하여 변경된 부분만 찾아냄.
Vue는 반응형 시스템을 사용하여 변경된 부분만 업데이트.

### 4. 최소한의 변경 사항을 실제 DOM에 적용 (DOM Patch)

변경된 부분만 실제 DOM에 적용하여 불필요한 연산을 줄임.


## Virtual DOM의 핵심 개념
### 1. Diffing 알고리즘 (변경 감지)
React는 **빠른 변경 감지를 위해 "Keyed Diffing"**을 사용함.
같은 타입의 요소면 속성만 변경.
리스트의 경우, key 값이 동일하면 재사용하고, 다르면 새로 생성.

### 2. Reconciliation (재조정)
새로운 VDOM과 기존 VDOM을 비교하여 최소한의 DOM 업데이트 수행.
전체 DOM을 다시 그리지 않고 변경된 요소만 업데이트.

### 3. Batching (배치 업데이트)
React는 여러 상태 업데이트를 한 번에 모아서 처리하여 불필요한 렌더링을 방지.
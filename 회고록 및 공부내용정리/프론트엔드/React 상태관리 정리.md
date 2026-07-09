# React 상태 관리 라이브러리 비교: Redux, Recoil, MobX, Zustand, Jotai
React에서 상태 관리(State Management)는 중요한 개념이며, 여러 라이브러리가 존재합니다.
각 라이브러리는 설계 철학과 사용 방법이 다르므로, 프로젝트에 맞는 선택이 필요합니다.

## 1. Redux (전통적인 상태 관리)

- 사용 방식: Flux 아키텍처 기반 (Reducer, Action, Store) 
- 주로 대규모 애플리케이션에서 사용됨 
- 가장 널리 사용되는 상태 관리 라이브러리지만, 코드가 길어질 수 있음

✅ 특징

전역 상태 관리: store를 통해 애플리케이션의 전역 상태를 관리

Immutable (불변성 보장): 상태를 직접 변경하지 않고, Reducer를 통해 새 상태를 생성

미들웨어 지원: redux-thunk, redux-saga를 활용해 비동기 작업 처리

Redux Toolkit 지원: Boilerplate(반복되는 코드)를 줄이고 사용성을 향상

✅ 코드 예제
```
// Redux Store 설정 (Redux Toolkit 사용)
import { configureStore, createSlice } from '@reduxjs/toolkit';
    
    const counterSlice = createSlice({
        name: 'counter',
        initialState: { value: 0 },
        reducers: {
        increment: (state) => { state.value += 1; },
        decrement: (state) => { state.value -= 1; },
        }
    });
    
export const { increment, decrement } = counterSlice.actions;
export const store = configureStore({ reducer: counterSlice.reducer });
    
// 사용 예제 (React Component)
import { useDispatch, useSelector } from "react-redux";
    
    const Counter = () => {
    const count = useSelector((state) => state.value);
    const dispatch = useDispatch();
    
    return (
        <div>
        <p>Count: {count}</p>
        <button onClick={() => dispatch(increment())}>+1</button>
        <button onClick={() => dispatch(decrement())}>-1</button>
        </div>
    );
};

```

✅ 장점

- 강력한 상태 관리 및 예측 가능성
- Redux DevTools로 디버깅 용이
- 미들웨어(thunk, saga)를 활용한 비동기 처리 지원

❌ 단점

- 보일러플레이트 코드(반복적인 코드) 많음
- 상태 변경 과정이 복잡함

## 2. Recoil (React 친화적 상태 관리)

- 사용 방식: React와 자연스럽게 통합되는 상태 관리 
- Facebook이 개발했으며, useState와 유사한 API 제공

✅ 특징

Atom 단위의 상태 관리: Atom(전역 상태)과 Selector(파생 상태)를 사용

React Suspense 지원: 서버 상태와의 통합이 쉬움

Context API보다 간편한 글로벌 상태 관리

✅ 코드 예제

```
import { atom, useRecoilState } from "recoil";

// 전역 상태 생성
const counterState = atom({
    key: "counterState",
    default: 0,
    });
    
    const Counter = () => {
    const [count, setCount] = useRecoilState(counterState);
    
    return (
        <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(count - 1)}>-1</button>
        </div>
    );
};
```

✅ 장점

- React와의 높은 호환성
- Redux보다 간단한 API
- 비동기 상태 관리 (useRecoilValueLoadable) 지원

❌ 단점

- Redux만큼의 미들웨어 기능 부족
- Facebook 내부 프로젝트에서 사용되지만, 커뮤니티 규모가 상대적으로 작음

## 3. MobX (자동화된 반응형 상태 관리)
- 사용 방식: Observable(관찰 가능한 객체) 기반으로 상태 자동 감지
- 복잡한 상태 변경을 자동으로 관리

✅ 특징

자동 추적: 상태가 변경될 때 관련된 컴포넌트가 자동으로 업데이트됨

Proxy 기반: 성능이 뛰어나고 코드가 간결함

객체 지향적 사용 가능: 클래스 기반으로도 활용 가능

✅ 코드 예제

```
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// Store 생성
class CounterStore {
    count = 0;
    constructor() {
        makeAutoObservable(this);
    }
    increment() {
        this.count++;
    }
    decrement() {
        this.count--;
    }
}

const counterStore = new CounterStore();

// React Component
const Counter = observer(() => {
    return (
        <div>
        <p>Count: {counterStore.count}</p>
        <button onClick={() => counterStore.increment()}>+1</button>
        <button onClick={() => counterStore.decrement()}>-1</button>
        </div>
    );
});
```

✅ 장점
- 자동으로 상태 감지 → 코드가 간결
- 불변성을 강제하지 않음 → 기존 객체 수정 가능
- 성능 최적화 자동 처리

❌ 단점
- Redux보다 예측 가능성이 낮음
- 초보자에게 익숙하지 않은 패턴

## 4. Zustand (가벼운 상태 관리)
- 사용 방식: useState를 전역 상태처럼 사용
- Redux보다 가볍고 간결한 API 제공

✅ 특징

Boilerplate가 거의 없음: Redux 대비 코드가 매우 간결

다양한 패턴 지원: Flux 패턴과 유사한 구조 가능

React의 Context API를 사용하지 않음 (퍼포먼스 최적화)

✅ 코드 예제

```
import create from "zustand";

// Zustand 스토어 생성
const useCounterStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
}));

const Counter = () => {
const { count, increment, decrement } = useCounterStore();

return (
    <div>
        <p>Count: {count}</p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
    </div>
    );
};
```

✅ 장점
- Redux보다 코드가 간결
- React와 자연스럽게 통합
- Context API 없이도 글로벌 상태 관리 가능

❌ 단점
- 큰 프로젝트에서는 Redux보다 구조화가 어려울 수 있음

## 5. Jotai (Atomic 상태 관리)
- 사용 방식: Recoil과 유사하지만, 더 심플한 구조
- Zustand처럼 가볍고, Recoil의 Atom 방식을 활용

✅ 코드 예제
```
import { atom, useAtom } from "jotai";

const countAtom = atom(0);

const Counter = () => {
const [count, setCount] = useAtom(countAtom);

return (
    <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
    );
};
```

📌 결론: 어떤 상태 관리 라이브러리를 선택할까?

|라이브러리|추천상황|
|----|----|
|Redux|대규모 애플리케이션, 예측 가능성이 중요할 때|
|Recoil|React와 자연스럽게 통합하려 할 때|
|MobX|자동 상태 감지와 성능이 중요한 프로젝트|
|Zustand|간단한 상태 관리가 필요할 때|
|Jotai|Recoil과 유사한 방식이지만 더 가볍게 사용하고 싶을 때|
	 
	
	
	
	
	
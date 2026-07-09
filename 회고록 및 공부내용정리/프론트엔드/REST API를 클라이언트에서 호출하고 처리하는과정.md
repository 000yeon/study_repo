## REST API란?
REST API는 HTTP 요청을 통해 데이터를 주고받는 방식으로, 서버에서 데이터를 가져오거나 보내기 위해 사용됩니다.

- GET: 데이터 조회
- POST: 데이터 생성
- PUT / PATCH: 데이터 수정
- DELETE: 데이터 삭제

## 클라이언트에서 REST API 호출 과정

### Step 1: HTTP 요청 보내기
프론트엔드에서는 fetch API 또는 Axios 같은 라이브러리를 사용하여 API를 호출할 수 있습니다.

```javascript
fetch('https://api.example.com/users')
  .then(response => response.json())  // JSON 형식으로 변환
  .then(data => console.log(data))    // 데이터 출력
  .catch(error => console.error('Error:', error)); // 에러 처리
```
- fetch를 이용한 GET 요청
  - fetch()는 기본적으로 비동기 요청을 보냄.
  - response.json()을 호출하여 데이터를 JavaScript 객체로 변환.

### Step 2: API 요청 시 필요한 설정 (헤더, 토큰 등)
API 요청 시 헤더(Header) 설정이 필요한 경우가 많음.

예를 들어, Authorization 헤더에 JWT 토큰을 추가하는 경우:


```javascript
const token = "your-jwt-token";

fetch('https://api.example.com/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`, // 인증 토큰 추가
    'Content-Type': 'application/json'  // JSON 형식 설정
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Step 3: POST 요청 (데이터 전송)
서버에 데이터를 보낼 때는 POST 요청을 사용하며, body에 데이터를 포함시킴.

```javascript
const userData = {
  name: "John Doe",
  email: "john@example.com"
};

fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // JSON 데이터 전송 명시
  },
  body: JSON.stringify(userData) // 객체를 JSON 문자열로 변환
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));

```

### Step 4: API 응답 처리 및 UI 업데이트
API를 호출한 후, 응답 데이터를 받아 상태(State)를 업데이트하여 화면에 반영해야 함.
React에서는 useState와 useEffect를 활용 가능.

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://api.example.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}

```

- useEffect(): 컴포넌트가 렌더링될 때 API 호출 실행. 
- setUsers(response.data): API에서 받은 데이터를 users 상태로 저장 후 UI 업데이트.


## 에러 처리 및 예외 처리
API 호출 시 네트워크 문제나 서버 에러가 발생할 수 있으므로, 예외 처리가 필수적임.

```javascript
fetch('https://api.example.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));
```
- response.ok 확인 → HTTP 응답 상태가 200~299가 아니면 에러 처리.
- catch(error) 활용 → 네트워크 에러, 잘못된 응답 처리.


## REST API 요청 최적화
###  1.  Debouncing & Throttling
검색 입력 같은 API 요청이 많을 경우, Debounce(지연 요청) 또는 Throttle(주기적 요청 제한) 적용.

- Debounce
  - 과도한 요청, 처리를 수행하게 될 경우 발생할 수 있는 성능 저하를 막기 위해 이를 효과적으로 제어하여 성능을 개선하는 방법 중 하나이다.
- Throttle
  - 이 방법은 이벤트의 발생 빈도를 일정한 시간 간격으로 제한하여 과도한 이벤트 처리를 방지한다.
    
```
import { useState } from 'react';
import debounce from 'lodash/debounce';

const searchUsers = debounce(query => {
  axios.get(`https://api.example.com/users?q=${query}`)
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
}, 300);

function Search() {
  const [query, setQuery] = useState('');

  return <input type="text" onChange={e => searchUsers(e.target.value)} />;
    }

```

### 2. 캐싱 (React Query 활용)
API 요청을 캐싱하여 불필요한 요청을 줄일 수 있음.

```
import { useQuery } from 'react-query';
import axios from 'axios';

function useUsers() {
  return useQuery('users', () =>
    axios.get('https://api.example.com/users').then(res => res.data)
  );
}

function UserList() {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

```
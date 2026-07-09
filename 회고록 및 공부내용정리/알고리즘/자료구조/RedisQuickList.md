# Redis QuickList — 순서를 보장하는 메모리 효율적 연결 리스트

> Redis는 단순한 키-값 저장소가 아니라, 내부적으로 **고성능 자료구조 엔진**에 가깝습니다.  
> 그중에서도 `quicklist`는 **연결 리스트(Linked List)** 와 **압축 배열(ZipList)** 의 장점을 결합하여  
> **순서를 보장하면서도 메모리를 효율적으로 사용하는 구조**로 설계되었습니다.

---

## 1. QuickList란?

Redis의 `quicklist`는 **이중 연결 리스트(Doubly Linked List)** 와 **ZipList**(연속 메모리 블록)를 결합한 구조입니다.

> 쉽게 말해,  
> **“연결 리스트의 순서 보장”**과  
> **“배열의 메모리 효율”**을 동시에 잡은 하이브리드 구조입니다.

---

## 2. 등장 배경

Redis 3.2 이전에는 `list` 자료형이 단순한 `linkedlist`로 구현되어 있었습니다.  
이 구조는 순서 보장은 뛰어나지만, 각 노드마다 포인터를 별도로 관리해야 했기 때문에 **메모리 오버헤드가 큼**.

이를 해결하기 위해 Redis는 다음 목표로 quicklist를 도입했습니다:

- **메모리 효율 향상**: 노드를 압축 리스트(ziplist)로 묶어 관리
- **빠른 삽입/삭제**: 연결 리스트처럼 O(1) 시간
- **순서 보장**: head ↔ tail 양방향 순회 가능

---

## 3. 내부 구조

QuickList의 전체 구조를 단순화하면 다음과 같습니다:

```
QuickList
 ├── head → [ZipList1] ⇄ [ZipList2] ⇄ [ZipList3] ← tail
 └── 각 ZipList 안에는 다수의 value 요소가 연속 저장
```

각 요소는 다음과 같은 구조를 가집니다:

```
Node {
  prev: <이전 노드>,
  next: <다음 노드>,
  value: <ZipList (연속된 값들)>
}
```

즉, 하나의 QuickList 노드는 단일 값이 아니라 **“작은 배열 덩어리”**입니다.

---

## 4. QuickList 내부 알고리즘

| 구성 요소 | 자료구조 | 역할 |
|------------|------------|------|
| **노드 연결** | Doubly Linked List | 순서 유지 및 빠른 삽입/삭제 |
| **데이터 저장** | ZipList | 연속된 메모리 블록에 값 저장 (압축 가능) |
| **검색** | 순차 탐색 | 평균 O(N) |
| **삽입/삭제** | 노드 단위로 O(1) (ZipList 내부 삽입은 O(M)) |

> 결과적으로 QuickList는
> - 작은 데이터에서는 **메모리 절약**,
> - 큰 데이터에서는 **삽입/삭제 효율**을 얻는 구조입니다.

---

## 5. QuickList vs LinkedList vs Array

| 구분 | LinkedList    | Array | QuickList    |
|------|---------------|--------|--------------|
| **순서 보장** | O             | O | O             |
| **랜덤 접근** | X (O(N))      | O (O(1)) | X (O(N))     |
| **삽입/삭제** | O (O(1))      | X (O(N)) | O (O(1)~O(M)) |
| **메모리 효율** | 낮음 (포인터 오버헤드) | 높음 | 매우 높음 (압축)   |
| **Redis 적용 버전** | 2.x~3.0       | X | 3.2+         |

QuickList는 리스트를 “ZipList의 블록 체인”처럼 구성하여  
**linked list의 순서 보장**과 **ziplist의 compact한 저장**을 모두 활용합니다.

---

## 6. 예시: 내부 노드 연결 형태

```
[ZipList Node 1]
  ├── prev: null
  ├── next: → [ZipList Node 2]
  ├── values: [ "apple", "banana", "pear" ]

[ZipList Node 2]
  ├── prev: ← [ZipList Node 1]
  ├── next: → [ZipList Node 3]
  ├── values: [ "melon", "grape", "kiwi" ]
```

위와 같이 각 노드는 ziplist를 값으로 가지며,  
ziplist는 **연속된 메모리**에 여러 string 요소를 저장합니다.

---

## 7. Redis에서의 활용

Redis의 `List` 자료형(`LPUSH`, `RPUSH`, `LPOP`, `RPOP` 등)은 내부적으로 **QuickList**로 구현됩니다.

예시:

```bash
LPUSH fruits apple banana pear
RPUSH fruits mango grape
```

Redis 내부에서는 다음처럼 저장됩니다.

```
quicklist
 ├── [ziplist1] -> [apple, banana, pear]
 └── [ziplist2] -> [mango, grape]
```

삽입은 항상 tail 또는 head에 O(1)로 처리되며,  
메모리 사용량은 ziplist 덩어리 크기 단위로 효율적으로 관리됩니다.

---

## 8. QuickList의 장점 요약

| 장점 | 설명 |
|------|------|
| **순서 보장** | 연결 리스트 기반으로 head ↔ tail 순회 가능 |
| **빠른 삽입/삭제** | 노드 레벨에서 O(1) 처리 |
| **메모리 효율** | 각 노드를 ziplist로 묶어 포인터 오버헤드 최소화 |
| **압축 기능 지원** | Redis 설정(`list-compress-depth`)을 통해 일부 노드 압축 가능 |
| **구조적 단순성** | LinkedList와 ZipList 조합으로 유지보수가 쉬움 |

---

## 9. QuickList와 LinkedHashMap의 관계

앞서 설명한 다음 구조와 매우 유사합니다.

```js
obj = {
  prev: null,
  next: null,
  value: s
}
```

이는 전형적인 **이중 연결 리스트(Doubly Linked List)** 기반 구조이며,  
QuickList도 동일하게 `prev` / `next` 포인터를 통해 순서를 보장합니다.

다만 차이는 다음과 같습니다:

| 항목 | LinkedHashMap | Redis QuickList |
|------|----------------|------------------|
| **저장 단위** | Node(key, value) | Node(ziplist block) |
| **검색 속도** | Hash 기반 O(1) | 순차 접근 O(N) |
| **목적** | 순서 있는 Map | 메모리 효율적 List |
| **구조적 특징** | HashTable + LinkedList | ZipList + LinkedList |

즉, QuickList는 **LinkedHashMap의 “List 부분”만을 고도화한 형태**입니다.

---

## 10. 메모리 압축 관련 설정

Redis는 QuickList의 일부 노드를 압축하여 메모리를 절약할 수 있습니다.

```bash
# redis.conf 설정 예시
list-max-ziplist-size -2        # ziplist의 최대 크기
list-compress-depth 1            # head/tail을 제외한 노드 압축
```

이 설정을 통해 head와 tail 근처 노드는 비압축 상태로 유지하고,  
가운데 노드들은 압축해 RAM 사용량을 크게 줄일 수 있습니다.

---

## 11. 시간 복잡도 요약

| 연산 | 시간 복잡도 | 설명 |
|------|---------------|------|
| `LPUSH` / `RPUSH` | O(1) | head/tail에 삽입 |
| `LPOP` / `RPOP` | O(1) | head/tail에서 삭제 |
| `LINDEX` | O(N) | 인덱스 접근 (순차 탐색) |
| `LRANGE` | O(N) | 범위 조회 |
| `LSET` | O(N) | 특정 인덱스 값 수정 |

---

## 12. 정리

| 항목 | 내용 |
|------|------|
| **자료구조 이름** | QuickList |
| **내부 구성** | Doubly Linked List + ZipList |
| **목적** | 순서를 유지하면서 메모리 효율 극대화 |
| **특징** | head/tail 기반 접근, 압축 가능 |
| **사용 위치** | Redis `LIST` 자료형 |
| **시간 복잡도** | 삽입/삭제 O(1), 검색 O(N) |
| **도입 버전** | Redis 3.2 |

---

## 마무리

QuickList는 Redis가 “단순한 리스트”를 “고성능 메모리 엔진 수준”으로 발전시킨 결과물입니다.  
이는 곧 **순서를 보장하면서도 압축 효율을 극대화한 자료구조**이며,  
LinkedHashMap의 **순서 보장 로직**과 유사한 개념으로 이해할 수 있습니다.

> 즉,  
> QuickList = Doubly Linked List + ZipList  
> ⟶ **순서를 유지하면서 메모리를 아끼는 Redis만의 최적화 리스트**

---
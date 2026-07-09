# Redis의 순서를 보장하는 Map 구조 — Stream 완벽 정리

> Redis는 단순한 Key-Value 저장소를 넘어, **데이터의 순서와 구조를 함께 보장하는 고성능 인메모리 엔진**입니다.  
> 그중에서도 **Stream**은 head와 tail 개념을 가지고 **데이터의 순서를 유지하면서 Map 형식으로 저장**할 수 있는 강력한 자료구조입니다.

---

## 1. Stream이란?

Redis의 **Stream**은 **Kafka의 Topic**과 유사한 구조를 가진,  
**순서를 보장하는 Map 형태의 데이터 스트림**입니다.

즉, Stream은 다음과 같은 특징을 가집니다.

- 데이터의 **삽입 순서 보장 (head → tail)**
- 각 데이터는 **Map(field-value)** 형태로 구성
- ID(시간+시퀀스) 기준으로 자동 정렬
- head/tail 접근 가능

---

## 2. 구조 개요

Stream은 내부적으로 다음과 같은 형태로 구성됩니다.

```
Stream
 ├── head → 가장 오래된 데이터
 ├── tail → 가장 최근 데이터
 ├── entries (Radix Tree 기반)
 │     ├── 1720171542000-0: { user: "alice", action: "login" }
 │     └── 1720171543000-0: { user: "bob", action: "logout" }
 └── 내부 저장: ListPack (압축된 Map 구조)
```

각 entry는 다음처럼 구성됩니다:

| 구성 요소 | 설명 |
|------------|------|
| **ID** | Timestamp + Sequence (자동 생성 가능) |
| **Fields** | key-value(Map) 쌍 |
| **순서 보장** | ID 오름차순으로 정렬 |

---

## 3. 내부 알고리즘 구조

Stream은 두 가지 핵심 자료구조로 구현됩니다.

| 구성 요소 | 내부 구현 | 역할 |
|------------|------------|------|
| **정렬** | Radix Tree | ID(prefix) 기반으로 정렬 유지 |
| **데이터 저장** | ListPack (압축 리스트) | 각 entry의 field-value(Map) 저장 |

이 조합을 통해 Stream은
- 데이터 삽입 시: **O(log N)**
- 데이터 조회 시: **O(log N)**  
  의 효율적인 성능을 가집니다.

---

## 4. head / tail 개념

Stream은 **Queue**처럼 head와 tail 개념을 가집니다.

```bash
# head (가장 오래된 데이터)
XRANGE mystream - + COUNT 1

# tail (가장 최근 데이터)
XREVRANGE mystream + - COUNT 1
```

- **head** → 데이터의 시작점 (첫 삽입)
- **tail** → 최근 데이터 (마지막 삽입)
- ID 기준으로 자동 정렬되어 **삽입 순서가 보장**

---

## 5. 사용 예시

### 데이터 추가
```bash
XADD mystream * user alice action login
XADD mystream * user bob action logout
```

### 데이터 조회
```bash
XRANGE mystream - +
```

결과:
```
1720171542000-0: { user: "alice", action: "login" }
1720171543000-0: { user: "bob", action: "logout" }
```

### head / tail 접근
```bash
# 첫 데이터
XRANGE mystream - + COUNT 1

# 마지막 데이터
XREVRANGE mystream + - COUNT 1
```

---

## 6. Stream의 Map 특징

각 Stream entry는 내부적으로 **Hash(Map)** 형태로 저장됩니다.

```
ID: { field1: value1, field2: value2, ... }
```

예를 들어:
```bash
XADD orders * order_id 12345 status paid total 56000
```

저장 구조:
```
1730548332000-0: { order_id: "12345", status: "paid", total: "56000" }
```

즉, Stream은
- **ID (정렬용 키)**
- **Map (데이터 본문)**  
  두 레이어로 구성된 구조입니다.

---

##  7. Consumer Group (확장 기능)

Stream은 **Consumer Group**을 이용해 Kafka처럼 데이터를 병렬로 소비할 수도 있습니다.

```bash
XGROUP CREATE mystream group1 $
XREADGROUP GROUP group1 consumer1 STREAMS mystream >
```

- `$`: 최신 데이터부터 시작
- `>`: 아직 소비되지 않은 데이터 읽기
- 각 Consumer는 메시지를 순차적으로 처리 (순서 유지)

---

## 8. 시간 복잡도 및 특징 요약

| 연산 | 명령어 | 시간 복잡도 | 설명 |
|------|----------|---------------|------|
| 데이터 추가 | `XADD` | O(log N) | ID 정렬 삽입 |
| 데이터 조회 | `XRANGE` / `XREVRANGE` | O(log N) | 범위 기반 탐색 |
| head 조회 | `XRANGE - + COUNT 1` | O(1) | 첫 데이터 |
| tail 조회 | `XREVRANGE + - COUNT 1` | O(1) | 마지막 데이터 |

---

## 9. Stream vs List vs Hash 비교

| 구분 | Stream          | List      | Hash |
|------|-----------------|-----------|------|
| 순서 보장 | O (ID 기준)       | O (삽입 순서) | x    |
| head/tail 접근 | O               | O         | x    |
| Map 구조 | O (field-value) | x         | O    |
| 범위 조회 | O (ID Range)    | 제한적       | x    |
| 소비자 그룹 | O               | x         | x    |

> Stream은 **List의 순서성과 Hash의 구조성을 동시에 가진 자료구조**입니다.

---

## 10. 활용 사례

| 사용 시나리오 | 설명 |
|----------------|------|
| **로그 시스템** | 시간순으로 누적되는 이벤트 로그 저장 |
| **채팅 메시지 큐** | 메시지 순서 보장 및 병렬 소비 |
| **실시간 이벤트 처리** | IoT 센서 데이터, 트래픽 수집 등 |
| **CDC(Change Data Capture)** | 데이터베이스 변경 이벤트 관리 |

---

## 11. 정리

| 항목 | 내용                                     |
|------|----------------------------------------|
| **자료구조 이름** | Stream                                 |
| **내부 구현** | Radix Tree + ListPack                  |
| **순서 보장 여부** | Yes (ID 기준 정렬)                         |
| **Map 구조 여부** | Yes (field-value 형태)                   |
| **head / tail 존재** | Yes                                    |
| **대표 명령어** | `XADD`, `XRANGE`, `XREVRANGE`, `XREAD` |
| **시간 복잡도** | O(log N)                               |
| **주요 활용** | 이벤트 로그, 메시징 큐, 실시간 데이터 파이프라인           |

---

## 마무리

Redis Stream은 단순한 캐시를 넘어,  
**순서를 가진 Map형 데이터 구조**를 제공합니다.  
Kafka 수준의 이벤트 스트림을 Redis 하나로 구현할 수 있죠.

> 즉, Stream은  
> “**시간 순서가 보장되는 Map 구조형 큐**”  
> 라고 정의할 수 있습니다.

---
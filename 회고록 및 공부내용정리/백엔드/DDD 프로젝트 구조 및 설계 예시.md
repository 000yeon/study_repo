# Layer 별 특징과 역할

### 1. 사용자 인터페이스 (interfaces)
  - 사용자에게 정보를 보여주고 사용자의 명령을 해석하는 책임
  - Controller, Dto, Mapper(Converter)

### 2. 응용 계층 (application)
-   수행할 작업을 정의하고 표현력 있는 도메인 객체가 문제를 해결하게함.
- 이 계층에서 책임지는 작업은 업무상 중요하거나 다른 시스템의 응용계층과 상호 작용하는데 필요함
- 이 계층은 얇게 유지되고 오직 작업을 조정하고 아래에 위차한 계층에 포함된 도메인 객체의 협력자에게 작업을 위임한다.
- Facade

### 3. 도메인 계층 (domain)
- 업무 개념과 업무 상황에 대한 정보, 업무 규칙을 표현하는 일을 책임
- 업무 상황을 반영하는 상태를 제어하고 사용, 그와 같은 상태 저장과 관련된 기술적인 세부사항은 인프라 스트럭쳐에 위임
- 업무용 소프트웨어의 핵심
- Entity, Service, Command, Criteria, Info, Reader, Store, Executor, Factory(interface)


### 4. 인프라 스트럭쳐 (infrastructure)
- 상위 계층을 지원하는 일반화된 기술적 기능을 제공.
- 메시지 전송, 도메인 영속화, UI에 그리는 위젯 등
- low level 구현체 ( ReaderImpl, StoreImpl, Spring JPA, RedisConnecer)


## Layer 간 참조 관계
- Layer 간의 참조 관계에서 apllication 과 Infrastructure는 domain layer를 바라보게 하고 양방향 참조는 허용하지 않게 한다
- domain layer는 low level의 기술에 상관없이 독립적으로 존재할 수 있어야함
  - 이를 위해 대부분의 로직은 추상화 되고, runtime 시에는 DIP 개념을 활용하여 실제 구현체가 동작하게 한다


## 상세 표준 구현
### 1. domain layer 에서의 Service에서는 해당 도메인의 전체 흐름을 파악할 수 있도록 구현 되어야한다.
- 이를 위해서 추상화 레벨을 높여야함
  - 도메인 로직에서는 어떤 기술을 사용했는지는 중요하지 않음. 어떻게 업무를 처리했는가가 중요
  - 도메인 업무는 적절한 interface를 사용하여 추상화하고 실제 구현은 다른 layer에 맡기는 것이 맞다
- 세세한 기술 구현은 Service가 아니라 infrastructure의 implements 클래스에 위임하고, Service에서는 이를 활용하기 위한 interface를 선언하고 사용한다
  - DIP를 활용하여 도메인이 사용하는 interface의 실제 구현체를 주입 받아 사용할 수 있도록 한다
  - 영속화된 객체를 로딩하기 위해 Spinrg JPA를 사용할 수도 있지만 MyBastis를 사용할 수도 있는 것. domain layer에서는 객체를 로딩하기 위한 추상화된 interface를 사용하고, 실제 동작은 하위 layer의 기술 구현체에 맡긴다
- 이런식의 구현이 된다면
  - service의 메서드만 읽어도 업무 도메인의 흐름을 알 수 있다
  - interface로 추상화된 실제 구현 기술은 어제든지 원하는 것으로 교체 가능
- 도메인을 대표하는 하나의 Service가 존재하게 하고, 해당 service는 @Service를 붙인다
  - 해당 제안을 규약으로 가져가면, 다른 개발자들이 해당 도메인을 파악할 때 엔트리 포인트가 되는 로직을 빠르게 찾을 수 있을 것
  
### 2. domain layer에서의 모든 클래스명이 xxxSerive로 선언될 필요가 없다
- 하나의 도메인 패키지 내에 수많은 Service 클래스가 존재하게 되면, 도메인 전체의 흐름을 컨트롤 하는 Service가 무엇인지 알기 어렵다
  - 주요 도메인의 흐름을 관리하는 Service는 하나로 유지하고, 이를 위한 support 역할을 하는 클래스는 Service 이외의 네이밍을 가져가는 것이 좋다
  - 하나의 책임을 가져가는 각각의 구현체는 그 책임과 역할에 맞는 네이밍으로 선언하는 것이 가독성에 좋다
  - 예를 들면
    - XxxReader
    - XxxStore
    - XxxExcutor
    - XxxFactory
    - XxxAggregator
  - 다만 해당 구현체는 domain layer에서는 interface로 추상화하고 실제 구현체는 infrastructure layer에서 구현
  - 즉 domain layer에서는 도메인 로직의 흐름을 표현하고 구현하는 Service와 ServiceImpl이 있지만 그 외에 상세한 구현은 interface를 선언하여 사용하고 실제 구현체는 infrastructure layer에 두고 활용한다 ( DIP )
  
### 3. Service 간에는 참조 관계를 가지지 않도록 한다
- DDD 의 Aggregate Root 개념을 알고 있다면 도메인 내의 Entity 간에도 상하 관계가 명확히 생긴다는 것을 알게 된다
- Service 로직을 구현하다보면 좀 더 상위 레벨의 Service와 하위 레벨의 Service가 생기는데, 이런 구조를 허용하게 되면 상위 레벨의 Service가 하위 레벨의 Service를 다수 참조하게 되면서 로직이 구성된다
  - 이는 테스트 코드 작성을 어렵게하고 가독성도 많이 떨어진다
- Service  간에는 참조 관계를 가지지 않도록 원칙을 세우는 것이 좋다
  - Service  내의 로직은 추상화 수준을 높게 가져가고
  - 각 추상화의 실제 구현체는 잘게 쪼갠다
  - 도메인의 전체 흐름이 파악되면서도 로직이 간결하게 유지 되는 코드를 가져갈 수 있다


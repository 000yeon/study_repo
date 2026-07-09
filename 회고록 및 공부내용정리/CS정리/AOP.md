# AOP ( Aspect Oriented Promgramming ) - 관점 지향 프로그래밍

#### 스프링 어플리케이션은 대부분 특별한 경우를 제외하고는 MVC 웹 어플리캐이션에서 Web Layer, Business Layer, Data Layer로 정의

- Web Layer: REST API를 제공하며, Client 중심의 로직 적용 
- Business Layer: 내부 정책에 따른 Logic을 개발하며, 주로 해당부분을 개발
- Data Layer: 데이터 베이스 및 외부와의 연동을 처리

#### JAVA 에서 

| Annotation     | 의미                                                  |
|----------------|-----------------------------------------------------|
| @Aspect        | 자바에서 널리 사용하는 AOP 프렝임워크에 포함, AOP를 정의하는 Class 할당      |
| @Pointcut      | 기능을 어디에 적용시킬지, 메소드? Annotation? 등, AOP를 적용 시킬 지점을 설정 |
| @Before        | 메소드 실행하기 이전                                         |
| @After         | 메소드가 성공적으로 실행 후, 예외가 발생되더라도 실행                      |
| @AfterReturing | 메소드 호출 성공 실행 시 (Not Throws)                         |
| @AfterThrowing | 메소드 호출 실패 예외 발생 (Throws)                            |
| @Around        | Before/After 모두 제어                                  |


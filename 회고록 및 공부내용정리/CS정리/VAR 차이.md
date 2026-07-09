# JAVA 와 Javascript에서의 VAR가 무엇이 다른가

## JAVA의 VAR

### 주요 특징

- Java 10부터 도입된 지역 변수 타입 추론 (Local Variable Type Inference)
- 컴파일러가 변수의 타입을 자동으로 추론하여 결정
- 변수의 타입이 한 번 결정되면 변경할 수 없음 (정적 타입 언어 특성 유지)

```
var number = 10; // 컴파일러가 int로 추론
var text = "Hello"; // 컴파일러가 String으로 추론

System.out.println(number + 5); // 출력: 15
System.out.println(text.toUpperCase()); // 출력: HELLO

```

* 주의사항
  1. 반드시 초기화
  2. 메서드의 매개변수 타입 X
  3. 클래스 맴버 변수로 불가능

## Javscript의 VAR

### 주요특징

- 변수의 타입을 동적으로 변경할 수 있음 (동적 타입 언어)
- 함수 스코프(Function Scope)를 가짐
- 재선언 가능, 즉 같은 변수명을 다시 선언할 수 있음 (⚠️ 유지보수에 위험할 수 있음)

#### 결론

JavaScript의 var는 변수의 타입을 자유롭게 변경할 수 있으며, 동적 타입 언어의 특성을 가진다.
  ✅ 블록({})을 무시하고 함수 스코프를 따르므로, 의도치 않은 변수 변경이 발생할 수 있다.
  ✅ 최근에는 let과 const가 var보다 안전하여 더 많이 사용됨.



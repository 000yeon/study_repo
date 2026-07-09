# Java에서 클래스 간 형변환과 메모리 사용
#### 클래스간 형 변환 시 하위 클래스의 맴버 변수까지 메모리에 할당 되지만, 실제로는 상위 맴버 변수까지 밖에 접근을 못하면 메모리 낭비가 아닌가에 대한 고찰입니다.
#### Java에서 클래스 간 형변환을 하면 하위 클래스의 멤버 변수까지 메모리에 할당되지만, 상위 클래스의 멤버 변수만 접근 가능한 이유와 그 필요성에 대해 설명드리겠습니다.

## ✅ 1. Java에서 형변환과 메모리 구조

### 📌 (1) 객체 생성 시 메모리 구조

Java에서 객체는 생성될 때 실제로 해당 클래스의 모든 멤버 변수를 메모리에 할당합니다.
즉, 하위 클래스 객체를 생성하면 상위 클래스의 멤버도 포함되어 전체 객체가 메모리에 로드됩니다.

🎯 예제 코드
```
class Parent {
int a = 10;

    void show() {
        System.out.println("Parent show: " + a);
    }
}

class Child extends Parent {
int b = 20;

    @Override
    void show() {
        System.out.println("Child show: " + a + ", " + b);
    }
}

public class Main {
public static void main(String[] args) {
Parent p = new Child();  // 업캐스팅 (하위 -> 상위)
p.show();  // "Child show: 10, 20" 출력

        // p.b = 30; // 오류! Parent 타입에서는 b 접근 불가
    }
}
```
실제 메모리 할당

```
p (Parent 타입)  ->  [ a=10, b=20 (메모리에 존재하지만 접근 불가) ]
```

객체 메모리는 Child 클래스 전체가 생성됨

하지만 p는 Parent 타입이므로 상위 클래스(Parent)의 멤버 변수 및 메서드만 접근 가능
하위 클래스(Child)의 b 변수에는 직접 접근할 수 없음

## 📌 (2) 업캐스팅(Upcasting)과 메모리 낭비?

### 👉 Q. 하위 클래스 멤버 변수를 사용할 수 없다면, 왜 굳이 하위 클래스의 메모리를 할당하는가?
### A. 다형성(Polymorphism)을 활용하기 위해!

Java의 다형성(Polymorphism)을 활용하여 코드를 유연하게 만들고 유지보수를 쉽게 하기 위해 필요합니다.
업캐스팅을 하면 하위 클래스의 메서드를 오버라이딩(Override)하여 실행 가능!

🎯 예제 (다형성 활용)
```java
class Animal {
void sound() {
System.out.println("Animal makes a sound");
}
}

class Dog extends Animal {
@Override
void sound() {
System.out.println("Dog barks");
}
}

class Cat extends Animal {
@Override
void sound() {
System.out.println("Cat meows");
}
}

public class Main {
public static void main(String[] args) {
Animal myAnimal1 = new Dog();  // 업캐스팅
Animal myAnimal2 = new Cat();  // 업캐스팅

        myAnimal1.sound(); // "Dog barks" (실제 Dog 객체의 메서드 호출)
        myAnimal2.sound(); // "Cat meows" (실제 Cat 객체의 메서드 호출)
    }
}
```

📌 업캐스팅을 통해 Animal 타입을 유지하면서 Dog와 Cat을 동적으로 호출 가능

📌 각 서브클래스의 구현이 변경되어도 Animal 타입을 유지하면 코드 변경이 최소화됨

## ✅ 2. 하위 클래스의 메모리는 낭비인가?
### 🎯 Q. 상위 클래스 멤버만 사용할 거라면 하위 클래스의 메모리를 낭비하는 것 아닌가요?
### A. 그렇지 않습니다. 이유는 다음과 같습니다.

📌 (1) 다형성(Polymorphism)을 활용 가능
업캐스팅을 통해 하위 클래스의 오버라이딩 메서드를 실행할 수 있음.
상위 클래스의 타입으로 선언하면 여러 하위 클래스를 동일한 인터페이스로 처리 가능.

📌 (2) 필요하면 다운캐스팅(Downcasting)으로 접근 가능
업캐스팅된 객체라도 instanceof를 활용하면 하위 클래스 멤버에도 접근 가능함.
다만, 잘못된 다운캐스팅은 ClassCastException을 발생시키므로 주의해야 함.

🎯 다운캐스팅 예제
```
public class Main {
public static void main(String[] args) {
Parent p = new Child();  // 업캐스팅
if (p instanceof Child) {
Child c = (Child) p;  // 다운캐스팅
c.b = 30;  // 하위 클래스 멤버 변수 접근 가능
c.show();  // "Child show: 10, 30"
}
}
}
```

📌 instanceof 연산자를 사용하여 안전하게 다운캐스팅을 수행할 수 있음.

📌 필요할 때만 하위 멤버를 접근 가능하게 관리하면 메모리 낭비를 최소화할 수 있음.

## ✅ 3. 결론
### 🎯 Q. 굳이 형변환을 해서 메모리를 낭비할 필요가 있을까?
- ✔ 형변환(업캐스팅)을 통해 다형성을 활용하여 유지보수성을 높이기 위해 필요함!
- ✔ 메모리는 전체 할당되지만, 필요한 경우 다운캐스팅을 통해 하위 클래스 멤버도 활용 가능!
- ✔ 업캐스팅을 하면 여러 하위 클래스를 하나의 인터페이스로 다룰 수 있어 코드의 재사용성이 증가!

🚀 즉, 업캐스팅을 통해 다형성을 활용하고, 필요할 때 다운캐스팅을 하면 메모리 낭비 없이 효율적으로 사용할 수 있습니다! 😊
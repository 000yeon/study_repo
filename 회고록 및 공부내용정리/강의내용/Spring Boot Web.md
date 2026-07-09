# Spring Boot Web

## Spring Boot Web에서 응답만드는 방법

| String        | 일반 Text Type 응답                                  |
|---------------|--------------------------------------------------|
| Object        | 자동으로 Json 변환되어 응답 상태값은 항상 200 OK                 |
| ResponseEntity | Body의 내용을 Object로 설정, 상황에 따라서 HttpStatus Code 생성 |
| @ResponseBody | RestController가 아닌곳에서 Json응답을 내릴 때               |

## Object Mapper
스트링 부트에서 Json으로 전달되는 데이터를 역직렬화를 통해서 DTO형태, 자바 클래스 형태로 바꿔주는 역할
Dto를 직렬화를 통해 Json으로 바꿔준다. Jackson 라이브러리가 있음
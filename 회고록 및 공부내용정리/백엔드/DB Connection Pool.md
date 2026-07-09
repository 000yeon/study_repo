# DBCP ( Database Connection Pool )
- 미리 일정량의 DB 커넥션을 생성해서 풀에 저장해 두고 있다가 HTTP 요청에 따라 필요할 때 풀에서 커넥션을 가져다 사용하는 기법
- DB 커넥션을 미리 생성해서 풀(Pool)에 보관하고, 필요할 때 가져와서 사용함.
- 커넥션을 새로 생성하는 비용을 줄이고, 애플리케이션의 성능을 최적화함.
- 사용이 끝난 커넥션은 다시 풀에 반환되며, 다른 요청에서 재사용됨.

- 스프링 부터 2.0 부터는 default connection pool로 HikariCP 사용


## 유의사항
- 커넥션의 사용 주체는 WAS 스레드이므로 커넥션 개수는 WAS 스레드 수와 함께 고려해야함
- 커넥션 수를 크게 설정하면 메모리 소모가 큰 대신 동시 접속자 수가 많아지더라도 사용자 대기 시간이 상대적으로 줄어들게 되고, 반대로 커넥션 개수를 작게 설정하면 메모리 소모는 적은 대신 그만큼 대기시간이 길어질 수 있음. 따라서 적정량의 커넥션 객체를 생성해 두어야 함


### DataSource
- 커넥션 획득하기 위한 표준 인터페이스


### 그럼 Transaction은 어디서 관리될까
- 트랜 잭션은 Connection 위에서 동작
  - 트랜잭션은 Connection이 시작될 때 함께 시작됨
  - @Transaction을 사용하면 Connection이 활성화 되고, 그 안에서 트랜잭션이 관리됨
  - 트랜잭션이 Commit 또는 Rollback 되면, Connection은 다시 Connection Pool로 반환됨

#### -> JPA는 트랜잭션을 Connection Pool 바깥에서 관리하고, 트랜잭션이 끝난 후 한 번에 Connection을 통해 DB에 반영하는 방식으로 동작
# Spring Security

## Spring Security 의 역할

|역할|설명|
|----|----|
|인증 (Authentication)|사용자가 누구인지 확인 (로그인)|
|인가 (Authorization)|사용자가 요청한 리소스를 접근할 수 있는 권한이 있는지 확인|
|보안 필터 관리|다양한 보안 필터를 체이닝하여 보안 처리를 자동화|
|세션 관리|로그인 상태 유지, 세션 타임아웃 등|
|비밀번호 암호화|Bcrypt 등 다양한 해시 알고리즘 사용|
	
	
## 동작 과정
```
[사용자 요청]
     |
     v
[FilterChainProxy]  ← Spring Security 시작점
     |
     |-- UsernamePasswordAuthenticationFilter (로그인 요청 처리)
     |
     |-- SecurityContextPersistenceFilter (SecurityContext 관리)
     |
     |-- ExceptionTranslationFilter (예외 처리)
     |
     |-- FilterSecurityInterceptor (권한 체크)
     |
     v
[DispatcherServlet] → [Controller] → [Service]
```

## Spring Sucurity의 핵심은 서블릿 필터 기반 구조
- 서블릿 필터? -> Java 웹 애플리케이션에서 클라이언트의 요청(request)이나 응답(response)에 대해 전처리 또는 후처리를 수행할 수 있는 기능
	
|필터 이름|   역할 |
|----|----|
|SecurityContextPersistenceFilter|  이전 요청의 보안 컨텍스트 유지  |
|UsernamePasswordAuthenticationFilter|   로그인 요청 처리 |
|ExceptionTranslationFilter|  인증/인가 실패 시 예외 처리  |
|FilterSecurityInterceptor|접근 제어 (권한 검사)    |
|BasicAuthenticationFilter|  HTTP Basic 인증 처리  |

	
	
	
	
	
	
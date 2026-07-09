# CORS 문제란?

### CORS(Cross-Origin Resource Sharing) 문제는 다른 도메인에서 API 요청을 보낼 때 브라우저의 보안 정책(Same-Origin Policy)에 의해 차단되는 현상을 의미합니다.

- 프론트엔드: http://localhost:3000
- 백엔드 API: https://api.example.com

-> 이런 경우 브라우저는 요청을 차단하며, CORS 오류를 발생시킵니다.

## CORS 문제 해결 방법

### 서버에서 CORS 허용 (백엔드 설정)
가장 근본적인 해결 방법은 백엔드 서버에서 CORS를 허용하는 것입니다.

(1) Express.js에서 CORS 설정

```
    const express = require('express');
    const cors = require('cors');
    const app = express();
    
    app.use(cors()); // 모든 도메인에서 요청 허용
    
    // 또는
    
    app.use(cors({
      origin: 'http://localhost:3000' // 프론트엔드 도메인만 허용
    }));
```

(2) Node.js + Express + Headers 설정
```
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

```

(3) Spring Boot에서 CORS 설정
```
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

### 프록시 서버 사용 (프론트엔드 설정)
백엔드를 수정할 수 없는 경우, 프론트엔드에서 프록시(proxy) 를 설정하여 해결할 수 있습니다.

(1) React 개발 서버에서 프록시 설정 (package.json)
```
"proxy": "https://api.example.com"
```
이렇게 하면 fetch('/data') 같은 요청이 자동으로 https://api.example.com/data로 변환됨.


(2) Webpack Dev Server에서 프록시 설정
```
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
};
```
이제 fetch('/api/users')를 호출하면 자동으로 https://api.example.com/users로 요청이 전달됨.

### Nginx에서 CORS 해결
배포 환경에서는 Nginx 리버스 프록시를 사용하여 CORS 문제를 해결할 수 있음.
```
server {
    location /api/ {
        proxy_pass https://api.example.com/;
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
    }
}
```

### 서버에서 CORS 허용하는 것이 가장 근본적인 해결 방법
- 프론트엔드에서는 프록시 서버 설정을 통해 해결 가능
- 운영 환경에서는 Nginx 리버스 프록시로 CORS 해결
- 브라우저 확장 프로그램은 개발 중에는 사용 가능하지만, 운영 환경에서는 사용하면 안 됨
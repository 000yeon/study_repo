# Spring프로젝트에 Swagger 간단 세팅

## 1. 의존성 추가
```
// build.gradle
dependencies {
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'
}

```

## 2. Swagger 기본 세팅 ( 안해도 그만 )
```
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Title")
                .description("API 문서 설명")
                .version("1.0.0"));
    }
}

```

## 3. 사용법 예시

### 대표 어노테이션 요약
|어노테이션|   용도 |
|----|----|
|@Operation|   API 메서드 설명 |
|@Parameter|   쿼리/경로 파라미터 설명 |
|@RequestBody + @Schema| Body 요청 설명   |
|@ApiResponse|  응답 코드 및 설명  |
|@Schema|   DTO 필드 설명 등 |
	

### 예시

1. 단순 GET API 설명

```
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/biz")
@Tag(name = "Biz API", description = "비즈니스 관련 API입니다.")
public class BizController {

    @Operation(summary = "전체 비즈 조회", description = "DB에 있는 모든 비즈 리스트를 반환합니다.")
    @GetMapping("/getall")
    public List<String> getAll() {
        return List.of("Biz1", "Biz2");
    }
}
```

2. POST API + 요청 바디

```
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "비즈니스 등록 요청")
public class BizCreateRequest {

    @Schema(description = "비즈니스 이름", example = "트랙키")
    private String name;

    @Schema(description = "사업자 등록 번호", example = "123-45-67890")
    private String regNum;

    // Getters, Setters, Constructors 생략
}

```
```
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/biz")
public class BizController {

    @Operation(
        summary = "비즈 등록",
        description = "새로운 비즈니스 데이터를 등록합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류")
        }
    )
    @PostMapping("/add")
    public String addBiz(@RequestBody BizCreateRequest request) {
        return "등록 완료: " + request.getName();
    }
}


```

3. PathVariable, RequestParam 설명
```
import io.swagger.v3.oas.annotations.Parameter;

@GetMapping("/{bizId}")
@Operation(summary = "비즈 상세 조회", description = "bizId에 해당하는 비즈 정보를 반환합니다.")
public String getBiz(
    @Parameter(description = "비즈니스 ID", example = "1")
    @PathVariable Long bizId
) {
    return "Biz " + bizId;
}


```

	
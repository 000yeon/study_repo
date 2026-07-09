# Docker

Docker란 애플리케이션을 컨테이너라는 단위로 패키징하여 배포하고 실행할 수 있도록 해주는 컨테이너 기반 가상화 플랫폼
기존의 가상머신보다 가볍고, 효율적인 방식으로 애플리케이션을 실행할 수 있도록 해줌

## Docker의 주요개념
### 1. 컨테이너
- 애플리케이션과 실행에 필요한 모든 환경을 포함하는 독립적인 패키지
- 특정 os에 종속되지 않고 어디서나 동일하게 실행가능

### 2. 이미지
- 컨테이너 실행을 위한 템플릿
- Dockerfile을 통해 생성 가능
- 동일한 이미지를 기반으로 여러개의 컨테이너 실행 가능

### 3. Dockerfile
- 도커 이미지를 생성하기 위한 설정 파일
```
From node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]

```

#### 4. Docker Hub
- 도커 이미지를 공유할 수 있는 공식 저장소

#### 5. 볼륨
- 컨테이너 안에 데이터를 영구적으로 저장하기 위한 방법 ( 컨테이너 삭제 시 데이터 유지 가능 )


### Docker의 장점
- 환경 일관성 - 개발, 테스트, 운영 환경을 동일하게 유지 =
- 경량화 - vm 보다 가볍고 빠름
- 빠른 배포 - 컨테이너 기반 배포로 빠르게 배포 가능
- 확장성 - 여러 개의 컨테이너를 쉽게 관리 가능

### Docker 기본 명령어
```shell
# 도커 이미지 다운로드
docker pull <이미지이름>

# 컨테이너 실행 (-d: 백그라운드 실행)
docker run -d -p 3000:3000 --name my-container <이미지이름>

# 실행 중인 컨테이너 목록 확인
docker ps

# 모든 컨테이너 목록 확인 (중지된 컨테이너 포함)
docker ps -a

# 컨테이너 중지
docker stop <컨테이너ID>

# 컨테이너 삭제
docker rm <컨테이너ID>

# 이미지 삭제
docker rmi <이미지ID>

# Dockerfile을 이용해 이미지 빌드
docker build -t my-image .

# 컨테이너 내부로 접근
docker exec -it <컨테이너ID> /bin/sh

```

### Docker vs 가상 머신 (VM)
| 비교 항목 |Docker (컨테이너)| 가상 머신 (VM)    |
|-------|----|----|
| 실행 속도 |빠름|  느림             |
| 성능 오버헤드   |적음|   많음            |
|  운영체제(OS)     |호스트 OS 공유|      개별 OS 포함         |
|리소스 사용량|적음|많음|
|배포 방식|가볍고 빠름|무거움|

### Docker 활용 예시
- 개발 환경 통합 (로컬 개발 환경을 도커로 통일)
- CI/CD 자동화 (빌드, 테스트, 배포 자동화)
- 마이크로서비스 아키텍처 (각 서비스별 컨테이너 실행)
- 클라우드 환경 배포 (AWS, GCP, Azure 등에서 컨테이너 기반 배포)


### VM에서 Docker 실행 과정
#### 1. VM 생성

- Host OS에서 VirtualBox, VMware, Hyper-V 같은 하이퍼바이저(Hypervisor)를 사용해 VM을 만든다.
- VM 내부에 Guest OS(예: Ubuntu, Debian 등 리눅스 배포판)을 설치한다.

#### 2. VM 내부에 Docker 설치

- Guest OS에서 Docker를 설치하고 실행한다.
- docker daemon(도커 엔진)이 실행되면, 컨테이너를 실행할 수 있다.

#### 3. Docker 컨테이너 실행

- VM 내부에서 docker run 명령을 실행하면, 컨테이너가 생성된다.
- 컨테이너는 VM의 커널을 공유하면서 격리된 환경을 제공한다.
- 여러 개의 컨테이너를 실행해도, 이들은 VM 내부에서만 실행된다.

#### 4. Host OS ↔ VM ↔ Docker 간의 네트워크 연결

- VM에서 실행된 Docker 컨테이너는 VM의 네트워크 인터페이스를 사용한다.
- Host OS에서 VM의 IP 주소를 통해 컨테이너에 접근할 수 있다.
- 예를 들어, http://192.168.99.100:8080 같은 형태로 접근하게 된다.

### 🚀 VM에서 Docker를 실행하는 이유
1. Windows/Mac에서 Linux 기반 컨테이너 실행
- Docker는 Linux 커널 기반이므로, Windows나 Mac에서 직접 실행하기 어려움.
- 그래서 Windows/Mac에서는 Linux VM을 생성해서 그 위에서 Docker를 실행한다.

2. 완전한 격리 환경 제공
- VM 자체가 완전히 분리된 환경이므로, Docker를 더 안전하게 사용할 수 있다.
- 개발용 테스트 환경에서 여러 버전의 OS나 의존성을 독립적으로 관리 가능.

3. 특정 OS 환경에서 테스트 가능
- 개발자가 Windows에서 작업하지만, Linux 환경에서 동작하는 애플리케이션을 개발/테스트할 때 유용.
- 예를 들어, Ubuntu VM에서 Docker를 실행해 Linux 기반 서비스(Nginx, PostgreSQL, Redis 등)를 테스트할 수 있다.

#### 🎯 결론
- VM에서 Docker를 실행하면 "VM의 Guest OS"가 Host OS 역할을 하고, 그 위에서 Docker가 실행되는 형태가 된다.
- VM 내부의 Docker는 VM의 리소스를 사용하며, 컨테이너는 VM 내에서만 동작한다.
- Windows/Mac에서 Docker를 실행할 때 기본적으로 VM이 사용되며, 이를 "Docker Desktop"이 자동으로 관리해준다.

👉 즉, VM 내부에서 Docker를 실행하는 것은 일종의 "이중 가상화" 과정이지만, 개발 환경을 맞추거나 격리된 테스트 환경이 필요할 때 유용하다! 🚀
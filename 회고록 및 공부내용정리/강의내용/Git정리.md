# Git

1. git 단축키

- git init : git 저장소 초기화
- git status : git 저장소 상태 확인
- git add : 파일을 stage 영역에 추가 ( stage : commit 하기 전에 변경된 파일을 모아놓은 임시 저장소 )
- git commit : 변경 내용을 저장하고 커밋, 스냅샷 생성 및 메세지 작성
- git push : 로컬 저장소에서 변경된 내용을 원격 저장소로 업로드
- git pull : 원격 저장소에서 변경 사항을 가져옴
- git clone : 원격 저장소를 로컬로 복제
- git log :  Git 저장소의 커밋 히스토리 확인
- git reset: 이전 커밋 상태로 되돌리기
- git stash : 변경 사항을 임시로 저장, git stash pop을 통해 다시 적용
- git diff : 변경 내용 확인
- git branch : 현재 저장소의 모든 브랜치 출력
- git checkout : 브랜치를 전환하거나, 커밋을 확인하기 위해 작업 디렉토리는 변경하는 명령

2. git 브랜치 전략
   - Feature Branch 전략 : 
     1. 각 기능별로 독립적인 브랜치 생성 / 서로 작업에 영향을 주지 않음
     2. 일반적으로 'feature/기능명' 형식을 따름
   - Github Flow
     1. 규모가 작거나 중간 크기의 프로젝트에 적합 / 빠른 주기, 지속적 배포에 유리
     2. 작업 내용을 설명하는 브랜치 / 기준 브랜치는 항상 배포 가능한 상태
     3. github에 PullRequest를 생성하여 코드리뷰 요청
   - Git Flow
     1. 프로젝트의 코드 관리와 릴리스를 체계적으로 진행하는 방법론
     2. master : 프로덕션 환경에 배포되는 안정적인 코드 저장소
     3. develop: 개발 중인 코드를 관리하는 브랜치
     4. Feature: 새로운 기능 개발을 위한 브랜치 ( develop 에서 분기 )
     5. Release: 새로운 버전 릴리스를 준비하는 브랜치 ( develop 에서 분기 )
     6. Hotfix: 긴급 버그 수정 브랜치 ( Master 에서 분기 )
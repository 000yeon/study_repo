# Blob이란? – 자바스크립트에서 메모리 기반 파일 객체 다루기

웹 개발을 하다 보면 클라이언트 측에서 파일을 생성하거나, 다운로드 링크를 만들거나, 사용자 입력 없이 데이터를 업로드해야 하는 경우가 있습니다. 이럴 때 유용하게 사용되는 것이 바로 **Blob**입니다.

---

## Blob이란?

> `Blob`(Binary Large Object)은 **이진 데이터를 파일처럼 다룰 수 있게 해주는 자바스크립트 객체**입니다.

브라우저 메모리 안에서 생성할 수 있으며, 문자열, 이미지, 비디오 등 다양한 데이터를 다룰 수 있습니다. `Blob` 객체는 **실제 파일이 없어도** 동적으로 데이터를 조작하고 파일처럼 사용할 수 있습니다.

---

## 메모리에서 생성 가능하다는 의미는?

Blob은 디스크에 있는 파일을 읽어오는 것이 아니라, **JS 코드에서 직접 데이터를 만들어 메모리에 올려놓는 객체**입니다.

```js
const blob = new Blob(['Hello Blob!'], { type: 'text/plain' });
```

## Blob의 주요 활용 예시

#### 1. 텍스트 파일 동적 다운로드

```js
const blob = new Blob(['Hello world!'], { type: 'text/plain' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'hello.txt';
a.click();

URL.revokeObjectURL(url); // 메모리 해제
```

####  2. 이미지 데이터 생성 및 업로드
```js
const canvas = document.createElement('canvas');
// canvas에 그림을 그림...

canvas.toBlob((blob) => {
  const formData = new FormData();
  formData.append('image', blob, 'canvas.png');

  fetch('/upload', {
    method: 'POST',
    body: formData,
  });
});
```

#### 3. PDF 미리보기 열기 (서버 없이)
```
const blob = new Blob([pdfBinaryData], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
window.open(url); // 브라우저 새 탭에서 PDF 미리보기
```

## Blob vs File

| 항목    | Blob       | File          |
|-------|------------|---------------|
| 생성 방식 | 메모리에서 직접 생성 | 유저가 업로드한 파일 등 |
| 이름 존재 | 없음         | file.name 있음  |
| 상속 관계 | 최상위 이진 객체  | Blob을 확장한 객체  |

## Blob의 장점
- 파일 입력 없이 데이터 파일 생성 가능
- 클라이언트에서 동적 생성된 파일 다운로드 가능
- FormData에 첨부하여 서버로 업로드 가능
- PDF, CSV, 이미지 등 다양한 포맷 지원


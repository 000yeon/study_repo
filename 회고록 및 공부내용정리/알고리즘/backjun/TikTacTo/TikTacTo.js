const fs = require('fs');

// --- 특정 기호(c)가 승리했는지 판별하는 함수 ---
function win(b, c) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
    [0, 4, 8], [2, 4, 6],             // 대각선
  ];
  return lines.some(([a, b1, b2]) => b[a] === c && b[b1] === c && b[b2] === c);
}

// --- 게임 상태가 실제 가능한 최종 상태인지 판단 ---
function isValid(s) {
  if (s.length !== 9) return false;
  const b = s.split('');

  let cntX = 0, cntO = 0, cntDot = 0;
  for (const ch of b) {
    if (ch === 'X') cntX++;
    else if (ch === 'O') cntO++;
    else if (ch === '.') cntDot++;
    else return false; // 잘못된 문자 포함 시 무효
  }

  // 1️⃣ 턴 규칙 확인
  if (!(cntX === cntO || cntX === cntO + 1)) return false;

  // 2️⃣ 승리 상태 확인
  const xWin = win(b, 'X');
  const oWin = win(b, 'O');

  // 3️⃣ 동시에 승리한 경우는 존재 불가
  if (xWin && oWin) return false;

  // 4️⃣ 각각의 승리 조건에 맞는 턴 조합 검사
  if (xWin) return cntX === cntO + 1;
  if (oWin) return cntX === cntO;

  // 5️⃣ 아무도 안 이겼다면 -> 무승부 판정 (보드가 꽉 차야 함)
  return cntDot === 0 && cntX === 5 && cntO === 4;
}

// --- 입력 및 출력 처리 ---
const input = fs.readFileSync(0, 'utf8').trim().split('\n');
const result = [];

for (const line of input) {
  if (line === 'end') break;
  result.push(isValid(line) ? 'valid' : 'invalid');
}

console.log(result.join('\n'));
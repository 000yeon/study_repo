function solution(m, n, puddles) {
    const MOD = 1_000_000_007;

    // 1. 물웅덩이 표시 배열
    // 인덱스를 편하게 쓰기 위해서 [n+1][m+1] 크기로 생성 ( 1 부터 사용 )
    const isPuddle = Array.from({ length: n + 1}, () =>
        Array(m + 1).fill(false)
    );

    for( const [x, y] of puddles) {
        isPuddle[y][x] = true; // [열, 행] => [y],[x]
    }

    // 2. dp 배열 생성
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    // 3. 시작점 초기화
    dp[1][1] = 1;

    // 4. 위에서 아래로, 왼쪽에서 오른쪽으로 순회
    for (let y = 1; y <= n; y++ ) {
        for (let x = 1; x <= m; x++ ) {
            // (1, 1)은 이미 초기화이므로 스킵
            if(x === 1 && y === 1) continue;

            // 물웅덩이는 경로 수 0
            if(isPuddle[y][x]) {
                dp[y][x] = 0;
                continue;
            }

            const fromLeft = dp[y][x-1];
            const fromTop = dp[y-1][x];

            dp[y][x] = (fromLeft + fromTop) % MOD;
        }
    }

    return dp[n][m];


    return answer;
}
function solution(triangle) {
    const n = triangle.length;

    const dp = Array.from({ length: n }, () => Array(n).fill(0));

    dp[0][0] = triangle[0][0];

    for ( let i = 1; i < n; i++) {
        for ( let j = 0; j <= i; j++ ) {
            const current = triangle[i][j];

            // 왼쪽 끝일 때
            if ( j == 0 ) {
                dp[i][j] = dp[i - 1][0] + current;
            } else if ( j == i ) {
                // 오른쪽 끝일 때
                dp[i][j] = dp[i - 1][j - 1] + current;
            } else {
                dp[i][j] =  Math.max(dp[i - 1][j - 1], dp[i - 1][j]) + current;
            }
        }
    }


    return Math.max(...dp[n-1]);
}
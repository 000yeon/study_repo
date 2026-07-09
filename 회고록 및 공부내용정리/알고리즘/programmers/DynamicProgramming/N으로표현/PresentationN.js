function solution(N, number) {
    if ( N === number) return 1;

    // dp[i] : N을 i번 사용해서 만들 수 있는 수들의 집합
    const dp = Array.from({ length : 9 }, () => new Set());

    for ( let i = 0; i <= 8; i++ ) {
        // 1) 이어 붙인 숫자
        let concat = 0;
        for ( let k = 0; k < i; k++ ) {
            concat = concat * 10 + N;
        }

        dp[i].add(concat);

        // 2) 이전 dp 들을 조합 ( i = a + b )
        for ( let a = 1; a < i; a++ ) {
            const b = i - a;
            for ( const x of dp[a] ) {
                for ( const y of dp[b] ) {
                    dp[i].add(x + y);
                    dp[i].add(x - y);
                    dp[i].add(x * y);
                    dp[i].add(x / y);
                    if ( y !== 0 ) dp[i].add(Math.floor(x / y ));
                    if ( x !== 0 ) dp[i].add(Math.floor(y / x ));
                }
            }
        }

        // 3) 목표 숫자 있는지 체크
        if (dp[i].has(number)) {
            return i;
        }
    }
    return -1;

}
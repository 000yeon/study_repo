class Solution {
    public int solution(int[][] triangle) {
        int n = triangle.length;

        // dp 배열
        int[][] dp = new int[n][n];

        // 시작점
        dp[0][0] = triangle[0][0];

        // dp 진행
        for ( int i = 1; i < n; i++ ) {
            for ( int j = 0; j <= i; j++ ) {
                int current = triangle[i][j];

                // 왼쪽 끝
                if (j == 0) {
                    dp[i][j] = dp[i-1][0] + current;
                }

                // 오른쪽 끝
                else if (j == i) {
                    dp[i][j] = dp[i-1][j-1] + current;
                }

                else {
                    dp[i][j] = Math.max(dp[i-1][j-1], dp[i-1][j]) + current;
                }
            }
        }

        int answer = 0;
        for ( int num : dp[n-1]) {
            answer = Math.max(answer, num);
        }

        return answer;
    }
}
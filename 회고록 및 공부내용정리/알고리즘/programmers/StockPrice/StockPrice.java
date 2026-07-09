import java.util.*;

class Solution {
    public int[] solution(int[] prices) {
        int n = prices.length;
        int[] answer = new int[n];
        Deque<Integer> st = new ArrayDeque<>();

        for ( int i = 0; i < n; i++ ) {
            while (!st.isEmpty() && prices[st.peekLast()] > prices[i]) {
                int idx = st.removeLast();
                answer[idx] = i - idx;
            }
            st.addLast(i);
        }

        while ( !st.isEmpty()) {
            int idx = st.removeLast();
            answer[idx] = n - 1 - idx;
        }

        return answer;
    }
}
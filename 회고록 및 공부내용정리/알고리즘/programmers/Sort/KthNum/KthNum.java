import java.util.*;

class Solution {
    public int[] solution(int[] array, int[][] commands) {
        int[] answer = new int[commands.length];;
        int idx = 0;
        
        for (int[] command : commands) {
            
            int[] new_array = Arrays.copyOfRange(array, command[0]-1, command[1] );
            Arrays.sort(new_array);
            answer[idx++] = new_array[command[2] - 1];
        }
        
        return answer;    
    }
}

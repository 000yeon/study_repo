import java.util.HashSet;

class Solution {
    public int solution(int[] nums) {
        HashSet<Integer> kinds = new HashSet<>();
        
        for ( int num : nums) {
            kinds.add(num);
        }
        
        int uniqueKinds = kinds.size();
        int canPicks = nums.length / 2;
        
        return Math.min(uniqueKinds, canPicks);
    }
}
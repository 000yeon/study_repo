import java.util.Map;
import java.util.HashMap;

class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();

    for ( int i = 0; i < nums.length; i++ ) {
      int otherNum = target - nums[i];

      if (map.containsKey(otherNum)) {
          return new int[] { map.get(otherNum), i};
      }

      map.put(nums[i], i);
    }  

    return new int[0];
  }
}
import java.util.*;

class Solution {
    public boolean solution(String[] phone_book) {
        
        Map<String, Boolean> phoneBookMap = new HashMap<>();
        
        for (String number : phone_book) {
            phoneBookMap.put(number, true);
        }
        
        for (String number: phone_book) {
            for (int i = 1; i < number.length(); i++ ) {
                String prefix = number.substring(0, i);
                if ( phoneBookMap.containsKey(prefix) ) {
                    return false;
                }
            }
        }
        
        return true;
    }
}
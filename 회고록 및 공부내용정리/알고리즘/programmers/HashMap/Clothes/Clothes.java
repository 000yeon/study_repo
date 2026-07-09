
import java.util.Map;
import java.util.HashMap;

class Solution {
    public int solution(String[][] clothes) {
        
        Map<String, Integer> clothesMap = new HashMap<String, Integer>();
        int result = 1;
        
        for ( String[] clothes_data : clothes) {
            String type = clothes_data[1];
            if ( clothesMap.containsKey(type) ) {
                clothesMap.put(type, clothesMap.get(type) + 1);
            } else {
                clothesMap.put(type, 1);
            }
        }
                        
        for (int types : clothesMap.values() ) {
            result = result * ( types + 1 );
        }
        
        return result - 1;
        
    }
}
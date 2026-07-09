function solution(clothes) {
  // 최초 1
  let answer = 1;
  const clothesMap = new Map();
  
  clothes.forEach((data) => {
      const type = data[1];
      if (!clothesMap.has(type)) {
          clothesMap.set(type, 1);   
      } else {
          clothesMap.set(type, clothesMap.get(type) + 1)
      }   
  })
  
  for( const methods of clothesMap.values()) {
      answer *= methods + 1;
  }

  
  // 모두 안입었을 때
  return answer - 1;
}
function solution(citations) {
  let answer = 0;
  
  for( let i = citations.length; i > 0; i --) {
      let h = citations.filter(a => a >= i).length;
      
      if( h >= i ) {
          answer = i;
          break;
      }
  }

  return answer;
}
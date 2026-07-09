function solution(s){

  const map = new Map([
    ["(", ")"],
    ["[", "]"],
    ["{", "}"]
  ]);
  
  const stack = [];
  
  for( const bracket of s ) {
      if ( map.has(bracket) ) {
          stack.push(bracket);
      } else {
          const last = stack.pop();
          if( bracket !== map.get(last)) return false;
      }
  }
  
  return stack.length === 0;
}
function solution(phone_book) {
    
  const phoneBookSet = new Set(phone_book);
  
  for (const number of phone_book) {
      for ( let i = 1; i < number.length; i++) {
          
          const prefix = number.substring(0, i);
          
          if ( phoneBookSet.has(prefix) ) {
              return false;
          }
      }
  }
  return true;
}
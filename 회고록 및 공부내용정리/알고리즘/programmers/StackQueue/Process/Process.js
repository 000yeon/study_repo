function solution(priorities, location) {
  const queue = priorities.map((priority, index) => [priority, index]);
  let order = 0; // 실행 순서 카운트
  
  while ( queue.length > 0 ) {
      // 1. queue에서 하나 꺼내기
      const [priority, index] = queue.shift();

      const highPriority = queue.some(([p]) => p > priority);
      
      if (highPriority) {
         // 2. queue에서 대기중인 프로세스 중 우선 순위가 더 높은 프로세스가 있다면 방금 꺼낸걸 다시 넣는다.
          queue.push([priority, index]);
      } else {
          order++;
          
          if ( location === index ) {
              return order;
          }
      }
  }
  
  
}
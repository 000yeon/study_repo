function solution(prices) {
    const n = prices.length;
    const answer = Array(n).fill(0);
    const stack = [];

    for ( let i = 0; i < n; i++ ) {
        // 현재 가격이 직전 가격에 비해 떨어 졌다면 떨어진 애들 마감
        while ( stack.length && prices[stack[stack.length - 1]] > prices[i]) {
            const idx = stack.pop();
            answer[idx] = i - idx;
        }

        stack.push(i);
    }

    // 끝까지 안 떨어진 것들 정의
    while ( stack.length ) {
        const idx = stack.pop();
        answer[idx] = n - 1 - idx;
    }

    return answer;
}
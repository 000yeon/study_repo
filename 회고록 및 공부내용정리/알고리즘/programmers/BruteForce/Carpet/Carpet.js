function solution(brown, yellow) {
    var answer = [];
    let x = 0;
    
    for(let i = yellow; i >= 1; i--) {
        x = Math.floor(yellow / i);
        
        if(yellow % x == 0 && ((x + 2) * ( i + 2) == (brown + yellow))) {
            answer =  [x + 2 , i + 2];
        }
    }
    
    return answer;
}
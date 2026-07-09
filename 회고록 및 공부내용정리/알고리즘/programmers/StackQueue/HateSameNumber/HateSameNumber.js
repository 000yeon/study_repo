function solution(arr)
{
    const answer = [];
    
    for ( const number of arr ) {
        if ( answer.length === 0 || answer[answer.length - 1] !== number ) {
            answer.push(number);
        }
    }
    
    return answer;
}
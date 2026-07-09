function solution(answers) {
    const scores = [0,0,0];
    
    const firstPerson = [1,2,3,4,5];
    const secondPerson = [2,1,2,3,2,4,2,5];
    const thirdPerson = [3,3,1,1,2,2,4,4,5,5];
    
    for ( let i = 0; i < answers.length; i++ ) {
        if ( answers[i] === firstPerson[i % firstPerson.length]) scores[0]++;
        if ( answers[i] === secondPerson[i % secondPerson.length]) scores[1]++;
        if ( answers[i] === thirdPerson[i % thirdPerson.length]) scores[2]++;
    }
    
    const max_score = Math.max(...scores);
    
    const answer = [];
    
    for (const [i,score] of scores.entries()) {
        if ( score === max_score) answer.push(i+1);
    }
    
    return answer;
}
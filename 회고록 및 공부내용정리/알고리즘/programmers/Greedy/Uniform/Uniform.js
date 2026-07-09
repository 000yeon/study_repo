function solution(n, lost, reserve) {
    var answer = 0;

    let clothes = new Array(n).fill(1);

    for(num of lost) {
         clothes[num - 1]--;
    }

    for(num of reserve) {
         clothes[num - 1]++;
    }

    clothes.forEach((el, idx) => {
        console.log(el, idx);
        if(clothes[idx] > 1 && clothes[idx-1] === 0) {
            clothes[idx]--;
            clothes[idx-1]++;
        }

        else if(clothes[idx] > 1 && clothes[idx+1] === 0) {
            clothes[idx]--;
            clothes[idx+1]++;
        }
    })

    answer = clothes.filter(x => x > 0).length;
    return answer;
}
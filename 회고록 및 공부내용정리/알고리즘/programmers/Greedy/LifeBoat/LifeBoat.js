function solution(people, limit) {
    var answer = 0;
    let left = 0, right = 0;


    people.sort(function(a, b)  {
      return a - b;
    });

    right = people.length - 1;

    while(left < right) {
        answer++;

        if(people[left] + people[right] > limit) {
            right--;
        } else {
            left++;
            right--;
        }

    }


    if(left == right) {
        answer++;
    }

    return answer;
}
function solution(name) {
    let move = 0;
    let length = name.length;
    let minMove = length - 1;

    for ( let i = 0; i < length; i++) {

        // 검색
        console.log(name.charCodeAt(i));
        console.log('A'.charCodeAt(0));
        let setAlphabet = Math.min(name.charCodeAt(i) - 'A'.charCodeAt(0),
                              'Z'.charCodeAt(0) - name.charCodeAt(i) + 1);

        move += setAlphabet;

        let next = i + 1;
        while ( next < length && name[next] === 'A') {
            next++;
        }

        minMove = Math.min(minMove,
                           i + (length - next) + Math.min(i, length - next));
    }

    return move + minMove;
}
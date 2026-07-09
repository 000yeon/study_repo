// 공백 처리 안됌
// function lengthOfLongestSubstring(s: string): number {
//     const wordsMap = new Map<string, string>();
//     let longestLength = 0;
//
//     for(const i of s) {
//         if(wordsMap.get(i)) {
//             if ( wordsMap.size > longestLength ) {
//                 longestLength = wordsMap.size;
//             }
//             wordsMap.clear();
//             wordsMap.set(i, i);
//
//         } else {
//             wordsMap.set(i, i);
//         }
//     }
//
//     return longestLength;
//
// };


function lengthOfLongestSubstring(s: string): number {
    const lastIndex = new Map<string, number>(); // 문자 -> 최근 인덱스
    let left = 0; // 윈도우 시작
    let best = 0; // 최대 길이

    for ( let right = 0; right < s.length; right++ ) {
        const ch = s[right];

        // ch 가 현재 윈도우에 있다면 left를 오른쪽으로 이동
        if ( lastIndex.has(ch) && lastIndex.get(ch)! >= left ) {
            left = lastIndex.get(ch)! + 1;
        }

        lastIndex.set(ch, right);
        best = Math.max(best, right - left + 1);
    }

    return best;
};


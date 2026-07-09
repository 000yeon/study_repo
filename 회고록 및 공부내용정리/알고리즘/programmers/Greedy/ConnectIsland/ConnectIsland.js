function solution(n, costs) {
    // 비용 기준 정렬
    costs.sort((a, b) => a[2] - b[2]);
    let parent = Array(n).fill(0).map((_, index) => index);

    // 특정 노드의 루트(parent)를 찾는 함수 -> 특정 노드가 연결된 루트
    function find(x) {
        if (parent[x] === x) return x;
        return parent[x] = find(parent[x]);
    }

    // 두 개의 노드를 연결하는 함수
    function union(a, b) {
        let rootA = find(a);
        let rootB = find(b);
        console.log('rooA, rooB', rootA, rootB);
        if (rootA !== rootB) parent[rootB] = rootA;
        console.log(parent);
    }

    let totalCost = 0;  // 최소 비용 저장
    let lineCount = 0;   // 연결된 간선 수

    // 간선을 하나씩 선택하면서 MST 구성
    for (let [a, b, cost] of costs) {
        if (find(a) !== find(b)) {  // 서로 연결되지 않은 경우에만 추가
            union(a, b);
            totalCost += cost;
            lineCount++;
        }

        // MST 완성 조건: 간선의 개수 = (노드 수 - 1)
        if (lineCount === n - 1) break;
    }

    return totalCost;
}
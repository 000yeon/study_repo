function solution(n, computers) {
    const visited = Array(n).fill(false);
    let answer = 0;

    function dfs(node) {
        // 현재 노드 방문 처리
        visited[node] = true;

        // 이 노드와 연결된 다른 노드를 탐색
        for ( let next = 0; next < n; next++ ) {
            // 자기 자신이 아니고, 연결되어있으며 아직 방문 전이면
            if (computers[node][next] === 1 && !visited[next]) {
                dfs(next);
            }
        }
    }

    // 모든 컴퓨터에 대해 방문 체크 여부
    for ( let i = 0; i < n; i++) {
        if(!visited[i]) {
            // i번 컴퓨터를 시작점으로 한 dfs는 i가 속한 네트워크 전체를 방문
            dfs(i);
            answer++; // 하나의 네트워크를 찾았으므로 + 1
        }
    }

    return answer;
}
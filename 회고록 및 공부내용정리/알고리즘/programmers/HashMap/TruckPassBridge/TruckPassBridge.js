function solution(bridge_length, weight, truck_weights) {
    const bridge = Array(bridge_length).fill(0);
    let time = 0;
    let currentWeight = 0; // 다리 위 총 무게

    while (truck_weights.length > 0 || currentWeight > 0) {
        // 1) 한 칸 전진 - 맨 앞 트럭이 다리에서 내려감
        const out = bridge.shift();
        currentWeight -= out;

        // 2) 다음 트럭을 올릴 수 있으면 올리고, 아니면 0
        if ( truck_weights.length > 0 ) {
          const next = truck_weights[0];
          if (currentWeight + next <= weight) {
            bridge.push(next);
            currentWeight += next;
            truck_weights.shift();
          } else {
            bridge.push(0);
          }
        } else {
            // 더 올릴 트럭이 없으면
            bridge.push(0);
        }

        time++;
    }

    return time;
}
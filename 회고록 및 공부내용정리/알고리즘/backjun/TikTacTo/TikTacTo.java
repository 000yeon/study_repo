import java.io.*;

public class TikTacTo {

    // --- 특정 플레이어(c)가 3칸을 이었는지 확인하는 함수 ---
    static boolean win(char[] b, char c) {
        // 가능한 8가지 승리 라인 인덱스
        int[][] lines = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // 가로 3줄
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // 세로 3줄
            {0, 4, 8}, {2, 4, 6}              // 대각선 2줄
        };

        for (int[] ln : lines) {
            if (b[ln[0]] == c && b[ln[1]] == c && b[ln[2]] == c)
                return true; // 3칸이 모두 같은 기호일 경우 승리
        }
        return false;
    }

    // --- 현재 상태 문자열이 유효한 게임 종료 상태인지 검사 ---
    static boolean isValid(String s) {
        if (s.length() != 9) return false;
        char[] b = s.toCharArray();

        int cntX = 0, cntO = 0, cntDot = 0;
        for (char ch : b) {
            if (ch == 'X') cntX++;
            else if (ch == 'O') cntO++;
            else if (ch == '.') cntDot++;
            else return false; // 잘못된 문자 방지
        }

        // 1️⃣ 기본 턴 규칙 확인
        // X는 항상 먼저 두기 때문에 X의 수는 O의 수와 같거나 1개 많아야 함
        if (!(cntX == cntO || cntX == cntO + 1))
            return false;

        // 2️⃣ 승리 여부 확인
        boolean xWin = win(b, 'X');
        boolean oWin = win(b, 'O');

        // 3️⃣ 동시에 승리하는 건 불가능
        if (xWin && oWin) return false;

        // 4️⃣ 각 승리 조건별로 가능한 턴 조합인지 확인
        if (xWin) {
            // X가 이겼다면 X가 한 수 더 많아야 함
            return cntX == cntO + 1;
        } else if (oWin) {
            // O가 이겼다면 X와 O의 수가 같아야 함
            return cntX == cntO;
        } else {
            // 5️⃣ 아무도 이기지 못했다면, 게임은 꽉 찬 상태여야 함
            // 즉, 무승부: X 5개, O 4개, 빈칸 0개
            return cntDot == 0 && cntX == 5 && cntO == 4;
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = br.readLine()) != null) {
            line = line.trim();
            if (line.equals("end")) break;

            if (isValid(line)) sb.append("valid\n");
            else sb.append("invalid\n");
        }

        System.out.print(sb);
    }
}
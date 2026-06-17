# 0488. Zuma Game

---
编号: 488
题目: Zuma Game
难度: 困难
标签: [栈, 广度优先搜索, 记忆化, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/zuma-game/
---

## 题目描述

你正在参与祖玛游戏的一个变种。

在这个祖玛游戏变体中，桌面上有 **一排** 彩球，每个球的颜色可能是：红色 `'R'`、黄色 `'Y'`、蓝色 `'B'`、绿色 `'G'` 或白色 `'W'` 。你的手中也有一些彩球。

你的目标是 **清空** 桌面上所有的球。每一回合：

- 从你手上的彩球中选出 **任意一颗** ，然后将其插入桌面上那一排球中：两球之间或这一排球的任一端。

- 接着，如果有出现 **三个或者三个以上** 且 **颜色相同** 的球相连的话，就把它们移除掉。

- 如果这种移除操作同样导致出现三个或者三个以上且颜色相同的球相连，则可以继续移除这些球，直到不再满足移除条件。

- 如果桌面上所有球都被移除，则认为你赢得本场游戏。

- 重复这个过程，直到你赢了游戏或者手中没有更多的球。

给你一个字符串 `board` ，表示桌面上最开始的那排球。另给你一个字符串 `hand` ，表示手里的彩球。请你按上述操作步骤移除掉桌上所有球，计算并返回所需的 **最少** 球数。如果不能移除桌上所有的球，返回 `-1` 。

**示例 1：**

```text
输入：board = "WRRBBW", hand = "RB"
输出：-1
解释：无法移除桌面上的所有球。可以得到的最好局面是：
- 插入一个 'R' ，使桌面变为 WRRRBBW 。WRRRBBW -> WBBW
- 插入一个 'B' ，使桌面变为 WBBBW 。WBBBW -> WW
桌面上还剩着球，没有其他球可以插入。
```

**示例 2：**

```text
输入：board = "WWRRBBWW", hand = "WRBRW"
输出：2
解释：要想清空桌面上的球，可以按下述步骤：
- 插入一个 'R' ，使桌面变为 WWRRRBBWW 。WWRRRBBWW -> WWBBWW
- 插入一个 'B' ，使桌面变为 WWBBBWW 。WWBBBWW -> WWWW -> empty
只需从手中出 2 个球就可以清空桌面。
```

**示例 3：**

```text
输入：board = "G", hand = "GGGGG"
输出：2
解释：要想清空桌面上的球，可以按下述步骤：
- 插入一个 'G' ，使桌面变为 GG 。
- 插入一个 'G' ，使桌面变为 GGG 。GGG -> empty
只需从手中出 2 个球就可以清空桌面。
```

**示例 4：**

```text
输入：board = "RBYYBBRRB", hand = "YRBGB"
输出：3
解释：要想清空桌面上的球，可以按下述步骤：
- 插入一个 'Y' ，使桌面变为 RBYYYBBRRB 。RBYYYBBRRB -> RBBBRRB -> RRRB -> B
- 插入一个 'B' ，使桌面变为 BB 。
- 插入一个 'B' ，使桌面变为 BBB 。BBB -> empty
只需从手中出 3 个球就可以清空桌面。
```

**提示：**

- `1 <= board.length <= 16`

- `1 <= hand.length <= 5`

- `board` 和 `hand` 由字符 `'R'`、`'Y'`、`'B'`、`'G'` 和 `'W'` 组成

- 桌面上一开始的球中，不会有三个及三个以上颜色相同且连着的球

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 广度优先搜索, 记忆化, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Java

```java
// Zuma Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMinStep(String board, String hand) {
        final Zuma zuma = Zuma.create(board, hand);
        final HashSet<Long> visited = new HashSet<>();
        final ArrayList<Zuma> init = new ArrayList<>();

        visited.add(zuma.board());
        init.add(zuma);
        return bfs(init, 0, visited);
    }

    private int bfs(ArrayList<Zuma> curr, int k, HashSet<Long> visited) {
        if (curr.isEmpty()) {
            return -1;
        }

        final ArrayList<Zuma> next = new ArrayList<>();

        for (Zuma zuma : curr) {
            ArrayList<Zuma> neib = zuma.getNextLevel(k, visited);
            if (neib == null) {
                return k + 1;
            }

            next.addAll(neib);
        }
        return bfs(next, k + 1, visited);
    }
}

record Zuma(long board, long hand) {
    public static Zuma create(String boardStr, String handStr) {
        return new Zuma(Zuma.encode(boardStr, false), Zuma.encode(handStr, true));
    }

    public ArrayList<Zuma> getNextLevel(int depth, HashSet<Long> visited) {
        final ArrayList<Zuma> next = new ArrayList<>();
        final ArrayList<long[]> handList = this.buildHandList();
        final long[] boardList = new long[32];
        final int size = this.buildBoardList(boardList);

        for (long[] pair : handList) {
            for (int i = 0; i < size; ++i) {
                final long rawBoard = pruningCheck(boardList[i], pair[0], i * 3, depth);
                if (rawBoard == -1) {
                    continue;
                }

                final long nextBoard = updateBoard(rawBoard);
                if (nextBoard == 0) {
                    return null;
                }

                if (pair[1] == 0 || visited.contains(nextBoard)) {
                    continue;
                }

                visited.add(nextBoard);
                next.add(new Zuma(nextBoard, pair[1]));
            }
        }
        return next;
    }

    private long pruningCheck(long insBoard, long ball, int pos, int depth) {
        final long L = (insBoard >> (pos + 3)) & 0x7;
        final long R = (insBoard >> (pos - 3)) & 0x7;

        if (depth == 0 && (ball != R) && (L != R) || depth > 0 && (ball != R)) {
            return -1;
        }
        return insBoard | (ball << pos);
    }

    private long updateBoard(long board) {
        long stack = 0;

        for (int i = 0; i < 64; i += 3) {
            final long curr = (board >> i) & 0x7;
            final long top = (stack) &0x7;

            // pop (if possible)
            if ((top > 0) && (curr != top) && (stack & 0x3F) == ((stack >> 3) & 0x3F)) {
                stack >>= 9;
                if ((stack & 0x7) == top) stack >>= 3;
            }

            if (curr == 0) {
                // done
                break;
            }
            // push and continue
            stack = (stack << 3) | curr;
        }
        return stack;
    }

    private ArrayList<long[]> buildHandList() {
        final ArrayList<long[]> handList = new ArrayList<>();
        long prevBall = 0;
        long ballMask = 0;

        for (int i = 0; i < 16; i += 3) {
            final long currBall = (this.hand >> i) & 0x7;
            if (currBall == 0) {
                break;
            }

            if (currBall != prevBall) {
                prevBall = currBall;
                handList.add(
                    new long[] {currBall, ((this.hand >> 3) & ~ballMask) | (this.hand & ballMask)});
            }
            ballMask = (ballMask << 3) | 0x7;
        }
        return handList;
    }

    private int buildBoardList(long[] buffer) {
        int ptr = 0;
        long ballMask = 0x7;
        long insBoard = this.board << 3;
        buffer[ptr++] = insBoard;

        while (true) {
            final long currBall = this.board & ballMask;
            if (currBall == 0) {
                break;
            }

            ballMask <<= 3;
            insBoard = (insBoard | currBall) & ~ballMask;
            buffer[ptr++] = insBoard;
        }
        return ptr;
    }

    private static long encode(String stateStr, boolean sortFlag) {
        final char[] stateChars = stateStr.toCharArray();
        if (sortFlag) {
            Arrays.sort(stateChars);
        }

        long stateBits = 0;
        for (char ch : stateChars) {
            stateBits = (stateBits << 3) | Zuma.encode(ch);
        }
        return stateBits;
    }

    private static long encode(char ch) {
        return switch (ch) {
            case 'R' -> 0x1;
            case 'G' -> 0x2;
            case 'B' -> 0x3;
            case 'W' -> 0x4;
            case 'Y' -> 0x5;
            case ' ' -> 0x0;
            default  ->
                throw new IllegalArgumentException("Invalid char: " + ch);
        };
    }
}
```

### Python

```python
# Zuma Game：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMinStep(self, board: str, hand: str) -> int:
        def remove(s):
            while len(s):
                next = re.sub(r'B{3,}|G{3,}|R{3,}|W{3,}|Y{3,}', '', s)
                if len(next) == len(s):
                    break
                s = next
            return s

        visited = set()
        q = deque([(board, hand)])
        while q:
            state, balls = q.popleft()
            if not state:
                return len(hand) - len(balls)
            for ball in set(balls):
                b = balls.replace(ball, '', 1)
                for i in range(1, len(state) + 1):
                    s = state[:i] + ball + state[i:]
                    s = remove(s)
                    if s not in visited:
                        visited.add(s)
                        q.append((s, b))
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

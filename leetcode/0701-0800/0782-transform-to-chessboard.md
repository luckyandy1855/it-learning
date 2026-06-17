# 0782. Transform to Chessboard

---
编号: 782
题目: Transform to Chessboard
难度: 困难
标签: [位运算, 数组, 数学, 矩阵]
来源链接: https://leetcode.com/problems/transform-to-chessboard/
---

## 题目描述

一个 `n x n` 的二维网络 `board` 仅由 `0` 和 `1` 组成 。每次移动，你能交换任意两列或是两行的位置。

返回 *将这个矩阵变为**  “棋盘”  **所需的最小移动次数 *。如果不存在可行的变换，输出 `-1`。

**“棋盘”** 是指任意一格的上下左右四个方向的值均与本身不同的矩阵。

**示例 1:**

```text
输入: board = [[0,1,1,0],[0,1,1,0],[1,0,0,1],[1,0,0,1]]
输出: 2
解释:一种可行的变换方式如下，从左到右：
第一次移动交换了第一列和第二列。
第二次移动交换了第二行和第三行。
```

**示例 2:**

```text
输入: board = [[0, 1], [1, 0]]
输出: 0
解释: 注意左上角的格值为0时也是合法的棋盘，也是合法的棋盘.
```

**示例 3:**

```text
输入: board = [[1, 0], [1, 0]]
输出: -1
解释: 任意的变换都不能使这个输入变为合法的棋盘。
```

**提示：**

- `n == board.length`

- `n == board[i].length`

- `2 <= n <= 30`

- `board[i][j]` 将只包含 `0`或 `1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 数学, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

在一个有效的棋盘中，有且仅有两种“行”。

例如，如果棋盘中有一行为“01010011”，那么任何其它行只能为“01010011”或者“10101100”。列也满足这种性质。

另外，每一行和每一列都有一半 $0$ 和一半 $1$。假设棋盘为 $n \times n$：

- 若 $n = 2 \times k$，则每一行和每一列都有 $k$ 个 $1$ 和 $k$ 个 $0$。
- 若 $n = 2 \times k + 1$，则每一行都有 $k$ 个 $1$ 和 $k + 1$ 个 $0$，或者 $k + 1$ 个 $1$ 和 $k$ 个 $0$。

基于以上的结论，我们可以判断一个棋盘是否有效。若有效，可以计算出最小的移动次数。

若 $n$ 为偶数，最终的合法棋盘有两种可能，即第一行的元素为“010101...”，或者“101010...”。我们计算出这两种可能所需要交换的次数的较小值作为答案。

若 $n$ 为奇数，那么最终的合法棋盘只有一种可能。如果第一行中 $0$ 的数目大于 $1$，那么最终一盘的第一行只能是“01010...”，否则就是“10101...”。同样算出次数作为答案。

时间复杂度 $O(n^2)$，其中 $n$ 是棋盘的大小。空间复杂度 $O(1)$。

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

### Go

```go
// Transform to Chessboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func movesToChessboard(board [][]int) int {
	n := len(board)
	mask := (1 << n) - 1
	rowMask, colMask := 0, 0
	for i := 0; i < n; i++ {
		rowMask |= board[0][i] << i
		colMask |= board[i][0] << i
	}
	revRowMask := mask ^ rowMask
	revColMask := mask ^ colMask
	sameRow, sameCol := 0, 0
	for i := 0; i < n; i++ {
		curRowMask, curColMask := 0, 0
		for j := 0; j < n; j++ {
			curRowMask |= board[i][j] << j
			curColMask |= board[j][i] << j
		}
		if curRowMask != rowMask && curRowMask != revRowMask {
			return -1
		}
		if curColMask != colMask && curColMask != revColMask {
			return -1
		}
		if curRowMask == rowMask {
			sameRow++
		}
		if curColMask == colMask {
			sameCol++
		}
	}
	f := func(mask, cnt int) int {
		ones := bits.OnesCount(uint(mask))
		if n%2 == 1 {
			if abs(n-ones*2) != 1 || abs(n-cnt*2) != 1 {
				return -1
			}
			if ones == n/2 {
				return n/2 - bits.OnesCount(uint(mask&0xAAAAAAAA))
			}
			return (n+1)/2 - bits.OnesCount(uint(mask&0x55555555))
		} else {
			if ones != n/2 || cnt != n/2 {
				return -1
			}
			cnt0 := n/2 - bits.OnesCount(uint(mask&0xAAAAAAAA))
			cnt1 := n/2 - bits.OnesCount(uint(mask&0x55555555))
			return min(cnt0, cnt1)
		}
	}
	t1 := f(rowMask, sameRow)
	t2 := f(colMask, sameCol)
	if t1 == -1 || t2 == -1 {
		return -1
	}
	return t1 + t2
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Transform to Chessboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;

    public int movesToChessboard(int[][] board) {
        n = board.length;
        int mask = (1 << n) - 1;
        int rowMask = 0, colMask = 0;
        for (int i = 0; i < n; ++i) {
            rowMask |= board[0][i] << i;
            colMask |= board[i][0] << i;
        }
        int revRowMask = mask ^ rowMask;
        int revColMask = mask ^ colMask;
        int sameRow = 0, sameCol = 0;
        for (int i = 0; i < n; ++i) {
            int curRowMask = 0, curColMask = 0;
            for (int j = 0; j < n; ++j) {
                curRowMask |= board[i][j] << j;
                curColMask |= board[j][i] << j;
            }
            if (curRowMask != rowMask && curRowMask != revRowMask) {
                return -1;
            }
            if (curColMask != colMask && curColMask != revColMask) {
                return -1;
            }
            sameRow += curRowMask == rowMask ? 1 : 0;
            sameCol += curColMask == colMask ? 1 : 0;
        }
        int t1 = f(rowMask, sameRow);
        int t2 = f(colMask, sameCol);
        return t1 == -1 || t2 == -1 ? -1 : t1 + t2;
    }

    private int f(int mask, int cnt) {
        int ones = Integer.bitCount(mask);
        if (n % 2 == 1) {
            if (Math.abs(n - ones * 2) != 1 || Math.abs(n - cnt * 2) != 1) {
                return -1;
            }
            if (ones == n / 2) {
                return n / 2 - Integer.bitCount(mask & 0xAAAAAAAA);
            }
            return (n / 2 + 1) - Integer.bitCount(mask & 0x55555555);
        } else {
            if (ones != n / 2 || cnt != n / 2) {
                return -1;
            }
            int cnt0 = n / 2 - Integer.bitCount(mask & 0xAAAAAAAA);
            int cnt1 = n / 2 - Integer.bitCount(mask & 0x55555555);
            return Math.min(cnt0, cnt1);
        }
    }
}
```

### Python

```python
# Transform to Chessboard：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def movesToChessboard(self, board: List[List[int]]) -> int:
        def f(mask, cnt):
            ones = mask.bit_count()
            if n & 1:
                if abs(n - 2 * ones) != 1 or abs(n - 2 * cnt) != 1:
                    return -1
                if ones == n // 2:
                    return n // 2 - (mask & 0xAAAAAAAA).bit_count()
                return (n + 1) // 2 - (mask & 0x55555555).bit_count()
            else:
                if ones != n // 2 or cnt != n // 2:
                    return -1
                cnt0 = n // 2 - (mask & 0xAAAAAAAA).bit_count()
                cnt1 = n // 2 - (mask & 0x55555555).bit_count()
                return min(cnt0, cnt1)

        n = len(board)
        mask = (1 << n) - 1
        rowMask = colMask = 0
        for i in range(n):
            rowMask |= board[0][i] << i
            colMask |= board[i][0] << i
        revRowMask = mask ^ rowMask
        revColMask = mask ^ colMask
        sameRow = sameCol = 0
        for i in range(n):
            curRowMask = curColMask = 0
            for j in range(n):
                curRowMask |= board[i][j] << j
                curColMask |= board[j][i] << j
            if curRowMask not in (rowMask, revRowMask) or curColMask not in (
                colMask,
                revColMask,
            ):
                return -1
            sameRow += curRowMask == rowMask
            sameCol += curColMask == colMask
        t1 = f(rowMask, sameRow)
        t2 = f(colMask, sameCol)
        return -1 if t1 == -1 or t2 == -1 else t1 + t2
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

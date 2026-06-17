# 1222. Queens That Can Attack the King

---
编号: 1222
题目: Queens That Can Attack the King
难度: 中等
标签: [数组, 矩阵, 模拟]
来源链接: https://leetcode.com/problems/queens-that-can-attack-the-king/
---

## 题目描述

在一个 **下标从 0 开始** 的 `8 x 8` 棋盘上，可能有多个黑皇后和一个白国王。

给你一个二维整数数组 `queens`，其中 `queens[i] = [xQueeni, yQueeni]` 表示第 `i` 个黑皇后在棋盘上的位置。还给你一个长度为 `2` 的整数数组 `king`，其中 `king = [xKing, yKing]` 表示白国王的位置。

返回 *能够直接攻击国王的黑皇后的坐标*。你可以以 **任何顺序** 返回答案。

**示例 1：**

```text
输入：queens = [[0,1],[1,0],[4,0],[0,4],[3,3],[2,4]], king = [0,0]
输出：[[0,1],[1,0],[3,3]]
解释：上面的图示显示了三个可以直接攻击国王的皇后和三个不能攻击国王的皇后（用红色虚线标记）。
```

**示例 2：**

****

```text
输入：queens = [[0,0],[1,1],[2,2],[3,4],[3,5],[4,4],[4,5]], king = [3,3]
输出：[[2,2],[3,4],[4,4]]
解释：上面的图示显示了三个能够直接攻击国王的黑皇后和三个不能攻击国王的黑皇后（用红色虚线标记）。
```

**提示：**

- `1 i, yQueeni, xKing, yKing < 8`

- 所有给定的位置都是 **唯一** 的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 矩阵, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先将所有皇后的位置存入哈希表或者二维数组 $s$ 中。

接下来，我们从国王的位置开始，依次向上、下、左、右、左上、右上、左下、右下八个方向搜索，如果某个方向上存在皇后，那么就将其位置加入答案中，并且停止继续搜索该方向。

搜索结束后，返回答案即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。本题中 $n = 8$。

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
// Queens That Can Attack the King：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func queensAttacktheKing(queens [][]int, king []int) (ans [][]int) {
	n := 8
	s := [8][8]bool{}
	for _, q := range queens {
		s[q[0]][q[1]] = true
	}
	for a := -1; a <= 1; a++ {
		for b := -1; b <= 1; b++ {
			if a != 0 || b != 0 {
				x, y := king[0]+a, king[1]+b
				for 0 <= x && x < n && 0 <= y && y < n {
					if s[x][y] {
						ans = append(ans, []int{x, y})
						break
					}
					x += a
					y += b
				}
			}
		}
	}
	return
}
```

### Java

```java
// Queens That Can Attack the King：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> queensAttacktheKing(int[][] queens, int[] king) {
        final int n = 8;
        var s = new boolean[n][n];
        for (var q : queens) {
            s[q[0]][q[1]] = true;
        }
        List<List<Integer>> ans = new ArrayList<>();
        for (int a = -1; a <= 1; ++a) {
            for (int b = -1; b <= 1; ++b) {
                if (a != 0 || b != 0) {
                    int x = king[0] + a, y = king[1] + b;
                    while (x >= 0 && x < n && y >= 0 && y < n) {
                        if (s[x][y]) {
                            ans.add(List.of(x, y));
                            break;
                        }
                        x += a;
                        y += b;
                    }
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Queens That Can Attack the King：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def queensAttacktheKing(
        self, queens: List[List[int]], king: List[int]
    ) -> List[List[int]]:
        n = 8
        s = {(i, j) for i, j in queens}
        ans = []
        for a in range(-1, 2):
            for b in range(-1, 2):
                if a or b:
                    x, y = king
                    while 0 <= x + a < n and 0 <= y + b < n:
                        x, y = x + a, y + b
                        if (x, y) in s:
                            ans.append([x, y])
                            break
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

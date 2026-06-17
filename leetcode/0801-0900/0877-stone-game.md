# 0877. Stone Game

---
编号: 877
题目: Stone Game
难度: 中等
标签: [数组, 数学, 动态规划, 博弈]
来源链接: https://leetcode.com/problems/stone-game/
---

## 题目描述

Alice 和 Bob 用几堆石子在做游戏。一共有偶数堆石子，**排成一行**；每堆都有 **正** 整数颗石子，数目为 `piles[i]` 。

游戏以谁手中的石子最多来决出胜负。石子的 **总数** 是 **奇数** ，所以没有平局。

Alice 和 Bob 轮流进行，**Alice 先开始** 。 每回合，玩家从行的 **开始** 或 **结束** 处取走整堆石头。 这种情况一直持续到没有更多的石子堆为止，此时手中 **石子最多** 的玩家 **获胜** 。

假设 Alice 和 Bob 都发挥出最佳水平，当 Alice 赢得比赛时返回 `true` ，当 Bob 赢得比赛时返回 `false` 。

**示例 1：**

```text
输入：piles = [5,3,4,5]
输出：true
解释：
Alice 先开始，只能拿前 5 颗或后 5 颗石子 。
假设他取了前 5 颗，这一行就变成了 [3,4,5] 。
如果 Bob 拿走前 3 颗，那么剩下的是 [4,5]，Alice 拿走后 5 颗赢得 10 分。
如果 Bob 拿走后 5 颗，那么剩下的是 [3,4]，Alice 拿走后 4 颗赢得 9 分。
这表明，取前 5 颗石子对 Alice 来说是一个胜利的举动，所以返回 true 。
```

**示例 2：**

```text
输入：piles = [3,7,2,3]
输出：true
```

**提示：**

- `2 <= piles.length <= 500`

- `piles.length` 是 **偶数**

- `1 <= piles[i] <= 500`

- `sum(piles[i])` 是 **奇数**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 博弈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(i, j)$，表示从第 $i$ 堆石子到第 $j$ 堆石子，当前玩家与另一个玩家的石子数量之差的最大值。那么答案就是 $dfs(0, n - 1) \gt 0$。

函数 $dfs(i, j)$ 的计算方法如下：

- 如果 $i \gt j$，说明当前没有石子了，所以当前玩家没有石子可以拿，差值为 $0$，即 $dfs(i, j) = 0$。
- 否则，当前玩家有两种选择，如果选择第 $i$ 堆石子，那么当前玩家与另一个玩家的石子数量之差为 $piles[i] - dfs(i + 1, j)$；如果选择第 $j$ 堆石子，那么当前玩家与另一个玩家的石子数量之差为 $piles[j] - dfs(i, j - 1)$。当前玩家会选择两种情况中差值较大的情况，也就是说 $dfs(i, j) = \max(piles[i] - dfs(i + 1, j), piles[j] - dfs(i, j - 1))$。

最后，我们只需要判断 $dfs(0, n - 1) \gt 0$ 即可。

为了避免重复计算，我们可以使用记忆化搜索的方法，用一个数组 $f$ 记录所有的 $dfs(i, j)$ 的值，当函数再次被调用到时，我们可以直接从 $f$ 中取出答案而不需要重新计算。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 是石子的堆数。

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
// Stone Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func stoneGame(piles []int) bool {
	n := len(piles)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
	}
	var dfs func(i, j int) int
	dfs = func(i, j int) int {
		if i > j {
			return 0
		}
		if f[i][j] == 0 {
			f[i][j] = max(piles[i]-dfs(i+1, j), piles[j]-dfs(i, j-1))
		}
		return f[i][j]
	}
	return dfs(0, n-1) > 0
}
```

### Java

```java
// Stone Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] piles;
    private int[][] f;

    public boolean stoneGame(int[] piles) {
        this.piles = piles;
        int n = piles.length;
        f = new int[n][n];
        return dfs(0, n - 1) > 0;
    }

    private int dfs(int i, int j) {
        if (i > j) {
            return 0;
        }
        if (f[i][j] != 0) {
            return f[i][j];
        }
        return f[i][j] = Math.max(piles[i] - dfs(i + 1, j), piles[j] - dfs(i, j - 1));
    }
}
```

### Python

```python
# Stone Game：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def stoneGame(self, piles: List[int]) -> bool:
        @cache
        def dfs(i: int, j: int) -> int:
            if i > j:
                return 0
            return max(piles[i] - dfs(i + 1, j), piles[j] - dfs(i, j - 1))

        return dfs(0, len(piles) - 1) > 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

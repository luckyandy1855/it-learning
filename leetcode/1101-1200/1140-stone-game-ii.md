# 1140. Stone Game II

---
编号: 1140
题目: Stone Game II
难度: 中等
标签: [数组, 数学, 动态规划, 博弈, 前缀和]
来源链接: https://leetcode.com/problems/stone-game-ii/
---

## 题目描述

Alice 和 Bob 继续他们的石子游戏。许多堆石子 **排成一行**，每堆都有正整数颗石子 `piles[i]`。游戏以谁手中的石子最多来决出胜负。

Alice 和 Bob 轮流进行，Alice 先开始。最初，`M = 1`。

在每个玩家的回合中，该玩家可以拿走剩下的 **前** `X` 堆的所有石子，其中 `1 `1 <= piles[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 博弈, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于玩家每次可以拿走前 $X$ 堆的所有石子，也就是说能拿走一个区间的石子，因此，我们可以先预处理出一个长度为 $n+1$ 的前缀和数组 $s$，其中 $s[i]$ 表示数组 `piles` 的前 $i$ 个元素的和。

然后我们设计一个函数 $dfs(i, m)$，表示当前轮到的人可以从数组 `piles` 的下标 $i$ 开始拿，且当前的 $M$ 为 $m$ 时，当前轮到的人能够拿到的最大石子数。初始时爱丽丝从下标 $0$ 开始，且 $M=1$，所以我们需要求的答案为 $dfs(0, 1)$。

函数 $dfs(i, m)$ 的计算过程如下：

- 如果当前轮到的人可以拿走剩下的所有石子，能够拿到的最大石子数为 $s[n] - s[i]$；
- 否则，当前轮到的人可以拿走剩下的前 $x$ 堆的所有石子，其中 $1 \leq x \leq 2m$，能够拿到的最大石子数为 $s[n] - s[i] - dfs(i + x, max(m, x))$。也即是说，当前轮的人能够拿到的石子数为当前剩下的所有石子数减去下一轮对手能够拿到的石子数。我们需要枚举所有的 $x$，取其中的最大值作为函数 $dfs(i, m)$ 的返回值。

为了避免重复计算，我们可以使用记忆化搜索。

最后，我们返回将 $dfs(0, 1)$ 作为答案返回即可。

时间复杂度为 $O(n^3)$，空间复杂度为 $O(n^2)$。其中 $n$ 为数组 `piles` 的长度。

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
// Stone Game II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func stoneGameII(piles []int) int {
	n := len(piles)
	s := make([]int, n+1)
	f := make([][]int, n+1)
	for i, x := range piles {
		s[i+1] = s[i] + x
		f[i] = make([]int, n+1)
	}
	var dfs func(i, m int) int
	dfs = func(i, m int) int {
		if m*2 >= n-i {
			return s[n] - s[i]
		}
		if f[i][m] > 0 {
			return f[i][m]
		}
		f[i][m] = 0
		for x := 1; x <= m<<1; x++ {
			f[i][m] = max(f[i][m], s[n]-s[i]-dfs(i+x, max(m, x)))
		}
		return f[i][m]
	}
	return dfs(0, 1)
}
```

### Java

```java
// Stone Game II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] s;
    private Integer[][] f;
    private int n;

    public int stoneGameII(int[] piles) {
        n = piles.length;
        s = new int[n + 1];
        f = new Integer[n][n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + piles[i];
        }
        return dfs(0, 1);
    }

    private int dfs(int i, int m) {
        if (m * 2 >= n - i) {
            return s[n] - s[i];
        }
        if (f[i][m] != null) {
            return f[i][m];
        }
        int res = 0;
        for (int x = 1; x <= m * 2; ++x) {
            res = Math.max(res, s[n] - s[i] - dfs(i + x, Math.max(m, x)));
        }
        return f[i][m] = res;
    }
}
```

### Python

```python
# Stone Game II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def stoneGameII(self, piles: List[int]) -> int:
        @cache
        def dfs(i, m):
            if m * 2 >= n - i:
                return s[n] - s[i]
            return max(
                s[n] - s[i] - dfs(i + x, max(m, x)) for x in range(1, m << 1 | 1)
            )

        n = len(piles)
        s = list(accumulate(piles, initial=0))
        return dfs(0, 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

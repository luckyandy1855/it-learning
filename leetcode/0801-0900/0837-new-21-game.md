# 0837. New 21 Game

---
编号: 837
题目: New 21 Game
难度: 中等
标签: [数学, 动态规划, 滑动窗口, 概率与统计]
来源链接: https://leetcode.com/problems/new-21-game/
---

## 题目描述

爱丽丝参与一个大致基于纸牌游戏 **“21点”** 规则的游戏，描述如下：

爱丽丝以 `0` 分开始，并在她的得分少于 `k` 分时抽取数字。 抽取时，她从 `[1, maxPts]` 的范围中随机获得一个整数作为分数进行累计，其中 `maxPts` 是一个整数。 每次抽取都是独立的，其结果具有相同的概率。

当爱丽丝获得 `k` 分 **或更多分** 时，她就停止抽取数字。

爱丽丝的分数不超过 `n` 的概率是多少？

与实际答案误差不超过 `10^-5` 的答案将被视为正确答案。

**示例 1：**

```text
输入：n = 10, k = 1, maxPts = 10
输出：1.00000
解释：爱丽丝得到一张牌，然后停止。
```

**示例 2：**

```text
输入：n = 6, k = 1, maxPts = 10
输出：0.60000
解释：爱丽丝得到一张牌，然后停止。 在 10 种可能性中的 6 种情况下，她的得分不超过 6 分。
```

**示例 3：**

```text
输入：n = 21, k = 17, maxPts = 10
输出：0.73278
```

**提示：**

- `0 <= k <= n <= 10^4`

- `1 <= maxPts <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 动态规划, 滑动窗口, 概率与统计」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(i)$，表示当前分数为 $i$ 时，到最终停止抽取数字时，分数不超过 $n$ 的概率。那么答案就是 $dfs(0)$。

函数 $dfs(i)$ 的计算方法如下：

- 如果 $i \ge k$，那么停止抽取数字，如果 $i \le n$，返回 $1$，否则返回 $0$；
- 否则，可以在 $[1,..\textit{maxPts}]$ 范围内抽取下一个数字 $j$，那么 $dfs(i) = \frac{1}{maxPts} \sum_{j=1}^{maxPts} dfs(i+j)$。

这里我们可以使用记忆化搜索来加速计算。

以上方法的时间复杂度为 $O(k \times \textit{maxPts})$，会超出时间限制，我们需要优化一下。

当 $i \lt k$ 时，以下等式成立：


\begin{aligned}
dfs(i) &= (dfs(i + 1) + dfs(i + 2) + \cdots + dfs(i + \textit{maxPts})) / \ & (1)
\end{aligned}


当 $i \lt k - 1$ 时，以下等式成立：


\begin{aligned}
dfs(i+1) &= (dfs(i + 2) + dfs(i + 3) + \cdots + dfs(i + \textit{maxPts} + 1)) / \textit{maxPts} & (2)
\end{aligned}


因此，当 $i \lt k-1$ 时，我们将等式 $(1)$ 减去等式 $(2)$，得到：


\begin{aligned}
dfs(i) - dfs(i+1) &= (dfs(i + 1) - dfs(i + \textit{maxPts} + 1)) / \textit{maxPts}
\end{aligned}


即：


\begin{aligned}
dfs(i) &= dfs(i + 1) + (dfs(i + 1) - dfs(i + \textit{maxPts} + 1)) / \textit{maxPts}
\end{aligned}


如果 $i=k-1$，有：


\begin{aligned}
dfs(i) &= dfs(k - 1) &= dfs(k) + dfs(k + 1) + \cdots + dfs(k + \textit{maxPts} - 1) / \textit{maxPts} & (3)
\end{aligned}


我们假设有 $i$ 个数不超过 $n$，那么 $k+i-1 \leq n$，又因为 $i\leq \textit{maxPts}$，所以 $i \leq \min(n-k+1, \textit{maxPts})$，因此等式 $(3)$ 可以写成：


\begin{aligned}
dfs(k-1) &= \min(n-k+1, \textit{maxPts}) / \textit{maxPts}
\end{aligned}


综上所述，有以下状态转移方程：


\begin{aligned}
dfs(i) &= \begin{cases}
1, & i \geq k, i \leq n \\
0, & i \geq k, i \gt n \\
\min(n-k+1, \textit{maxPts}) / \textit{maxPts}, & i = k - 1 \\
dfs(i + 1) + (dfs(i + 1) - dfs(i + \textit{maxPts} + 1)) / \textit{maxPts}, & i < k - 1
\end{cases}
\end{aligned}


时间复杂度 $O(k + \textit{maxPts})$，空间复杂度 $O(k + \textit{maxPts})$。其中 $k$ 为最大分数。

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
// New 21 Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func new21Game(n int, k int, maxPts int) float64 {
	f := make([]float64, k)
	var dfs func(int) float64
	dfs = func(i int) float64 {
		if i >= k {
			if i <= n {
				return 1
			}
			return 0
		}
		if i == k-1 {
			return float64(min(n-k+1, maxPts)) / float64(maxPts)
		}
		if f[i] > 0 {
			return f[i]
		}
		f[i] = dfs(i+1) + (dfs(i+1)-dfs(i+maxPts+1))/float64(maxPts)
		return f[i]
	}
	return dfs(0)
}
```

### Java

```java
// New 21 Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private double[] f;
    private int n, k, maxPts;

    public double new21Game(int n, int k, int maxPts) {
        f = new double[k];
        this.n = n;
        this.k = k;
        this.maxPts = maxPts;
        return dfs(0);
    }

    private double dfs(int i) {
        if (i >= k) {
            return i <= n ? 1 : 0;
        }
        if (i == k - 1) {
            return Math.min(n - k + 1, maxPts) * 1.0 / maxPts;
        }
        if (f[i] != 0) {
            return f[i];
        }
        return f[i] = dfs(i + 1) + (dfs(i + 1) - dfs(i + maxPts + 1)) / maxPts;
    }
}
```

### Python

```python
# New 21 Game：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def new21Game(self, n: int, k: int, maxPts: int) -> float:
        @cache
        def dfs(i: int) -> float:
            if i >= k:
                return int(i <= n)
            if i == k - 1:
                return min(n - k + 1, maxPts) / maxPts
            return dfs(i + 1) + (dfs(i + 1) - dfs(i + maxPts + 1)) / maxPts

        return dfs(0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

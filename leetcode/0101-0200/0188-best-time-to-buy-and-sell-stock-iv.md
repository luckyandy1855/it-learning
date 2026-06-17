# 0188. Best Time to Buy and Sell Stock IV

---
编号: 188
题目: Best Time to Buy and Sell Stock IV
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/
---

## 题目描述

给你一个整数数组 `prices` 和一个整数 `k` ，其中 `prices[i]` 是某支给定的股票在第 `i`* *天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 `k` 笔交易。也就是说，你最多可以买 `k` 次，卖 `k` 次。

**注意：**你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

示例 1：

```text
输入：k = 2, prices = [2,4,1]
输出：2
解释：在第 1 天 (股票价格 = 2) 的时候买入，在第 2 天 (股票价格 = 4) 的时候卖出，这笔交易所能获得利润 = 4-2 = 2 。
```

示例 2：

```text
输入：k = 2, prices = [3,2,6,5,0,3]
输出：7
解释：在第 2 天 (股票价格 = 2) 的时候买入，在第 3 天 (股票价格 = 6) 的时候卖出, 这笔交易所能获得利润 = 6-2 = 4 。
     随后，在第 5 天 (股票价格 = 0) 的时候买入，在第 6 天 (股票价格 = 3) 的时候卖出, 这笔交易所能获得利润 = 3-0 = 3 。
```

**提示：**

	- `1 <= k <= 100`

	- `1 <= prices.length <= 1000`

	- `0 <= prices[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(i, j, k)$，表示从第 $i$ 天开始，最多完成 $j$ 笔交易，以及当前持有股票的状态为 $k$（不持有股票用 $0$ 表示，持有股票用 $1$ 表示）时，所能获得的最大利润。答案即为 $dfs(0, k, 0)$。

函数 $dfs(i, j, k)$ 的执行逻辑如下：

- 如果 $i$ 大于等于 $n$，直接返回 $0$；
- 第 $i$ 天可以不进行任何操作，那么 $dfs(i, j, k) = dfs(i + 1, j, k)$；
- 如果 $k \gt 0$，那么第 $i$ 天可以选择卖出股票，那么 $dfs(i, j, k) = \max(dfs(i + 1, j - 1, 0) + prices[i], dfs(i + 1, j, k))$；
- 否则，如果 $j \gt 0$，那么第 $i$ 天可以选择买入股票，那么 $dfs(i, j, k) = \max(dfs(i + 1, j - 1, 1) - prices[i], dfs(i + 1, j, k))$。

取上述三种情况的最大值即为 $dfs(i, j, k)$ 的值。

过程中，我们可以使用记忆化搜索的方法，将每次计算的结果保存下来，避免重复计算。

时间复杂度 $O(n \times k)$，空间复杂度 $O(n \times k)$。其中 $n$ 和 $k$ 分别为数组 $prices$ 的长度和 $k$ 的值。

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
// Best Time to Buy and Sell Stock IV：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxProfit(k int, prices []int) int {
	n := len(prices)
	f := make([][][2]int, n)
	for i := range f {
		f[i] = make([][2]int, k+1)
		for j := range f[i] {
			f[i][j] = [2]int{-1, -1}
		}
	}
	var dfs func(i, j, k int) int
	dfs = func(i, j, k int) int {
		if i >= n {
			return 0
		}
		if f[i][j][k] != -1 {
			return f[i][j][k]
		}
		ans := dfs(i+1, j, k)
		if k > 0 {
			ans = max(ans, prices[i]+dfs(i+1, j, 0))
		} else if j > 0 {
			ans = max(ans, -prices[i]+dfs(i+1, j-1, 1))
		}
		f[i][j][k] = ans
		return ans
	}
	return dfs(0, k, 0)
}
```

### Java

```java
// Best Time to Buy and Sell Stock IV：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][][] f;
    private int[] prices;
    private int n;

    public int maxProfit(int k, int[] prices) {
        n = prices.length;
        this.prices = prices;
        f = new Integer[n][k + 1][2];
        return dfs(0, k, 0);
    }

    private int dfs(int i, int j, int k) {
        if (i >= n) {
            return 0;
        }
        if (f[i][j][k] != null) {
            return f[i][j][k];
        }
        int ans = dfs(i + 1, j, k);
        if (k > 0) {
            ans = Math.max(ans, prices[i] + dfs(i + 1, j, 0));
        } else if (j > 0) {
            ans = Math.max(ans, -prices[i] + dfs(i + 1, j - 1, 1));
        }
        return f[i][j][k] = ans;
    }
}
```

### Python

```python
# Best Time to Buy and Sell Stock IV：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        @cache
        def dfs(i: int, j: int, k: int) -> int:
            if i >= len(prices):
                return 0
            ans = dfs(i + 1, j, k)
            if k:
                ans = max(ans, prices[i] + dfs(i + 1, j, 0))
            elif j:
                ans = max(ans, -prices[i] + dfs(i + 1, j - 1, 1))
            return ans

        return dfs(0, k, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0879. Profitable Schemes

---
编号: 879
题目: Profitable Schemes
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/profitable-schemes/
---

## 题目描述

集团里有 `n` 名员工，他们可以完成各种各样的工作创造利润。

第 `i` 种工作会产生 `profit[i]` 的利润，它要求 `group[i]` 名成员共同参与。如果成员参与了其中一项工作，就不能参与另一项工作。

工作的任何至少产生 `minProfit` 利润的子集称为 **盈利计划** 。并且工作的成员总数最多为 `n` 。

有多少种计划可以选择？因为答案很大，所以** 返回结果模 **`10^9 + 7`** 的值**。

**示例 1：**

```text
输入：n = 5, minProfit = 3, group = [2,2], profit = [2,3]
输出：2
解释：至少产生 3 的利润，该集团可以完成工作 0 和工作 1 ，或仅完成工作 1 。
总的来说，有两种计划。
```

**示例 2：**

```text
输入：n = 10, minProfit = 5, group = [2,3,5], profit = [6,7,8]
输出：7
解释：至少产生 5 的利润，只要完成其中一种工作就行，所以该集团可以完成任何工作。
有 7 种可能的计划：(0)，(1)，(2)，(0,1)，(0,2)，(1,2)，以及 (0,1,2) 。
```

**提示：**

- `1 <= n <= 100`

- `0 <= minProfit <= 100`

- `1 <= group.length <= 100`

- `1 <= group[i] <= 100`

- `profit.length == group.length`

- `0 <= profit[i] <= 100`

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

我们设计一个函数 $dfs(i, j, k)$，表示从第 $i$ 个工作开始，且当前已经选择了 $j$ 个员工，且当前产生的利润为 $k$，这种情况下的方案数。那么答案就是 $dfs(0, 0, 0)$。

函数 $dfs(i, j, k)$ 的执行过程如下：

- 如果 $i = n$，表示所有工作都已经考虑过了，如果 $k \geq minProfit$，则方案数为 $1$，否则方案数为 $0$；
- 如果 $i \lt n$，我们可以选择不选择第 $i$ 个工作，此时方案数为 $dfs(i + 1, j, k)$；如果 $j + group[i] \leq n$，我们也可以选择第 $i$ 个工作，此时方案数为 $dfs(i + 1, j + group[i], \min(k + profit[i], minProfit))$。这里我们将利润上限限制在 $minProfit$，是因为利润超过 $minProfit$ 对我们的答案没有任何影响。

最后返回 $dfs(0, 0, 0)$ 即可。

为了避免重复计算，我们可以使用记忆化搜索的方法，用一个三维数组 $f$ 记录所有的 $dfs(i, j, k)$ 的结果。当我们计算出 $dfs(i, j, k)$ 的值后，我们将其存入 $f[i][j][k]$ 中。调用 $dfs(i, j, k)$ 时，如果 $f[i][j][k]$ 已经被计算过，我们直接返回 $f[i][j][k]$ 即可。

时间复杂度 $O(m \times n \times minProfit)$，空间复杂度 $O(m \times n \times minProfit)$。其中 $m$ 和 $n$ 分别为工作的数量和员工的数量，而 $minProfit$ 为至少产生的利润。

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
// Profitable Schemes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func profitableSchemes(n int, minProfit int, group []int, profit []int) int {
	m := len(group)
	f := make([][][]int, m)
	for i := range f {
		f[i] = make([][]int, n+1)
		for j := range f[i] {
			f[i][j] = make([]int, minProfit+1)
			for k := range f[i][j] {
				f[i][j][k] = -1
			}
		}
	}
	const mod = 1e9 + 7
	var dfs func(i, j, k int) int
	dfs = func(i, j, k int) int {
		if i >= m {
			if k >= minProfit {
				return 1
			}
			return 0
		}
		if f[i][j][k] != -1 {
			return f[i][j][k]
		}
		ans := dfs(i+1, j, k)
		if j+group[i] <= n {
			ans += dfs(i+1, j+group[i], min(k+profit[i], minProfit))
		}
		ans %= mod
		f[i][j][k] = ans
		return ans
	}
	return dfs(0, 0, 0)
}
```

### Java

```java
// Profitable Schemes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][][] f;
    private int m;
    private int n;
    private int minProfit;
    private int[] group;
    private int[] profit;
    private final int mod = (int) 1e9 + 7;

    public int profitableSchemes(int n, int minProfit, int[] group, int[] profit) {
        m = group.length;
        this.n = n;
        f = new Integer[m][n + 1][minProfit + 1];
        this.minProfit = minProfit;
        this.group = group;
        this.profit = profit;
        return dfs(0, 0, 0);
    }

    private int dfs(int i, int j, int k) {
        if (i >= m) {
            return k == minProfit ? 1 : 0;
        }
        if (f[i][j][k] != null) {
            return f[i][j][k];
        }
        int ans = dfs(i + 1, j, k);
        if (j + group[i] <= n) {
            ans += dfs(i + 1, j + group[i], Math.min(k + profit[i], minProfit));
        }
        ans %= mod;
        return f[i][j][k] = ans;
    }
}
```

### Python

```python
# Profitable Schemes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def profitableSchemes(
        self, n: int, minProfit: int, group: List[int], profit: List[int]
    ) -> int:
        @cache
        def dfs(i: int, j: int, k: int) -> int:
            if i >= len(group):
                return 1 if k == minProfit else 0
            ans = dfs(i + 1, j, k)
            if j + group[i] <= n:
                ans += dfs(i + 1, j + group[i], min(k + profit[i], minProfit))
            return ans % (10**9 + 7)

        return dfs(0, 0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

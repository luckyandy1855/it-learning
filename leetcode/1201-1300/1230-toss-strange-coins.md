# 1230. Toss Strange Coins

---
编号: 1230
题目: Toss Strange Coins
难度: 中等
标签: [数组, 数学, 动态规划, 概率与统计]
来源链接: https://leetcode.com/problems/toss-strange-coins/
---

## 题目描述

有一些不规则的硬币。在这些硬币中，`prob[i]` 表示第 `i` 枚硬币正面朝上的概率。

请对每一枚硬币抛掷 **一次**，然后返回正面朝上的硬币数等于 `target` 的概率。

**示例 1：**

```text
输入：prob = [0.4], target = 1
输出：0.40000
```

**示例 2：**

```text
输入：prob = [0.5,0.5,0.5,0.5,0.5], target = 0
输出：0.03125
```

**提示：**

- `1 <= prob.length <= 1000`

- `0 <= prob[i] <= 1`

- `0 <= target ``<= prob.length`

- 如果答案与标准答案的误差在 `10^-5` 内，则被视为正确答案。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 概率与统计」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示前 $i$ 枚硬币中有 $j$ 枚正面朝上的概率，初始时 $f[0][0]=1$，答案即为 $f[n][target]$。

考虑 $f[i][j]$，其中 $i \geq 1$，如果当前硬币反面朝上，那么 $f[i][j] = (1 - p) \times f[i - 1][j]$；如果当前硬币正面朝上，并且 $j \gt 0$，那么 $f[i][j] = p \times f[i - 1][j - 1]$。因此状态转移方程为：


f[i][j] = \begin{cases}
(1 - p) \times f[i - 1][j], & j = 0 \\
(1 - p) \times f[i - 1][j] + p \times f[i - 1][j - 1], & j \gt 0
\end{cases}


其中 $p$ 表示第 $i$ 枚硬币正面朝上的概率。

我们注意到，状态 $f[i][j]$ 只与状态 $f[i - 1][j]$ 和 $f[i - 1][j - 1]$ 有关，因此，我们可以将二维空间优化为一维空间。

时间复杂度 $O(n \times target)$，空间复杂度 $O(target)$。其中 $n$ 为硬币的数量。

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
// Toss Strange Coins：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func probabilityOfHeads(prob []float64, target int) float64 {
	n := len(prob)
	f := make([][]float64, n+1)
	for i := range f {
		f[i] = make([]float64, target+1)
	}
	f[0][0] = 1
	for i := 1; i <= n; i++ {
		for j := 0; j <= i && j <= target; j++ {
			f[i][j] = (1 - prob[i-1]) * f[i-1][j]
			if j > 0 {
				f[i][j] += prob[i-1] * f[i-1][j-1]
			}
		}
	}
	return f[n][target]
}
```

### Java

```java
// Toss Strange Coins：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double probabilityOfHeads(double[] prob, int target) {
        int n = prob.length;
        double[][] f = new double[n + 1][target + 1];
        f[0][0] = 1;
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j <= Math.min(i, target); ++j) {
                f[i][j] = (1 - prob[i - 1]) * f[i - 1][j];
                if (j > 0) {
                    f[i][j] += prob[i - 1] * f[i - 1][j - 1];
                }
            }
        }
        return f[n][target];
    }
}
```

### Python

```python
# Toss Strange Coins：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def probabilityOfHeads(self, prob: List[float], target: int) -> float:
        n = len(prob)
        f = [[0] * (target + 1) for _ in range(n + 1)]
        f[0][0] = 1
        for i, p in enumerate(prob, 1):
            for j in range(min(i, target) + 1):
                f[i][j] = (1 - p) * f[i - 1][j]
                if j:
                    f[i][j] += p * f[i - 1][j - 1]
        return f[n][target]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

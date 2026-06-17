# 1155. Number of Dice Rolls With Target Sum

---
编号: 1155
题目: Number of Dice Rolls With Target Sum
难度: 中等
标签: [动态规划]
来源链接: https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/
---

## 题目描述

这里有 `n` 个一样的骰子，每个骰子上都有 `k` 个面，分别标号为 `1` 到 `k` 。

给定三个整数 `n`、`k` 和 `target`，请返回投掷骰子的所有可能得到的结果（共有 `k^n` 种方式），使得骰子面朝上的数字总和等于 `target`。

由于答案可能很大，你需要对 `10^9 + 7` **取模**。

**示例 1：**

```text
输入：n = 1, k = 6, target = 3
输出：1
解释：你掷了一个有 6 个面的骰子。
得到总和为 3 的结果的方式只有一种。
```

**示例 2：**

```text
输入：n = 2, k = 6, target = 7
输出：6
解释：你掷了两个骰子，每个骰子有 6 个面。
有 6 种方式得到总和为 7 的结果: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1。
```

**示例 3：**

```text
输入：n = 30, k = 30, target = 500
输出：222616187
解释：返回的结果必须对 109 + 7 取模。
```

**提示：**

- `1 <= n, k <= 30`

- `1 <= target <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示使用 $i$ 个骰子，和为 $j$ 的方案数。那么我们可以得到状态转移方程：


f[i][j] = \sum_{h=1}^{\min(j, k)} f[i-1][j-h]


其中 $h$ 表示第 $i$ 个骰子的点数。

初始时 $f[0][0] = 1$，最终的答案即为 $f[n][target]$。

时间复杂度 $O(n \times k \times target)$，空间复杂度 $O(n \times target)$。

我们注意到，状态 $f[i][j]$ 只和 $f[i-1][]$ 有关，因此我们可以使用滚动数组的方式，将空间复杂度优化到 $O(target)$。

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
// Number of Dice Rolls With Target Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numRollsToTarget(n int, k int, target int) int {
	const mod int = 1e9 + 7
	f := make([][]int, n+1)
	for i := range f {
		f[i] = make([]int, target+1)
	}
	f[0][0] = 1
	for i := 1; i <= n; i++ {
		for j := 1; j <= min(target, i*k); j++ {
			for h := 1; h <= min(j, k); h++ {
				f[i][j] = (f[i][j] + f[i-1][j-h]) % mod
			}
		}
	}
	return f[n][target]
}
```

### Java

```java
// Number of Dice Rolls With Target Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numRollsToTarget(int n, int k, int target) {
        final int mod = (int) 1e9 + 7;
        int[][] f = new int[n + 1][target + 1];
        f[0][0] = 1;
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= Math.min(target, i * k); ++j) {
                for (int h = 1; h <= Math.min(j, k); ++h) {
                    f[i][j] = (f[i][j] + f[i - 1][j - h]) % mod;
                }
            }
        }
        return f[n][target];
    }
}
```

### Python

```python
# Number of Dice Rolls With Target Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numRollsToTarget(self, n: int, k: int, target: int) -> int:
        f = [[0] * (target + 1) for _ in range(n + 1)]
        f[0][0] = 1
        mod = 10**9 + 7
        for i in range(1, n + 1):
            for j in range(1, min(i * k, target) + 1):
                for h in range(1, min(j, k) + 1):
                    f[i][j] = (f[i][j] + f[i - 1][j - h]) % mod
        return f[n][target]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

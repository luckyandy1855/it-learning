# 0265. Paint House II

---
编号: 265
题目: Paint House II
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/paint-house-ii/
---

## 题目描述

假如有一排房子共有 `n` 幢，每个房子可以被粉刷成 `k` 种颜色中的一种。房子粉刷成不同颜色的花费成本也是不同的。你需要粉刷所有的房子并且使其相邻的两个房子颜色不能相同。

每个房子粉刷成不同颜色的花费以一个 `n x k` 的矩阵表示。

- 例如，`costs[0][0]` 表示第 `0` 幢房子粉刷成 `0` 号颜色的成本；`costs[1][2]` 表示第 `1` 幢房子粉刷成 `2` 号颜色的成本，以此类推。

返回 *粉刷完所有房子的最低成本* 。

**示例 1：**

```text
输入: costs = [[1,5,3],[2,9,4]]
输出: 5
解释:
将房子 0 刷成 0 号颜色，房子 1 刷成 2 号颜色。花费: 1 + 4 = 5;
或者将 房子 0 刷成 2 号颜色，房子 1 刷成 0 号颜色。花费: 3 + 2 = 5.
```

**示例 2:**

```text
输入: costs = [[1,3],[2,4]]
输出: 5
```

**提示：**

- `costs.length == n`

- `costs[i].length == k`

- `1 <= n <= 100`

- `2 <= k <= 20`

- `1 <= costs[i][j] <= 20`

**进阶：**您能否在 `O(nk)` 的时间复杂度下解决此问题？

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

定义 $f[i][j]$ 表示粉刷前 $i$ 个房子，且最后一个房子被粉刷成第 $j$ 种颜色的最小花费。答案为 $\min_{0 \leq j < k} f[n][j]$。

对于 $f[i][j]$，可以从 $f[i - 1][j']$ 转移而来，其中 $j' \neq j$。因此，可以得到状态转移方程：


f[i][j] = \min_{0 \leq j' < k, j' \neq j} f[i - 1][j'] + costs[i - 1][j]


由于 $f[i][j]$ 只与 $f[i - 1][j']$ 有关，因此可以使用滚动数组优化空间复杂度。

时间复杂度 $O(n \times k^2)$，空间复杂度 $O(k)$。其中 $n$ 和 $k$ 分别为房子数量和颜色数量。

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
// Paint House II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minCostII(costs [][]int) int {
	n, k := len(costs), len(costs[0])
	f := cp(costs[0])
	for i := 1; i < n; i++ {
		g := cp(costs[i])
		for j := 0; j < k; j++ {
			t := math.MaxInt32
			for h := 0; h < k; h++ {
				if h != j && t > f[h] {
					t = f[h]
				}
			}
			g[j] += t
		}
		f = g
	}
	return slices.Min(f)
}

func cp(arr []int) []int {
	t := make([]int, len(arr))
	copy(t, arr)
	return t
}
```

### Java

```java
import java.util.*;
// Paint House II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int minCostII(int[][] costs) {
        int n = costs.length, k = costs[0].length;
        int[] f = costs[0].clone();
        for (int i = 1; i < n; ++i) {
            int[] g = costs[i].clone();
            for (int j = 0; j < k; ++j) {
                int t = Integer.MAX_VALUE;
                for (int h = 0; h < k; ++h) {
                    if (h != j) {
                        t = Math.min(t, f[h]);
                    }
                }
                g[j] += t;
            }
            f = g;
        }
        return Arrays.stream(f).min().getAsInt();
    }
}
```

### Python

```python
# Paint House II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minCostII(self, costs: List[List[int]]) -> int:
        n, k = len(costs), len(costs[0])
        f = costs[0][:]
        for i in range(1, n):
            g = costs[i][:]
            for j in range(k):
                t = min(f[h] for h in range(k) if h != j)
                g[j] += t
            f = g
        return min(f)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

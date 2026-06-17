# 1039. Minimum Score Triangulation of Polygon

---
编号: 1039
题目: Minimum Score Triangulation of Polygon
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/minimum-score-triangulation-of-polygon/
---

## 题目描述

你有一个凸的 `n` 边形，其每个顶点都有一个整数值。给定一个整数数组 `values` ，其中 `values[i]` 是按 **顺时针顺序 **第 `i` 个顶点的值。

假设将多边形 **剖分** 为 `n - 2` 个三角形。对于每个三角形，该三角形的值是顶点标记的**乘积**，三角剖分的分数是进行三角剖分后所有 `n - 2` 个三角形的值之和。

返回 *多边形进行三角剖分后可以得到的最低分* 。

**示例 1：**

```text
输入：values = [1,2,3]
输出：6
解释：多边形已经三角化，唯一三角形的分数为 6。
```

**示例 2：**

```text
输入：values = [3,7,4,5]
输出：144
解释：有两种三角剖分，可能得分分别为：3*7*5 + 4*5*7 = 245，或 3*4*5 + 3*4*7 = 144。最低分数为 144。
```

**示例 3：**

```text
输入：values = [1,3,1,4,1,5]
输出：13
解释：最低分数三角剖分的得分情况为 1*1*3 + 1*1*4 + 1*1*5 + 1*1*1 = 13。
```

**提示：**

- `n == values.length`

- `3 <= n <= 50`

- `1 <= values[i] <= 100`

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

我们设计一个函数 $\text{dfs}(i, j)$，表示将多边形的顶点 $i$ 到 $j$ 进行三角剖分后的最低分数。那么答案就是 $\text{dfs}(0, n - 1)$。

函数 $\text{dfs}(i, j)$ 的计算过程如下：

如果 $i + 1 = j$，说明多边形只有两个顶点，无法进行三角剖分，返回 $0$；

否则，我们枚举 $i$ 和 $j$ 之间的一个顶点 $k$，即 $i \lt k \lt j$，将多边形的顶点 $i$ 到 $j$ 进行三角剖分，可以分为两个子问题：将多边形的顶点 $i$ 到 $k$ 进行三角剖分，以及将多边形的顶点 $k$ 到 $j$ 进行三角剖分。这两个子问题的最低分数分别为 $\text{dfs}(i, k)$ 和 $\text{dfs}(k, j)$，而顶点 $i$, $j$ 和 $k$ 构成的三角形的分数为 $\text{values}[i] \times \text{values}[k] \times \text{values}[j]$。那么，此次三角剖分的最低分数为 $\text{dfs}(i, k) + \text{dfs}(k, j) + \text{values}[i] \times \text{values}[k] \times \text{values}[j]$，我们取所有可能的最小值，即为 $\text{dfs}(i, j)$ 的值。

为了避免重复计算，我们可以使用记忆化搜索，即使用哈希表或者数组来存储已经计算过的函数值。

最后，我们返回 $\text{dfs}(0, n - 1)$ 即可。

时间复杂度 $O(n^3)$，空间复杂度 $O(n^2)$。其中 $n$ 为多边形的顶点数。

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
// Minimum Score Triangulation of Polygon：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minScoreTriangulation(values []int) int {
	n := len(values)
	f := [50][50]int{}
	var dfs func(int, int) int
	dfs = func(i, j int) int {
		if i+1 == j {
			return 0
		}
		if f[i][j] != 0 {
			return f[i][j]
		}
		f[i][j] = 1 << 30
		for k := i + 1; k < j; k++ {
			f[i][j] = min(f[i][j], dfs(i, k)+dfs(k, j)+values[i]*values[k]*values[j])
		}
		return f[i][j]
	}
	return dfs(0, n-1)
}
```

### Java

```java
// Minimum Score Triangulation of Polygon：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private int[] values;
    private Integer[][] f;

    public int minScoreTriangulation(int[] values) {
        n = values.length;
        this.values = values;
        f = new Integer[n][n];
        return dfs(0, n - 1);
    }

    private int dfs(int i, int j) {
        if (i + 1 == j) {
            return 0;
        }
        if (f[i][j] != null) {
            return f[i][j];
        }
        int ans = 1 << 30;
        for (int k = i + 1; k < j; ++k) {
            ans = Math.min(ans, dfs(i, k) + dfs(k, j) + values[i] * values[k] * values[j]);
        }
        return f[i][j] = ans;
    }
}
```

### Python

```python
# Minimum Score Triangulation of Polygon：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minScoreTriangulation(self, values: List[int]) -> int:
        @cache
        def dfs(i: int, j: int) -> int:
            if i + 1 == j:
                return 0
            return min(
                dfs(i, k) + dfs(k, j) + values[i] * values[k] * values[j]
                for k in range(i + 1, j)
            )

        return dfs(0, len(values) - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

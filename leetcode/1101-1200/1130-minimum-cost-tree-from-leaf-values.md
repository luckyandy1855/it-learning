# 1130. Minimum Cost Tree From Leaf Values

---
编号: 1130
题目: Minimum Cost Tree From Leaf Values
难度: 中等
标签: [栈, 贪心, 数组, 动态规划, 单调栈]
来源链接: https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/
---

## 题目描述

给你一个正整数数组 `arr`，考虑所有满足以下条件的二叉树：

- 每个节点都有 `0` 个或是 `2` 个子节点。

- 数组 `arr` 中的值与树的中序遍历中每个叶节点的值一一对应。

- 每个非叶节点的值等于其左子树和右子树中叶节点的最大值的乘积。

在所有这样的二叉树中，返回每个非叶节点的值的最小可能总和。这个和的值是一个 32 位整数。

如果一个节点有 0 个子节点，那么该节点为叶节点。

**示例 1：**

```text
输入：arr = [6,2,4]
输出：32
解释：有两种可能的树，第一种的非叶节点的总和为 36 ，第二种非叶节点的总和为 32 。
```

**示例 2：**

```text
输入：arr = [4,11]
输出：44
```

**提示：**

- `2 <= arr.length <= 40`

- `1 <= arr[i] <= 15`

- 答案保证是一个 32 位带符号整数，即小于 `2^31` 。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 贪心, 数组, 动态规划, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，数组 $arr$ 中的值与树的中序遍历中每个叶节点的值一一对应，我们可以将数组划分为左右两个非空子数组，分别对应树的左右子树，递归地求解每个子树的所有非叶节点的值的最小可能总和。

我们设计一个函数 $dfs(i, j)$，表示数组 $arr$ 中下标范围 $[i, j]$ 内的所有非叶节点的值的最小可能总和，那么答案就是 $dfs(0, n - 1)$，其中 $n$ 为数组 $arr$ 的长度。

函数 $dfs(i, j)$ 的计算过程如下：

- 如果 $i = j$，说明数组 $arr[i..j]$ 中只有一个元素，没有非叶节点，因此 $dfs(i, j) = 0$。
- 否则，我们枚举 $k \in [i, j - 1]$，将数组 $arr$ 划分为两个子数组 $arr[i \cdots k]$ 和 $arr[k + 1 \cdots j]$，对于每个 $k$，我们递归计算 $dfs(i, k)$ 和 $dfs(k + 1, j)$，其中 $dfs(i, k)$ 表示数组 $arr$ 中下标范围 $[i, k]$ 内的所有非叶节点的值的最小可能总和，而 $dfs(k + 1, j)$ 表示数组 $arr$ 中下标范围 $[k + 1, j]$ 内的所有非叶节点的值的最小可能总和，那么 $dfs(i, j) = \min_{i \leq k < j} \{dfs(i, k) + dfs(k + 1, j) + \max_{i \leq t \leq k} \{arr[t]\} \max_{k < t \leq j} \{arr[t]\}\}$。

综上所述，我们可以得到：


dfs(i, j) = \begin{cases}
0, & \textit{if } i = j \\
\min_{i \leq k < j} \{dfs(i, k) + dfs(k + 1, j) + \max_{i \leq t \leq k} \{arr[t]\} \max_{k < t \leq j} \{arr[t]\}\}, & \textit{if } i < j
\end{cases}


上述递归过程中，我们可以使用记忆化搜索的方法，避免重复计算。另外，我们还可以使用数组 $g$ 记录数组 $arr$ 中下标范围 $[i, j]$ 内的所有叶节点的最大值，那么 $dfs(i, j)$ 的计算过程可以优化为：


dfs(i, j) = \begin{cases}
0, & \textit{if } i = j \\
\min_{i \leq k < j} \{dfs(i, k) + dfs(k + 1, j) + g[i][k] \cdot g[k + 1][j]\}, & \textit{if } i < j
\end{cases}


最后，我们返回 $dfs(0, n - 1)$ 即可。

时间复杂度 $O(n^3)$，空间复杂度 $O(n^2)$。其中 $n$ 为数组 $arr$ 的长度。

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
// Minimum Cost Tree From Leaf Values：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func mctFromLeafValues(arr []int) int {
	n := len(arr)
	f := make([][]int, n)
	g := make([][]int, n)
	for i := range g {
		f[i] = make([]int, n)
		g[i] = make([]int, n)
		g[i][i] = arr[i]
		for j := i + 1; j < n; j++ {
			g[i][j] = max(g[i][j-1], arr[j])
		}
	}
	var dfs func(int, int) int
	dfs = func(i, j int) int {
		if i == j {
			return 0
		}
		if f[i][j] > 0 {
			return f[i][j]
		}
		f[i][j] = 1 << 30
		for k := i; k < j; k++ {
			f[i][j] = min(f[i][j], dfs(i, k)+dfs(k+1, j)+g[i][k]*g[k+1][j])
		}
		return f[i][j]
	}
	return dfs(0, n-1)
}
```

### Java

```java
// Minimum Cost Tree From Leaf Values：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][] f;
    private int[][] g;

    public int mctFromLeafValues(int[] arr) {
        int n = arr.length;
        f = new Integer[n][n];
        g = new int[n][n];
        for (int i = n - 1; i >= 0; --i) {
            g[i][i] = arr[i];
            for (int j = i + 1; j < n; ++j) {
                g[i][j] = Math.max(g[i][j - 1], arr[j]);
            }
        }
        return dfs(0, n - 1);
    }

    private int dfs(int i, int j) {
        if (i == j) {
            return 0;
        }
        if (f[i][j] != null) {
            return f[i][j];
        }
        int ans = 1 << 30;
        for (int k = i; k < j; k++) {
            ans = Math.min(ans, dfs(i, k) + dfs(k + 1, j) + g[i][k] * g[k + 1][j]);
        }
        return f[i][j] = ans;
    }
}
```

### Python

```python
# Minimum Cost Tree From Leaf Values：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def mctFromLeafValues(self, arr: List[int]) -> int:
        @cache
        def dfs(i: int, j: int) -> Tuple:
            if i == j:
                return 0, arr[i]
            s, mx = inf, -1
            for k in range(i, j):
                s1, mx1 = dfs(i, k)
                s2, mx2 = dfs(k + 1, j)
                t = s1 + s2 + mx1 * mx2
                if s > t:
                    s = t
                    mx = max(mx1, mx2)
            return s, mx

        return dfs(0, len(arr) - 1)[0]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

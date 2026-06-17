# 0311. Sparse Matrix Multiplication

---
编号: 311
题目: Sparse Matrix Multiplication
难度: 中等
标签: [数组, 哈希表, 矩阵]
来源链接: https://leetcode.com/problems/sparse-matrix-multiplication/
---

## 题目描述

给定两个 稀疏矩阵 ：大小为 `m x k` 的稀疏矩阵 `mat1` 和大小为 `k x n` 的稀疏矩阵 `mat2` ，返回 `mat1 x mat2` 的结果。你可以假设乘法总是可能的。

**示例 1：**

```text
输入：mat1 = [[1,0,0],[-1,0,3]], mat2 = [[7,0,0],[0,0,0],[0,0,1]]
输出：[[7,0,0],[-7,0,3]]
```

** 示例 2:**

```text
输入：mat1 = [[0]], mat2 = [[0]]
输出：[[0]]
```

**提示:**

	- `m == mat1.length`

	- `k == mat1[i].length == mat2.length`

	- `n == mat2[i].length`

	- `1 <= m, n, k <= 100`

	- `-100 <= mat1[i][j], mat2[i][j] <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以直接按照矩阵乘法的定义，计算出结果矩阵中的每一个元素。

时间复杂度 $O(m \times n \times k)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是矩阵 $mat1$ 的行数和矩阵 $mat2$ 的列数，而 $k$ 是矩阵 $mat1$ 的列数或矩阵 $mat2$ 的行数。

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
// Sparse Matrix Multiplication：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func multiply(mat1 [][]int, mat2 [][]int) [][]int {
	m, n := len(mat1), len(mat2[0])
	ans := make([][]int, m)
	for i := range ans {
		ans[i] = make([]int, n)
	}
	for i := 0; i < m; i++ {
		for j := 0; j < n; j++ {
			for k := 0; k < len(mat2); k++ {
				ans[i][j] += mat1[i][k] * mat2[k][j]
			}
		}
	}
	return ans
}
```

### Java

```java
// Sparse Matrix Multiplication：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[][] multiply(int[][] mat1, int[][] mat2) {
        int m = mat1.length, n = mat2[0].length;
        int[][] ans = new int[m][n];
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                for (int k = 0; k < mat2.length; ++k) {
                    ans[i][j] += mat1[i][k] * mat2[k][j];
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Sparse Matrix Multiplication：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def multiply(self, mat1: List[List[int]], mat2: List[List[int]]) -> List[List[int]]:
        m, n = len(mat1), len(mat2[0])
        ans = [[0] * n for _ in range(m)]
        for i in range(m):
            for j in range(n):
                for k in range(len(mat2)):
                    ans[i][j] += mat1[i][k] * mat2[k][j]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

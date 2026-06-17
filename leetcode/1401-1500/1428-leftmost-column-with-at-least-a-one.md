# 1428. Leftmost Column with at Least a One

---
编号: 1428
题目: Leftmost Column with at Least a One
难度: 中等
标签: [数组, 二分查找, 交互, 矩阵]
来源链接: https://leetcode.com/problems/leftmost-column-with-at-least-a-one/
---

## 题目描述

**行排序二进制矩阵** 表示所有元素都是 `0` 或 `1`，并且矩阵的每一行都以非递减排序。

给定一个 **行排序二进制矩阵 **`binaryMatrix`，返回至少包含一个 `1` 的 **最左端列 **的索引（从 0 开始）。如果这样的列不存在，返回 `-1`。

**您不能直接访问该二进制矩阵。**你只可以通过 `BinaryMatrix` 接口来访问。

- `BinaryMatrix.get(row, col)` 返回位于索引 `(row, col)` （从 0 开始）的元素。

- `BinaryMatrix.dimensions()` 返回含有 2 个元素的列表 `[rows, cols]`，表示这是一个 `rows * cols`的矩阵。

如果提交的答案调用 `BinaryMatrix.get` 超过 `1000` 次，则该答案会被判定为*错误答案*。提交任何试图规避判定机制的答案将会被取消资格。

下列示例中， `mat` 为给定的二进制矩阵。您不能直接访问该矩阵。

**示例 1:**

****

```text
输入: mat = [[0,0],[1,1]]
输出: 0
```

**示例 2:**

****

```text
输入: mat = [[0,0],[0,1]]
输出: 1
```

**示例 3:**

****

```text
输入: mat = [[0,0],[0,0]]
输出: -1
```

**提示:**

- `rows == mat.length`

- `cols == mat[i].length`

- `1 <= rows, cols <= 100`

- `mat[i][j]` 只会是 `0` 或 `1`。

- `mat[i]` 已按非递减顺序排序。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 交互, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先调用 `BinaryMatrix.dimensions()` 得到矩阵的行数 $m$ 和列数 $n$，然后对于每一行，我们使用二分查找来找到最左边的 $1$ 所在的列数 $j$，找出所有行中最小的满足 $j$ 的值即为答案。如果不存在这样的列，则返回 $-1$。

时间复杂度 $O(m \times \log n)$，其中 $m$ 和 $n$ 分别是矩阵的行数和列数。需要遍历每一行，每一行内使用二分查找，时间复杂度为 $O(\log n)$。空间复杂度 $O(1)$。

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
// Leftmost Column with at Least a One：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * // This is the BinaryMatrix's API interface.
 * // You should not implement it, or speculate about its implementation
 * type BinaryMatrix struct {
 *     Get func(int, int) int
 *     Dimensions func() []int
 * }
 */

func leftMostColumnWithOne(binaryMatrix BinaryMatrix) int {
	e := binaryMatrix.Dimensions()
	m, n := e[0], e[1]
	ans := n
	for i := 0; i < m; i++ {
		l, r := 0, n
		for l < r {
			mid := (l + r) >> 1
			if binaryMatrix.Get(i, mid) == 1 {
				r = mid
			} else {
				l = mid + 1
			}
		}
		ans = min(ans, l)
	}
	if ans >= n {
		return -1
	}
	return ans
}
```

### Java

```java
// Leftmost Column with at Least a One：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is the BinaryMatrix's API interface.
 * // You should not implement it, or speculate about its implementation
 * interface BinaryMatrix {
 *     public int get(int row, int col) {}
 *     public List<Integer> dimensions {}
 * };
 */

class Solution {
    public int leftMostColumnWithOne(BinaryMatrix binaryMatrix) {
        List<Integer> e = binaryMatrix.dimensions();
        int m = e.get(0), n = e.get(1);
        int ans = n;
        for (int i = 0; i < m; ++i) {
            int l = 0, r = n;
            while (l < r) {
                int mid = (l + r) >> 1;
                if (binaryMatrix.get(i, mid) == 1) {
                    r = mid;
                } else {
                    l = mid + 1;
                }
            }
            ans = Math.min(ans, l);
        }
        return ans >= n ? -1 : ans;
    }
}
```

### Python

```python
# Leftmost Column with at Least a One：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is BinaryMatrix's API interface.
# You should not implement it, or speculate about its implementation
# """
# class BinaryMatrix(object):
#    def get(self, row: int, col: int) -> int:
#    def dimensions(self) -> list[]:


class Solution:
    def leftMostColumnWithOne(self, binaryMatrix: "BinaryMatrix") -> int:
        m, n = binaryMatrix.dimensions()
        ans = n
        for i in range(m):
            j = bisect_left(range(n), 1, key=lambda k: binaryMatrix.get(i, k))
            ans = min(ans, j)
        return -1 if ans >= n else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

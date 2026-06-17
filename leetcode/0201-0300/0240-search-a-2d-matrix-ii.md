# 0240. Search a 2D Matrix II

---
编号: 240
题目: Search a 2D Matrix II
难度: 中等
标签: [数组, 二分查找, 分治, 矩阵]
来源链接: https://leetcode.com/problems/search-a-2d-matrix-ii/
---

## 题目描述

编写一个高效的算法来搜索 `*m* x *n*` 矩阵 `matrix` 中的一个目标值 `target` 。该矩阵具有以下特性：

- 每行的元素从左到右升序排列。

- 每列的元素从上到下升序排列。

示例 1：

```text
输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
输出：true
```

示例 2：

```text
输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20
输出：false
```

**提示：**

- `m == matrix.length`

- `n == matrix[i].length`

- `1 <= n, m <= 300`

- `-10^9 <= matrix[i][j] <= 10^9`

- 每行的所有元素从左到右升序排列

- 每列的所有元素从上到下升序排列

- `-10^9 <= target <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 分治, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于每一行的所有元素升序排列，因此，对于每一行，我们可以使用二分查找找到第一个大于等于 $\textit{target}$ 的元素，然后判断该元素是否等于 $\textit{target}$。如果等于 $\textit{target}$，说明找到了目标值，直接返回 $\text{true}$。如果不等于 $\textit{target}$，说明这一行的所有元素都小于 $\textit{target}$，应该继续搜索下一行。

如果所有行都搜索完了，都没有找到目标值，说明目标值不存在，返回 $\text{false}$。

时间复杂度 $O(m \times \log n)$，其中 $m$ 和 $n$ 分别为矩阵的行数和列数。空间复杂度 $O(1)$。

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
// Search a 2D Matrix II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func searchMatrix(matrix [][]int, target int) bool {
	for _, row := range matrix {
		j := sort.SearchInts(row, target)
		if j < len(matrix[0]) && row[j] == target {
			return true
		}
	}
	return false
}
```

### Java

```java
import java.util.*;
// Search a 2D Matrix II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        for (var row : matrix) {
            int j = Arrays.binarySearch(row, target);
            if (j >= 0) {
                return true;
            }
        }
        return false;
    }
}
```

### Python

```python
# Search a 2D Matrix II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        for row in matrix:
            j = bisect_left(row, target)
            if j < len(matrix[0]) and row[j] == target:
                return True
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

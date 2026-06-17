# 1198. Find Smallest Common Element in All Rows

---
编号: 1198
题目: Find Smallest Common Element in All Rows
难度: 中等
标签: [数组, 哈希表, 二分查找, 计数, 矩阵]
来源链接: https://leetcode.com/problems/find-smallest-common-element-in-all-rows/
---

## 题目描述

给你一个 `m x n` 的矩阵 `mat`，其中每一行的元素均符合 **严格递增** 。请返回 *所有行中的 **最小公共元素** *。

如果矩阵中没有这样的公共元素，就请返回 `-1`。

**示例 1：**

```text
输入：mat = [[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]
输出：5
```

**示例 2:**

```text
输入：mat = [[1,2,3],[2,3,4],[2,3,5]]
输出： 2
```

**提示：**

- `m == mat.length`

- `n == mat[i].length`

- `1 <= m, n <= 500`

- `1 <= mat[i][j] <= 10^4`

- `mat[i]` 已按严格递增顺序排列。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 二分查找, 计数, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个长度为 $10001$ 的数组 $cnt$ 统计每个数出现的次数。顺序遍历矩阵中的每个数，将其出现次数加一。当某个数的出现次数等于矩阵的行数时，说明该数在每一行都出现过，即为最小公共元素，返回该数即可。

若遍历结束后没有找到最小公共元素，则返回 $-1$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(10^4)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Find Smallest Common Element in All Rows：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func smallestCommonElement(mat [][]int) int {
	cnt := [10001]int{}
	for _, row := range mat {
		for _, x := range row {
			cnt[x]++
			if cnt[x] == len(mat) {
				return x
			}
		}
	}
	return -1
}
```

### Java

```java
// Find Smallest Common Element in All Rows：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int smallestCommonElement(int[][] mat) {
        int[] cnt = new int[10001];
        for (var row : mat) {
            for (int x : row) {
                if (++cnt[x] == mat.length) {
                    return x;
                }
            }
        }
        return -1;
    }
}
```

### Python

```python
# Find Smallest Common Element in All Rows：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def smallestCommonElement(self, mat: List[List[int]]) -> int:
        cnt = Counter()
        for row in mat:
            for x in row:
                cnt[x] += 1
                if cnt[x] == len(mat):
                    return x
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0363. Max Sum of Rectangle No Larger Than K

---
编号: 363
题目: Max Sum of Rectangle No Larger Than K
难度: 困难
标签: [数组, 二分查找, 矩阵, 有序集合, 前缀和]
来源链接: https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/
---

## 题目描述

给你一个 `m x n` 的矩阵 `matrix` 和一个整数 `k` ，找出并返回矩阵内部矩形区域的不超过 `k` 的最大数值和。

题目数据保证总会存在一个数值和不超过 `k` 的矩形区域。

**示例 1：**

```text
输入：matrix = [[1,0,1],[0,-2,3]], k = 2
输出：2
解释：蓝色边框圈出来的矩形区域 [[0, 1], [-2, 3]] 的数值和是 2，且 2 是不超过 k 的最大数字（k = 2）。
```

**示例 2：**

```text
输入：matrix = [[2,2,-1]], k = 3
输出：3
```

**提示：**

	- `m == matrix.length`

	- `n == matrix[i].length`

	- `1 <= m, n <= 100`

	- `-100 <= matrix[i][j] <= 100`

	- `-10^5 <= k <= 10^5`

**进阶：**如果行数远大于列数，该如何设计解决方案？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 矩阵, 有序集合, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举矩形的上下边界 $i$ 和 $j$，然后计算出该边界内每列的元素和，记录在数组 $nums$ 中，问题转化为如何在数组 $nums$ 中寻找不超过 $k$ 的最大子数组和。

我们可以使用有序集合来快速寻找小于等于 $x$ 的最大值，从而得到最大子数组和不超过 $k$ 的子数组。

时间复杂度 $O(m^2 \times n \times \log n)$，空间复杂度 $O(n)$。

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
// Max Sum of Rectangle No Larger Than K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSumSubmatrix(matrix [][]int, k int) int {
	m, n := len(matrix), len(matrix[0])
	const inf = 1 << 30
	ans := -inf
	for i := 0; i < m; i++ {
		nums := make([]int, n)
		for j := i; j < m; j++ {
			for h := 0; h < n; h++ {
				nums[h] += matrix[j][h]
			}
			s := 0
			rbt := redblacktree.NewWithIntComparator()
			rbt.Put(0, nil)
			for _, x := range nums {
				s += x
				if y, ok := rbt.Ceiling(s - k); ok {
					ans = max(ans, s-y.Key.(int))
				}
				rbt.Put(s, nil)
			}
		}

	}
	return ans
}
```

### Java

```java
// Max Sum of Rectangle No Larger Than K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxSumSubmatrix(int[][] matrix, int k) {
        int m = matrix.length;
        int n = matrix[0].length;
        final int inf = 1 << 30;
        int ans = -inf;
        for (int i = 0; i < m; ++i) {
            int[] nums = new int[n];
            for (int j = i; j < m; ++j) {
                for (int h = 0; h < n; ++h) {
                    nums[h] += matrix[j][h];
                }
                int s = 0;
                TreeSet<Integer> ts = new TreeSet<>();
                ts.add(0);
                for (int x : nums) {
                    s += x;
                    Integer y = ts.ceiling(s - k);
                    if (y != null) {
                        ans = Math.max(ans, s - y);
                    }
                    ts.add(s);
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Max Sum of Rectangle No Larger Than K：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSumSubmatrix(self, matrix: List[List[int]], k: int) -> int:
        m, n = len(matrix), len(matrix[0])
        ans = -inf
        for i in range(m):
            nums = [0] * n
            for j in range(i, m):
                for h in range(n):
                    nums[h] += matrix[j][h]
                s = 0
                ts = SortedSet([0])
                for x in nums:
                    s += x
                    p = ts.bisect_left(s - k)
                    if p != len(ts):
                        ans = max(ans, s - ts[p])
                    ts.add(s)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

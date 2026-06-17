# 1337. The K Weakest Rows in a Matrix

---
编号: 1337
题目: The K Weakest Rows in a Matrix
难度: 简单
标签: [数组, 二分查找, 矩阵, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/
---

## 题目描述

给你一个大小为 `m * n` 的矩阵 `mat`，矩阵由若干军人和平民组成，分别用 1 和 0 表示。

请你返回矩阵中战斗力最弱的 `k` 行的索引，按从最弱到最强排序。

如果第 ***i*** 行的军人数量少于第 ***j*** 行，或者两行军人数量相同但*** i*** 小于 ***j***，那么我们认为第*** i ***行的战斗力比第*** j ***行弱。

军人 **总是** 排在一行中的靠前位置，也就是说 1 总是出现在 0 之前。

**示例 1：**

```text
输入：mat =
[[1,1,0,0,0],
 [1,1,1,1,0],
 [1,0,0,0,0],
 [1,1,0,0,0],
 [1,1,1,1,1]],
k = 3
输出：[2,0,3]
解释：
每行中的军人数目：
行 0 -> 2
行 1 -> 4
行 2 -> 1
行 3 -> 2
行 4 -> 5
从最弱到最强对这些行排序后得到 [2,0,3,1,4]
```

**示例 2：**

```text
输入：mat =
[[1,0,0,0],
 [1,1,1,1],
 [1,0,0,0],
 [1,0,0,0]],
k = 2
输出：[0,2]
解释：
每行中的军人数目：
行 0 -> 1
行 1 -> 4
行 2 -> 1
行 3 -> 1
从最弱到最强对这些行排序后得到 [0,2,3,1]
```

**提示：**

- `m == mat.length`

- `n == mat[i].length`

- `2 <= n, m <= 100`

- `1 <= k <= m`

- `matrix[i][j]` 不是 0 就是 1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 矩阵, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// The K Weakest Rows in a Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func kWeakestRows(mat [][]int, k int) []int {
	m, n := len(mat), len(mat[0])
	res := make([]int, m)
	var idx []int
	for i, row := range mat {
		idx = append(idx, i)
		left, right := 0, n
		for left < right {
			mid := (left + right) >> 1
			if row[mid] == 0 {
				right = mid
			} else {
				left = mid + 1
			}
		}
		res[i] = left
	}
	sort.Slice(idx, func(i, j int) bool {
		return res[idx[i]] < res[idx[j]] || (res[idx[i]] == res[idx[j]] && idx[i] < idx[j])
	})
	return idx[:k]
}
```

### Java

```java
// The K Weakest Rows in a Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] kWeakestRows(int[][] mat, int k) {
        int m = mat.length, n = mat[0].length;
        int[] res = new int[m];
        List<Integer> idx = new ArrayList<>();
        for (int i = 0; i < m; ++i) {
            idx.add(i);
            int[] row = mat[i];
            int left = 0, right = n;
            while (left < right) {
                int mid = (left + right) >> 1;
                if (row[mid] == 0) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
            res[i] = left;
        }
        idx.sort(Comparator.comparingInt(a -> res[a]));
        int[] ans = new int[k];
        for (int i = 0; i < k; ++i) {
            ans[i] = idx.get(i);
        }
        return ans;
    }
}
```

### Python

```python
# The K Weakest Rows in a Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kWeakestRows(self, mat: List[List[int]], k: int) -> List[int]:
        m, n = len(mat), len(mat[0])
        ans = [n - bisect_right(row[::-1], 0) for row in mat]
        idx = list(range(m))
        idx.sort(key=lambda i: ans[i])
        return idx[:k]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

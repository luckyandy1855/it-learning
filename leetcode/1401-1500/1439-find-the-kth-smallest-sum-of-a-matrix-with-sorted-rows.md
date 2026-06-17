# 1439. Find the Kth Smallest Sum of a Matrix With Sorted Rows

---
编号: 1439
题目: Find the Kth Smallest Sum of a Matrix With Sorted Rows
难度: 困难
标签: [数组, 二分查找, 矩阵, 堆（优先队列）]
来源链接: https://leetcode.com/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/
---

## 题目描述

给你一个 `m * n` 的矩阵 `mat`，以及一个整数 `k` ，矩阵中的每一行都以非递减的顺序排列。

你可以从每一行中选出 1 个元素形成一个数组。返回所有可能数组中的第 k 个 **最小** 数组和。

**示例 1：**

```text
输入：mat = [[1,3,11],[2,4,6]], k = 5
输出：7
解释：从每一行中选出一个元素，前 k 个和最小的数组分别是：
[1,2], [1,4], [3,2], [3,4], [1,6]。其中第 5 个的和是 7 。
```

**示例 2：**

```text
输入：mat = [[1,3,11],[2,4,6]], k = 9
输出：17
```

**示例 3：**

```text
输入：mat = [[1,10,10],[1,4,5],[2,3,6]], k = 7
输出：9
解释：从每一行中选出一个元素，前 k 个和最小的数组分别是：
[1,1,2], [1,1,3], [1,4,2], [1,4,3], [1,1,6], [1,5,2], [1,5,3]。其中第 7 个的和是 9 。
```

**示例 4：**

```text
输入：mat = [[1,1,10],[2,2,9]], k = 7
输出：12
```

**提示：**

- `m == mat.length`

- `n == mat.length[i]`

- `1 <= m, n <= 40`

- `1 <= k <= min(200, n ^ m)`

- `1 <= mat[i][j] <= 5000`

- `mat[i]` 是一个非递减数组

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 矩阵, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们需要找出前 $m$ 行的所有可能数组中的第 $k$ 个最小数组和。

如果我们能够找出前 $m - 1$ 行的所有可能数组中的前 $k$ 个最小数组和，那么我们可以将第 $m$ 行的每个元素与前 $m - 1$ 行的前 $k$ 个最小数组和相加，将得到的所有结果排序后，取前 $k$ 个最小值，即为前 $m$ 行的所有可能数组中的前 $k$ 个最小值。

因此，我们可以定义一个数组 $pre$，用于存储此前遍历到的行的前 $k$ 个最小数组和，初始时 $pre$ 只有一个元素 $0$。

然后，我们遍历 $mat$ 的每一行 $cur$，将 $cur$ 中的每个元素与 $pre$ 中的每个元素相加，将得到的所有结果排序后，取前 $k$ 个最小值作为新的 $pre$。继续遍历下一行，直到遍历完所有行。

最后返回 $pre$ 中的第 $k$ 个数（下标 $k-1$）即可。

时间复杂度 $O(m \times n \times k \times \log (n \times k))$，空间复杂度 $O(n \times k)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Find the Kth Smallest Sum of a Matrix With Sorted Rows：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func kthSmallest(mat [][]int, k int) int {
	pre := []int{0}
	for _, row := range mat {
		cur := []int{}
		for _, a := range pre {
			for _, b := range row {
				cur = append(cur, a+b)
			}
		}
		sort.Ints(cur)
		pre = cur[:min(k, len(cur))]
	}
	return pre[k-1]
}
```

### Java

```java
// Find the Kth Smallest Sum of a Matrix With Sorted Rows：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int kthSmallest(int[][] mat, int k) {
        int m = mat.length, n = mat[0].length;
        List<Integer> pre = new ArrayList<>(k);
        List<Integer> cur = new ArrayList<>(n * k);
        pre.add(0);
        for (int[] row : mat) {
            cur.clear();
            for (int a : pre) {
                for (int b : row) {
                    cur.add(a + b);
                }
            }
            Collections.sort(cur);
            pre.clear();
            for (int i = 0; i < Math.min(k, cur.size()); ++i) {
                pre.add(cur.get(i));
            }
        }
        return pre.get(k - 1);
    }
}
```

### Python

```python
# Find the Kth Smallest Sum of a Matrix With Sorted Rows：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kthSmallest(self, mat: List[List[int]], k: int) -> int:
        pre = [0]
        for cur in mat:
            pre = sorted(a + b for a in pre for b in cur[:k])[:k]
        return pre[-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

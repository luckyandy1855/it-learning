# 0532. K-diff Pairs in an Array

---
编号: 532
题目: K-diff Pairs in an Array
难度: 中等
标签: [数组, 哈希表, 双指针, 二分查找, 排序]
来源链接: https://leetcode.com/problems/k-diff-pairs-in-an-array/
---

## 题目描述

给你一个整数数组 `nums` 和一个整数 `k`，请你在数组中找出** 不同的 **k-diff 数对，并返回不同的 **k-diff 数对** 的数目。

**k-diff** 数对定义为一个整数对 `(nums[i], nums[j])`** **，并满足下述全部条件：

- `0 <= i, j < nums.length`

- `i != j`

- `|nums[i] - nums[j]| == k`

**注意**，`|val|` 表示 `val` 的绝对值。

**示例 1：**

```text
输入：nums = [3, 1, 4, 1, 5], k = 2
输出：2
解释：数组中有两个 2-diff 数对, (1, 3) 和 (3, 5)。
尽管数组中有两个 1 ，但我们只应返回不同的数对的数量。
```

**示例 2：**

```text
输入：nums = [1, 2, 3, 4, 5], k = 1
输出：4
解释：数组中有四个 1-diff 数对, (1, 2), (2, 3), (3, 4) 和 (4, 5) 。
```

**示例 3：**

```text
输入：nums = [1, 3, 1, 5, 4], k = 0
输出：1
解释：数组中只有一个 0-diff 数对，(1, 1) 。
```

**提示：**

- `1 <= nums.length <= 10^4`

- `-10^7 <= nums[i] <= 10^7`

- `0 <= k <= 10^7`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 双指针, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于 $k$ 是一个定值，我们可以用一个哈希表 $\textit{ans}$ 记录数对的较小值，就能够确定较大的值。最后返回 $\textit{ans}$ 的大小作为答案。

遍历数组 $\textit{nums}$，当前遍历到的数 $x$，我们用哈希表 $\textit{vis}$ 记录此前遍历到的所有数字。若 $x-k$ 在 $\textit{vis}$ 中，则将 $x-k$ 添加至 $\textit{ans}$；若 $x+k$ 在 $\textit{vis}$ 中，则将 $x$ 添加至 $\textit{ans}$。然后我们将 $x$ 添加至 $\textit{vis}$。继续遍历数组 $\textit{nums}$ 直至遍历结束。

最后返回 $\textit{ans}$ 的大小作为答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

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
// K-diff Pairs in an Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findPairs(nums []int, k int) int {
	ans := make(map[int]struct{})
	vis := make(map[int]struct{})

	for _, x := range nums {
		if _, ok := vis[x-k]; ok {
			ans[x-k] = struct{}{}
		}
		if _, ok := vis[x+k]; ok {
			ans[x] = struct{}{}
		}
		vis[x] = struct{}{}
	}
	return len(ans)
}
```

### Java

```java
// K-diff Pairs in an Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findPairs(int[] nums, int k) {
        Set<Integer> ans = new HashSet<>();
        Set<Integer> vis = new HashSet<>();
        for (int x : nums) {
            if (vis.contains(x - k)) {
                ans.add(x - k);
            }
            if (vis.contains(x + k)) {
                ans.add(x);
            }
            vis.add(x);
        }
        return ans.size();
    }
}
```

### Python

```python
# K-diff Pairs in an Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findPairs(self, nums: List[int], k: int) -> int:
        ans = set()
        vis = set()
        for x in nums:
            if x - k in vis:
                ans.add(x - k)
            if x + k in vis:
                ans.add(x)
            vis.add(x)
        return len(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

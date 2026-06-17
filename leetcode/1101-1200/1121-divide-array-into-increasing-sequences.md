# 1121. Divide Array Into Increasing Sequences

---
编号: 1121
题目: Divide Array Into Increasing Sequences
难度: 困难
标签: [数组, 计数]
来源链接: https://leetcode.com/problems/divide-array-into-increasing-sequences/
---

## 题目描述

给你一个 **非递减** 的正整数数组 `nums` 和整数 `K`，判断该数组是否可以被分成一个或几个 **长度至少 为 **`K`** 的 不相交的递增子序列**。

**示例 1：**

```text
输入：nums = [1,2,2,3,3,4,4], K = 3
输出：true
解释：
该数组可以分成两个子序列 [1,2,3,4] 和 [2,3,4]，每个子序列的长度都至少是 3。
```

**示例 2：**

```text
输入：nums = [5,6,6,7,8], K = 3
输出：false
解释：
没有办法根据条件来划分数组。
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们假设可以将数组分成 $m$ 个长度至少为 $k$ 的严格递增子序列，如果数组中出现次数最多的数字的个数为 $cnt$，那么这 $cnt$ 个数字必须在不同的子序列中，所以 $m \geq cnt$，又因为 $m$ 个子序列的长度至少为 $k$，因此，子序列的个数越少越好，所以 $m = cnt$。那么 $cnt \times k \leq n$，才能满足题意。因此，我们只需要统计数组中出现次数最多的数字的个数 $cnt$，然后判断 $cnt \times k \leq n$ 即可。如果是，返回 `true`，否则返回 `false`。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为数组 $nums$ 的长度。

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
// Divide Array Into Increasing Sequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canDivideIntoSubsequences(nums []int, k int) bool {
	cnt, a := 0, 0
	for _, b := range nums {
		cnt++
		if a != b {
			cnt = 1
		}
		if cnt*k > len(nums) {
			return false
		}
		a = b
	}
	return true
}
```

### Java

```java
// Divide Array Into Increasing Sequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canDivideIntoSubsequences(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        int mx = 0;
        for (int x : nums) {
            mx = Math.max(mx, cnt.merge(x, 1, Integer::sum));
        }
        return mx * k <= nums.length;
    }
}
```

### Python

```python
# Divide Array Into Increasing Sequences：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canDivideIntoSubsequences(self, nums: List[int], k: int) -> bool:
        mx = max(len(list(x)) for _, x in groupby(nums))
        return mx * k <= len(nums)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

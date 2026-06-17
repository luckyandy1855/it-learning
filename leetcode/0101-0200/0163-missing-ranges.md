# 0163. Missing Ranges

---
编号: 163
题目: Missing Ranges
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/missing-ranges/
---

## 题目描述

给你一个闭区间 `[lower, upper]` 和一个 **按从小到大排序** 的整数数组 `nums`*** ***，其中元素的范围在闭区间 `[lower, upper]` 当中。

如果一个数字 `x` 在 `[lower, upper]` 区间内，并且 `x` 不在 `nums` 中，则认为 `x` **缺失**。

返回 **准确涵盖所有缺失数字 **的 **最小排序** 区间列表。也就是说，`nums` 的任何元素都不在任何区间内，并且每个缺失的数字都在其中一个区间内。

示例 1：

```text
输入: nums = [0, 1, 3, 50, 75], lower = 0 , upper = 99
输出: [[2,2],[4,49],[51,74],[76,99]]
解释：返回的区间是：
[2,2]
[4,49]
[51,74]
[76,99]
```

示例 2：

```text
输入： nums = [-1], lower = -1, upper = -1
输出： []
解释： 没有缺失的区间，因为没有缺失的数字。
```

**提示：**

	- `-10^9 <= lower <= upper <= 10^9`

	- `0 <= nums.length <= 100`

	- `lower <= nums[i] <= upper`

	- `nums` 中的所有值 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们直接按照题意模拟即可。

时间复杂度 $O(n)$，其中 $n$ 为数组 $nums$ 的长度。忽略答案的空间消耗，空间复杂度 $O(1)$。

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
// Missing Ranges：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMissingRanges(nums []int, lower int, upper int) (ans [][]int) {
	n := len(nums)
	if n == 0 {
		return [][]int{{lower, upper}}
	}
	if nums[0] > lower {
		ans = append(ans, []int{lower, nums[0] - 1})
	}
	for i, b := range nums[1:] {
		if a := nums[i]; b-a > 1 {
			ans = append(ans, []int{a + 1, b - 1})
		}
	}
	if nums[n-1] < upper {
		ans = append(ans, []int{nums[n-1] + 1, upper})
	}
	return
}
```

### Java

```java
// Missing Ranges：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> findMissingRanges(int[] nums, int lower, int upper) {
        int n = nums.length;
        if (n == 0) {
            return List.of(List.of(lower, upper));
        }
        List<List<Integer>> ans = new ArrayList<>();
        if (nums[0] > lower) {
            ans.add(List.of(lower, nums[0] - 1));
        }
        for (int i = 1; i < n; ++i) {
            if (nums[i] - nums[i - 1] > 1) {
                ans.add(List.of(nums[i - 1] + 1, nums[i] - 1));
            }
        }
        if (nums[n - 1] < upper) {
            ans.add(List.of(nums[n - 1] + 1, upper));
        }
        return ans;
    }
}
```

### Python

```python
# Missing Ranges：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMissingRanges(
        self, nums: List[int], lower: int, upper: int
    ) -> List[List[int]]:
        n = len(nums)
        if n == 0:
            return [[lower, upper]]
        ans = []
        if nums[0] > lower:
            ans.append([lower, nums[0] - 1])
        for a, b in pairwise(nums):
            if b - a > 1:
                ans.append([a + 1, b - 1])
        if nums[-1] < upper:
            ans.append([nums[-1] + 1, upper])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

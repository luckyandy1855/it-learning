# 0154. Find Minimum in Rotated Sorted Array II

---
编号: 154
题目: Find Minimum in Rotated Sorted Array II
难度: 困难
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/
---

## 题目描述

已知一个长度为 `n` 的数组，预先按照升序排列，经由 `1` 到 `n` 次 **旋转** 后，得到输入数组。例如，原数组 `nums = [0,1,4,4,5,6,7]` 在变化后可能得到：

	- 若旋转 `4` 次，则可以得到 `[4,5,6,7,0,1,4]`

	- 若旋转 `7` 次，则可以得到 `[0,1,4,4,5,6,7]`

注意，数组 `[a[0], a[1], a[2], ..., a[n-1]]` **旋转一次** 的结果为数组 `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]` 。

给你一个可能存在 **重复** 元素值的数组 `nums` ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 **最小元素** 。

你必须尽可能减少整个过程的操作步骤。

**示例 1：**

```text
输入：nums = [1,3,5]
输出：1
```

**示例 2：**

```text
输入：nums = [2,2,2,0,1]
输出：0
```

**提示：**

	- `n == nums.length`

	- `1 寻找旋转排序数组中的最小值 类似，但 `nums` 可能包含重复元素。允许重复会影响算法的时间复杂度吗？会如何影响，为什么？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义二分查找的左边界 $l = 0$，右边界 $r = n - 1$。每次计算中间位置 $mid = (l + r) \gg 1$，比较 $nums[mid]$ 和 $nums[r]$ 的大小关系：

- 如果 $nums[mid] > nums[r]$，说明最小值在 $mid$ 的右侧，因此将 $l$ 更新为 $mid + 1$。
- 如果 $nums[mid] = nums[r]$，无法确定最小值的位置，但可以将 $r$ 向左移动一位，即 $r = r - 1$，以缩小搜索范围。
- 如果 $nums[mid] < nums[r]$，说明最小值在 $mid$ 的左侧或 $mid$ 本身，因此将 $r$ 更新为 $mid$。

当 $l$ 与 $r$ 相遇时，指针 $l$ 就指向了最小值的位置，返回 $nums[l]$ 即可。

时间复杂度 $O(n)$，最坏情况下数组中所有元素都相同，需要遍历整个数组。空间复杂度 $O(1)$。

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
// Find Minimum in Rotated Sorted Array II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMin(nums []int) int {
	l, r := 0, len(nums)-1
	for l < r {
		mid := (l + r) >> 1
		if nums[mid] > nums[r] {
			l = mid + 1
		} else if nums[mid] == nums[r] {
			r--
		} else {
			r = mid
		}
	}
	return nums[l]
}
```

### Java

```java
// Find Minimum in Rotated Sorted Array II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMin(int[] nums) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (nums[mid] > nums[r]) {
                l = mid + 1;
            } else if (nums[mid] == nums[r]) {
                r--;
            } else {
                r = mid;
            }
        }
        return nums[l];
    }
}
```

### Python

```python
# Find Minimum in Rotated Sorted Array II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMin(self, nums: List[int]) -> int:
        l, r = 0, len(nums) - 1
        while l < r:
            mid = (l + r) >> 1
            if nums[mid] > nums[r]:
                l = mid + 1
            elif nums[mid] == nums[r]:
                r -= 1
            else:
                r = mid
        return nums[l]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

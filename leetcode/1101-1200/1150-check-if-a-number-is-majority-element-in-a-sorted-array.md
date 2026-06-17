# 1150. Check If a Number Is Majority Element in a Sorted Array

---
编号: 1150
题目: Check If a Number Is Majority Element in a Sorted Array
难度: 简单
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/check-if-a-number-is-majority-element-in-a-sorted-array/
---

## 题目描述

给出一个按 **非递减** 顺序排列的数组 `nums`，和一个目标数值 `target`。假如数组 `nums` 中绝大多数元素的数值都等于 `target`，则返回 `True`，否则请返回 `False`。

所谓占绝大多数，是指在长度为 `N` 的数组中出现必须** 超过 `N/2`** **次**。

**示例 1：**

```text
输入：nums = [2,4,5,5,5,5,5,6,6], target = 5
输出：true
解释：
数字 5 出现了 5 次，而数组的长度为 9。
所以，5 在数组中占绝大多数，因为 5 次 > 9/2。
```

**示例 2：**

```text
输入：nums = [10,100,101,101], target = 101
输出：false
解释：
数字 101 出现了 2 次，而数组的长度是 4。
所以，101 不是 数组占绝大多数的元素，因为 2 次 = 4/2。
```

**提示：**

- `1 <= nums.length <= 1000`

- `1 <= nums[i] <= 10^9`

- `1 <= target <= 10^9`

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

我们注意到，数组 $nums$ 中的元素是非递减的，也就是说，数组 $nums$ 中的元素单调递增。因此，我们可以使用二分查找的方法，找到数组 $nums$ 中第一个大于等于 $target$ 的元素的下标 $left$，以及第一个大于 $target$ 的元素的下标 $right$。如果 $right - left > \frac{n}{2}$，则说明数组 $nums$ 中的元素 $target$ 出现的次数超过了数组长度的一半，因此返回 $true$，否则返回 $false$。

时间复杂度 $O(\log n)$，空间复杂度 $O(1)$。其中 $n$ 为数组 $nums$ 的长度。

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
// Check If a Number Is Majority Element in a Sorted Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isMajorityElement(nums []int, target int) bool {
	left := sort.SearchInts(nums, target)
	right := sort.SearchInts(nums, target+1)
	return right-left > len(nums)/2
}
```

### Java

```java
// Check If a Number Is Majority Element in a Sorted Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isMajorityElement(int[] nums, int target) {
        int left = search(nums, target);
        int right = search(nums, target + 1);
        return right - left > nums.length / 2;
    }

    private int search(int[] nums, int x) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = (left + right) >> 1;
            if (nums[mid] >= x) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```

### Python

```python
# Check If a Number Is Majority Element in a Sorted Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isMajorityElement(self, nums: List[int], target: int) -> bool:
        left = bisect_left(nums, target)
        right = bisect_right(nums, target)
        return right - left > len(nums) // 2
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

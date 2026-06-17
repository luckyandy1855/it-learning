# 0034. Find First and Last Position of Element in Sorted Array

---
编号: 34
题目: Find First and Last Position of Element in Sorted Array
难度: 中等
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
---

## 题目描述

给定按升序排列的整数数组 `nums` 和目标值 `target`，找出 `target` 在数组中的**起始位置和终止位置**。

如果数组中不存在 `target`，返回 `[-1, -1]`。

要求算法时间复杂度为 O(log n)。

### Example 1

```text
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```

### Example 2

```text
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```

### Example 3

```text
Input: nums = [], target = 0
Output: [-1,-1]
```

### 约束条件

- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `nums` 按非递减顺序排列。

## 思路分析

### 突破口

两次二分：一次找左边界（第一个 `>= target` 的位置），一次找右边界（第一个 `> target` 的位置减 1）。

### 思路拆解

1. **找左边界**：二分找第一个 `nums[mid] >= target` 的最左位置（`lowerBound`）。

2. **找右边界**：二分找第一个 `nums[mid] > target` 的位置，再减 1（`upperBound - 1`）。

3. **验证**：若左边界超出数组范围或 `nums[left] != target`，说明 target 不存在，返回 `[-1, -1]`。

4. **统一模板**：两次二分可以统一为"找最左的满足条件的位置"，只是条件不同（`>= target` vs `> target`）。

### 示意图

```text
nums = [5,7,7,8,8,10], target = 8

找左边界（第一个 >= 8）：
lo=0,hi=5: mid=2,nums[2]=7 < 8 → lo=3
lo=3,hi=5: mid=4,nums[4]=8 >= 8 → hi=4
lo=3,hi=4: mid=3,nums[3]=8 >= 8 → hi=3
lo=3,hi=3: mid=3,nums[3]=8 >= 8 → hi=2
lo>hi,结束,left=lo=3

找右边界（第一个 > 8），再减 1：
lo=0,hi=5: mid=2,nums[2]=7 ≤ 8 → lo=3
lo=3,hi=5: mid=4,nums[4]=8 ≤ 8 → lo=5
lo=5,hi=5: mid=5,nums[5]=10 > 8 → hi=4
lo>hi,结束,right=lo-1=4

结果: [3, 4]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 两次二分 | O(log n) | O(1) |

## 代码实现

### Go

```go
// searchRange 在有序数组中找 target 的起始和终止下标
// 参数：nums 升序整数数组，target 目标值
// 返回：[起始下标, 终止下标]，不存在返回 [-1,-1]
func searchRange(nums []int, target int) []int {
    left := lowerBound(nums, target)
    // 验证 target 是否存在
    if left == len(nums) || nums[left] != target {
        return []int{-1, -1}
    }
    right := lowerBound(nums, target+1) - 1
    return []int{left, right}
}

// lowerBound 返回第一个 >= val 的下标（若全部 < val 则返回 len(nums)）
func lowerBound(nums []int, val int) int {
    lo, hi := 0, len(nums)
    for lo < hi {
        mid := lo + (hi-lo)/2
        if nums[mid] < val {
            lo = mid + 1
        } else {
            hi = mid
        }
    }
    return lo
}
```

### Java

```java
class Solution {
    /**
     * 在有序数组中找 target 的起始和终止下标。
     *
     * @param nums   升序整数数组
     * @param target 目标值
     * @return [起始, 终止]，不存在返回 [-1,-1]
     */
    public int[] searchRange(int[] nums, int target) {
        int left = lowerBound(nums, target);
        if (left == nums.length || nums[left] != target) return new int[]{-1, -1};
        int right = lowerBound(nums, target + 1) - 1;
        return new int[]{left, right};
    }

    // 找第一个 >= val 的下标
    private int lowerBound(int[] nums, int val) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}
```

### Python

```python
import bisect

class Solution:
    def searchRange(self, nums: list[int], target: int) -> list[int]:
        """
        在有序数组中找 target 的起始和终止下标。

        参数:
            nums:   升序整数数组
            target: 目标值
        返回:
            [起始下标, 终止下标]，不存在返回 [-1,-1]
        """
        left = bisect.bisect_left(nums, target)
        if left == len(nums) or nums[left] != target:
            return [-1, -1]
        right = bisect.bisect_right(nums, target) - 1
        return [left, right]
```

## 踩坑记录

- **`lowerBound` 的右界是 `len(nums)`**：二分区间是 `[lo, hi)` 半开区间，`hi` 初始化为 `len(nums)`（而不是 `len(nums)-1`），这样返回值可以表示"所有元素都 < val"的情况（返回 `len(nums)`）。
- **验证 target 存在**：找到左边界后必须检查 `nums[left] == target`，因为即使 target 不存在，lowerBound 也会返回一个合法下标（它找的是 `>= target` 的位置，可能指向更大的元素）。
- **右边界 = `lowerBound(target+1) - 1`**：`lowerBound(target+1)` 找第一个 `> target` 的位置，减 1 就是最后一个 `== target` 的位置。这比单独写 upperBound 更简洁。

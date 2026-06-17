# 0033. Search in Rotated Sorted Array

---
编号: 33
题目: Search in Rotated Sorted Array
难度: 中等
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/search-in-rotated-sorted-array/
---

## 题目描述

给定一个按升序排列的整数数组，该数组在某个未知的轴点处被旋转（如 `[0,1,2,4,5,6,7]` 可能变成 `[4,5,6,7,0,1,2]`）。给定旋转后的数组 `nums` 和目标值 `target`，如果 `target` 存在则返回其下标，否则返回 `-1`。

要求算法时间复杂度为 O(log n)。

题目保证：

- `nums` 中所有元素**唯一**。

### Example 1

```text
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

### Example 2

```text
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

### Example 3

```text
Input: nums = [1], target = 0
Output: -1
```

### 约束条件

- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 中所有元素唯一。
- `nums` 是某个升序数组旋转后的结果。

## 思路分析

### 突破口

旋转后数组被分成两段有序子数组，二分时判断中点在哪一段，再判断 target 是否在有序的那半边，从而决定搜索方向。

### 思路拆解

1. **二分搜索**：`lo=0, hi=n-1`，每次取 `mid`。

2. **判断哪半有序**：
   - 若 `nums[lo] <= nums[mid]`：左半 `[lo, mid]` 有序。
   - 否则：右半 `[mid, hi]` 有序。

3. **判断 target 是否在有序半边**：
   - 左半有序且 `nums[lo] <= target < nums[mid]`：在左半，`hi = mid-1`。
   - 否则去右半：`lo = mid+1`。
   - 对称处理右半有序的情况。

4. **实现要点**：比较时注意等号：`nums[lo] <= nums[mid]`（含等号，处理 `lo==mid` 的情况）；target 范围判断要严格。

### 示意图

```text
nums = [4,5,6,7,0,1,2], target=0
lo=0, hi=6

mid=3: nums[3]=7
  nums[0]=4 <= nums[3]=7 → 左半[4,5,6,7]有序
  target=0 在 [4,7] 内? 0 < 4 → 不在左半
  → lo=4

lo=4, hi=6, mid=5: nums[5]=1
  nums[4]=0 <= nums[5]=1 → 左半[0,1]有序
  target=0 在 [0,1] 内? 0 >= 0 且 0 < 1 → 在左半
  → hi=4

lo=4, hi=4, mid=4: nums[4]=0 == target → 返回 4
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 二分搜索 | O(log n) | O(1) |

## 代码实现

### Go

```go
// search 在旋转有序数组中二分查找 target
// 参数：nums 旋转后的有序数组，target 目标值
// 返回：target 的下标，不存在返回 -1
func search(nums []int, target int) int {
    lo, hi := 0, len(nums)-1

    for lo <= hi {
        mid := lo + (hi-lo)/2
        if nums[mid] == target {
            return mid
        }

        // 判断左半是否有序
        if nums[lo] <= nums[mid] {
            // target 在有序的左半区间内
            if nums[lo] <= target && target < nums[mid] {
                hi = mid - 1
            } else {
                lo = mid + 1
            }
        } else {
            // 右半有序，判断 target 是否在右半区间内
            if nums[mid] < target && target <= nums[hi] {
                lo = mid + 1
            } else {
                hi = mid - 1
            }
        }
    }
    return -1
}
```

### Java

```java
class Solution {
    /**
     * 在旋转有序数组中二分查找 target。
     *
     * @param nums   旋转后的有序数组
     * @param target 目标值
     * @return target 的下标，不存在返回 -1
     */
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;

            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}
```

### Python

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        """
        在旋转有序数组中二分查找 target。

        参数:
            nums:   旋转后的有序数组
            target: 目标值
        返回:
            target 的下标，不存在返回 -1
        """
        lo, hi = 0, len(nums) - 1

        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid

            if nums[lo] <= nums[mid]:  # 左半有序
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:  # 右半有序
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1

        return -1
```

## 踩坑记录

- **判断有序用 `<=` 不用 `<`**：`nums[lo] <= nums[mid]` 而不是 `<`，因为 `lo == mid` 时（数组只剩一个元素）需要正确处理，否则会死循环或走错分支。
- **target 在有序区间的范围判断**：左半有序时，`nums[lo] <= target && target < nums[mid]`（严格小于 mid，因为 mid 已单独检查过）；右半有序时 `nums[mid] < target && target <= nums[hi]`。等号位置容易搞错。
- **含重复元素的版本（第 81 题）**：有重复时 `nums[lo] == nums[mid]` 无法判断哪半有序，需要加 `lo++` 缩小范围，最坏 O(n)。

# 0035. Search Insert Position

---
编号: 35
题目: Search Insert Position
难度: 简单
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/search-insert-position/
---

## 题目描述

给定一个**无重复元素**的升序整数数组 `nums` 和目标值 `target`：

- 如果 `target` 存在于数组中，返回其下标。
- 如果不存在，返回它将被顺序插入的位置（即数组中第一个大于 `target` 的元素的下标）。

要求时间复杂度为 O(log n)。

### Example 1

```text
Input: nums = [1,3,5,6], target = 5
Output: 2
```

### Example 2

```text
Input: nums = [1,3,5,6], target = 2
Output: 1
Explanation: 2 应插入到 1 和 3 之间，下标为 1。
```

### Example 3

```text
Input: nums = [1,3,5,6], target = 7
Output: 4
Explanation: 7 大于所有元素，插入到末尾，下标为 4。
```

### 约束条件

- `1 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 无重复元素且升序排列。

## 思路分析

### 突破口

标准 lower_bound：找第一个 `>= target` 的下标，即是答案（存在则命中，不存在则是插入位置）。

### 思路拆解

1. **二分**：`lo=0, hi=len(nums)`（注意 `hi` 开区间可以指向末尾插入位置），循环 `lo < hi`，每次取 `mid`：若 `nums[mid] < target` 则 `lo = mid+1`，否则 `hi = mid`。循环结束时 `lo` 就是答案。

2. **实现要点**：`hi = len(nums)` 而不是 `len(nums)-1`，这样目标值大于所有元素时 `lo` 能返回 `len(nums)`（插入末尾）。

### 示意图

```text
nums = [1,3,5,6], target = 2

lo=0, hi=4: mid=2, nums[2]=5 >= 2 → hi=2
lo=0, hi=2: mid=1, nums[1]=3 >= 2 → hi=1
lo=0, hi=1: mid=0, nums[0]=1 < 2 → lo=1
lo=1, hi=1: 退出，返回 1

nums[1]=3 > 2，所以 2 插在下标 1 ✓
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 二分（lower_bound） | O(log n) | O(1) |

## 代码实现

### Go

```go
// searchInsert 在有序无重复数组中找 target 的下标或插入位置
// 参数：nums 升序无重复整数数组，target 目标值
// 返回：target 的下标或应插入的下标
func searchInsert(nums []int, target int) int {
    lo, hi := 0, len(nums) // hi 开区间，支持插入末尾
    for lo < hi {
        mid := lo + (hi-lo)/2
        if nums[mid] < target {
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
     * 在有序无重复数组中找 target 的下标或插入位置。
     *
     * @param nums   升序无重复整数数组
     * @param target 目标值
     * @return target 的下标或应插入的下标
     */
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
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
    def searchInsert(self, nums: list[int], target: int) -> int:
        """
        在有序无重复数组中找 target 的下标或插入位置。

        参数:
            nums:   升序无重复整数数组
            target: 目标值
        返回:
            target 的下标或应插入的下标
        """
        # bisect_left 返回第一个 >= target 的位置，等价于 lower_bound
        return bisect.bisect_left(nums, target)
```

## 踩坑记录

- **`hi` 初始化为 `len(nums)` 不是 `len(nums)-1`**：当 target 大于所有元素时，插入位置是 `len(nums)`。若 `hi = len(nums)-1`，最终 `lo` 最大只能是 `len(nums)-1`，无法表达末尾插入。
- **循环条件是 `lo < hi`**：标准 lower_bound 模板用 `lo < hi`，退出时 `lo == hi` 就是答案。若用 `lo <= hi` 需要不同的返回逻辑。
- **这道题就是 `bisect_left`**：Python 标准库 `bisect.bisect_left(nums, target)` 直接给出答案，是最简写法。

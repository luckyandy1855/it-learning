# 0081. Search in Rotated Sorted Array II

---
编号: 81
题目: Search in Rotated Sorted Array II
难度: 中等
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/search-in-rotated-sorted-array-ii/
---

## 题目描述

与 0033 Search in Rotated Sorted Array 相同，但数组中**可能包含重复元素**。给定旋转后的数组 `nums` 和目标值 `target`，判断 `target` 是否存在于数组中。

### Example 1

```text
Input: nums = [2,5,6,0,0,1,2], target = 0
Output: true
```

### Example 2

```text
Input: nums = [2,5,6,0,0,1,2], target = 3
Output: false
```

### 约束条件

- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 是某个有序数组旋转后的结果，可含重复元素

## 思路分析

### 突破口

在 0033 基础上处理重复元素带来的歧义：当 `nums[lo] == nums[mid]` 时无法判断哪半有序，此时收缩左端点 `lo++` 跳过重复。

### 思路拆解

1. **与 0033 相同的主框架**：若左半 `[lo, mid]` 有序，target 在范围内则缩小到左半，否则右半；反之亦然。

2. **新增情况 `nums[lo] == nums[mid]`**：无法确定哪半有序，只能 `lo++` 跳过一个重复元素，退化为线性扫描。

3. **最坏 O(n)**：如 `[1,1,1,1,1,2]` 每次只能缩小一个元素。

### 示意图

```text
nums = [2,5,6,0,0,1,2], target=0
lo=0, hi=6
mid=3: nums[3]=0=target → true

nums = [1,3,1,1,1], target=3
lo=0,hi=4,mid=2: nums[0]=1=nums[2]=1 → lo++(无法判断方向)
lo=1,hi=4,mid=2: nums[1]=3=target → true
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 二分（带去重） | O(n) 最坏，O(log n) 平均 | O(1) |

## 代码实现

### Go

```go
// search 判断 target 是否在旋转有序（可重复）数组中
func search(nums []int, target int) bool {
    lo, hi := 0, len(nums)-1

    for lo <= hi {
        mid := lo + (hi-lo)/2
        if nums[mid] == target {
            return true
        }
        // 无法判断方向时，跳过左端重复
        if nums[lo] == nums[mid] {
            lo++
            continue
        }
        if nums[lo] < nums[mid] { // 左半有序
            if nums[lo] <= target && target < nums[mid] {
                hi = mid - 1
            } else {
                lo = mid + 1
            }
        } else { // 右半有序
            if nums[mid] < target && target <= nums[hi] {
                lo = mid + 1
            } else {
                hi = mid - 1
            }
        }
    }
    return false
}
```

### Java

```java
class Solution {
    /**
     * 判断 target 是否在旋转有序（可重复）数组中。
     */
    public boolean search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return true;

            if (nums[lo] == nums[mid]) { // 无法判断，跳过左端重复
                lo++;
                continue;
            }
            if (nums[lo] < nums[mid]) { // 左半有序
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else { // 右半有序
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return false;
    }
}
```

### Python

```python
class Solution:
    def search(self, nums: list[int], target: int) -> bool:
        """
        判断 target 是否在旋转有序（可重复）数组中。
        """
        lo, hi = 0, len(nums) - 1

        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return True

            if nums[lo] == nums[mid]:  # 无法判断哪半有序
                lo += 1
                continue

            if nums[lo] < nums[mid]:  # 左半有序
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:  # 右半有序
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1

        return False
```

## 踩坑记录

- **`nums[lo] == nums[mid]` 时的退化处理**：只能 `lo++`，最坏情况如全相同数组会退化为 O(n) 线性扫描，这是引入重复元素的代价。
- **与 0033 的核心区别**：仅多了 `if nums[lo] == nums[mid]: lo++` 这一分支；其余逻辑完全相同。
- **`continue` 的必要性**：跳过 `lo++` 后需要重新进入循环比较，不能直接 `lo++` 后继续执行 if/else（会用 lo++前的判断条件做错误推断）。

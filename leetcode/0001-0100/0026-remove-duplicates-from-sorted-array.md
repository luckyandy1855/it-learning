# 0026. Remove Duplicates from Sorted Array

---
编号: 26
题目: Remove Duplicates from Sorted Array
难度: 简单
标签: [数组, 双指针]
来源链接: https://leetcode.com/problems/remove-duplicates-from-sorted-array/
---

## 题目描述

给定一个按**非递减顺序**排列的整数数组 `nums`，**原地**删除重复元素，使每个元素只出现一次，返回删除后数组的新长度 `k`。

要求前 `k` 个元素包含原数组的不重复元素（顺序一致），后面的元素无要求。

题目保证：

- 不需要额外申请数组空间，必须原地修改。

### Example 1

```text
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: 返回 k=2，前 2 个元素为 [1,2]，后面的值无关紧要。
```

### Example 2

```text
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
```

### 约束条件

- `1 <= nums.length <= 3 * 10^4`
- `-100 <= nums[i] <= 100`
- `nums` 按非递减顺序排列。

## 思路分析

### 突破口

快慢双指针：慢指针 `k` 表示下一个不重复元素的写入位置，快指针遍历数组，遇到与 `nums[k-1]` 不同的值时写入并推进 `k`。

### 思路拆解

1. **问题转化**：数组已有序，重复的元素必然相邻。只需保留每组连续相同元素的第一个。

2. **双指针**：`k=1`（第一个元素一定保留），从 `i=1` 开始遍历。若 `nums[i] != nums[k-1]`，则 `nums[k] = nums[i]`，`k++`。

3. **实现要点**：初始 `k=1`，因为第一个元素永远保留；循环从 `i=1` 开始即可。

### 示意图

```text
nums = [0,0,1,1,1,2,2,3,3,4]
          k=1 (写入位)

i=0: nums[0]=0, k-1=0, 0==0, 跳过 (k 初始为 1，i 从 1 开始)
i=1: nums[1]=0, nums[k-1]=nums[0]=0, 相同 → 跳过
i=2: nums[2]=1, nums[k-1]=nums[0]=0, 不同 → nums[1]=1, k=2
i=3: nums[3]=1, nums[k-1]=nums[1]=1, 相同 → 跳过
i=4: nums[4]=1, 相同 → 跳过
i=5: nums[5]=2, nums[k-1]=nums[1]=1, 不同 → nums[2]=2, k=3
...
最终 k=5, nums=[0,1,2,3,4,...]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 双指针 | O(n) | O(1) |

## 代码实现

### Go

```go
// removeDuplicates 原地删除有序数组中的重复元素，返回不重复元素个数
// 参数：nums 非递减有序整数数组（原地修改）
// 返回：不重复元素个数 k，前 k 个元素即为去重结果
func removeDuplicates(nums []int) int {
    if len(nums) == 0 {
        return 0
    }

    k := 1 // 写入指针，第一个元素直接保留
    for i := 1; i < len(nums); i++ {
        // 遇到新值（与已保留的最后一个不同），写入
        if nums[i] != nums[k-1] {
            nums[k] = nums[i]
            k++
        }
    }
    return k
}
```

### Java

```java
class Solution {
    /**
     * 原地删除有序数组中的重复元素，返回不重复元素个数。
     *
     * @param nums 非递减有序整数数组（原地修改）
     * @return 不重复元素个数 k
     */
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;

        int k = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[k - 1]) {
                nums[k++] = nums[i];
            }
        }
        return k;
    }
}
```

### Python

```python
class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        """
        原地删除有序数组中的重复元素，返回不重复元素个数。

        参数:
            nums: 非递减有序整数数组（原地修改）
        返回:
            不重复元素个数 k
        """
        if not nums:
            return 0

        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k
```

## 踩坑记录

- **比较的是 `nums[k-1]`，不是 `nums[i-1]`**：`nums[i-1]` 是上一个遍历元素（快指针上一步），可能是重复值；`nums[k-1]` 是当前已保留的最后一个不重复元素，这才是正确的比较基准。
- **空数组特判**：`nums` 为空时 `k=1` 仍正确（返回 0 需要额外特判，或可以从 `k=0` 开始，但初始化逻辑稍有不同）。
- **原地修改**：直接覆盖 `nums[k]`，不需要移动后续元素，与 Python 的 `del` 或 Java 的 `System.arraycopy` 不同，时间复杂度 O(n)。

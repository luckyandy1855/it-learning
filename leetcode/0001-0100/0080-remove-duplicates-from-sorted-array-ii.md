# 0080. Remove Duplicates from Sorted Array II

---
编号: 80
题目: Remove Duplicates from Sorted Array II
难度: 中等
标签: [数组, 双指针]
来源链接: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/
---

## 题目描述

给定一个有序整数数组 `nums`，**原地**删除重复项，使得每个元素**最多出现两次**，返回新数组的长度 k。

不需要考虑数组中超出 k 的部分。

### Example 1

```text
Input: nums = [1,1,1,2,2,3]
Output: k=5, nums = [1,1,2,2,3,_]
```

### Example 2

```text
Input: nums = [0,0,1,1,1,1,2,3,3]
Output: k=7, nums = [0,0,1,1,2,3,3,_,_]
```

### 约束条件

- `1 <= nums.length <= 3 * 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 已按升序排列

## 思路分析

### 突破口

快慢双指针，与 0026 类似，但允许重复两次：慢指针 `k` 指向下一个写入位置，快指针 `i` 枚举元素，若 `nums[i] != nums[k-2]`（与前两个不同）则写入。

### 思路拆解

1. **通用模式**：若允许重复 `at_most` 次，则条件为 `k < at_most || nums[i] != nums[k - at_most]`。

2. **初始化 `k=2`**：前两个元素直接保留（至多两次，不管是否重复）。

3. **遍历 `i` 从 2 开始**：若 `nums[i] != nums[k-2]`，写入 `nums[k] = nums[i]`, `k++`。

### 示意图

```text
nums = [1,1,1,2,2,3]
k=2 (前两位保留)
i=2: nums[2]=1 == nums[k-2]=nums[0]=1 → 跳过
i=3: nums[3]=2 != nums[0]=1 → nums[2]=2, k=3
i=4: nums[4]=2 != nums[1]=1 → nums[3]=2, k=4
i=5: nums[5]=3 != nums[2]=2 → nums[4]=3, k=5

结果: [1,1,2,2,3,_], k=5
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 快慢指针 | O(n) | O(1) |

## 代码实现

### Go

```go
// removeDuplicates 原地删除使每个元素最多出现两次，返回新长度
func removeDuplicates(nums []int) int {
    k := 2 // 前两个直接保留
    if len(nums) <= 2 {
        return len(nums)
    }
    for i := 2; i < len(nums); i++ {
        if nums[i] != nums[k-2] { // 与前两个比较
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
     * 原地删除使每个元素最多出现两次，返回新长度。
     */
    public int removeDuplicates(int[] nums) {
        int k = 2;
        if (nums.length <= 2) return nums.length;

        for (int i = 2; i < nums.length; i++) {
            if (nums[i] != nums[k - 2]) { // 与写指针前两位比较
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
        原地删除使每个元素最多出现两次，返回新长度（快慢指针）。
        """
        k = 2
        if len(nums) <= 2:
            return len(nums)

        for i in range(2, len(nums)):
            if nums[i] != nums[k - 2]:  # 与前两位比较
                nums[k] = nums[i]
                k += 1

        return k
```

## 踩坑记录

- **比较 `nums[k-2]` 而非 `nums[i-2]`**：`k` 是写入指针，比较写入位置的前两个才能保证已写入部分每个元素不超过 2 次；若比较 `nums[i-2]` 可能因为跳过元素而判断错误。
- **扩展为允许重复 n 次**：将 `k-2` 改为 `k-n`，条件改为 `nums[i] != nums[k-n]`，通用模板。
- **与 0026 的区别**：0026 允许最多 1 次（`nums[i] != nums[k-1]`），本题允许最多 2 次（`nums[i] != nums[k-2]`）。

# 0027. Remove Element

---
编号: 27
题目: Remove Element
难度: 简单
标签: [数组, 双指针]
来源链接: https://leetcode.com/problems/remove-element/
---

## 题目描述

给定整数数组 `nums` 和整数 `val`，**原地**删除所有等于 `val` 的元素，返回删除后数组的新长度 `k`。

要求前 `k` 个元素不含 `val`，后面的元素无要求。元素顺序可以改变。

### Example 1

```text
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
```

### Example 2

```text
Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: 前 5 个元素不含 2，顺序可变。
```

### 约束条件

- `0 <= nums.length <= 100`
- `0 <= nums[i] <= 50`
- `0 <= val <= 100`

## 思路分析

### 突破口

双指针：慢指针 `k` 记录写入位置，快指针遍历数组，遇到不等于 `val` 的值就写入 `nums[k]` 并推进 `k`。

### 思路拆解

1. **覆盖写法（快慢指针）**：`k=0`，遍历 `i`，若 `nums[i] != val` 则 `nums[k++] = nums[i]`。O(n) 时间，适合 `val` 出现较少的情况。

2. **交换写法（双端指针）**：`l=0, r=n-1`，遇到 `nums[l]==val` 时与 `nums[r]` 交换并 `r--`，否则 `l++`。减少了元素移动次数，适合 `val` 出现较多的情况。

### 示意图

```text
nums = [0,1,2,2,3,0,4,2], val = 2

k=0, i=0: nums[0]=0 ≠ 2 → nums[0]=0, k=1
k=1, i=1: nums[1]=1 ≠ 2 → nums[1]=1, k=2
k=2, i=2: nums[2]=2 = 2 → 跳过
k=2, i=3: nums[3]=2 = 2 → 跳过
k=2, i=4: nums[4]=3 ≠ 2 → nums[2]=3, k=3
k=3, i=5: nums[5]=0 ≠ 2 → nums[3]=0, k=4
k=4, i=6: nums[6]=4 ≠ 2 → nums[4]=4, k=5
k=5, i=7: nums[7]=2 = 2 → 跳过
返回 k=5, nums=[0,1,3,0,4,...]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 快慢指针 | O(n) | O(1) |

## 代码实现

### Go

```go
// removeElement 原地删除数组中所有等于 val 的元素，返回剩余元素个数
// 参数：nums 整数数组（原地修改），val 要删除的值
// 返回：前 k 个元素不含 val 的新长度 k
func removeElement(nums []int, val int) int {
    k := 0
    for _, num := range nums {
        if num != val {
            nums[k] = num
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
     * 原地删除数组中所有等于 val 的元素，返回剩余元素个数。
     *
     * @param nums 整数数组（原地修改）
     * @param val  要删除的值
     * @return 前 k 个元素不含 val 的新长度 k
     */
    public int removeElement(int[] nums, int val) {
        int k = 0;
        for (int num : nums) {
            if (num != val) nums[k++] = num;
        }
        return k;
    }
}
```

### Python

```python
class Solution:
    def removeElement(self, nums: list[int], val: int) -> int:
        """
        原地删除数组中所有等于 val 的元素，返回剩余元素个数。

        参数:
            nums: 整数数组（原地修改）
            val:  要删除的值
        返回:
            前 k 个元素不含 val 的新长度 k
        """
        k = 0
        for num in nums:
            if num != val:
                nums[k] = num
                k += 1
        return k
```

## 踩坑记录

- **原地修改，不能用新列表过滤**：`nums = [x for x in nums if x != val]` 创建了新列表，不符合题目原地要求（虽然 LeetCode Python 评测通常接受，但不是正确思路）。
- **元素顺序可以改变**：题目说顺序可以改变，所以可以用双端指针（遇到 val 就和末尾交换），减少写入次数，但本题数据量小，快慢指针已够用。
- **返回值是新长度，不是 val 出现次数**：不要返回 `n - count(val)`，直接返回写入指针 `k` 更清晰。

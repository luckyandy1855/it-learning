# 0031. Next Permutation

---
编号: 31
题目: Next Permutation
难度: 中等
标签: [数组, 双指针]
来源链接: https://leetcode.com/problems/next-permutation/
---

## 题目描述

给定整数数组 `nums`，将其原地重排为**下一个字典序更大的排列**。

如果不存在更大的排列（已是最大排列，即降序排列），则将数组重排为最小排列（升序排列）。

必须原地修改，只允许使用常数额外空间。

### Example 1

```text
Input: nums = [1,2,3]
Output: [1,3,2]
```

### Example 2

```text
Input: nums = [3,2,1]
Output: [1,2,3]
Explanation: 已是最大排列，变为最小排列。
```

### Example 3

```text
Input: nums = [1,1,5]
Output: [1,5,1]
```

### 约束条件

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 100`

## 思路分析

### 突破口

从右往左找第一个"下降点" `i`（`nums[i] < nums[i+1]`），再从右往左找第一个大于 `nums[i]` 的数 `j`，交换它们，然后反转 `[i+1, n-1]` 使后缀变为升序（最小）。

### 思路拆解

1. **从右找下降点**：从右往左扫描，找最后一个满足 `nums[i] < nums[i+1]` 的位置 `i`。若不存在（整个数组递减），说明已是最大排列，直接反转整个数组。

2. **找替换元素**：从右往左找第一个大于 `nums[i]` 的元素 `j`，交换 `nums[i]` 和 `nums[j]`。

3. **反转后缀**：交换后，`[i+1, n-1]` 仍是降序，反转为升序以得到最小后缀（即下一个字典序最近的排列）。

### 示意图

```text
nums = [1, 3, 5, 4, 2]

Step1: 从右找下降点
  i=3: nums[3]=4 > nums[4]=2 → 不是
  i=2: nums[2]=5 > nums[3]=4 → 不是
  i=1: nums[1]=3 < nums[2]=5 → 找到! i=1

Step2: 从右找第一个 > nums[1]=3 的数
  j=4: nums[4]=2 < 3 → 不是
  j=3: nums[3]=4 > 3 → 找到! j=3
  交换: [1, 4, 5, 3, 2]

Step3: 反转 [2, n-1] = [5,3,2] → [2,3,5]
  结果: [1, 4, 2, 3, 5]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 三步法 | O(n) | O(1) |

## 代码实现

### Go

```go
// nextPermutation 将数组原地修改为下一个字典序排列
// 参数：nums 整数数组（原地修改）
func nextPermutation(nums []int) {
    n := len(nums)

    // Step1: 从右找最后一个下降点 i
    i := n - 2
    for i >= 0 && nums[i] >= nums[i+1] {
        i--
    }

    if i >= 0 {
        // Step2: 从右找第一个大于 nums[i] 的元素 j
        j := n - 1
        for nums[j] <= nums[i] {
            j--
        }
        nums[i], nums[j] = nums[j], nums[i]
    }

    // Step3: 反转 [i+1, n-1] 使后缀变为升序
    l, r := i+1, n-1
    for l < r {
        nums[l], nums[r] = nums[r], nums[l]
        l++
        r--
    }
}
```

### Java

```java
class Solution {
    /**
     * 将数组原地修改为下一个字典序排列。
     *
     * @param nums 整数数组（原地修改）
     */
    public void nextPermutation(int[] nums) {
        int n = nums.length;

        // Step1: 从右找最后一个下降点
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            // Step2: 从右找第一个大于 nums[i] 的元素
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }

        // Step3: 反转后缀
        int l = i + 1, r = n - 1;
        while (l < r) {
            int tmp = nums[l]; nums[l] = nums[r]; nums[r] = tmp;
            l++; r--;
        }
    }
}
```

### Python

```python
class Solution:
    def nextPermutation(self, nums: list[int]) -> None:
        """
        将数组原地修改为下一个字典序排列。

        参数:
            nums: 整数数组（原地修改）
        """
        n = len(nums)

        # Step1: 从右找最后一个下降点
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1

        if i >= 0:
            # Step2: 从右找第一个大于 nums[i] 的元素
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]

        # Step3: 反转 [i+1, n-1]
        nums[i + 1:] = nums[i + 1:][::-1]
```

## 踩坑记录

- **`i` 找不到时（最大排列）**：`i = -1`，说明整个数组是降序，跳过 Step2，直接反转整个数组（`i+1=0`）变为升序，正好对应"回到最小排列"。
- **Step2 一定能找到 `j`**：因为 `nums[i] < nums[i+1]`，而 `[i+1, n-1]` 是降序，从右往左找第一个大于 `nums[i]` 的元素，一定能找到（至少 `nums[i+1]` 就满足）。
- **Step3 只反转后缀**：交换后 `[i+1, n-1]` 仍是降序（交换的 `j` 是从右数第一个大于 `nums[i]` 的，交换后降序性不变），反转得到最小排列。不要反转整个数组。

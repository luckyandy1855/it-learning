# 0053. Maximum Subarray

---
编号: 53
题目: Maximum Subarray
难度: 中等
标签: [数组, 分治, 动态规划]
来源链接: https://leetcode.com/problems/maximum-subarray/
---

## 题目描述

给定整数数组 `nums`，找出**和最大的连续子数组**（子数组至少含一个元素），返回其最大和。

### Example 1

```text
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: 子数组 [4,-1,2,1] 的和为 6
```

### Example 2

```text
Input: nums = [1]
Output: 1
```

### Example 3

```text
Input: nums = [5,4,-1,7,8]
Output: 23
```

### 约束条件

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- 进阶：分治解法 O(n log n)

## 思路分析

### 突破口

Kadane 算法：维护以当前元素结尾的最大子数组和 `curMax`——若前缀和为负则抛弃，从当前元素重新开始。

### 思路拆解

1. **Kadane 算法**：遍历数组，`curMax = max(nums[i], curMax + nums[i])`；全局答案 `ans = max(ans, curMax)`。

2. **直觉**：若 `curMax < 0`，再加上任何元素都不如直接从该元素重新起步（`curMax + nums[i] < nums[i]`），故选 `nums[i]`。

3. **初始化**：`ans` 初始化为 `nums[0]`（非 0），否则全负数组会错误返回 0。

### 示意图

```text
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
curMax:  -2  1  -2  4   3  5  6   1  5
ans:     -2  1   1  4   4  5  6   6  6

当 curMax 为负时（如-2）下一步直接从 nums[i] 开始
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| Kadane | O(n) | O(1) |
| 分治 | O(n log n) | O(log n) |

## 代码实现

### Go

```go
// maxSubArray 返回数组中和最大的连续子数组的和
func maxSubArray(nums []int) int {
    ans := nums[0]
    curMax := nums[0]

    for i := 1; i < len(nums); i++ {
        if curMax < 0 {
            curMax = nums[i] // 前缀为负，抛弃，从当前重新开始
        } else {
            curMax += nums[i]
        }
        if curMax > ans {
            ans = curMax
        }
    }
    return ans
}
```

### Java

```java
class Solution {
    /**
     * 返回数组中和最大的连续子数组的和（Kadane 算法）。
     */
    public int maxSubArray(int[] nums) {
        int ans = nums[0];
        int curMax = nums[0];

        for (int i = 1; i < nums.length; i++) {
            curMax = Math.max(nums[i], curMax + nums[i]); // 要么继续，要么重新开始
            ans = Math.max(ans, curMax);
        }
        return ans;
    }
}
```

### Python

```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        """
        返回数组中和最大的连续子数组的和（Kadane 算法）。
        """
        ans = cur_max = nums[0]

        for num in nums[1:]:
            cur_max = max(num, cur_max + num)  # 继续或重新起步
            ans = max(ans, cur_max)

        return ans
```

## 踩坑记录

- **ans 不能初始化为 0**：若数组全为负数（如 `[-1]`），正确答案是 `-1`，初始化为 0 会错误返回 0。
- **`max(nums[i], curMax+nums[i])` 等价于条件判断**：`curMax < 0 ? nums[i] : curMax+nums[i]`，两种写法效果相同。
- **进阶分治思路**：将数组从中间分为左右两半，答案要么在左、要么在右、要么跨越中点（从中点向两端扩展各取最大前缀/后缀），递归解决，O(n log n)。

# 0055. Jump Game

---
编号: 55
题目: Jump Game
难度: 中等
标签: [贪心, 数组, 动态规划]
来源链接: https://leetcode.com/problems/jump-game/
---

## 题目描述

给定非负整数数组 `nums`，你最初站在第 0 个下标处。数组中每个元素代表从该位置能跳跃的**最大**步数。判断你是否能到达**最后一个下标**。

### Example 1

```text
Input: nums = [2,3,1,1,4]
Output: true
Explanation: 从下标0跳2步到下标2，再跳1步到最后
```

### Example 2

```text
Input: nums = [3,2,1,0,4]
Output: false
Explanation: 无论如何都会卡在下标3（值为0），无法继续
```

### 约束条件

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^5`

## 思路分析

### 突破口

贪心：维护当前能到达的最远下标 `maxReach`，遍历每个位置时更新它。若遍历到某位置已超过 `maxReach`，说明此处不可达，直接返回 false。

### 思路拆解

1. **维护最远可达**：`maxReach = max(maxReach, i + nums[i])`。

2. **无法到达的判断**：若 `i > maxReach`，当前位置不可达（被 0 卡死），立刻返回 false。

3. **提前成功**：若 `maxReach >= n-1`，已确认能到达终点，返回 true。

### 示意图

```text
nums = [2, 3, 1, 1, 4]
  i=0: maxReach = max(0, 0+2) = 2
  i=1: maxReach = max(2, 1+3) = 4 → 4>=4(n-1) → true!

nums = [3, 2, 1, 0, 4]
  i=0: maxReach=3
  i=1: maxReach=3
  i=2: maxReach=3
  i=3: maxReach=3
  i=4: i(4) > maxReach(3) → false
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 贪心 | O(n) | O(1) |

## 代码实现

### Go

```go
// canJump 判断是否能从第0个下标跳到最后一个下标
func canJump(nums []int) bool {
    maxReach := 0
    n := len(nums)

    for i := 0; i < n; i++ {
        if i > maxReach {
            return false // 当前位置不可达
        }
        if i+nums[i] > maxReach {
            maxReach = i + nums[i]
        }
        if maxReach >= n-1 {
            return true
        }
    }
    return true
}
```

### Java

```java
class Solution {
    /**
     * 判断是否能从第 0 个下标跳到最后一个下标。
     */
    public boolean canJump(int[] nums) {
        int maxReach = 0;

        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false; // 当前位置不可达
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
}
```

### Python

```python
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        """
        判断是否能从第 0 个下标跳到最后一个下标（贪心）。
        """
        max_reach = 0

        for i, jump in enumerate(nums):
            if i > max_reach:
                return False  # 当前位置不可达
            max_reach = max(max_reach, i + jump)
            if max_reach >= len(nums) - 1:
                return True

        return True
```

## 踩坑记录

- **n=1 时直接为 true**：只有起点，不需要跳，循环结束后返回 true 自然处理。
- **`i > maxReach` 而非 `nums[i] == 0`**：遇到 0 不一定无法到达终点（可能根本不需要经过那个 0），正确判断是能否到达当前下标。
- **与 0045 Jump Game II 区别**：本题只需判断可达性，0045 需要最少跳跃次数；0045 的贪心框架更复杂（curEnd/farthest 双变量）。

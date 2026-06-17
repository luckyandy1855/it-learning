# 0045. Jump Game II

---
编号: 45
题目: Jump Game II
难度: 中等
标签: [贪心, 数组, 动态规划]
来源链接: https://leetcode.com/problems/jump-game-ii/
---

## 题目描述

给定一个长度为 `n` 的非负整数数组 `nums`，初始位置在下标 `0`。数组中每个元素代表从该位置能跳跃的**最大长度**。

使用**最少的跳跃次数**到达数组末尾（下标 `n-1`），返回这个最少跳跃次数。

题目保证总是可以到达数组末尾。

### Example 1

```text
Input: nums = [2,3,1,1,4]
Output: 2
Explanation: 跳到下标 1（跳 1 步），再跳 3 步到末尾。
```

### Example 2

```text
Input: nums = [2,3,0,1,4]
Output: 2
```

### 约束条件

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 1000`

## 思路分析

### 突破口

贪心：在当前跳跃范围内，选择能让下一跳覆盖范围最大的位置起跳。维护当前跳跃能到达的最远位置 `curEnd` 和下一跳能到达的最远位置 `farthest`，每次到达 `curEnd` 时跳跃次数加一。

### 思路拆解

1. **BFS 层次遍历**：每一跳是一层，每层找能到达的所有位置，下一层是从这些位置再跳一步能到的所有位置，层数即跳跃次数，O(n)。

2. **贪心（推荐）**：等价于 BFS 但不需要队列。`curEnd` 是当前跳的边界，`farthest` 是当前跳内能到达的最远位置。遍历每个位置时更新 `farthest`，到达 `curEnd` 时跳跃次数加一，更新 `curEnd = farthest`。

3. **实现要点**：循环到 `n-2`（不包括最后位置），因为到达最后位置无需再起跳。

### 示意图

```text
nums = [2,3,1,1,4]

        curEnd  farthest  jumps
初始:     0       0         0
i=0(2): farthest=max(0,0+2)=2, 到达curEnd=0 → jumps=1, curEnd=2
i=1(3): farthest=max(2,1+3)=4
i=2(1): farthest=max(4,2+1)=4, 到达curEnd=2 → jumps=2, curEnd=4
i=3(1): farthest=max(4,3+1)=4
(i=3 < n-1=4, 不用再跳)

结果: jumps = 2
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 贪心 | O(n) | O(1) |

## 代码实现

### Go

```go
// jump 返回到达数组末尾所需的最少跳跃次数
// 参数：nums 跳跃长度数组
// 返回：最少跳跃次数
func jump(nums []int) int {
    jumps := 0
    curEnd := 0   // 当前跳跃能到达的最远位置（当前跳的边界）
    farthest := 0 // 当前跳内所有位置能到达的最远位置

    for i := 0; i < len(nums)-1; i++ {
        // 更新从 i 出发能到达的最远位置
        if i+nums[i] > farthest {
            farthest = i + nums[i]
        }
        // 到达当前跳的边界，必须起跳
        if i == curEnd {
            jumps++
            curEnd = farthest
        }
    }
    return jumps
}
```

### Java

```java
class Solution {
    /**
     * 返回到达数组末尾所需的最少跳跃次数。
     *
     * @param nums 跳跃长度数组
     * @return 最少跳跃次数
     */
    public int jump(int[] nums) {
        int jumps = 0, curEnd = 0, farthest = 0;

        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == curEnd) {
                jumps++;
                curEnd = farthest;
            }
        }
        return jumps;
    }
}
```

### Python

```python
class Solution:
    def jump(self, nums: list[int]) -> int:
        """
        返回到达数组末尾所需的最少跳跃次数。

        参数:
            nums: 跳跃长度数组
        返回:
            最少跳跃次数
        """
        jumps = 0
        cur_end = 0    # 当前跳能到的边界
        farthest = 0   # 下一跳能到的最远位置

        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == cur_end:  # 到达当前跳边界，必须起跳
                jumps += 1
                cur_end = farthest

        return jumps
```

## 踩坑记录

- **循环到 `n-2`，不包括最后一个位置**：在 `i = n-1` 时，已经到达终点，不需要再跳。若包含最后位置，到达 `curEnd = n-2` 时会多计一次跳跃。
- **`curEnd` 和 `farthest` 的更新顺序**：先更新 `farthest`（扫当前层所有位置），再在到达 `curEnd` 时起跳并更新 `curEnd = farthest`。两者顺序不能颠倒。
- **`nums[0] = 0` 特殊情况**：若 `n=1`，不需要跳，循环不执行，返回 0，正确。

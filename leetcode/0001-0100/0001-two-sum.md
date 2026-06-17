# 0001. Two Sum

---
编号: 1
题目: Two Sum
难度: 简单
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/two-sum/
---

## 题目描述

给定一个整数数组 `nums` 和一个整数 `target`，需要在数组中找到两个不同位置的元素，使它们的和等于 `target`。

返回这两个元素的下标。答案中的两个下标可以按任意顺序返回。

题目保证：

- 每组输入都**恰好存在一个有效答案**。
- 同一个数组元素不能被重复使用，也就是说不能用同一个下标配对自己。

### Example 1

```text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9，所以返回 [0, 1]。
```

### Example 2

```text
Input: nums = [3,2,4], target = 6
Output: [1,2]
Explanation: nums[1] + nums[2] = 2 + 4 = 6，所以返回 [1, 2]。
```

### Example 3

```text
Input: nums = [3,3], target = 6
Output: [0,1]
Explanation: 两个 3 位于不同下标 0 和 1，可以组成 target。
```

### 约束条件

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- 只存在一个有效答案。

---

## 思路分析

### 突破口

"找两数之和 = 目标值" → 等价于 **遍历到每个数时，检查「目标值 - 当前数」是否已经出现过**。把"找配对"问题转化为"查字典"问题。

### 思路拆解

1. **暴力解**：双重循环枚举所有数对 `(i, j)`，检查 `nums[i] + nums[j] == target`。缺陷：O(n²) 时间，数组大时超时。

2. **问题转化**：对于每个 `nums[i]`，它的"另一半"是 `complement = target - nums[i]`。我们真正需要的是：**complement 有没有在 i 之前出现过，出现在哪里**。

3. **优化方向**：用哈希表（map）存储"已遍历的值 → 下标"的映射，查找 complement 从 O(n) 降为 O(1)，整体只需一次遍历。

4. **实现要点**：先查表再插入，避免同一个元素被自己配对（如 `[3,3]` target=6 的情况）；题目保证恰好有一个答案，无需处理无解情况。

### 示意图

以 `nums = [2, 7, 11, 15]`，`target = 9` 为例：

```
遍历过程：
┌──────┬───────────┬─────────────────┬──────────────────────────┐
│ 步骤 │ 当前数    │ complement      │ 哈希表状态               │
├──────┼───────────┼─────────────────┼──────────────────────────┤
│  i=0 │ nums[0]=2 │ 9-2=7  未命中   │ {2:0}                    │
│  i=1 │ nums[1]=7 │ 9-7=2  命中!    │ 找到 2 在下标 0          │
└──────┴───────────┴─────────────────┴──────────────────────────┘
输出：[0, 1]
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 暴力解（双重循环） | O(n²) | O(1) |
| 哈希表优化 | O(n) | O(n) |

---

## 代码实现

### Go

```go
// twoSum 在 nums 中找出相加等于 target 的两个数的下标
// 参数：nums 整数切片，target 目标和
// 返回：长度为 2 的下标数组，顺序不限；题目保证恰好有一个答案
func twoSum(nums []int, target int) []int {
    // seen 存储"已遍历的值 → 其下标"，用于 O(1) 查找 complement
    seen := make(map[int]int)

    for i, num := range nums {
        complement := target - num

        // 先查表：complement 是否在之前的遍历中出现过
        // 必须先查后插，防止同一元素与自身配对（如 [3,3] target=6）
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }

        // 未命中：将当前值及其下标记录到哈希表
        seen[num] = i
    }

    // 题目保证有解，实际不会到达这里
    return nil
}
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * 在 nums 中找出相加等于 target 的两个数的下标。
     *
     * @param nums   整数数组
     * @param target 目标和
     * @return 长度为 2 的下标数组；题目保证恰好有一个答案
     */
    public int[] twoSum(int[] nums, int target) {
        // seen：存储"已遍历的值 → 其下标"，支持 O(1) 查找 complement
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            // 先查表：complement 是否已出现
            // 先查后插，避免同一元素自我配对（如 [3,3] target=6）
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }

            // 未命中：记录当前值及下标
            seen.put(nums[i], i);
        }

        // 题目保证有解，实际不会到达这里
        throw new IllegalArgumentException("No solution found");
    }
}
```

### Python

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        """
        在 nums 中找出相加等于 target 的两个数的下标。

        参数:
            nums:   整数列表
            target: 目标和
        返回:
            长度为 2 的下标列表；题目保证恰好有一个答案
        """
        # seen 存储 {值: 下标}，用于 O(1) 查找 complement
        seen = {}

        for i, num in enumerate(nums):
            complement = target - num

            # 先查表：complement 是否已出现
            # 先查后插，防止 [3,3] target=6 时同一元素自我配对
            if complement in seen:
                return [seen[complement], i]

            # 未命中：记录当前值及下标
            seen[num] = i

        # 题目保证有解，实际不会到达这里
        return []
```

---

## 踩坑记录

- **同一元素自我配对**：如 `nums=[3,3]`，`target=6`，正确答案是 `[0,1]`。必须先查表再插入，否则 `seen[3]=0` 存入后立刻查到自身，返回 `[0,0]` 错误。
- **下标顺序无要求**：题目说"return in any order"，不需要排序输出。
- **值重复但下标不同**：`nums=[3,2,3]`，`target=6`，答案是 `[0,2]`，哈希表先存 `3→0`，遍历到 `nums[2]=3` 时命中，正确。

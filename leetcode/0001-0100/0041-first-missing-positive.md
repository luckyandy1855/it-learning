# 0041. First Missing Positive

---
编号: 41
题目: First Missing Positive
难度: 困难
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/first-missing-positive/
---

## 题目描述

给定一个未经排序的整数数组 `nums`，找出其中**没有出现的最小正整数**。

要求算法时间复杂度为 O(n)，**且只能使用常数级别的额外空间**。

### Example 1

```text
Input: nums = [1,2,0]
Output: 3
```

### Example 2

```text
Input: nums = [3,4,-1,1]
Output: 2
```

### Example 3

```text
Input: nums = [7,8,9,11,12]
Output: 1
```

### 约束条件

- `1 <= nums.length <= 5 * 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`

## 思路分析

### 突破口

答案一定在 `[1, n+1]` 范围内（n 个数最多能覆盖 1..n，若全覆盖则答案是 n+1）。把数组本身当哈希表：将值为 `v`（满足 `1 <= v <= n`）的元素放到下标 `v-1` 的位置，然后扫一遍找第一个 `nums[i] != i+1` 的位置。

### 思路拆解

1. **索引置换**：遍历数组，对于每个元素 `v`，若 `1 <= v <= n` 且 `nums[v-1] != v`，将 `nums[i]` 和 `nums[v-1]` 交换，重复直到当前位置的值放不进去为止。

2. **扫描答案**：置换完成后，第一个 `nums[i] != i+1` 的位置，答案就是 `i+1`；若所有位置都正确，答案是 `n+1`。

3. **为什么常数空间**：原地置换，不使用额外数组。

### 示意图

```text
nums = [3,4,-1,1]，n=4

置换过程：
  i=0: nums[0]=3, 应放下标2; swap(nums[0],nums[2])=[−1,4,3,1]
  i=0: nums[0]=-1, 不在[1,4]内，跳过
  i=1: nums[1]=4, 应放下标3; swap(nums[1],nums[3])=[−1,1,3,4]
  i=1: nums[1]=1, 应放下标0; swap(nums[1],nums[0])=[1,−1,3,4]
  i=1: nums[1]=-1, 跳过
  i=2: nums[2]=3, 已在正确位置（nums[2]=3, 下标2 → 3=2+1 ✓）跳过
  i=3: nums[3]=4, 已在正确位置 ✓

扫描: nums=[1,−1,3,4]
  i=0: nums[0]=1==1 ✓
  i=1: nums[1]=-1≠2 → 答案 = 2
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 原地置换 | O(n) | O(1) |

## 代码实现

### Go

```go
// firstMissingPositive 找未出现的最小正整数，O(n) 时间 O(1) 空间
// 参数：nums 整数数组（原地修改）
// 返回：最小缺失正整数
func firstMissingPositive(nums []int) int {
    n := len(nums)

    // 置换：将 v 放到 nums[v-1]（若 v 在 [1,n] 内且不在正确位置）
    for i := 0; i < n; i++ {
        for nums[i] >= 1 && nums[i] <= n && nums[nums[i]-1] != nums[i] {
            // 将 nums[i] 放到它应该在的位置
            nums[nums[i]-1], nums[i] = nums[i], nums[nums[i]-1]
        }
    }

    // 扫描：找第一个不满足 nums[i] == i+1 的位置
    for i := 0; i < n; i++ {
        if nums[i] != i+1 {
            return i + 1
        }
    }
    return n + 1 // 1..n 全都有，答案是 n+1
}
```

### Java

```java
class Solution {
    /**
     * 找未出现的最小正整数，O(n) 时间 O(1) 空间。
     *
     * @param nums 整数数组（原地修改）
     * @return 最小缺失正整数
     */
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            // 将 nums[i] 置换到正确位置（循环直到无法继续置换）
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int tmp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = tmp;
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
}
```

### Python

```python
class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        """
        找未出现的最小正整数，O(n) 时间 O(1) 空间。

        参数:
            nums: 整数数组（原地修改）
        返回:
            最小缺失正整数
        """
        n = len(nums)

        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]

        for i in range(n):
            if nums[i] != i + 1:
                return i + 1
        return n + 1
```

## 踩坑记录

- **循环交换而非一次交换**：置换时用 while 循环，一次 swap 可能只把当前元素放到正确位置，但交换来的新值还需要继续处理，直到当前位置无法再改善。
- **终止条件 `nums[nums[i]-1] != nums[i]`**：防止无限循环——若目标位置已有正确的值（可能是重复值），不再交换。例如 `[1,1]` 中 `nums[0]=1`，`nums[nums[0]-1]=nums[0]=1`，已相等，停止。
- **答案范围 [1, n+1]**：这是关键前提，保证了数组本身就足够表示所有候选答案，越界的数字（负数、0、>n 的数）不影响结果，直接忽略。

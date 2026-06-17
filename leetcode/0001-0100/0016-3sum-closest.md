# 0016. 3Sum Closest

---
编号: 16
题目: 3Sum Closest
难度: 中等
标签: [数组, 双指针, 排序]
来源链接: https://leetcode.com/problems/3sum-closest/
---

## 题目描述

给定整数数组 `nums` 和整数 `target`，从数组中找出三个整数使其之和与 `target` 最接近，返回这个三数之和。

题目保证：

- 每组输入只有一个最接近 `target` 的答案。

### Example 1

```text
Input: nums = [-1,2,1,-4], target = 1
Output: 2
Explanation: 最接近 target=1 的三数之和是 2，由 -1+2+1=2 得到。
```

### Example 2

```text
Input: nums = [0,0,0], target = 1
Output: 0
```

### 约束条件

- `3 <= nums.length <= 500`
- `-1000 <= nums[i] <= 1000`
- `-10^4 <= target <= 10^4`

## 思路分析

### 突破口

与 3Sum 思路一致：排序 + 双指针。不同之处在于不需要找精确等于 target 的三元组，而是追踪与 target 差值最小的三数之和。

### 思路拆解

1. **暴力解**：三重循环枚举所有三元组，O(n³)，超时。

2. **排序 + 双指针**：排序后固定 `i`，对 `[i+1, n-1]` 做双指针：
   - 若 `sum < target` → 需要更大值，`l++`
   - 若 `sum > target` → 需要更小值，`r--`
   - 若 `sum == target` → 直接返回

3. **实现要点**：维护 `closest` 变量（初始化为任意三数之和），每步更新 `|sum - target|` 最小的结果。

### 示意图

```text
nums = [-4,-1,1,2]（已排序），target = 1

i=0(-4): l=1(-1), r=3(2)
  sum=-4+(-1)+2=-3, |−3−1|=4 → closest=-3
  sum < target → l++
  l=2(1), r=3(2): sum=-4+1+2=-1, |−1−1|=2 → closest=-1
  sum < target → l++
  l >= r，跳过

i=1(-1): l=2(1), r=3(2)
  sum=-1+1+2=2, |2−1|=1 → closest=2
  sum > target → r--
  l >= r，跳过

i=2(1): i >= n-2，结束

返回 closest = 2
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 排序 + 双指针 | O(n²) | O(1) |

## 代码实现

### Go

```go
import (
    "math"
    "sort"
)

// threeSumClosest 找三数之和与 target 最接近的值
// 参数：nums 整数数组，target 目标值
// 返回：与 target 最接近的三数之和
func threeSumClosest(nums []int, target int) int {
    sort.Ints(nums)
    closest := nums[0] + nums[1] + nums[2] // 初始化为前三个数之和

    for i := 0; i < len(nums)-2; i++ {
        l, r := i+1, len(nums)-1
        for l < r {
            sum := nums[i] + nums[l] + nums[r]
            // 更新最接近值
            if math.Abs(float64(sum-target)) < math.Abs(float64(closest-target)) {
                closest = sum
            }
            if sum < target {
                l++ // 需要更大的和
            } else if sum > target {
                r-- // 需要更小的和
            } else {
                return sum // 恰好等于 target，直接返回
            }
        }
    }
    return closest
}
```

### Java

```java
import java.util.Arrays;

class Solution {
    /**
     * 找三数之和与 target 最接近的值。
     *
     * @param nums   整数数组
     * @param target 目标值
     * @return 与 target 最接近的三数之和
     */
    public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int closest = nums[0] + nums[1] + nums[2];

        for (int i = 0; i < nums.length - 2; i++) {
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (Math.abs(sum - target) < Math.abs(closest - target)) {
                    closest = sum;
                }
                if (sum < target) l++;
                else if (sum > target) r--;
                else return sum;
            }
        }
        return closest;
    }
}
```

### Python

```python
class Solution:
    def threeSumClosest(self, nums: list[int], target: int) -> int:
        """
        找三数之和与 target 最接近的值。

        参数:
            nums:   整数数组
            target: 目标值
        返回:
            与 target 最接近的三数之和
        """
        nums.sort()
        closest = nums[0] + nums[1] + nums[2]

        for i in range(len(nums) - 2):
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if abs(s - target) < abs(closest - target):
                    closest = s
                if s < target:
                    l += 1
                elif s > target:
                    r -= 1
                else:
                    return s  # 精确匹配，直接返回

        return closest
```

## 踩坑记录

- **closest 初始化**：必须初始化为一个合法的三数之和（如前三个数），不能初始化为 0 或 `INT_MAX`，否则比较时可能出错（特别是所有数都为负数时）。
- **精确匹配时提前返回**：若 `sum == target`，差值为 0，无法再优化，直接返回避免不必要的循环。
- **本题不需要去重**：3Sum 要求不重复三元组，3Sum Closest 只需要返回一个和值，不用考虑重复问题。

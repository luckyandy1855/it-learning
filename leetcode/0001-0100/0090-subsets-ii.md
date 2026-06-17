# 0090. Subsets II

---
编号: 90
题目: Subsets II
难度: 中等
标签: [位运算, 数组, 回溯]
来源链接: https://leetcode.com/problems/subsets-ii/
---

## 题目描述

给定一个**可能包含重复元素**的整数数组 `nums`，返回该数组所有可能的子集（幂集）。解集中**不能包含重复的子集**，可以按任意顺序返回。

### Example 1

```text
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
```

### Example 2

```text
Input: nums = [0]
Output: [[],[0]]
```

### 约束条件

- `1 <= nums.length <= 10`
- `-10 <= nums[i] <= 10`

## 思路分析

### 突破口

在 0078 Subsets 的回溯框架基础上，先对数组排序，然后在同一层递归中跳过重复元素（`nums[i] == nums[i-1]` 且 `i > start`）。

### 思路拆解

1. **排序**：使相同元素相邻，便于去重。

2. **同层去重**：在 for 循环中，若 `i > start && nums[i] == nums[i-1]`，跳过——同一层（同一"深度"的选择）不重复选相同的值。

3. **不同层可重复使用**：`nums[i] == nums[i-1]` 但 `i == start` 时不跳过（从父节点继承而来的选择，不是同层重复）。

### 示意图

```text
nums=[1,2,2]（排序后）
backtrack(start=0, path=[]):
  记录 []
  i=0: 选1 → backtrack(1, [1]):
    记录 [1]
    i=1: 选2 → backtrack(2,[1,2]):
      记录 [1,2]
      i=2: 选2 → 记录 [1,2,2]
    i=2: 2==nums[1]=2 且 i(2)>start(1) → 跳过
  i=1: 选2 → backtrack(2,[2]):
    记录 [2]
    i=2: 选2 → 记录 [2,2]
  i=2: 2==nums[1]=2 且 i(2)>start(0) → 跳过
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 排序 + 回溯去重 | O(2^n × n) | O(n) |

## 代码实现

### Go

```go
import "sort"

// subsetsWithDup 返回含重复元素数组的所有不重复子集
func subsetsWithDup(nums []int) [][]int {
    sort.Ints(nums)
    result := [][]int{}
    path := []int{}

    var backtrack func(start int)
    backtrack = func(start int) {
        tmp := make([]int, len(path))
        copy(tmp, path)
        result = append(result, tmp)

        for i := start; i < len(nums); i++ {
            if i > start && nums[i] == nums[i-1] { // 同层去重
                continue
            }
            path = append(path, nums[i])
            backtrack(i + 1)
            path = path[:len(path)-1]
        }
    }
    backtrack(0)
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回含重复元素数组的所有不重复子集。
     */
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(0, nums, path, result);
        return result;
    }

    private void backtrack(int start, int[] nums,
            List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));

        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue; // 同层去重
            path.add(nums[i]);
            backtrack(i + 1, nums, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

### Python

```python
class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        """
        返回含重复元素数组的所有不重复子集（排序 + 回溯去重）。
        """
        nums.sort()
        result = []

        def backtrack(start: int, path: list) -> None:
            result.append(path[:])

            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:  # 同层去重
                    continue
                path.append(nums[i])
                backtrack(i + 1, path)
                path.pop()

        backtrack(0, [])
        return result
```

## 踩坑记录

- **`i > start` 而非 `i > 0`**：`i > 0` 会误跳过不同父节点路径下的合法选择（如选了第一个 2 后，递归中从 start=2 再选第二个 2 是合法的）；`i > start` 只在同一层的重复时跳过。
- **与 0040 Combination Sum II 的去重逻辑相同**：两题都是"排序后同层去重"，是处理含重复元素的回溯问题的通用模式。
- **排序是去重的前提**：只有相同元素相邻，才能用 `nums[i] == nums[i-1]` 检测同层重复。

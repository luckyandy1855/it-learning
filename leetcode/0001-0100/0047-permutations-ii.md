# 0047. Permutations II

---
编号: 47
题目: Permutations II
难度: 中等
标签: [数组, 回溯, 排序]
来源链接: https://leetcode.com/problems/permutations-ii/
---

## 题目描述

给定一个**可能含重复数字**的整数数组 `nums`，返回所有**不重复**的全排列。

### Example 1

```text
Input: nums = [1,1,2]
Output: [[1,1,2],[1,2,1],[2,1,1]]
```

### Example 2

```text
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

### 约束条件

- `1 <= nums.length <= 8`
- `-10 <= nums[i] <= 10`

## 思路分析

### 突破口

在第 46 题基础上加去重：排序使相同元素相邻，在同一层（同一递归深度）中，若当前数与前一个相同且前一个**未被使用**，跳过（避免同层重复选相同值）。

### 思路拆解

1. **排序**：使相同元素相邻，便于去重判断。

2. **去重条件**：`i > 0 && nums[i] == nums[i-1] && !visited[i-1]`：
   - `nums[i] == nums[i-1]`：当前数与前一个相同。
   - `!visited[i-1]`：前一个数**在当前层未被使用**（若已被使用，说明是更深层，属于不同分支，允许）。

3. **实现要点**：条件 `!visited[i-1]` 是关键，确保同层不重复选相同值，而不同层（不同递归深度）可以选相同值。

### 示意图

```text
nums = [1,1,2]（已排序），visited=[F,F,F]

第一层（选第1个数）：
  i=0: nums[0]=1, 选 → [1], visited=[T,F,F]
    第二层（选第2个数）：
      i=0: visited[0]=T → 跳过
      i=1: nums[1]=1, nums[0]=1相同且!visited[0]? visited[0]=T → 不跳过, 选 → [1,1]
        第三层: 选2 → [1,1,2] ✓
      i=2: 选2 → [1,2] → 第三层: 选nums[1]=1 → [1,2,1] ✓
  i=1: nums[1]=1 == nums[0]=1 且 !visited[0] → 跳过! (避免与i=0重复)
  i=2: nums[2]=2, 选 → [2] ...
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 排序 + 回溯 | O(n × n!) | O(n) |

## 代码实现

### Go

```go
import "sort"

// permuteUnique 生成含重复元素数组的所有不重复全排列
// 参数：nums 可能含重复元素的整数数组
// 返回：所有不重复的全排列列表
func permuteUnique(nums []int) [][]int {
    sort.Ints(nums)
    result := [][]int{}
    n := len(nums)
    visited := make([]bool, n)

    var backtrack func(current []int)
    backtrack = func(current []int) {
        if len(current) == n {
            tmp := make([]int, n)
            copy(tmp, current)
            result = append(result, tmp)
            return
        }
        for i := 0; i < n; i++ {
            if visited[i] {
                continue
            }
            // 去重：同层不重复选相同值（前一个相同元素未被使用时跳过）
            if i > 0 && nums[i] == nums[i-1] && !visited[i-1] {
                continue
            }
            visited[i] = true
            backtrack(append(current, nums[i]))
            visited[i] = false
        }
    }

    backtrack([]int{})
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 生成含重复元素数组的所有不重复全排列。
     *
     * @param nums 可能含重复元素的整数数组
     * @return 所有不重复的全排列列表
     */
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] visited,
                           List<Integer> current, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (visited[i]) continue;
            if (i > 0 && nums[i] == nums[i - 1] && !visited[i - 1]) continue;
            visited[i] = true;
            current.add(nums[i]);
            backtrack(nums, visited, current, result);
            current.remove(current.size() - 1);
            visited[i] = false;
        }
    }
}
```

### Python

```python
class Solution:
    def permuteUnique(self, nums: list[int]) -> list[list[int]]:
        """
        生成含重复元素数组的所有不重复全排列。

        参数:
            nums: 可能含重复元素的整数数组
        返回:
            所有不重复的全排列列表
        """
        nums.sort()
        result = []
        n = len(nums)
        visited = [False] * n

        def backtrack(current: list) -> None:
            if len(current) == n:
                result.append(current[:])
                return
            for i in range(n):
                if visited[i]:
                    continue
                if i > 0 and nums[i] == nums[i - 1] and not visited[i - 1]:
                    continue
                visited[i] = True
                current.append(nums[i])
                backtrack(current)
                current.pop()
                visited[i] = False

        backtrack([])
        return result
```

## 踩坑记录

- **去重条件是 `!visited[i-1]`，不是 `visited[i-1]`**：`!visited[i-1]` 表示前一个相同元素在当前层未被使用（被跳过），说明当前层已经用前一个相同值做过尝试，不需要再用当前相同值。若用 `visited[i-1]`（已使用），逻辑反过来，会漏掉很多合法排列。
- **必须先排序**：去重逻辑依赖相同元素相邻（`nums[i] == nums[i-1]`），不排序则相同元素可能不相邻，去重条件失效。
- **与 40 题去重的差异**：40 题（Combination Sum II）是从 `start` 开始枚举，去重条件是 `i > start`；47 题（Permutations II）每次从 `i=0` 枚举，去重条件是 `!visited[i-1]`。两者都是"同层去重"，但实现细节不同。

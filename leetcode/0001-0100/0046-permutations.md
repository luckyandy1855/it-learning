# 0046. Permutations

---
编号: 46
题目: Permutations
难度: 中等
标签: [数组, 回溯]
来源链接: https://leetcode.com/problems/permutations/
---

## 题目描述

给定一个**不含重复数字**的整数数组 `nums`，返回其所有可能的全排列。答案可以按任意顺序返回。

### Example 1

```text
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

### Example 2

```text
Input: nums = [0,1]
Output: [[0,1],[1,0]]
```

### Example 3

```text
Input: nums = [1]
Output: [[1]]
```

### 约束条件

- `1 <= nums.length <= 6`
- `-10 <= nums[i] <= 10`
- `nums` 中所有整数互不相同。

## 思路分析

### 突破口

回溯：每次从剩余未使用的数字中选一个加入当前排列，直到排列长度等于 n。

### 思路拆解

1. **visited 数组标记**：用 boolean 数组标记每个数字是否已使用，DFS 时跳过已使用的，回溯时撤销标记。

2. **交换法（无 visited 数组）**：将 `nums[start]` 与 `nums[i]`（`i >= start`）交换，递归处理 `[start+1, n-1]`，回溯时换回来。更节省空间。

3. **实现要点**：当 `current.length == n` 时记录一个排列副本（不是引用）。

### 示意图

```text
nums = [1,2,3]，使用 visited 回溯：

选1 → 选2 → 选3 → [1,2,3] ✓
选1 → 选3 → 选2 → [1,3,2] ✓
选2 → 选1 → 选3 → [2,1,3] ✓
选2 → 选3 → 选1 → [2,3,1] ✓
选3 → 选1 → 选2 → [3,1,2] ✓
选3 → 选2 → 选1 → [3,2,1] ✓
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(n × n!) | O(n) 递归栈 |

## 代码实现

### Go

```go
// permute 生成整数数组的所有全排列
// 参数：nums 不含重复元素的整数数组
// 返回：所有全排列列表
func permute(nums []int) [][]int {
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
            visited[i] = true
            backtrack(append(current, nums[i]))
            visited[i] = false // 回溯
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
     * 生成整数数组的所有全排列。
     *
     * @param nums 不含重复元素的整数数组
     * @return 所有全排列列表
     */
    public List<List<Integer>> permute(int[] nums) {
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
    def permute(self, nums: list[int]) -> list[list[int]]:
        """
        生成整数数组的所有全排列。

        参数:
            nums: 不含重复元素的整数数组
        返回:
            所有全排列列表
        """
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
                visited[i] = True
                current.append(nums[i])
                backtrack(current)
                current.pop()
                visited[i] = False

        backtrack([])
        return result
```

## 踩坑记录

- **结果要复制**：`result.append(current)` 只存引用，回溯后 current 改变会导致结果错误。必须 `current[:]`（Python）或 `copy(tmp, current)`（Go）。
- **每次从 `i=0` 开始枚举**：全排列中每个位置可以放任意未使用的数，所以每次都从 0 开始，用 `visited` 来排除已选的（而不是从 start 开始）。
- **全排列总数是 n!**：n=6 有 720 个排列，n=8 有 40320 个，数量增长很快，测试时注意。

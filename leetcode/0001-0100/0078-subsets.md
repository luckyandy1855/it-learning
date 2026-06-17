# 0078. Subsets

---
编号: 78
题目: Subsets
难度: 中等
标签: [位运算, 数组, 回溯]
来源链接: https://leetcode.com/problems/subsets/
---

## 题目描述

给定整数数组 `nums`（元素互不相同），返回其所有可能的**子集**（幂集）。解集中不能包含重复的子集，可以按任意顺序返回。

### Example 1

```text
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

### Example 2

```text
Input: nums = [0]
Output: [[],[0]]
```

### 约束条件

- `1 <= nums.length <= 10`
- `-10 <= nums[i] <= 10`
- `nums` 中所有元素互不相同

## 思路分析

### 突破口

回溯：每次进入递归时就记录当前路径为一个子集（空集也是子集），然后从 `start` 开始枚举下一个元素。

### 思路拆解

1. **在每个节点记录答案**：不像组合问题只在叶节点记录，子集在每个节点都记录当前路径。

2. **从 `start` 枚举**：防止重复，`start` 从上层 `i+1` 开始。

3. **位运算法（等价）**：n 个元素共 2^n 个子集，用整数的 `n` 位二进制表示每个元素是否选择。

### 示意图

```text
nums=[1,2,3]
backtrack(start=0, path=[]):
  记录 [] 
  选1 → backtrack(start=1, path=[1]):
    记录 [1]
    选2 → backtrack(start=2, path=[1,2]):
      记录 [1,2]
      选3 → 记录 [1,2,3]
    选3 → 记录 [1,3]
  选2 → 记录 [2], 选3 → 记录 [2,3]
  选3 → 记录 [3]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(2^n × n) | O(n) |
| 位运算 | O(2^n × n) | O(1)（不计输出） |

## 代码实现

### Go

```go
// subsets 返回 nums 所有子集（幂集）
func subsets(nums []int) [][]int {
    result := [][]int{}
    path := []int{}

    var backtrack func(start int)
    backtrack = func(start int) {
        tmp := make([]int, len(path))
        copy(tmp, path)
        result = append(result, tmp)

        for i := start; i < len(nums); i++ {
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
     * 返回 nums 所有子集（幂集）。
     */
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(0, nums, path, result);
        return result;
    }

    private void backtrack(int start, int[] nums,
            List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path)); // 每个节点都记录

        for (int i = start; i < nums.length; i++) {
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
    def subsets(self, nums: list[int]) -> list[list[int]]:
        """
        返回 nums 所有子集（幂集），回溯法。
        """
        result = []

        def backtrack(start: int, path: list) -> None:
            result.append(path[:])  # 每个节点都记录当前路径

            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1, path)
                path.pop()

        backtrack(0, [])
        return result
```

## 踩坑记录

- **每个节点而非只在叶节点记录**：这是子集与组合的关键区别——组合只在 `len(path)==k` 时记录，子集在每一步都记录。
- **空集必须包含**：回溯第一次调用时 `path` 为空，直接记录，输出中会包含 `[]`。
- **位运算法替代方案**：`for mask in range(1<<n):`，根据 `mask` 的每一位决定是否选该位元素，代码更简洁但不够直觉化。

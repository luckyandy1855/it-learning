# 0040. Combination Sum II

---
编号: 40
题目: Combination Sum II
难度: 中等
标签: [数组, 回溯]
来源链接: https://leetcode.com/problems/combination-sum-ii/
---

## 题目描述

给定一个整数数组 `candidates`（**可能含重复元素**）和目标整数 `target`，找出所有可以使数字之和等于 `target` 的组合。

每个数字在每个组合中只能使用**一次**（但 candidates 中本身可有重复数字）。返回的组合中不能有重复的组合。

### Example 1

```text
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
```

### Example 2

```text
Input: candidates = [2,5,2,1,2], target = 5
Output: [[1,2,2],[5]]
```

### 约束条件

- `1 <= candidates.length <= 100`
- `1 <= candidates[i] <= 50`
- `1 <= target <= 30`

## 思路分析

### 突破口

与 Combination Sum I 的区别：每个元素只用一次 + candidates 有重复 → 需要在递归时用 `i+1`，并在同一层跳过重复元素（`candidates[i] == candidates[i-1]` 且 `i > start`）。

### 思路拆解

1. **排序 + 回溯**：先排序，使重复元素相邻，便于跳过。

2. **同层去重**：在同一层 for 循环中，若 `i > start && candidates[i] == candidates[i-1]`，跳过（因为相同值在当前层已尝试过）。这与不同层的重复不同——不同层可以选相同值（如 `[1,1,6]` 中的两个 `1`）。

3. **递归用 `i+1`**：每个元素只用一次，递归时 `start = i+1`。

### 示意图

```text
candidates = [1,1,2,5,6,7,10]（排序后），target = 8

backtrack(start=0, cur=[], remain=8):
  i=0: 选1(candidates[0])
    backtrack(start=1, [1], 7)
      i=1: 选1(candidates[1])（i=1 > start=1? 不, start=1, i>start需要i>1）
           → i==start，不跳过
        backtrack(start=2, [1,1], 6)
          i=2: 选2 → [1,1,2], 4; ...
          i=4: 选6 → [1,1,6], 0 → 记录✓
  i=1: candidates[1]==candidates[0] 且 i>start(i=1>0) → 跳过! (避免第二个1开始重复)
  i=2: 选2 → [2], remain=6 ...
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 排序 + 回溯 | O(2^n) | O(n) 递归栈 |

## 代码实现

### Go

```go
import "sort"

// combinationSum2 找所有和为 target 的不重复组合（每元素最多用一次）
// 参数：candidates 可含重复元素的整数数组，target 目标和
// 返回：所有满足条件的不重复组合列表
func combinationSum2(candidates []int, target int) [][]int {
    sort.Ints(candidates)
    result := [][]int{}

    var backtrack func(start int, current []int, remain int)
    backtrack = func(start int, current []int, remain int) {
        if remain == 0 {
            tmp := make([]int, len(current))
            copy(tmp, current)
            result = append(result, tmp)
            return
        }
        for i := start; i < len(candidates); i++ {
            if candidates[i] > remain {
                break
            }
            // 同层去重：跳过与前一个相同的值（前提是前一个不是本层的第一次选择）
            if i > start && candidates[i] == candidates[i-1] {
                continue
            }
            current = append(current, candidates[i])
            backtrack(i+1, current, remain-candidates[i]) // 每个元素只用一次
            current = current[:len(current)-1]
        }
    }

    backtrack(0, []int{}, target)
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 找所有和为 target 的不重复组合（每元素最多用一次）。
     */
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remain, int start,
                           List<Integer> current, List<List<Integer>> result) {
        if (remain == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break;
            if (i > start && candidates[i] == candidates[i - 1]) continue; // 同层去重
            current.add(candidates[i]);
            backtrack(candidates, remain - candidates[i], i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

### Python

```python
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        """
        找所有和为 target 的不重复组合（每元素最多用一次）。
        """
        candidates.sort()
        result = []

        def backtrack(start: int, current: list, remain: int) -> None:
            if remain == 0:
                result.append(current[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remain:
                    break
                if i > start and candidates[i] == candidates[i - 1]:
                    continue  # 同层去重
                current.append(candidates[i])
                backtrack(i + 1, current, remain - candidates[i])
                current.pop()

        backtrack(0, [], target)
        return result
```

## 踩坑记录

- **同层去重条件是 `i > start`**：不是 `i > 0`。`i > start` 保证只跳过同层（当前递归调用的 for 循环）中的重复，不跳过不同层的选择。若写 `i > 0`，会错误跳过两层都需要的重复值（如 `[1,1,6]` 中第二层的 `1`）。
- **与 Combination Sum I 的核心区别**：I 用 `backtrack(i, ...)` 可重复；II 用 `backtrack(i+1, ...)` 不可重复 + 同层去重。
- **不能用 HashSet 去重结果**：事后对结果去重效率低，正确做法是在搜索时通过排序 + 剪枝避免生成重复组合。

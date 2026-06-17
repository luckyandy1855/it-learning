# 0039. Combination Sum

---
编号: 39
题目: Combination Sum
难度: 中等
标签: [数组, 回溯]
来源链接: https://leetcode.com/problems/combination-sum/
---

## 题目描述

给定一个**无重复元素**的整数数组 `candidates` 和目标整数 `target`，找出 `candidates` 中所有可以使数字之和等于 `target` 的组合。

`candidates` 中同一个数字可以**无限次**重复选取。两个组合元素相同但顺序不同的算同一组合。

### Example 1

```text
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation: 2+2+3=7, 7=7。
```

### Example 2

```text
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]
```

### 约束条件

- `1 <= candidates.length <= 30`
- `2 <= candidates[i] <= 40`
- `candidates` 中所有元素互不相同。
- `1 <= target <= 40`

## 思路分析

### 突破口

回溯：从第 `start` 个候选数开始枚举，每次选择一个数加入当前组合，若 `remain == 0` 则记录；若 `remain < 0` 则剪枝。同一元素可重复，所以递归时 `start` 不增加（可以继续选当前数）。

### 思路拆解

1. **回溯框架**：`backtrack(start, current, remain)`：
   - `remain == 0`：找到一个组合，加入结果。
   - `remain < 0`：超出目标，剪枝。
   - 从 `start` 到末尾枚举每个候选数，加入 `current`，递归（`start = i`，可重复），回溯时 pop。

2. **避免重复组合**：通过固定从 `start` 开始枚举（不往回选），保证 `[2,2,3]` 和 `[3,2,2]` 不重复出现。

3. **排序剪枝**：先排序，若当前候选数 > remain，后面的数更大也不用再枚举，直接 break。

### 示意图

```text
candidates = [2,3,6,7], target = 7（排序后不变）

backtrack(start=0, cur=[], remain=7):
  选2: backtrack(0, [2], 5)
    选2: backtrack(0, [2,2], 3)
      选2: backtrack(0, [2,2,2], 1)
        选2: remain=1-2=-1 → 剪枝
        选3: remain=1-3=-2 → 剪枝, break
      选3: backtrack(1, [2,2,3], 0) → 记录[2,2,3] ✓
      选6: 3-6<0 → break
    选3: backtrack(1, [2,3], 2)
      选3: 2-3<0 → break（排序后剪枝）
    ...
  选7: backtrack(3, [7], 0) → 记录[7] ✓
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(n^(T/M))，T=target，M=最小候选数 | O(T/M) 递归栈 |

## 代码实现

### Go

```go
import "sort"

// combinationSum 找所有和为 target 的候选数组合（元素可重复使用）
// 参数：candidates 无重复元素的整数数组，target 目标和
// 返回：所有满足条件的组合列表
func combinationSum(candidates []int, target int) [][]int {
    sort.Ints(candidates) // 排序以便剪枝
    result := [][]int{}

    var backtrack func(start int, current []int, remain int)
    backtrack = func(start int, current []int, remain int) {
        if remain == 0 {
            // 复制当前切片存入结果（不能直接存引用）
            tmp := make([]int, len(current))
            copy(tmp, current)
            result = append(result, tmp)
            return
        }
        for i := start; i < len(candidates); i++ {
            if candidates[i] > remain {
                break // 已排序，后续更大，直接剪枝
            }
            current = append(current, candidates[i])
            backtrack(i, current, remain-candidates[i]) // i 不增，允许重复选
            current = current[:len(current)-1]           // 回溯
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
     * 找所有和为 target 的候选数组合（元素可重复使用）。
     *
     * @param candidates 无重复元素的整数数组
     * @param target     目标和
     * @return 所有满足条件的组合列表
     */
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
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
            current.add(candidates[i]);
            backtrack(candidates, remain - candidates[i], i, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

### Python

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        """
        找所有和为 target 的候选数组合（元素可重复使用）。

        参数:
            candidates: 无重复元素的整数数组
            target:     目标和
        返回:
            所有满足条件的组合列表
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
                current.append(candidates[i])
                backtrack(i, current, remain - candidates[i])  # i 不加1
                current.pop()

        backtrack(0, [], target)
        return result
```

## 踩坑记录

- **递归时 `start = i` 而非 `i+1`**：同一元素可以重复使用，所以递归继续从 `i` 开始，而不是 `i+1`。
- **Go 中必须复制切片**：`result = append(result, current)` 只存了引用，回溯后 current 改变会导致结果错误。必须 `copy` 一份。
- **剪枝提前 break**：排序后若 `candidates[i] > remain`，之后的数更大，整个 for 循环可以 break，而不是 continue。

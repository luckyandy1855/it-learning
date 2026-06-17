# 0077. Combinations

---
编号: 77
题目: Combinations
难度: 中等
标签: [回溯]
来源链接: https://leetcode.com/problems/combinations/
---

## 题目描述

给定两个整数 `n` 和 `k`，返回 `[1, n]` 中所有可能的 **k 个数的组合**。

### Example 1

```text
Input: n=4, k=2
Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
```

### Example 2

```text
Input: n=1, k=1
Output: [[1]]
```

### 约束条件

- `1 <= n <= 20`
- `1 <= k <= n`

## 思路分析

### 突破口

回溯：每次从 `start` 开始枚举下一个数字，加入当前组合；达到 k 个时记录结果并回溯。

### 思路拆解

1. **回溯从 `start` 枚举**：第一层从 1 开始，每选一个数字递归进入下一层，`start = i+1`（组合不允许重复且元素有序）。

2. **剪枝优化**：当前已选 `len(path)` 个，还需 `k - len(path)` 个，从 `[start, n]` 中至少要有 `k - len(path)` 个数可选，即 `start <= n - (k - len(path)) + 1`。

### 示意图

```text
n=4, k=2
backtrack(start=1, path=[]):
  选1 → backtrack(start=2, path=[1]):
    选2 → path=[1,2] → 记录
    选3 → path=[1,3] → 记录
    选4 → path=[1,4] → 记录
  选2 → backtrack(start=3, path=[2]):
    选3 → path=[2,3] → 记录
    ...
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(C(n,k)×k) | O(k) |

## 代码实现

### Go

```go
// combine 返回 [1,n] 中所有 k 个数的组合
func combine(n int, k int) [][]int {
    result := [][]int{}
    path := make([]int, 0, k)

    var backtrack func(start int)
    backtrack = func(start int) {
        if len(path) == k {
            tmp := make([]int, k)
            copy(tmp, path)
            result = append(result, tmp)
            return
        }
        // 剪枝：剩余可选数量必须够用
        for i := start; i <= n-(k-len(path))+1; i++ {
            path = append(path, i)
            backtrack(i + 1)
            path = path[:len(path)-1]
        }
    }
    backtrack(1)
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回 [1,n] 中所有 k 个数的组合。
     */
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(1, n, k, path, result);
        return result;
    }

    private void backtrack(int start, int n, int k,
            List<Integer> path, List<List<Integer>> result) {
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        // 剪枝：i 不超过 n - (k - path.size()) + 1
        for (int i = start; i <= n - (k - path.size()) + 1; i++) {
            path.add(i);
            backtrack(i + 1, n, k, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

### Python

```python
class Solution:
    def combine(self, n: int, k: int) -> list[list[int]]:
        """
        返回 [1,n] 中所有 k 个数的组合（回溯 + 剪枝）。
        """
        result = []

        def backtrack(start: int, path: list) -> None:
            if len(path) == k:
                result.append(path[:])
                return
            # 剪枝：剩余位置数 >= 还需选的数量
            for i in range(start, n - (k - len(path)) + 2):
                path.append(i)
                backtrack(i + 1, path)
                path.pop()

        backtrack(1, [])
        return result
```

## 踩坑记录

- **剪枝上界 `n - (k - len(path)) + 1`**：还需选 `k - len(path)` 个数，`i` 最大为 `n - (k-len(path)) + 1`，再大就凑不够 k 个了。Python 的 `range` 上界是 `+2`（range 不包含右端点）。
- **拷贝 path**：记录结果时必须深拷贝 `path`（Go 用 `copy`，Java 用 `new ArrayList<>(path)`，Python 用 `path[:]`），否则回溯后 path 改变导致结果错误。
- **与排列区别**：组合不考虑顺序，递归时 `start = i+1`（不回头），排列需要从 0 开始并用 visited 数组。

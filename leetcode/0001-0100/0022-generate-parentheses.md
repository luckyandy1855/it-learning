# 0022. Generate Parentheses

---
编号: 22
题目: Generate Parentheses
难度: 中等
标签: [字符串, 动态规划, 回溯]
来源链接: https://leetcode.com/problems/generate-parentheses/
---

## 题目描述

给定整数 `n`，生成所有由 `n` 对括号组成的**有效括号组合**。

### Example 1

```text
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
```

### Example 2

```text
Input: n = 1
Output: ["()"]
```

### 约束条件

- `1 <= n <= 8`

## 思路分析

### 突破口

回溯法：构建过程中维护已用的开括号数 `open` 和闭括号数 `close`；只要 `open < n` 就能加 `(`，只要 `close < open` 就能加 `)`，这样保证生成的括号始终合法。

### 思路拆解

1. **暴力生成再过滤**：生成所有长度为 `2n` 的括号串，再逐一验证，O(2^(2n) × n)，极慢。

2. **回溯剪枝**：在构建时就保证合法性：
   - 只有 `open < n` 才追加 `(`（不超过 n 个开括号）。
   - 只有 `close < open` 才追加 `)`（闭括号不超过开括号）。
   - 当 `open == close == n` 时，记录当前字符串。

3. **实现要点**：每次递归传入 `open`、`close` 和当前构建的字符串（或字节切片以节省空间）。

### 示意图

```text
n=2，回溯树（open=已用开括号数，close=已用闭括号数）：

                ""(0,0)
               /
            "("(1,0)
           /         \
       "(("(2,0)    "()"(1,1)
         |            \
      "(()"(2,1)     "()(  ← open<n，可加(
         |               "(  (" → "()(("(2,1) → ... → "()()"
      "(())"(2,2)
      ✓ 收集

最终: ["(())", "()()"]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(4^n / √n)（第 n 个卡特兰数） | O(n) 递归栈 |

## 代码实现

### Go

```go
// generateParenthesis 生成所有 n 对括号的有效组合
// 参数：n 括号对数
// 返回：所有有效括号组合列表
func generateParenthesis(n int) []string {
    result := []string{}

    var backtrack func(current []byte, open, close int)
    backtrack = func(current []byte, open, close int) {
        // 达到长度 2n，记录结果
        if len(current) == 2*n {
            result = append(result, string(current))
            return
        }
        // 可以追加开括号的条件：开括号数未达上限
        if open < n {
            backtrack(append(current, '('), open+1, close)
        }
        // 可以追加闭括号的条件：闭括号数少于开括号数
        if close < open {
            backtrack(append(current, ')'), open, close+1)
        }
    }

    backtrack([]byte{}, 0, 0)
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 生成所有 n 对括号的有效组合。
     *
     * @param n 括号对数
     * @return 所有有效括号组合列表
     */
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(result, new StringBuilder(), 0, 0, n);
        return result;
    }

    private void backtrack(List<String> result, StringBuilder current, int open, int close, int n) {
        if (current.length() == 2 * n) {
            result.add(current.toString());
            return;
        }
        if (open < n) {
            current.append('(');
            backtrack(result, current, open + 1, close, n);
            current.deleteCharAt(current.length() - 1); // 回溯
        }
        if (close < open) {
            current.append(')');
            backtrack(result, current, open, close + 1, n);
            current.deleteCharAt(current.length() - 1); // 回溯
        }
    }
}
```

### Python

```python
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        """
        生成所有 n 对括号的有效组合。

        参数:
            n: 括号对数
        返回:
            所有有效括号组合列表
        """
        result = []

        def backtrack(current: list, open: int, close: int) -> None:
            if len(current) == 2 * n:
                result.append(''.join(current))
                return
            if open < n:
                current.append('(')
                backtrack(current, open + 1, close)
                current.pop()
            if close < open:
                current.append(')')
                backtrack(current, open, close + 1)
                current.pop()

        backtrack([], 0, 0)
        return result
```

## 踩坑记录

- **闭括号条件是 `close < open`**：不是 `close < n`。需要保证闭括号不超过已用的开括号数，否则会生成 `)()` 这样的非法串。
- **Go 中 `append` 的陷阱**：Go 的 `append` 在容量足够时会复用底层数组，可能导致不同分支共享内存。这里每次递归传入新切片（`append` 返回新切片），不会有问题，但要意识到这点。
- **结果数量是第 n 个卡特兰数**：n=4 有 14 个，n=8 有 1430 个，不需要对结果去重。

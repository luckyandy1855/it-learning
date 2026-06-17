# 0032. Longest Valid Parentheses

---
编号: 32
题目: Longest Valid Parentheses
难度: 困难
标签: [栈, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/longest-valid-parentheses/
---

## 题目描述

给定只含 `'('` 和 `')'` 的字符串 `s`，找出其中最长的**有效括号子串**的长度。

### Example 1

```text
Input: s = "(()"
Output: 2
Explanation: 最长有效子串是 "()"，长度为 2。
```

### Example 2

```text
Input: s = ")()())"
Output: 4
Explanation: 最长有效子串是 "()()"，长度为 4。
```

### Example 3

```text
Input: s = ""
Output: 0
```

### 约束条件

- `0 <= s.length <= 3 * 10^4`
- `s[i]` 为 `'('` 或 `')'`。

## 思路分析

### 突破口

用栈记录未匹配括号的下标；每次匹配成功后，当前有效子串长度 = 当前位置 - 栈顶（未匹配的位置）。

### 思路拆解

1. **动态规划**：`dp[i]` 表示以 `s[i]` 结尾的最长有效括号长度。`s[i]='('` 时 dp[i]=0；`s[i]=')'` 时若前一个是 `'('` 则 dp[i]=dp[i-2]+2，否则向前跳 dp[i-1] 步看是否可以匹配。

2. **栈（推荐）**：栈里存下标。初始压入 `-1` 作为边界（相当于最后一个未匹配的 `)` 在 -1 位置）。遇到 `(` 压栈；遇到 `)` pop，若栈空则压入当前下标作新边界，否则 `当前下标 - 栈顶` 就是当前有效长度。

3. **左右计数法**：两次遍历，第一次从左到右，第二次从右到左，各维护 `left/right` 计数，O(n) 时间 O(1) 空间。

### 示意图

```text
s = ")()())"
栈初始: [-1]

i=0: ')' → pop(-1)，栈空 → push(0)，栈=[ 0]
i=1: '(' → push(1)，栈=[0, 1]
i=2: ')' → pop(1)，栈=[0]，len=2-0=2，max=2
i=3: '(' → push(3)，栈=[0, 3]
i=4: ')' → pop(3)，栈=[0]，len=4-0=4，max=4
i=5: ')' → pop(0)，栈空 → push(5)，栈=[5]

max = 4
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 动态规划 | O(n) | O(n) |
| 栈 | O(n) | O(n) |
| 左右计数 | O(n) | O(1) |

## 代码实现

### Go

```go
// longestValidParentheses 找最长有效括号子串的长度
// 参数：s 只含括号的字符串
// 返回：最长有效括号子串的长度
func longestValidParentheses(s string) int {
    // 栈存未匹配括号的下标，初始压入 -1 作为边界
    stack := []int{-1}
    maxLen := 0

    for i := 0; i < len(s); i++ {
        if s[i] == '(' {
            stack = append(stack, i)
        } else {
            // ')': 尝试匹配栈顶
            stack = stack[:len(stack)-1]
            if len(stack) == 0 {
                // 栈空说明当前 ')' 是新的边界
                stack = append(stack, i)
            } else {
                // 有效子串长度 = 当前下标 - 新栈顶
                if i-stack[len(stack)-1] > maxLen {
                    maxLen = i - stack[len(stack)-1]
                }
            }
        }
    }
    return maxLen
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 找最长有效括号子串的长度。
     *
     * @param s 只含括号的字符串
     * @return 最长有效括号子串的长度
     */
    public int longestValidParentheses(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1); // 边界
        int maxLen = 0;

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i);
            } else {
                stack.pop();
                if (stack.isEmpty()) {
                    stack.push(i); // 新边界
                } else {
                    maxLen = Math.max(maxLen, i - stack.peek());
                }
            }
        }
        return maxLen;
    }
}
```

### Python

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        找最长有效括号子串的长度。

        参数:
            s: 只含括号的字符串
        返回:
            最长有效括号子串的长度
        """
        stack = [-1]  # 初始边界
        max_len = 0

        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            else:
                stack.pop()
                if not stack:
                    stack.append(i)  # 新边界
                else:
                    max_len = max(max_len, i - stack[-1])

        return max_len
```

## 踩坑记录

- **初始压入 `-1`**：若不初始化边界，遇到 `"()"` 这样的字符串，匹配后栈空，无法计算长度（`i - (-1) = 2`）。`-1` 作为虚拟的"最后一个未匹配 `)` 的位置"统一了所有情况。
- **栈为空时压入新边界**：遇到无法匹配的 `)` 时，pop 之后栈空，需要压入当前下标作为新边界，标记"上一个无效 `)` 的位置"。
- **有效长度是当前下标减栈顶**：匹配成功后 pop 掉对应的 `(`，当前有效区间从新栈顶的下一位开始到当前位置，长度 = 当前下标 - 栈顶。

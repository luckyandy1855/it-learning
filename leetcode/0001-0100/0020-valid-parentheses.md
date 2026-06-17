# 0020. Valid Parentheses

---
编号: 20
题目: Valid Parentheses
难度: 简单
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/valid-parentheses/
---

## 题目描述

给定只含 `'('`、`')'`、`'{'`、`'}'`、`'['`、`']'` 的字符串 `s`，判断括号是否**有效**。

有效括号需满足：

1. 每个开括号必须有对应的同类型闭括号。
2. 开括号必须以正确的顺序关闭（最后打开的先关闭）。
3. 每个闭括号必须有对应的开括号。

### Example 1

```text
Input: s = "()"
Output: true
```

### Example 2

```text
Input: s = "()[]{}"
Output: true
```

### Example 3

```text
Input: s = "(]"
Output: false
```

### 约束条件

- `1 <= s.length <= 10^4`
- `s` 仅由括号字符组成。

## 思路分析

### 突破口

括号匹配天然符合"后进先出"的栈结构：遇到开括号入栈，遇到闭括号时检查栈顶是否为对应的开括号。

### 思路拆解

1. **栈匹配**：遍历字符串，遇到开括号 push，遇到闭括号检查栈顶是否是对应开括号，匹配则 pop，否则返回 false。遍历结束后栈为空则有效。

2. **实现要点**：遇到闭括号时若栈为空（没有对应开括号），也需返回 false，不能直接 pop。

### 示意图

```text
s = "{[()]}"

  字符  操作        栈状态
  {     push {      [{ ]
  [     push [      [{ [ ]
  (     push (      [{ [ ( ]
  )     pop (→ 匹配 [{ [ ]
  ]     pop [→ 匹配 [{ ]
  }     pop {→ 匹配 []

栈为空 → true
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 栈 | O(n) | O(n) |

## 代码实现

### Go

```go
// isValid 判断括号字符串是否有效
// 参数：s 只含括号字符的字符串
// 返回：括号是否有效
func isValid(s string) bool {
    // pair 记录每种闭括号对应的开括号
    pair := map[byte]byte{
        ')': '(', ']': '[', '}': '{',
    }

    stack := []byte{}
    for i := 0; i < len(s); i++ {
        c := s[i]
        if c == '(' || c == '[' || c == '{' {
            stack = append(stack, c) // 开括号入栈
        } else {
            // 闭括号：检查栈顶是否为对应开括号
            if len(stack) == 0 || stack[len(stack)-1] != pair[c] {
                return false
            }
            stack = stack[:len(stack)-1] // pop
        }
    }
    return len(stack) == 0 // 所有开括号都被匹配
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 判断括号字符串是否有效。
     *
     * @param s 只含括号字符的字符串
     * @return 括号是否有效
     */
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c); // 开括号入栈
            } else {
                // 闭括号：栈空或栈顶不匹配
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) return false;
            }
        }
        return stack.isEmpty();
    }
}
```

### Python

```python
class Solution:
    def isValid(self, s: str) -> bool:
        """
        判断括号字符串是否有效。

        参数:
            s: 只含括号字符的字符串
        返回:
            括号是否有效
        """
        pair = {')': '(', ']': '[', '}': '{'}
        stack = []

        for c in s:
            if c in ('(', '[', '{'):
                stack.append(c)  # 开括号入栈
            else:
                # 闭括号：栈空或栈顶不匹配
                if not stack or stack[-1] != pair[c]:
                    return False
                stack.pop()

        return len(stack) == 0
```

## 踩坑记录

- **遇到闭括号时栈空**：若字符串以 `)` 开头，栈为空直接 pop 会报错，必须先判断栈非空。
- **遍历结束后栈非空**：`"((("` 中三个开括号均未被匹配，遍历结束后栈不为空，需返回 false（不能在循环内完成所有判断）。
- **类型不能混用**：`"([)]"` 中 `(` 和 `[` 顺序未对应关闭，`]` 与栈顶 `(` 不匹配，应返回 false。栈方案自然处理这种情况。

# 0439. Ternary Expression Parser

---
编号: 439
题目: Ternary Expression Parser
难度: 中等
标签: [栈, 递归, 字符串]
来源链接: https://leetcode.com/problems/ternary-expression-parser/
---

## 题目描述

给定一个表示任意嵌套三元表达式的字符串 `expression` ，求值并返回其结果。

你可以总是假设给定的表达式是有效的，并且只包含数字， `'?'` ，  `':'` ，  `'T'` 和 `'F'` ，其中 `'T'` 为真， `'F'` 为假。表达式中的所有数字都是 **一位** 数(即在 **[0,9] **范围内)。

条件表达式从右到左分组(大多数语言中都是这样)，表达式的结果总是为数字，`'T'` 或 `'F'` 。

**示例 1：**

```text
输入： expression = "T?2:3"
输出： "2"
解释： 如果条件为真，结果为 2；否则，结果为 3。
```

**示例 2：**

```text
输入： expression = "F?1:T?4:5"
输出： "4"
解释： 条件表达式自右向左结合。使用括号的话，相当于：
 "(F ? 1 : (T ? 4 : 5))" --> "(F ? 1 : 4)" --> "4"
or "(F ? 1 : (T ? 4 : 5))" --> "(T ? 4 : 5)" --> "4"
```

**示例 3：**

```text
输入： expression = "T?T?F:5:3"
输出： "F"
解释： 条件表达式自右向左结合。使用括号的话，相当于：
"(T ? (T ? F : 5) : 3)" --> "(T ? F : 3)" --> "F"
"(T ? (T ? F : 5) : 3)" --> "(T ? F : 5)" --> "F"
```

**提示:**

- `5 <= expression.length <= 10^4`

- `expression` 由数字, `'T'`, `'F'`, `'?'` 和 `':'` 组成

- **保证 **了表达式是一个有效的三元表达式，并且每个数字都是 **一位数**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 递归, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们从右到左遍历字符串 `expression`，对于当前遍历到的字符 $c$：

- 如果 $c$ 是字符 `':'`，则跳过；
- 如果 $c$ 是字符 `'?'`，那么意味着下一个即将遍历到的字符是条件表达式的条件，我们用一个布尔变量 `cond` 标记；
- 如果 $c$ 的上一个遍历到的字符是 `'?'`，也即布尔变量 `cond` 为 `true`，那么我们判断当前字符 $c$ 是否为字符 `'T'`，如果是，那么我们要保留栈顶第一个元素，弹出栈顶第二个元素；否则，我们要保留栈顶第二个元素，弹出栈顶第一个元素。最后，将 `cond` 置为 `false`；
- 否则，我们将当前字符 $c$ 入栈。

最后，栈中只剩下一个元素，即为表达式的结果。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 `expression` 的长度。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Ternary Expression Parser：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func parseTernary(expression string) string {
	stk := []byte{}
	cond := false
	for i := len(expression) - 1; i >= 0; i-- {
		c := expression[i]
		if c == ':' {
			continue
		}
		if c == '?' {
			cond = true
		} else {
			if cond {
				if c == 'T' {
					x := stk[len(stk)-1]
					stk = stk[:len(stk)-2]
					stk = append(stk, x)
				} else {
					stk = stk[:len(stk)-1]
				}
				cond = false
			} else {
				stk = append(stk, c)
			}
		}
	}
	return string(stk[0])
}
```

### Java

```java
// Ternary Expression Parser：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String parseTernary(String expression) {
        Deque<Character> stk = new ArrayDeque<>();
        boolean cond = false;
        for (int i = expression.length() - 1; i >= 0; --i) {
            char c = expression.charAt(i);
            if (c == ':') {
                continue;
            }
            if (c == '?') {
                cond = true;
            } else {
                if (cond) {
                    if (c == 'T') {
                        char x = stk.pop();
                        stk.pop();
                        stk.push(x);
                    } else {
                        stk.pop();
                    }
                    cond = false;
                } else {
                    stk.push(c);
                }
            }
        }
        return String.valueOf(stk.peek());
    }
}
```

### Python

```python
# Ternary Expression Parser：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def parseTernary(self, expression: str) -> str:
        stk = []
        cond = False
        for c in expression[::-1]:
            if c == ':':
                continue
            if c == '?':
                cond = True
            else:
                if cond:
                    if c == 'T':
                        x = stk.pop()
                        stk.pop()
                        stk.append(x)
                    else:
                        stk.pop()
                    cond = False
                else:
                    stk.append(c)
        return stk[0]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

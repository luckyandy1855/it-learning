# 1106. Parsing A Boolean Expression

---
编号: 1106
题目: Parsing A Boolean Expression
难度: 困难
标签: [栈, 递归, 字符串]
来源链接: https://leetcode.com/problems/parsing-a-boolean-expression/
---

## 题目描述

**布尔表达式** 是计算结果不是 `true` 就是 `false` 的表达式。有效的表达式需遵循以下约定：

- `'t'`，运算结果为 `true`

- `'f'`，运算结果为 `false`

- `'!(subExpr)'`，运算过程为对内部表达式 `subExpr` 进行 **逻辑非**（NOT）运算

- `'&(subExpr1, subExpr2, ..., subExprn)'`，运算过程为对 2 个或以上内部表达式 `subExpr1, subExpr2, ..., subExprn` 进行 **逻辑与**（AND）运算

- `'|(subExpr1, subExpr2, ..., subExprn)'`，运算过程为对 2 个或以上内部表达式 `subExpr1, subExpr2, ..., subExprn` 进行 **逻辑或**（OR）运算

给你一个以字符串形式表述的 布尔表达式 `expression`，返回该式的运算结果。

题目测试用例所给出的表达式均为有效的布尔表达式，遵循上述约定。

示例 1：

```text
输入：expression = "&(|(f))"
输出：false
解释：
首先，计算 |(f) --> f ，表达式变为 "&(f)" 。
接着，计算 &(f) --> f ，表达式变为 "f" 。
最后，返回 false 。
```

示例 2：

```text
输入：expression = "|(f,f,f,t)"
输出：true
解释：计算 (false OR false OR false OR true) ，结果为 true 。
```

示例 3：

```text
输入：expression = "!(&(f,t))"
输出：true
解释：
首先，计算 &(f,t) --> (false AND true) --> false --> f ，表达式变为 "!(f)" 。
接着，计算 !(f) --> NOT false --> true ，返回 true 。
```

**提示：**

- `1 <= expression.length <= 2 * 10^4`

- `expression[i]` 为 `'('`、`')'`、`'&'`、`'|'`、`'!'`、`'t'`、`'f'` 和 `','` 之一

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

对于这种表达式解析问题，我们可以使用栈来辅助解决。

从左到右遍历表达式 `expression`，对于遍历到的每个字符 $c$：

- 如果 $c$ 是 `"tf!&|"` 中的一个，我们直接将其入栈；
- 如果 $c$ 是右括号 `')'`，我们将栈中元素依次出栈，直到遇到操作符 `'!'` 或 `'&'` 或 `'|'`。过程中我们用变量 $t$ 和 $f$ 记录出栈字符中 `'t'` 和 `'f'` 的个数。最后根据出栈字符的个数和操作符计算得到新的字符 `'t'` 或 `'f'`，并将其入栈。

遍历完表达式 `expression` 后，栈中只剩下一个字符，如果是 `'t'`，返回 `true`，否则返回 `false`。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是表达式 `expression` 的长度。

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
// Parsing A Boolean Expression：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func parseBoolExpr(expression string) bool {
	stk := []rune{}
	for _, c := range expression {
		if c != '(' && c != ')' && c != ',' {
			stk = append(stk, c)
		} else if c == ')' {
			var t, f int
			for stk[len(stk)-1] == 't' || stk[len(stk)-1] == 'f' {
				if stk[len(stk)-1] == 't' {
					t++
				} else {
					f++
				}
				stk = stk[:len(stk)-1]
			}
			op := stk[len(stk)-1]
			stk = stk[:len(stk)-1]
			c = 'f'
			if (op == '!' && f > 0) || (op == '&' && f == 0) || (op == '|' && t > 0) {
				c = 't'
			}
			stk = append(stk, c)
		}
	}
	return stk[0] == 't'
}
```

### Java

```java
// Parsing A Boolean Expression：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean parseBoolExpr(String expression) {
        Deque<Character> stk = new ArrayDeque<>();
        for (char c : expression.toCharArray()) {
            if (c != '(' && c != ')' && c != ',') {
                stk.push(c);
            } else if (c == ')') {
                int t = 0, f = 0;
                while (stk.peek() == 't' || stk.peek() == 'f') {
                    t += stk.peek() == 't' ? 1 : 0;
                    f += stk.peek() == 'f' ? 1 : 0;
                    stk.pop();
                }
                char op = stk.pop();
                c = 'f';
                if ((op == '!' && f > 0) || (op == '&' && f == 0) || (op == '|' && t > 0)) {
                    c = 't';
                }
                stk.push(c);
            }
        }
        return stk.peek() == 't';
    }
}
```

### Python

```python
# Parsing A Boolean Expression：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def parseBoolExpr(self, expression: str) -> bool:
        stk = []
        for c in expression:
            if c in 'tf!&|':
                stk.append(c)
            elif c == ')':
                t = f = 0
                while stk[-1] in 'tf':
                    t += stk[-1] == 't'
                    f += stk[-1] == 'f'
                    stk.pop()
                match stk.pop():
                    case '!':
                        c = 't' if f else 'f'
                    case '&':
                        c = 'f' if f else 't'
                    case '|':
                        c = 't' if t else 'f'
                stk.append(c)
        return stk[0] == 't'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0227. Basic Calculator II

---
编号: 227
题目: Basic Calculator II
难度: 中等
标签: [栈, 数学, 字符串]
来源链接: https://leetcode.com/problems/basic-calculator-ii/
---

## 题目描述

给你一个字符串表达式 `s` ，请你实现一个基本计算器来计算并返回它的值。

整数除法仅保留整数部分。

你可以假设给定的表达式总是有效的。所有中间结果将在 `[-2^31, 2^31 - 1]` 的范围内。

**注意：**不允许使用任何将字符串作为数学表达式计算的内置函数，比如 `eval()` 。

**示例 1：**

```text
输入：s = "3+2*2"
输出：7
```

**示例 2：**

```text
输入：s = " 3/2 "
输出：1
```

**示例 3：**

```text
输入：s = " 3+5 / 2 "
输出：5
```

**提示：**

- `1 <= s.length <= 3 * 10^5`

- `s` 由整数和算符 `('+', '-', '*', '/')` 组成，中间由一些空格隔开

- `s` 表示一个 **有效表达式**

- 表达式中的所有整数都是非负整数，且在范围 `[0, 2^31 - 1]` 内

- 题目数据保证答案是一个 **32-bit 整数**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

遍历字符串 $s$，并用变量 `sign` 记录每个数字之前的运算符，对于第一个数字，其之前的运算符视为加号。每次遍历到数字末尾时，根据 `sign` 来决定计算方式：

- 加号：将数字压入栈；
- 减号：将数字的相反数压入栈；
- 乘除号：计算数字与栈顶元素，并将栈顶元素替换为计算结果。

遍历结束后，将栈中元素求和即为答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $s$ 的长度。

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
// Basic Calculator II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func calculate(s string) int {
	sign := '+'
	stk := []int{}
	v := 0
	for i, c := range s {
		digit := '0' <= c && c <= '9'
		if digit {
			v = v*10 + int(c-'0')
		}
		if i == len(s)-1 || !digit && c != ' ' {
			switch sign {
			case '+':
				stk = append(stk, v)
			case '-':
				stk = append(stk, -v)
			case '*':
				stk[len(stk)-1] *= v
			case '/':
				stk[len(stk)-1] /= v
			}
			sign = c
			v = 0
		}
	}
	ans := 0
	for _, v := range stk {
		ans += v
	}
	return ans
}
```

### Java

```java
import java.util.*;
// Basic Calculator II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int calculate(String s) {
        Deque<Integer> stk = new ArrayDeque<>();
        char sign = '+';
        int v = 0;
        for (int i = 0; i < s.length(); ++i) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                v = v * 10 + (c - '0');
            }
            if (i == s.length() - 1 || c == '+' || c == '-' || c == '*' || c == '/') {
                if (sign == '+') {
                    stk.push(v);
                } else if (sign == '-') {
                    stk.push(-v);
                } else if (sign == '*') {
                    stk.push(stk.pop() * v);
                } else {
                    stk.push(stk.pop() / v);
                }
                sign = c;
                v = 0;
            }
        }
        int ans = 0;
        while (!stk.isEmpty()) {
            ans += stk.pop();
        }
        return ans;
    }
}
```

### Python

```python
# Basic Calculator II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def calculate(self, s: str) -> int:
        v, n = 0, len(s)
        sign = '+'
        stk = []
        for i, c in enumerate(s):
            if c.isdigit():
                v = v * 10 + int(c)
            if i == n - 1 or c in '+-*/':
                match sign:
                    case '+':
                        stk.append(v)
                    case '-':
                        stk.append(-v)
                    case '*':
                        stk.append(stk.pop() * v)
                    case '/':
                        stk.append(int(stk.pop() / v))
                sign = c
                v = 0
        return sum(stk)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

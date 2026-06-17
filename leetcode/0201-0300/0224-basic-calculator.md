# 0224. Basic Calculator

---
编号: 224
题目: Basic Calculator
难度: 困难
标签: [栈, 递归, 数学, 字符串]
来源链接: https://leetcode.com/problems/basic-calculator/
---

## 题目描述

给你一个字符串表达式 `s` ，请你实现一个基本计算器来计算并返回它的值。

注意:不允许使用任何将字符串作为数学表达式计算的内置函数，比如 `eval()` 。

**示例 1：**

```text
输入：s = "1 + 1"
输出：2
```

**示例 2：**

```text
输入：s = " 2-1 + 2 "
输出：3
```

**示例 3：**

```text
输入：s = "(1+(4+5+2)-3)+(6+8)"
输出：23
```

**提示：**

- `1 <= s.length <= 3 * 10^5`

- `s` 由数字、`'+'`、`'-'`、`'('`、`')'`、和 `' '` 组成

- `s` 表示一个有效的表达式

- `'+'` 不能用作一元运算(例如， `"+1"` 和 `"+(2 + 3)"` 无效)

- `'-'` 可以用作一元运算(即 `"-1"` 和 `"-(2 + 3)"` 是有效的)

- 输入中不存在两个连续的操作符

- 每个数字和运行的计算将适合于一个有符号的 32位 整数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 递归, 数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个栈 $stk$ 来保存当前的计算结果和操作符，用一个变量 $sign$ 保存当前的符号，变量 $ans$ 保存最终的计算结果。

接下来，我们遍历字符串 $s$ 的每一个字符：

- 如果当前字符是数字，那么我们用一个循环将后面的连续数字都读进来，然后用当前的符号将其加或者减到 $ans$ 中。
- 如果当前字符是 `'+'`，我们修改变量 $sign$ 为正号。
- 如果当前字符是 `'-'`，我们修改变量 $sign$ 为负号。
- 如果当前字符是 `'('`，我们把当前的 $ans$ 和 $sign$ 入栈，并分别置空置 1，重新开始计算新的 $ans$ 和 $sign$。
- 如果当前字符是 `')'`，我们弹出栈顶的两个元素，一个是操作符，一个是括号前计算好的数字，我们将当前的数字乘上操作符，再加上之前的数字，作为新的 $ans$。

遍历完字符串 $s$ 之后，我们返回 $ans$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是字符串 $s$ 的长度。

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
// Basic Calculator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func calculate(s string) (ans int) {
	stk := []int{}
	sign := 1
	n := len(s)
	for i := 0; i < n; i++ {
		switch s[i] {
		case ' ':
		case '+':
			sign = 1
		case '-':
			sign = -1
		case '(':
			stk = append(stk, ans)
			stk = append(stk, sign)
			ans, sign = 0, 1
		case ')':
			ans *= stk[len(stk)-1]
			stk = stk[:len(stk)-1]
			ans += stk[len(stk)-1]
			stk = stk[:len(stk)-1]
		default:
			x := 0
			j := i
			for ; j < n && '0' <= s[j] && s[j] <= '9'; j++ {
				x = x*10 + int(s[j]-'0')
			}
			ans += sign * x
			i = j - 1
		}
	}
	return
}
```

### Java

```java
import java.util.*;
// Basic Calculator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int calculate(String s) {
        Deque<Integer> stk = new ArrayDeque<>();
        int sign = 1;
        int ans = 0;
        int n = s.length();
        for (int i = 0; i < n; ++i) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                int j = i;
                int x = 0;
                while (j < n && Character.isDigit(s.charAt(j))) {
                    x = x * 10 + s.charAt(j) - '0';
                    j++;
                }
                ans += sign * x;
                i = j - 1;
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                stk.push(ans);
                stk.push(sign);
                ans = 0;
                sign = 1;
            } else if (c == ')') {
                ans = stk.pop() * ans + stk.pop();
            }
        }
        return ans;
    }
}
```

### Python

```python
# Basic Calculator：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def calculate(self, s: str) -> int:
        stk = []
        ans, sign = 0, 1
        i, n = 0, len(s)
        while i < n:
            if s[i].isdigit():
                x = 0
                j = i
                while j < n and s[j].isdigit():
                    x = x * 10 + int(s[j])
                    j += 1
                ans += sign * x
                i = j - 1
            elif s[i] == "+":
                sign = 1
            elif s[i] == "-":
                sign = -1
            elif s[i] == "(":
                stk.append(ans)
                stk.append(sign)
                ans, sign = 0, 1
            elif s[i] == ")":
                ans = stk.pop() * ans + stk.pop()
            i += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

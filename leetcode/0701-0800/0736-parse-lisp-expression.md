# 0736. Parse Lisp Expression

---
编号: 736
题目: Parse Lisp Expression
难度: 困难
标签: [栈, 递归, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/parse-lisp-expression/
---

## 题目描述

给你一个类似 Lisp 语句的字符串表达式 `expression`，求出其计算结果。

表达式语法如下所示:

- 表达式可以为整数，**let** 表达式，**add** 表达式，**mult** 表达式，或赋值的变量。表达式的结果总是一个整数。

- (整数可以是正整数、负整数、0)

- **let** 表达式采用 `"(let v1 e1 v2 e2 ... vn en expr)"` 的形式，其中 `let` 总是以字符串 `"let"`来表示，接下来会跟随一对或多对交替的变量和表达式，也就是说，第一个变量 `v1`被分配为表达式 `e1` 的值，第二个变量 `v2` 被分配为表达式 `e2` 的值，**依次类推**；最终 `let` 表达式的值为 `expr`表达式的值。

- **add **表达式表示为 `"(add e1 e2)"` ，其中 `add` 总是以字符串 `"add"` 来表示，该表达式总是包含两个表达式 `e1`、`e2` ，最终结果是 `e1` 表达式的值与 `e2` 表达式的值之 **和 **。

- **mult** 表达式表示为 `"(mult e1 e2)"` ，其中 `mult` 总是以字符串 `"mult"` 表示，该表达式总是包含两个表达式 `e1`、`e2`，最终结果是 `e1` 表达式的值与 `e2` 表达式的值之** 积 **。

- 在该题目中，变量名以小写字符开始，之后跟随 0 个或多个小写字符或数字。为了方便，`"add"` ，`"let"` ，`"mult"` 会被定义为 "关键字" ，不会用作变量名。

- 最后，要说一下作用域的概念。计算变量名所对应的表达式时，在计算上下文中，首先检查最内层作用域（按括号计），然后按顺序依次检查外部作用域。测试用例中每一个表达式都是合法的。有关作用域的更多详细信息，请参阅示例。

**示例 1：**

```text
输入：expression = "(let x 2 (mult x (let x 3 y 4 (add x y))))"
输出：14
解释：
计算表达式 (add x y), 在检查变量 x 值时，
在变量的上下文中由最内层作用域依次向外检查。
首先找到 x = 3, 所以此处的 x 值是 3 。
```

**示例 2：**

```text
输入：expression = "(let x 3 x 2 x)"
输出：2
解释：let 语句中的赋值运算按顺序处理即可。
```

**示例 3：**

```text
输入：expression = "(let x 1 y 2 x (add x y) (add x y))"
输出：5
解释：
第一个 (add x y) 计算结果是 3，并且将此值赋给了 x 。
第二个 (add x y) 计算结果是 3 + 2 = 5 。
```

**提示：**

- `1 <= expression.length <= 2000`

- `exprssion` 中不含前导和尾随空格

- `expressoin` 中的不同部分（token）之间用单个空格进行分隔

- 答案和所有中间计算结果都符合 **32-bit** 整数范围

- 测试用例中的表达式均为合法的且最终结果为整数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 递归, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

时间复杂度 $O(n)$。

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
// Parse Lisp Expression：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func evaluate(expression string) int {
	i, n := 0, len(expression)
	scope := map[string][]int{}

	parseVar := func() string {
		j := i
		for ; i < n && expression[i] != ' ' && expression[i] != ')'; i++ {
		}
		return expression[j:i]
	}

	parseInt := func() int {
		sign, v := 1, 0
		if expression[i] == '-' {
			sign = -1
			i++
		}
		for ; i < n && expression[i] >= '0' && expression[i] <= '9'; i++ {
			v = (v * 10) + int(expression[i]-'0')
		}
		return sign * v
	}

	var eval func() int
	eval = func() int {
		if expression[i] != '(' {
			if unicode.IsLower(rune(expression[i])) {
				t := scope[parseVar()]
				return t[len(t)-1]
			}
			return parseInt()
		}
		i++
		ans := 0
		if expression[i] == 'l' {
			i += 4
			vars := []string{}
			for {
				v := parseVar()
				if expression[i] == ')' {
					t := scope[v]
					ans = t[len(t)-1]
					break
				}
				i++
				vars = append(vars, v)
				scope[v] = append(scope[v], eval())
				i++
				if !unicode.IsLower(rune(expression[i])) {
					ans = eval()
					break
				}
			}
			for _, v := range vars {
				scope[v] = scope[v][:len(scope[v])-1]
			}
		} else {
			add := expression[i] == 'a'
			if add {
				i += 4
			} else {
				i += 5
			}
			a := eval()
			i++
			b := eval()
			if add {
				ans = a + b
			} else {
				ans = a * b
			}
		}
		i++
		return ans
	}
	return eval()
}
```

### Java

```java
// Parse Lisp Expression：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int i;
    private String expr;
    private Map<String, Deque<Integer>> scope = new HashMap<>();

    public int evaluate(String expression) {
        expr = expression;
        return eval();
    }

    private int eval() {
        char c = expr.charAt(i);
        if (c != '(') {
            return Character.isLowerCase(c) ? scope.get(parseVar()).peekLast() : parseInt();
        }
        ++i;
        c = expr.charAt(i);
        int ans = 0;
        if (c == 'l') {
            i += 4;
            List<String> vars = new ArrayList<>();
            while (true) {
                String var = parseVar();
                if (expr.charAt(i) == ')') {
                    ans = scope.get(var).peekLast();
                    break;
                }
                vars.add(var);
                ++i;
                scope.computeIfAbsent(var, k -> new ArrayDeque<>()).offer(eval());
                ++i;
                if (!Character.isLowerCase(expr.charAt(i))) {
                    ans = eval();
                    break;
                }
            }
            for (String v : vars) {
                scope.get(v).pollLast();
            }
        } else {
            boolean add = c == 'a';
            i += add ? 4 : 5;
            int a = eval();
            ++i;
            int b = eval();
            ans = add ? a + b : a * b;
        }
        ++i;
        return ans;
    }

    private String parseVar() {
        int j = i;
        while (i < expr.length() && expr.charAt(i) != ' ' && expr.charAt(i) != ')') {
            ++i;
        }
        return expr.substring(j, i);
    }

    private int parseInt() {
        int sign = 1;
        if (expr.charAt(i) == '-') {
            sign = -1;
            ++i;
        }
        int v = 0;
        while (i < expr.length() && Character.isDigit(expr.charAt(i))) {
            v = v * 10 + (expr.charAt(i) - '0');
            ++i;
        }
        return sign * v;
    }
}
```

### Python

```python
# Parse Lisp Expression：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def evaluate(self, expression: str) -> int:
        def parseVar():
            nonlocal i
            j = i
            while i < n and expression[i] not in " )":
                i += 1
            return expression[j:i]

        def parseInt():
            nonlocal i
            sign, v = 1, 0
            if expression[i] == "-":
                sign = -1
                i += 1
            while i < n and expression[i].isdigit():
                v = v * 10 + int(expression[i])
                i += 1
            return sign * v

        def eval():
            nonlocal i
            if expression[i] != "(":
                return scope[parseVar()][-1] if expression[i].islower() else parseInt()
            i += 1
            if expression[i] == "l":
                i += 4
                vars = []
                while 1:
                    var = parseVar()
                    if expression[i] == ")":
                        ans = scope[var][-1]
                        break
                    vars.append(var)
                    i += 1
                    scope[var].append(eval())
                    i += 1
                    if not expression[i].islower():
                        ans = eval()
                        break
                for v in vars:
                    scope[v].pop()
            else:
                add = expression[i] == "a"
                i += 4 if add else 5
                a = eval()
                i += 1
                b = eval()
                ans = a + b if add else a * b
            i += 1
            return ans

        i, n = 0, len(expression)
        scope = defaultdict(list)
        return eval()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

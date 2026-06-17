# 0640. Solve the Equation

---
编号: 640
题目: Solve the Equation
难度: 中等
标签: [数学, 字符串, 模拟]
来源链接: https://leetcode.com/problems/solve-the-equation/
---

## 题目描述

求解一个给定的方程，将`x`以字符串 `"x=#value"` 的形式返回。该方程仅包含 `'+'` ， `'-'` 操作，变量 `x` 和其对应系数。

如果方程没有解或存在的解不为整数，请返回 `"No solution"` 。如果方程有无限解，则返回 `“Infinite solutions”` 。

题目保证，如果方程中只有一个解，则 'x' 的值是一个整数。

**示例 1：**

```text
输入: equation = "x+5-3+x=6+x-2"
输出: "x=2"
```

**示例 2:**

```text
输入: equation = "x=x"
输出: "Infinite solutions"
```

**示例 3:**

```text
输入: equation = "2x=x"
输出: "x=0"
```

**提示:**

- `3 ​​​

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

将方程 $equation$ 按照等号 “=” 切分为左右两个式子，分别算出左右两个式子中 "x" 的系数 $x_i$，以及常数的值 $y_i$。

那么方程转换为等式 $x_1 \times x + y_1 = x_2 \times x + y_2$。

- 当 $x_1 = x_2$：若 $y_1 \neq y_2$，方程无解；若 $y_1=y_2$，方程有无限解。
- 当 $x_1 \neq x_2$：方程有唯一解 $x=\frac{y_2-y_1}{x_1-x_2}$。

相似题目：

- [592. 分数加减运算](https://github.com/doocs/leetcode/blob/main/solution/0500-0599/0592.Fraction%20Addition%20and%20Subtraction/README.md)

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
// Solve the Equation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func solveEquation(equation string) string {
	f := func(s string) []int {
		x, y := 0, 0
		if s[0] != '-' {
			s = "+" + s
		}
		i, n := 0, len(s)
		for i < n {
			sign := 1
			if s[i] == '-' {
				sign = -1
			}
			i++
			j := i
			for j < n && s[j] != '+' && s[j] != '-' {
				j++
			}
			v := s[i:j]
			if s[j-1] == 'x' {
				a := 1
				if len(v) > 1 {
					a, _ = strconv.Atoi(v[:len(v)-1])
				}
				x += sign * a
			} else {
				a, _ := strconv.Atoi(v)
				y += sign * a
			}
			i = j
		}
		return []int{x, y}
	}

	es := strings.Split(equation, "=")
	a, b := f(es[0]), f(es[1])
	x1, y1 := a[0], a[1]
	x2, y2 := b[0], b[1]
	if x1 == x2 {
		if y1 == y2 {
			return "Infinite solutions"
		} else {
			return "No solution"
		}
	}
	return fmt.Sprintf("x=%d", (y2-y1)/(x1-x2))
}
```

### Java

```java
// Solve the Equation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String solveEquation(String equation) {
        String[] es = equation.split("=");
        int[] a = f(es[0]), b = f(es[1]);
        int x1 = a[0], y1 = a[1];
        int x2 = b[0], y2 = b[1];
        if (x1 == x2) {
            return y1 == y2 ? "Infinite solutions" : "No solution";
        }
        return "x=" + (y2 - y1) / (x1 - x2);
    }

    private int[] f(String s) {
        int x = 0, y = 0;
        if (s.charAt(0) != '-') {
            s = "+" + s;
        }
        int i = 0, n = s.length();
        while (i < n) {
            int sign = s.charAt(i) == '+' ? 1 : -1;
            ++i;
            int j = i;
            while (j < n && s.charAt(j) != '+' && s.charAt(j) != '-') {
                ++j;
            }
            String v = s.substring(i, j);
            if (s.charAt(j - 1) == 'x') {
                x += sign * (v.length() > 1 ? Integer.parseInt(v.substring(0, v.length() - 1)) : 1);
            } else {
                y += sign * Integer.parseInt(v);
            }
            i = j;
        }
        return new int[] {x, y};
    }
}
```

### Python

```python
# Solve the Equation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def solveEquation(self, equation: str) -> str:
        def f(s):
            x = y = 0
            if s[0] != '-':
                s = '+' + s
            i, n = 0, len(s)
            while i < n:
                sign = 1 if s[i] == '+' else -1
                i += 1
                j = i
                while j < n and s[j] not in '+-':
                    j += 1
                v = s[i:j]
                if v[-1] == 'x':
                    x += sign * (int(v[:-1]) if len(v) > 1 else 1)
                else:
                    y += sign * int(v)
                i = j
            return x, y

        a, b = equation.split('=')
        x1, y1 = f(a)
        x2, y2 = f(b)
        if x1 == x2:
            return 'Infinite solutions' if y1 == y2 else 'No solution'
        return f'x={(y2 - y1) // (x1 - x2)}'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

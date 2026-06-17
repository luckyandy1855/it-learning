# 0856. Score of Parentheses

---
编号: 856
题目: Score of Parentheses
难度: 中等
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/score-of-parentheses/
---

## 题目描述

给定一个平衡括号字符串 `S`，按下述规则计算该字符串的分数：

- `()` 得 1 分。

- `AB` 得 `A + B` 分，其中 A 和 B 是平衡括号字符串。

- `(A)` 得 `2 * A` 分，其中 A 是平衡括号字符串。

**示例 1：**

```text
输入： "()"
输出： 1
```

**示例 2：**

```text
输入： "(())"
输出： 2
```

**示例 3：**

```text
输入： "()()"
输出： 2
```

**示例 4：**

```text
输入： "(()(()))"
输出： 6
```

**提示：**

- `S` 是平衡括号字符串，且只含有 `(` 和 `)` 。

- `2

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们通过观察发现，`()` 是唯一贡献分数的结构，外括号只是为该结构添加了一些乘数。所以我们只需要关心 `()`。

我们用 $d$ 维护当前括号的深度，对于每个 `(`，我们将深度加一，对于每个 `)`，我们将深度减一。当我们遇到 `()` 时，我们将 $2^d$ 加到答案中。

我们举个实际的例子，以 `(()(()))` 为例，我们首先找到内部两个闭合括号 `()`，然后将分数加上对应的 $2^d$。实际上，我们是在计算 `(()) + ((()))` 的分数。

```bash
( ( ) ( ( ) ) )
  ^ ^   ^ ^

( ( ) ) + ( ( ( ) ) )
  ^ ^         ^ ^
```

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 是字符串的长度。

括号相关类型题：

- [678. 有效的括号字符串](https://github.com/doocs/leetcode/blob/main/solution/0600-0699/0678.Valid%20Parenthesis%20String/README.md)
- [1021. 删除最外层的括号](https://github.com/doocs/leetcode/blob/main/solution/1000-1099/1021.Remove%20Outermost%20Parentheses/README.md)
- [1096. 花括号展开 II](https://github.com/doocs/leetcode/blob/main/solution/1000-1099/1096.Brace%20Expansion%20II/README.md)
- [1249. 移除无效的括号](https://github.com/doocs/leetcode/blob/main/solution/1200-1299/1249.Minimum%20Remove%20to%20Make%20Valid%20Parentheses/README.md)
- [1541. 平衡括号字符串的最少插入次数](https://github.com/doocs/leetcode/blob/main/solution/1500-1599/1541.Minimum%20Insertions%20to%20Balance%20a%20Parentheses%20String/README.md)
- [2116. 判断一个括号字符串是否有效](https://github.com/doocs/leetcode/blob/main/solution/2100-2199/2116.Check%20if%20a%20Parentheses%20String%20Can%20Be%20Valid/README.md)

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
// Score of Parentheses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func scoreOfParentheses(s string) int {
	ans, d := 0, 0
	for i, c := range s {
		if c == '(' {
			d++
		} else {
			d--
			if s[i-1] == '(' {
				ans += 1 << d
			}
		}
	}
	return ans
}
```

### Java

```java
// Score of Parentheses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int scoreOfParentheses(String s) {
        int ans = 0, d = 0;
        for (int i = 0; i < s.length(); ++i) {
            if (s.charAt(i) == '(') {
                ++d;
            } else {
                --d;
                if (s.charAt(i - 1) == '(') {
                    ans += 1 << d;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Score of Parentheses：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def scoreOfParentheses(self, s: str) -> int:
        ans = d = 0
        for i, c in enumerate(s):
            if c == '(':
                d += 1
            else:
                d -= 1
                if s[i - 1] == '(':
                    ans += 1 << d
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

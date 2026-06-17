# 1096. Brace Expansion II

---
编号: 1096
题目: Brace Expansion II
难度: 困难
标签: [栈, 广度优先搜索, 哈希表, 字符串, 回溯, 排序]
来源链接: https://leetcode.com/problems/brace-expansion-ii/
---

## 题目描述

如果你熟悉 Shell 编程，那么一定了解过花括号展开，它可以用来生成任意字符串。

花括号展开的表达式可以看作一个由 **花括号**、**逗号** 和 **小写英文字母** 组成的字符串，定义下面几条语法规则：

- 如果只给出单一的元素 `x`，那么表达式表示的字符串就只有 `"x"`。`R(x) = {x}`

    	- 例如，表达式 `"a"` 表示字符串 `"a"`。

    	- 而表达式 `"w"` 就表示字符串 `"w"`。

    - 当两个或多个表达式并列，以逗号分隔，我们取这些表达式中元素的并集。`R({e_1,e_2,...}) = R(e_1) ∪ R(e_2) ∪ ...`

    	- 例如，表达式 `"{a,b,c}"` 表示字符串 `"a","b","c"`。

    	- 而表达式 `"{{a,b},{b,c}}"` 也可以表示字符串 `"a","b","c"`。

    - 要是两个或多个表达式相接，中间没有隔开时，我们从这些表达式中各取一个元素依次连接形成字符串。`R(e_1 + e_2) = {a + b for (a, b) in R(e_1) × R(e_2)}`

    	- 例如，表达式 `"{a,b}{c,d}"` 表示字符串 `"ac","ad","bc","bd"`。

    - 表达式之间允许嵌套，单一元素与表达式的连接也是允许的。

    	- 例如，表达式 `"a{b,c,d}"` 表示字符串 `"ab","ac","ad"​​​​​​`。

    	- 例如，表达式 `"a{b,c}{d,e}f{g,h}"` 可以表示字符串 `"abdfg", "abdfh", "abefg", "abefh", "acdfg", "acdfh", "acefg", "acefh"`。

给出表示基于给定语法规则的表达式 `expression`，返回它所表示的所有字符串组成的有序列表。

假如你希望以「集合」的概念了解此题，也可以通过点击 “**显示英文描述**” 获取详情。

**示例 1：**

```text
输入：expression = "{a,b}{c,{d,e}}"
输出：["ac","ad","ae","bc","bd","be"]
```

**示例 2：**

```text
输入：expression = "{{a,z},a{b,c},{ab,z}}"
输出：["a","ab","ac","z"]
解释：输出中 不应 出现重复的组合结果。
```

**提示：**

- `1 <= expression.length <= 60`

- `expression[i]` 由 `'{'`，`'}'`，`','` 或小写英文字母组成

- 给出的表达式 `expression` 用以表示一组基于题目描述中语法构造的字符串

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 广度优先搜索, 哈希表, 字符串, 回溯, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个递归函数 $dfs(exp)$，用于处理表达式 $exp$，并将结果存入集合 $s$ 中。

对于表达式 $exp$，我们首先找到第一个右花括号的位置 $j$，如果找不到，说明 $exp$ 中没有右花括号，即 $exp$ 为单一元素，直接将 $exp$ 加入集合 $s$ 中即可。

否则，我们从位置 $j$ 开始往左找到第一个左花括号的位置 $i$，此时 $exp[:i]$ 和 $exp[j + 1:]$ 分别为 $exp$ 的前缀和后缀，记为 $a$ 和 $c$。而 $exp[i + 1: j]$ 为 $exp$ 中花括号内的部分，即 $exp$ 中的子表达式，我们将其按照逗号分割成多个字符串 $b_1, b_2, \cdots, b_k$，然后对每个 $b_i$，我们将 $a + b_i + c$ 拼接成新的表达式，递归调用 $dfs$ 函数处理新的表达式，即 $dfs(a + b_i + c)$。

最后，我们将集合 $s$ 中的元素按照字典序排序，即可得到答案。

时间复杂度约为 $O(n \times 2^{n / 4})$，其中 $n$ 为表达式 $expression$ 的长度。

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
// Brace Expansion II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func braceExpansionII(expression string) []string {
	s := map[string]struct{}{}
	var dfs func(string)
	dfs = func(exp string) {
		j := strings.Index(exp, "}")
		if j == -1 {
			s[exp] = struct{}{}
			return
		}
		i := strings.LastIndex(exp[:j], "{")
		a, c := exp[:i], exp[j+1:]
		for _, b := range strings.Split(exp[i+1:j], ",") {
			dfs(a + b + c)
		}
	}
	dfs(expression)
	ans := make([]string, 0, len(s))
	for k := range s {
		ans = append(ans, k)
	}
	sort.Strings(ans)
	return ans
}
```

### Java

```java
// Brace Expansion II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private TreeSet<String> s = new TreeSet<>();

    public List<String> braceExpansionII(String expression) {
        dfs(expression);
        return new ArrayList<>(s);
    }

    private void dfs(String exp) {
        int j = exp.indexOf('}');
        if (j == -1) {
            s.add(exp);
            return;
        }
        int i = exp.lastIndexOf('{', j);
        String a = exp.substring(0, i);
        String c = exp.substring(j + 1);
        for (String b : exp.substring(i + 1, j).split(",")) {
            dfs(a + b + c);
        }
    }
}
```

### Python

```python
# Brace Expansion II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def braceExpansionII(self, expression: str) -> List[str]:
        def dfs(exp):
            j = exp.find('}')
            if j == -1:
                s.add(exp)
                return
            i = exp.rfind('{', 0, j - 1)
            a, c = exp[:i], exp[j + 1 :]
            for b in exp[i + 1 : j].split(','):
                dfs(a + b + c)

        s = set()
        dfs(expression)
        return sorted(s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

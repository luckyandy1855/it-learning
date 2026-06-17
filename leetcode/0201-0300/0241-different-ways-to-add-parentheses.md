# 0241. Different Ways to Add Parentheses

---
编号: 241
题目: Different Ways to Add Parentheses
难度: 中等
标签: [递归, 记忆化, 数学, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/different-ways-to-add-parentheses/
---

## 题目描述

给你一个由数字和运算符组成的字符串 `expression` ，按不同优先级组合数字和运算符，计算并返回所有可能组合的结果。你可以 **按任意顺序** 返回答案。

生成的测试用例满足其对应输出值符合 32 位整数范围，不同结果的数量不超过 `10^4` 。

**示例 1：**

```text
输入：expression = "2-1-1"
输出：[0,2]
解释：
((2-1)-1) = 0
(2-(1-1)) = 2
```

**示例 2：**

```text
输入：expression = "2*3-4*5"
输出：[-34,-14,-10,-10,10]
解释：
(2*(3-(4*5))) = -34
((2*3)-(4*5)) = -14
((2*(3-4))*5) = -10
(2*((3-4)*5)) = -10
(((2*3)-4)*5) = 10
```

**提示：**

- `1 <= expression.length <= 20`

- `expression` 由数字和算符 `'+'`、`'-'` 和 `'*'` 组成。

- 输入表达式中的所有整数值在范围 `[0, 99]`

- 输入表达式中的所有整数都没有前导 `'-'` 或 `'+'` 表示符号。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「递归, 记忆化, 数学, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Different Ways to Add Parentheses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
var memo = map[string][]int{}

func diffWaysToCompute(expression string) []int {
	return dfs(expression)
}

func dfs(exp string) []int {
	if v, ok := memo[exp]; ok {
		return v
	}
	if len(exp) < 3 {
		v, _ := strconv.Atoi(exp)
		return []int{v}
	}
	ans := []int{}
	for i, c := range exp {
		if c == '-' || c == '+' || c == '*' {
			left, right := dfs(exp[:i]), dfs(exp[i+1:])
			for _, a := range left {
				for _, b := range right {
					if c == '-' {
						ans = append(ans, a-b)
					} else if c == '+' {
						ans = append(ans, a+b)
					} else {
						ans = append(ans, a*b)
					}
				}
			}
		}
	}
	memo[exp] = ans
	return ans
}
```

### Java

```java
import java.util.*;
// Different Ways to Add Parentheses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private static Map<String, List<Integer>> memo = new HashMap<>();

    public List<Integer> diffWaysToCompute(String expression) {
        return dfs(expression);
    }

    private List<Integer> dfs(String exp) {
        if (memo.containsKey(exp)) {
            return memo.get(exp);
        }
        List<Integer> ans = new ArrayList<>();
        if (exp.length() < 3) {
            ans.add(Integer.parseInt(exp));
            return ans;
        }
        for (int i = 0; i < exp.length(); ++i) {
            char c = exp.charAt(i);
            if (c == '-' || c == '+' || c == '*') {
                List<Integer> left = dfs(exp.substring(0, i));
                List<Integer> right = dfs(exp.substring(i + 1));
                for (int a : left) {
                    for (int b : right) {
                        if (c == '-') {
                            ans.add(a - b);
                        } else if (c == '+') {
                            ans.add(a + b);
                        } else {
                            ans.add(a * b);
                        }
                    }
                }
            }
        }
        memo.put(exp, ans);
        return ans;
    }
}
```

### Python

```python
# Different Ways to Add Parentheses：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def diffWaysToCompute(self, expression: str) -> List[int]:
        @cache
        def dfs(exp):
            if exp.isdigit():
                return [int(exp)]
            ans = []
            for i, c in enumerate(exp):
                if c in '-+*':
                    left, right = dfs(exp[:i]), dfs(exp[i + 1 :])
                    for a in left:
                        for b in right:
                            if c == '-':
                                ans.append(a - b)
                            elif c == '+':
                                ans.append(a + b)
                            else:
                                ans.append(a * b)
            return ans

        return dfs(expression)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

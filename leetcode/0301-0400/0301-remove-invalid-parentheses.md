# 0301. Remove Invalid Parentheses

---
编号: 301
题目: Remove Invalid Parentheses
难度: 困难
标签: [广度优先搜索, 字符串, 回溯]
来源链接: https://leetcode.com/problems/remove-invalid-parentheses/
---

## 题目描述

给你一个由若干括号和字母组成的字符串 `s` ，删除最小数量的无效括号，使得输入的字符串有效。

返回所有可能的结果。答案可以按 **任意顺序** 返回。

**示例 1：**

```text
输入：s = "()())()"
输出：["(())()","()()()"]
```

**示例 2：**

```text
输入：s = "(a)())()"
输出：["(a())()","(a)()()"]
```

**示例 3：**

```text
输入：s = ")("
输出：[""]
```

**提示：**

	- `1 <= s.length <= 25`

	- `s` 由小写英文字母以及括号 `'('` 和 `')'` 组成

	- `s` 中至多含 `20` 个括号

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先处理得到字符串 $s$ 待删除的左、右括号的最小数量，分别记为 $l$ 和 $r$。

然后我们设计一个递归函数 `dfs(i, l, r, lcnt, rcnt, t)`，其中：

- `i` 表示当前处理到字符串 $s$ 的第 $i$ 个字符；
- `l` 和 `r` 分别表示剩余待删除的左、右括号的数量；
- `t` 表示当前得到的字符串；
- `lcnt` 和 `rcnt` 分别表示当前得到的字符串中左、右括号的数量。

递归函数的逻辑如下：

- 如果 `i` 等于字符串 $s$ 的长度，且 `l` 和 `r` 都等于 $0$，则将 `t` 加入答案数组中；
- 如果剩余的待处理字符数 $n-i$ 小于剩余待删除的左右括号数量 $l+r$，或者当前得到的字符串中的左括号数量小于右括号数量，直接返回；
- 如果当前字符是左括号，我们可以选择删除或者保留，如果删除，需要满足 $l \gt 0$，然后递归调用 `dfs(i+1, l-1, r, lcnt, rcnt, t)`；
- 如果当前字符是右括号，我们可以选择删除或者保留，如果删除，需要满足 $r \gt 0$，然后递归调用 `dfs(i+1, l, r-1, lcnt, rcnt, t)`；
- 如果选择保留当前字符，我们需要判断当前字符是左括号、右括号还是字母。如果是左括号，我们需要更新 `lcnt`，如果是右括号，我们需要更新 `rcnt`，然后递归调用 `dfs(i+1, l, r, lcnt, rcnt, t+s[i])`。

我们调用 `dfs(0, l, r, 0, 0, "")`，搜索所有可能的字符串。

最后返回去重后的答案数组即可。

时间复杂度 $O(n\times 2^n)$，空间复杂度 $O(n)$。长度为 $n$ 的字符串有 $2^n$ 种可能的删除方式，每种删除方式需要 $O(n)$ 的时间复制字符串。因此总时间复杂度为 $O(n\times 2^n)$。

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
// Remove Invalid Parentheses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeInvalidParentheses(s string) []string {
	vis := map[string]bool{}
	l, r, n := 0, 0, len(s)
	for _, c := range s {
		if c == '(' {
			l++
		} else if c == ')' {
			if l > 0 {
				l--
			} else {
				r++
			}
		}
	}
	var dfs func(i, l, r, lcnt, rcnt int, t string)
	dfs = func(i, l, r, lcnt, rcnt int, t string) {
		if i == n {
			if l == 0 && r == 0 {
				vis[t] = true
			}
			return
		}
		if n-i < l+r || lcnt < rcnt {
			return
		}
		if s[i] == '(' && l > 0 {
			dfs(i+1, l-1, r, lcnt, rcnt, t)
		}
		if s[i] == ')' && r > 0 {
			dfs(i+1, l, r-1, lcnt, rcnt, t)
		}
		x, y := 0, 0
		if s[i] == '(' {
			x = 1
		} else if s[i] == ')' {
			y = 1
		}
		dfs(i+1, l, r, lcnt+x, rcnt+y, t+string(s[i]))
	}
	dfs(0, l, r, 0, 0, "")
	ans := make([]string, 0, len(vis))
	for v := range vis {
		ans = append(ans, v)
	}
	return ans
}
```

### Java

```java
// Remove Invalid Parentheses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private String s;
    private int n;
    private Set<String> ans = new HashSet<>();

    public List<String> removeInvalidParentheses(String s) {
        this.s = s;
        this.n = s.length();
        int l = 0, r = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') {
                ++l;
            } else if (c == ')') {
                if (l > 0) {
                    --l;
                } else {
                    ++r;
                }
            }
        }
        dfs(0, l, r, 0, 0, "");
        return new ArrayList<>(ans);
    }

    private void dfs(int i, int l, int r, int lcnt, int rcnt, String t) {
        if (i == n) {
            if (l == 0 && r == 0) {
                ans.add(t);
            }
            return;
        }
        if (n - i < l + r || lcnt < rcnt) {
            return;
        }
        char c = s.charAt(i);
        if (c == '(' && l > 0) {
            dfs(i + 1, l - 1, r, lcnt, rcnt, t);
        }
        if (c == ')' && r > 0) {
            dfs(i + 1, l, r - 1, lcnt, rcnt, t);
        }
        int x = c == '(' ? 1 : 0;
        int y = c == ')' ? 1 : 0;
        dfs(i + 1, l, r, lcnt + x, rcnt + y, t + c);
    }
}
```

### Python

```python
# Remove Invalid Parentheses：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeInvalidParentheses(self, s: str) -> List[str]:
        def dfs(i, l, r, lcnt, rcnt, t):
            if i == n:
                if l == 0 and r == 0:
                    ans.add(t)
                return
            if n - i < l + r or lcnt < rcnt:
                return
            if s[i] == '(' and l:
                dfs(i + 1, l - 1, r, lcnt, rcnt, t)
            elif s[i] == ')' and r:
                dfs(i + 1, l, r - 1, lcnt, rcnt, t)
            dfs(i + 1, l, r, lcnt + (s[i] == '('), rcnt + (s[i] == ')'), t + s[i])

        l = r = 0
        for c in s:
            if c == '(':
                l += 1
            elif c == ')':
                if l:
                    l -= 1
                else:
                    r += 1
        ans = set()
        n = len(s)
        dfs(0, l, r, 0, 0, '')
        return list(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

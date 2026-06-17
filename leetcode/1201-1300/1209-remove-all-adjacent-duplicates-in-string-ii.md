# 1209. Remove All Adjacent Duplicates in String II

---
编号: 1209
题目: Remove All Adjacent Duplicates in String II
难度: 中等
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/
---

## 题目描述

给你一个字符串 `s`，「`k` 倍重复项删除操作」将会从 `s` 中选择 `k` 个相邻且相等的字母，并删除它们，使被删去的字符串的左侧和右侧连在一起。

你需要对 `s` 重复进行无限次这样的删除操作，直到无法继续为止。

在执行完所有删除操作后，返回最终得到的字符串。

本题答案保证唯一。

**示例 1：**

```text
输入：s = "abcd", k = 2
输出："abcd"
解释：没有要删除的内容。
```

**示例 2：**

```text
输入：s = "deeedbbcccbdaa", k = 3
输出："aa"
解释：
先删除 "eee" 和 "ccc"，得到 "ddbbbdaa"
再删除 "bbb"，得到 "dddaa"
最后删除 "ddd"，得到 "aa"
```

**示例 3：**

```text
输入：s = "pbbcggttciiippooaais", k = 2
输出："ps"
```

**提示：**

- `1 <= s.length <= 10^5`

- `2 <= k <= 10^4`

- `s` 中只含有小写英文字母。

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

我们可以遍历字符串 $s$，维护一个栈，栈中存储的是字符和该字符出现的次数。当遍历到字符 $c$ 时，如果栈顶元素的字符和 $c$ 相同，则将栈顶元素的次数加一，否则将字符 $c$ 和次数 $1$ 入栈。当栈顶元素的次数等于 $k$ 时，将栈顶元素出栈。

遍历完字符串 $s$ 后，栈中存储的就是最终结果。我们可以将栈中的元素依次弹出，拼接成字符串即可。

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
// Remove All Adjacent Duplicates in String II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeDuplicates(s string, k int) string {
	stk := []pair{}
	for _, c := range s {
		if len(stk) > 0 && stk[len(stk)-1].c == c {
			stk[len(stk)-1].v = (stk[len(stk)-1].v + 1) % k
			if stk[len(stk)-1].v == 0 {
				stk = stk[:len(stk)-1]
			}
		} else {
			stk = append(stk, pair{c, 1})
		}
	}
	ans := []rune{}
	for _, e := range stk {
		for i := 0; i < e.v; i++ {
			ans = append(ans, e.c)
		}
	}
	return string(ans)
}

type pair struct {
	c rune
	v int
}
```

### Java

```java
// Remove All Adjacent Duplicates in String II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String removeDuplicates(String s, int k) {
        Deque<int[]> stk = new ArrayDeque<>();
        for (int i = 0; i < s.length(); ++i) {
            int j = s.charAt(i) - 'a';
            if (!stk.isEmpty() && stk.peek()[0] == j) {
                stk.peek()[1] = (stk.peek()[1] + 1) % k;
                if (stk.peek()[1] == 0) {
                    stk.pop();
                }
            } else {
                stk.push(new int[] {j, 1});
            }
        }
        StringBuilder ans = new StringBuilder();
        for (var e : stk) {
            char c = (char) (e[0] + 'a');
            for (int i = 0; i < e[1]; ++i) {
                ans.append(c);
            }
        }
        ans.reverse();
        return ans.toString();
    }
}
```

### Python

```python
# Remove All Adjacent Duplicates in String II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeDuplicates(self, s: str, k: int) -> str:
        stk = []
        for c in s:
            if stk and stk[-1][0] == c:
                stk[-1][1] = (stk[-1][1] + 1) % k
                if stk[-1][1] == 0:
                    stk.pop()
            else:
                stk.append([c, 1])
        ans = [c * v for c, v in stk]
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

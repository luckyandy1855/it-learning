# 1061. Lexicographically Smallest Equivalent String

---
编号: 1061
题目: Lexicographically Smallest Equivalent String
难度: 中等
标签: [并查集, 字符串]
来源链接: https://leetcode.com/problems/lexicographically-smallest-equivalent-string/
---

## 题目描述

给出长度相同的两个字符串`s1` 和 `s2` ，还有一个字符串 `baseStr` 。

其中  `s1[i]` 和 `s2[i]`  是一组等价字符。

- 举个例子，如果 `s1 = "abc"` 且 `s2 = "cde"`，那么就有 `'a' == 'c', 'b' == 'd', 'c' == 'e'`。

等价字符遵循任何等价关系的一般规则：

- ** 自反性 **：`'a' == 'a'`

-  **对称性 **：`'a' == 'b'` 则必定有 `'b' == 'a'`

-  **传递性** ：`'a' == 'b'` 且 `'b' == 'c'` 就表明 `'a' == 'c'`

例如， `s1 = "abc"` 和 `s2 = "cde"` 的等价信息和之前的例子一样，那么 `baseStr = "eed"` , `"acd"` 或 `"aab"`，这三个字符串都是等价的，而 `"aab"` 是 `baseStr` 的按字典序最小的等价字符串

利用* *`s1` 和 `s2` 的等价信息，找出并返回* *`baseStr`* *的按字典序排列最小的等价字符串。

**示例 1：**

```text
输入：s1 = "parker", s2 = "morris", baseStr = "parser"
输出："makkek"
解释：根据 A 和 B 中的等价信息，我们可以将这些字符分为 [m,p], [a,o], [k,r,s], [e,i] 共 4 组。每组中的字符都是等价的，并按字典序排列。所以答案是 "makkek"。
```

**示例 2：**

```text
输入：s1 = "hello", s2 = "world", baseStr = "hold"
输出："hdld"
解释：根据 A 和 B 中的等价信息，我们可以将这些字符分为 [h,w], [d,e,o], [l,r] 共 3 组。所以只有 S 中的第二个字符 'o' 变成 'd'，最后答案为 "hdld"。
```

**示例 3：**

```text
输入：s1 = "leetcode", s2 = "programs", baseStr = "sourcecode"
输出："aauaaaaada"
解释：我们可以把 A 和 B 中的等价字符分为 [a,o,e,r,s,c], [l,p], [g,t] 和 [d,m] 共 4 组，因此 S 中除了 'u' 和 'd' 之外的所有字母都转化成了 'a'，最后答案为 "aauaaaaada"。
```

**提示：**

- `1 <= s1.length, s2.length, baseStr <= 1000`

- `s1.length == s2.length`

- 字符串`s1`, `s2`, and `baseStr` 仅由从 `'a'` 到 `'z'` 的小写英文字母组成。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用并查集来处理等价字符的关系。每个字符可以看作一个节点，等价关系可以看作是连接这些节点的边。通过并查集，我们可以将所有等价的字符归为一类，并且在查询时能够快速找到每个字符的代表元素。我们在进行合并操作时，始终将代表元素设置为字典序最小的字符，这样可以确保最终得到的字符串是按字典序排列的最小等价字符串。

时间复杂度 $O((n + m) \times \log |\Sigma|)$，空间复杂度 $O(|\Sigma|)$。其中 $n$ 是字符串 $s1$ 和 $s2$ 的长度，而 $m$ 是字符串 $baseStr$ 的长度，而 $|\Sigma|$ 是字符集的大小，本题中 $|\Sigma| = 26$。

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
// Lexicographically Smallest Equivalent String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func smallestEquivalentString(s1 string, s2 string, baseStr string) string {
	p := make([]int, 26)
	for i := 0; i < 26; i++ {
		p[i] = i
	}

	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}

	for i := 0; i < len(s1); i++ {
		x := int(s1[i] - 'a')
		y := int(s2[i] - 'a')
		px := find(x)
		py := find(y)
		if px < py {
			p[py] = px
		} else {
			p[px] = py
		}
	}

	var s []byte
	for i := 0; i < len(baseStr); i++ {
		s = append(s, byte('a'+find(int(baseStr[i]-'a'))))
	}

	return string(s)
}
```

### Java

```java
// Lexicographically Smallest Equivalent String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int[] p = new int[26];

    public String smallestEquivalentString(String s1, String s2, String baseStr) {
        for (int i = 0; i < p.length; ++i) {
            p[i] = i;
        }
        for (int i = 0; i < s1.length(); ++i) {
            int x = s1.charAt(i) - 'a';
            int y = s2.charAt(i) - 'a';
            int px = find(x), py = find(y);
            if (px < py) {
                p[py] = px;
            } else {
                p[px] = py;
            }
        }
        char[] s = baseStr.toCharArray();
        for (int i = 0; i < s.length; ++i) {
            s[i] = (char) ('a' + find(s[i] - 'a'));
        }
        return String.valueOf(s);
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}
```

### Python

```python
# Lexicographically Smallest Equivalent String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def smallestEquivalentString(self, s1: str, s2: str, baseStr: str) -> str:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        p = list(range(26))
        for a, b in zip(s1, s2):
            x, y = ord(a) - ord("a"), ord(b) - ord("a")
            px, py = find(x), find(y)
            if px < py:
                p[py] = px
            else:
                p[px] = py
        return "".join(chr(find(ord(c) - ord("a")) + ord("a")) for c in baseStr)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

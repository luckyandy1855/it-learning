# 0269. Alien Dictionary

---
编号: 269
题目: Alien Dictionary
难度: 困难
标签: [深度优先搜索, 广度优先搜索, 图, 拓扑排序, 数组, 字符串]
来源链接: https://leetcode.com/problems/alien-dictionary/
---

## 题目描述

现有一种使用英语字母的火星语言，这门语言的字母顺序对你来说是未知的。

给你一个来自这种外星语言字典的字符串列表 `words` ，`words` 中的字符串已经 **按这门新语言的字典序进行了排序** 。

如果这种说法是错误的，并且给出的 `words` 不能对应任何字母的顺序，则返回 `""` 。

否则，返回一个按新语言规则的 **字典递增顺序 **排序的独特字符串。如果有多个解决方案，则返回其中 **任意一个** 。

**示例 1：**

```text
输入：words = ["wrt","wrf","er","ett","rftt"]
输出："wertf"
```

**示例 2：**

```text
输入：words = ["z","x"]
输出："zx"
```

**示例 3：**

```text
输入：words = ["z","x","z"]
输出：""
解释：不存在合法字母顺序，因此返回 "" 。
```

**提示：**

- `1 <= words.length <= 100`

- `1 <= words[i].length <= 100`

- `words[i]` 仅由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图, 拓扑排序, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

用数组 $g$ 记录在火星字典中的字母先后关系，$g[i][j] = true$ 表示字母 $i + 'a'$ 在字母 $j + 'a'$ 的前面；用数组 $s$ 记录当前字典出现过的字母，$cnt$ 表示出现过的字母数。

一个很简单的想法是遍历每一个单词，比较该单词和其后的所有单词，把所有的先后关系更新进数组 $g$，这样遍历时间复杂度为 $O(n^3)$；但是我们发现其实比较相邻的两个单词就可以了，比如 $a < b < c$ 则比较 $a < b$ 和 $b < c$， $a$ 和 $c$ 的关系便确定了。因此算法可以优化成比较相邻两个单词，时间复杂度为 $O(n²)$。

出现矛盾的情况：

- $g[i][j]$ = $g[j][i]$ = $true$；
- 后一个单词是前一个单词的前缀；
- 在拓扑排序后 $ans$ 的长度小于统计到的字母个数。

拓扑排序：

- 统计所有出现的字母入度；
- 将所有入度为 $0$ 的字母加入队列；
- 当队列不空，出队并更新其他字母的入度，入度为 $0$ 则入队，同时出队时将当前字母加入 $ans$ 的结尾；
- 得到的便是字母的拓扑序，也就是火星字典的字母顺序。

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
// Alien Dictionary：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func alienOrder(words []string) string {
	g := [26][26]bool{}
	s := [26]bool{}
	cnt := 0
	n := len(words)
	for i := 0; i < n-1; i++ {
		for _, c := range words[i] {
			if cnt == 26 {
				break
			}
			c -= 'a'
			if !s[c] {
				cnt++
				s[c] = true
			}
		}
		m := len(words[i])
		for j := 0; j < m; j++ {
			if j >= len(words[i+1]) {
				return ""
			}
			c1, c2 := words[i][j]-'a', words[i+1][j]-'a'
			if c1 == c2 {
				continue
			}
			if g[c2][c1] {
				return ""
			}
			g[c1][c2] = true
			break
		}
	}
	for _, c := range words[n-1] {
		if cnt == 26 {
			break
		}
		c -= 'a'
		if !s[c] {
			cnt++
			s[c] = true
		}
	}

	inDegree := [26]int{}
	for _, out := range g {
		for i, v := range out {
			if v {
				inDegree[i]++
			}
		}
	}
	q := []int{}
	for i, in := range inDegree {
		if in == 0 && s[i] {
			q = append(q, i)
		}
	}
	ans := ""
	for len(q) > 0 {
		t := q[0]
		q = q[1:]
		ans += string(t + 'a')
		for i, v := range g[t] {
			if v {
				inDegree[i]--
				if inDegree[i] == 0 && s[i] {
					q = append(q, i)
				}
			}
		}
	}
	if len(ans) < cnt {
		return ""
	}
	return ans
}
```

### Java

```java
import java.util.*;
// Alien Dictionary：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {

    public String alienOrder(String[] words) {
        boolean[][] g = new boolean[26][26];
        boolean[] s = new boolean[26];
        int cnt = 0;
        int n = words.length;
        for (int i = 0; i < n - 1; ++i) {
            for (char c : words[i].toCharArray()) {
                if (cnt == 26) {
                    break;
                }
                c -= 'a';
                if (!s[c]) {
                    ++cnt;
                    s[c] = true;
                }
            }
            int m = words[i].length();
            for (int j = 0; j < m; ++j) {
                if (j >= words[i + 1].length()) {
                    return "";
                }
                char c1 = words[i].charAt(j), c2 = words[i + 1].charAt(j);
                if (c1 == c2) {
                    continue;
                }
                if (g[c2 - 'a'][c1 - 'a']) {
                    return "";
                }
                g[c1 - 'a'][c2 - 'a'] = true;
                break;
            }
        }
        for (char c : words[n - 1].toCharArray()) {
            if (cnt == 26) {
                break;
            }
            c -= 'a';
            if (!s[c]) {
                ++cnt;
                s[c] = true;
            }
        }

        int[] indegree = new int[26];
        for (int i = 0; i < 26; ++i) {
            for (int j = 0; j < 26; ++j) {
                if (i != j && s[i] && s[j] && g[i][j]) {
                    ++indegree[j];
                }
            }
        }
        Deque<Integer> q = new LinkedList<>();
        for (int i = 0; i < 26; ++i) {
            if (s[i] && indegree[i] == 0) {
                q.offerLast(i);
            }
        }
        StringBuilder ans = new StringBuilder();
        while (!q.isEmpty()) {
            int t = q.pollFirst();
            ans.append((char) (t + 'a'));
            for (int i = 0; i < 26; ++i) {
                if (i != t && s[i] && g[t][i]) {
                    if (--indegree[i] == 0) {
                        q.offerLast(i);
                    }
                }
            }
        }
        return ans.length() < cnt ? "" : ans.toString();
    }
}
```

### Python

```python
# Alien Dictionary：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def alienOrder(self, words: List[str]) -> str:
        g = [[False] * 26 for _ in range(26)]
        s = [False] * 26
        cnt = 0
        n = len(words)
        for i in range(n - 1):
            for c in words[i]:
                if cnt == 26:
                    break
                o = ord(c) - ord('a')
                if not s[o]:
                    cnt += 1
                    s[o] = True
            m = len(words[i])
            for j in range(m):
                if j >= len(words[i + 1]):
                    return ''
                c1, c2 = words[i][j], words[i + 1][j]
                if c1 == c2:
                    continue
                o1, o2 = ord(c1) - ord('a'), ord(c2) - ord('a')
                if g[o2][o1]:
                    return ''
                g[o1][o2] = True
                break
        for c in words[n - 1]:
            if cnt == 26:
                break
            o = ord(c) - ord('a')
            if not s[o]:
                cnt += 1
                s[o] = True

        indegree = [0] * 26
        for i in range(26):
            for j in range(26):
                if i != j and s[i] and s[j] and g[i][j]:
                    indegree[j] += 1
        q = deque()
        ans = []
        for i in range(26):
            if s[i] and indegree[i] == 0:
                q.append(i)
        while q:
            t = q.popleft()
            ans.append(chr(t + ord('a')))
            for i in range(26):
                if s[i] and i != t and g[t][i]:
                    indegree[i] -= 1
                    if indegree[i] == 0:
                        q.append(i)
        return '' if len(ans) < cnt else ''.join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

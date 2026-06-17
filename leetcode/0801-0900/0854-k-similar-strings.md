# 0854. K-Similar Strings

---
编号: 854
题目: K-Similar Strings
难度: 困难
标签: [广度优先搜索, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/k-similar-strings/
---

## 题目描述

对于某些非负整数 `k` ，如果交换 `s1` 中两个字母的位置恰好 `k` 次，能够使结果字符串等于 `s2` ，则认为字符串 `s1` 和 `s2` 的** 相似度为 **`k`** ****。**

给你两个字母异位词 `s1` 和 `s2` ，返回 `s1` 和 `s2` 的相似度 `k`** **的最小值。

**示例 1：**

```text
输入：s1 = "ab", s2 = "ba"
输出：1
```

**示例 2：**

```text
输入：s1 = "abc", s2 = "bca"
输出：2
```

**提示：**

- `1 <= s1.length <= 20`

- `s2.length == s1.length`

- `s1` 和 `s2`  只包含集合 `{'a', 'b', 'c', 'd', 'e', 'f'}` 中的小写字母

- `s2` 是 `s1` 的一个字母异位词

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题实际上是一类经典的问题：求解最小操作次数。从一个初始状态 $s_1$，经过最少 $k$ 次状态转换，变成目标状态 $s_2$。字符串长度不超过 $20$，我们考虑使用 BFS 搜索来求解。

首先将初始状态 $s_1$ 入队，用哈希表 `vis` 记录所有访问过的状态。

接下来每一轮，都是将队列中的所有状态转换到下一个状态，当遇到目标状态 $s_2$ 时，当前状态转换的轮数就是答案。

我们发现，题目的重点在于如何进行状态转换。对于本题，转换操作就是交换一个字符串中两个位置的字符。如果当前字符串 $s[i]$ 与 $s_2[i]$ 不相等，那么我们应该在 $s$ 中找到一个位置 $j$，满足 $s[j] = s_2[i]$ 并且 $s[j] \neq s_2[j]$，然后交换 $s[i]$ 和 $s[j]$。这样可以使得状态最接近于目标状态。这里的状态转换可以参考以下代码中的 `next()` 函数。

复杂度分析：BFS 剪枝不讨论时空复杂度。

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
// K-Similar Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func kSimilarity(s1 string, s2 string) int {
	next := func(s string) []string {
		i := 0
		res := []string{}
		for ; s[i] == s2[i]; i++ {
		}
		for j := i + 1; j < len(s1); j++ {
			if s[j] == s2[i] && s[j] != s2[j] {
				res = append(res, s[:i]+string(s[j])+s[i+1:j]+string(s[i])+s[j+1:])
			}
		}
		return res
	}

	q := []string{s1}
	vis := map[string]bool{s1: true}
	ans := 0
	for {
		for i := len(q); i > 0; i-- {
			s := q[0]
			q = q[1:]
			if s == s2 {
				return ans
			}
			for _, nxt := range next(s) {
				if !vis[nxt] {
					vis[nxt] = true
					q = append(q, nxt)
				}
			}
		}
		ans++
	}
}
```

### Java

```java
// K-Similar Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int kSimilarity(String s1, String s2) {
        Deque<String> q = new ArrayDeque<>();
        Set<String> vis = new HashSet<>();
        q.offer(s1);
        vis.add(s1);
        int ans = 0;
        while (true) {
            for (int i = q.size(); i > 0; --i) {
                String s = q.pollFirst();
                if (s.equals(s2)) {
                    return ans;
                }
                for (String nxt : next(s, s2)) {
                    if (!vis.contains(nxt)) {
                        vis.add(nxt);
                        q.offer(nxt);
                    }
                }
            }
            ++ans;
        }
    }

    private List<String> next(String s, String s2) {
        int i = 0, n = s.length();
        char[] cs = s.toCharArray();
        for (; cs[i] == s2.charAt(i); ++i) {
        }

        List<String> res = new ArrayList<>();
        for (int j = i + 1; j < n; ++j) {
            if (cs[j] == s2.charAt(i) && cs[j] != s2.charAt(j)) {
                swap(cs, i, j);
                res.add(new String(cs));
                swap(cs, i, j);
            }
        }
        return res;
    }

    private void swap(char[] cs, int i, int j) {
        char t = cs[i];
        cs[i] = cs[j];
        cs[j] = t;
    }
}
```

### Python

```python
# K-Similar Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kSimilarity(self, s1: str, s2: str) -> int:
        def next(s):
            i = 0
            while s[i] == s2[i]:
                i += 1
            res = []
            for j in range(i + 1, n):
                if s[j] == s2[i] and s[j] != s2[j]:
                    res.append(s2[: i + 1] + s[i + 1 : j] + s[i] + s[j + 1 :])
            return res

        q = deque([s1])
        vis = {s1}
        ans, n = 0, len(s1)
        while 1:
            for _ in range(len(q)):
                s = q.popleft()
                if s == s2:
                    return ans
                for nxt in next(s):
                    if nxt not in vis:
                        vis.add(nxt)
                        q.append(nxt)
            ans += 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

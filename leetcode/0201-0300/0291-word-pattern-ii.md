# 0291. Word Pattern II

---
编号: 291
题目: Word Pattern II
难度: 中等
标签: [哈希表, 字符串, 回溯]
来源链接: https://leetcode.com/problems/word-pattern-ii/
---

## 题目描述

给你一种规律 `pattern` 和一个字符串 `s`，请你判断 `s` 是否和* *`pattern` 的规律**相匹配**。

如果存在单个字符到 **非空** 字符串的 **双射映射** ，那么字符串 `s` 匹配 `pattern` ，即：如果 `pattern` 中的每个字符都被它映射到的字符串替换，那么最终的字符串则为 `s` 。**双射** 意味着映射双方一一对应，不会存在两个字符映射到同一个字符串，也不会存在一个字符分别映射到两个不同的字符串。

**示例 1：**

```text
输入：pattern = "abab", s = "redblueredblue"
输出：true
解释：一种可能的映射如下：
'a' -> "red"
'b' -> "blue"
```

**示例 2：**

```text
输入：pattern = "aaaa", s = "asdasdasdasd"
输出：true
解释：一种可能的映射如下：
'a' -> "asd"
```

**示例 3：**

```text
输入：pattern = "aabb", s = "xyzabcxzyabc"
输出：false
```

**提示：**

- `1 <= pattern.length, s.length <= 20`

- `pattern` 和 `s` 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Word Pattern II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func wordPatternMatch(pattern string, s string) bool {
	m, n := len(pattern), len(s)
	vis := map[string]bool{}
	d := map[byte]string{}
	var dfs func(i, j int) bool
	dfs = func(i, j int) bool {
		if i == m && j == n {
			return true
		}
		if i == m || j == n || m-i > n-j {
			return false
		}
		c := pattern[i]
		for k := j + 1; k <= n; k++ {
			t := s[j:k]
			if v, ok := d[c]; ok && v == t {
				if dfs(i+1, k) {
					return true
				}
			}
			if _, ok := d[c]; !ok && !vis[t] {
				d[c] = t
				vis[t] = true
				if dfs(i+1, k) {
					return true
				}
				delete(d, c)
				vis[t] = false
			}
		}
		return false
	}
	return dfs(0, 0)
}
```

### Java

```java
import java.util.*;
// Word Pattern II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private Set<String> vis;
    private Map<Character, String> d;
    private String p;
    private String s;
    private int m;
    private int n;

    public boolean wordPatternMatch(String pattern, String s) {
        vis = new HashSet<>();
        d = new HashMap<>();
        this.p = pattern;
        this.s = s;
        m = p.length();
        n = s.length();
        return dfs(0, 0);
    }

    private boolean dfs(int i, int j) {
        if (i == m && j == n) {
            return true;
        }
        if (i == m || j == n || m - i > n - j) {
            return false;
        }
        char c = p.charAt(i);
        for (int k = j + 1; k <= n; ++k) {
            String t = s.substring(j, k);
            if (d.getOrDefault(c, "").equals(t)) {
                if (dfs(i + 1, k)) {
                    return true;
                }
            }
            if (!d.containsKey(c) && !vis.contains(t)) {
                d.put(c, t);
                vis.add(t);
                if (dfs(i + 1, k)) {
                    return true;
                }
                vis.remove(t);
                d.remove(c);
            }
        }
        return false;
    }
}
```

### Python

```python
# Word Pattern II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def wordPatternMatch(self, pattern: str, s: str) -> bool:
        def dfs(i, j):
            if i == m and j == n:
                return True
            if i == m or j == n or n - j < m - i:
                return False
            for k in range(j, n):
                t = s[j : k + 1]
                if d.get(pattern[i]) == t:
                    if dfs(i + 1, k + 1):
                        return True
                if pattern[i] not in d and t not in vis:
                    d[pattern[i]] = t
                    vis.add(t)
                    if dfs(i + 1, k + 1):
                        return True
                    d.pop(pattern[i])
                    vis.remove(t)
            return False

        m, n = len(pattern), len(s)
        d = {}
        vis = set()
        return dfs(0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

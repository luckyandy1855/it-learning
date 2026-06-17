# 1023. Camelcase Matching

---
编号: 1023
题目: Camelcase Matching
难度: 中等
标签: [字典树, 数组, 双指针, 字符串, 字符串匹配]
来源链接: https://leetcode.com/problems/camelcase-matching/
---

## 题目描述

给你一个字符串数组 `queries`，和一个表示模式的字符串 `pattern`，请你返回一个布尔数组 `answer` 。只有在待查项 `queries[i]` 与模式串 `pattern` 匹配时， `answer[i]` 才为 `true`，否则为 `false`。

如果可以将 **小写字母 **插入模式串 `pattern` 得到待查询项 `queries[i]`，那么待查询项与给定模式串匹配。您可以在模式串中的任何位置插入字符，也可以选择不插入任何字符。

**示例 1：**

```text
输入：queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FB"
输出：[true,false,true,true,false]
示例：
"FooBar" 可以这样生成："F" + "oo" + "B" + "ar"。
"FootBall" 可以这样生成："F" + "oot" + "B" + "all".
"FrameBuffer" 可以这样生成："F" + "rame" + "B" + "uffer".
```

**示例 2：**

```text
输入：queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FoBa"
输出：[true,false,true,false,false]
解释：
"FooBar" 可以这样生成："Fo" + "o" + "Ba" + "r".
"FootBall" 可以这样生成："Fo" + "ot" + "Ba" + "ll".
```

**示例 3：**

```text
输入：queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FoBaT"
输出：[false,true,false,false,false]
解释：
"FooBarTest" 可以这样生成："Fo" + "o" + "Ba" + "r" + "T" + "est".
```

**提示：**

- `1 <= pattern.length, queries.length <= 100`

- `1 <= queries[i].length <= 100`

- `queries[i]` 和 `pattern` 由英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字典树, 数组, 双指针, 字符串, 字符串匹配」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以遍历 `queries` 中的每个字符串，判断其是否与 `pattern` 匹配，若匹配则将 `true` 加入答案数组，否则加入 `false`。

接下来，我们实现一个 $check(s, t)$ 函数，用于判断字符串 $s$ 和 $t$ 是否匹配。

我们可以使用双指针 $i$ 和 $j$，分别指向两个字符串的首字符，然后遍历两个字符串。如果指针 $i$ 和 $j$ 指向的字符不同，并且 $s[i]$ 为小写字母，则指针 $i$ 循环向后移动一位。

如果指针 $i$ 已经到达字符串 $s$ 的末尾，或者指针 $i$ 和 $j$ 指向的字符不同，则返回 `false`。否则，指针 $i$ 和 $j$ 同时向后移动一位。当指针 $j$ 到达字符串 $t$ 的末尾时，我们需要判断字符串 $s$ 中剩余的字符是否都为小写字母，若是则返回 `true`，否则返回 `false`。

时间复杂度 $(n \times m)$，其中 $n$ 和 $m$ 分别为数组 `queries` 的长度和字符串 `pattern` 的长度。

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
// Camelcase Matching：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func camelMatch(queries []string, pattern string) (ans []bool) {
	check := func(s, t string) bool {
		m, n := len(s), len(t)
		i, j := 0, 0
		for ; j < n; i, j = i+1, j+1 {
			for i < m && s[i] != t[j] && (s[i] >= 'a' && s[i] <= 'z') {
				i++
			}
			if i == m || s[i] != t[j] {
				return false
			}
		}
		for i < m && s[i] >= 'a' && s[i] <= 'z' {
			i++
		}
		return i == m
	}
	for _, q := range queries {
		ans = append(ans, check(q, pattern))
	}
	return
}
```

### Java

```java
// Camelcase Matching：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Boolean> camelMatch(String[] queries, String pattern) {
        List<Boolean> ans = new ArrayList<>();
        for (var q : queries) {
            ans.add(check(q, pattern));
        }
        return ans;
    }

    private boolean check(String s, String t) {
        int m = s.length(), n = t.length();
        int i = 0, j = 0;
        for (; j < n; ++i, ++j) {
            while (i < m && s.charAt(i) != t.charAt(j) && Character.isLowerCase(s.charAt(i))) {
                ++i;
            }
            if (i == m || s.charAt(i) != t.charAt(j)) {
                return false;
            }
        }
        while (i < m && Character.isLowerCase(s.charAt(i))) {
            ++i;
        }
        return i == m;
    }
}
```

### Python

```python
# Camelcase Matching：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def camelMatch(self, queries: List[str], pattern: str) -> List[bool]:
        def check(s, t):
            m, n = len(s), len(t)
            i = j = 0
            while j < n:
                while i < m and s[i] != t[j] and s[i].islower():
                    i += 1
                if i == m or s[i] != t[j]:
                    return False
                i, j = i + 1, j + 1
            while i < m and s[i].islower():
                i += 1
            return i == m

        return [check(q, pattern) for q in queries]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

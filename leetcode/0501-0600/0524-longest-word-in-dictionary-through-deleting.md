# 0524. Longest Word in Dictionary through Deleting

---
编号: 524
题目: Longest Word in Dictionary through Deleting
难度: 中等
标签: [数组, 双指针, 字符串, 排序]
来源链接: https://leetcode.com/problems/longest-word-in-dictionary-through-deleting/
---

## 题目描述

给你一个字符串 `s` 和一个字符串数组 `dictionary` ，找出并返回 `dictionary` 中最长的字符串，该字符串可以通过删除 `s` 中的某些字符得到。

如果答案不止一个，返回长度最长且字母序最小的字符串。如果答案不存在，则返回空字符串。

**示例 1：**

```text
输入：s = "abpcplea", dictionary = ["ale","apple","monkey","plea"]
输出："apple"
```

**示例 2：**

```text
输入：s = "abpcplea", dictionary = ["a","b","c"]
输出："a"
```

**提示：**

- `1 <= s.length <= 1000`

- `1 <= dictionary.length <= 1000`

- `1 <= dictionary[i].length <= 1000`

- `s` 和 `dictionary[i]` 仅由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个函数 $check(s, t)$，用于判断字符串 $s$ 是否是字符串 $t$ 的子序列。我们可以使用双指针的方法，初始化两个指针 $i$ 和 $j$ 分别指向字符串 $s$ 和字符串 $t$ 的开头，然后不断移动指针 $j$，如果 $s[i]$ 和 $t[j]$ 相等，则移动指针 $i$，最后判断 $i$ 是否等于 $s$ 的长度即可。若 $i$ 等于 $s$ 的长度，则说明 $s$ 是 $t$ 的子序列。

我们初始化答案字符串 $ans$ 为空字符串，然后遍历数组 $dictionary$ 中的每个字符串 $t$，如果 $t$ 是 $s$ 的子序列，并且 $t$ 的长度大于 $ans$ 的长度，或者 $t$ 的长度等于 $ans$ 的长度且 $t$ 字典序小于 $ans$，则更新 $ans$ 为 $t$。

时间复杂度 $O(d \times (m + n))$，其中 $d$ 是字符串列表的长度，而 $m$ 和 $n$ 分别是字符串 $s$ 的长度和字符串列表中字符串的平均长度。空间复杂度 $O(1)$。

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
// Longest Word in Dictionary through Deleting：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findLongestWord(s string, dictionary []string) string {
	ans := ''
	check := func(s, t string) bool {
		m, n := len(s), len(t)
		i := 0
		for j := 0; i < m && j < n; j++ {
			if s[i] == t[j] {
				i++
			}
		}
		return i == m
	}
	for _, t := range dictionary {
		a, b := len(ans), len(t)
		if check(t, s) && (a < b || (a == b && ans > t)) {
			ans = t
		}
	}
	return ans
}
```

### Java

```java
// Longest Word in Dictionary through Deleting：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String findLongestWord(String s, List<String> dictionary) {
        String ans = "";
        for (String t : dictionary) {
            int a = ans.length(), b = t.length();
            if (check(t, s) && (a < b || (a == b && t.compareTo(ans) < 0))) {
                ans = t;
            }
        }
        return ans;
    }

    private boolean check(String s, String t) {
        int m = s.length(), n = t.length();
        int i = 0;
        for (int j = 0; i < m && j < n; ++j) {
            if (s.charAt(i) == t.charAt(j)) {
                ++i;
            }
        }
        return i == m;
    }
}
```

### Python

```python
# Longest Word in Dictionary through Deleting：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findLongestWord(self, s: str, dictionary: List[str]) -> str:
        def check(s: str, t: str) -> bool:
            m, n = len(s), len(t)
            i = j = 0
            while i < m and j < n:
                if s[i] == t[j]:
                    i += 1
                j += 1
            return i == m

        ans = ""
        for t in dictionary:
            if check(t, s) and (len(ans) < len(t) or (len(ans) == len(t) and ans > t)):
                ans = t
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

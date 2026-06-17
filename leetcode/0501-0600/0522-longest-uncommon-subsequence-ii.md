# 0522. Longest Uncommon Subsequence II

---
编号: 522
题目: Longest Uncommon Subsequence II
难度: 中等
标签: [数组, 哈希表, 双指针, 字符串, 排序]
来源链接: https://leetcode.com/problems/longest-uncommon-subsequence-ii/
---

## 题目描述

给定字符串列表 `strs` ，返回其中 **最长的特殊序列** 的长度。如果最长特殊序列不存在，返回 `-1` 。

**特殊序列** 定义如下：该序列为某字符串 **独有的子序列（即不能是其他字符串的子序列）**。

 `s` 的 **子序列**可以通过删去字符串 `s` 中的某些字符实现。

- 例如，`"abc"` 是 `"aebdc"` 的子序列，因为您可以删除`"aebdc"`中的下划线字符来得到 `"abc"` 。`"aebdc"`的子序列还包括`"aebdc"`、 `"aeb"` 和 "" (空字符串)。

**示例 1：**

```text
输入: strs = ["aba","cdc","eae"]
输出: 3
```

**示例 2:**

```text
输入: strs = ["aaa","aaa","aa"]
输出: -1
```

**提示:**

- `2 <= strs.length <= 50`

- `1 <= strs[i].length <= 10`

- `strs[i]` 只包含小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 双指针, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个函数 $check(s, t)$，用于判断字符串 $s$ 是否是字符串 $t$ 的子序列。我们可以使用双指针的方法，初始化两个指针 $i$ 和 $j$ 分别指向字符串 $s$ 和字符串 $t$ 的开头，然后不断移动指针 $j$，如果 $s[i]$ 和 $t[j]$ 相等，则移动指针 $i$，最后判断 $i$ 是否等于 $s$ 的长度即可。若 $i$ 等于 $s$ 的长度，则说明 $s$ 是 $t$ 的子序列。

判断字符串 $s$ 是否独有，只需要取字符串 $s$ 本身，与字符串列表的其他字符串比较即可。如果存在 $s$ 是其他字符串的子序列，则 $s$ 不是独有的。否则，字符串 $s$ 是独有的。我们取所有独有字符串中长度最长的字符串即可。

时间复杂度 $O(n^2 \times m)$，其中 $n$ 是字符串列表的长度，而 $m$ 是字符串的平均长度。空间复杂度 $O(1)$。

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
// Longest Uncommon Subsequence II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findLUSlength(strs []string) int {
	ans := -1
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
	for i, s := range strs {
		x := len(s)
		for j, t := range strs {
			if i != j && check(s, t) {
				x = -1
				break
			}
		}
		ans = max(ans, x)
	}
	return ans
}
```

### Java

```java
// Longest Uncommon Subsequence II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findLUSlength(String[] strs) {
        int ans = -1;
        int n = strs.length;
        for (int i = 0, j; i < n; ++i) {
            int x = strs[i].length();
            for (j = 0; j < n; ++j) {
                if (i != j && check(strs[i], strs[j])) {
                    x = -1;
                    break;
                }
            }
            ans = Math.max(ans, x);
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
# Longest Uncommon Subsequence II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findLUSlength(self, strs: List[str]) -> int:
        def check(s: str, t: str):
            i = j = 0
            while i < len(s) and j < len(t):
                if s[i] == t[j]:
                    i += 1
                j += 1
            return i == len(s)

        ans = -1
        for i, s in enumerate(strs):
            for j, t in enumerate(strs):
                if i != j and check(s, t):
                    break
            else:
                ans = max(ans, len(s))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

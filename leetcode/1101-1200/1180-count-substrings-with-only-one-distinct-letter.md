# 1180. Count Substrings with Only One Distinct Letter

---
编号: 1180
题目: Count Substrings with Only One Distinct Letter
难度: 简单
标签: [数学, 字符串]
来源链接: https://leetcode.com/problems/count-substrings-with-only-one-distinct-letter/
---

## 题目描述

给你一个字符串 `s`，返回 *只含 **单一字母** 的子串个数* 。

**示例 1：**

```text
输入： s = "aaaba"
输出： 8
解释： 只含单一字母的子串分别是 "aaa"， "aa"， "a"， "b"。
"aaa" 出现 1 次。
"aa" 出现 2 次。
"a" 出现 4 次。
"b" 出现 1 次。
所以答案是 1 + 2 + 4 + 1 = 8。
```

**示例 2:**

```text
输入： s = "aaaaaaaaaa"
输出： 55
```

**提示：**

- `1 <= s.length <= 1000`

- `s[i]` 仅由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用双指针，用指针 $i$ 指向当前子串的起始位置，指针 $j$ 向右移动到第一个与 $s[i]$ 不同的位置，那么 $[i,..j-1]$ 就是以 $s[i]$ 为唯一字母的子串，长度为 $j-i$，那么以 $s[i]$ 为唯一字母的子串的个数就是 $\frac{(j-i+1)(j-i)}{2}$，累加到答案中。然后令 $i=j$，继续遍历，直到 $i$ 超出字符串 $s$ 的范围。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $s$ 的长度。空间复杂度 $O(1)$。

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
// Count Substrings with Only One Distinct Letter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countLetters(s string) int {
	ans := 0
	for i, n := 0, len(s); i < n; {
		j := i
		for j < n && s[j] == s[i] {
			j++
		}
		ans += (1 + j - i) * (j - i) / 2
		i = j
	}
	return ans
}
```

### Java

```java
// Count Substrings with Only One Distinct Letter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int countLetters(String s) {
        int ans = 0;
        for (int i = 0, n = s.length(); i < n;) {
            int j = i;
            while (j < n && s.charAt(j) == s.charAt(i)) {
                ++j;
            }
            ans += (1 + j - i) * (j - i) / 2;
            i = j;
        }
        return ans;
    }
}
```

### Python

```python
# Count Substrings with Only One Distinct Letter：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countLetters(self, s: str) -> int:
        n = len(s)
        i = ans = 0
        while i < n:
            j = i
            while j < n and s[j] == s[i]:
                j += 1
            ans += (1 + j - i) * (j - i) // 2
            i = j
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1400. Construct K Palindrome Strings

---
编号: 1400
题目: Construct K Palindrome Strings
难度: 中等
标签: [贪心, 哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/construct-k-palindrome-strings/
---

## 题目描述

给你一个字符串 `s` 和一个整数 `k` 。请你用 `s` 字符串中 **所有字符** 构造 `k` 个**非空** 回文串 。

如果你可以用 `s` 中所有字符构造 `k` 个回文字符串，那么请你返回 **True** ，否则返回 **False** 。

**示例 1：**

```text
输入：s = "annabelle", k = 2
输出：true
解释：可以用 s 中所有字符构造 2 个回文字符串。
一些可行的构造方案包括："anna" + "elble"，"anbna" + "elle"，"anellena" + "b"
```

**示例 2：**

```text
输入：s = "leetcode", k = 3
输出：false
解释：无法用 s 中所有字符构造 3 个回文串。
```

**示例 3：**

```text
输入：s = "true", k = 4
输出：true
解释：唯一可行的方案是让 s 中每个字符单独构成一个字符串。
```

**提示：**

- `1 <= s.length <= 10^5`

- `s` 中所有字符都是小写英文字母。

- `1 <= k <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先判断字符串 $s$ 的长度是否小于 $k$，如果是，那么一定无法构造出 $k$ 个回文串，可以直接返回 `false`。

否则，我们用一个哈希表或数组 $cnt$ 统计字符串 $s$ 中每个字符出现的次数。最后，我们只需要统计 $cnt$ 中奇数次数的字符个数 $x$，如果 $x$ 大于 $k$，那么一定无法构造出 $k$ 个回文串，返回 `false`；否则，返回 `true`。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 是字符串 $s$ 的长度；而 $C$ 是字符集大小，这里 $C=26$。

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
// Construct K Palindrome Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canConstruct(s string, k int) bool {
	if len(s) < k {
		return false
	}
	cnt := [26]int{}
	for _, c := range s {
		cnt[c-'a']++
	}
	x := 0
	for _, v := range cnt {
		x += v & 1
	}
	return x <= k
}
```

### Java

```java
// Construct K Palindrome Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canConstruct(String s, int k) {
        int n = s.length();
        if (n < k) {
            return false;
        }
        int[] cnt = new int[26];
        for (int i = 0; i < n; ++i) {
            ++cnt[s.charAt(i) - 'a'];
        }
        int x = 0;
        for (int v : cnt) {
            x += v & 1;
        }
        return x <= k;
    }
}
```

### Python

```python
# Construct K Palindrome Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canConstruct(self, s: str, k: int) -> bool:
        if len(s) < k:
            return False
        cnt = Counter(s)
        return sum(v & 1 for v in cnt.values()) <= k
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

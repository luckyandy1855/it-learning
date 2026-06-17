# 1370. Increasing Decreasing String

---
编号: 1370
题目: Increasing Decreasing String
难度: 简单
标签: [哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/increasing-decreasing-string/
---

## 题目描述

给你一个字符串 `s` ，请你根据下面的算法重新构造字符串：

- 从 `s` 中选出 **最小** 的字符，将它 **接在** 结果字符串的后面。

- 从 `s` 剩余字符中选出比上一个添加字符更大的 **最小** 字符，将它 **接在** 结果字符串后面。

- 重复步骤 2 ，直到你没法从 `s` 中选择字符。

- 从 `s` 中选出 **最大** 的字符，将它 **接在** 结果字符串的后面。

- 从 `s` 剩余字符中选出比上一个添加字符更小的 **最大** 字符，将它 **接在** 结果字符串后面。

- 重复步骤 5 ，直到你没法从 `s` 中选择字符。

- 重复步骤 1 到 6 ，直到 `s` 中所有字符都已经被选过。

在任何一步中，如果最小或者最大字符不止一个 ，你可以选择其中任意一个，并将其添加到结果字符串。

请你返回将 `s` 中字符重新排序后的 **结果字符串** 。

**示例 1：**

```text
输入：s = "aaaabbbbcccc"
输出："abccbaabccba"
解释：第一轮的步骤 1，2，3 后，结果字符串为 result = "abc"
第一轮的步骤 4，5，6 后，结果字符串为 result = "abccba"
第一轮结束，现在 s = "aabbcc" ，我们再次回到步骤 1
第二轮的步骤 1，2，3 后，结果字符串为 result = "abccbaabc"
第二轮的步骤 4，5，6 后，结果字符串为 result = "abccbaabccba"
```

**示例 2：**

```text
输入：s = "rat"
输出："art"
解释：单词 "rat" 在上述算法重排序以后变成 "art"
```

**提示：**

- `1 <= s.length <= 500`

- `s` 只包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先用一个哈希表或者一个长度为 $26$ 的数组 $cnt$ 统计字符串 $s$ 中每个字符出现的次数。

然后，我们枚举字母 $[a,...,z]$，对于当前枚举到的字母 $c$，如果 $cnt[c] \gt 0$，我们就将字母 $c$ 接在答案字符串的末尾，并将 $cnt[c]$ 减一。我们重复这一步骤，直到 $cnt[c]=0$。随后我们逆序枚举字母 $[z,...,a]$，执行类似的操作。如果答案字符串的长度等于 $s$ 的长度，那么我们就完成了所有的拼接操作。

时间复杂度 $O(n \times |\Sigma|)$，空间复杂度 $O(|\Sigma|)$。其中 $n$ 是字符串 $s$ 的长度，而 $\Sigma$ 是字符集，本题中字符集为所有小写字母，因此 $|\Sigma|=26$。

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
// Increasing Decreasing String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sortString(s string) string {
	cnt := [26]int{}
	for _, c := range s {
		cnt[c-'a']++
	}
	n := len(s)
	ans := make([]byte, 0, n)
	for len(ans) < n {
		for i := 0; i < 26; i++ {
			if cnt[i] > 0 {
				ans = append(ans, byte(i)+'a')
				cnt[i]--
			}
		}
		for i := 25; i >= 0; i-- {
			if cnt[i] > 0 {
				ans = append(ans, byte(i)+'a')
				cnt[i]--
			}
		}
	}
	return string(ans)
}
```

### Java

```java
// Increasing Decreasing String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String sortString(String s) {
        int[] cnt = new int[26];
        int n = s.length();
        for (int i = 0; i < n; ++i) {
            cnt[s.charAt(i) - 'a']++;
        }
        StringBuilder sb = new StringBuilder();
        while (sb.length() < n) {
            for (int i = 0; i < 26; ++i) {
                if (cnt[i] > 0) {
                    sb.append((char) ('a' + i));
                    --cnt[i];
                }
            }
            for (int i = 25; i >= 0; --i) {
                if (cnt[i] > 0) {
                    sb.append((char) ('a' + i));
                    --cnt[i];
                }
            }
        }
        return sb.toString();
    }
}
```

### Python

```python
# Increasing Decreasing String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sortString(self, s: str) -> str:
        cnt = Counter(s)
        cs = ascii_lowercase + ascii_lowercase[::-1]
        ans = []
        while len(ans) < len(s):
            for c in cs:
                if cnt[c]:
                    ans.append(c)
                    cnt[c] -= 1
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

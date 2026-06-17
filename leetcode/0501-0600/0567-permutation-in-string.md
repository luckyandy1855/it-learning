# 0567. Permutation in String

---
编号: 567
题目: Permutation in String
难度: 中等
标签: [哈希表, 双指针, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/permutation-in-string/
---

## 题目描述

给你两个字符串 `s1` 和 `s2` ，写一个函数来判断 `s2` 是否包含 `s1`** **的 排列。如果是，返回 `true` ；否则，返回 `false` 。

换句话说，`s1` 的排列之一是 `s2` 的 **子串** 。

**示例 1：**

```text
输入：s1 = "ab" s2 = "eidbaooo"
输出：true
解释：s2 包含 s1 的排列之一 ("ba").
```

**示例 2：**

```text
输入：s1= "ab" s2 = "eidboaoo"
输出：false
```

**提示：**

- `1 <= s1.length, s2.length <= 10^4`

- `s1` 和 `s2` 仅包含小写字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 双指针, 字符串, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个数组 $\textit{cnt}$ 记录当前需要匹配的字符及其个数，用一个变量 $\textit{need}$ 记录当前还需要匹配的字符种类数，初始时 $\textit{cnt}$ 为字符串 $\textit{s1}$ 中各字符出现次数，而 $\textit{need}$ 为 $\textit{s1}$ 中不同字符的个数。

然后我们遍历字符串 $\textit{s2}$，对于每个字符，我们将其在 $\textit{cnt}$ 中的对应值减一，如果减一后的值等于 $0$，说明当前字符在 $\textit{s1}$ 中出现次数已经满足要求，我们将 $\textit{need}$ 减一。如果当前下标 $i$ 大于等于 $\textit{s1}$ 的长度，我们需要将 $\textit{s2}[i-\textit{s1}]\textit{cnt}$ 中对应值加一，如果加一后的值等于 $1$，说明当前字符在 $\textit{s1}$ 中出现次数不再满足要求，我们将 $\textit{need}$ 加一。在遍历过程中，如果 $\textit{need}$ 的值等于 $0$，说明所有字符的出现次数都满足要求，我们就找到了一个满足要求的子串，返回 $\text{true}$。

否则，如果遍历结束后没有找到满足要求的子串，我们返回 $\text{false}$。

时间复杂度 $O(m + n)$，其中 $m$ 和 $n$ 分别是字符串 $\textit{s1}$ 和 $\textit{s2}$ 的长度。空间复杂度 $O(|\Sigma|)$，其中 $\Sigma$ 是字符集，这道题中字符集为小写字母，所以空间复杂度是常数级别的。

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
// Permutation in String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func checkInclusion(s1 string, s2 string) bool {
	need := 0
	cnt := [26]int{}

	for _, c := range s1 {
		if cnt[c-'a']++; cnt[c-'a'] == 1 {
			need++
		}
	}

	m, n := len(s1), len(s2)
	for i := 0; i < n; i++ {
		c := s2[i] - 'a'
		if cnt[c]--; cnt[c] == 0 {
			need--
		}
		if i >= m {
			c = s2[i-m] - 'a'
			if cnt[c]++; cnt[c] == 1 {
				need++
			}
		}
		if need == 0 {
			return true
		}
	}
	return false
}
```

### Java

```java
// Permutation in String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int need = 0;
        int[] cnt = new int[26];
        for (char c : s1.toCharArray()) {
            if (++cnt[c - 'a'] == 1) {
                ++need;
            }
        }
        int m = s1.length(), n = s2.length();
        for (int i = 0; i < n; ++i) {
            int c = s2.charAt(i) - 'a';
            if (--cnt[c] == 0) {
                --need;
            }
            if (i >= m) {
                c = s2.charAt(i - m) - 'a';
                if (++cnt[c] == 1) {
                    ++need;
                }
            }
            if (need == 0) {
                return true;
            }
        }
        return false;
    }
}
```

### Python

```python
# Permutation in String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        cnt = Counter(s1)
        need = len(cnt)
        m = len(s1)
        for i, c in enumerate(s2):
            cnt[c] -= 1
            if cnt[c] == 0:
                need -= 1
            if i >= m:
                cnt[s2[i - m]] += 1
                if cnt[s2[i - m]] == 1:
                    need += 1
            if need == 0:
                return True
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

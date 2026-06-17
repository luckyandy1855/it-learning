# 0267. Palindrome Permutation II

---
编号: 267
题目: Palindrome Permutation II
难度: 中等
标签: [哈希表, 字符串, 回溯]
来源链接: https://leetcode.com/problems/palindrome-permutation-ii/
---

## 题目描述

给定一个字符串 `s` ，返回 *其重新排列组合后可能构成的所有回文字符串，并去除重复的组合* 。

你可以按 **任意顺序** 返回答案。如果 `s` 不能形成任何回文排列时，则返回一个空列表。

**示例 1：**

```text
输入: s = "aabb"
输出: ["abba", "baab"]
```

**示例 2：**

```text
输入: s = "abc"
输出: []
```

**提示：**

- `1 <= s.length <= 16`

- `s` 仅由小写英文字母组成

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

回文排列需要满足至多有一个字符出现奇数次数。若不满足条件，答案提前返回。

找到出现奇数次的字符，作为中间字符（可以为空），分别向两边扩展，构造回文串。若串的长度与原串长度相等，将该串添加到答案中。

时间复杂度 $O(n \times \frac{n}{2}!)$。其中 $n$ 为字符串 $s$ 的长度。

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
// Palindrome Permutation II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func generatePalindromes(s string) []string {
	cnt := map[byte]int{}
	for i := range s {
		cnt[s[i]]++
	}
	mid := ""
	ans := []string{}
	for k, v := range cnt {
		if v%2 == 1 {
			if mid != "" {
				return ans
			}
			mid = string(k)
		}
	}
	var dfs func(t string)
	dfs = func(t string) {
		if len(t) == len(s) {
			ans = append(ans, t)
			return
		}
		for k, v := range cnt {
			if v > 1 {
				cnt[k] -= 2
				c := string(k)
				dfs(c + t + c)
				cnt[k] += 2
			}
		}
	}
	dfs(mid)
	return ans
}
```

### Java

```java
import java.util.*;
// Palindrome Permutation II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private List<String> ans = new ArrayList<>();
    private int[] cnt = new int[26];
    private int n;

    public List<String> generatePalindromes(String s) {
        n = s.length();
        for (char c : s.toCharArray()) {
            ++cnt[c - 'a'];
        }
        String mid = "";
        for (int i = 0; i < 26; ++i) {
            if (cnt[i] % 2 == 1) {
                if (!"".equals(mid)) {
                    return ans;
                }
                mid = String.valueOf((char) (i + 'a'));
            }
        }
        dfs(mid);
        return ans;
    }

    private void dfs(String t) {
        if (t.length() == n) {
            ans.add(t);
            return;
        }
        for (int i = 0; i < 26; ++i) {
            if (cnt[i] > 1) {
                String c = String.valueOf((char) (i + 'a'));
                cnt[i] -= 2;
                dfs(c + t + c);
                cnt[i] += 2;
            }
        }
    }
}
```

### Python

```python
# Palindrome Permutation II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def generatePalindromes(self, s: str) -> List[str]:
        def dfs(t):
            if len(t) == len(s):
                ans.append(t)
                return
            for c, v in cnt.items():
                if v > 1:
                    cnt[c] -= 2
                    dfs(c + t + c)
                    cnt[c] += 2

        cnt = Counter(s)
        mid = ''
        for c, v in cnt.items():
            if v & 1:
                if mid:
                    return []
                mid = c
                cnt[c] -= 1
        ans = []
        dfs(mid)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

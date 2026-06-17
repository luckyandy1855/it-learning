# 0916. Word Subsets

---
编号: 916
题目: Word Subsets
难度: 中等
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/word-subsets/
---

## 题目描述

给你两个字符串数组 `words1` 和 `words2`。

现在，如果 `b` 中的每个字母都出现在 `a` 中，**包括重复出现的字母**，那么称字符串 `b` 是字符串 `a` 的 **子集** 。

- 例如，`"wrr"` 是 `"warrior"` 的子集，但不是 `"world"` 的子集。

如果对 `words2` 中的每一个单词 `b`，`b` 都是 `a` 的子集，那么我们称 `words1` 中的单词 `a` 是* ***通用单词*** *。

以数组形式返回 `words1` 中所有的 **通用** 单词。你可以按 **任意顺序** 返回答案。

示例 1：

输入：words1 = ["amazon","apple","facebook","google","leetcode"], words2 = ["e","o"]

输出：["facebook","google","leetcode"]

示例 2：

输入：words1 = ["amazon","apple","facebook","google","leetcode"], words2 = ["lc","eo"]

输出：["leetcode"]

示例 3：

输入：words1 = ["acaac","cccbb","aacbb","caacc","bcbbb"], words2 = ["c","cc","b"]

输出：["cccbb"]

**提示：**

- `1 <= words1.length, words2.length <= 10^4`

- `1 <= words1[i].length, words2[i].length <= 10`

- `words1[i]` 和 `words2[i]` 仅由小写英文字母组成

- `words1` 中的所有字符串 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

遍历 `words2` 中的每个单词 `b`，统计每个字母出现的最大次数，记为 `cnt`。

然后遍历 `words1` 中的每个单词 `a`，统计每个字母出现的次数，记为 `t`。如果 `cnt` 中的每个字母的出现次数都不大于 `t` 中的出现次数，则 `a` 是通用单词，将其加入答案。

时间复杂度 $O(L)$，其中 $L$ 为 `words1` 和 `words2` 中所有单词的长度之和。

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
// Word Subsets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func wordSubsets(words1 []string, words2 []string) (ans []string) {
	cnt := [26]int{}
	for _, b := range words2 {
		t := [26]int{}
		for _, c := range b {
			t[c-'a']++
		}
		for i := range cnt {
			cnt[i] = max(cnt[i], t[i])
		}
	}
	for _, a := range words1 {
		t := [26]int{}
		for _, c := range a {
			t[c-'a']++
		}
		ok := true
		for i, v := range cnt {
			if v > t[i] {
				ok = false
				break
			}
		}
		if ok {
			ans = append(ans, a)
		}
	}
	return
}
```

### Java

```java
// Word Subsets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> wordSubsets(String[] words1, String[] words2) {
        int[] cnt = new int[26];
        for (var b : words2) {
            int[] t = new int[26];
            for (int i = 0; i < b.length(); ++i) {
                t[b.charAt(i) - 'a']++;
            }
            for (int i = 0; i < 26; ++i) {
                cnt[i] = Math.max(cnt[i], t[i]);
            }
        }
        List<String> ans = new ArrayList<>();
        for (var a : words1) {
            int[] t = new int[26];
            for (int i = 0; i < a.length(); ++i) {
                t[a.charAt(i) - 'a']++;
            }
            boolean ok = true;
            for (int i = 0; i < 26; ++i) {
                if (cnt[i] > t[i]) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                ans.add(a);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Word Subsets：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def wordSubsets(self, words1: List[str], words2: List[str]) -> List[str]:
        cnt = Counter()
        for b in words2:
            t = Counter(b)
            for c, v in t.items():
                cnt[c] = max(cnt[c], v)
        ans = []
        for a in words1:
            t = Counter(a)
            if all(v <= t[c] for c, v in cnt.items()):
                ans.append(a)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

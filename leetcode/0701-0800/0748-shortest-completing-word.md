# 0748. Shortest Completing Word

---
编号: 748
题目: Shortest Completing Word
难度: 简单
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/shortest-completing-word/
---

## 题目描述

给你一个字符串 `licensePlate` 和一个字符串数组 `words` ，请你找出 `words` 中的 **最短补全词** 。

**补全词 **是一个包含 `licensePlate` 中所有字母的单词。**忽略** `licensePlate` 中的 **数字和空格 **。**不区分大小写**。如果某个字母在 `licensePlate` 中出现不止一次，那么该字母在补全词中的出现次数应当一致或者更多。

例如：`licensePlate`` = "aBc 12c"`，那么它的补全词应当包含字母 `'a'`、`'b'` （忽略大写）和两个 `'c'` 。可能的 **补全词** 有 `"abccdef"`、`"caaacab"` 以及 `"cbca"` 。

请返回 `words` 中的 **最短补全词** 。题目数据保证一定存在一个最短补全词。当有多个单词都符合最短补全词的匹配条件时取 `words` 中 **第一个** 出现的那个。

**示例 1：**

```text
输入：licensePlate = "1s3 PSt", words = ["step", "steps", "stripe", "stepple"]
输出："steps"
解释：最短补全词应该包括 "s"、"p"、"s"（忽略大小写） 以及 "t"。
"step" 包含 "t"、"p"，但只包含一个 "s"，所以它不符合条件。
"steps" 包含 "t"、"p" 和两个 "s"。
"stripe" 缺一个 "s"。
"stepple" 缺一个 "s"。
因此，"steps" 是唯一一个包含所有字母的单词，也是本例的答案。
```

**示例 2：**

```text
输入：licensePlate = "1s3 456", words = ["looks", "pest", "stew", "show"]
输出："pest"
解释：licensePlate 只包含字母 "s" 。所有的单词都包含字母 "s" ，其中 "pest"、"stew"、和 "show" 三者最短。答案是 "pest" ，因为它是三个单词中在 words 里最靠前的那个。
```

**提示：**

- `1 <= licensePlate.length <= 7`

- `licensePlate` 由数字、大小写字母或空格 `' '` 组成

- `1 <= words.length <= 1000`

- `1 <= words[i].length <= 15`

- `words[i]` 由小写英文字母组成

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

我们先用哈希表或者一个长度为 $26$ 的数组 $cnt$ 统计字符串 `licensePlate` 中每个字母出现的次数，注意这里我们统一将字母转换为小写进行计数。

然后，我们遍历数组 `words` 中的每个单词 $w$，如果单词 $w$ 的长度比答案 $ans$ 的长度长，那么我们直接跳过该单词。否则，我们再用哈希表或者一个长度为 $26$ 的数组 $t$ 统计单词 $w$ 中每个字母出现的次数。如果对于任意一个字母，$t$ 中该字母出现的次数小于 $cnt$ 中该字母出现的次数，那么我们也可以直接跳过该单词。否则，我们就找到了一个满足条件的单词，我们更新答案 $ans$ 为当前单词 $w$。

时间复杂度 $O(n \times |\Sigma|)$，空间复杂度 $O(|\Sigma|)$，其中 $n$ 是数组 `words` 的长度，而 $\Sigma$ 是字符集，这里字符集为所有小写字母，因此 $|\Sigma| = 26$。

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
// Shortest Completing Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestCompletingWord(licensePlate string, words []string) (ans string) {
	cnt := [26]int{}
	for _, c := range licensePlate {
		if unicode.IsLetter(c) {
			cnt[unicode.ToLower(c)-'a']++
		}
	}
	for _, w := range words {
		if len(ans) > 0 && len(ans) <= len(w) {
			continue
		}
		t := [26]int{}
		for _, c := range w {
			t[c-'a']++
		}
		ok := true
		for i, v := range cnt {
			if t[i] < v {
				ok = false
				break
			}
		}
		if ok {
			ans = w
		}
	}
	return
}
```

### Java

```java
// Shortest Completing Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String shortestCompletingWord(String licensePlate, String[] words) {
        int[] cnt = new int[26];
        for (int i = 0; i < licensePlate.length(); ++i) {
            char c = licensePlate.charAt(i);
            if (Character.isLetter(c)) {
                cnt[Character.toLowerCase(c) - 'a']++;
            }
        }
        String ans = "";
        for (String w : words) {
            if (!ans.isEmpty() && w.length() >= ans.length()) {
                continue;
            }
            int[] t = new int[26];
            for (int i = 0; i < w.length(); ++i) {
                t[w.charAt(i) - 'a']++;
            }
            boolean ok = true;
            for (int i = 0; i < 26; ++i) {
                if (t[i] < cnt[i]) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                ans = w;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Shortest Completing Word：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestCompletingWord(self, licensePlate: str, words: List[str]) -> str:
        cnt = Counter(c.lower() for c in licensePlate if c.isalpha())
        ans = None
        for w in words:
            if ans and len(w) >= len(ans):
                continue
            t = Counter(w)
            if all(v <= t[c] for c, v in cnt.items()):
                ans = w
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

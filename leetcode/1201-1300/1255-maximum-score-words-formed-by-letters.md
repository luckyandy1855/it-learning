# 1255. Maximum Score Words Formed by Letters

---
编号: 1255
题目: Maximum Score Words Formed by Letters
难度: 困难
标签: [位运算, 数组, 哈希表, 字符串, 动态规划, 回溯, 位掩码, 计数]
来源链接: https://leetcode.com/problems/maximum-score-words-formed-by-letters/
---

## 题目描述

你将会得到一份单词表 `words`，一个字母表 `letters` （可能会有重复字母），以及每个字母对应的得分情况表 `score`。

请你帮忙计算玩家在单词拼写游戏中所能获得的「最高得分」：能够由 `letters` 里的字母拼写出的 **任意** 属于 `words` 单词子集中，分数最高的单词集合的得分。

单词拼写游戏的规则概述如下：

- 玩家需要用字母表 `letters` 里的字母来拼写单词表 `words` 中的单词。

- 可以只使用字母表 `letters` 中的部分字母，但是每个字母最多被使用一次。

- 单词表 `words` 中每个单词只能计分（使用）一次。

- 根据字母得分情况表`score`，字母 `&#39;a&#39;`, `&#39;b&#39;`, `&#39;c&#39;`, ... , `&#39;z&#39;` 对应的得分分别为 `score[0]`, `score[1]`, ..., `score[25]`。

- 本场游戏的「得分」是指：玩家所拼写出的单词集合里包含的所有字母的得分之和。

**示例 1：**

```text
输入：words = ["dog","cat","dad","good"], letters = ["a","a","c","d","d","d","g","o","o"], score = [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]
输出：23
解释：
字母得分为  a=1, c=9, d=5, g=3, o=2
使用给定的字母表 letters，我们可以拼写单词 "dad" (5+1+5)和 "good" (3+2+2+5)，得分为 23 。
而单词 "dad" 和 "dog" 只能得到 21 分。
```

**示例 2：**

```text
输入：words = ["xxxz","ax","bx","cx"], letters = ["z","a","b","c","x","x","x"], score = [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,10]
输出：27
解释：
字母得分为  a=4, b=4, c=4, x=5, z=10
使用给定的字母表 letters，我们可以组成单词 "ax" (4+5)， "bx" (4+5) 和 "cx" (4+5) ，总得分为 27 。
单词 "xxxz" 的得分仅为 25 。
```

**示例 3：**

```text
输入：words = ["leetcode"], letters = ["l","e","t","c","o","d"], score = [0,0,1,1,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0]
输出：0
解释：
字母 "e" 在字母表 letters 中只出现了一次，所以无法组成单词表 words 中的单词。
```

**提示：**

- `1 <= words.length <= 14`

- `1 <= words[i].length <= 15`

- `1 <= letters.length <= 100`

- `letters[i].length == 1`

- `score.length == 26`

- `0 <= score[i] <= 10`

- `words[i]` 和 `letters[i]` 只包含小写的英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 哈希表, 字符串, 动态规划, 回溯, 位掩码, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到题目的数据范围不大，因此对于给定的单词表，我们可以使用二进制枚举的方法，枚举出所有的单词组合，然后判断每个单词组合是否满足题目要求，如果满足则计算其得分，最后取得分最大的单词组合。

我们首先用哈希表或数组 $cnt$ 记录字母表 $letters$ 中每个字母出现的次数。

接下来，我们使用二进制枚举的方法，枚举出所有的单词组合。二进制的每一位表示单词表中的每一个单词是否被选中，如果第 $i$ 位为 $1$，则表示第 $i$ 个单词被选中，否则表示第 $i$ 个单词没有被选中。

然后我们统计当前单词组合中每个字母出现的次数，记录在哈希表或数组 $cur$ 中。如果 $cur$ 中的每个字母的出现次数都不大于 $cnt$ 中的对应字母的出现次数，则说明当前单词组合满足题目要求，我们计算当前单词组合的得分，取得分最大的单词组合。

时间复杂度 $(2^n \times n \times M)$，空间复杂度 $O(C)$。其中 $n$ 和 $M$ 分别为单词集合中单词的个数和单词的最大长度；而 $C$ 为字母表中字母的个数，本题中 $C=26$。

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
// Maximum Score Words Formed by Letters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxScoreWords(words []string, letters []byte, score []int) (ans int) {
	cnt := [26]int{}
	for _, c := range letters {
		cnt[c-'a']++
	}
	n := len(words)
	for i := 0; i < 1<<n; i++ {
		cur := [26]int{}
		for j := 0; j < n; j++ {
			if i>>j&1 == 1 {
				for _, c := range words[j] {
					cur[c-'a']++
				}
			}
		}
		ok := true
		t := 0
		for i, v := range cur {
			if v > cnt[i] {
				ok = false
				break
			}
			t += v * score[i]
		}
		if ok && ans < t {
			ans = t
		}
	}
	return
}
```

### Java

```java
// Maximum Score Words Formed by Letters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxScoreWords(String[] words, char[] letters, int[] score) {
        int[] cnt = new int[26];
        for (int i = 0; i < letters.length; ++i) {
            cnt[letters[i] - 'a']++;
        }
        int n = words.length;
        int ans = 0;
        for (int i = 0; i < 1 << n; ++i) {
            int[] cur = new int[26];
            for (int j = 0; j < n; ++j) {
                if (((i >> j) & 1) == 1) {
                    for (int k = 0; k < words[j].length(); ++k) {
                        cur[words[j].charAt(k) - 'a']++;
                    }
                }
            }
            boolean ok = true;
            int t = 0;
            for (int j = 0; j < 26; ++j) {
                if (cur[j] > cnt[j]) {
                    ok = false;
                    break;
                }
                t += cur[j] * score[j];
            }
            if (ok && ans < t) {
                ans = t;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Score Words Formed by Letters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxScoreWords(
        self, words: List[str], letters: List[str], score: List[int]
    ) -> int:
        cnt = Counter(letters)
        n = len(words)
        ans = 0
        for i in range(1 << n):
            cur = Counter(''.join([words[j] for j in range(n) if i >> j & 1]))
            if all(v <= cnt[c] for c, v in cur.items()):
                t = sum(v * score[ord(c) - ord('a')] for c, v in cur.items())
                ans = max(ans, t)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

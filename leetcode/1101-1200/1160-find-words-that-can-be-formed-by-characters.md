# 1160. Find Words That Can Be Formed by Characters

---
编号: 1160
题目: Find Words That Can Be Formed by Characters
难度: 简单
标签: [数组, 哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/find-words-that-can-be-formed-by-characters/
---

## 题目描述

给定一个字符串数组 `words` 和一个字符串 `chars`。

如果字符串可以由 `chars` 中的字符组成（每个字符在 **每个** `words` 中只能使用一次），则认为它是好的。

返回 `words` 中所有好的字符串的长度之和。

**示例 1：**

```text
输入：words = ["cat","bt","hat","tree"], chars = "atach"
输出：6
解释：
可以形成字符串 "cat" 和 "hat"，所以答案是 3 + 3 = 6。
```

**示例 2：**

```text
输入：words = ["hello","world","leetcode"], chars = "welldonehoneyr"
输出：10
解释：
可以形成字符串 "hello" 和 "world"，所以答案是 5 + 5 = 10。
```

**提示：**

- `1 <= words.length <= 1000`

- `1 <= words[i].length, chars.length <= 100`

- `words[i]` 和 `chars` 中都仅包含小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个长度为 $26$ 的数组 $cnt$ 统计字符串 $chars$ 中每个字母出现的次数。

然后遍历字符串数组 $words$，对于每个字符串 $w$，我们用一个长度为 $26$ 的数组 $wc$ 统计字符串 $w$ 中每个字母出现的次数，如果对于每个字母 $c$，$wc[c] \leq cnt[c]$，那么我们就可以用 $chars$ 中的字母拼写出字符串 $w$，否则我们无法拼写出字符串 $w$。如果可以拼写出字符串 $w$，那么我们就将字符串 $w$ 的长度加到答案中。

遍历结束后，即可得到答案。

时间复杂度 $(L)$，空间复杂度 $O(C)$。其中 $L$ 为题目中所有字符串的长度之和；而 $C$ 为字符集的大小，本题中 $C = 26$。

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
// Find Words That Can Be Formed by Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countCharacters(words []string, chars string) (ans int) {
	cnt := [26]int{}
	for _, c := range chars {
		cnt[c-'a']++
	}
	for _, w := range words {
		wc := [26]int{}
		ok := true
		for _, c := range w {
			c -= 'a'
			wc[c]++
			if wc[c] > cnt[c] {
				ok = false
				break
			}
		}
		if ok {
			ans += len(w)
		}
	}
	return
}
```

### Java

```java
// Find Words That Can Be Formed by Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int countCharacters(String[] words, String chars) {
        int[] cnt = new int[26];
        for (int i = 0; i < chars.length(); ++i) {
            ++cnt[chars.charAt(i) - 'a'];
        }
        int ans = 0;
        for (String w : words) {
            int[] wc = new int[26];
            boolean ok = true;
            for (int i = 0; i < w.length(); ++i) {
                int j = w.charAt(i) - 'a';
                if (++wc[j] > cnt[j]) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                ans += w.length();
            }
        }
        return ans;
    }
}
```

### Python

```python
# Find Words That Can Be Formed by Characters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countCharacters(self, words: List[str], chars: str) -> int:
        cnt = Counter(chars)
        ans = 0
        for w in words:
            wc = Counter(w)
            if all(cnt[c] >= v for c, v in wc.items()):
                ans += len(w)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

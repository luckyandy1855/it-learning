# 1178. Number of Valid Words for Each Puzzle

---
编号: 1178
题目: Number of Valid Words for Each Puzzle
难度: 困难
标签: [位运算, 字典树, 数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/number-of-valid-words-for-each-puzzle/
---

## 题目描述

外国友人仿照中国字谜设计了一个英文版猜字谜小游戏，请你来猜猜看吧。

字谜的迷面 `puzzle` 按字符串形式给出，如果一个单词 `word` 符合下面两个条件，那么它就可以算作谜底：

- 单词 `word` 中包含谜面 `puzzle` 的第一个字母。

- 单词 `word` 中的每一个字母都可以在谜面 `puzzle` 中找到。

	例如，如果字谜的谜面是 "abcdefg"，那么可以作为谜底的单词有 "faced", "cabbage", 和 "baggage"；而 "beefed"（不含字母 "a"）以及 "based"（其中的 "s" 没有出现在谜面中）都不能作为谜底。

返回一个答案数组 `answer`，数组中的每个元素 `answer[i]` 是在给出的单词列表 `words` 中可以作为字谜迷面 `puzzles[i]` 所对应的谜底的单词数目。

**示例：**

```text
输入：
words = ["aaaa","asas","able","ability","actt","actor","access"],
puzzles = ["aboveyz","abrodyz","abslute","absoryz","actresz","gaswxyz"]
输出：[1,1,3,2,4,0]
解释：
1 个单词可以作为 "aboveyz" 的谜底 : "aaaa"
1 个单词可以作为 "abrodyz" 的谜底 : "aaaa"
3 个单词可以作为 "abslute" 的谜底 : "aaaa", "asas", "able"
2 个单词可以作为 "absoryz" 的谜底 : "aaaa", "asas"
4 个单词可以作为 "actresz" 的谜底 : "aaaa", "asas", "actt", "access"
没有单词可以作为 "gaswxyz" 的谜底，因为列表中的单词都不含字母 'g'。
```

**提示：**

- `1 <= words.length <= 10^5`

- `4 <= words[i].length <= 50`

- `1 <= puzzles.length <= 10^4`

- `puzzles[i].length == 7`

- `words[i][j]`, `puzzles[i][j]` 都是小写英文字母。

- 每个 `puzzles[i]` 所包含的字符都不重复。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 字典树, 数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，对于字谜数组 $puzzles$ 中的每一个字谜 $p$，我们需要统计有多少个单词 $w$ 包含了字谜 $p$ 的第一个字母，且 $w$ 的每一个字母都可以在 $p$ 中找到。

由于每个单词重复的字母只需要统计一次，因此，我们可以使用二进制状态压缩的方法，将每个单词 $w$ 转换成一个二进制数 $mask$，其中 $mask$ 的第 $i$ 位为 $1$，当且仅当字母 $i$ 在单词 $w$ 中出现过。我们用哈希表 $cnt$ 统计所有单词的状态压缩后的值出现的次数。

接下来，遍历字谜数组 $puzzles$，对于每一个字谜 $p$，我们注意到其长度固定为 $7$，因此我们只需要枚举 $p$ 的子集，如果该子集包含 $p$ 的第一个字母，那么我们查找其在哈希表中对应的值并累加到当前字谜的答案中。

遍历结束后，我们就可以得到字谜数组 $puzzles$ 中每个字谜对应的谜底数量，将其返回即可。

时间复杂度 $O(m \times |w| + n \times 2^{|p|})$，空间复杂度 $O(m)$。其中 $m$ 和 $n$ 分别为数组 $words$ 和 $puzzles$ 的长度，而 $|w|$ 和 $|p|$ 分别为数组 $words$ 中单词的最大长度和数组 $puzzles$ 中字谜的长度。

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
// Number of Valid Words for Each Puzzle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findNumOfValidWords(words []string, puzzles []string) (ans []int) {
	cnt := map[int]int{}
	for _, w := range words {
		mask := 0
		for _, c := range w {
			mask |= 1 << (c - 'a')
		}
		cnt[mask]++
	}
	for _, p := range puzzles {
		mask := 0
		for _, c := range p {
			mask |= 1 << (c - 'a')
		}
		x, i := 0, p[0]-'a'
		for j := mask; j > 0; j = (j - 1) & mask {
			if j>>i&1 > 0 {
				x += cnt[j]
			}
		}
		ans = append(ans, x)
	}
	return
}
```

### Java

```java
// Number of Valid Words for Each Puzzle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> findNumOfValidWords(String[] words, String[] puzzles) {
        Map<Integer, Integer> cnt = new HashMap<>(words.length);
        for (var w : words) {
            int mask = 0;
            for (int i = 0; i < w.length(); ++i) {
                mask |= 1 << (w.charAt(i) - 'a');
            }
            cnt.merge(mask, 1, Integer::sum);
        }
        List<Integer> ans = new ArrayList<>();
        for (var p : puzzles) {
            int mask = 0;
            for (int i = 0; i < p.length(); ++i) {
                mask |= 1 << (p.charAt(i) - 'a');
            }
            int x = 0;
            int i = p.charAt(0) - 'a';
            for (int j = mask; j > 0; j = (j - 1) & mask) {
                if ((j >> i & 1) == 1) {
                    x += cnt.getOrDefault(j, 0);
                }
            }
            ans.add(x);
        }
        return ans;
    }
}
```

### Python

```python
# Number of Valid Words for Each Puzzle：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findNumOfValidWords(self, words: List[str], puzzles: List[str]) -> List[int]:
        cnt = Counter()
        for w in words:
            mask = 0
            for c in w:
                mask |= 1 << (ord(c) - ord("a"))
            cnt[mask] += 1

        ans = []
        for p in puzzles:
            mask = 0
            for c in p:
                mask |= 1 << (ord(c) - ord("a"))
            x, i, j = 0, ord(p[0]) - ord("a"), mask
            while j:
                if j >> i & 1:
                    x += cnt[j]
                j = (j - 1) & mask
            ans.append(x)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

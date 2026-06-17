# 1181. Before and After Puzzle

---
编号: 1181
题目: Before and After Puzzle
难度: 中等
标签: [数组, 哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/before-and-after-puzzle/
---

## 题目描述

给你一个「短语」列表 `phrases`，请你帮忙按规则生成拼接后的「新短语」列表。

「短语」（phrase）是仅由小写英文字母和空格组成的字符串。「短语」的开头和结尾都不会出现空格，「短语」中的空格不会连续出现。

「前后拼接」（Before and After puzzles）是合并两个「短语」形成「新短语」的方法。我们规定拼接时，**第一个短语的最后一个单词** 和 **第二个短语的第一个单词** 必须相同。

返回每两个「短语」 `phrases[i]` 和 `phrases[j]`（`i != j`）进行「前后拼接」得到的「新短语」。

注意，两个「短语」拼接时的顺序也很重要，我们需要同时考虑这两个「短语」。另外，同一个「短语」可以多次参与拼接，但「新短语」不能再参与拼接。

请你按字典序排列并返回「新短语」列表，列表中的字符串应该是 **不重复的** 。

**示例 1：**

**输入：**phrases = ["writing code","code rocks"]

**输出：**["writing code rocks"]

**示例 2：**

**输入：**phrases = ["mission statement", "a quick bite to eat",   "a chip off the old block",   "chocolate bar",   "mission impossible",   "a man on a mission",   "block party",   "eat my words",   "bar of soap"]

**输出：**["a chip off the old block party",   "a man on a mission impossible",   "a man on a mission statement",   "a quick bite to eat my words", "chocolate bar of soap"]

**示例 3：**

**输入：**phrases = ["a","b","a"]

**输出：**["a"]

示例 4：

输入：phrases = ["ab ba","ba ab","ab ba"]

输出：["ab ba ab","ba ab ba"]

**提示：**

- `1 <= phrases.length <= 100`

- `1 <= phrases[i].length <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先遍历列表 `phrases`，将每个短语的首尾单词存储数组 $ps$ 中，其中 $ps[i][0]$ 和 $ps[i][1]$ 分别表示第 $i$ 个短语的首尾单词。

接下来，我们枚举所有 $(i, j)$，其中 $i, j \in [0, n)$ 且 $i \neq j$。如果 $ps[i][1] = ps[j][0]$，那么我们就可以将第 $i$ 个短语和第 $j$ 个短语进行拼接，得到的新短语为 $phrases[i] + phrases[j][len(ps[j][0]):]$，将新短语加入哈希表 $s$ 中。

最后，我们将哈希表 $s$ 转化为数组并排序，即可得到答案。

时间复杂度 $O(n^2 \times m \times (\log n + \log m))$，空间复杂度 $O(n^2 \times m)$。其中 $n$ 和 $m$ 分别表示数组 $phrases$ 的长度和每个短语的平均长度。

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
// Before and After Puzzle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func beforeAndAfterPuzzles(phrases []string) []string {
	n := len(phrases)
	ps := make([][2]string, n)
	for i, p := range phrases {
		ws := strings.Split(p, " ")
		ps[i] = [2]string{ws[0], ws[len(ws)-1]}
	}
	s := map[string]bool{}
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			if i != j && ps[i][1] == ps[j][0] {
				s[phrases[i]+phrases[j][len(ps[j][0]):]] = true
			}
		}
	}
	ans := make([]string, 0, len(s))
	for k := range s {
		ans = append(ans, k)
	}
	sort.Strings(ans)
	return ans
}
```

### Java

```java
// Before and After Puzzle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> beforeAndAfterPuzzles(String[] phrases) {
        int n = phrases.length;
        var ps = new String[n][];
        for (int i = 0; i < n; ++i) {
            var ws = phrases[i].split(" ");
            ps[i] = new String[] {ws[0], ws[ws.length - 1]};
        }
        Set<String> s = new HashSet<>();
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (i != j && ps[i][1].equals(ps[j][0])) {
                    s.add(phrases[i] + phrases[j].substring(ps[j][0].length()));
                }
            }
        }
        var ans = new ArrayList<>(s);
        Collections.sort(ans);
        return ans;
    }
}
```

### Python

```python
# Before and After Puzzle：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def beforeAndAfterPuzzles(self, phrases: List[str]) -> List[str]:
        ps = []
        for p in phrases:
            ws = p.split()
            ps.append((ws[0], ws[-1]))
        n = len(ps)
        ans = []
        for i in range(n):
            for j in range(n):
                if i != j and ps[i][1] == ps[j][0]:
                    ans.append(phrases[i] + phrases[j][len(ps[j][0]) :])
        return sorted(set(ans))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

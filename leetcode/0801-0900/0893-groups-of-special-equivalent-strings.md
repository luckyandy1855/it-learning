# 0893. Groups of Special-Equivalent Strings

---
编号: 893
题目: Groups of Special-Equivalent Strings
难度: 中等
标签: [数组, 哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/groups-of-special-equivalent-strings/
---

## 题目描述

给你一个字符串数组 `words`。

一步操作中，你可以交换字符串 `words[i]` 的任意两个偶数下标对应的字符或任意两个奇数下标对应的字符。

对两个字符串 `words[i]` 和 `words[j]` 而言，如果经过任意次数的操作，`words[i] == words[j]` ，那么这两个字符串是 **特殊等价 **的。

- 例如，`words[i] = "zzxy"` 和 `words[j] = "xyzz"` 是一对 **特殊等价** 字符串，因为可以按 `"zzxy" -> "xzzy" -> "xyzz"` 的操作路径使 `words[i] == words[j]` 。

现在规定，**`words` **的 **一组特殊等价字符串 **就是 `words` 的一个同时满足下述条件的非空子集：

- 该组中的每一对字符串都是** 特殊等价 **的

- 该组字符串已经涵盖了该类别中的所有特殊等价字符串，容量达到理论上的最大值（也就是说，如果一个字符串不在该组中，那么这个字符串就 **不会** 与该组内任何字符串特殊等价）

返回 `words` 中 **特殊等价字符串组** 的数量。

**示例 1：**

```text
输入：words = ["abcd","cdab","cbad","xyzz","zzxy","zzyx"]
输出：3
解释：
其中一组为 ["abcd", "cdab", "cbad"]，因为它们是成对的特殊等价字符串，且没有其他字符串与这些字符串特殊等价。
另外两组分别是 ["xyzz", "zzxy"] 和 ["zzyx"]。特别需要注意的是，"zzxy" 不与 "zzyx" 特殊等价。
```

**示例 2：**

```text
输入：words = ["abc","acb","bac","bca","cab","cba"]
输出：3
解释：3 组 ["abc","cba"]，["acb","bca"]，["bac","cab"]
```

**提示：**

- `1 <= words.length <= 1000`

- `1 <= words[i].length <= 20`

- 所有 `words[i]` 都只由小写字母组成。

- 所有 `words[i]` 都具有相同的长度。

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

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Groups of Special-Equivalent Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numSpecialEquivGroups(words []string) int {
	s := map[string]bool{}
	for _, word := range words {
		a, b := []rune{}, []rune{}
		for i, c := range word {
			if i&1 == 1 {
				a = append(a, c)
			} else {
				b = append(b, c)
			}
		}
		sort.Slice(a, func(i, j int) bool {
			return a[i] < a[j]
		})
		sort.Slice(b, func(i, j int) bool {
			return b[i] < b[j]
		})
		s[string(a)+string(b)] = true
	}
	return len(s)
}
```

### Java

```java
// Groups of Special-Equivalent Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numSpecialEquivGroups(String[] words) {
        Set<String> s = new HashSet<>();
        for (String word : words) {
            s.add(convert(word));
        }
        return s.size();
    }

    private String convert(String word) {
        List<Character> a = new ArrayList<>();
        List<Character> b = new ArrayList<>();
        for (int i = 0; i < word.length(); ++i) {
            char ch = word.charAt(i);
            if (i % 2 == 0) {
                a.add(ch);
            } else {
                b.add(ch);
            }
        }
        Collections.sort(a);
        Collections.sort(b);
        StringBuilder sb = new StringBuilder();
        for (char c : a) {
            sb.append(c);
        }
        for (char c : b) {
            sb.append(c);
        }
        return sb.toString();
    }
}
```

### Python

```python
# Groups of Special-Equivalent Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numSpecialEquivGroups(self, words: List[str]) -> int:
        s = {''.join(sorted(word[::2]) + sorted(word[1::2])) for word in words}
        return len(s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

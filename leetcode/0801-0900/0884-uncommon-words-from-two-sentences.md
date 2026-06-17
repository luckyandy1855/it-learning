# 0884. Uncommon Words from Two Sentences

---
编号: 884
题目: Uncommon Words from Two Sentences
难度: 简单
标签: [哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/uncommon-words-from-two-sentences/
---

## 题目描述

**句子** 是一串由空格分隔的单词。每个 **单词*** *仅由小写字母组成。

如果某个单词在其中一个句子中恰好出现一次，在另一个句子中却 **没有出现** ，那么这个单词就是 **不常见的*** *。

给你两个 **句子** `s1` 和 `s2` ，返回所有 **不常用单词** 的列表。返回列表中单词可以按 **任意顺序** 组织。

**示例 1：**

```text
输入：s1 = "this apple is sweet", s2 = "this apple is sour"
输出：["sweet","sour"]
```

**示例 2：**

```text
输入：s1 = "apple apple", s2 = "banana"
输出：["banana"]
```

**提示：**

- `1 <= s1.length, s2.length <= 200`

- `s1` 和 `s2` 由小写英文字母和空格组成

- `s1` 和 `s2` 都不含前导或尾随空格

- `s1` 和 `s2` 中的所有单词间均由单个空格分隔

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

根据题目描述，只要单词出现一次，就符合题目要求。因此，我们用哈希表 $cnt$ 记录所有单词以及出现的次数。

然后遍历哈希表，取出所有出现次数为 $1$ 的字符串即可。

时间复杂度 $O(m + n)$，空间复杂度 $O(m + n)$。其中 $m$ 和 $n$ 分别是字符串 $s1$ 和 $s2$ 的长度。

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
// Uncommon Words from Two Sentences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func uncommonFromSentences(s1 string, s2 string) (ans []string) {
	cnt := map[string]int{}
	for _, s := range strings.Split(s1, " ") {
		cnt[s]++
	}
	for _, s := range strings.Split(s2, " ") {
		cnt[s]++
	}
	for s, v := range cnt {
		if v == 1 {
			ans = append(ans, s)
		}
	}
	return
}
```

### Java

```java
// Uncommon Words from Two Sentences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String[] uncommonFromSentences(String s1, String s2) {
        Map<String, Integer> cnt = new HashMap<>();
        for (String s : s1.split(" ")) {
            cnt.merge(s, 1, Integer::sum);
        }
        for (String s : s2.split(" ")) {
            cnt.merge(s, 1, Integer::sum);
        }
        List<String> ans = new ArrayList<>();
        for (var e : cnt.entrySet()) {
            if (e.getValue() == 1) {
                ans.add(e.getKey());
            }
        }
        return ans.toArray(new String[0]);
    }
}
```

### Python

```python
# Uncommon Words from Two Sentences：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def uncommonFromSentences(self, s1: str, s2: str) -> List[str]:
        cnt = Counter(s1.split()) + Counter(s2.split())
        return [s for s, v in cnt.items() if v == 1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0791. Custom Sort String

---
编号: 791
题目: Custom Sort String
难度: 中等
标签: [哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/custom-sort-string/
---

## 题目描述

给定两个字符串 `order` 和 `s` 。`order` 的所有字母都是 **唯一** 的，并且预先按照一些自定义的顺序排序。

对 `s` 的字符进行置换，使其与排序的 `order` 相匹配。更具体地说，如果在 `order` 中的字符 `x` 出现字符 `y` 之前，那么在排列后的字符串中， `x` 也应该出现在 `y` 之前。

返回 *满足这个性质的 `s` 的任意一种排列 *。

示例 1：

**输入：**  order = "cba", s = "abcd"

**输出：**  "cbad"

**解释：** `"a"`，`"b"`，`"c"` 在 `order` 中出现，所以 `"a"`，`"b"`，`"c"` 的顺序应该是 `"c"`，`"b"`，和 `"a"`。

由于 `"d"` 没有在 `order` 中出现，它可以在返回字符串的任意位置。`"dcba"`，`"cdba"`，`"cbda"` 也是合法的输出。

示例 2：

**输入：**  order = "bcafg", s = "abcd"

**输出：**  "bcad"

**解释：**`order`** **中的字符 `"b"`、`"c"` 和 `"a"` 决定了 `s` 中字符的顺序。`s` 中的字符 `"d"` 没有出现在 `order` 中，因此其位置是可变的。

按照 `order` 中的出现顺序，`"b"`、`"c"` 和 `"a"` 应该按 `"b"`、`"c"`、`"a"` 的顺序排列。`"d"` 可以放在任何位置，因为它不受顺序限制。输出 `"bcad"` 正确遵循了这一规则。其他排列如 `"dbca"` 或 `"bcda"` 也是合法的，只要 `"b"`、`"c"`、`"a"` 的顺序保持不变。

**提示:**

- `1 <= order.length <= 26`

- `1 <= s.length <= 200`

- `order` 和 `s` 由小写英文字母组成

- `order` 中的所有字符都 **不同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

一种比较直接的思路是，用哈希表或数组 $d$ 记录字符串 $order$ 中每个字符的位置，然后对字符串 $s$ 中每个字符按照其在 $d$ 中的位置进行排序。如果某个字符不在 $d$ 中，我们可以将其位置置为 $0$。

时间复杂度 $O(m + n\times \log n)$，空间复杂度 $O(m)$。其中 $m$ 和 $n$ 分别是字符串 $order$ 和 $s$ 的长度。

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
// Custom Sort String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func customSortString(order string, s string) string {
	d := [26]int{}
	for i := range order {
		d[order[i]-'a'] = i
	}
	cs := []byte(s)
	sort.Slice(cs, func(i, j int) bool { return d[cs[i]-'a'] < d[cs[j]-'a'] })
	return string(cs)
}
```

### Java

```java
// Custom Sort String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String customSortString(String order, String s) {
        int[] d = new int[26];
        for (int i = 0; i < order.length(); ++i) {
            d[order.charAt(i) - 'a'] = i;
        }
        List<Character> cs = new ArrayList<>();
        for (int i = 0; i < s.length(); ++i) {
            cs.add(s.charAt(i));
        }
        cs.sort((a, b) -> d[a - 'a'] - d[b - 'a']);
        return cs.stream().map(String::valueOf).collect(Collectors.joining());
    }
}
```

### Python

```python
# Custom Sort String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def customSortString(self, order: str, s: str) -> str:
        d = {c: i for i, c in enumerate(order)}
        return ''.join(sorted(s, key=lambda x: d.get(x, 0)))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

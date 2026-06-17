# 0806. Number of Lines To Write String

---
编号: 806
题目: Number of Lines To Write String
难度: 简单
标签: [数组, 字符串]
来源链接: https://leetcode.com/problems/number-of-lines-to-write-string/
---

## 题目描述

我们要把给定的字符串 `S` 从左到右写到每一行上，每一行的最大宽度为100个单位，如果我们在写某个字母的时候会使这行超过了100 个单位，那么我们应该把这个字母写到下一行。我们给定了一个数组 `widths` ，这个数组 widths[0] 代表 &#39;a&#39; 需要的单位， widths[1] 代表 &#39;b&#39; 需要的单位，...， widths[25] 代表 &#39;z&#39; 需要的单位。

现在回答两个问题：至少多少行能放下`S`，以及最后一行使用的宽度是多少个单位？将你的答案作为长度为2的整数列表返回。

```text
示例 1:
输入:
widths = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
S = "abcdefghijklmnopqrstuvwxyz"
输出: [3, 60]
解释:
所有的字符拥有相同的占用单位10。所以书写所有的26个字母，
我们需要2个整行和占用60个单位的一行。
```

```text
示例 2:
输入:
widths = [4,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
S = "bbbcccdddaaa"
输出: [2, 4]
解释:
除去字母&#39;a&#39;所有的字符都是相同的单位10，并且字符串 "bbbcccdddaa" 将会覆盖 9 * 10 + 2 * 4 = 98 个单位.
最后一个字母 &#39;a&#39; 将会被写到第二行，因为第一行只剩下2个单位了。
所以，这个答案是2行，第二行有4个单位宽度。
```

**注:**

- 字符串 `S` 的长度在 [1, 1000] 的范围。

- `S` 只包含小写字母。

- `widths` 是长度为 `26`的数组。

- `widths[i]` 值的范围在 `[2, 10]`。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个变量 `lines` 和 `last`，分别表示行数和最后一行的宽度，初始时 `lines = 1`，`last = 0`。

遍历字符串 $s$，对于每个字符 $c$，计算其宽度 $w$，如果 $last + w \leq 100$，则将 $w$ 加到 `last` 上，否则行数 `lines` 加一，并且 `last` 重置为 $w$。

最后返回 `lines` 和 `last` 构成的数组。

时间复杂度 $O(n)$，其中 $n$ 为字符串 $s$ 的长度。空间复杂度 $O(1)$。

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
// Number of Lines To Write String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberOfLines(widths []int, s string) []int {
	lines, last := 1, 0
	for _, c := range s {
		w := widths[c-'a']
		if last+w <= 100 {
			last += w
		} else {
			lines++
			last = w
		}
	}
	return []int{lines, last}
}
```

### Java

```java
// Number of Lines To Write String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] numberOfLines(int[] widths, String s) {
        int lines = 1, last = 0;
        for (int i = 0; i < s.length(); ++i) {
            int w = widths[s.charAt(i) - 'a'];
            if (last + w <= 100) {
                last += w;
            } else {
                ++lines;
                last = w;
            }
        }
        return new int[] {lines, last};
    }
}
```

### Python

```python
# Number of Lines To Write String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberOfLines(self, widths: List[int], s: str) -> List[int]:
        lines, last = 1, 0
        for w in map(lambda c: widths[ord(c) - ord("a")], s):
            if last + w <= 100:
                last += w
            else:
                lines += 1
                last = w
        return [lines, last]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0418. Sentence Screen Fitting

---
编号: 418
题目: Sentence Screen Fitting
难度: 中等
标签: [数组, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/sentence-screen-fitting/
---

## 题目描述

给你一个 `rows x cols` 的屏幕和一个用 **非空 **的单词列表组成的句子，请你计算出给定句子可以在屏幕上完整显示的次数。

句子中的单词顺序必须保持不变，并且不能将一个单词分成两行。一行中的两个连续单词必须用空白分开。

**示例 1：**

```text
输入：sentence = ["hello", "world"], rows = 2, cols = 8
输出：1
解释：
hello---
world---
字符 '-' 表示屏幕上的一个空白位置。
```

**示例 2：**

```text
输入：sentence = ["a", "bcd", "e"], rows = 3, cols = 6
输出：2
解释：
a-bcd-
e-a---
bcd-e-
字符 '-' 表示屏幕上的一个空白位置。
```

**示例 3：**

```text
输入：sentence = ["i", "had", "apple", "pie"], rows = 4, cols = 5
输出：1
解释：
i-had
apple
pie-i
had--
字符 '-' 表示屏幕上的一个空白位置。
```

**提示：**

- `1 <= sentence.length <= 100`

- `1 <= sentence[i].length <= 10`

- `sentence[i]` 由小写英文字母组成。

- `1 <= rows, cols <= 2 * 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将句子的每个单词拼接上一个空格，然后把句子拼接起来，得到字符串 $s$。例如，对于句子 `["hello", "world"]`，得到的字符串为 `"hello world "`。记 $s$ 的长度为 $m$。

接下来，我们使用贪心的方法，找到最大的可显示句子数。定义一个变量 $cur$，表示当前已经在屏幕上显示的字符串的长度，初始时 $cur=0$。

我们循环 $rows$ 次，每次循环中，我们首先将 $cur$ 增加 $cols$，如果 $s[cur \bmod m]$ 是一个空格，说明我们可以将完整的若干个单词放置到当前行，因此我们将 $cur$ 增加一个额外的 $1$；否则，说明我们需要回退 $cur$，直到 $cur$ 指向的字符是一个空格为止。然后继续下一次循环。

循环结束，返回 $\lfloor \frac{cur}{m} \rfloor$ 即可。

时间复杂度 $O(rows \times M)$，空间复杂度 $O(L)$。其中 $M$ 是单词的最大长度，而 $L$ 是单词的总长度。

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
// Sentence Screen Fitting：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func wordsTyping(sentence []string, rows int, cols int) int {
	s := strings.Join(sentence, " ") + " "
	m := len(s)
	cur := 0
	for i := 0; i < rows; i++ {
		cur += cols
		if s[cur%m] == ' ' {
			cur++
		} else {
			for cur > 0 && s[(cur-1)%m] != ' ' {
				cur--
			}
		}
	}
	return cur / m
}
```

### Java

```java
// Sentence Screen Fitting：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int wordsTyping(String[] sentence, int rows, int cols) {
        String s = String.join(" ", sentence) + " ";
        int m = s.length();
        int cur = 0;
        while (rows-- > 0) {
            cur += cols;
            if (s.charAt(cur % m) == ' ') {
                ++cur;
            } else {
                while (cur > 0 && s.charAt((cur - 1) % m) != ' ') {
                    --cur;
                }
            }
        }
        return cur / m;
    }
}
```

### Python

```python
# Sentence Screen Fitting：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def wordsTyping(self, sentence: List[str], rows: int, cols: int) -> int:
        s = " ".join(sentence) + " "
        m = len(s)
        cur = 0
        for _ in range(rows):
            cur += cols
            if s[cur % m] == " ":
                cur += 1
            while cur and s[(cur - 1) % m] != " ":
                cur -= 1
        return cur // m
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

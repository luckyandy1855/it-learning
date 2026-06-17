# 0843. Guess the Word

---
编号: 843
题目: Guess the Word
难度: 困难
标签: [数组, 数学, 字符串, 博弈, 交互]
来源链接: https://leetcode.com/problems/guess-the-word/
---

## 题目描述

给你一个由 **不同** 字符串组成的单词列表 `words` ，其中 `words[i]` 长度均为 `6` 。`words` 中的一个单词将被选作秘密单词 `secret` 。

另给你一个辅助对象 `Master` ，你可以调用 `Master.guess(word)` 来猜单词，其中参数 `word` 长度为 6 且必须是 `words` 中的字符串。

`Master.guess(word)` 将会返回如下结果：

- 如果 `word` 不是 `words` 中的字符串，返回 `-1` ，或者

- 一个整数，表示你所猜测的单词 `word` 与 **秘密单词** `secret` 的准确匹配（值和位置同时匹配）的数目。

每组测试用例都会包含一个参数 `allowedGuesses` ，其中 `allowedGuesses` 是你可以调用 `Master.guess(word)` 的最大次数。

对于每组测试用例，在不超过允许猜测的次数的前提下，你应该调用 `Master.guess` 来猜出秘密单词。最终，你将会得到以下结果：

- 如果你调用 `Master.guess` 的次数大于 `allowedGuesses` 所限定的次数或者你没有用 `Master.guess` 猜到秘密单词，则得到 **`"Either you took too many guesses, or you did not find the secret word."` 。**

- 如果你调用 `Master.guess` 猜到秘密单词，且调用 `Master.guess` 的次数小于或等于 `allowedGuesses` ，则得到 **`"You guessed the secret word correctly."` 。**

生成的测试用例保证你可以利用某种合理的策略（而不是暴力）猜到秘密单词。

**示例 1：**

```text
输入：secret = "acckzz", words = ["acckzz","ccbazz","eiowzz","abcczz"], allowedGuesses = 10
输出：You guessed the secret word correctly.
解释：
master.guess("aaaaaa") 返回 -1 ，因为 "aaaaaa" 不在 words 中。
master.guess("acckzz") 返回 6 ，因为 "acckzz" 是秘密单词 secret ，共有 6 个字母匹配。
master.guess("ccbazz") 返回 3 ，因为 "ccbazz" 共有 3 个字母匹配。
master.guess("eiowzz") 返回 2 ，因为 "eiowzz" 共有 2 个字母匹配。
master.guess("abcczz") 返回 4 ，因为 "abcczz" 共有 4 个字母匹配。
一共调用 5 次 master.guess ，其中一个为秘密单词，所以通过测试用例。
```

**示例 2：**

```text
输入：secret = "hamada", words = ["hamada","khaled"], allowedGuesses = 10
输出：You guessed the secret word correctly.
解释：共有 2 个单词，且其中一个为秘密单词，可以通过测试用例。
```

**提示：**

- `1 <= words.length <= 100`

- `words[i].length == 6`

- `words[i]` 仅由小写英文字母组成

- `words` 中所有字符串 **互不相同**

- `secret` 存在于 `words` 中

- `10 <= allowedGuesses <= 30`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 字符串, 博弈, 交互」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Guess the Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。

```

### Java

```java
// Guess the Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;

```

### Python

```python
# Guess the Word：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。

```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

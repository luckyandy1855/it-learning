# 1165. Single-Row Keyboard

---
编号: 1165
题目: Single-Row Keyboard
难度: 简单
标签: [哈希表, 字符串]
来源链接: https://leetcode.com/problems/single-row-keyboard/
---

## 题目描述

我们定制了一款特殊的键盘，所有的键都 **排列在一行上** 。

给定一个长度为 `26` 的字符串 `keyboard` ，来表示键盘的布局(索引从 `0` 到 `25` )。一开始，你的手指在索引 `0` 处。要输入一个字符，你必须把你的手指移动到所需字符的索引处。手指从索引 `i` 移动到索引 `j` 所需要的时间是 `|i - j|`。

您需要输入一个字符串 `word` 。写一个函数来计算用一个手指输入需要多少时间。

**示例 1：**

```text
输入：keyboard = "abcdefghijklmnopqrstuvwxyz", word = "cba"
输出：4
解释：从 0 号键移动到 2 号键来输出 'c'，又移动到 1 号键来输出 'b'，接着移动到 0 号键来输出 'a'。
总用时 = 2 + 1 + 1 = 4.
```

**示例 2：**

```text
输入：keyboard = "pqrstuvwxyzabcdefghijklmno", word = "leetcode"
输出：73
```

**提示：**

- `keyboard.length == 26`

- `keyboard` 按某种特定顺序排列，并包含每个小写英文字母一次。

- `1 <= word.length <= 10^4`

- `word[i]` 为小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用哈希表或者一个长度为 $26$ 的数组 $pos$ 来存储每个字符在键盘上的位置，其中 $pos[c]$ 表示字符 $c$ 在键盘上的位置。

然后我们遍历字符串 $word$，用一个变量 $i$ 记录当前手指所在的位置，初始时 $i = 0$。每次计算当前字符 $c$ 在键盘上的位置 $j$，并将答案增加 $|i - j|$，然后将 $i$ 更新为 $j$。继续遍历下一个字符，直到遍历完整个字符串 $word$。

遍历完字符串 $word$ 之后，即可得到答案。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 为字符串 $word$ 的长度；而 $C$ 为字符集大小，本题中 $C = 26$。

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
// Single-Row Keyboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func calculateTime(keyboard string, word string) (ans int) {
	pos := [26]int{}
	for i, c := range keyboard {
		pos[c-'a'] = i
	}
	i := 0
	for _, c := range word {
		j := pos[c-'a']
		ans += abs(i - j)
		i = j
	}
	return
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Single-Row Keyboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int calculateTime(String keyboard, String word) {
        int[] pos = new int[26];
        for (int i = 0; i < 26; ++i) {
            pos[keyboard.charAt(i) - 'a'] = i;
        }
        int ans = 0, i = 0;
        for (int k = 0; k < word.length(); ++k) {
            int j = pos[word.charAt(k) - 'a'];
            ans += Math.abs(i - j);
            i = j;
        }
        return ans;
    }
}
```

### Python

```python
# Single-Row Keyboard：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def calculateTime(self, keyboard: str, word: str) -> int:
        pos = {c: i for i, c in enumerate(keyboard)}
        ans = i = 0
        for c in word:
            ans += abs(pos[c] - i)
            i = pos[c]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

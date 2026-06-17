# 0848. Shifting Letters

---
编号: 848
题目: Shifting Letters
难度: 中等
标签: [数组, 字符串, 前缀和]
来源链接: https://leetcode.com/problems/shifting-letters/
---

## 题目描述

有一个由小写字母组成的字符串 `s`，和一个长度相同的整数数组 `shifts`。

我们将字母表中的下一个字母称为原字母的 *移位* `shift()` （由于字母表是环绕的， `'z'` 将会变成 `'a'`）。

- 例如，`shift('a') = 'b', ``shift('t') = 'u'`, 以及 `shift('z') = 'a'`。

对于每个 `shifts[i] = x` ， 我们会将 `s` 中的前 `i + 1` 个字母移位 `x` 次。

返回 *将所有这些移位都应用到 `s` 后最终得到的字符串* 。

**示例 1：**

```text
输入：s = "abc", shifts = [3,5,9]
输出："rpl"
解释：
我们以 "abc" 开始。
将 S 中的第 1 个字母移位 3 次后，我们得到 "dbc"。
再将 S 中的前 2 个字母移位 5 次后，我们得到 "igc"。
最后将 S 中的这 3 个字母移位 9 次后，我们得到答案 "rpl"。
```

**示例 2:**

```text
输入: s = "aaa", shifts = [1,2,3]
输出: "gfd"
```

**提示:**

- `1 ​​​​​​

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 字符串, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于字符串 $s$ 中的每个字符，我们需要计算其最终的偏移量，即 $\textit{shifts}[i]$ 与 $\textit{shifts}[i + 1]$ 与 $\textit{shifts}[i + 2]$ ... 的和。我们可以使用后缀和的思想，从后往前遍历 $\textit{shifts}$，计算每个字符的最终偏移量，然后对 $26$ 取模，得到最终的字符。

时间复杂度 $O(n)$，其中 $n$ 为字符串 $s$ 的长度。忽略答案的空间消耗，空间复杂度 $O(1)$。

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
// Shifting Letters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shiftingLetters(s string, shifts []int) string {
	t := 0
	n := len(s)
	cs := []byte(s)
	for i := n - 1; i >= 0; i-- {
		t += shifts[i]
		j := (int(cs[i]-'a') + t) % 26
		cs[i] = byte('a' + j)
	}
	return string(cs)
}
```

### Java

```java
// Shifting Letters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String shiftingLetters(String s, int[] shifts) {
        char[] cs = s.toCharArray();
        int n = cs.length;
        long t = 0;
        for (int i = n - 1; i >= 0; --i) {
            t += shifts[i];
            int j = (int) ((cs[i] - 'a' + t) % 26);
            cs[i] = (char) ('a' + j);
        }
        return String.valueOf(cs);
    }
}
```

### Python

```python
# Shifting Letters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shiftingLetters(self, s: str, shifts: List[int]) -> str:
        n, t = len(s), 0
        s = list(s)
        for i in range(n - 1, -1, -1):
            t += shifts[i]
            j = (ord(s[i]) - ord('a') + t) % 26
            s[i] = ascii_lowercase[j]
        return ''.join(s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

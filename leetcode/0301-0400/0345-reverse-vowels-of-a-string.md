# 0345. Reverse Vowels of a String

---
编号: 345
题目: Reverse Vowels of a String
难度: 简单
标签: [双指针, 字符串]
来源链接: https://leetcode.com/problems/reverse-vowels-of-a-string/
---

## 题目描述

给你一个字符串 `s` ，仅反转字符串中的所有元音字母，并返回结果字符串。

元音字母包括 `'a'`、`'e'`、`'i'`、`'o'`、`'u'`，且可能以大小写两种形式出现不止一次。

示例 1：

**输入：**s = "IceCreAm"

输出："AceCreIm"

**解释：**

`s` 中的元音是 `['I', 'e', 'e', 'A']`。反转这些元音，`s` 变为 `"AceCreIm"`.

示例 2：

输入：s = "leetcode"

**输出：**"leotcede"

**提示：**

	- `1 <= s.length <= 3 * 10^5`

	- `s` 由 **可打印的 ASCII** 字符组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「双指针, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用两个指针 $i$ 和 $j$，初始时分别指向字符串的首尾。

每次循环判断 $i$ 指向的字符是否是元音字母，如果不是则向后移动 $i$；同理，判断 $j$ 指向的字符是否是元音字母，如果不是则向前移动 $j$。如果此时 $i \lt j$，那么 $i$ 和 $j$ 指向的字符都是元音字母，交换这两个字符。然后向后移动 $i$，向前移动 $j$。继续上述操作，直到 $i \ge j$。

时间复杂度 $O(n)$，其中 $n$ 是字符串的长度。空间复杂度 $O(|\Sigma|)$，其中 $\Sigma$ 是字符集的大小。

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
// Reverse Vowels of a String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reverseVowels(s string) string {
	vowels := [128]bool{}
	for _, c := range "aeiouAEIOU" {
		vowels[c] = true
	}
	cs := []byte(s)
	i, j := 0, len(cs)-1
	for i < j {
		for i < j && !vowels[cs[i]] {
			i++
		}
		for i < j && !vowels[cs[j]] {
			j--
		}
		if i < j {
			cs[i], cs[j] = cs[j], cs[i]
			i, j = i+1, j-1
		}
	}
	return string(cs)
}
```

### Java

```java
// Reverse Vowels of a String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String reverseVowels(String s) {
        boolean[] vowels = new boolean[128];
        for (char c : "aeiouAEIOU".toCharArray()) {
            vowels[c] = true;
        }
        char[] cs = s.toCharArray();
        int i = 0, j = cs.length - 1;
        while (i < j) {
            while (i < j && !vowels[cs[i]]) {
                ++i;
            }
            while (i < j && !vowels[cs[j]]) {
                --j;
            }
            if (i < j) {
                char t = cs[i];
                cs[i] = cs[j];
                cs[j] = t;
                ++i;
                --j;
            }
        }
        return String.valueOf(cs);
    }
}
```

### Python

```python
# Reverse Vowels of a String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reverseVowels(self, s: str) -> str:
        vowels = "aeiouAEIOU"
        i, j = 0, len(s) - 1
        cs = list(s)
        while i < j:
            while i < j and cs[i] not in vowels:
                i += 1
            while i < j and cs[j] not in vowels:
                j -= 1
            if i < j:
                cs[i], cs[j] = cs[j], cs[i]
                i, j = i + 1, j - 1
        return "".join(cs)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

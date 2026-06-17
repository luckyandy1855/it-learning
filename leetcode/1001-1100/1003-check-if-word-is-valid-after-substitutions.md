# 1003. Check If Word Is Valid After Substitutions

---
编号: 1003
题目: Check If Word Is Valid After Substitutions
难度: 中等
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/
---

## 题目描述

给你一个字符串 `s` ，请你判断它是否 **有效** 。

字符串 `s` **有效** 需要满足：假设开始有一个空字符串 `t = ""` ，你可以执行 **任意次** 下述操作将** **`t`** 转换为 **`s` ：

- 将字符串 `"abc"` 插入到 `t` 中的任意位置。形式上，`t` 变为 `tleft + "abc" + tright`，其中 `t == tleft + tright` 。注意，`tleft` 和 `tright` 可能为 **空** 。

如果字符串 `s` 有效，则返回 `true`；否则，返回 `false`。

**示例 1：**

```text
输入：s = "aabcbc"
输出：true
解释：
"" -> "abc" -> "aabcbc"
因此，"aabcbc" 有效。
```

**示例 2：**

```text
输入：s = "abcabcababcc"
输出：true
解释：
"" -> "abc" -> "abcabc" -> "abcabcabc" -> "abcabcababcc"
因此，"abcabcababcc" 有效。
```

**示例 3：**

```text
输入：s = "abccba"
输出：false
解释：执行操作无法得到 "abccba" 。
```

**提示：**

- `1 <= s.length <= 2 * 10^4`

- `s` 由字母 `'a'`、`'b'` 和 `'c'` 组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们观察题目中的操作，可以发现，每一次都会在字符串的任意位置插入字符串 $\textit{"abc"}$，所以每次插入操作之后，字符串的长度都会增加 $3$。如果字符串 $s$ 有效，那么它的长度一定是 $3$ 的倍数。因此，我们先对字符串 $s$ 的长度进行判断，如果不是 $3$ 的倍数，那么 $s$ 一定无效，可以直接返回 $\textit{false}$。

接下来我们遍历字符串 $s$ 的每个字符 $c$，我们先将字符 $c$ 压入栈 $t$ 中。如果此时栈 $t$ 的长度大于等于 $3$，并且栈顶的三个元素组成了字符串 $\textit{"abc"}$，那么我们就将栈顶的三个元素弹出。然后继续遍历字符串 $s$ 的下一个字符。

遍历结束之后，如果栈 $t$ 为空，那么说明字符串 $s$ 有效，返回 $\textit{true}$；否则，返回 $\textit{false}$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是字符串 $s$ 的长度。

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
// Check If Word Is Valid After Substitutions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isValid(s string) bool {
	if len(s)%3 > 0 {
		return false
	}
	t := []byte{}
	for i := range s {
		t = append(t, s[i])
		if len(t) >= 3 && string(t[len(t)-3:]) == "abc" {
			t = t[:len(t)-3]
		}
	}
	return len(t) == 0
}
```

### Java

```java
// Check If Word Is Valid After Substitutions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isValid(String s) {
        if (s.length() % 3 > 0) {
            return false;
        }
        StringBuilder t = new StringBuilder();
        for (char c : s.toCharArray()) {
            t.append(c);
            if (t.length() >= 3 && "abc".equals(t.substring(t.length() - 3))) {
                t.delete(t.length() - 3, t.length());
            }
        }
        return t.isEmpty();
    }
}
```

### Python

```python
# Check If Word Is Valid After Substitutions：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isValid(self, s: str) -> bool:
        if len(s) % 3:
            return False
        t = []
        for c in s:
            t.append(c)
            if ''.join(t[-3:]) == 'abc':
                t[-3:] = []
        return not t
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

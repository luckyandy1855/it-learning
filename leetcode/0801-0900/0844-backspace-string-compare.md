# 0844. Backspace String Compare

---
编号: 844
题目: Backspace String Compare
难度: 简单
标签: [栈, 双指针, 字符串, 模拟]
来源链接: https://leetcode.com/problems/backspace-string-compare/
---

## 题目描述

给定 `s` 和 `t` 两个字符串，当它们分别被输入到空白的文本编辑器后，如果两者相等，返回 `true` 。`#` 代表退格字符。

**注意：**如果对空文本输入退格字符，文本继续为空。

**示例 1：**

```text
输入：s = "ab#c", t = "ad#c"
输出：true
解释：s 和 t 都会变成 "ac"。
```

**示例 2：**

```text
输入：s = "ab##", t = "c#d#"
输出：true
解释：s 和 t 都会变成 ""。
```

**示例 3：**

```text
输入：s = "a#c", t = "b"
输出：false
解释：s 会变成 "c"，但 t 仍然是 "b"。
```

**提示：**

- `1 <= s.length, t.length <= 200`

- `s` 和 `t` 只含有小写字母以及字符 `'#'`

**进阶：**

- 你可以用 `O(n)` 的时间复杂度和 `O(1)` 的空间复杂度解决该问题吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 双指针, 字符串, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用双指针 $i$ 和 $j$ 分别指向字符串 $s$ 和 $t$ 的末尾。

每次向前移动一个字符，如果当前字符是退格符，则跳过当前字符，同时退格符的数量加一，如果当前字符不是退格符，则判断退格符的数量，如果退格符的数量大于 $0$，则跳过当前字符，同时退格符的数量减一，如果退格符的数量等于 $0$，那么该字符需要进行比较。

我们每次找到两个字符串中需要比较的字符，然后进行比较，如果两个字符不相等，则返回 $false$，如果遍历完两个字符串，都没有发现不相等的字符，则返回 $true$。

时间复杂度 $O(m + n)$，空间复杂度 $O(1)$。其中 $m$ 和 $n$ 分别是字符串 $s$ 和 $t$ 的长度。

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
// Backspace String Compare：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func backspaceCompare(s string, t string) bool {
	i, j := len(s)-1, len(t)-1
	skip1, skip2 := 0, 0
	for ; i >= 0 || j >= 0; i, j = i-1, j-1 {
		for i >= 0 {
			if s[i] == '#' {
				skip1++
				i--
			} else if skip1 > 0 {
				skip1--
				i--
			} else {
				break
			}
		}
		for j >= 0 {
			if t[j] == '#' {
				skip2++
				j--
			} else if skip2 > 0 {
				skip2--
				j--
			} else {
				break
			}
		}
		if i >= 0 && j >= 0 {
			if s[i] != t[j] {
				return false
			}
		} else if i >= 0 || j >= 0 {
			return false
		}
	}
	return true
}
```

### Java

```java
// Backspace String Compare：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean backspaceCompare(String s, String t) {
        int i = s.length() - 1, j = t.length() - 1;
        int skip1 = 0, skip2 = 0;
        for (; i >= 0 || j >= 0; --i, --j) {
            while (i >= 0) {
                if (s.charAt(i) == '#') {
                    ++skip1;
                    --i;
                } else if (skip1 > 0) {
                    --skip1;
                    --i;
                } else {
                    break;
                }
            }
            while (j >= 0) {
                if (t.charAt(j) == '#') {
                    ++skip2;
                    --j;
                } else if (skip2 > 0) {
                    --skip2;
                    --j;
                } else {
                    break;
                }
            }
            if (i >= 0 && j >= 0) {
                if (s.charAt(i) != t.charAt(j)) {
                    return false;
                }
            } else if (i >= 0 || j >= 0) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Backspace String Compare：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        i, j, skip1, skip2 = len(s) - 1, len(t) - 1, 0, 0
        while i >= 0 or j >= 0:
            while i >= 0:
                if s[i] == '#':
                    skip1 += 1
                    i -= 1
                elif skip1:
                    skip1 -= 1
                    i -= 1
                else:
                    break
            while j >= 0:
                if t[j] == '#':
                    skip2 += 1
                    j -= 1
                elif skip2:
                    skip2 -= 1
                    j -= 1
                else:
                    break
            if i >= 0 and j >= 0:
                if s[i] != t[j]:
                    return False
            elif i >= 0 or j >= 0:
                return False
            i, j = i - 1, j - 1
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

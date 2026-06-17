# 1446. Consecutive Characters

---
编号: 1446
题目: Consecutive Characters
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/consecutive-characters/
---

## 题目描述

给你一个字符串 `s` ，字符串的**「能量」**定义为：只包含一种字符的最长非空子字符串的长度。

请你返回字符串 `s` 的 **能量**。

**示例 1：**

```text
输入：s = "leetcode"
输出：2
解释：子字符串 "ee" 长度为 2 ，只包含字符 'e' 。
```

**示例 2：**

```text
输入：s = "abbcccddddeeeeedcba"
输出：5
解释：子字符串 "eeeee" 长度为 5 ，只包含字符 'e' 。
```

**提示：**

- `1 <= s.length <= 500`

- `s` 只包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个变量 $\textit{t}$，表示当前连续字符的长度，初始时 $\textit{t}=1$。

接下来，我们从字符串 $s$ 的第二个字符开始遍历，如果当前字符与上一个字符相同，那么 $\textit{t} = \textit{t} + 1$，然后更新答案 $\textit{ans} = \max(\textit{ans}, \textit{t})$；否则 $\textit{t} = 1$。

最后返回答案 $\textit{ans}$ 即可。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $s$ 的长度。空间复杂度 $O(1)$。

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
// Consecutive Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxPower(s string) int {
	ans, t := 1, 1
	for i := 1; i < len(s); i++ {
		if s[i] == s[i-1] {
			t++
			ans = max(ans, t)
		} else {
			t = 1
		}
	}
	return ans
}
```

### Java

```java
// Consecutive Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxPower(String s) {
        int ans = 1, t = 1;
        for (int i = 1; i < s.length(); ++i) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                ans = Math.max(ans, ++t);
            } else {
                t = 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Consecutive Characters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxPower(self, s: str) -> int:
        ans = t = 1
        for a, b in pairwise(s):
            if a == b:
                t += 1
                ans = max(ans, t)
            else:
                t = 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0926. Flip String to Monotone Increasing

---
编号: 926
题目: Flip String to Monotone Increasing
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/flip-string-to-monotone-increasing/
---

## 题目描述

如果一个二进制字符串，是以一些 `0`（可能没有 `0`）后面跟着一些 `1`（也可能没有 `1`）的形式组成的，那么该字符串是 **单调递增 **的。

给你一个二进制字符串 `s`，你可以将任何 `0` 翻转为 `1` 或者将 `1` 翻转为 `0` 。

返回使 `s` 单调递增的最小翻转次数。

**示例 1：**

```text
输入：s = "00110"
输出：1
解释：翻转最后一位得到 00111.
```

**示例 2：**

```text
输入：s = "010110"
输出：2
解释：翻转得到 011111，或者是 000111。
```

**示例 3：**

```text
输入：s = "00011000"
输出：2
解释：翻转得到 00000000。
```

**提示：**

- `1 <= s.length <= 10^5`

- `s[i]` 为 `'0'` 或 `'1'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先统计字符串 $s$ 中 $0$ 的个数，记为 $tot$。定义一个答案变量 $ans$，初始时 $ans = tot$，表示将所有 $0$ 变成 $1$ 的翻转次数。

然后，我们可以枚举每个位置 $i$，将位置 $i$ 及其左边的所有 $1$ 变成 $0$，将位置 $i$ 右边的所有 $0$ 变成 $1$，计算这种情况下的翻转次数，即 $i + 1 - cur + tot - cur$，其中 $cur$ 表示位置 $i$ 及其左边的 $0$ 的个数，更新答案 $ans = \min(ans, i + 1 - cur + tot - cur)$。

最后返回答案 $ans$ 即可。

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
// Flip String to Monotone Increasing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minFlipsMonoIncr(s string) int {
	tot := strings.Count(s, "0")
	ans, cur := tot, 0
	for i, c := range s {
		if c == '0' {
			cur++
		}
		ans = min(ans, i+1-cur+tot-cur)
	}
	return ans
}
```

### Java

```java
// Flip String to Monotone Increasing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minFlipsMonoIncr(String s) {
        int n = s.length();
        int tot = 0;
        for (int i = 0; i < n; ++i) {
            if (s.charAt(i) == '0') {
                ++tot;
            }
        }
        int ans = tot, cur = 0;
        for (int i = 1; i <= n; ++i) {
            if (s.charAt(i - 1) == '0') {
                ++cur;
            }
            ans = Math.min(ans, i - cur + tot - cur);
        }
        return ans;
    }
}
```

### Python

```python
# Flip String to Monotone Increasing：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minFlipsMonoIncr(self, s: str) -> int:
        tot = s.count("0")
        ans, cur = tot, 0
        for i, c in enumerate(s, 1):
            cur += int(c == "0")
            ans = min(ans, i - cur + tot - cur)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

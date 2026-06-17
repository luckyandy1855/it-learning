# 0541. Reverse String II

---
编号: 541
题目: Reverse String II
难度: 简单
标签: [双指针, 字符串]
来源链接: https://leetcode.com/problems/reverse-string-ii/
---

## 题目描述

给定一个字符串 `s` 和一个整数 `k`，从字符串开头算起，每计数至 `2k` 个字符，就反转这 `2k` 字符中的前 `k` 个字符。

- 如果剩余字符少于 `k` 个，则将剩余字符全部反转。

- 如果剩余字符小于 `2k` 但大于或等于 `k` 个，则反转前 `k` 个字符，其余字符保持原样。

**示例 1：**

```text
输入：s = "abcdefg", k = 2
输出："bacdfeg"
```

**示例 2：**

```text
输入：s = "abcd", k = 2
输出："bacd"
```

**提示：**

- `1 <= s.length <= 10^4`

- `s` 仅由小写英文组成

- `1 <= k <= 10^4`

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

我们可以遍历字符串 $\textit{s}$，每次遍历 $\textit{2k}$ 个字符，然后利用双指针技巧，对这 $\textit{2k}$ 个字符中的前 $\textit{k}$ 个字符进行反转。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $\textit{s}$ 的长度。

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
// Reverse String II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reverseStr(s string, k int) string {
	cs := []byte(s)
	n := len(cs)
	for i := 0; i < n; i += 2 * k {
		for l, r := i, min(i+k-1, n-1); l < r; l, r = l+1, r-1 {
			cs[l], cs[r] = cs[r], cs[l]
		}
	}
	return string(cs)
}
```

### Java

```java
// Reverse String II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String reverseStr(String s, int k) {
        char[] cs = s.toCharArray();
        int n = cs.length;
        for (int i = 0; i < n; i += k * 2) {
            for (int l = i, r = Math.min(i + k - 1, n - 1); l < r; ++l, --r) {
                char t = cs[l];
                cs[l] = cs[r];
                cs[r] = t;
            }
        }
        return new String(cs);
    }
}
```

### Python

```python
# Reverse String II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reverseStr(self, s: str, k: int) -> str:
        cs = list(s)
        for i in range(0, len(cs), 2 * k):
            cs[i : i + k] = reversed(cs[i : i + k])
        return "".join(cs)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

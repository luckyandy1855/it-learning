# 1016. Binary String With Substrings Representing 1 To N

---
编号: 1016
题目: Binary String With Substrings Representing 1 To N
难度: 中等
标签: [位运算, 哈希表, 字符串, 滑动窗口]
来源链接: https://leetcode.com/problems/binary-string-with-substrings-representing-1-to-n/
---

## 题目描述

给定一个二进制字符串 `s` 和一个正整数 `n`，如果对于 `[1, n]` 范围内的每个整数，*其二进制表示都是 `s` 的 **子字符串** ，就返回 `true`，否则返回 `false` *。

**子字符串** 是字符串中连续的字符序列。

**示例 1：**

```text
输入：s = "0110", n = 3
输出：true
```

**示例 2：**

```text
输入：s = "0110", n = 4
输出：false
```

**提示：**

- `1 <= s.length <= 1000`

- `s[i]` 不是 `'0'` 就是 `'1'`

- `1 <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 哈希表, 字符串, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，字符串 $s$ 的长度不超过 $1000$，所以字符串 $s$ 能表示不超过 $1000$ 个 二进制整数，因此，如果 $n \gt 1000$，那么 $s$ 肯定不能表示 $[1,.. n]$ 范围内的所有整数的二进制表示。

另外，对于一个整数 $x$，如果 $x$ 的二进制表示是 $s$ 的子串，那么 $\lfloor x / 2 \rfloor$ 的二进制表示也是 $s$ 的子串。因此，我们只需要判断 $[\lfloor n / 2 \rfloor + 1,.. n]$ 范围内的整数的二进制表示是否是 $s$ 的子串即可。

时间复杂度 $O(m^2 \times \log m)$，空间复杂度 $O(\log n)$，其中 $m$ 是字符串 $s$ 的长度，而 $n$ 为题目给定的正整数。

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
// Binary String With Substrings Representing 1 To N：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func queryString(s string, n int) bool {
	if n > 1000 {
		return false
	}
	for i := n; i > n/2; i-- {
		if !strings.Contains(s, strconv.FormatInt(int64(i), 2)) {
			return false
		}
	}
	return true
}
```

### Java

```java
// Binary String With Substrings Representing 1 To N：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean queryString(String s, int n) {
        if (n > 1000) {
            return false;
        }
        for (int i = n; i > n / 2; i--) {
            if (!s.contains(Integer.toBinaryString(i))) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Binary String With Substrings Representing 1 To N：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def queryString(self, s: str, n: int) -> bool:
        if n > 1000:
            return False
        return all(bin(i)[2:] in s for i in range(n, n // 2, -1))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

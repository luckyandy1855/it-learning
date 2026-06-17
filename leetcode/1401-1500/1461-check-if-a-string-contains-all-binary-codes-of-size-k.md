# 1461. Check If a String Contains All Binary Codes of Size K

---
编号: 1461
题目: Check If a String Contains All Binary Codes of Size K
难度: 中等
标签: [位运算, 哈希表, 字符串, 哈希函数, 滚动哈希]
来源链接: https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/
---

## 题目描述

给你一个二进制字符串 `s` 和一个整数 `k` 。如果所有长度为 `k` 的二进制字符串都是 `s` 的子串，请返回 `true` ，否则请返回 `false` 。

**示例 1：**

```text
输入：s = "00110110", k = 2
输出：true
解释：长度为 2 的二进制串包括 "00"，"01"，"10" 和 "11"。它们分别是 s 中下标为 0，1，3，2 开始的长度为 2 的子串。
```

**示例 2：**

```text
输入：s = "0110", k = 1
输出：true
解释：长度为 1 的二进制串包括 "0" 和 "1"，显然它们都是 s 的子串。
```

**示例 3：**

```text
输入：s = "0110", k = 2
输出：false
解释：长度为 2 的二进制串 "00" 没有出现在 s 中。
```

**提示：**

- `1 <= s.length <= 5 * 10^5`

- `s[i]` 不是`'0'` 就是 `'1'`

- `1 <= k <= 20`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 哈希表, 字符串, 哈希函数, 滚动哈希」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

首先，对于一个长度为 $n$ 的字符串 $s$，长度为 $k$ 的子串的个数为 $n - k + 1$，如果 $n - k + 1 < 2^k$，则一定存在长度为 $k$ 的二进制串不是 $s$ 的子串，返回 `false`。

接下来，我们遍历字符串 $s$，将所有长度为 $k$ 的子串存入集合 $ss$，最后判断集合 $ss$ 的大小是否等于 $2^k$。

时间复杂度 $O(n \times k)$，空间复杂度 $O(n)$。其中 $n$ 是字符串 $s$ 的长度。

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
// Check If a String Contains All Binary Codes of Size K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func hasAllCodes(s string, k int) bool {
	n, m := len(s), 1<<k
	if n-k+1 < m {
		return false
	}
	ss := map[string]bool{}
	for i := 0; i+k <= n; i++ {
		ss[s[i:i+k]] = true
	}
	return len(ss) == m
}
```

### Java

```java
// Check If a String Contains All Binary Codes of Size K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean hasAllCodes(String s, int k) {
        int n = s.length();
        int m = 1 << k;
        if (n - k + 1 < m) {
            return false;
        }
        Set<String> ss = new HashSet<>();
        for (int i = 0; i < n - k + 1; ++i) {
            ss.add(s.substring(i, i + k));
        }
        return ss.size() == m;
    }
}
```

### Python

```python
# Check If a String Contains All Binary Codes of Size K：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def hasAllCodes(self, s: str, k: int) -> bool:
        n = len(s)
        m = 1 << k
        if n - k + 1 < m:
            return False
        ss = {s[i : i + k] for i in range(n - k + 1)}
        return len(ss) == m
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

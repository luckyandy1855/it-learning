# 1374. Generate a String With Characters That Have Odd Counts

---
编号: 1374
题目: Generate a String With Characters That Have Odd Counts
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/generate-a-string-with-characters-that-have-odd-counts/
---

## 题目描述

给你一个整数 `n`，请你返回一个含* `n` *个字符的字符串，其中每种字符在该字符串中都恰好出现 **奇数次** ***。***

返回的字符串必须只含小写英文字母。如果存在多个满足题目要求的字符串，则返回其中任意一个即可。

**示例 1：**

```text
输入：n = 4
输出："pppz"
解释："pppz" 是一个满足题目要求的字符串，因为 &#39;p&#39; 出现 3 次，且 &#39;z&#39; 出现 1 次。当然，还有很多其他字符串也满足题目要求，比如："ohhh" 和 "love"。
```

**示例 2：**

```text
输入：n = 2
输出："xy"
解释："xy" 是一个满足题目要求的字符串，因为 &#39;x&#39; 和 &#39;y&#39; 各出现 1 次。当然，还有很多其他字符串也满足题目要求，比如："ag" 和 "ur"。
```

**示例 3：**

```text
输入：n = 7
输出："holasss"
```

**提示：**

- `1 <= n <= 500`

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

如果 $n$ 为奇数，那么直接构造 $n$ 个 `'a'` 即可。

如果 $n$ 为偶数，那么构造 $n-1$ 个 `'a'` 和 $1$ 个 `'b'` 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串长度。

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
// Generate a String With Characters That Have Odd Counts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func generateTheString(n int) string {
	ans := strings.Repeat("a", n-1)
	if n%2 == 0 {
		ans += "b"
	} else {
		ans += "a"
	}
	return ans
}
```

### Java

```java
// Generate a String With Characters That Have Odd Counts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String generateTheString(int n) {
        return (n % 2 == 1) ? "a".repeat(n) : "a".repeat(n - 1) + "b";
    }
}
```

### Python

```python
# Generate a String With Characters That Have Odd Counts：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def generateTheString(self, n: int) -> str:
        return 'a' * n if n & 1 else 'a' * (n - 1) + 'b'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

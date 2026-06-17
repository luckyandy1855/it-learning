# 0821. Shortest Distance to a Character

---
编号: 821
题目: Shortest Distance to a Character
难度: 简单
标签: [数组, 双指针, 字符串]
来源链接: https://leetcode.com/problems/shortest-distance-to-a-character/
---

## 题目描述

给你一个字符串 `s` 和一个字符 `c` ，且 `c` 是 `s` 中出现过的字符。

返回一个整数数组 `answer` ，其中 `answer.length == s.length` 且 `answer[i]` 是 `s` 中从下标 `i` 到离它 **最近** 的字符 `c` 的 **距离** 。

两个下标 `i` 和 `j` 之间的 **距离** 为 `abs(i - j)` ，其中 `abs` 是绝对值函数。

**示例 1：**

```text
输入：s = "loveleetcode", c = "e"
输出：[3,2,1,0,1,0,0,1,2,2,1,0]
解释：字符 'e' 出现在下标 3、5、6 和 11 处（下标从 0 开始计数）。
距下标 0 最近的 'e' 出现在下标 3 ，所以距离为 abs(0 - 3) = 3 。
距下标 1 最近的 'e' 出现在下标 3 ，所以距离为 abs(1 - 3) = 2 。
对于下标 4 ，出现在下标 3 和下标 5 处的 'e' 都离它最近，但距离是一样的 abs(4 - 3) == abs(4 - 5) = 1 。
距下标 8 最近的 'e' 出现在下标 6 ，所以距离为 abs(8 - 6) = 2 。
```

**示例 2：**

```text
输入：s = "aaab", c = "b"
输出：[3,2,1,0]
```

**提示：**

- `1 <= s.length <= 10^4`

- `s[i]` 和 `c` 均为小写英文字母

- 题目数据保证 `c` 在 `s` 中至少出现一次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先创建一个长度为 $n$ 的答案数组 $ans$。

接下来，我们从左到右遍历字符串 $s$，记录最近出现的字符 $c$ 的位置 $pre$，那么对于位置 $i$，答案就是 $i - pre$，即 $ans[i] = i - pre$。

然后，我们从右到左遍历字符串 $s$，记录最近出现的字符 $c$ 的位置 $suf$，那么对于位置 $i$，答案就是 $suf - i$，即 $ans[i] = \min(ans[i], suf - i)$。

最后返回答案数组 $ans$ 即可。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $s$ 的长度。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Shortest Distance to a Character：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestToChar(s string, c byte) []int {
	n := len(s)
	ans := make([]int, n)
	const inf int = 1 << 30
	pre := -inf
	for i := range s {
		if s[i] == c {
			pre = i
		}
		ans[i] = i - pre
	}
	suf := inf
	for i := n - 1; i >= 0; i-- {
		if s[i] == c {
			suf = i
		}
		ans[i] = min(ans[i], suf-i)
	}
	return ans
}
```

### Java

```java
// Shortest Distance to a Character：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] shortestToChar(String s, char c) {
        int n = s.length();
        int[] ans = new int[n];
        final int inf = 1 << 30;
        Arrays.fill(ans, inf);
        for (int i = 0, pre = -inf; i < n; ++i) {
            if (s.charAt(i) == c) {
                pre = i;
            }
            ans[i] = Math.min(ans[i], i - pre);
        }
        for (int i = n - 1, suf = inf; i >= 0; --i) {
            if (s.charAt(i) == c) {
                suf = i;
            }
            ans[i] = Math.min(ans[i], suf - i);
        }
        return ans;
    }
}
```

### Python

```python
# Shortest Distance to a Character：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestToChar(self, s: str, c: str) -> List[int]:
        n = len(s)
        ans = [n] * n
        pre = -inf
        for i, ch in enumerate(s):
            if ch == c:
                pre = i
            ans[i] = min(ans[i], i - pre)
        suf = inf
        for i in range(n - 1, -1, -1):
            if s[i] == c:
                suf = i
            ans[i] = min(ans[i], suf - i)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0899. Orderly Queue

---
编号: 899
题目: Orderly Queue
难度: 困难
标签: [数学, 字符串, 排序]
来源链接: https://leetcode.com/problems/orderly-queue/
---

## 题目描述

给定一个字符串 `s` 和一个整数 `k` 。你可以从 `s` 的前 `k` 个字母中选择一个，并把它加到字符串的末尾。

返回 *在应用上述步骤的任意数量的移动后，字典序最小的字符串 *。

**示例 1：**

```text
输入：s = "cba", k = 1
输出："acb"
解释：
在第一步中，我们将第一个字符（“c”）移动到最后，获得字符串 “bac”。
在第二步中，我们将第一个字符（“b”）移动到最后，获得最终结果 “acb”。
```

**示例 2：**

```text
输入：s = "baaca", k = 3
输出："aaabc"
解释：
在第一步中，我们将第一个字符（“b”）移动到最后，获得字符串 “aacab”。
在第二步中，我们将第三个字符（“c”）移动到最后，获得最终结果 “aaabc”。
```

**提示：**

- `1 <= k <= S.length <= 1000`

- `s` 只由小写字母组成。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

若 $k = 1$，我们每次只能将字符串首字符移动到字符串末尾，总共有 $|s|$ 种不同的状态，我们返回其中字典序最小的字符串即可。

若 $k \gt 1$，对于形如 $abc[xy]def$ 的字符串，可以依次将 $a$, $b$, $c$ 移动到最后，得到 $[xy]defabc$，然后将 $y$, $x$ 移动到最后，得到 $defabc[yx]$，最后将 $d$, $e$, $f$ 移动到最后，得到 $abc[yx]def$，这样就实现了对 $y$, $x$ 的交换。

因此，只要 $k \gt 1$，我们就能够交换字符串中的任何两个相邻字符，最终得到一个升序排列的字符串。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 是字符串的长度。

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
// Orderly Queue：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func orderlyQueue(s string, k int) string {
	if k == 1 {
		ans := s
		for i := 0; i < len(s)-1; i++ {
			s = s[1:] + s[:1]
			if s < ans {
				ans = s
			}
		}
		return ans
	}
	t := []byte(s)
	sort.Slice(t, func(i, j int) bool { return t[i] < t[j] })
	return string(t)
}
```

### Java

```java
// Orderly Queue：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String orderlyQueue(String s, int k) {
        if (k == 1) {
            String ans = s;
            StringBuilder sb = new StringBuilder(s);
            for (int i = 0; i < s.length() - 1; ++i) {
                sb.append(sb.charAt(0)).deleteCharAt(0);
                if (sb.toString().compareTo(ans) < 0) {
                    ans = sb.toString();
                }
            }
            return ans;
        }
        char[] cs = s.toCharArray();
        Arrays.sort(cs);
        return String.valueOf(cs);
    }
}
```

### Python

```python
# Orderly Queue：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def orderlyQueue(self, s: str, k: int) -> str:
        if k == 1:
            ans = s
            for _ in range(len(s) - 1):
                s = s[1:] + s[0]
                ans = min(ans, s)
            return ans
        return "".join(sorted(s))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

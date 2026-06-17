# 1427. Perform String Shifts

---
编号: 1427
题目: Perform String Shifts
难度: 简单
标签: [数组, 数学, 字符串]
来源链接: https://leetcode.com/problems/perform-string-shifts/
---

## 题目描述

给定一个包含小写英文字母的字符串 `s` 以及一个矩阵 `shift`，其中 `shift[i] = [direction, amount]`：

- `direction` 可以为 `0` （表示左移）或 `1` （表示右移）。

- `amount` 表示 `s` 左右移的位数。

- 左移 1 位表示移除 `s` 的第一个字符，并将该字符插入到 `s` 的结尾。

- 类似地，右移 1 位表示移除 `s` 的最后一个字符，并将该字符插入到 `s` 的开头。

对这个字符串进行所有操作后，返回最终结果。

**示例 1：**

```text
输入：s = "abc", shift = [[0,1],[1,2]]
输出："cab"
解释：
[0,1] 表示左移 1 位。 "abc" -> "bca"
[1,2] 表示右移 2 位。 "bca" -> "cab"
```

**示例 2：**

```text
输入：s = "abcdefg", shift = [[1,1],[1,1],[0,2],[1,3]]
输出："efgabcd"
解释：
[1,1] 表示右移 1 位。 "abcdefg" -> "gabcdef"
[1,1] 表示右移 1 位。 "gabcdef" -> "fgabcde"
[0,2] 表示左移 2 位。 "fgabcde" -> "abcdefg"
[1,3] 表示右移 3 位。 "abcdefg" -> "efgabcd"
```

**提示：**

- `1 <= s.length <= 100`

- `s` 只包含小写英文字母

- `1 <= shift.length <= 100`

- `shift[i].length == 2`

- `0 <= shift[i][0] <= 1`

- `0 <= shift[i][1] <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨记字符串 $s$ 的长度为 $n$。接下来遍历数组 $shift$，累加得到最终的偏移量 $x$，然后将 $x$ 对 $n$ 取模，最终结果就是将 $s$ 的前 $n - x$ 个字符移动到末尾。

时间复杂度 $O(n + m)$，其中 $n$ 和 $m$ 分别是字符串 $s$ 的长度和数组 $shift$ 的长度。空间复杂度 $O(1)$。

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
// Perform String Shifts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func stringShift(s string, shift [][]int) string {
	x := 0
	for _, e := range shift {
		if e[0] == 0 {
			e[1] = -e[1]
		}
		x += e[1]
	}
	n := len(s)
	x = (x%n + n) % n
	return s[n-x:] + s[:n-x]
}
```

### Java

```java
// Perform String Shifts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String stringShift(String s, int[][] shift) {
        int x = 0;
        for (var e : shift) {
            if (e[0] == 0) {
                e[1] *= -1;
            }
            x += e[1];
        }
        int n = s.length();
        x = (x % n + n) % n;
        return s.substring(n - x) + s.substring(0, n - x);
    }
}
```

### Python

```python
# Perform String Shifts：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def stringShift(self, s: str, shift: List[List[int]]) -> str:
        x = sum((b if a else -b) for a, b in shift)
        x %= len(s)
        return s[-x:] + s[:-x]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

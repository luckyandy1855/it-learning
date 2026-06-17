# 1317. Convert Integer to the Sum of Two No-Zero Integers

---
编号: 1317
题目: Convert Integer to the Sum of Two No-Zero Integers
难度: 简单
标签: [数学]
来源链接: https://leetcode.com/problems/convert-integer-to-the-sum-of-two-no-zero-integers/
---

## 题目描述

「无零整数」是十进制表示中 **不含任何 0** 的正整数。

给你一个整数 `n`，请你返回一个 **由两个整数组成的列表** `[a, b]`，满足：

- `a` 和 `b` 都是无零整数

- `a + b = n`

题目数据保证至少有一个有效的解决方案。

如果存在多个有效解决方案，你可以返回其中任意一个。

**示例 1：**

```text
输入：n = 2
输出：[1,1]
解释：a = 1, b = 1。a + b = n 并且 a 和 b 的十进制表示形式都不包含任何 0。
```

**示例 2：**

```text
输入：n = 11
输出：[2,9]
```

**示例 3：**

```text
输入：n = 10000
输出：[1,9999]
```

**示例 4：**

```text
输入：n = 69
输出：[1,68]
```

**示例 5：**

```text
输入：n = 1010
输出：[11,999]
```

**提示：**

- `2 <= n <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

从 $1$ 开始枚举 $a$，那么 $b = n - a$。对于每个 $a$ 和 $b$，我们将它们转换为字符串并且连接起来，然后判断是否包含字符 `'0'`，如果不包含，那么就找到了答案，返回 $[a, b]$。

时间复杂度 $O(n \times \log n)$，其中 $n$ 为题目给定的整数。空间复杂度 $O(\log n)$。

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
// Convert Integer to the Sum of Two No-Zero Integers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getNoZeroIntegers(n int) []int {
	for a := 1; ; a++ {
		b := n - a
		if !strings.Contains(strconv.Itoa(a)+strconv.Itoa(b), "0") {
			return []int{a, b}
		}
	}
}
```

### Java

```java
// Convert Integer to the Sum of Two No-Zero Integers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] getNoZeroIntegers(int n) {
        for (int a = 1;; ++a) {
            int b = n - a;
            if (!(a + "" + b).contains("0")) {
                return new int[] {a, b};
            }
        }
    }
}
```

### Python

```python
# Convert Integer to the Sum of Two No-Zero Integers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getNoZeroIntegers(self, n: int) -> List[int]:
        for a in count(1):
            b = n - a
            if "0" not in f"{a}{b}":
                return [a, b]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

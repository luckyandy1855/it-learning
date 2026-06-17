# 0201. Bitwise AND of Numbers Range

---
编号: 201
题目: Bitwise AND of Numbers Range
难度: 中等
标签: [位运算]
来源链接: https://leetcode.com/problems/bitwise-and-of-numbers-range/
---

## 题目描述

给你两个整数 `left` 和 `right` ，表示区间 `[left, right]` ，返回此区间内所有数字 **按位与** 的结果（包含 `left` 、`right` 端点）。

**示例 1：**

```text
输入：left = 5, right = 7
输出：4
```

**示例 2：**

```text
输入：left = 0, right = 0
输出：0
```

**示例 3：**

```text
输入：left = 1, right = 2147483647
输出：0
```

**提示：**

- `0 <= left <= right <= 2^31 - 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目可以转换为求数字的公共二进制前缀。

当 $left \lt right$ 时，我们循环将 $right$ 的最后一个二进制位 $1$ 变成 $0$，直到 $left = right$，此时 $right$ 即为数字的公共二进制前缀，返回 $right$ 即可。

时间复杂度 $O(\log n)$，空间复杂度 $O(1)$。

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
// Bitwise AND of Numbers Range：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func rangeBitwiseAnd(left int, right int) int {
	for left < right {
		right &= (right - 1)
	}
	return right
}
```

### Java

```java
import java.util.*;
// Bitwise AND of Numbers Range：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        while (left < right) {
            right &= (right - 1);
        }
        return right;
    }
}
```

### Python

```python
# Bitwise AND of Numbers Range：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        while left < right:
            right &= right - 1
        return right
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

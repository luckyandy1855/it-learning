# 1201. Ugly Number III

---
编号: 1201
题目: Ugly Number III
难度: 中等
标签: [数学, 二分查找, 组合数学, 数论]
来源链接: https://leetcode.com/problems/ugly-number-iii/
---

## 题目描述

丑数是可以被 `a` **或** `b` **或** `c` 整除的 **正整数** 。

给你四个整数：`n` 、`a` 、`b` 、`c` ，请你设计一个算法来找出第 `n` 个丑数。

**示例 1：**

```text
输入：n = 3, a = 2, b = 3, c = 5
输出：4
解释：丑数序列为 2, 3, 4, 5, 6, 8, 9, 10... 其中第 3 个是 4。
```

**示例 2：**

```text
输入：n = 4, a = 2, b = 3, c = 4
输出：6
解释：丑数序列为 2, 3, 4, 6, 8, 9, 10, 12... 其中第 4 个是 6。
```

**示例 3：**

```text
输入：n = 5, a = 2, b = 11, c = 13
输出：10
解释：丑数序列为 2, 4, 6, 8, 10, 11, 12, 13... 其中第 5 个是 10。
```

**提示：**

- `1 <= n, a, b, c <= 10^9`

- `1 <= a * b * c <= 10^18`

- 本题结果在 `[1, 2 * 10^9]` 的范围内

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 二分查找, 组合数学, 数论」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以将题目转换为：找到最小的正整数 $x$，使得小于等于 $x$ 的丑数个数恰好为 $n$ 个。

对于一个正整数 $x$，能被 $a$ 整除的数有 $\left\lfloor \frac{x}{a} \right\rfloor$ 个，能被 $b$ 整除的数有 $\left\lfloor \frac{x}{b} \right\rfloor$ 个，能被 $c$ 整除的数有 $\left\lfloor \frac{x}{c} \right\rfloor$ 个，能被 $a$ 和 $b$ 同时整除的数有 $\left\lfloor \frac{x}{lcm(a, b)} \right\rfloor$ 个，能被 $a$ 和 $c$ 同时整除的数有 $\left\lfloor \frac{x}{lcm(a, c)} \right\rfloor$ 个，能被 $b$ 和 $c$ 同时整除的数有 $\left\lfloor \frac{x}{lcm(b, c)} \right\rfloor$ 个，能被 $a$, $b$ 和 $c$ 同时整除的数有 $\left\lfloor \frac{x}{lcm(a, b, c)} \right\rfloor$ 个。根据容斥原理，小于等于 $x$ 的丑数个数为：


\left\lfloor \frac{x}{a} \right\rfloor + \left\lfloor \frac{x}{b} \right\rfloor + \left\lfloor \frac{x}{c} \right\rfloor - \left\lfloor \frac{x}{lcm(a, b)} \right\rfloor - \left\lfloor \frac{x}{lcm(a, c)} \right\rfloor - \left\lfloor \frac{x}{lcm(b, c)} \right\rfloor + \left\lfloor \frac{x}{lcm(a, b, c)} \right\rfloor


我们可以使用二分查找的方法找到最小的正整数 $x$，使得小于等于 $x$ 的丑数个数恰好为 $n$ 个。

定义二分查找的左边界为 $l=1$，右边界为 $r=2 \times 10^9$，其中 $2 \times 10^9$ 是题目给定的最大值。在二分查找的每一步中，我们找出中间数 $mid$，如果小于等于 $mid$ 的丑数个数大于等于 $n$，那么说明最小的正整数 $x$ 落在 $[l,mid]$ 区间内，否则落在 $[mid+1,r]$ 区间内。在二分查找的过程中，我们需要不断更新小于等于 $mid$ 的丑数个数，直到找到最小的正整数 $x$。

时间复杂度 $O(\log m)$，其中 $m = 2 \times 10^9$。空间复杂度 $O(1)$。

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
// Ugly Number III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func nthUglyNumber(n int, a int, b int, c int) int {
	ab, bc, ac := lcm(a, b), lcm(b, c), lcm(a, c)
	abc := lcm(ab, c)
	var l, r int = 1, 2e9
	for l < r {
		mid := (l + r) >> 1
		if mid/a+mid/b+mid/c-mid/ab-mid/bc-mid/ac+mid/abc >= n {
			r = mid
		} else {
			l = mid + 1
		}
	}
	return l
}

func gcd(a, b int) int {
	if b == 0 {
		return a
	}
	return gcd(b, a%b)
}

func lcm(a, b int) int {
	return a * b / gcd(a, b)
}
```

### Java

```java
// Ugly Number III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int nthUglyNumber(int n, int a, int b, int c) {
        long ab = lcm(a, b);
        long bc = lcm(b, c);
        long ac = lcm(a, c);
        long abc = lcm(ab, c);
        long l = 1, r = 2000000000;
        while (l < r) {
            long mid = (l + r) >> 1;
            if (mid / a + mid / b + mid / c - mid / ab - mid / bc - mid / ac + mid / abc >= n) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return (int) l;
    }

    private long gcd(long a, long b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    private long lcm(long a, long b) {
        return a * b / gcd(a, b);
    }
}
```

### Python

```python
# Ugly Number III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def nthUglyNumber(self, n: int, a: int, b: int, c: int) -> int:
        ab = lcm(a, b)
        bc = lcm(b, c)
        ac = lcm(a, c)
        abc = lcm(a, b, c)
        l, r = 1, 2 * 10**9
        while l < r:
            mid = (l + r) >> 1
            if (
                mid // a
                + mid // b
                + mid // c
                - mid // ab
                - mid // bc
                - mid // ac
                + mid // abc
                >= n
            ):
                r = mid
            else:
                l = mid + 1
        return l
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

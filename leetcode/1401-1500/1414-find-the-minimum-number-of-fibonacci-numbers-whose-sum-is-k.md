# 1414. Find the Minimum Number of Fibonacci Numbers Whose Sum Is K

---
编号: 1414
题目: Find the Minimum Number of Fibonacci Numbers Whose Sum Is K
难度: 中等
标签: [贪心, 数学]
来源链接: https://leetcode.com/problems/find-the-minimum-number-of-fibonacci-numbers-whose-sum-is-k/
---

## 题目描述

给你数字 `k` ，请你返回和为 `k` 的斐波那契数字的最少数目，其中，每个斐波那契数字都可以被使用多次。

斐波那契数字定义为：

- F1 = 1

- F2 = 1

- Fn = Fn-1 + Fn-2 ， 其中 n > 2 。

数据保证对于给定的 `k` ，一定能找到可行解。

**示例 1：**

```text
输入：k = 7
输出：2
解释：斐波那契数字为：1，1，2，3，5，8，13，&hellip;&hellip;
对于 k = 7 ，我们可以得到 2 + 5 = 7 。
```

**示例 2：**

```text
输入：k = 10
输出：2
解释：对于 k = 10 ，我们可以得到 2 + 8 = 10 。
```

**示例 3：**

```text
输入：k = 19
输出：3
解释：对于 k = 19 ，我们可以得到 1 + 5 + 13 = 19 。
```

**提示：**

- `1 <= k <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以每次贪心地选取一个不超过 $k$ 的最大的斐波那契数，然后将 $k$ 减去该数，答案加一，一直循环，直到 $k = 0$ 为止。

由于每次贪心地选取了最大的不超过 $k$ 的斐波那契数，假设为 $b$，前一个数为 $a$，后一个数为 $c$。将 $k$ 减去 $b$，得到的结果，一定小于 $a$，也即意味着，我们选取了 $b$ 之后，一定不会选到 $a$。这是因为，如果能选上 $a$，那么我们在前面就可以贪心地选上 $b$ 的下一个斐波那契数 $c$，这不符合我们的假设。因此，我们在选取 $b$ 之后，可以贪心地减小斐波那契数。

时间复杂度 $O(\log k)$，空间复杂度 $O(1)$。

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
// Find the Minimum Number of Fibonacci Numbers Whose Sum Is K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMinFibonacciNumbers(k int) (ans int) {
	a, b := 1, 1
	for b <= k {
		c := a + b
		a = b
		b = c
	}

	for k > 0 {
		if k >= b {
			k -= b
			ans++
		}
		c := b - a
		b = a
		a = c
	}
	return
}
```

### Java

```java
// Find the Minimum Number of Fibonacci Numbers Whose Sum Is K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMinFibonacciNumbers(int k) {
        int a = 1, b = 1;
        while (b <= k) {
            int c = a + b;
            a = b;
            b = c;
        }
        int ans = 0;
        while (k > 0) {
            if (k >= b) {
                k -= b;
                ++ans;
            }
            int c = b - a;
            b = a;
            a = c;
        }
        return ans;
    }
}
```

### Python

```python
# Find the Minimum Number of Fibonacci Numbers Whose Sum Is K：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMinFibonacciNumbers(self, k: int) -> int:
        a = b = 1
        while b <= k:
            a, b = b, a + b
        ans = 0
        while k:
            if k >= b:
                k -= b
                ans += 1
            a, b = b - a, a
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

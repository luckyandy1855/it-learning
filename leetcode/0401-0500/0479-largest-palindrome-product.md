# 0479. Largest Palindrome Product

---
编号: 479
题目: Largest Palindrome Product
难度: 困难
标签: [数学, 枚举]
来源链接: https://leetcode.com/problems/largest-palindrome-product/
---

## 题目描述

给定一个整数 n ，返回 *可表示为两个 `n` 位整数乘积的 **最大回文整数*** 。因为答案可能非常大，所以返回它对 `1337` **取余** 。

示例 1：

```text
输入：n = 2
输出：987
解释：99 x 91 = 9009, 9009 % 1337 = 987
```

示例 2：

```text
输入：n = 1
输出：9
```

**提示:**

- `1 <= n <= 8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Largest Palindrome Product：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestPalindrome(n int) int {
	mx := int(math.Pow10(n)) - 1
	for a := mx; a > mx/10; a-- {
		x := a
		for b := a; b != 0; b /= 10 {
			x = x*10 + b%10
		}
		for t := mx; t*t >= x; t-- {
			if x%t == 0 {
				return x % 1337
			}
		}
	}
	return 9
}
```

### Java

```java
// Largest Palindrome Product：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int largestPalindrome(int n) {
        int mx = (int) Math.pow(10, n) - 1;
        for (int a = mx; a > mx / 10; --a) {
            int b = a;
            long x = a;
            while (b != 0) {
                x = x * 10 + b % 10;
                b /= 10;
            }
            for (long t = mx; t * t >= x; --t) {
                if (x % t == 0) {
                    return (int) (x % 1337);
                }
            }
        }
        return 9;
    }
}
```

### Python

```python
# Largest Palindrome Product：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestPalindrome(self, n: int) -> int:
        mx = 10**n - 1
        for a in range(mx, mx // 10, -1):
            b = x = a
            while b:
                x = x * 10 + b % 10
                b //= 10
            t = mx
            while t * t >= x:
                if x % t == 0:
                    return x % 1337
                t -= 1
        return 9
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

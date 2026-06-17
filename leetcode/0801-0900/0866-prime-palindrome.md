# 0866. Prime Palindrome

---
编号: 866
题目: Prime Palindrome
难度: 中等
标签: [数学, 数论]
来源链接: https://leetcode.com/problems/prime-palindrome/
---

## 题目描述

给你一个整数 `n` ，返回大于或等于 `n` 的最小 **回文质数**。

一个整数如果恰好有两个除数：`1` 和它本身，那么它是 **质数** 。注意，`1` 不是质数。

- 例如，`2`、`3`、`5`、`7`、`11` 和 `13` 都是质数。

一个整数如果从左向右读和从右向左读是相同的，那么它是** 回文数 **。

- 例如，`101` 和 `12321` 都是回文数。

测试用例保证答案总是存在，并且在 `[2, 2 * 10^8]` 范围内。

示例 1：

```text
输入：n = 6
输出：7
```

示例 2：

```text
输入：n = 8
输出：11
```

示例 3：

```text
输入：n = 13
输出：101
```

**提示：**

- `1 <= n <= 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 数论」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Prime Palindrome：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func primePalindrome(n int) int {
	isPrime := func(x int) bool {
		if x < 2 {
			return false
		}
		for v := 2; v*v <= x; v++ {
			if x%v == 0 {
				return false
			}
		}
		return true
	}

	reverse := func(x int) int {
		res := 0
		for x != 0 {
			res = res*10 + x%10
			x /= 10
		}
		return res
	}
	for {
		if reverse(n) == n && isPrime(n) {
			return n
		}
		if n > 10000000 && n < 100000000 {
			n = 100000000
		}
		n++
	}
}
```

### Java

```java
// Prime Palindrome：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int primePalindrome(int n) {
        while (true) {
            if (reverse(n) == n && isPrime(n)) {
                return n;
            }
            if (n > 10000000 && n < 100000000) {
                n = 100000000;
            }
            ++n;
        }
    }

    private boolean isPrime(int x) {
        if (x < 2) {
            return false;
        }
        for (int v = 2; v * v <= x; ++v) {
            if (x % v == 0) {
                return false;
            }
        }
        return true;
    }

    private int reverse(int x) {
        int res = 0;
        while (x != 0) {
            res = res * 10 + x % 10;
            x /= 10;
        }
        return res;
    }
}
```

### Python

```python
# Prime Palindrome：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def primePalindrome(self, n: int) -> int:
        def is_prime(x):
            if x < 2:
                return False
            v = 2
            while v * v <= x:
                if x % v == 0:
                    return False
                v += 1
            return True

        def reverse(x):
            res = 0
            while x:
                res = res * 10 + x % 10
                x //= 10
            return res

        while 1:
            if reverse(n) == n and is_prime(n):
                return n
            if 10**7 < n < 10**8:
                n = 10**8
            n += 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

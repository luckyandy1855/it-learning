# 0070. Climbing Stairs

---
编号: 70
题目: Climbing Stairs
难度: 简单
标签: [记忆化, 数学, 动态规划]
来源链接: https://leetcode.com/problems/climbing-stairs/
---

## 题目描述

你正在爬楼梯，需要 n 阶才能到达顶部。每次可以爬 1 步或 2 步。问有多少种不同的方法爬到顶部？

### Example 1

```text
Input: n = 2
Output: 2
Explanation: 有两种方法：1+1 或 2
```

### Example 2

```text
Input: n = 3
Output: 3
Explanation: 有三种方法：1+1+1、1+2 或 2+1
```

### 约束条件

- `1 <= n <= 45`

## 思路分析

### 突破口

经典 DP / 斐波那契数列：爬到第 n 阶的方法数 = 从 n-1 阶爬 1 步 + 从 n-2 阶爬 2 步，即 `f(n) = f(n-1) + f(n-2)`。

### 思路拆解

1. **状态定义**：`dp[i]` = 爬到第 i 阶的方法数。

2. **状态转移**：`dp[i] = dp[i-1] + dp[i-2]`。

3. **边界条件**：`dp[1] = 1, dp[2] = 2`（或 `dp[0]=1, dp[1]=1`，视起点定义）。

4. **空间优化**：只需前两个值，用两个变量滚动更新。

### 示意图

```text
n: 1  2  3  4  5  6  7
f: 1  2  3  5  8  13 21

这正是斐波那契数列（从1,2开始）
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 滚动 DP | O(n) | O(1) |

## 代码实现

### Go

```go
// climbStairs 返回爬到 n 阶顶部的不同方法数
func climbStairs(n int) int {
    if n <= 2 {
        return n
    }
    prev, curr := 1, 2
    for i := 3; i <= n; i++ {
        prev, curr = curr, prev+curr
    }
    return curr
}
```

### Java

```java
class Solution {
    /**
     * 返回爬到 n 阶顶部的不同方法数（斐波那契滚动 DP）。
     */
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev = 1, curr = 2;
        for (int i = 3; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }
}
```

### Python

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        返回爬到 n 阶顶部的不同方法数（斐波那契滚动 DP）。
        """
        if n <= 2:
            return n
        prev, curr = 1, 2
        for _ in range(3, n + 1):
            prev, curr = curr, prev + curr
        return curr
```

## 踩坑记录

- **边界：n=1 和 n=2**：`f(1)=1, f(2)=2`，滚动变量初始化为 `(1, 2)` 时，`for i in range(3, n+1)` 对 n<3 的情况不执行，直接用初始值返回——但要先处理 n=1 的情况（返回 1 不是 2），所以加了 `if n <= 2: return n`。
- **数值不会溢出**：n≤45 时 `f(45)=1134903170`，在 int32 范围内（约 `2.1×10^9`），Go 和 Java 均可用 int。
- **与 0509 Fibonacci Number 对比**：本题的初始条件 `f(1)=1, f(2)=2` 等价于 Fibonacci 的 `f(2)=1, f(3)=2`（即 Fibonacci 的 `f(n+1)`），二者本质相同。

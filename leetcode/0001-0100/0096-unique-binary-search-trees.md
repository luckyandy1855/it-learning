# 0096. Unique Binary Search Trees

---
编号: 96
题目: Unique Binary Search Trees
难度: 中等
标签: [树, 二叉搜索树, 数学, 动态规划, 二叉树]
来源链接: https://leetcode.com/problems/unique-binary-search-trees/
---

## 题目描述

给定整数 `n`，返回恰好由 `n` 个节点（节点值 1 到 n）组成的**结构不同的二叉搜索树**的数量。

### Example 1

```text
Input: n = 3
Output: 5
```

### Example 2

```text
Input: n = 1
Output: 1
```

### 约束条件

- `1 <= n <= 19`

## 思路分析

### 突破口

DP + Catalan 数：`G(n)` = n 个节点的 BST 总数，以每个节点 `i` 为根时左子树有 `i-1` 个节点，右子树有 `n-i` 个节点，两者结构数相乘并累加。

### 思路拆解

1. **状态定义**：`dp[i]` = 用 i 个节点构成的不同 BST 数量。

2. **状态转移**：`dp[n] = Σ dp[i-1] * dp[n-i]`，i 从 1 到 n（枚举根节点）。

3. **边界**：`dp[0] = 1`（空树算 1 种），`dp[1] = 1`。

4. **Catalan 数公式**：`C_n = C(2n, n) / (n+1)`，可直接计算，但 DP 更直观。

### 示意图

```text
dp[0]=1, dp[1]=1
dp[2]: i=1: dp[0]*dp[1]=1; i=2: dp[1]*dp[0]=1 → dp[2]=2
dp[3]: i=1: dp[0]*dp[2]=2; i=2: dp[1]*dp[1]=1; i=3: dp[2]*dp[0]=2 → dp[3]=5

Catalan 数列: 1, 1, 2, 5, 14, 42, 132...
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| DP | O(n²) | O(n) |

## 代码实现

### Go

```go
// numTrees 返回 n 个节点构成的不同 BST 数量（Catalan 数）
func numTrees(n int) int {
    dp := make([]int, n+1)
    dp[0] = 1 // 空树算 1 种

    for i := 1; i <= n; i++ {
        for j := 1; j <= i; j++ {
            dp[i] += dp[j-1] * dp[i-j] // 以 j 为根，左有 j-1 个节点，右有 i-j 个
        }
    }
    return dp[n]
}
```

### Java

```java
class Solution {
    /**
     * 返回 n 个节点构成的不同 BST 数量（DP，Catalan 数）。
     */
    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;

        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= i; j++)
                dp[i] += dp[j - 1] * dp[i - j];

        return dp[n];
    }
}
```

### Python

```python
class Solution:
    def numTrees(self, n: int) -> int:
        """
        返回 n 个节点构成的不同 BST 数量（DP，Catalan 数）。
        """
        dp = [0] * (n + 1)
        dp[0] = 1

        for i in range(1, n + 1):
            for j in range(1, i + 1):
                dp[i] += dp[j - 1] * dp[i - j]  # j 为根，左 j-1 个，右 i-j 个

        return dp[n]
```

## 踩坑记录

- **`dp[0] = 1` 的语义**：空子树只有 1 种结构，是数学上的约定（Catalan 数的边界条件），使得公式 `dp[i-1] * dp[n-i]` 在 i=1 或 i=n 时也能正确处理（左/右子树为空）。
- **与 0095 区别**：本题只需计数，无需构造具体树，用 DP 的 O(n²) 即可；0095 需要构造所有树，时间复杂度为 O(Catalan(n) × n)。
- **Catalan 数快速计算**：`C_n = C(2n,n)/(n+1)`，对 n=19 结果为 1767263190，在 int32 范围内；但计算过程中的中间值会溢出，DP 方法更安全。

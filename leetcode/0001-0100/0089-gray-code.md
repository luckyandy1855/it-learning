# 0089. Gray Code

---
编号: 89
题目: Gray Code
难度: 中等
标签: [位运算, 数学, 回溯]
来源链接: https://leetcode.com/problems/gray-code/
---

## 题目描述

**n 位格雷码序列**是一个由 2^n 个整数组成的序列，满足：
- 每个整数都在范围 `[0, 2^n - 1]` 内（含）
- 第一个整数是 0
- 每个相邻的整数恰好只有一位二进制数字不同
- 第一个和最后一个整数恰好也只有一位二进制数字不同

给定整数 `n`，返回任一有效的 n 位格雷码序列。

### Example 1

```text
Input: n = 2
Output: [0,1,3,2]
Explanation: 
  00 → 01 → 11 → 10（每步只改变一位）
```

### Example 2

```text
Input: n = 1
Output: [0,1]
```

### 约束条件

- `1 <= n <= 16`

## 思路分析

### 突破口

公式法：第 i 个格雷码 = `i ^ (i >> 1)`。这是从二进制转格雷码的标准公式。

### 思路拆解

1. **直接公式**：`gray[i] = i ^ (i >> 1)`，遍历 0 到 2^n-1。

2. **递推法（理解格雷码生成）**：n 位格雷码由 n-1 位格雷码镜像生成——先列出 n-1 位序列，再倒序在每个数前加 `1`（相当于加 2^(n-1)）。

### 示意图

```text
公式法:
n=2, 生成 [0, 1, 2, 3] 的格雷码:
  i=0: 0 ^ (0>>1) = 0 ^ 0 = 0
  i=1: 1 ^ (1>>1) = 1 ^ 0 = 1
  i=2: 2 ^ (2>>1) = 10 ^ 01 = 11 = 3
  i=3: 3 ^ (3>>1) = 11 ^ 01 = 10 = 2

输出: [0, 1, 3, 2]

递推法 (n=3 从 n=2 生成):
n=2: [0,1,3,2]
镜像: [2,3,1,0]
加2^2=4: [6,7,5,4]
拼接: [0,1,3,2, 6,7,5,4]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 公式法 | O(2^n) | O(2^n) |

## 代码实现

### Go

```go
// grayCode 返回 n 位格雷码序列
func grayCode(n int) []int {
    size := 1 << n
    result := make([]int, size)
    for i := 0; i < size; i++ {
        result[i] = i ^ (i >> 1) // 公式：二进制转格雷码
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回 n 位格雷码序列（公式法）。
     */
    public List<Integer> grayCode(int n) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < (1 << n); i++) {
            result.add(i ^ (i >> 1));
        }
        return result;
    }
}
```

### Python

```python
class Solution:
    def grayCode(self, n: int) -> list[int]:
        """
        返回 n 位格雷码序列（公式法：i ^ (i>>1)）。
        """
        return [i ^ (i >> 1) for i in range(1 << n)]
```

## 踩坑记录

- **公式 `i ^ (i >> 1)` 来源**：将二进制数 `b[n]b[n-1]...b[1]b[0]` 转为格雷码 `g[n]g[n-1]...g[1]g[0]`，规则为 `g[i] = b[i] ^ b[i+1]`，等价于 `i ^ (i >> 1)`。
- **递推法的对称性**：n 位格雷码的后半段是前半段的镜像（对称），唯一区别是第 n 位（最高位）为 1；这保证了序列首尾也只差一位（可绕一圈）。
- **n=16 时 2^16=65536**：结果数组长度固定，Java 的 `ArrayList` 可以用 `new ArrayList<>(1<<n)` 预分配容量避免扩容。

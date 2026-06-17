# 0069. Sqrt(x)

---
编号: 69
题目: Sqrt(x)
难度: 简单
标签: [数学, 二分查找]
来源链接: https://leetcode.com/problems/sqrtx/
---

## 题目描述

给定非负整数 `x`，计算并返回 `x` 的**算术平方根**（向下取整的整数部分）。不允许使用内置的 `sqrt` 函数或幂运算符。

### Example 1

```text
Input: x = 4
Output: 2
```

### Example 2

```text
Input: x = 8
Output: 2
Explanation: √8 = 2.82..., 向下取整为 2
```

### 约束条件

- `0 <= x <= 2^31 - 1`

## 思路分析

### 突破口

在 `[0, x]` 上二分搜索：找最大的 `m` 满足 `m*m <= x`。

### 思路拆解

1. **二分范围**：`lo=0, hi=x`；答案上界是 `x/2+1`（x≥4 时成立，x<4 单独处理也可统一）。

2. **中值判断**：若 `mid*mid <= x`，记录 `ans=mid` 并向右搜索（`lo=mid+1`）；否则向左（`hi=mid-1`）。

3. **溢出防护**：`mid*mid` 可能超出 int32 范围，Go/Java 用 int64，Python 无溢出问题。

### 示意图

```text
x = 8, lo=0, hi=8
mid=4: 4*4=16>8 → hi=3
mid=1: 1*1=1<=8 → ans=1, lo=2
mid=2: 2*2=4<=8 → ans=2, lo=3
mid=3: 3*3=9>8 → hi=2
lo>hi, 退出, 返回 ans=2
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 二分搜索 | O(log x) | O(1) |

## 代码实现

### Go

```go
// mySqrt 返回 x 的算术平方根向下取整的整数部分
func mySqrt(x int) int {
    if x < 2 {
        return x
    }
    lo, hi, ans := 0, x/2+1, 0

    for lo <= hi {
        mid := lo + (hi-lo)/2
        if mid*mid <= x { // Go int64 无溢出（64位系统）
            ans = mid
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return ans
}
```

### Java

```java
class Solution {
    /**
     * 返回 x 的算术平方根向下取整的整数部分（二分搜索）。
     */
    public int mySqrt(int x) {
        if (x < 2) return x;
        int lo = 0, hi = x / 2 + 1, ans = 0;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            long sq = (long) mid * mid; // 防止 int 溢出
            if (sq <= x) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        """
        返回 x 的算术平方根向下取整的整数部分（二分搜索）。
        """
        if x < 2:
            return x

        lo, hi, ans = 0, x // 2 + 1, 0
        while lo <= hi:
            mid = (lo + hi) // 2
            if mid * mid <= x:
                ans = mid
                lo = mid + 1
            else:
                hi = mid - 1

        return ans
```

## 踩坑记录

- **Java 中 `mid*mid` 溢出**：x 最大为 `2^31-1 ≈ 2.1×10^9`，`mid` 最大约 `4.6×10^4`，`mid*mid` 最大约 `2.1×10^9`，恰好接近 `int` 上界，需要用 `(long)mid * mid`。
- **`hi = x/2+1` 而非 `hi = x`**：对 x≥4，其平方根不超过 `x/2`，缩小搜索范围加速。但加 1 是为了处理 `x=0,1,2,3` 等边界，或者直接对 `x<2` 单独处理后 `hi=x/2+1` 更简洁。
- **牛顿迭代法（进阶）**：`x_new = (x_old + n/x_old) / 2`，收敛更快，但实现需要注意浮点精度。

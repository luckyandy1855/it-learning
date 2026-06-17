# 0066. Plus One

---
编号: 66
题目: Plus One
难度: 简单
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/plus-one/
---

## 题目描述

给定一个用**整数数组**表示的非负大整数（最高位在数组首部，每位对应一个数组元素），将该整数加一并返回结果数组。

整数不含前导零，整数本身不会是 0。

### Example 1

```text
Input: digits = [1,2,3]
Output: [1,2,4]
```

### Example 2

```text
Input: digits = [4,3,2,1]
Output: [4,3,2,2]
```

### Example 3

```text
Input: digits = [9]
Output: [1,0]
```

### 约束条件

- `1 <= digits.length <= 100`
- `0 <= digits[i] <= 9`
- digits 不含前导零

## 思路分析

### 突破口

从末位开始向前处理进位：若当前位 < 9，直接加一返回；若为 9，置 0 并继续向前进位；最终全为 9 时（如 `[9,9,9]`），在首部插入 1。

### 思路拆解

1. **从后向前遍历**：遇到非 9 的位，加一后直接返回。

2. **遇 9 则置 0 并继续**：进位传播。

3. **全部为 9 时**：循环结束后数组全为 0，在首部插入 1（结果数组长度 +1）。

### 示意图

```text
digits = [9, 9, 9]
  i=2: 9→0, 进位
  i=1: 9→0, 进位
  i=0: 9→0, 进位
  循环结束: digits=[0,0,0]
  返回 [1,0,0,0]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 从后向前扫描 | O(n) | O(1)（最坏 O(n) 扩容） |

## 代码实现

### Go

```go
// plusOne 将数字数组表示的大整数加一
func plusOne(digits []int) []int {
    for i := len(digits) - 1; i >= 0; i-- {
        if digits[i] < 9 {
            digits[i]++
            return digits
        }
        digits[i] = 0 // 该位为9，置0并进位
    }
    // 所有位都是9，在首部插入1
    return append([]int{1}, digits...)
}
```

### Java

```java
class Solution {
    /**
     * 将数字数组表示的大整数加一。
     */
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        // 所有位均为9，新建数组首位插1
        int[] result = new int[digits.length + 1];
        result[0] = 1;
        return result;
    }
}
```

### Python

```python
class Solution:
    def plusOne(self, digits: list[int]) -> list[int]:
        """
        将数字数组表示的大整数加一。
        """
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0  # 进位

        return [1] + digits  # 全为9的情况
```

## 踩坑记录

- **全为 9 的情况单独处理**：循环结束时数组元素已全变为 0，Python 可用 `[1] + digits`，Go 用 `append([]int{1}, digits...)`，Java 新建长度加一的数组。
- **不需要转换为整数再计算**：题目的整数可能超过 int64 上限（100 位），直接操作数组位更安全。
- **Go `append([]int{1}, digits...)` 的性能**：只有 n=100 时才会扩容，通常不到这一步（全 9 情况罕见），可以接受。

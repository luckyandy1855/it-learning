# 0060. Permutation Sequence

---
编号: 60
题目: Permutation Sequence
难度: 困难
标签: [递归, 数学]
来源链接: https://leetcode.com/problems/permutation-sequence/
---

## 题目描述

给定 n 和 k，返回数字 1 到 n 所有排列的字典序第 k 个排列（k 从 1 开始编号）。

### Example 1

```text
Input: n=3, k=3
Output: "213"
Explanation: 排列顺序：123, 132, 213, 231, 312, 321，第3个是 "213"
```

### Example 2

```text
Input: n=4, k=9
Output: "2314"
```

### Example 3

```text
Input: n=3, k=1
Output: "123"
```

### 约束条件

- `1 <= n <= 9`
- `1 <= k <= n!`

## 思路分析

### 突破口

数学推导而非枚举所有排列：n 个数字的全排列可以按首位分为 n 组，每组有 `(n-1)!` 个排列。根据 k 确定每一位选哪个数字。

### 思路拆解

1. **确定当前位**：剩余数字有 `m` 个，每 `(m-1)!` 个一组，第 `(k-1) / (m-1)!` 个数字就是当前位（0 索引）。

2. **更新 k**：`k = (k-1) % (m-1)! + 1`（换算到子排列中的第 k 个）。

3. **维护候选数字**：从 `[1, 2, ..., n]` 中每次选出并移除对应数字。

### 示意图

```text
n=4, k=9
factorial: [1,1,2,6]
digits: [1,2,3,4]

第1位: idx=(9-1)/6=1 → 选 digits[1]=2, 剩 [1,3,4], k=(9-1)%6+1=3
第2位: idx=(3-1)/2=1 → 选 digits[1]=3, 剩 [1,4], k=(3-1)%2+1=1
第3位: idx=(1-1)/1=0 → 选 digits[0]=1, 剩 [4], k=(1-1)%1+1=1
第4位: idx=0 → 选 digits[0]=4

结果: "2314"
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 数学推导 | O(n²) | O(n) |

## 代码实现

### Go

```go
import "strconv"

// getPermutation 返回 1..n 所有排列的字典序第 k 个
func getPermutation(n int, k int) string {
    // 预计算阶乘
    factorial := make([]int, n+1)
    factorial[0] = 1
    for i := 1; i <= n; i++ {
        factorial[i] = factorial[i-1] * i
    }

    // 候选数字 [1..n]
    digits := make([]int, n)
    for i := range digits {
        digits[i] = i + 1
    }

    k-- // 转为 0 索引
    result := make([]byte, 0, n)
    for i := n; i >= 1; i-- {
        idx := k / factorial[i-1]
        result = append(result, byte('0'+digits[idx]))
        digits = append(digits[:idx], digits[idx+1:]...)
        k %= factorial[i-1]
    }
    return string(result)
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回 1..n 所有排列的字典序第 k 个。
     */
    public String getPermutation(int n, int k) {
        int[] factorial = new int[n + 1];
        factorial[0] = 1;
        for (int i = 1; i <= n; i++) factorial[i] = factorial[i - 1] * i;

        List<Integer> digits = new ArrayList<>();
        for (int i = 1; i <= n; i++) digits.add(i);

        k--; // 转为 0 索引
        StringBuilder sb = new StringBuilder();
        for (int i = n; i >= 1; i--) {
            int idx = k / factorial[i - 1];
            sb.append(digits.get(idx));
            digits.remove(idx);
            k %= factorial[i - 1];
        }
        return sb.toString();
    }
}
```

### Python

```python
from math import factorial

class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        """
        返回 1..n 所有排列的字典序第 k 个。
        """
        digits = list(range(1, n + 1))
        k -= 1  # 转为 0 索引
        result = []

        for i in range(n, 0, -1):
            idx = k // factorial(i - 1)
            result.append(str(digits[idx]))
            digits.pop(idx)
            k %= factorial(i - 1)

        return ''.join(result)
```

## 踩坑记录

- **k 先减 1 转为 0 索引**：否则整除计算偏移，每组末尾的排列会定位到下一组的首位。
- **每次从候选列表移除选出的数字**：Go 中切片删除元素 `append(digits[:idx], digits[idx+1:]...)` 会修改原切片，注意不要在外层保留旧引用。
- **Java `List.remove(int)` vs `List.remove(Integer)`**：`digits.remove(idx)` 传入 `int` 时调用的是按索引删除，正确；若传入 `Integer` 会按值删除，行为不同。

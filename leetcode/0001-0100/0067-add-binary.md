# 0067. Add Binary

---
编号: 67
题目: Add Binary
难度: 简单
标签: [位运算, 数学, 字符串, 模拟]
来源链接: https://leetcode.com/problems/add-binary/
---

## 题目描述

给定两个二进制字符串 `a` 和 `b`，返回它们的二进制和（也以字符串形式返回）。

### Example 1

```text
Input: a = "11", b = "1"
Output: "100"
```

### Example 2

```text
Input: a = "1010", b = "1011"
Output: "10101"
```

### 约束条件

- `1 <= a.length, b.length <= 10^4`
- `a` 和 `b` 仅由字符 `'0'` 和 `'1'` 组成
- 输入不含前导零（除了字符串 `"0"` 本身）

## 思路分析

### 突破口

从末位开始相加，维护进位 `carry`，结果反向构造，与十进制加法类似。

### 思路拆解

1. **双指针从尾部向前**：`i = len(a)-1, j = len(b)-1`，每次取各自末位（越界则视为 0）。

2. **逐位计算**：`sum = a[i] + b[j] + carry`；当前位 = `sum % 2`；进位 = `sum / 2`。

3. **翻转结果**：从末位到首位构造，最后翻转字符串。

4. **处理最后进位**：两字符串扫完后若 `carry == 1`，补一个 `'1'`。

### 示意图

```text
a = "1010", b = "1011"
i=3,j=3: 0+1+0=1, bit=1, carry=0
i=2,j=2: 1+1+0=2, bit=0, carry=1
i=1,j=1: 0+0+1=1, bit=1, carry=0
i=0,j=0: 1+1+0=2, bit=0, carry=1
carry=1 → 补 '1'

结果: "10101"
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 模拟竖式加法 | O(max(m,n)) | O(max(m,n)) |

## 代码实现

### Go

```go
// addBinary 返回两个二进制字符串相加的结果
func addBinary(a string, b string) string {
    i, j := len(a)-1, len(b)-1
    carry := 0
    result := []byte{}

    for i >= 0 || j >= 0 || carry > 0 {
        sum := carry
        if i >= 0 {
            sum += int(a[i] - '0')
            i--
        }
        if j >= 0 {
            sum += int(b[j] - '0')
            j--
        }
        result = append(result, byte(sum%2)+'0')
        carry = sum / 2
    }

    // 翻转
    for l, r := 0, len(result)-1; l < r; l, r = l+1, r-1 {
        result[l], result[r] = result[r], result[l]
    }
    return string(result)
}
```

### Java

```java
class Solution {
    /**
     * 返回两个二进制字符串相加的结果。
     */
    public String addBinary(String a, String b) {
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        StringBuilder sb = new StringBuilder();

        while (i >= 0 || j >= 0 || carry > 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            sb.append((char) ('0' + sum % 2));
            carry = sum / 2;
        }
        return sb.reverse().toString();
    }
}
```

### Python

```python
class Solution:
    def addBinary(self, a: str, b: str) -> str:
        """
        返回两个二进制字符串相加的结果。
        """
        i, j, carry = len(a) - 1, len(b) - 1, 0
        result = []

        while i >= 0 or j >= 0 or carry:
            s = carry
            if i >= 0:
                s += int(a[i]); i -= 1
            if j >= 0:
                s += int(b[j]); j -= 1
            result.append(str(s % 2))
            carry = s // 2

        return ''.join(reversed(result))
```

## 踩坑记录

- **循环条件包含 `carry > 0`**：两字符串都扫完后若还有进位（如 `"1" + "1"` = `"10"`），需要再输出一位。
- **结果从低位到高位构造，最后翻转**：直接 `append` 比从头插入效率更高（O(1) vs O(n)）。
- **越界处理**：两字符串长度不同，短字符串先越界时视对应位为 0，用 `if i >= 0` 控制即可。

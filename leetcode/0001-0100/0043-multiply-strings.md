# 0043. Multiply Strings

---
编号: 43
题目: Multiply Strings
难度: 中等
标签: [数学, 字符串, 模拟]
来源链接: https://leetcode.com/problems/multiply-strings/
---

## 题目描述

给定两个以字符串形式表示的非负整数 `num1` 和 `num2`，返回其乘积（也以字符串形式表示）。

题目要求：

- **不能使用任何内建的大整数库或直接将输入转换为整数**。

### Example 1

```text
Input: num1 = "2", num2 = "3"
Output: "6"
```

### Example 2

```text
Input: num1 = "123", num2 = "456"
Output: "56088"
```

### 约束条件

- `1 <= num1.length, num2.length <= 200`
- `num1` 和 `num2` 只含数字 `'0'-'9'`。
- 除 `"0"` 本身外，两个数字均不含前导零。

## 思路分析

### 突破口

模拟竖式乘法：`num1[i] * num2[j]` 的结果（两位数）会影响结果数组的第 `i+j` 和 `i+j+1` 位（从右往左计数，即从末位开始）。

### 思路拆解

1. **竖式乘法**：对 `num1` 的每一位和 `num2` 的每一位分别相乘，结果累加到对应位置。`num1[i]` 和 `num2[j]` 的乘积写入结果数组的 `i+j+1` 位（低位），进位写入 `i+j` 位（高位）。

2. **结果数组大小**：两个 m、n 位数的乘积最多 m+n 位，所以结果数组长度为 `m+n`。

3. **处理进位和前导零**：所有乘法完成后，从低位到高位处理进位；去掉前导零（结果为 0 时保留单个 "0"）。

### 示意图

```text
num1 = "123", num2 = "456"   (结果数组长度=3+3=6)

  i=2(3) × j=2(6): pos=4,5, 18 → pos[5]+=8, pos[4]+=1
  i=2(3) × j=1(5): pos=3,4, 15 → pos[4]+=5, pos[3]+=1
  i=2(3) × j=0(4): pos=2,3, 12 → pos[3]+=2, pos[2]+=1
  i=1(2) × j=2(6): pos=3,4, 12 → pos[4]+=2, pos[3]+=1
  ...
  累加后处理进位，转字符串，去前导0
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 竖式乘法 | O(m×n) | O(m+n) |

## 代码实现

### Go

```go
import "strings"

// multiply 将两个字符串表示的非负整数相乘，返回字符串结果
// 参数：num1, num2 字符串形式的非负整数
// 返回：乘积的字符串表示
func multiply(num1 string, num2 string) string {
    if num1 == "0" || num2 == "0" {
        return "0"
    }

    m, n := len(num1), len(num2)
    pos := make([]int, m+n) // 结果各位存储（未处理进位）

    // 从低位到高位逐位相乘，累加到对应位置
    for i := m - 1; i >= 0; i-- {
        for j := n - 1; j >= 0; j-- {
            mul := int(num1[i]-'0') * int(num2[j]-'0')
            p1, p2 := i+j, i+j+1
            sum := mul + pos[p2]
            pos[p2] = sum % 10
            pos[p1] += sum / 10
        }
    }

    // 转字符串，跳过前导零
    var sb strings.Builder
    for _, v := range pos {
        if sb.Len() == 0 && v == 0 {
            continue // 跳过前导零
        }
        sb.WriteByte(byte('0' + v))
    }
    return sb.String()
}
```

### Java

```java
class Solution {
    /**
     * 将两个字符串表示的非负整数相乘，返回字符串结果。
     *
     * @param num1 字符串形式的非负整数
     * @param num2 字符串形式的非负整数
     * @return 乘积的字符串表示
     */
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) return "0";

        int m = num1.length(), n = num2.length();
        int[] pos = new int[m + n];

        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
                int p1 = i + j, p2 = i + j + 1;
                int sum = mul + pos[p2];
                pos[p2] = sum % 10;
                pos[p1] += sum / 10;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int v : pos) {
            if (sb.length() == 0 && v == 0) continue;
            sb.append(v);
        }
        return sb.toString();
    }
}
```

### Python

```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        """
        将两个字符串表示的非负整数相乘，返回字符串结果。

        参数:
            num1, num2: 字符串形式的非负整数
        返回:
            乘积的字符串表示
        """
        if num1 == '0' or num2 == '0':
            return '0'

        m, n = len(num1), len(num2)
        pos = [0] * (m + n)

        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                mul = int(num1[i]) * int(num2[j])
                p1, p2 = i + j, i + j + 1
                s = mul + pos[p2]
                pos[p2] = s % 10
                pos[p1] += s // 10

        result = ''.join(str(v) for v in pos).lstrip('0')
        return result or '0'
```

## 踩坑记录

- **两位数乘积的进位写入 `p1 = i+j`**：`p2 = i+j+1` 是低位，进位写 `p1 = i+j`（高位），不是 `p1 = i+j-1`。
- **先处理 p2，再用 sum 更新 p1**：`sum = mul + pos[p2]`，然后 `pos[p2] = sum % 10; pos[p1] += sum / 10`，顺序不能颠倒。
- **任一为 "0" 直接返回 "0"**：提前特判避免结果数组全零后输出空字符串的问题。

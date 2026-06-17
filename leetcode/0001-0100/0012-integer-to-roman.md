# 0012. Integer to Roman

---
编号: 12
题目: Integer to Roman
难度: 中等
标签: [哈希表, 数学, 字符串]
来源链接: https://leetcode.com/problems/integer-to-roman/
---

## 题目描述

给定一个整数，将其转换为**罗马数字**。

罗马数字由以下符号构成：

| 符号 | 值 |
|------|----|
| I    | 1  |
| V    | 5  |
| X    | 10 |
| L    | 50 |
| C    | 100 |
| D    | 500 |
| M    | 1000 |

特殊减法规则（共 6 种）：

| 符号 | 值 |
|------|----|
| IV   | 4  |
| IX   | 9  |
| XL   | 40 |
| XC   | 90 |
| CD   | 400 |
| CM   | 900 |

题目保证：

- 输入范围 `[1, 3999]`。

### Example 1

```text
Input: num = 3749
Output: "MMMDCCXLIX"
Explanation: 3000=MMM, 700=DCC, 40=XL, 9=IX → MMMDCCXLIX
```

### Example 2

```text
Input: num = 58
Output: "LVIII"
Explanation: 50=L, 5=V, 3=III
```

### 约束条件

- `1 <= num <= 3999`

## 思路分析

### 突破口

将所有 13 种值（含减法特殊情况）从大到小排列，贪心地用尽可能大的罗马数字符号，直到 num 归零。

### 思路拆解

1. **枚举每一位**：分别处理千位、百位、十位、个位，每位有 1/4/5/9 四种情况，逻辑类似但重复。代码冗长。

2. **贪心 + 预置对照表（推荐）**：预先将 13 对 `{值, 符号}` 按值降序排列，每次从最大值开始，尽可能多次减去该值并追加符号，直到无法减为止，再移到下一个更小的值。

3. **实现要点**：减法规则（IV、IX 等）已内置在预置表中，处理方式与普通符号完全一致，不需要特判。

### 示意图

```text
num = 1994

对照表（部分）: 1000=M, 900=CM, 500=D, 400=CD, ...

1994 >= 1000 → "M",   num=994
994  >= 900  → "CM",  num=94
94   >= 90   → "XC",  num=4
4    >= 4    → "IV",  num=0

结果: "MCMXCIV"
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 贪心预置表 | O(1)（最多循环 15 次左右） | O(1) |

## 代码实现

### Go

```go
import "strings"

// intToRoman 将整数转换为罗马数字字符串
// 参数：num 范围 [1, 3999] 的整数
// 返回：对应的罗马数字字符串
func intToRoman(num int) string {
    // 预置对照表：13 对值和符号，按值从大到小排列（含减法特殊情况）
    vals := []int{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1}
    syms := []string{"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"}

    var sb strings.Builder
    for i, v := range vals {
        // 尽可能多次减去当前值
        for num >= v {
            sb.WriteString(syms[i])
            num -= v
        }
    }
    return sb.String()
}
```

### Java

```java
class Solution {
    /**
     * 将整数转换为罗马数字字符串。
     *
     * @param num 范围 [1, 3999] 的整数
     * @return 对应的罗马数字字符串
     */
    public String intToRoman(int num) {
        int[] vals    = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
        String[] syms = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < vals.length; i++) {
            while (num >= vals[i]) {
                sb.append(syms[i]);
                num -= vals[i];
            }
        }
        return sb.toString();
    }
}
```

### Python

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        """
        将整数转换为罗马数字字符串。

        参数:
            num: 范围 [1, 3999] 的整数
        返回:
            对应的罗马数字字符串
        """
        vals  = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
        syms  = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]

        result = []
        for v, s in zip(vals, syms):
            while num >= v:
                result.append(s)
                num -= v
        return ''.join(result)
```

## 踩坑记录

- **减法规则不需要特判**：只需把 `IV=4`、`IX=9` 等作为独立条目放进预置表，贪心过程自然处理，不需要额外逻辑。
- **顺序必须从大到小**：若对照表顺序乱了（如 `I` 排在 `IV` 前），`4` 会被错误地转成 `IIII` 而不是 `IV`。
- **输入上界 3999**：4000 对应 `MMMM`，超出标准罗马数字范围，题目保证不会给出。

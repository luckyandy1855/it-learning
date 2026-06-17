# 0013. Roman to Integer

---
编号: 13
题目: Roman to Integer
难度: 简单
标签: [哈希表, 数学, 字符串]
来源链接: https://leetcode.com/problems/roman-to-integer/
---

## 题目描述

给定一个罗马数字字符串 `s`，将其转换为整数。

罗马数字规则：通常从大到小写，但以下 6 种情况小符号在前表示减法：

| 符号 | 值 |
|------|----|
| IV   | 4  |
| IX   | 9  |
| XL   | 40 |
| XC   | 90 |
| CD   | 400 |
| CM   | 900 |

### Example 1

```text
Input: s = "III"
Output: 3
```

### Example 2

```text
Input: s = "LVIII"
Output: 58
Explanation: L=50, V=5, III=3
```

### Example 3

```text
Input: s = "MCMXCIV"
Output: 1994
Explanation: M=1000, CM=900, XC=90, IV=4
```

### 约束条件

- `1 <= s.length <= 15`
- `s` 只含字符 `I V X L C D M`。
- `s` 是有效的罗马数字，范围 `[1, 3999]`。

## 思路分析

### 突破口

从左到右扫描，若当前字符对应的值**小于右边字符**，则减去当前值（减法规则）；否则加上当前值。

### 思路拆解

1. **预处理对照表**：建立字符到值的映射（`I=1, V=5, X=10, ...`）。

2. **从左到右扫描**：比较当前字符值与下一字符值，若当前 < 下一个，减去当前值；否则加上当前值。

3. **最后一个字符**：最后一个字符右边无字符，直接加上其值。

4. **实现要点**：无需特判 6 种减法规则，统一用"当前 < 下一个"即可覆盖。

### 示意图

```text
s = "MCMXCIV"
值:   1000 100 1000 10 100 1 5

从左到右：
M(1000): 下一个C(100), 1000>100 → +1000, total=1000
C(100):  下一个M(1000),100<1000 → -100,  total=900
M(1000): 下一个X(10),  1000>10  → +1000, total=1900
X(10):   下一个C(100), 10<100   → -10,   total=1890
C(100):  下一个I(1),   100>1    → +100,  total=1990
I(1):    下一个V(5),   1<5      → -1,    total=1989
V(5):    最后一个      → +5,    total=1994
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 线性扫描 | O(n) | O(1) |

## 代码实现

### Go

```go
// romanToInt 将罗马数字字符串转换为整数
// 参数：s 有效的罗马数字字符串
// 返回：对应整数值
func romanToInt(s string) int {
    // 字符到值的映射
    val := map[byte]int{
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000,
    }

    total := 0
    for i := 0; i < len(s); i++ {
        cur := val[s[i]]
        // 若当前值小于右边，则为减法规则，减去当前值
        if i+1 < len(s) && cur < val[s[i+1]] {
            total -= cur
        } else {
            total += cur
        }
    }
    return total
}
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * 将罗马数字字符串转换为整数。
     *
     * @param s 有效的罗马数字字符串
     * @return 对应整数值
     */
    public int romanToInt(String s) {
        Map<Character, Integer> val = new HashMap<>();
        val.put('I', 1); val.put('V', 5);  val.put('X', 10); val.put('L', 50);
        val.put('C', 100); val.put('D', 500); val.put('M', 1000);

        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = val.get(s.charAt(i));
            // 当前值小于右边值 → 减法规则
            if (i + 1 < s.length() && cur < val.get(s.charAt(i + 1))) {
                total -= cur;
            } else {
                total += cur;
            }
        }
        return total;
    }
}
```

### Python

```python
class Solution:
    def romanToInt(self, s: str) -> int:
        """
        将罗马数字字符串转换为整数。

        参数:
            s: 有效的罗马数字字符串
        返回:
            对应整数值
        """
        val = {'I': 1, 'V': 5, 'X': 10, 'L': 50,
               'C': 100, 'D': 500, 'M': 1000}

        total = 0
        for i, c in enumerate(s):
            cur = val[c]
            # 当前值小于右边值 → 减法规则，减去当前值
            if i + 1 < len(s) and cur < val[s[i + 1]]:
                total -= cur
            else:
                total += cur
        return total
```

## 踩坑记录

- **减法规则的判断方向**：是"当前 < 右边"时减，不是"左边 < 当前"时减，搞反方向会导致边界计算错误。
- **最后一个字符没有右边**：访问 `s[i+1]` 前必须判断 `i+1 < len(s)`，否则越界。
- **不需要记忆 6 种减法组合**：统一用大小关系判断即可，因为有效罗马数字保证减法只在合法位置出现。

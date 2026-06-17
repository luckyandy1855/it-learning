# 0065. Valid Number

---
编号: 65
题目: Valid Number
难度: 困难
标签: [字符串]
来源链接: https://leetcode.com/problems/valid-number/
---

## 题目描述

判断字符串 `s` 是否是**有效数字**。有效数字格式定义：

- **整数**：可选符号 `[+|-]`，后跟一个或多个数字。
- **小数**：可选符号 `[+|-]`，后跟 `数字.数字`、`.数字`、`数字.` 三种形式之一（小数点两侧至少有一侧有数字）。
- **科学计数法**：整数或小数后跟 `e` 或 `E`，再跟一个整数（带可选符号）。

### Example 1

```text
Input: s = "0"       Output: true
Input: s = "e"       Output: false
Input: s = "."       Output: false
Input: s = ".1"      Output: true
Input: s = "2e10"    Output: true
Input: s = "-90E3"   Output: true
Input: s = "1e"      Output: false
Input: s = "1e2e3"   Output: false
Input: s = "6+1"     Output: false
```

### 约束条件

- `1 <= s.length <= 20`
- `s` 仅含数字、`'+'`、`'-'`、`'.'`、`'e'`、`'E'`

## 思路分析

### 突破口

线性扫描，用状态标记跟踪已出现的成分：`hasNum`（是否有数字）、`hasDot`（是否有小数点）、`hasE`（是否有 e/E）；按位置规则判断每个字符是否合法。

### 思路拆解

1. **符号 `+/-`**：只能出现在起始位或 `e/E` 之后，其他位置非法。

2. **数字**：更新 `hasNum = true`。

3. **小数点 `.`**：只能出现一次，且不能在 `e/E` 之后。

4. **`e/E`**：只能出现一次，且之前必须有数字（`hasNum` 为真）；出现后重置 `hasNum = false`（需要 e 之后也有数字）。

5. **结束**：`hasNum` 为真则有效（确保 e 后面有数字）。

### 示意图

```text
"2e10":
  '2': hasNum=true
  'e': hasE=true, hasNum重置为false
  '1': hasNum=true
  '0': hasNum=true
  结束: hasNum=true → valid

"1e":
  '1': hasNum=true
  'e': hasE=true, hasNum重置为false
  结束: hasNum=false → invalid
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 线性扫描 | O(n) | O(1) |

## 代码实现

### Go

```go
// isNumber 判断字符串是否是有效数字
func isNumber(s string) bool {
    hasNum, hasDot, hasE := false, false, false

    for i, ch := range s {
        switch {
        case ch >= '0' && ch <= '9':
            hasNum = true
        case ch == '+' || ch == '-':
            // 符号只能在起始或 e/E 后紧跟
            if i != 0 && s[i-1] != 'e' && s[i-1] != 'E' {
                return false
            }
        case ch == '.':
            if hasDot || hasE { // 小数点只能出现一次且不能在 e 后
                return false
            }
            hasDot = true
        case ch == 'e' || ch == 'E':
            if hasE || !hasNum { // e 只能出现一次且前面需有数字
                return false
            }
            hasE = true
            hasNum = false // e 之后必须有数字
        default:
            return false
        }
    }
    return hasNum
}
```

### Java

```java
class Solution {
    /**
     * 判断字符串是否是有效数字。
     */
    public boolean isNumber(String s) {
        boolean hasNum = false, hasDot = false, hasE = false;

        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (Character.isDigit(ch)) {
                hasNum = true;
            } else if (ch == '+' || ch == '-') {
                if (i != 0 && s.charAt(i - 1) != 'e' && s.charAt(i - 1) != 'E')
                    return false;
            } else if (ch == '.') {
                if (hasDot || hasE) return false;
                hasDot = true;
            } else if (ch == 'e' || ch == 'E') {
                if (hasE || !hasNum) return false;
                hasE = true;
                hasNum = false;
            } else {
                return false;
            }
        }
        return hasNum;
    }
}
```

### Python

```python
class Solution:
    def isNumber(self, s: str) -> bool:
        """
        判断字符串是否是有效数字（线性扫描状态标记法）。
        """
        has_num = has_dot = has_e = False

        for i, ch in enumerate(s):
            if ch.isdigit():
                has_num = True
            elif ch in ('+', '-'):
                if i != 0 and s[i - 1] not in ('e', 'E'):
                    return False
            elif ch == '.':
                if has_dot or has_e:
                    return False
                has_dot = True
            elif ch in ('e', 'E'):
                if has_e or not has_num:
                    return False
                has_e = True
                has_num = False  # e 之后还需要有数字
            else:
                return False

        return has_num
```

## 踩坑记录

- **e 后面的 `hasNum` 要重置为 false**：这是为了确保 `e` 之后至少有一个数字，如 `"1e"` 应返回 false。
- **`"."` 本身无效但 `".5"` 有效**：小数点两侧至少一侧有数字——用 `hasNum` 在结束时判断就够了（小数点前无数字时 `hasNum` 为 false，小数点后有数字则 `hasNum=true`，最终合法）。
- **符号出现在 e 后的判断**：`s[i-1]` 需检查是 `e` 或 `E`，不能只检查 `i>0`；且如 `"1e+2"` 合法，`"1+2"` 非法。

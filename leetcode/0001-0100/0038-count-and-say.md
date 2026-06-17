# 0038. Count and Say

---
编号: 38
题目: Count and Say
难度: 中等
标签: [字符串]
来源链接: https://leetcode.com/problems/count-and-say/
---

## 题目描述

「外观数列」是一个递归定义的字符串序列：

- `countAndSay(1) = "1"`
- `countAndSay(n)` 是 `countAndSay(n-1)` 的**读法描述**：从左到右统计连续相同字符的个数，例如 `"111221"` 读作「三个1、两个2、一个1」，即 `"312211"`。

给定正整数 `n`，返回第 `n` 项。

### Example 1

```text
Input: n = 1
Output: "1"
```

### Example 2

```text
Input: n = 4
Output: "1211"
Explanation:
  countAndSay(1) = "1"
  countAndSay(2) = "11"    （一个 1）
  countAndSay(3) = "21"    （两个 1）
  countAndSay(4) = "1211"  （一个 2、一个 1）
```

### 约束条件

- `1 <= n <= 30`

## 思路分析

### 突破口

迭代：从 `"1"` 开始，重复 `n-1` 次"游程编码"（Run-Length Encoding）操作，每次把当前串转为其读法描述。

### 思路拆解

1. **游程编码**：扫描当前字符串，统计每段连续相同字符的长度 `count` 和字符 `ch`，追加 `count + ch` 到结果。

2. **迭代 n-1 次**：从 `result = "1"` 开始，每次将 `result` 替换为其游程编码。

3. **实现要点**：遍历时在末尾追加一个哨兵字符（如 `'*'`）可简化边界处理，或者在循环后处理最后一段。

### 示意图

```text
n=5:
  "1"
  → "11"         (一个1)
  → "21"         (两个1)
  → "1211"       (一个2,一个1)
  → "111221"     (一个1,一个2,两个1)
  → "312211"     (三个1,两个2,一个1)
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 迭代游程编码 | O(n × L)，L 为最长串长度 | O(L) |

## 代码实现

### Go

```go
import (
    "strconv"
    "strings"
)

// countAndSay 返回外观数列的第 n 项
// 参数：n 正整数
// 返回：外观数列第 n 项字符串
func countAndSay(n int) string {
    result := "1"
    for i := 1; i < n; i++ {
        result = encode(result)
    }
    return result
}

// encode 对字符串做游程编码（读法描述）
func encode(s string) string {
    var sb strings.Builder
    i := 0
    for i < len(s) {
        ch := s[i]
        count := 1
        for i+count < len(s) && s[i+count] == ch {
            count++
        }
        sb.WriteString(strconv.Itoa(count))
        sb.WriteByte(ch)
        i += count
    }
    return sb.String()
}
```

### Java

```java
class Solution {
    /**
     * 返回外观数列的第 n 项。
     *
     * @param n 正整数
     * @return 外观数列第 n 项字符串
     */
    public String countAndSay(int n) {
        String result = "1";
        for (int i = 1; i < n; i++) result = encode(result);
        return result;
    }

    private String encode(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            char ch = s.charAt(i);
            int count = 1;
            while (i + count < s.length() && s.charAt(i + count) == ch) count++;
            sb.append(count).append(ch);
            i += count;
        }
        return sb.toString();
    }
}
```

### Python

```python
class Solution:
    def countAndSay(self, n: int) -> str:
        """
        返回外观数列的第 n 项。

        参数:
            n: 正整数
        返回:
            外观数列第 n 项字符串
        """
        result = "1"
        for _ in range(n - 1):
            encoded = []
            i = 0
            while i < len(result):
                ch = result[i]
                count = 1
                while i + count < len(result) and result[i + count] == ch:
                    count += 1
                encoded.append(str(count) + ch)
                i += count
            result = ''.join(encoded)
        return result
```

## 踩坑记录

- **`n=1` 直接返回 `"1"`**：初始值就是 `"1"`，循环从 `1` 到 `n-1` 次，`n=1` 时循环 0 次直接返回，不需要特判。
- **内层循环增量是整段长度**：`i += count` 而不是 `i++`，否则会重复处理已计数的字符。
- **游程编码只连续相同字符**：`"21"` 是「两个1」，不是「两和一」——只有连续相同的字符才合并计数，不同字符分开处理。

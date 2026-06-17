# 0006. Zigzag Conversion

---
编号: 6
题目: Zigzag Conversion
难度: 中等
标签: [字符串]
来源链接: https://leetcode.com/problems/zigzag-conversion/
---

## 题目描述

将字符串 `s` 按照给定的行数 `numRows` 以 Z 字形（锯齿形）排列，然后按行从左到右读取，返回新的字符串。

Z 字形排列规则：字符从上往下写满第一列后，再斜向上到第一行，再垂直往下……如此反复，形成 Z 字形（实际上更像 N 字形）。

### Example 1

```text
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
Explanation:
P   A   H   N
A P L S I I G
Y   I   R
按行读取：PAHN + APLSIIG + YIR = "PAHNAPLSIIGYIR"
```

### Example 2

```text
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Explanation:
P     I    N
A   L S  I G
Y A   H R
P     I
按行读取：PIN + ALSIG + YAHR + PI = "PINALSIGYAHRPI"
```

### Example 3

```text
Input: s = "A", numRows = 1
Output: "A"
```

### 约束条件

- `1 <= s.length <= 1000`
- `s` 由英文字母（大小写）、`,`、`.` 组成。
- `1 <= numRows <= 1000`

## 思路分析

### 突破口

模拟 Z 字形写入过程：用 `numRows` 个字符串缓冲区分别收集每一行的字符，按 Z 字形顺序把字符依次分配到对应行，最后拼接所有行。

### 思路拆解

1. **暴力模拟**：用一个二维数组按 Z 字形填写，再逐行读取。空间浪费大。

2. **问题转化**：Z 字形运动有规律：行号从 0 增到 `numRows-1`，再从 `numRows-1` 减到 0，如此循环。只需维护当前行号和方向（向下 or 向上）即可。

3. **优化方向**：用 `numRows` 个 `StringBuilder`（或字符串切片），每个字符按当前行号追加到对应缓冲区，最后拼接，O(n) 时间和空间。

4. **实现要点**：`numRows = 1` 或 `numRows >= len(s)` 时直接返回原串，无需模拟。

### 示意图

```text
s = "PAYPALISHIRING", numRows = 3

写入过程（行号变化：0→1→2→1→0→1→2→...）：

行 0: P        A        H        N
行 1: A     P  L     S  I     I  G
行 2: Y        I        R

行号序列: 0,1,2,1,0,1,2,1,0,1,2,1,0,1
字符:     P,A,Y,P,A,L,I,S,H,I,R,I,N,G

拼接: "PAHN" + "APLSIIG" + "YIR" = "PAHNAPLSIIGYIR"
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 模拟 Z 字形填写 | O(n) | O(n) |

## 代码实现

### Go

```go
import "strings"

// convert 将字符串按 Z 字形排列后按行读取返回
// 参数：s 原始字符串，numRows Z 字形行数
// 返回：按行读取的新字符串
func convert(s string, numRows int) string {
    // 特殊情况：只有一行或行数超过字符串长度，Z 字形等于原串
    if numRows == 1 || numRows >= len(s) {
        return s
    }

    // rows[i] 存储第 i 行的所有字符
    rows := make([]strings.Builder, numRows)
    curRow := 0
    goingDown := false // 初始向下

    for _, c := range s {
        rows[curRow].WriteRune(c)
        // 到达顶行或底行时反转方向
        if curRow == 0 || curRow == numRows-1 {
            goingDown = !goingDown
        }
        if goingDown {
            curRow++
        } else {
            curRow--
        }
    }

    var res strings.Builder
    for _, row := range rows {
        res.WriteString(row.String())
    }
    return res.String()
}
```

### Java

```java
class Solution {
    /**
     * 将字符串按 Z 字形排列后按行读取返回。
     *
     * @param s       原始字符串
     * @param numRows Z 字形行数
     * @return 按行读取的新字符串
     */
    public String convert(String s, int numRows) {
        if (numRows == 1 || numRows >= s.length()) return s;

        // rows[i] 收集第 i 行的字符
        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();

        int curRow = 0;
        boolean goingDown = false;

        for (char c : s.toCharArray()) {
            rows[curRow].append(c);
            if (curRow == 0 || curRow == numRows - 1) goingDown = !goingDown;
            curRow += goingDown ? 1 : -1;
        }

        StringBuilder res = new StringBuilder();
        for (StringBuilder row : rows) res.append(row);
        return res.toString();
    }
}
```

### Python

```python
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        """
        将字符串按 Z 字形排列后按行读取返回。

        参数:
            s:       原始字符串
            numRows: Z 字形行数
        返回:
            按行读取的新字符串
        """
        if numRows == 1 or numRows >= len(s):
            return s

        rows = [''] * numRows
        cur_row = 0
        going_down = False

        for c in s:
            rows[cur_row] += c
            if cur_row == 0 or cur_row == numRows - 1:
                going_down = not going_down
            cur_row += 1 if going_down else -1

        return ''.join(rows)
```

## 踩坑记录

- **numRows=1 必须特判**：只有一行时不存在 Z 字形，直接返回原串。否则方向切换逻辑会在 `curRow==0` 和 `curRow==numRows-1` 同一位置反复横跳（因为 0 == numRows-1 == 0）。
- **方向初始值**：初始 `goingDown = false`，第一个字符写入行 0 后立即触发反转变为 `true`，从第二个字符开始向下，符合 Z 字形起点在顶行的逻辑。
- **题目叫"Zigzag"但形状像"N"**：实际排列是先垂直向下再斜向右上，形成 N/Z 字形，不要按照字面意思理解成斜线。

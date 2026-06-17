# 0068. Text Justification

---
编号: 68
题目: Text Justification
难度: 困难
标签: [数组, 字符串, 模拟]
来源链接: https://leetcode.com/problems/text-justification/
---

## 题目描述

给定单词数组 `words` 和最大宽度 `maxWidth`，将 `words` 排成若干行，每行恰好有 `maxWidth` 个字符，并且**两端对齐**（Fully Justified）：

- 每行单词之间尽可能均匀分配空格；若空格无法均匀分配，靠左的间隔比靠右的多一个空格。
- **最后一行**：单词间只有一个空格，行末填空格补齐。
- 仅有一个单词的行：单词靠左，行末填空格补齐。

### Example 1

```text
Input: words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16
Output:
["This    is    an",
 "example  of text",
 "justification.  "]
```

### 约束条件

- `1 <= words.length <= 300`
- `1 <= words[i].length <= 20`
- `words[i]` 仅含英文字母和符号
- `1 <= maxWidth <= 100`
- `words[i].length <= maxWidth`

## 思路分析

### 突破口

逐行贪心地装入尽可能多的单词，再对每行按规则分配空格。

### 思路拆解

1. **贪心分行**：从当前位置 `start` 开始，贪心地将单词加入当前行（加入下一个单词后不超过 `maxWidth` 则继续）。

2. **空格分配**：设有 `k` 个单词，`k-1` 个间隙，总空格数 `spaces = maxWidth - 字符总长`；均匀分配 `spaces / (k-1)`，余数 `spaces % (k-1)` 分给靠左的间隔。

3. **特殊情况**：单词数 `k == 1` 或最后一行，靠左对齐（单词间 1 个空格，末尾补空格）。

### 示意图

```text
words: ["This","is","an"], maxWidth=16
字符总长: 4+2+2=8, 间隙=2, 总空格=16-8=8
均匀分配: 8/2=4, 余数=0
结果: "This    is    an"
         ^^^^  ^^^^
         4格   4格
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 贪心逐行 | O(n × maxWidth) | O(n × maxWidth) |

## 代码实现

### Go

```go
import "strings"

// fullJustify 按规则对文本两端对齐
func fullJustify(words []string, maxWidth int) []string {
    result := []string{}
    n := len(words)
    i := 0

    for i < n {
        // 贪心：确定当前行包含哪些单词
        lineLen := len(words[i])
        j := i + 1
        for j < n && lineLen+1+len(words[j]) <= maxWidth {
            lineLen += 1 + len(words[j])
            j++
        }

        // 构造当前行
        numWords := j - i
        totalChars := 0
        for k := i; k < j; k++ {
            totalChars += len(words[k])
        }
        totalSpaces := maxWidth - totalChars

        var sb strings.Builder
        if j == n || numWords == 1 {
            // 最后一行或只有一个单词：靠左对齐
            for k := i; k < j; k++ {
                if k > i {
                    sb.WriteByte(' ')
                }
                sb.WriteString(words[k])
            }
            for sb.Len() < maxWidth {
                sb.WriteByte(' ')
            }
        } else {
            // 中间行：均匀分配空格
            gaps := numWords - 1
            base := totalSpaces / gaps
            extra := totalSpaces % gaps
            for k := i; k < j; k++ {
                sb.WriteString(words[k])
                if k < j-1 {
                    sp := base
                    if k-i < extra {
                        sp++ // 靠左的间隔多一个空格
                    }
                    for s := 0; s < sp; s++ {
                        sb.WriteByte(' ')
                    }
                }
            }
        }
        result = append(result, sb.String())
        i = j
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 按规则对文本两端对齐。
     */
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> result = new ArrayList<>();
        int n = words.length, i = 0;

        while (i < n) {
            int lineLen = words[i].length(), j = i + 1;
            while (j < n && lineLen + 1 + words[j].length() <= maxWidth)
                lineLen += 1 + words[j].length();

            int numWords = j - i, totalChars = 0;
            for (int k = i; k < j; k++) totalChars += words[k].length();
            int totalSpaces = maxWidth - totalChars;

            StringBuilder sb = new StringBuilder();
            if (j == n || numWords == 1) {
                // 靠左对齐
                for (int k = i; k < j; k++) {
                    if (k > i) sb.append(' ');
                    sb.append(words[k]);
                }
                while (sb.length() < maxWidth) sb.append(' ');
            } else {
                int gaps = numWords - 1, base = totalSpaces / gaps, extra = totalSpaces % gaps;
                for (int k = i; k < j; k++) {
                    sb.append(words[k]);
                    if (k < j - 1) {
                        int sp = base + (k - i < extra ? 1 : 0);
                        for (int s = 0; s < sp; s++) sb.append(' ');
                    }
                }
            }
            result.add(sb.toString());
            i = j;
        }
        return result;
    }
}
```

### Python

```python
class Solution:
    def fullJustify(self, words: list[str], maxWidth: int) -> list[str]:
        """
        按规则对文本两端对齐。
        """
        result = []
        i, n = 0, len(words)

        while i < n:
            # 贪心确定当前行
            line_len = len(words[i])
            j = i + 1
            while j < n and line_len + 1 + len(words[j]) <= maxWidth:
                line_len += 1 + len(words[j])
                j += 1

            num_words = j - i
            total_chars = sum(len(words[k]) for k in range(i, j))
            total_spaces = maxWidth - total_chars

            if j == n or num_words == 1:
                # 最后一行或单词数为1：靠左
                line = ' '.join(words[i:j])
                line += ' ' * (maxWidth - len(line))
            else:
                gaps = num_words - 1
                base, extra = divmod(total_spaces, gaps)
                line = ''
                for k in range(i, j):
                    line += words[k]
                    if k < j - 1:
                        sp = base + (1 if k - i < extra else 0)
                        line += ' ' * sp

            result.append(line)
            i = j

        return result
```

## 踩坑记录

- **最后一行靠左对齐**：判断条件 `j == n`（j 到达末尾），此时单词间只有一个空格，行末补空格。
- **单词数为 1 的行特殊处理**：只有一个单词时没有间隙，不能做除法（`gaps=0`），靠左对齐后补空格。
- **余数空格分给靠左的间隔**：`extra` 个间隔各多一个空格，从左起第 `0` 到 `extra-1` 个间隔处理，用 `k - i < extra` 判断。

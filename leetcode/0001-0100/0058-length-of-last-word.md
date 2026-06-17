# 0058. Length of Last Word

---
编号: 58
题目: Length of Last Word
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/length-of-last-word/
---

## 题目描述

给定一个字符串 `s`，由若干单词和空格组成。返回**最后一个单词**的长度。单词是仅由非空格字符构成的最大子串。

### Example 1

```text
Input: s = "Hello World"
Output: 5
```

### Example 2

```text
Input: s = "   fly me   to   the moon  "
Output: 4
```

### Example 3

```text
Input: s = "luffy is still joyboy"
Output: 6
```

### 约束条件

- `1 <= s.length <= 10^4`
- `s` 仅由英文字母和空格 `' '` 组成
- `s` 中至少有一个单词

## 思路分析

### 突破口

从字符串末尾向前扫描：先跳过尾部空格，再统计最后一个单词的字符数。

### 思路拆解

1. **去尾空格**：指针从末尾向前移动，跳过所有空格。

2. **计数单词**：指针继续向前，遇到非空格字符则计数，遇到空格则停止。

### 示意图

```text
s = "   fly me   to   the moon  "
                              ^^ ← 跳过尾部空格
                         ^^^^   ← 计数 "moon" = 4
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 从尾部扫描 | O(n) | O(1) |

## 代码实现

### Go

```go
// lengthOfLastWord 返回字符串中最后一个单词的长度
func lengthOfLastWord(s string) int {
    i := len(s) - 1

    // 跳过尾部空格
    for i >= 0 && s[i] == ' ' {
        i--
    }

    count := 0
    for i >= 0 && s[i] != ' ' {
        count++
        i--
    }
    return count
}
```

### Java

```java
class Solution {
    /**
     * 返回字符串中最后一个单词的长度。
     */
    public int lengthOfLastWord(String s) {
        int i = s.length() - 1;

        // 跳过尾部空格
        while (i >= 0 && s.charAt(i) == ' ') i--;

        int count = 0;
        while (i >= 0 && s.charAt(i) != ' ') {
            count++;
            i--;
        }
        return count;
    }
}
```

### Python

```python
class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        """
        返回字符串中最后一个单词的长度。
        """
        return len(s.rstrip().split(' ')[-1])
        # 等价手动实现：
        # i = len(s) - 1
        # while i >= 0 and s[i] == ' ': i -= 1
        # count = 0
        # while i >= 0 and s[i] != ' ':
        #     count += 1; i -= 1
        # return count
```

## 踩坑记录

- **末尾有空格**：不先跳过尾部空格会返回 0，如 `"Hello World  "` 应返回 5 而非 0。
- **Python 一行解法**：`s.rstrip().split(' ')[-1]` 先去尾空格再按空格分割取最后一项，简洁但隐含 `split` 开销；追求 O(1) 空间用手动扫描。
- **题目保证至少有一个单词**：不需要处理全空格的边界（约束条件已排除）。

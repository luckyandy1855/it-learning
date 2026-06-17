# 0028. Find the Index of the First Occurrence in a String

---
编号: 28
题目: Find the Index of the First Occurrence in a String
难度: 简单
标签: [双指针, 字符串, 字符串匹配]
来源链接: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
---

## 题目描述

给定字符串 `haystack` 和 `needle`，返回 `needle` 在 `haystack` 中**第一次出现**的起始下标。如果 `needle` 不是 `haystack` 的子串，返回 `-1`。

### Example 1

```text
Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" 在下标 0 和 6 处出现，返回第一次出现的下标 0。
```

### Example 2

```text
Input: haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: "leeto" 不是 "leetcode" 的子串。
```

### 约束条件

- `1 <= haystack.length, needle.length <= 10^4`
- `haystack` 和 `needle` 仅由小写字母组成。

## 思路分析

### 突破口

调用标准库是最简实现；若要深入理解，朴素字符串匹配 O(nm) 或 KMP O(n+m) 均可。

### 思路拆解

1. **调用标准库**：Go 的 `strings.Index`，Java 的 `indexOf`，Python 的 `find`，O(nm) 或更优。面试中可以直接用。

2. **朴素匹配**：外层循环枚举起始位置 `i`，内层比较 `haystack[i..i+len(needle)-1]` 是否等于 `needle`，O(nm)。

3. **KMP**：构建 needle 的部分匹配表（`next` 数组），匹配时利用已匹配信息跳过不必要比较，O(n+m)。适合超长字符串的性能场景。

4. **实现要点（朴素）**：外层循环到 `i <= len(haystack) - len(needle)` 即可，超出这个范围的起始位置不可能匹配。

### 示意图

```text
haystack = "mississippi", needle = "issip"

朴素匹配：
i=0: m vs i → 不匹配
i=1: issip == issi → i=1,s=2,s=3,i=4,p vs p → 匹配! 返回 1
     等等... 实际对比：haystack[1..5]="issis", needle="issip"
     i=1: i==i, s==s, s==s, i==i, s vs p → 不匹配
i=2: s vs i → 不匹配
i=4: i==i, s==s, s==s, i==i, p==p → 匹配! 返回 4
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 朴素匹配 | O(nm) | O(1) |
| KMP | O(n+m) | O(m) | 

## 代码实现

### Go

```go
// strStr 在 haystack 中找 needle 第一次出现的下标，未找到返回 -1
// 参数：haystack 主串，needle 模式串
// 返回：needle 在 haystack 中第一次出现的起始下标，不存在返回 -1
func strStr(haystack string, needle string) int {
    n, m := len(haystack), len(needle)
    if m == 0 {
        return 0
    }

    // 枚举每个起始位置
    for i := 0; i <= n-m; i++ {
        if haystack[i:i+m] == needle {
            return i
        }
    }
    return -1
}
```

### Java

```java
class Solution {
    /**
     * 在 haystack 中找 needle 第一次出现的下标，未找到返回 -1。
     *
     * @param haystack 主串
     * @param needle   模式串
     * @return needle 第一次出现的起始下标，不存在返回 -1
     */
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();
        if (m == 0) return 0;

        for (int i = 0; i <= n - m; i++) {
            if (haystack.substring(i, i + m).equals(needle)) return i;
        }
        return -1;
    }
}
```

### Python

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        """
        在 haystack 中找 needle 第一次出现的下标，未找到返回 -1。

        参数:
            haystack: 主串
            needle:   模式串
        返回:
            needle 第一次出现的起始下标，不存在返回 -1
        """
        n, m = len(haystack), len(needle)
        if m == 0:
            return 0

        for i in range(n - m + 1):
            if haystack[i:i + m] == needle:
                return i
        return -1
```

## 踩坑记录

- **外层循环上界**：应为 `i <= n-m`（或 `i < n-m+1`），不是 `i < n`。若起始位置 `i > n-m`，剩余字符数不足 `m`，不可能匹配，但访问 `haystack[i:i+m]` 越界。
- **`needle` 为空串时返回 0**：空串是任何字符串的子串，出现在下标 0 处。
- **`needle` 长度大于 `haystack`**：`n-m < 0` 时循环不执行，直接返回 -1，Python 的 `range` 自然处理这种情况；Go/Java 需注意 `n-m` 可能为负数。

# 0014. Longest Common Prefix

---
编号: 14
题目: Longest Common Prefix
难度: 简单
标签: [字典树, 数组, 字符串]
来源链接: https://leetcode.com/problems/longest-common-prefix/
---

## 题目描述

给定字符串数组 `strs`，找出所有字符串的**最长公共前缀**。如果不存在公共前缀，返回空字符串 `""`。

### Example 1

```text
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

### Example 2

```text
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: 三个字符串没有公共前缀。
```

### 约束条件

- `1 <= strs.length <= 200`
- `0 <= strs[i].length <= 200`
- `strs[i]` 仅由小写字母组成。

## 思路分析

### 突破口

以第一个字符串为基准，逐字符检查所有字符串是否在同一位置有相同字符，遇到不匹配即截止。

### 思路拆解

1. **水平扫描**：依次取前两个字符串的公共前缀，再与第三个求公共前缀，……直到遍历完所有字符串。

2. **垂直扫描（推荐）**：逐列（逐字符位置）扫描，对第 `j` 列，检查所有字符串的第 `j` 个字符是否相同。遇到越界或不匹配立即返回已确认的前缀。

3. **分治**：将数组对半分，递归求左右半部分的公共前缀，再取两者的公共前缀。代码复杂度高，无明显优势。

4. **实现要点**：数组为空时返回 `""`；某个字符串为空字符串时公共前缀必为空。

### 示意图

```text
strs = ["flower", "flow", "flight"]

逐列扫描：
列0: f, f, f → 全部匹配，继续
列1: l, l, l → 全部匹配，继续
列2: o, o, i → 不匹配！停止

公共前缀 = "fl"（列 0 和 1）
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 垂直扫描 | O(S)（S=所有字符总数） | O(1) |

## 代码实现

### Go

```go
// longestCommonPrefix 找字符串数组的最长公共前缀
// 参数：strs 字符串数组
// 返回：最长公共前缀；无则返回空字符串
func longestCommonPrefix(strs []string) string {
    if len(strs) == 0 {
        return ""
    }

    // 以第一个字符串为基准，逐字符比较
    for j := 0; j < len(strs[0]); j++ {
        c := strs[0][j]
        for _, s := range strs[1:] {
            // 某个字符串已结束，或当前字符不匹配 → 截止
            if j >= len(s) || s[j] != c {
                return strs[0][:j]
            }
        }
    }
    // 所有字符都匹配，整个 strs[0] 就是公共前缀
    return strs[0]
}
```

### Java

```java
class Solution {
    /**
     * 找字符串数组的最长公共前缀。
     *
     * @param strs 字符串数组
     * @return 最长公共前缀；无则返回空字符串
     */
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";

        for (int j = 0; j < strs[0].length(); j++) {
            char c = strs[0].charAt(j);
            for (int i = 1; i < strs.length; i++) {
                if (j >= strs[i].length() || strs[i].charAt(j) != c) {
                    return strs[0].substring(0, j);
                }
            }
        }
        return strs[0];
    }
}
```

### Python

```python
class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        """
        找字符串数组的最长公共前缀。

        参数:
            strs: 字符串列表
        返回:
            最长公共前缀；无则返回空字符串
        """
        if not strs:
            return ""

        for j in range(len(strs[0])):
            c = strs[0][j]
            for s in strs[1:]:
                if j >= len(s) or s[j] != c:
                    return strs[0][:j]

        return strs[0]
```

## 踩坑记录

- **先检查长度再访问字符**：某个字符串比基准字符串短，访问 `s[j]` 前必须先判断 `j < len(s)`，否则越界。
- **数组为空**：`strs` 为空数组时，不能访问 `strs[0]`，需要提前返回 `""`。
- **Python 的 `zip` 简洁版**：Python 可以用 `zip(*strs)` 逐列解压，遇到长度不一致时 `zip` 自动截断到最短，配合 `set()` 判断是否全部相同，是另一种写法。

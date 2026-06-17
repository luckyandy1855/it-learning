# 0049. Group Anagrams

---
编号: 49
题目: Group Anagrams
难度: 中等
标签: [数组, 哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/group-anagrams/
---

## 题目描述

给定字符串数组 `strs`，将所有**字母异位词**（Anagram）分组并返回。字母异位词是由相同字母重新排列形成的字符串（字母种类和数量相同，顺序可不同）。

结果可以按任意顺序返回。

### Example 1

```text
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

### Example 2

```text
Input: strs = [""]
Output: [[""]]
```

### Example 3

```text
Input: strs = ["a"]
Output: [["a"]]
```

### 约束条件

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` 仅由小写字母组成。

## 思路分析

### 突破口

互为字母异位词的字符串，其**排序后的字符串相同**（如 `"eat"`, `"tea"`, `"ate"` 排序后都是 `"aet"`）。用排序后的字符串作为哈希表的键，分组收集。

### 思路拆解

1. **排序为键**：对每个字符串排序，以排序后结果为键，收集到同一列表，O(n × k log k)（k 为字符串平均长度）。

2. **字符计数为键**：用长度 26 的字符计数数组作为键，O(n × k)，避免排序，但键需要序列化（如 `"1#0#2#..."` 格式）。

3. **实现要点**：利用语言内建的哈希表，对所有字符串遍历一遍，O(n × k log k) 时间。

### 示意图

```text
strs = ["eat","tea","tan","ate","nat","bat"]

分组过程：
  "eat" → 排序 "aet" → map["aet"] = ["eat"]
  "tea" → 排序 "aet" → map["aet"] = ["eat","tea"]
  "tan" → 排序 "ant" → map["ant"] = ["tan"]
  "ate" → 排序 "aet" → map["aet"] = ["eat","tea","ate"]
  "nat" → 排序 "ant" → map["ant"] = ["tan","nat"]
  "bat" → 排序 "abt" → map["abt"] = ["bat"]

结果: [["eat","tea","ate"],["tan","nat"],["bat"]]
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 排序为键 | O(n × k log k) | O(n × k) |
| 字符计数为键 | O(n × k) | O(n × k) |

## 代码实现

### Go

```go
import "sort"

// groupAnagrams 将字符串数组按字母异位词分组
// 参数：strs 字符串数组
// 返回：分组后的字母异位词列表
func groupAnagrams(strs []string) [][]string {
    groups := make(map[string][]string)

    for _, s := range strs {
        // 对字符串排序后作为键
        runes := []byte(s)
        sort.Slice(runes, func(i, j int) bool { return runes[i] < runes[j] })
        key := string(runes)
        groups[key] = append(groups[key], s)
    }

    result := make([][]string, 0, len(groups))
    for _, group := range groups {
        result = append(result, group)
    }
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 将字符串数组按字母异位词分组。
     *
     * @param strs 字符串数组
     * @return 分组后的字母异位词列表
     */
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();

        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(groups.values());
    }
}
```

### Python

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        """
        将字符串数组按字母异位词分组。

        参数:
            strs: 字符串数组
        返回:
            分组后的字母异位词列表
        """
        groups = defaultdict(list)

        for s in strs:
            key = ''.join(sorted(s))  # 排序后的字符串作为键
            groups[key].append(s)

        return list(groups.values())
```

## 踩坑记录

- **键必须可哈希**：Go 中用 `string` 作键没问题；Python 中 `sorted(s)` 返回列表（不可哈希），需要用 `''.join(sorted(s))` 转为字符串；Java 用 `new String(sortedCharArray)`。
- **空字符串也是合法输入**：`""` 排序后还是 `""`，会被分到同一组，输出 `[[""]]`，代码无需特判。
- **字符计数键更快但更繁琐**：若字符串很长，用 26 位计数数组作为键（如元组或编码字符串）避免排序，但代码更复杂，一般排序法已够用。

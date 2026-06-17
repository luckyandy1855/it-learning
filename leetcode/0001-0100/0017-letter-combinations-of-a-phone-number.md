# 0017. Letter Combinations of a Phone Number

---
编号: 17
题目: Letter Combinations of a Phone Number
难度: 中等
标签: [哈希表, 字符串, 回溯]
来源链接: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
---

## 题目描述

给定一个仅包含数字 `2-9` 的字符串 `digits`，返回这些数字所能表示的所有字母组合（电话拨号盘映射）。答案可以按**任意顺序**返回。

电话拨号盘映射：

```text
2: abc   3: def   4: ghi   5: jkl
6: mno   7: pqrs  8: tuv   9: wxyz
```

### Example 1

```text
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

### Example 2

```text
Input: digits = ""
Output: []
```

### Example 3

```text
Input: digits = "2"
Output: ["a","b","c"]
```

### 约束条件

- `0 <= digits.length <= 4`
- `digits[i]` 是范围 `['2', '9']` 的数字。

## 思路分析

### 突破口

对每一位数字，枚举其对应的所有字母，将其追加到前面所有组合的末尾——这是典型的回溯/DFS 枚举问题。

### 思路拆解

1. **迭代 BFS**：从空字符串开始，每次读取一位数字，把队列中每个现有前缀与该数字的所有字母拼接，得到新队列。

2. **回溯 DFS（推荐）**：用递归函数，参数是当前处理到哪一位以及当前已拼出的字符串；到达末位时收集结果。

3. **实现要点**：数字 `7` 对应 `pqrs`（4 个字母），`9` 对应 `wxyz`（4 个字母），其他 2-6、8 各对应 3 个字母。输入为空时直接返回空列表。

### 示意图

```text
digits = "23"

          ""
        / | \
       a  b  c        （处理 '2'）
      /|\ /|\ /|\
     d e f d e f d e f （处理 '3'）

结果: ad ae af bd be bf cd ce cf
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 DFS | O(3^n × 4^m) n/m 为对应3/4字母的数字个数 | O(n) 递归栈 |

## 代码实现

### Go

```go
// letterCombinations 返回电话拨号数字串的所有字母组合
// 参数：digits 由 '2'-'9' 组成的数字串
// 返回：所有可能的字母组合列表；输入为空则返回空列表
func letterCombinations(digits string) []string {
    if len(digits) == 0 {
        return nil
    }

    phoneMap := map[byte]string{
        '2': "abc", '3': "def", '4': "ghi", '5': "jkl",
        '6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
    }

    result := []string{}

    var backtrack func(idx int, current []byte)
    backtrack = func(idx int, current []byte) {
        // 处理完所有数字，收集当前组合
        if idx == len(digits) {
            result = append(result, string(current))
            return
        }
        // 枚举当前数字对应的所有字母
        for _, c := range phoneMap[digits[idx]] {
            current = append(current, byte(c))
            backtrack(idx+1, current)
            current = current[:len(current)-1] // 回溯
        }
    }

    backtrack(0, []byte{})
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    private static final Map<Character, String> PHONE_MAP = new HashMap<>() {{
        put('2', "abc"); put('3', "def"); put('4', "ghi"); put('5', "jkl");
        put('6', "mno"); put('7', "pqrs"); put('8', "tuv"); put('9', "wxyz");
    }};

    /**
     * 返回电话拨号数字串的所有字母组合。
     *
     * @param digits 由 '2'-'9' 组成的数字串
     * @return 所有可能的字母组合；输入为空则返回空列表
     */
    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits == null || digits.isEmpty()) return result;
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(String digits, int idx, StringBuilder current, List<String> result) {
        if (idx == digits.length()) {
            result.add(current.toString());
            return;
        }
        for (char c : PHONE_MAP.get(digits.charAt(idx)).toCharArray()) {
            current.append(c);
            backtrack(digits, idx + 1, current, result);
            current.deleteCharAt(current.length() - 1); // 回溯
        }
    }
}
```

### Python

```python
class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        """
        返回电话拨号数字串的所有字母组合。

        参数:
            digits: 由 '2'-'9' 组成的数字串
        返回:
            所有可能的字母组合；输入为空则返回空列表
        """
        if not digits:
            return []

        phone_map = {
            '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
            '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
        }

        result = []

        def backtrack(idx: int, current: list) -> None:
            if idx == len(digits):
                result.append(''.join(current))
                return
            for c in phone_map[digits[idx]]:
                current.append(c)
                backtrack(idx + 1, current)
                current.pop()  # 回溯

        backtrack(0, [])
        return result
```

## 踩坑记录

- **空输入返回空列表而非 `[""]`**：`digits = ""` 时应返回 `[]`，不是 `[""]`（含空字符串的列表）。需要在函数开头特判。
- **7 和 9 有 4 个字母**：别漏写 `'s'` 和 `'z'`，`7: "pqrs"`，`9: "wxyz"`。
- **回溯必须撤销**：每次递归后要移除最后添加的字母（`current.pop()` / `current.deleteCharAt`），否则会累积污染后续组合。

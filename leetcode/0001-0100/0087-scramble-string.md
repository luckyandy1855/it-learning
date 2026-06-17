# 0087. Scramble String

---
编号: 87
题目: Scramble String
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/scramble-string/
---

## 题目描述

使用下面描述的算法可以扰乱字符串 `s` 得到字符串 `t`：
1. 如果字符串长度为 1，算法停止。
2. 如果字符串长度 > 1，执行下述步骤：
   - 在随机下标处将字符串分割成两个**非空**子字符串，即 `s = s1 + s2`。
   - **随机**决定是交换 `s1` 和 `s2`，还是保持顺序不变（即可以得到 `s2 + s1` 或继续 `s1 + s2`）。
   - 对两个子字符串**继续**递归地应用此算法。

给定两个字符串 `s1` 和 `s2`（长度相同），判断 `s2` 是否是 `s1` 的扰乱字符串。

### Example 1

```text
Input: s1 = "great", s2 = "rgeat"
Output: true
```

### Example 2

```text
Input: s1 = "abcde", s2 = "caebd"
Output: false
```

### 约束条件

- `s1.length == s2.length`
- `1 <= s1.length <= 30`
- `s1` 和 `s2` 由小写英文字母组成

## 思路分析

### 突破口

递归 + 记忆化：枚举切割点，检查两种情况（不交换/交换），加上字符频次剪枝（频次不同直接 false）。

### 思路拆解

1. **递归定义**：`isScramble(s1, s2)` — s2 是否是 s1 的扰乱字符串。

2. **枚举切割点 `i`**（1 到 n-1）：
   - **不交换**：`isScramble(s1[:i], s2[:i]) && isScramble(s1[i:], s2[i:])`
   - **交换**：`isScramble(s1[:i], s2[n-i:]) && isScramble(s1[i:], s2[:n-i])`

3. **剪枝**：若 `s1` 和 `s2` 的字符频次不同，直接返回 false。

4. **记忆化**：用 map 缓存 `(s1, s2)` 的结果避免重复计算。

### 示意图

```text
isScramble("great", "rgeat"):
  i=1: 不交换 isScramble("g","r")=false; 交换 isScramble("g","t")=false
  i=2: 不交换 isScramble("gr","rg")=true && isScramble("eat","eat")=true → true!
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 记忆化递归 | O(n^4) | O(n^3) |

## 代码实现

### Go

```go
// isScramble 判断 s2 是否是 s1 的扰乱字符串（记忆化递归）
func isScramble(s1 string, s2 string) bool {
    memo := make(map[[2]string]bool)
    var dfs func(a, b string) bool
    dfs = func(a, b string) bool {
        if a == b {
            return true
        }
        if len(a) != len(b) {
            return false
        }
        key := [2]string{a, b}
        if v, ok := memo[key]; ok {
            return v
        }
        // 字符频次剪枝
        cnt := [26]int{}
        for i := range a {
            cnt[a[i]-'a']++
            cnt[b[i]-'a']--
        }
        for _, c := range cnt {
            if c != 0 {
                memo[key] = false
                return false
            }
        }
        n := len(a)
        for i := 1; i < n; i++ {
            if (dfs(a[:i], b[:i]) && dfs(a[i:], b[i:])) ||
                (dfs(a[:i], b[n-i:]) && dfs(a[i:], b[:n-i])) {
                memo[key] = true
                return true
            }
        }
        memo[key] = false
        return false
    }
    return dfs(s1, s2)
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 判断 s2 是否是 s1 的扰乱字符串（记忆化递归）。
     */
    private Map<String, Boolean> memo = new HashMap<>();

    public boolean isScramble(String s1, String s2) {
        if (s1.equals(s2)) return true;
        String key = s1 + "#" + s2;
        if (memo.containsKey(key)) return memo.get(key);

        int n = s1.length();
        int[] cnt = new int[26];
        for (int i = 0; i < n; i++) { cnt[s1.charAt(i) - 'a']++; cnt[s2.charAt(i) - 'a']--; }
        for (int c : cnt) if (c != 0) { memo.put(key, false); return false; }

        for (int i = 1; i < n; i++) {
            if ((isScramble(s1.substring(0, i), s2.substring(0, i)) &&
                 isScramble(s1.substring(i), s2.substring(i))) ||
                (isScramble(s1.substring(0, i), s2.substring(n - i)) &&
                 isScramble(s1.substring(i), s2.substring(0, n - i)))) {
                memo.put(key, true);
                return true;
            }
        }
        memo.put(key, false);
        return false;
    }
}
```

### Python

```python
from functools import lru_cache

class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        """
        判断 s2 是否是 s1 的扰乱字符串（记忆化递归）。
        """
        @lru_cache(maxsize=None)
        def dfs(a: str, b: str) -> bool:
            if a == b:
                return True
            if sorted(a) != sorted(b):  # 字符频次剪枝
                return False
            n = len(a)
            for i in range(1, n):
                if ((dfs(a[:i], b[:i]) and dfs(a[i:], b[i:])) or
                        (dfs(a[:i], b[n-i:]) and dfs(a[i:], b[:n-i]))):
                    return True
            return False

        return dfs(s1, s2)
```

## 踩坑记录

- **字符频次剪枝是必须的**：若 s1 和 s2 字符组成不同，不管怎么切割都不可能相互扰乱，先检查省去大量无效递归。
- **Java 记忆化键用 `s1+"#"+s2`**：字符串对拼接作为 map 键，用 `"#"` 分隔避免 `"ab"+"c"` 和 `"a"+"bc"` 产生相同键。
- **切割点 i 从 1 到 n-1**：两个子串必须非空，i=0 或 i=n 的情况不允许（题目要求两个非空子字符串）。

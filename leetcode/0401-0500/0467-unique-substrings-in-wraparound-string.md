# 0467. Unique Substrings in Wraparound String

---
编号: 467
题目: Unique Substrings in Wraparound String
难度: 中等
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/unique-substrings-in-wraparound-string/
---

## 题目描述

定义字符串 `base` 为一个 `"abcdefghijklmnopqrstuvwxyz"` 无限环绕的字符串，所以 `base` 看起来是这样的：

- `"...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd...."`.

给你一个字符串 `s` ，请你统计并返回 `s` 中有多少 **不同****非空子串** 也在 `base` 中出现。

**示例 1：**

```text
输入：s = "a"
输出：1
解释：字符串 s 的子字符串 "a" 在 base 中出现。
```

**示例 2：**

```text
输入：s = "cac"
输出：2
解释：字符串 s 有两个子字符串 ("a", "c") 在 base 中出现。
```

**示例 3：**

```text
输入：s = "zab"
输出：6
解释：字符串 s 有六个子字符串 ("z", "a", "b", "za", "ab", and "zab") 在 base 中出现。
```

**提示：**

- `1 s 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨定义一个长度为 $26$ 的数组 $f$，其中 $f[i]$ 表示以第 $i$ 个字符结尾的最长连续子串的长度。那么答案就是 $f$ 中所有元素的和。

我们定义一个变量 $k$，表示以当前字符结尾的最长连续子串的长度。遍历字符串 $s$，对于每个字符 $c$，如果 $c$ 和前一个字符 $s[i - 1]$ 之间的差值为 $1$，那么 $k$ 就加 $1$，否则 $k$ 重置为 $1$。然后更新 $f[c]$ 为 $f[c]$ 和 $k$ 的较大值。

最后返回 $f$ 中所有元素的和即可。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $s$ 的长度。空间复杂度 $O(|\Sigma|)$，其中 $\Sigma$ 是字符集，这里是小写字母集合。

### 示意图

```text
输入/状态  ->  按规则更新候选状态  ->  得到答案
   |                 |                    |
  边界             不变量               返回值
```

---

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 参考解法 | 见「参考解法要点」 | 见「参考解法要点」 |

---

## 代码实现

### Go

```go
// Unique Substrings in Wraparound String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findSubstringInWraproundString(s string) (ans int) {
	f := [26]int{}
	k := 0
	for i := range s {
		if i > 0 && (s[i]-s[i-1]+26)%26 == 1 {
			k++
		} else {
			k = 1
		}
		f[s[i]-'a'] = max(f[s[i]-'a'], k)
	}
	for _, x := range f {
		ans += x
	}
	return
}
```

### Java

```java
// Unique Substrings in Wraparound String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findSubstringInWraproundString(String s) {
        int[] f = new int[26];
        int n = s.length();
        for (int i = 0, k = 0; i < n; ++i) {
            if (i > 0 && (s.charAt(i) - s.charAt(i - 1) + 26) % 26 == 1) {
                ++k;
            } else {
                k = 1;
            }
            f[s.charAt(i) - 'a'] = Math.max(f[s.charAt(i) - 'a'], k);
        }
        return Arrays.stream(f).sum();
    }
}
```

### Python

```python
# Unique Substrings in Wraparound String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findSubstringInWraproundString(self, s: str) -> int:
        f = defaultdict(int)
        k = 0
        for i, c in enumerate(s):
            if i and (ord(c) - ord(s[i - 1])) % 26 == 1:
                k += 1
            else:
                k = 1
            f[c] = max(f[c], k)
        return sum(f.values())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

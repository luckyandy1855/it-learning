# 1153. String Transforms Into Another String

---
编号: 1153
题目: String Transforms Into Another String
难度: 困难
标签: [图, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/string-transforms-into-another-string/
---

## 题目描述

给出两个长度相同的字符串 `str1` 和 `str2`。请你帮忙判断字符串 `str1` 能不能在 **零次** 或 **多次** *转化* 后变成字符串 `str2`。

每一次转化时，你可以将 `str1` 中出现的 **所有** 相同字母变成其他 **任何** 小写英文字母。

只有在字符串 `str1` 能够通过上述方式顺利转化为字符串 `str2` 时才能返回 `true` 。​​

**示例 1：**

```text
输入：str1 = "aabcc", str2 = "ccdee"
输出：true
解释：将 'c' 变成 'e'，然后把 'b' 变成 'd'，接着再把 'a' 变成 'c'。注意，转化的顺序也很重要。
```

**示例 2：**

```text
输入：str1 = "leetcode", str2 = "codeleet"
输出：false
解释：我们没有办法能够把 str1 转化为 str2。
```

**提示：**

- `1 <= str1.length == str2.length <= 10^4`

- `str1` 和 `str2` 中都只会出现小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「图, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先判断 `str1` 和 `str2` 是否相等，若相等，直接返回 `true`。

然后我们统计 `str2` 中每个字母出现的次数，若出现的次数等于 $26$，说明 `str2` 包含了所有的小写字母，那么无论 `str1` 如何转换，都无法得到 `str2`，直接返回 `false`。

否则，我们用数组或哈希表 `d` 记录 `str1` 中每个字母转换后的字母。遍历字符串 `str1` 和 `str2`，若 `str1` 中的某个字母已经转换过，那么其转换后的字母必须与 `str2` 中对应位置的字母相同，否则返回 `false`。

遍历结束后，返回 `true`。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 为字符串 `str1` 的长度，而 $C$ 为字符集大小，本题中 $C = 26$。

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
// String Transforms Into Another String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canConvert(str1 string, str2 string) bool {
	if str1 == str2 {
		return true
	}
	s := map[rune]bool{}
	for _, c := range str2 {
		s[c] = true
		if len(s) == 26 {
			return false
		}
	}
	d := [26]int{}
	for i, c := range str1 {
		a, b := int(c-'a'), int(str2[i]-'a')
		if d[a] == 0 {
			d[a] = b + 1
		} else if d[a] != b+1 {
			return false
		}
	}
	return true
}
```

### Java

```java
// String Transforms Into Another String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canConvert(String str1, String str2) {
        if (str1.equals(str2)) {
            return true;
        }
        int m = 0;
        int[] cnt = new int[26];
        int n = str1.length();
        for (int i = 0; i < n; ++i) {
            if (++cnt[str2.charAt(i) - 'a'] == 1) {
                ++m;
            }
        }
        if (m == 26) {
            return false;
        }
        int[] d = new int[26];
        for (int i = 0; i < n; ++i) {
            int a = str1.charAt(i) - 'a';
            int b = str2.charAt(i) - 'a';
            if (d[a] == 0) {
                d[a] = b + 1;
            } else if (d[a] != b + 1) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# String Transforms Into Another String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canConvert(self, str1: str, str2: str) -> bool:
        if str1 == str2:
            return True
        if len(set(str2)) == 26:
            return False
        d = {}
        for a, b in zip(str1, str2):
            if a not in d:
                d[a] = b
            elif d[a] != b:
                return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

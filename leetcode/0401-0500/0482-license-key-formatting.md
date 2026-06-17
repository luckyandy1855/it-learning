# 0482. License Key Formatting

---
编号: 482
题目: License Key Formatting
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/license-key-formatting/
---

## 题目描述

给定一个许可密钥字符串 `s`，仅由字母、数字字符和破折号组成。字符串由 `n` 个破折号分成 `n + 1` 组。你也会得到一个整数 `k` 。

我们想要重新格式化字符串 `s`，使每一组包含 `k` 个字符，除了第一组，它可以比 `k` 短，但仍然必须包含至少一个字符。此外，两组之间必须插入破折号，并且应该将所有小写字母转换为大写字母。

返回 *重新格式化的许可密钥* 。

**示例 1：**

```text
输入：S = "5F3Z-2e-9-w", k = 4
输出："5F3Z-2E9W"
解释：字符串 S 被分成了两个部分，每部分 4 个字符；
     注意，两个额外的破折号需要删掉。
```

**示例 2：**

```text
输入：S = "2-5g-3-J", k = 2
输出："2-5G-3J"
解释：字符串 S 被分成了 3 个部分，按照前面的规则描述，第一部分的字符可以少于给定的数量，其余部分皆为 2 个字符。
```

**提示:**

- `1 <= s.length <= 10^5`

- `s` 只包含字母、数字和破折号 `'-'`.

- `1 <= k <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先统计出字符串 $s$ 中除去破折号之外的字符个数，并对 $k$ 取模，得到第一组字符的个数。如果为 $0$，则第一组字符个数为 $k$，否则为取模的结果。

接着我们遍历字符串 $s$，对于每个字符，如果是破折号，则跳过；否则将其转换为大写字母，并将其加入答案字符串中。同时，我们维护一个计数器 $cnt$，表示当前组还剩余的字符个数，当 $cnt$ 减为 $0$ 时，我们需要更新 $cnt$ 为 $k$，并且如果当前字符不是最后一个字符，我们需要在答案字符串中加入一个破折号。

最后，我们移除答案字符串末尾的破折号，并返回答案字符串。

时间复杂度 $O(n)$，其中 $n$ 为字符串 $s$ 的长度。忽略答案字符串的空间消耗，空间复杂度 $O(1)$。

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
// License Key Formatting：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func licenseKeyFormatting(s string, k int) string {
	n := len(s)
	cnt := (n - strings.Count(s, "-")) % k
	if cnt == 0 {
		cnt = k
	}

	var ans strings.Builder
	for i := 0; i < n; i++ {
		c := s[i]
		if c == '-' {
			continue
		}
		if cnt == 0 {
			cnt = k
			ans.WriteByte('-')
		}
		ans.WriteRune(unicode.ToUpper(rune(c)))
		cnt--
	}

	return ans.String()
}
```

### Java

```java
// License Key Formatting：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String licenseKeyFormatting(String s, int k) {
        int n = s.length();
        int cnt = (int) (n - s.chars().filter(ch -> ch == '-').count()) % k;
        if (cnt == 0) {
            cnt = k;
        }
        StringBuilder ans = new StringBuilder();
        for (int i = 0; i < n; i++) {
            char c = s.charAt(i);
            if (c == '-') {
                continue;
            }
            ans.append(Character.toUpperCase(c));
            --cnt;
            if (cnt == 0) {
                cnt = k;
                if (i != n - 1) {
                    ans.append('-');
                }
            }
        }
        if (ans.length() > 0 && ans.charAt(ans.length() - 1) == '-') {
            ans.deleteCharAt(ans.length() - 1);
        }
        return ans.toString();
    }
}
```

### Python

```python
# License Key Formatting：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def licenseKeyFormatting(self, s: str, k: int) -> str:
        n = len(s)
        cnt = (n - s.count("-")) % k or k
        ans = []
        for i, c in enumerate(s):
            if c == "-":
                continue
            ans.append(c.upper())
            cnt -= 1
            if cnt == 0:
                cnt = k
                if i != n - 1:
                    ans.append("-")
        return "".join(ans).rstrip("-")
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

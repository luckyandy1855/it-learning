# 0555. Split Concatenated Strings

---
编号: 555
题目: Split Concatenated Strings
难度: 中等
标签: [贪心, 数组, 字符串]
来源链接: https://leetcode.com/problems/split-concatenated-strings/
---

## 题目描述

给定一个字符串列表 `strs`，你可以将这些字符串连接成一个循环字符串，对于每个字符串，你可以选择是否翻转它。在所有可能的循环字符串中，你需要分割循环字符串（这将使循环字符串变成一个常规的字符串），然后找到字典序最大的字符串。

具体来说，要找到字典序最大的字符串，你需要经历两个阶段：

- 将所有字符串连接成一个循环字符串，你可以选择是否翻转某些字符串，并按照给定的顺序连接它们。

- 在循环字符串的某个位置分割它，这将使循环字符串从分割点变成一个常规的字符串。

你的工作是在所有可能的常规字符串中找到字典序最大的一个。

**示例 1:**

```text
输入: strs = ["abc","xyz"]
输出: "zyxcba"
解释: 你可以得到循环字符串 "-abcxyz-", "-abczyx-", "-cbaxyz-", "-cbazyx-"，其中 '-' 代表循环状态。
答案字符串来自第四个循环字符串， 你可以从中间字符 'a' 分割开然后得到 "zyxcba"。
```

**示例 2:**

```text
输入: strs = ["abc"]
输出: "cba"
```

**提示:**

- `1 <= strs.length <= 1000`

- `1 <= strs[i].length <= 1000`

- `1 <= sum(strs[i].length) <= 1000`

- `strs[i]` 只包含小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先遍历字符串数组 `strs`，对于每个字符串 $s$，如果 $s$ 的反转字符串 $t$ 比 $s$ 大，那么我们就将 $s$ 替换为 $t$。

然后我们再枚举字符串数组 `strs` 的每个位置 $i$ 作为分割点，将字符串数组 `strs` 拆成两部分，分别为 $strs[i + 1:]$ 和 $strs[:i]$，然后将这两部分拼接起来，得到一个新的字符串 $t$。接下来，我们枚举当前字符串 $strs[i]$ 的每个位置 $j$，其后缀部分为 $a=strs[i][j:]$，前缀部分为 $b=strs[i][:j]$，那么我们可以将 $a$, $t$ 和 $b$ 拼接起来，得到一个新的字符串 $cur$，如果 $cur$ 比当前答案大，那么我们就更新答案。这是将 $strs[i]$ 翻转后的情况，我们还需要考虑 $strs[i]$ 不翻转的情况，即将 $a$, $t$ 和 $b$ 的顺序反过来拼接，得到一个新的字符串 $cur$，如果 $cur$ 比当前答案大，那么我们就更新答案。

最后，我们返回答案即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为字符串数组 `strs` 的长度。

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
// Split Concatenated Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func splitLoopedString(strs []string) (ans string) {
	for i, s := range strs {
		t := reverse(s)
		if s < t {
			strs[i] = t
		}
	}
	for i, s := range strs {
		sb := &strings.Builder{}
		for _, w := range strs[i+1:] {
			sb.WriteString(w)
		}
		for _, w := range strs[:i] {
			sb.WriteString(w)
		}
		t := sb.String()
		for j := 0; j < len(s); j++ {
			a, b := s[j:], s[0:j]
			cur := a + t + b
			if ans < cur {
				ans = cur
			}
			cur = reverse(b) + t + reverse(a)
			if ans < cur {
				ans = cur
			}
		}
	}
	return ans
}

func reverse(s string) string {
	t := []byte(s)
	for i, j := 0, len(t)-1; i < j; i, j = i+1, j-1 {
		t[i], t[j] = t[j], t[i]
	}
	return string(t)
}
```

### Java

```java
// Split Concatenated Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String splitLoopedString(String[] strs) {
        int n = strs.length;
        for (int i = 0; i < n; ++i) {
            String s = strs[i];
            String t = new StringBuilder(s).reverse().toString();
            if (s.compareTo(t) < 0) {
                strs[i] = t;
            }
        }
        String ans = "";
        for (int i = 0; i < n; ++i) {
            String s = strs[i];
            StringBuilder sb = new StringBuilder();
            for (int j = i + 1; j < n; ++j) {
                sb.append(strs[j]);
            }
            for (int j = 0; j < i; ++j) {
                sb.append(strs[j]);
            }
            String t = sb.toString();
            for (int j = 0; j < s.length(); ++j) {
                String a = s.substring(j);
                String b = s.substring(0, j);
                String cur = a + t + b;
                if (ans.compareTo(cur) < 0) {
                    ans = cur;
                }
                cur = new StringBuilder(b)
                          .reverse()
                          .append(t)
                          .append(new StringBuilder(a).reverse().toString())
                          .toString();
                if (ans.compareTo(cur) < 0) {
                    ans = cur;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Split Concatenated Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def splitLoopedString(self, strs: List[str]) -> str:
        strs = [s[::-1] if s[::-1] > s else s for s in strs]
        ans = ''.join(strs)
        for i, s in enumerate(strs):
            t = ''.join(strs[i + 1 :]) + ''.join(strs[:i])
            for j in range(len(s)):
                a = s[j:]
                b = s[:j]
                ans = max(ans, a + t + b)
                ans = max(ans, b[::-1] + t + a[::-1])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0761. Special Binary String

---
编号: 761
题目: Special Binary String
难度: 困难
标签: [字符串, 分治, 排序]
来源链接: https://leetcode.com/problems/special-binary-string/
---

## 题目描述

**特殊的二进制字符串** 是具有以下两个性质的二进制序列：

- `0` 的数量与 `1` 的数量相等。

- 二进制序列的每一个前缀码中 `1` 的数量要大于等于 `0` 的数量。

给定一个特殊的二进制字符串 `s`。

一次移动操作包括选择字符串 `s` 中的两个连续的、非空的、特殊子串，并交换它们。两个字符串是连续的，如果第一个字符串的最后一个字符与第二个字符串的第一个字符的索引相差正好为 1。

返回在字符串上应用任意次操作后可能得到的字典序最大的字符串。

**示例 1:**

```text
输入: S = "11011000"
输出: "11100100"
解释:
将子串 "10" （在 s[1] 出现） 和 "1100" （在 s[3] 出现）进行交换。
这是在进行若干次操作后按字典序排列最大的结果。
```

示例 2：

```text
输入：s = "10"
输出："10"
```

**提示：**

- `1 <= s.length <= 50`

- `s[i]` 为 `'0'` 或 `'1'`。

- `s` 是一个特殊的二进制字符串。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 分治, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以把特殊的二进制序列看作“有效的括号”，其中 $1$ 代表左括号，而 $0$ 代表右括号。例如，"11011000" 可以看作："(()(()))"。

交换两个连续非空的特殊子串，相当于交换两个相邻的有效括号，我们可以使用递归来解决这个问题。

我们将字符串 $s$ 中的每个“有效的括号”都看作一部分，递归处理，最后进行排序，得到最终答案。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 是字符串 $s$ 的长度。

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
// Special Binary String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func makeLargestSpecial(s string) string {
	if s == "" {
		return ""
	}
	ans := sort.StringSlice{}
	cnt := 0
	for i, j := 0, 0; i < len(s); i++ {
		if s[i] == '1' {
			cnt++
		} else {
			cnt--
		}
		if cnt == 0 {
			ans = append(ans, "1"+makeLargestSpecial(s[j+1:i])+"0")
			j = i + 1
		}
	}
	sort.Sort(sort.Reverse(ans))
	return strings.Join(ans, "")
}
```

### Java

```java
// Special Binary String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String makeLargestSpecial(String s) {
        if ("".equals(s)) {
            return "";
        }
        List<String> ans = new ArrayList<>();
        int cnt = 0;
        for (int i = 0, j = 0; i < s.length(); ++i) {
            cnt += s.charAt(i) == '1' ? 1 : -1;
            if (cnt == 0) {
                String t = "1" + makeLargestSpecial(s.substring(j + 1, i)) + "0";
                ans.add(t);
                j = i + 1;
            }
        }
        ans.sort(Comparator.reverseOrder());
        return String.join("", ans);
    }
}
```

### Python

```python
# Special Binary String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def makeLargestSpecial(self, s: str) -> str:
        if s == '':
            return ''
        ans = []
        cnt = 0
        i = j = 0
        while i < len(s):
            cnt += 1 if s[i] == '1' else -1
            if cnt == 0:
                ans.append('1' + self.makeLargestSpecial(s[j + 1 : i]) + '0')
                j = i + 1
            i += 1
        ans.sort(reverse=True)
        return ''.join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0833. Find And Replace in String

---
编号: 833
题目: Find And Replace in String
难度: 中等
标签: [数组, 哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/find-and-replace-in-string/
---

## 题目描述

你会得到一个字符串 `s` (索引从 0 开始)，你必须对它执行 `k` 个替换操作。替换操作以三个长度均为 `k` 的并行数组给出：`indices`, `sources`,  `targets`。

要完成第 `i` 个替换操作:

- 检查 **子字符串**  `sources[i]` 是否出现在 **原字符串** `s` 的索引 `indices[i]` 处。

- 如果没有出现， **什么也不做** 。

- 如果出现，则用 `targets[i]` **替换** 该子字符串。

例如，如果 `s = "abcd"` ， `indices[i] = 0` , `sources[i] = "ab"`， `targets[i] = "eee"` ，那么替换的结果将是 `"eeecd"` 。

所有替换操作必须 **同时** 发生，这意味着替换操作不应该影响彼此的索引。测试用例保证元素间**不会重叠 **。

- 例如，一个 `s = "abc"` ，  `indices = [0,1]` ， `sources = ["ab"，"bc"]` 的测试用例将不会生成，因为 `"ab"` 和 `"bc"` 替换重叠。

*在对 `s` 执行所有替换操作后返回 **结果字符串** 。*

**子字符串** 是字符串中连续的字符序列。

**示例 1：**

```text
输入：s = "abcd", indices = [0,2], sources = ["a","cd"], targets = ["eee","ffff"]
输出："eeebffff"
解释：
"a" 从 s 中的索引 0 开始，所以它被替换为 "eee"。
"cd" 从 s 中的索引 2 开始，所以它被替换为 "ffff"。
```

**示例 2：**

```text
输入：s = "abcd", indices = [0,2], sources = ["ab","ec"], targets = ["eee","ffff"]
输出："eeecd"
解释：
"ab" 从 s 中的索引 0 开始，所以它被替换为 "eee"。
"ec" 没有从原始的 S 中的索引 2 开始，所以它没有被替换。
```

**提示：**

- `1 <= s.length <= 1000`

- `k == indices.length == sources.length == targets.length`

- `1 <= k <= 100`

- `0 <= indices[i] < s.length`

- `1 <= sources[i].length, targets[i].length <= 50`

- `s` 仅由小写英文字母组成

- `sources[i]` 和 `targets[i]` 仅由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们遍历每个替换操作，对于当前第 $k$ 个替换操作 $(i, \text{src})$，如果 $s[i..i+|\text{src}|-1]$ 与 $\text{src}$ 相等，此时我们记录下标 $i$ 处需要替换的是 $\text{targets}$ 的第 $k$ 个字符串，否则不需要替换。

接下来，我们只需要遍历原字符串 $s$，根据记录的信息进行替换即可。

时间复杂度 $O(L)$，空间复杂度 $O(n)$。其中 $L$ 是所有字符串的长度之和，而 $n$ 是字符串 $s$ 的长度。

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
// Find And Replace in String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findReplaceString(s string, indices []int, sources []string, targets []string) string {
	n := len(s)
	d := make([]int, n)
	for k, i := range indices {
		if strings.HasPrefix(s[i:], sources[k]) {
			d[i] = k + 1
		}
	}
	ans := &strings.Builder{}
	for i := 0; i < n; {
		if d[i] > 0 {
			ans.WriteString(targets[d[i]-1])
			i += len(sources[d[i]-1])
		} else {
			ans.WriteByte(s[i])
			i++
		}
	}
	return ans.String()
}
```

### Java

```java
// Find And Replace in String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String findReplaceString(String s, int[] indices, String[] sources, String[] targets) {
        int n = s.length();
        var d = new int[n];
        Arrays.fill(d, -1);
        for (int k = 0; k < indices.length; ++k) {
            int i = indices[k];
            if (s.startsWith(sources[k], i)) {
                d[i] = k;
            }
        }
        var ans = new StringBuilder();
        for (int i = 0; i < n;) {
            if (d[i] >= 0) {
                ans.append(targets[d[i]]);
                i += sources[d[i]].length();
            } else {
                ans.append(s.charAt(i++));
            }
        }
        return ans.toString();
    }
}
```

### Python

```python
# Find And Replace in String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findReplaceString(
        self, s: str, indices: List[int], sources: List[str], targets: List[str]
    ) -> str:
        n = len(s)
        d = [-1] * n
        for k, (i, src) in enumerate(zip(indices, sources)):
            if s.startswith(src, i):
                d[i] = k
        ans = []
        i = 0
        while i < n:
            if ~d[i]:
                ans.append(targets[d[i]])
                i += len(sources[d[i]])
            else:
                ans.append(s[i])
                i += 1
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

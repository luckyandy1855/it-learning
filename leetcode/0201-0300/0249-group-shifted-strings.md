# 0249. Group Shifted Strings

---
编号: 249
题目: Group Shifted Strings
难度: 中等
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/group-shifted-strings/
---

## 题目描述

对字符串进行 “移位” 的操作：

- **右移**：将字符串中每个字母都变为其在字母表中 **后续** 的字母，其中用 'a' 替换 'z'。比如，`"abc"` 能够右移为 `"bcd"`，`"xyz"` 能够右移为 `"yza"`。

- **左移**：将字符串中每个字母都变为其在字母表中 之前 的字母，其中用 'z' 替换 'a'。比如，`"bcd"` 能够左移为 `"abc"`，`"yza"` 能够左移为 `"xyz"`。

我们可以不断地向两个方向移动字符串，形成 **无限的移位序列**。

- 例如，移动 `"abc"` 来形成序列：`...  "abc"  "bcd"  ...  "xyz"  "yza"  ...  "zab"  "abc"  ...`

给定一个字符串数组 `strings`，将属于相同移位序列的所有 `strings[i]` 进行分组。你可以以 **任意顺序** 返回答案。

示例 1：

**输入：**strings = ["abc","bcd","acef","xyz","az","ba","a","z"]

**输出：**[["acef"],["a","z"],["abc","bcd","xyz"],["az","ba"]]

示例 2：

**输入：**strings = ["a"]

**输出：**[["a"]]

**提示：**

- `1 <= strings.length <= 200`

- `1 <= strings[i].length <= 50`

- `strings[i]` 只包含小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $g$ 来存储每个字符串移位后且首位为 '`a`' 的字符串。即 $g[t]$ 表示所有字符串移位后字符串为 $t$ 的字符串集合。

我们遍历每个字符串，对于每个字符串，我们计算其移位后的字符串 $t$，然后将其加入到 $g[t]$ 中。

最后，我们将 $g$ 中的所有值取出来，即为答案。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 为所有字符串的长度之和。

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
// Group Shifted Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func groupStrings(strings []string) [][]string {
	g := make(map[string][]string)
	for _, s := range strings {
		t := []byte(s)
		diff := t[0] - 'a'
		for i := range t {
			t[i] -= diff
			if t[i] < 'a' {
				t[i] += 26
			}
		}
		g[string(t)] = append(g[string(t)], s)
	}
	ans := make([][]string, 0, len(g))
	for _, v := range g {
		ans = append(ans, v)
	}
	return ans
}
```

### Java

```java
import java.util.*;
// Group Shifted Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public List<List<String>> groupStrings(String[] strings) {
        Map<String, List<String>> g = new HashMap<>();
        for (var s : strings) {
            char[] t = s.toCharArray();
            int diff = t[0] - 'a';
            for (int i = 0; i < t.length; ++i) {
                t[i] = (char) (t[i] - diff);
                if (t[i] < 'a') {
                    t[i] += 26;
                }
            }
            g.computeIfAbsent(new String(t), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(g.values());
    }
}
```

### Python

```python
# Group Shifted Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def groupStrings(self, strings: List[str]) -> List[List[str]]:
        g = defaultdict(list)
        for s in strings:
            diff = ord(s[0]) - ord("a")
            t = []
            for c in s:
                c = ord(c) - diff
                if c < ord("a"):
                    c += 26
                t.append(chr(c))
            g["".join(t)].append(s)
        return list(g.values())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

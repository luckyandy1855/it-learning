# 1055. Shortest Way to Form String

---
编号: 1055
题目: Shortest Way to Form String
难度: 中等
标签: [贪心, 双指针, 字符串, 二分查找]
来源链接: https://leetcode.com/problems/shortest-way-to-form-string/
---

## 题目描述

对于任何字符串，我们可以通过删除其中一些字符（也可能不删除）来构造该字符串的 **子序列** 。(例如，`“ace”` 是 `“abcde”` 的子序列，而 `“aec”` 不是)。

给定源字符串 `source` 和目标字符串 `target`，返回 *源字符串 `source` 中能通过串联形成目标字符串 *`target` *的 **子序列** 的最小数量 *。如果无法通过串联源字符串中的子序列来构造目标字符串，则返回 `-1`。

**示例 1：**

```text
输入：source = "abc", target = "abcbc"
输出：2
解释：目标字符串 "abcbc" 可以由 "abc" 和 "bc" 形成，它们都是源字符串 "abc" 的子序列。
```

**示例 2：**

```text
输入：source = "abc", target = "acdbc"
输出：-1
解释：由于目标字符串中包含字符 "d"，所以无法由源字符串的子序列构建目标字符串。
```

**示例 3：**

```text
输入：source = "xyz", target = "xzyxz"
输出：3
解释：目标字符串可以按如下方式构建： "xz" + "y" + "xz"。
```

**提示：**

- `1 <= source.length, target.length <= 1000`

- `source` 和 `target` 仅包含英文小写字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 双指针, 字符串, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用双指针的方法，用指针 $j$ 指向目标字符串 `target`，然后遍历源字符串 `source`，用指针 $i$ 指向源字符串 `source`，如果 $source[i] = target[j]$，则 $i$ 和 $j$ 同时向后移动一位，否则只移动 $i$ 指针。当指针 $i$ 和 $j$ 都到达字符串末尾时，如果没有找到相等的字符，则返回 $-1$，否则子序列数量加一，然后将指针 $i$ 置为 $0$，继续遍历。

遍历结束后，返回子序列数量即可。

时间复杂度 $O(m \times n)$，其中 $m$ 和 $n$ 分别为字符串 `source` 和 `target` 的长度。空间复杂度 $O(1)$。

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
// Shortest Way to Form String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestWay(source string, target string) int {
	m, n := len(source), len(target)
	ans, j := 0, 0
	for j < n {
		ok := false
		for i := 0; i < m && j < n; i++ {
			if source[i] == target[j] {
				ok = true
				j++
			}
		}
		if !ok {
			return -1
		}
		ans++
	}
	return ans
}
```

### Java

```java
// Shortest Way to Form String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int shortestWay(String source, String target) {
        int m = source.length(), n = target.length();
        int ans = 0, j = 0;
        while (j < n) {
            int i = 0;
            boolean ok = false;
            while (i < m && j < n) {
                if (source.charAt(i) == target.charAt(j)) {
                    ok = true;
                    ++j;
                }
                ++i;
            }
            if (!ok) {
                return -1;
            }
            ++ans;
        }
        return ans;
    }
}
```

### Python

```python
# Shortest Way to Form String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestWay(self, source: str, target: str) -> int:
        def f(i, j):
            while i < m and j < n:
                if source[i] == target[j]:
                    j += 1
                i += 1
            return j

        m, n = len(source), len(target)
        ans = j = 0
        while j < n:
            k = f(0, j)
            if k == j:
                return -1
            j = k
            ans += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

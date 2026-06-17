# 0830. Positions of Large Groups

---
编号: 830
题目: Positions of Large Groups
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/positions-of-large-groups/
---

## 题目描述

在一个由小写字母构成的字符串 `s` 中，包含由一些连续的相同字符所构成的分组。

例如，在字符串 `s = "abbxxxxzyy"` 中，就含有 `"a"`, `"bb"`, `"xxxx"`, `"z"` 和 `"yy"` 这样的一些分组。

分组可以用区间 `[start, end]` 表示，其中 `start` 和 `end` 分别表示该分组的起始和终止位置的下标。上例中的 `"xxxx"` 分组用区间表示为 `[3,6]` 。

我们称所有包含大于或等于三个连续字符的分组为 **较大分组** 。

找到每一个 **较大分组** 的区间，**按起始位置下标递增顺序排序后**，返回结果。

**示例 1：**

```text
输入：s = "abbxxxxzzy"
输出：[[3,6]]
解释："xxxx" 是一个起始于 3 且终止于 6 的较大分组。
```

**示例 2：**

```text
输入：s = "abc"
输出：[]
解释："a","b" 和 "c" 均不是符合要求的较大分组。
```

**示例 3：**

```text
输入：s = "abcdddeeeeaabbbcd"
输出：[[3,5],[6,9],[12,14]]
解释：较大分组为 "ddd", "eeee" 和 "bbb"
```

**示例 4：**

```text
输入：s = "aba"
输出：[]
```

**提示：**

- `1 <= s.length <= 1000`

- `s` 仅含小写英文字母

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

我们用双指针 $i$ 和 $j$ 找到每个分组的起始位置和终止位置，然后判断分组长度是否大于等于 $3$，若是则将其加入结果数组。

时间复杂度 $O(n)$，其中 $n$ 为字符串 $s$ 的长度。

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
// Positions of Large Groups：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largeGroupPositions(s string) [][]int {
	i, n := 0, len(s)
	ans := [][]int{}
	for i < n {
		j := i
		for j < n && s[j] == s[i] {
			j++
		}
		if j-i >= 3 {
			ans = append(ans, []int{i, j - 1})
		}
		i = j
	}
	return ans
}
```

### Java

```java
// Positions of Large Groups：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> largeGroupPositions(String s) {
        int n = s.length();
        int i = 0;
        List<List<Integer>> ans = new ArrayList<>();
        while (i < n) {
            int j = i;
            while (j < n && s.charAt(j) == s.charAt(i)) {
                ++j;
            }
            if (j - i >= 3) {
                ans.add(List.of(i, j - 1));
            }
            i = j;
        }
        return ans;
    }
}
```

### Python

```python
# Positions of Large Groups：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largeGroupPositions(self, s: str) -> List[List[int]]:
        i, n = 0, len(s)
        ans = []
        while i < n:
            j = i
            while j < n and s[j] == s[i]:
                j += 1
            if j - i >= 3:
                ans.append([i, j - 1])
            i = j
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

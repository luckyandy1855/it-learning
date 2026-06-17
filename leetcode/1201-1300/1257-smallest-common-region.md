# 1257. Smallest Common Region

---
编号: 1257
题目: Smallest Common Region
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/smallest-common-region/
---

## 题目描述

给你一些区域列表 `regions` ，每个列表的第一个区域都 **直接** 包含这个列表内所有其他区域。

如果一个区域 `x` 直接包含区域 `y`，并且区域 `y` 直接包含区域 `z`，那么说区域 `x` **间接** 包含区域 `z`。请注意，区域 `x` 也 **间接** 包含所有在 `y` 中 **间接** 包含的区域。

很自然地，如果区域 `x` 包含区域 `y` ，那么区域 `x`  比区域 `y` 大。同时根据定义，区域 `x` 包含自身。

给定两个区域 `region1` 和 `region2` ，找到同时包含这两个区域的 **最小 **区域。

数据同样保证最小区域一定存在。

**示例 1：**

```text
输入：
regions = [["Earth","North America","South America"],
["North America","United States","Canada"],
["United States","New York","Boston"],
["Canada","Ontario","Quebec"],
["South America","Brazil"]],
region1 = "Quebec",
region2 = "New York"
输出："North America"
```

示例 2：

```text
输入：regions = [["Earth", "North America", "South America"],["North America", "United States", "Canada"],["United States", "New York", "Boston"],["Canada", "Ontario", "Quebec"],["South America", "Brazil"]], region1 = "Canada", region2 = "South America"
输出："Earth"
```

**提示：**

- `2 <= regions.length <= 10^4`

- `2 <= regions[i].length <= 20`

- `1 <= regions[i][j].length, region1.length, region2.length <= 20`

- `region1 != region2`

- `regions[i][j]`，`region1` 和 `region2` 由英语字母组成。

- 输入保证存在一个区域直接或间接包含所有其他区域。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $\textit{g}$ 来存储每个区域的父区域，然后从 $\textit{region1}$ 开始，不断向上找到所有的父区域，直到根区域，将这些区域放入集合 $\textit{s}$ 中。然后从 $\textit{region2}$ 开始，不断向上找到第一个在 $\textit{s}$ 中的区域，即为最小公共区域。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为区域列表 $\textit{regions}$ 的长度。

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
// Smallest Common Region：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findSmallestRegion(regions [][]string, region1 string, region2 string) string {
	g := make(map[string]string)

	for _, r := range regions {
		x := r[0]
		for _, y := range r[1:] {
			g[y] = x
		}
	}

	s := make(map[string]bool)
	for x := region1; x != ""; x = g[x] {
		s[x] = true
	}

	x := region2
	for g[x] != "" && !s[x] {
		x = g[x]
	}

	return x
}
```

### Java

```java
// Smallest Common Region：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String findSmallestRegion(List<List<String>> regions, String region1, String region2) {
        Map<String, String> g = new HashMap<>();
        for (var r : regions) {
            String x = r.get(0);
            for (String y : r.subList(1, r.size())) {
                g.put(y, x);
            }
        }
        Set<String> s = new HashSet<>();
        for (String x = region1; x != null; x = g.get(x)) {
            s.add(x);
        }
        String x = region2;
        while (g.get(x) != null && !s.contains(x)) {
            x = g.get(x);
        }
        return x;
    }
}
```

### Python

```python
# Smallest Common Region：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findSmallestRegion(
        self, regions: List[List[str]], region1: str, region2: str
    ) -> str:
        g = {}
        for r in regions:
            x = r[0]
            for y in r[1:]:
                g[y] = x
        s = set()
        x = region1
        while x in g:
            s.add(x)
            x = g[x]
        x = region2
        while x in g and x not in s:
            x = g[x]
        return x
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

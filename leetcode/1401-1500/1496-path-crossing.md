# 1496. Path Crossing

---
编号: 1496
题目: Path Crossing
难度: 简单
标签: [哈希表, 字符串]
来源链接: https://leetcode.com/problems/path-crossing/
---

## 题目描述

给你一个字符串 `path`，其中 `path[i]` 的值可以是 `'N'`、`'S'`、`'E'` 或者 `'W'`，分别表示向北、向南、向东、向西移动一个单位。

你从二维平面上的原点 `(0, 0)` 处开始出发，按 `path` 所指示的路径行走。

如果路径在任何位置上与自身相交，也就是走到之前已经走过的位置，请返回 `true` ；否则，返回 `false` 。

示例 1：

```text
输入：path = "NES"
输出：false
解释：该路径没有在任何位置相交。
```

示例 2：

```text
输入：path = "NESWW"
输出：true
解释：该路径经过原点两次。
```

**提示：**

- `1 <= path.length <= 10^4`

- `path[i]` 为 `'N'`、`'S'`、`'E'` 或 `'W'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $vis$ 记录路径上的点。初始时 $vis$ 中只有原点 $(0, 0)$。

遍历字符串 $path$，对于每个字符 $c$，根据 $c$ 的值更新当前位置 $(i, j)$，然后判断 $(i, j)$ 是否在 $vis$ 中，如果在，则返回 `true`，否则将 $(i, j)$ 加入 $vis$ 中。

遍历结束后，返回 `false`。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $path$ 的长度。

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
// Path Crossing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isPathCrossing(path string) bool {
	i, j := 0, 0
	vis := map[int]bool{0: true}
	for _, c := range path {
		switch c {
		case 'N':
			i--
		case 'S':
			i++
		case 'E':
			j++
		case 'W':
			j--
		}
		if vis[i*20000+j] {
			return true
		}
		vis[i*20000+j] = true
	}
	return false
}
```

### Java

```java
// Path Crossing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isPathCrossing(String path) {
        int i = 0, j = 0;
        Set<Integer> vis = new HashSet<>();
        vis.add(0);
        for (int k = 0, n = path.length(); k < n; ++k) {
            switch (path.charAt(k)) {
                case 'N' -> --i;
                case 'S' -> ++i;
                case 'E' -> ++j;
                case 'W' -> --j;
            }
            int t = i * 20000 + j;
            if (!vis.add(t)) {
                return true;
            }
        }
        return false;
    }
}
```

### Python

```python
# Path Crossing：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isPathCrossing(self, path: str) -> bool:
        i = j = 0
        vis = {(0, 0)}
        for c in path:
            match c:
                case 'N':
                    i -= 1
                case 'S':
                    i += 1
                case 'E':
                    j += 1
                case 'W':
                    j -= 1
            if (i, j) in vis:
                return True
            vis.add((i, j))
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

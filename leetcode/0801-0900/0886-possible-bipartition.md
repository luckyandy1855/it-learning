# 0886. Possible Bipartition

---
编号: 886
题目: Possible Bipartition
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 并查集, 图]
来源链接: https://leetcode.com/problems/possible-bipartition/
---

## 题目描述

给定一组 `n` 人（编号为 `1, 2, ..., n`）， 我们想把每个人分进**任意**大小的两组。每个人都可能不喜欢其他人，那么他们不应该属于同一组。

给定整数 `n` 和数组 `dislikes` ，其中 `dislikes[i] = [ai, bi]` ，表示不允许将编号为 `ai` 和  `bi`的人归入同一组。当可以用这种方法将所有人分进两组时，返回 `true`；否则返回 `false`。

**示例 1：**

```text
输入：n = 4, dislikes = [[1,2],[1,3],[2,4]]
输出：true
解释：group1 [1,4], group2 [2,3]
```

**示例 2：**

```text
输入：n = 3, dislikes = [[1,2],[1,3],[2,3]]
输出：false
```

**示例 3：**

```text
输入：n = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]
输出：false
```

**提示：**

- `1 i i`

- `dislikes` 中每一组都 **不同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 并查集, 图」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用两种颜色对图进行染色，如果可以完成染色，那么就说明可以将所有人分进两组。

具体的染色方法如下：

- 初始化所有人的颜色为 $0$，表示还没有染色。
- 遍历所有人，如果当前人没有染色，那么就用颜色 $1$ 对其进行染色，然后将其所有不喜欢的人用颜色 $2$ 进行染色。如果染色过程中出现了冲突，那么就说明无法将所有人分进两组，返回 `false`。
- 如果所有人都染色成功，那么就说明可以将所有人分进两组，返回 `true`。

时间复杂度 $O(n + m)$，其中 $n$, $m$ 分别是人数和不喜欢的关系数。

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
// Possible Bipartition：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func possibleBipartition(n int, dislikes [][]int) bool {
	g := make([][]int, n)
	for _, e := range dislikes {
		a, b := e[0]-1, e[1]-1
		g[a] = append(g[a], b)
		g[b] = append(g[b], a)
	}
	color := make([]int, n)
	var dfs func(int, int) bool
	dfs = func(i, c int) bool {
		color[i] = c
		for _, j := range g[i] {
			if color[j] == c {
				return false
			}
			if color[j] == 0 && !dfs(j, 3-c) {
				return false
			}
		}
		return true
	}
	for i, c := range color {
		if c == 0 && !dfs(i, 1) {
			return false
		}
	}
	return true
}
```

### Java

```java
// Possible Bipartition：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<Integer>[] g;
    private int[] color;

    public boolean possibleBipartition(int n, int[][] dislikes) {
        g = new List[n];
        color = new int[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (var e : dislikes) {
            int a = e[0] - 1, b = e[1] - 1;
            g[a].add(b);
            g[b].add(a);
        }
        for (int i = 0; i < n; ++i) {
            if (color[i] == 0) {
                if (!dfs(i, 1)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean dfs(int i, int c) {
        color[i] = c;
        for (int j : g[i]) {
            if (color[j] == c) {
                return false;
            }
            if (color[j] == 0 && !dfs(j, 3 - c)) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Possible Bipartition：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def possibleBipartition(self, n: int, dislikes: List[List[int]]) -> bool:
        def dfs(i, c):
            color[i] = c
            for j in g[i]:
                if color[j] == c:
                    return False
                if color[j] == 0 and not dfs(j, 3 - c):
                    return False
            return True

        g = defaultdict(list)
        color = [0] * n
        for a, b in dislikes:
            a, b = a - 1, b - 1
            g[a].append(b)
            g[b].append(a)
        return all(c or dfs(i, 1) for i, c in enumerate(color))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

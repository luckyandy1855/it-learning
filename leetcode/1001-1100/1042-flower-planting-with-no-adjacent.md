# 1042. Flower Planting With No Adjacent

---
编号: 1042
题目: Flower Planting With No Adjacent
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 图]
来源链接: https://leetcode.com/problems/flower-planting-with-no-adjacent/
---

## 题目描述

有 `n` 个花园，按从 `1` 到 `n` 标记。另有数组 `paths` ，其中 `paths[i] = [xi, yi]` 描述了花园 `xi` 到花园 `yi` 的双向路径。在每个花园中，你打算种下四种花之一。

另外，所有花园 **最多** 有 **3** 条路径可以进入或离开.

你需要为每个花园选择一种花，使得通过路径相连的任何两个花园中的花的种类互不相同。

*以数组形式返回 **任一** 可行的方案作为答案 `answer`，其中 `answer[i]` 为在第 `(i+1)` 个花园中种植的花的种类。花的种类用  1、2、3、4 表示。保证存在答案。*

**示例 1：**

```text
输入：n = 3, paths = [[1,2],[2,3],[3,1]]
输出：[1,2,3]
解释：
花园 1 和 2 花的种类不同。
花园 2 和 3 花的种类不同。
花园 3 和 1 花的种类不同。
因此，[1,2,3] 是一个满足题意的答案。其他满足题意的答案有 [1,2,4]、[1,4,2] 和 [3,2,1]
```

**示例 2：**

```text
输入：n = 4, paths = [[1,2],[3,4]]
输出：[1,2,1,2]
```

**示例 3：**

```text
输入：n = 4, paths = [[1,2],[2,3],[3,4],[4,1],[1,3],[2,4]]
输出：[1,2,3,4]
```

**提示：**

- `1 i, yi i != yi`

- 每个花园 **最多** 有 **3** 条路径可以进入或离开

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 图」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先根据数组 $\textit{paths}$ 构建图 $g$，其中 $g[x]$ 表示与花园 $x$ 相邻的花园列表。

接下来，对于每个花园 $x$，我们先找出与 $x$ 相邻的花园 $y$，并将 $y$ 花园中种植的花的种类标记为已使用。然后我们从花的种类 $1$ 开始枚举，直到找到一个未被使用的花的种类 $c$，将 $c$ 标记为 $x$ 花园中种植的花的种类，然后继续枚举下一个花园。

枚举结束后，返回答案即可。

时间复杂度 $O(n + m)$，空间复杂度 $O(n + m)$。其中 $n$ 和 $m$ 分别是花园的数量和路径的数量。

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
// Flower Planting With No Adjacent：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func gardenNoAdj(n int, paths [][]int) []int {
	g := make([][]int, n)
	for _, p := range paths {
		x, y := p[0]-1, p[1]-1
		g[x] = append(g[x], y)
		g[y] = append(g[y], x)
	}
	ans := make([]int, n)
	for x := 0; x < n; x++ {
		used := [5]bool{}
		for _, y := range g[x] {
			used[ans[y]] = true
		}
		for c := 1; c < 5; c++ {
			if !used[c] {
				ans[x] = c
				break
			}
		}
	}
	return ans
}
```

### Java

```java
// Flower Planting With No Adjacent：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] gardenNoAdj(int n, int[][] paths) {
        List<Integer>[] g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (var p : paths) {
            int x = p[0] - 1, y = p[1] - 1;
            g[x].add(y);
            g[y].add(x);
        }
        int[] ans = new int[n];
        boolean[] used = new boolean[5];
        for (int x = 0; x < n; ++x) {
            Arrays.fill(used, false);
            for (int y : g[x]) {
                used[ans[y]] = true;
            }
            for (int c = 1; c < 5; ++c) {
                if (!used[c]) {
                    ans[x] = c;
                    break;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Flower Planting With No Adjacent：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def gardenNoAdj(self, n: int, paths: List[List[int]]) -> List[int]:
        g = defaultdict(list)
        for x, y in paths:
            x, y = x - 1, y - 1
            g[x].append(y)
            g[y].append(x)
        ans = [0] * n
        for x in range(n):
            used = {ans[y] for y in g[x]}
            for c in range(1, 5):
                if c not in used:
                    ans[x] = c
                    break
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

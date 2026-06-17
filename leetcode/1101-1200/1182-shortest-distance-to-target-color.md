# 1182. Shortest Distance to Target Color

---
编号: 1182
题目: Shortest Distance to Target Color
难度: 中等
标签: [数组, 二分查找, 动态规划]
来源链接: https://leetcode.com/problems/shortest-distance-to-target-color/
---

## 题目描述

给你一个数组 `colors`，里面有  `1`、`2`、 `3` 三种颜色。

我们需要在 `colors` 上进行一些查询操作 `queries`，其中每个待查项都由两个整数 `i` 和 `c` 组成。

现在请你帮忙设计一个算法，查找从索引 `i` 到具有目标颜色 `c` 的元素之间的最短距离。

如果不存在解决方案，请返回 `-1`。

**示例 1：**

```text
输入：colors = [1,1,2,1,3,2,2,3,3], queries = [[1,3],[2,2],[6,1]]
输出：[3,0,3]
解释：
距离索引 1 最近的颜色 3 位于索引 4（距离为 3）。
距离索引 2 最近的颜色 2 就是它自己（距离为 0）。
距离索引 6 最近的颜色 1 位于索引 3（距离为 3）。
```

**示例 2：**

```text
输入：colors = [1,2], queries = [[0,3]]
输出：[-1]
解释：colors 中没有颜色 3。
```

**提示：**

- `1 <= colors.length <= 5*10^4`

- `1 <= colors[i] <= 3`

- `1 <= queries.length <= 5*10^4`

- `queries[i].length == 2`

- `0 <= queries[i][0] < colors.length`

- `1 <= queries[i][1] <= 3`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以预处理出每个位置到左边最近的颜色 $1$,$2$,$3$ 的距离，以及每个位置到右边最近的颜色 $1$,$2$,$3$ 的距离，记录在数组 $left$ 和 $right$ 中。初始时 $left[0][0] = left[0][1] = left[0][2] = -\infty$，而 $right[n][0] = right[n][1] = right[n][2] = \infty$，其中 $n$ 是数组 $colors$ 的长度。

然后对于每个查询 $(i, c)$，最小距离就是 $d = \min(i - left[i + 1][c - 1], right[i][c - 1][i] - i)$，如果 $d \gt n$，则不存在解决方案，此次查询的答案为 $-1$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $colors$ 的长度。

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
// Shortest Distance to Target Color：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestDistanceColor(colors []int, queries [][]int) (ans []int) {
	n := len(colors)
	const inf = 1 << 30
	right := make([][3]int, n+1)
	left := make([][3]int, n+1)
	right[n] = [3]int{inf, inf, inf}
	left[0] = [3]int{-inf, -inf, -inf}
	for i := n - 1; i >= 0; i-- {
		for j := 0; j < 3; j++ {
			right[i][j] = right[i+1][j]
		}
		right[i][colors[i]-1] = i
	}
	for i := 1; i <= n; i++ {
		for j := 0; j < 3; j++ {
			left[i][j] = left[i-1][j]
		}
		left[i][colors[i-1]-1] = i - 1
	}
	for _, q := range queries {
		i, c := q[0], q[1]-1
		d := min(i-left[i+1][c], right[i][c]-i)
		if d > n {
			d = -1
		}
		ans = append(ans, d)
	}
	return
}
```

### Java

```java
// Shortest Distance to Target Color：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> shortestDistanceColor(int[] colors, int[][] queries) {
        int n = colors.length;
        final int inf = 1 << 30;
        int[][] right = new int[n + 1][3];
        Arrays.fill(right[n], inf);
        for (int i = n - 1; i >= 0; --i) {
            for (int j = 0; j < 3; ++j) {
                right[i][j] = right[i + 1][j];
            }
            right[i][colors[i] - 1] = i;
        }
        int[][] left = new int[n + 1][3];
        Arrays.fill(left[0], -inf);
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < 3; ++j) {
                left[i][j] = left[i - 1][j];
            }
            left[i][colors[i - 1] - 1] = i - 1;
        }
        List<Integer> ans = new ArrayList<>();
        for (int[] q : queries) {
            int i = q[0], c = q[1] - 1;
            int d = Math.min(i - left[i + 1][c], right[i][c] - i);
            ans.add(d > n ? -1 : d);
        }
        return ans;
    }
}
```

### Python

```python
# Shortest Distance to Target Color：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestDistanceColor(
        self, colors: List[int], queries: List[List[int]]
    ) -> List[int]:
        n = len(colors)
        right = [[inf] * 3 for _ in range(n + 1)]
        for i in range(n - 1, -1, -1):
            for j in range(3):
                right[i][j] = right[i + 1][j]
            right[i][colors[i] - 1] = i
        left = [[-inf] * 3 for _ in range(n + 1)]
        for i, c in enumerate(colors, 1):
            for j in range(3):
                left[i][j] = left[i - 1][j]
            left[i][c - 1] = i - 1
        ans = []
        for i, c in queries:
            d = min(i - left[i + 1][c - 1], right[i][c - 1] - i)
            ans.append(-1 if d > n else d)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

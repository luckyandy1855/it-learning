# 1136. Parallel Courses

---
编号: 1136
题目: Parallel Courses
难度: 中等
标签: [图, 拓扑排序]
来源链接: https://leetcode.com/problems/parallel-courses/
---

## 题目描述

给你一个整数 `n` ，表示编号从 `1` 到 `n` 的 `n` 门课程。另给你一个数组 `relations` ，其中 `relations[i] = [prevCoursei, nextCoursei]` ，表示课程 `prevCoursei` 和课程 `nextCoursei` 之间存在先修关系：课程 `prevCoursei` 必须在 `nextCoursei` 之前修读完成。

在一个学期内，你可以学习 **任意数量** 的课程，但前提是你已经在 **上** 一学期修读完待学习课程的所有先修课程。

请你返回学完全部课程所需的 **最少** 学期数。如果没有办法做到学完全部这些课程的话，就返回 `-1`。

示例 1：

```text
输入：n = 3, relations = [[1,3],[2,3]]
输出：2
解释：上图表示课程之间的关系图：
在第一学期，可以修读课程 1 和 2 。
在第二学期，可以修读课程 3 。
```

示例 2：

```text
输入：n = 3, relations = [[1,2],[2,3],[3,1]]
输出：-1
解释：没有课程可以学习，因为它们互为先修课程。
```

**提示：**

- `1 i, nextCoursei i != nextCoursei`

- 所有 `[prevCoursei, nextCoursei]` **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「图, 拓扑排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先将课程之间的先修关系建立图 $g$，并统计每个课程的入度 $indeg$。

然后我们将入度为 $0$ 的课程入队，然后开始进行拓扑排序。每次从队列中取出一个课程，将其出队，并将其出度的课程的入度减 $1$，如果减 $1$ 后入度为 $0$，则将该课程入队。当队列为空时，如果还有课程没有修完，则说明无法修完所有课程，返回 $-1$。否则返回修完所有课程所需的学期数。

时间复杂度 $O(n + m)$，空间复杂度 $O(n + m)$。其中 $n$ 和 $m$ 分别为课程数和先修关系数。

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
// Parallel Courses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minimumSemesters(n int, relations [][]int) (ans int) {
	g := make([][]int, n)
	indeg := make([]int, n)
	for _, r := range relations {
		prev, nxt := r[0]-1, r[1]-1
		g[prev] = append(g[prev], nxt)
		indeg[nxt]++
	}
	q := []int{}
	for i, v := range indeg {
		if v == 0 {
			q = append(q, i)
		}
	}
	for len(q) > 0 {
		ans++
		for k := len(q); k > 0; k-- {
			i := q[0]
			q = q[1:]
			n--
			for _, j := range g[i] {
				indeg[j]--
				if indeg[j] == 0 {
					q = append(q, j)
				}
			}
		}
	}
	if n == 0 {
		return
	}
	return -1
}
```

### Java

```java
// Parallel Courses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minimumSemesters(int n, int[][] relations) {
        List<Integer>[] g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        int[] indeg = new int[n];
        for (var r : relations) {
            int prev = r[0] - 1, nxt = r[1] - 1;
            g[prev].add(nxt);
            ++indeg[nxt];
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; ++i) {
            if (indeg[i] == 0) {
                q.offer(i);
            }
        }
        int ans = 0;
        while (!q.isEmpty()) {
            ++ans;
            for (int k = q.size(); k > 0; --k) {
                int i = q.poll();
                --n;
                for (int j : g[i]) {
                    if (--indeg[j] == 0) {
                        q.offer(j);
                    }
                }
            }
        }
        return n == 0 ? ans : -1;
    }
}
```

### Python

```python
# Parallel Courses：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minimumSemesters(self, n: int, relations: List[List[int]]) -> int:
        g = defaultdict(list)
        indeg = [0] * n
        for prev, nxt in relations:
            prev, nxt = prev - 1, nxt - 1
            g[prev].append(nxt)
            indeg[nxt] += 1
        q = deque(i for i, v in enumerate(indeg) if v == 0)
        ans = 0
        while q:
            ans += 1
            for _ in range(len(q)):
                i = q.popleft()
                n -= 1
                for j in g[i]:
                    indeg[j] -= 1
                    if indeg[j] == 0:
                        q.append(j)
        return -1 if n else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

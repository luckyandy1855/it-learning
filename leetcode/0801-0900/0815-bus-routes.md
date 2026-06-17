# 0815. Bus Routes

---
编号: 815
题目: Bus Routes
难度: 困难
标签: [广度优先搜索, 数组, 哈希表]
来源链接: https://leetcode.com/problems/bus-routes/
---

## 题目描述

给你一个数组 `routes` ，表示一系列公交线路，其中每个 `routes[i]` 表示一条公交线路，第 `i` 辆公交车将会在上面循环行驶。

- 例如，路线 `routes[0] = [1, 5, 7]` 表示第 `0` 辆公交车会一直按序列 `1 -> 5 -> 7 -> 1 -> 5 -> 7 -> 1 -> ...` 这样的车站路线行驶。

现在从 `source` 车站出发（初始时不在公交车上），要前往 `target` 车站。 期间仅可乘坐公交车。

求出 **最少乘坐的公交车数量** 。如果不可能到达终点车站，返回 `-1` 。

**示例 1：**

```text
输入：routes = [[1,2,7],[3,6,7]], source = 1, target = 6
输出：2
解释：最优策略是先乘坐第一辆公交车到达车站 7 , 然后换乘第二辆公交车到车站 6 。
```

**示例 2：**

```text
输入：routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
输出：-1
```

**提示：**

- `1 <= routes.length <= 500`.

- `1 <= routes[i].length <= 10^5`

- `routes[i]` 中的所有值 **互不相同**

- `sum(routes[i].length) <= 10^5`

- `0 <= routes[i][j] < 10^6`

- `0 <= source, target < 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断 $\textit{source}$ 和 $\textit{target}$ 是否相同，如果相同则直接返回 $0$。

然后我们使用一个哈希表 $\textit{g}$ 来构建站点到公交线路的映射。对于每一条公交线路，我们遍历其经过的所有站点，将每个站点映射到该公交线路，即 $\textit{g}[\textit{stop}]$ 为经过站点 $\textit{stop}$ 的所有公交线路。

接着我们判断 $\textit{source}$ 和 $\textit{target}$ 是否在站点映射中，如果不在则返回 $-1$。

我们使用一个队列 $\textit{q}$ 来进行广度优先搜索，队列中的每个元素为一个二元组 $(\textit{stop}, \textit{busCount})$，表示当前站点 $\textit{stop}$ 和到达当前站点所需的公交次数 $\textit{busCount}$。

我们初始化一个集合 $\textit{visBus}$ 来记录已经访问过的公交线路，一个集合 $\textit{visStop}$ 来记录已经访问过的站点。然后我们将 $\textit{source}$ 加入到 $\textit{visStop}$ 中，并将 $(\textit{source}, 0)$ 加入到队列 $\textit{q}$ 中。

接下来我们开始广度优先搜索，当队列 $\textit{q}$ 不为空时，我们取出队列的第一个元素，即当前站点 $\textit{stop}$ 和到达当前站点所需的公交次数 $\textit{busCount}$。

如果当前站点 $\textit{stop}$ 是目标站点 $\textit{target}$，我们返回到达目标站点所需的公交次数 $\textit{busCount}$。

否则，我们遍历经过当前站点的所有公交线路，对于每一条公交线路，我们遍历该线路上的所有站点，如果某个站点 $\textit{nextStop}$ 没有被访问过，则将其加入到 $\textit{visStop}$ 中，并将 $(\textit{nextStop}, \textit{busCount} + 1)$ 加入到队列 $\textit{q}$ 中。

最后，如果无法到达目标站点，则返回 $-1$。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 为所有公交线路上的站点总数。

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
// Bus Routes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numBusesToDestination(routes [][]int, source int, target int) int {
	if source == target {
		return 0
	}

	// 使用 map 构建站点到公交线路的映射
	g := make(map[int][]int)
	for i, route := range routes {
		for _, stop := range route {
			g[stop] = append(g[stop], i)
		}
	}

	// 如果 source 或 target 不在站点映射中，返回 -1
	if g[source] == nil || g[target] == nil {
		return -1
	}

	// 初始化队列和访问集合
	q := list.New()
	q.PushBack([2]int{source, 0})
	visBus := make(map[int]bool)
	visStop := make(map[int]bool)
	visStop[source] = true

	// 开始广度优先搜索
	for q.Len() > 0 {
		front := q.Front()
		q.Remove(front)
		stop, busCount := front.Value.([2]int)[0], front.Value.([2]int)[1]

		// 如果当前站点是目标站点，返回所需的公交次数
		if stop == target {
			return busCount
		}

		// 遍历经过当前站点的所有公交线路
		for _, bus := range g[stop] {
			if !visBus[bus] {
				visBus[bus] = true
				// 遍历该线路上的所有站点
				for _, nextStop := range routes[bus] {
					if !visStop[nextStop] {
						visStop[nextStop] = true
						q.PushBack([2]int{nextStop, busCount + 1})
					}
				}
			}
		}
	}

	return -1 // 如果无法到达目标站点，返回
}
```

### Java

```java
// Bus Routes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        if (source == target) {
            return 0;
        }

        // 使用 HashMap 构建站点到公交线路的映射
        Map<Integer, List<Integer>> g = new HashMap<>();
        for (int i = 0; i < routes.length; i++) {
            for (int stop : routes[i]) {
                g.computeIfAbsent(stop, k -> new ArrayList<>()).add(i);
            }
        }

        // 如果 source 或 target 不在站点映射中，返回 -1
        if (!g.containsKey(source) || !g.containsKey(target)) {
            return -1;
        }

        // 初始化队列和访问集合
        Deque<int[]> q = new ArrayDeque<>();
        Set<Integer> visBus = new HashSet<>();
        Set<Integer> visStop = new HashSet<>();
        q.offer(new int[] {source, 0});
        visStop.add(source);

        // 开始广度优先搜索
        while (!q.isEmpty()) {
            int[] current = q.poll();
            int stop = current[0], busCount = current[1];

            // 如果当前站点是目标站点，返回所需的公交次数
            if (stop == target) {
                return busCount;
            }

            // 遍历经过当前站点的所有公交线路
            for (int bus : g.get(stop)) {
                if (visBus.add(bus)) {
                    // 遍历该线路上的所有站点
                    for (int nextStop : routes[bus]) {
                        if (visStop.add(nextStop)) {
                            q.offer(new int[] {nextStop, busCount + 1});
                        }
                    }
                }
            }
        }

        return -1; // 如果无法到达目标站点，返回 -1
    }
}
```

### Python

```python
# Bus Routes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numBusesToDestination(
        self, routes: List[List[int]], source: int, target: int
    ) -> int:
        if source == target:
            return 0
        # 使用 defaultdict 构建站点到公交线路的映射
        g = defaultdict(list)
        for i, route in enumerate(routes):
            for stop in route:
                g[stop].append(i)

        # 如果 source 或 target 不在站点映射中，返回 -1
        if source not in g or target not in g:
            return -1

        # 初始化队列和访问集合
        q = [(source, 0)]
        vis_bus = set()
        vis_stop = {source}

        # 开始广度优先搜索
        for stop, bus_count in q:
            # 如果当前站点是目标站点，返回所需的公交次数
            if stop == target:
                return bus_count

            # 遍历经过当前站点的所有公交线路
            for bus in g[stop]:
                if bus not in vis_bus:
                    vis_bus.add(bus)

                    # 遍历该线路上的所有站点
                    for next_stop in routes[bus]:
                        if next_stop not in vis_stop:
                            vis_stop.add(next_stop)
                            q.append((next_stop, bus_count + 1))
        return -1 # 如果无法到达目标站点，返回 -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

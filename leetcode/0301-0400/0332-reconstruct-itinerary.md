# 0332. Reconstruct Itinerary

---
编号: 332
题目: Reconstruct Itinerary
难度: 困难
标签: [深度优先搜索, 图, 数组, 字符串, 排序, 欧拉回路, 堆（优先队列）]
来源链接: https://leetcode.com/problems/reconstruct-itinerary/
---

## 题目描述

给你一份航线列表 `tickets` ，其中 `tickets[i] = [fromi, toi]` 表示飞机出发和降落的机场地点。请你对该行程进行重新规划排序。

所有这些机票都属于一个从 `JFK`（肯尼迪国际机场）出发的先生，所以该行程必须从 `JFK` 开始。如果存在多种有效的行程，请你按字典排序返回最小的行程组合。

	- 例如，行程 `["JFK", "LGA"]` 与 `["JFK", "LGB"]` 相比就更小，排序更靠前。

假定所有机票至少存在一种合理的行程。且所有的机票 必须都用一次 且 只能用一次。

**示例 1：**

```text
输入：tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
输出：["JFK","MUC","LHR","SFO","SJC"]
```

**示例 2：**

```text
输入：tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]
输出：["JFK","ATL","JFK","SFO","ATL","SFO"]
解释：另一种有效的行程是 ["JFK","SFO","ATL","JFK","ATL","SFO"] ，但是它字典排序更大更靠后。
```

**提示：**

	- `1 i.length == 3`

	- `toi.length == 3`

	- `fromi` 和 `toi` 由大写英文字母组成

	- `fromi != toi`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 图, 数组, 字符串, 排序, 欧拉回路, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目实际上是给定 $n$ 个点和 $m$ 条边，要求从指定的起点出发，经过所有的边恰好一次，使得路径字典序最小。这是一个典型的欧拉路径问题。

由于本题保证了至少存在一种合理的行程，因此，我们直接利用 Hierholzer 算法，输出从起点出发的欧拉路径即可。

时间复杂度 $O(m \times \log m)$，空间复杂度 $O(m)$。其中 $m$ 是边的数量。

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
// Reconstruct Itinerary：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findItinerary(tickets [][]string) (ans []string) {
	sort.Slice(tickets, func(i, j int) bool {
		return tickets[i][0] > tickets[j][0] || (tickets[i][0] == tickets[j][0] && tickets[i][1] > tickets[j][1])
	})
	g := make(map[string][]string)
	for _, ticket := range tickets {
		g[ticket[0]] = append(g[ticket[0]], ticket[1])
	}
	var dfs func(f string)
	dfs = func(f string) {
		for len(g[f]) > 0 {
			t := g[f][len(g[f])-1]
			g[f] = g[f][:len(g[f])-1]
			dfs(t)
		}
		ans = append(ans, f)
	}
	dfs("JFK")
	for i := 0; i < len(ans)/2; i++ {
		ans[i], ans[len(ans)-1-i] = ans[len(ans)-1-i], ans[i]
	}
	return
}
```

### Java

```java
// Reconstruct Itinerary：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Map<String, List<String>> g = new HashMap<>();
    private List<String> ans = new ArrayList<>();

    public List<String> findItinerary(List<List<String>> tickets) {
        Collections.sort(tickets, (a, b) -> b.get(1).compareTo(a.get(1)));
        for (List<String> ticket : tickets) {
            g.computeIfAbsent(ticket.get(0), k -> new ArrayList<>()).add(ticket.get(1));
        }
        dfs("JFK");
        Collections.reverse(ans);
        return ans;
    }

    private void dfs(String f) {
        while (g.containsKey(f) && !g.get(f).isEmpty()) {
            String t = g.get(f).remove(g.get(f).size() - 1);
            dfs(t);
        }
        ans.add(f);
    }
}
```

### Python

```python
# Reconstruct Itinerary：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        def dfs(f: str):
            while g[f]:
                dfs(g[f].pop())
            ans.append(f)

        g = defaultdict(list)
        for f, t in sorted(tickets, reverse=True):
            g[f].append(t)
        ans = []
        dfs("JFK")
        return ans[::-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

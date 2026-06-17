# 1168. Optimize Water Distribution in a Village

---
编号: 1168
题目: Optimize Water Distribution in a Village
难度: 困难
标签: [并查集, 图, 最小生成树, 堆（优先队列）]
来源链接: https://leetcode.com/problems/optimize-water-distribution-in-a-village/
---

## 题目描述

村里面一共有 `n` 栋房子。我们希望通过建造水井和铺设管道来为所有房子供水。

对于每个房子 `i`，我们有两种可选的供水方案：一种是直接在房子内建造水井，成本为 `wells[i - 1]` （注意 `-1` ，因为 **索引从0开始** ）；另一种是从另一口井铺设管道引水，数组 `pipes` 给出了在房子间铺设管道的成本，其中每个 `pipes[j] = [house1j, house2j, costj]` 代表用管道将 `house1j` 和 `house2j`连接在一起的成本。连接是双向的。

请返回 *为所有房子都供水的最低总成本* 。

**示例 1：**

****

```text
输入：n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]
输出：3
解释：
上图展示了铺设管道连接房屋的成本。
最好的策略是在第一个房子里建造水井（成本为 1），然后将其他房子铺设管道连起来（成本为 2），所以总成本为 3。
```

**示例 2：**

```text
输入：n = 2, wells = [1,1], pipes = [[1,2,1]]
输出：2
解释：我们可以用以下三种方法中的一种来提供低成本的水:
选项1:
在1号房子里面建一口井，成本为1
在房子2内建造井，成本为1
总成本是2。
选项2:
在1号房子里面建一口井，成本为1
-花费1连接房子2和房子1。
总成本是2。
选项3:
在房子2内建造井，成本为1
-花费1连接房子1和房子2。
总成本是2。
注意，我们可以用cost 1或cost 2连接房子1和房子2，但我们总是选择最便宜的选项。
```

**提示：**

- `2 j, house2j j j != house2j`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 图, 最小生成树, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们假设有一个水井编号为 $0$，那么我们可以将每个房子与水井 $0$ 之间的连通性看作是一条边，每条边的权值为该房子建造水井的成本。同时，我们将每个房子之间的连通性也看作是一条边，每条边的权值为铺设管道的成本。这样一来，我们就可以将本题转化成求一张无向图的最小生成树的问题。

我们可以使用 Kruskal 算法求出无向图的最小生成树。我们先把水井 $0$ 与房子之间的一条边加入 $pipes$ 数组中，然后将 $pipes$ 数组按照边权值从小到大排序。随后，我们遍历每一条边，如果这条边连接了不同的连通分量，我们就选用这条边，并将对应连通分量合并。如果当前的连通分量恰好为 $1$，那么我们就找到了最小生成树，此时的答案即为当前边权值，我们将其返回即可。

时间复杂度 $O((m + n) \times \log (m + n))$，空间复杂度 $O(m + n)$。其中 $m$ 和 $n$ 分别是 $pipes$ 数组和 $wells$ 数组的长度。

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
// Optimize Water Distribution in a Village：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minCostToSupplyWater(n int, wells []int, pipes [][]int) (ans int) {
	for i, w := range wells {
		pipes = append(pipes, []int{0, i + 1, w})
	}
	sort.Slice(pipes, func(i, j int) bool { return pipes[i][2] < pipes[j][2] })
	p := make([]int, n+1)
	for i := range p {
		p[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}

	for _, x := range pipes {
		pa, pb := find(x[0]), find(x[1])
		if pa == pb {
			continue
		}
		p[pa] = pb
		ans += x[2]
		n--
		if n == 0 {
			break
		}
	}
	return
}
```

### Java

```java
// Optimize Water Distribution in a Village：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
        int[][] nums = Arrays.copyOf(pipes, pipes.length + n);
        for (int i = 0; i < n; i++) {
            nums[pipes.length + i] = new int[] {0, i + 1, wells[i]};
        }
        Arrays.sort(nums, (a, b) -> a[2] - b[2]);
        p = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            p[i] = i;
        }
        int ans = 0;
        for (var x : nums) {
            int a = x[0], b = x[1], c = x[2];
            int pa = find(a), pb = find(b);
            if (pa != pb) {
                p[pa] = pb;
                ans += c;
                if (--n == 0) {
                    return ans;
                }
            }
        }
        return ans;
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}
```

### Python

```python
# Optimize Water Distribution in a Village：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minCostToSupplyWater(
        self, n: int, wells: List[int], pipes: List[List[int]]
    ) -> int:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        for i, w in enumerate(wells, 1):
            pipes.append([0, i, w])
        pipes.sort(key=lambda x: x[2])
        p = list(range(n + 1))
        ans = 0
        for a, b, c in pipes:
            pa, pb = find(a), find(b)
            if pa != pb:
                p[pa] = pb
                n -= 1
                ans += c
                if n == 0:
                    return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

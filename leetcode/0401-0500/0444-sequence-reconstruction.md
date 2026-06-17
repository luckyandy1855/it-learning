# 0444. Sequence Reconstruction

---
编号: 444
题目: Sequence Reconstruction
难度: 中等
标签: [图, 拓扑排序, 数组]
来源链接: https://leetcode.com/problems/sequence-reconstruction/
---

## 题目描述

给定一个长度为 `n` 的整数数组 `nums` ，其中 `nums` 是范围为 `[1，n]` 的整数的排列。还提供了一个 2D 整数数组 `sequences` ，其中 `sequences[i]` 是 `nums` 的子序列。

检查 `nums` 是否是唯一的最短 **超序列** 。最短 **超序列** 是 **长度最短** 的序列，并且所有序列 `sequences[i]` 都是它的子序列。对于给定的数组 `sequences` ，可能存在多个有效的 **超序列** 。

- 例如，对于 `sequences = [[1,2],[1,3]]` ，有两个最短的 **超序列** ，`[1,2,3]` 和 `[1,3,2]` 。

- 而对于 `sequences = [[1,2],[1,3],[1,2,3]]` ，唯一可能的最短 **超序列** 是 `[1,2,3]` 。`[1,2,3,4]` 是可能的超序列，但不是最短的。

*如果 `nums` 是序列的唯一最短 **超序列** ，则返回 `true` ，否则返回 `false` 。*

**子序列** 是一个可以通过从另一个序列中删除一些元素或不删除任何元素，而不改变其余元素的顺序的序列。

**示例 1：**

```text
输入：nums = [1,2,3], sequences = [[1,2],[1,3]]
输出：false
解释：有两种可能的超序列：[1,2,3]和[1,3,2]。
序列 [1,2] 是[1,2,3]和[1,3,2]的子序列。
序列 [1,3] 是[1,2,3]和[1,3,2]的子序列。
因为 nums 不是唯一最短的超序列，所以返回false。
```

**示例 2：**

```text
输入：nums = [1,2,3], sequences = [[1,2]]
输出：false
解释：最短可能的超序列为 [1,2]。
序列 [1,2] 是它的子序列：[1,2]。
因为 nums 不是最短的超序列，所以返回false。
```

**示例 3：**

```text
输入：nums = [1,2,3], sequences = [[1,2],[1,3],[2,3]]
输出：true
解释：最短可能的超序列为[1,2,3]。
序列 [1,2] 是它的一个子序列：[1,2,3]。
序列 [1,3] 是它的一个子序列：[1,2,3]。
序列 [2,3] 是它的一个子序列：[1,2,3]。
因为 nums 是唯一最短的超序列，所以返回true。
```

**提示：**

- `n == nums.length`

- `1 <= n <= 10^4`

- `nums` 是 `[1, n]` 范围内所有整数的排列

- `1 <= sequences.length <= 10^4`

- `1 <= sequences[i].length <= 10^4`

- `1 <= sum(sequences[i].length) <= 10^5`

- `1 <= sequences[i][j] <= n`

- `sequences` 的所有数组都是 **唯一 **的

- `sequences[i]` 是 `nums` 的一个子序列

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「图, 拓扑排序, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先遍历每个子序列 `seq`，对于每个相邻的元素 $a$ 和 $b$，我们在 $a$ 和 $b$ 之间建立一条有向边 $a \to b$。同时统计每个节点的入度，最后将所有入度为 $0$ 的节点加入队列中。

当队列中的节点个数等于 $1$ 时，我们取出队首节点 $i$，将 $i$ 从图中删除，并将 $i$ 的所有相邻节点的入度减 $1$。如果减 $1$ 后相邻节点的入度为 $0$，则将这些节点加入队列中。重复上述操作，直到队列的长度不为 $1$。此时判断队列是否为空，如果不为空，说明有多个最短超序列，返回 `false`；如果为空，说明只有一个最短超序列，返回 `true`。

时间复杂度 $O(n + m)$，空间复杂度 $O(n + m)$。其中 $n$ 和 $m$ 分别是节点的个数和边的个数。

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
// Sequence Reconstruction：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sequenceReconstruction(nums []int, sequences [][]int) bool {
	n := len(nums)
	indeg := make([]int, n)
	g := make([][]int, n)
	for _, seq := range sequences {
		for i, b := range seq[1:] {
			a := seq[i] - 1
			b -= 1
			g[a] = append(g[a], b)
			indeg[b]++
		}
	}
	q := []int{}
	for i, x := range indeg {
		if x == 0 {
			q = append(q, i)
		}
	}
	for len(q) == 1 {
		i := q[0]
		q = q[1:]
		for _, j := range g[i] {
			indeg[j]--
			if indeg[j] == 0 {
				q = append(q, j)
			}
		}
	}
	return len(q) == 0
}
```

### Java

```java
// Sequence Reconstruction：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean sequenceReconstruction(int[] nums, List<List<Integer>> sequences) {
        int n = nums.length;
        int[] indeg = new int[n];
        List<Integer>[] g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (var seq : sequences) {
            for (int i = 1; i < seq.size(); ++i) {
                int a = seq.get(i - 1) - 1, b = seq.get(i) - 1;
                g[a].add(b);
                ++indeg[b];
            }
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; ++i) {
            if (indeg[i] == 0) {
                q.offer(i);
            }
        }
        while (q.size() == 1) {
            int i = q.poll();
            for (int j : g[i]) {
                if (--indeg[j] == 0) {
                    q.offer(j);
                }
            }
        }
        return q.isEmpty();
    }
}
```

### Python

```python
# Sequence Reconstruction：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sequenceReconstruction(
        self, nums: List[int], sequences: List[List[int]]
    ) -> bool:
        n = len(nums)
        g = [[] for _ in range(n)]
        indeg = [0] * n
        for seq in sequences:
            for a, b in pairwise(seq):
                a, b = a - 1, b - 1
                g[a].append(b)
                indeg[b] += 1
        q = deque(i for i, x in enumerate(indeg) if x == 0)
        while len(q) == 1:
            i = q.popleft()
            for j in g[i]:
                indeg[j] -= 1
                if indeg[j] == 0:
                    q.append(j)
        return len(q) == 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

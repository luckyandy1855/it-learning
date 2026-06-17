# 0433. Minimum Genetic Mutation

---
编号: 433
题目: Minimum Genetic Mutation
难度: 中等
标签: [广度优先搜索, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/minimum-genetic-mutation/
---

## 题目描述

基因序列可以表示为一条由 8 个字符组成的字符串，其中每个字符都是 `'A'`、`'C'`、`'G'` 和 `'T'` 之一。

假设我们需要调查从基因序列 `start` 变为 `end` 所发生的基因变化。一次基因变化就意味着这个基因序列中的一个字符发生了变化。

- 例如，`"AACCGGTT" --> "AACCGGTA"` 就是一次基因变化。

另有一个基因库 `bank` 记录了所有有效的基因变化，只有基因库中的基因才是有效的基因序列。（变化后的基因必须位于基因库 `bank` 中）

给你两个基因序列 `start` 和 `end` ，以及一个基因库 `bank` ，请你找出并返回能够使 `start` 变化为 `end` 所需的最少变化次数。如果无法完成此基因变化，返回 `-1` 。

注意：起始基因序列 `start` 默认是有效的，但是它并不一定会出现在基因库中。

**示例 1：**

```text
输入：start = "AACCGGTT", end = "AACCGGTA", bank = ["AACCGGTA"]
输出：1
```

**示例 2：**

```text
输入：start = "AACCGGTT", end = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]
输出：2
```

**示例 3：**

```text
输入：start = "AAAAACCC", end = "AACCCCCC", bank = ["AAAACCCC","AAACCCCC","AACCCCCC"]
输出：3
```

**提示：**

- `start.length == 8`

- `end.length == 8`

- `0 <= bank.length <= 10`

- `bank[i].length == 8`

- `start`、`end` 和 `bank[i]` 仅由字符 `['A', 'C', 'G', 'T']` 组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个队列 `q`，用于存储当前基因序列以及变化的次数，定义一个集合 `vis`，用于存储已经访问过的基因序列。初始时，将起始基因序列 `start` 加入队列 `q`，并将其加入集合 `vis`。

然后，我们不断从队列 `q` 中取出一个基因序列，如果该基因序列等于目标基因序列，则返回当前的变化次数。否则，我们遍历基因库 `bank`，计算当前基因序列与基因库中的基因序列的差异值，如果差异值为 $1$，且基因库中的基因序列没有被访问过，则将其加入队列 `q`，并将其加入集合 `vis`。

如果队列 `q` 为空，说明无法完成基因变化，返回 $-1$。

时间复杂度 $O(C \times n \times m)$，空间复杂度 $O(n \times m)$。其中 $n$ 和 $m$ 分别表示基因序列的长度和基因库的长度，而 $C$ 表示基因序列的字符集大小，本题中 $C = 4$。

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
// Minimum Genetic Mutation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minMutation(startGene string, endGene string, bank []string) int {
	type pair struct {
		s     string
		depth int
	}
	q := []pair{pair{startGene, 0}}
	vis := map[string]bool{startGene: true}
	for len(q) > 0 {
		p := q[0]
		q = q[1:]
		if p.s == endGene {
			return p.depth
		}
		for _, next := range bank {
			diff := 0
			for i := 0; i < len(startGene); i++ {
				if p.s[i] != next[i] {
					diff++
				}
			}
			if diff == 1 && !vis[next] {
				vis[next] = true
				q = append(q, pair{next, p.depth + 1})
			}
		}
	}
	return -1
}
```

### Java

```java
// Minimum Genetic Mutation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minMutation(String startGene, String endGene, String[] bank) {
        Deque<String> q = new ArrayDeque<>();
        q.offer(startGene);
        Set<String> vis = new HashSet<>();
        vis.add(startGene);
        int depth = 0;
        while (!q.isEmpty()) {
            for (int m = q.size(); m > 0; --m) {
                String gene = q.poll();
                if (gene.equals(endGene)) {
                    return depth;
                }
                for (String next : bank) {
                    int c = 2;
                    for (int k = 0; k < 8 && c > 0; ++k) {
                        if (gene.charAt(k) != next.charAt(k)) {
                            --c;
                        }
                    }
                    if (c > 0 && !vis.contains(next)) {
                        q.offer(next);
                        vis.add(next);
                    }
                }
            }
            ++depth;
        }
        return -1;
    }
}
```

### Python

```python
# Minimum Genetic Mutation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minMutation(self, startGene: str, endGene: str, bank: List[str]) -> int:
        q = deque([(startGene, 0)])
        vis = {startGene}
        while q:
            gene, depth = q.popleft()
            if gene == endGene:
                return depth
            for nxt in bank:
                diff = sum(a != b for a, b in zip(gene, nxt))
                if diff == 1 and nxt not in vis:
                    q.append((nxt, depth + 1))
                    vis.add(nxt)
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

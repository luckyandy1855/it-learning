# 1434. Number of Ways to Wear Different Hats to Each Other

---
编号: 1434
题目: Number of Ways to Wear Different Hats to Each Other
难度: 困难
标签: [位运算, 数组, 动态规划, 位掩码]
来源链接: https://leetcode.com/problems/number-of-ways-to-wear-different-hats-to-each-other/
---

## 题目描述

总共有 `n` 个人和 `40` 种不同的帽子，帽子编号从 `1` 到 `40` 。

给你一个整数列表的列表 `hats` ，其中 `hats[i]` 是第 `i` 个人所有喜欢帽子的列表。

请你给每个人安排一顶他喜欢的帽子，确保每个人戴的帽子跟别人都不一样，并返回方案数。

由于答案可能很大，请返回它对 `10^9 + 7` 取余后的结果。

**示例 1：**

```text
输入：hats = [[3,4],[4,5],[5]]
输出：1
解释：给定条件下只有一种方法选择帽子。
第一个人选择帽子 3，第二个人选择帽子 4，最后一个人选择帽子 5。
```

**示例 2：**

```text
输入：hats = [[3,5,1],[3,5]]
输出：4
解释：总共有 4 种安排帽子的方法：
(3,5)，(5,3)，(1,3) 和 (1,5)
```

**示例 3：**

```text
输入：hats = [[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]]
输出：24
解释：每个人都可以从编号为 1 到 4 的帽子中选。
(1,2,3,4) 4 个帽子的排列方案数为 24 。
```

**提示：**

- `n == hats.length`

- `1 <= n <= 10`

- `1 <= hats[i].length <= 40`

- `1 <= hats[i][j] <= 40`

- `hats[i]` 包含一个数字互不相同的整数列表。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 动态规划, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到 $n$ 不超过 $10$，因此我们考虑使用状态压缩动态规划的方法求解。

我们定义 $f[i][j]$ 表示在前 $i$ 个帽子中，当前被分配的人的状态为 $j$ 时的方案数。其中 $j$ 是一个二进制数，表示当前被分配的人的集合。初始时 $f[0][0]=1$，答案为 $f[m][2^n - 1]$，其中 $m$ 是帽子的最大编号，而 $n$ 是人的数量。

考虑 $f[i][j]$，如果第 $i$ 个帽子不分配给任何人，那么 $f[i][j]=f[i-1][j]$；如果第 $i$ 个帽子分配给了喜欢它的人 $k$，那么 $f[i][j]=f[i-1][j \oplus 2^k]$。这里 $\oplus$ 表示异或运算。因此我们可以得到状态转移方程：


f[i][j]=f[i-1][j]+ \sum_{k \in like[i]} f[i-1][j \oplus 2^k]


其中 $like[i]$ 表示喜欢第 $i$ 个帽子的人的集合。

最终的答案即为 $f[m][2^n - 1]$，注意答案可能很大，需要对 $10^9 + 7$ 取模。

时间复杂度 $O(m \times 2^n \times n)$，空间复杂度 $O(m \times 2^n)$。其中 $m$ 是帽子的最大编号，本题中 $m \leq 40$；而 $n$ 是人的数量，本题中 $n \leq 10$。

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
// Number of Ways to Wear Different Hats to Each Other：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberWays(hats [][]int) int {
	n := len(hats)
	m := 0
	for _, h := range hats {
		m = max(m, slices.Max(h))
	}
	g := make([][]int, m+1)
	for i, h := range hats {
		for _, v := range h {
			g[v] = append(g[v], i)
		}
	}
	const mod = 1e9 + 7
	f := make([][]int, m+1)
	for i := range f {
		f[i] = make([]int, 1<<n)
	}
	f[0][0] = 1
	for i := 1; i <= m; i++ {
		for j := 0; j < 1<<n; j++ {
			f[i][j] = f[i-1][j]
			for _, k := range g[i] {
				if j>>k&1 == 1 {
					f[i][j] = (f[i][j] + f[i-1][j^(1<<k)]) % mod
				}
			}
		}
	}
	return f[m][(1<<n)-1]
}
```

### Java

```java
// Number of Ways to Wear Different Hats to Each Other：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numberWays(List<List<Integer>> hats) {
        int n = hats.size();
        int m = 0;
        for (var h : hats) {
            for (int v : h) {
                m = Math.max(m, v);
            }
        }
        List<Integer>[] g = new List[m + 1];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (int i = 0; i < n; ++i) {
            for (int v : hats.get(i)) {
                g[v].add(i);
            }
        }
        final int mod = (int) 1e9 + 7;
        int[][] f = new int[m + 1][1 << n];
        f[0][0] = 1;
        for (int i = 1; i <= m; ++i) {
            for (int j = 0; j < 1 << n; ++j) {
                f[i][j] = f[i - 1][j];
                for (int k : g[i]) {
                    if ((j >> k & 1) == 1) {
                        f[i][j] = (f[i][j] + f[i - 1][j ^ (1 << k)]) % mod;
                    }
                }
            }
        }
        return f[m][(1 << n) - 1];
    }
}
```

### Python

```python
# Number of Ways to Wear Different Hats to Each Other：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberWays(self, hats: List[List[int]]) -> int:
        g = defaultdict(list)
        for i, h in enumerate(hats):
            for v in h:
                g[v].append(i)
        mod = 10**9 + 7
        n = len(hats)
        m = max(max(h) for h in hats)
        f = [[0] * (1 << n) for _ in range(m + 1)]
        f[0][0] = 1
        for i in range(1, m + 1):
            for j in range(1 << n):
                f[i][j] = f[i - 1][j]
                for k in g[i]:
                    if j >> k & 1:
                        f[i][j] = (f[i][j] + f[i - 1][j ^ (1 << k)]) % mod
        return f[m][-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0465. Optimal Account Balancing

---
编号: 465
题目: Optimal Account Balancing
难度: 困难
标签: [位运算, 数组, 动态规划, 回溯, 位掩码]
来源链接: https://leetcode.com/problems/optimal-account-balancing/
---

## 题目描述

给你一个表示交易的数组 `transactions` ，其中 `transactions[i] = [fromi, toi, amounti]` 表示 `ID = fromi` 的人给 `ID = toi` 的人共计 `amounti $` 。

请你计算并返回还清所有债务的最小交易笔数。

示例 1：

```text
输入：transactions = [[0,1,10],[2,0,5]]
输出：2
解释：
#0 给 #1 $10 。
#2 给 #0 $5 。
需要进行两笔交易。一种结清债务的方式是 #1 给 #0 和 #2 各 $5 。
```

示例 2：

```text
输入：transactions = [[0,1,10],[1,0,1],[1,2,5],[2,0,5]]
输出：1
解释：
#0 给 #1 $10 。
#1 给 #0 $1 。
#1 给 #2 $5 。
#2 给 #0 $5 。
因此，#1 只需要给 #0 $4 ，所有的债务即可还清。
```

**提示：**

- `1 i, toi i != toi`

- `1 i <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 动态规划, 回溯, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先遍历数组 `transactions`，统计每个人的收支情况，然后将所有收支不为零的人的收支情况存入数组 $nums$ 中。如果我们可以找到一个子集，子集中共有 $k$ 个人，且这 $k$ 个人的收支情况之和为零，那么我们最多通过 $k-1$ 次交易，就能够使得这 $k$ 个人的收支情况全部清零。这样，我们就能将原问题转化成一个子集枚举的问题。

我们定义 $f[i]$ 表示将集合 $i$ 的所有元素的收支情况全部清零，所需的最少交易次数，初始时 $f[0]=0$，其余 $f[i]=+\infty$。

考虑 $f[i]$，其中 $i \in [1,2^m)$, $m$ 是数组 $nums$ 的长度。我们可以统计集合 $i$ 中所有元素的收支情况之和 $s$，如果 $s=0$，那么 $f[i]$ 的取值不超过 $|i|-1$，其中 $|i|$ 表示集合 $i$ 中的元素个数。然后我们可以枚举 $i$ 的所有非空子集 $j$，计算 $f[j]+f[i-j]$，其中 $f[j]$ 和 $f[i-j]$ 分别表示将集合 $j$ 和 $i-j$ 的所有元素的收支情况全部清零，所需的最少交易次数。我们可以得到状态转移方程：


f[i]=
\begin{cases}
0, & i=0 \\
+\infty, & i \neq 0, s \neq 0 \\
\min(|i|-1, \min_{j \subset i, j \neq \emptyset} \{f[j]+f[i-j]\}), & i \neq 0, s = 0
\end{cases}


其中 $j \subset i$ 表示 $j$ 是 $i$ 的子集，且 $j \neq \emptyset$。

最终答案即为 $f[2^m-1]$。

时间复杂度 $O(3^n)$，空间复杂度 $O(2^n)$。其中 $n$ 是人的数量，本题中 $n \leq 12$。

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
// Optimal Account Balancing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minTransfers(transactions [][]int) int {
	g := [12]int{}
	for _, t := range transactions {
		g[t[0]] -= t[2]
		g[t[1]] += t[2]
	}
	nums := []int{}
	for _, x := range g {
		if x != 0 {
			nums = append(nums, x)
		}
	}
	m := len(nums)
	f := make([]int, 1<<m)
	for i := 1; i < 1<<m; i++ {
		f[i] = 1 << 29
		s := 0
		for j, x := range nums {
			if i>>j&1 == 1 {
				s += x
			}
		}
		if s == 0 {
			f[i] = bits.OnesCount(uint(i)) - 1
			for j := (i - 1) & i; j > 0; j = (j - 1) & i {
				f[i] = min(f[i], f[j]+f[i^j])
			}
		}
	}
	return f[1<<m-1]
}
```

### Java

```java
// Optimal Account Balancing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minTransfers(int[][] transactions) {
        int[] g = new int[12];
        for (var t : transactions) {
            g[t[0]] -= t[2];
            g[t[1]] += t[2];
        }
        List<Integer> nums = new ArrayList<>();
        for (int x : g) {
            if (x != 0) {
                nums.add(x);
            }
        }
        int m = nums.size();
        int[] f = new int[1 << m];
        Arrays.fill(f, 1 << 29);
        f[0] = 0;
        for (int i = 1; i < 1 << m; ++i) {
            int s = 0;
            for (int j = 0; j < m; ++j) {
                if ((i >> j & 1) == 1) {
                    s += nums.get(j);
                }
            }
            if (s == 0) {
                f[i] = Integer.bitCount(i) - 1;
                for (int j = (i - 1) & i; j > 0; j = (j - 1) & i) {
                    f[i] = Math.min(f[i], f[j] + f[i ^ j]);
                }
            }
        }
        return f[(1 << m) - 1];
    }
}
```

### Python

```python
# Optimal Account Balancing：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minTransfers(self, transactions: List[List[int]]) -> int:
        g = defaultdict(int)
        for f, t, x in transactions:
            g[f] -= x
            g[t] += x
        nums = [x for x in g.values() if x]
        m = len(nums)
        f = [inf] * (1 << m)
        f[0] = 0
        for i in range(1, 1 << m):
            s = 0
            for j, x in enumerate(nums):
                if i >> j & 1:
                    s += x
            if s == 0:
                f[i] = i.bit_count() - 1
                j = (i - 1) & i
                while j > 0:
                    f[i] = min(f[i], f[j] + f[i ^ j])
                    j = (j - 1) & i
        return f[-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

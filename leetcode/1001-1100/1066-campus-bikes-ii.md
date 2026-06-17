# 1066. Campus Bikes II

---
编号: 1066
题目: Campus Bikes II
难度: 中等
标签: [位运算, 数组, 动态规划, 回溯, 位掩码]
来源链接: https://leetcode.com/problems/campus-bikes-ii/
---

## 题目描述

在由 2D 网格表示的校园里有 `n` 位工人（`worker`）和 `m` 辆自行车（`bike`），`n

```text
输入：workers = [[0,0],[2,1]], bikes = [[1,2],[3,3]]
输出：6
解释：
自行车 0 分配给工人 0，自行车 1 分配给工人 1 。分配得到的曼哈顿距离都是 3, 所以输出为 6 。
```

**示例 2：**

```text
输入：workers = [[0,0],[1,1],[2,0]], bikes = [[1,0],[2,2],[2,1]]
输出：4
解释：
先将自行车 0 分配给工人 0，再将自行车 1 分配给工人 1（或工人 2），自行车 2 给工人 2（或工人 1）。如此分配使得曼哈顿距离的总和为 4。
```

**示例 3:**

```text
输入：workers = [[0,0],[1,0],[2,0],[3,0],[4,0]], bikes = [[0,999],[1,999],[2,999],[3,999],[4,999]]
输出：4995
```

**提示：**

- `n == workers.length`

- `m == bikes.length`

- `1 <= n <= m <= 10`

- `workers[i].length == 2`

- `bikes[i].length == 2`

- `0 <= workers[i][0], workers[i][1], bikes[i][0], bikes[i][1] < 1000`

- 所有的工人和自行车的位置都是 **不同** 的。

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

我们定义 $f[i][j]$ 表示前 $i$ 个工人分配到自行车的状态为 $j$ 时的最小曼哈顿距离总和，其中 $j$ 是一个二进制数，表示自行车的分配情况。初始时 $f[0][0]=0$，其余 $f[0][j]=+\infty$。

考虑 $f[i][j]$，我们枚举第 $i$ 个工人分配到的自行车的编号 $k$，那么 $f[i][j]$ 可以从 $f[i-1][j\oplus 2^k]$ 转移而来，其中 $\oplus$ 表示异或运算。这是因为 $f[i-1][j\oplus 2^k]$ 表示前 $i-1$ 个工人分配到自行车的状态为 $j\oplus 2^k$ 时的最小曼哈顿距离总和，而第 $i$ 个工人分配到自行车 $k$ 时，其曼哈顿距离为 $|worker[i]-bike[k]|$，其中 $|x|$ 表示 $x$ 的绝对值。因此我们可以列出状态转移方程：


f[i][j]=\min_{k=0}^{m-1}\{f[i-1][j\oplus 2^k]+|worker[i]-bike[k]|\}


最终的答案为 $\min_{j=0}^{2^m-1}\{f[n][j]\}$。

时间复杂度 $O(n \times 2^m \times m)$，空间复杂度 $O(n \times 2^m)$。其中 $n$ 和 $m$ 分别是工人和自行车的数量。

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
// Campus Bikes II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func assignBikes(workers [][]int, bikes [][]int) int {
	n, m := len(workers), len(bikes)
	f := make([][]int, n+1)
	const inf = 1 << 30
	for i := range f {
		f[i] = make([]int, 1<<m)
		for j := range f[i] {
			f[i][j] = inf
		}
	}
	f[0][0] = 0
	for i := 1; i <= n; i++ {
		for j := 0; j < 1<<m; j++ {
			for k := 0; k < m; k++ {
				if j>>k&1 == 1 {
					d := abs(workers[i-1][0]-bikes[k][0]) + abs(workers[i-1][1]-bikes[k][1])
					f[i][j] = min(f[i][j], f[i-1][j^(1<<k)]+d)
				}
			}
		}
	}
	return slices.Min(f[n])
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Campus Bikes II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int assignBikes(int[][] workers, int[][] bikes) {
        int n = workers.length;
        int m = bikes.length;
        int[][] f = new int[n + 1][1 << m];
        for (var g : f) {
            Arrays.fill(g, 1 << 30);
        }
        f[0][0] = 0;
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < 1 << m; ++j) {
                for (int k = 0; k < m; ++k) {
                    if ((j >> k & 1) == 1) {
                        int d = Math.abs(workers[i - 1][0] - bikes[k][0])
                            + Math.abs(workers[i - 1][1] - bikes[k][1]);
                        f[i][j] = Math.min(f[i][j], f[i - 1][j ^ (1 << k)] + d);
                    }
                }
            }
        }
        return Arrays.stream(f[n]).min().getAsInt();
    }
}
```

### Python

```python
# Campus Bikes II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def assignBikes(self, workers: List[List[int]], bikes: List[List[int]]) -> int:
        n, m = len(workers), len(bikes)
        f = [[inf] * (1 << m) for _ in range(n + 1)]
        f[0][0] = 0
        for i, (x1, y1) in enumerate(workers, 1):
            for j in range(1 << m):
                for k, (x2, y2) in enumerate(bikes):
                    if j >> k & 1:
                        f[i][j] = min(
                            f[i][j],
                            f[i - 1][j ^ (1 << k)] + abs(x1 - x2) + abs(y1 - y2),
                        )
        return min(f[n])
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

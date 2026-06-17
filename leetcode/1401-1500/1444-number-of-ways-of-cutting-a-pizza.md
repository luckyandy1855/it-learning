# 1444. Number of Ways of Cutting a Pizza

---
编号: 1444
题目: Number of Ways of Cutting a Pizza
难度: 困难
标签: [记忆化, 数组, 动态规划, 矩阵, 前缀和]
来源链接: https://leetcode.com/problems/number-of-ways-of-cutting-a-pizza/
---

## 题目描述

给你一个 `rows x cols` 大小的矩形披萨和一个整数 `k` ，矩形包含两种字符： `&#39;A&#39;` （表示苹果）和 `&#39;.&#39;` （表示空白格子）。你需要切披萨 `k-1` 次，得到 `k` 块披萨并送给别人。

切披萨的每一刀，先要选择是向垂直还是水平方向切，再在矩形的边界上选一个切的位置，将披萨一分为二。如果垂直地切披萨，那么需要把左边的部分送给一个人，如果水平地切，那么需要把上面的部分送给一个人。在切完最后一刀后，需要把剩下来的一块送给最后一个人。

请你返回确保每一块披萨包含 **至少** 一个苹果的切披萨方案数。由于答案可能是个很大的数字，请你返回它对 10^9 + 7 取余的结果。

**示例 1：**

****

```text
输入：pizza = ["A..","AAA","..."], k = 3
输出：3
解释：上图展示了三种切披萨的方案。注意每一块披萨都至少包含一个苹果。
```

**示例 2：**

```text
输入：pizza = ["A..","AA.","..."], k = 3
输出：1
```

**示例 3：**

```text
输入：pizza = ["A..","A..","..."], k = 1
输出：1
```

**提示：**

- `1 <= rows, cols <= 50`

- `rows == pizza.length`

- `cols == pizza[i].length`

- `1 <= k <= 10`

- `pizza` 只包含字符 `&#39;A&#39;` 和 `&#39;.&#39;` 。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「记忆化, 数组, 动态规划, 矩阵, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用二维前缀和来快速计算出每个子矩形中苹果的数量，定义 $s[i][j]$ 表示矩形前 $i$ 行，前 $j$ 列的子矩形中苹果的数量，那么 $s[i][j]$ 可以由 $s[i-1][j]$, $s[i][j-1]$, $s[i-1][j-1]$ 三个子矩形的苹果数量求得，具体的计算方法如下：


s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + \textit{int}(pizza[i-1][j-1] == 'A')


其中 $pizza[i-1][j-1]$ 表示矩形中第 $i$ 行，第 $j$ 列的字符，如果是苹果，则为 $1$，否则为 $0$。

接下来，我们设计一个函数 $dfs(i, j, k)$，表示将矩形 $(i, j, m-1, n-1)$ 切 $k$ 刀，得到 $k+1$ 块披萨的方案数，其中 $(i, j)$ 和 $(m-1, n-1)$ 分别是矩形的左上角和右下角的坐标。函数 $dfs(i, j, k)$ 的计算方法如下：

- 如果 $k = 0$，表示没有可以切了，那么我们需要判断矩形中是否有苹果，如果有苹果，则返回 $1$，否则返回 $0$；
- 如果 $k \gt 0$，我们需要枚举最后一刀的切法，如果最后一刀是水平切，那么我们需要枚举切的位置 $x$，其中 $i \lt x \lt m$，如果 $s[x][n] - s[i][n] - s[x][j] + s[i][j] \gt 0$，说明切出来的上面一块披萨中有苹果，我们累加 $dfs(x, j, k-1)$ 的值到答案中；如果最后一刀是垂直切，那么我们需要枚举切的位置 $y$，其中 $j \lt y \lt n$，如果 $s[m][y] - s[i][y] - s[m][j] + s[i][j] \gt 0$，说明切出来的左边一块披萨中有苹果，我们累加 $dfs(i, y, k-1)$ 的值到答案中。

最终的答案即为 $dfs(0, 0, k-1)$ 的值。

为了避免重复计算，我们可以使用记忆化搜索的方法，用一个三维数组 $f$ 来记录 $dfs(i, j, k)$ 的值。当我们需要计算 $dfs(i, j, k)$ 的值时，如果 $f[i][j][k]$ 不为 $-1$，说明我们之前已经计算过了，直接返回 $f[i][j][k]$ 即可，否则我们按照上面的方法计算 $dfs(i, j, k)$ 的值，并将结果保存到 $f[i][j][k]$ 中。

时间复杂度 $O(m \times n \times k \times (m + n))$，空间复杂度 $O(m \times n \times k)$。其中 $m$, $n$ 分别是矩形的行数和列数。

相似题目：

- [2312. 卖木头块](https://github.com/doocs/leetcode/blob/main/solution/2300-2399/2312.Selling%20Pieces%20of%20Wood/README.md)

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
// Number of Ways of Cutting a Pizza：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func ways(pizza []string, k int) int {
	const mod = 1e9 + 7
	m, n := len(pizza), len(pizza[0])
	f := make([][][]int, m)
	s := make([][]int, m+1)
	for i := range f {
		f[i] = make([][]int, n)
		for j := range f[i] {
			f[i][j] = make([]int, k)
			for h := range f[i][j] {
				f[i][j][h] = -1
			}
		}
	}
	for i := range s {
		s[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1]
			if pizza[i-1][j-1] == 'A' {
				s[i][j]++
			}
		}
	}
	var dfs func(i, j, k int) int
	dfs = func(i, j, k int) int {
		if f[i][j][k] != -1 {
			return f[i][j][k]
		}
		if k == 0 {
			if s[m][n]-s[m][j]-s[i][n]+s[i][j] > 0 {
				return 1
			}
			return 0
		}
		ans := 0
		for x := i + 1; x < m; x++ {
			if s[x][n]-s[x][j]-s[i][n]+s[i][j] > 0 {
				ans = (ans + dfs(x, j, k-1)) % mod
			}
		}
		for y := j + 1; y < n; y++ {
			if s[m][y]-s[m][j]-s[i][y]+s[i][j] > 0 {
				ans = (ans + dfs(i, y, k-1)) % mod
			}
		}
		f[i][j][k] = ans
		return ans
	}
	return dfs(0, 0, k-1)
}
```

### Java

```java
// Number of Ways of Cutting a Pizza：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int m;
    private int n;
    private int[][] s;
    private Integer[][][] f;
    private final int mod = (int) 1e9 + 7;

    public int ways(String[] pizza, int k) {
        m = pizza.length;
        n = pizza[0].length();
        s = new int[m + 1][n + 1];
        f = new Integer[m][n][k];
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                int x = pizza[i - 1].charAt(j - 1) == 'A' ? 1 : 0;
                s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + x;
            }
        }
        return dfs(0, 0, k - 1);
    }

    private int dfs(int i, int j, int k) {
        if (k == 0) {
            return s[m][n] - s[i][n] - s[m][j] + s[i][j] > 0 ? 1 : 0;
        }
        if (f[i][j][k] != null) {
            return f[i][j][k];
        }
        int ans = 0;
        for (int x = i + 1; x < m; ++x) {
            if (s[x][n] - s[i][n] - s[x][j] + s[i][j] > 0) {
                ans = (ans + dfs(x, j, k - 1)) % mod;
            }
        }
        for (int y = j + 1; y < n; ++y) {
            if (s[m][y] - s[i][y] - s[m][j] + s[i][j] > 0) {
                ans = (ans + dfs(i, y, k - 1)) % mod;
            }
        }
        return f[i][j][k] = ans;
    }
}
```

### Python

```python
# Number of Ways of Cutting a Pizza：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def ways(self, pizza: List[str], k: int) -> int:
        @cache
        def dfs(i: int, j: int, k: int) -> int:
            if k == 0:
                return int(s[m][n] - s[i][n] - s[m][j] + s[i][j] > 0)
            ans = 0
            for x in range(i + 1, m):
                if s[x][n] - s[i][n] - s[x][j] + s[i][j] > 0:
                    ans += dfs(x, j, k - 1)
            for y in range(j + 1, n):
                if s[m][y] - s[i][y] - s[m][j] + s[i][j] > 0:
                    ans += dfs(i, y, k - 1)
            return ans % mod

        mod = 10**9 + 7
        m, n = len(pizza), len(pizza[0])
        s = [[0] * (n + 1) for _ in range(m + 1)]
        for i, row in enumerate(pizza, 1):
            for j, c in enumerate(row, 1):
                s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + int(c == 'A')
        return dfs(0, 0, k - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

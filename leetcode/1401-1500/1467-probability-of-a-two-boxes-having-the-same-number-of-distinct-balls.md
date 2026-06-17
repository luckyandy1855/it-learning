# 1467. Probability of a Two Boxes Having The Same Number of Distinct Balls

---
编号: 1467
题目: Probability of a Two Boxes Having The Same Number of Distinct Balls
难度: 困难
标签: [数组, 数学, 动态规划, 回溯, 组合数学, 概率与统计]
来源链接: https://leetcode.com/problems/probability-of-a-two-boxes-having-the-same-number-of-distinct-balls/
---

## 题目描述

桌面上有 `2n` 个颜色不完全相同的球，球的颜色共有 `k` 种。给你一个大小为 `k` 的整数数组 `balls` ，其中 `balls[i]` 是颜色为 `i` 的球的数量。

所有的球都已经 **随机打乱顺序** ，前 `n` 个球放入第一个盒子，后 `n` 个球放入另一个盒子（请认真阅读示例 2 的解释部分）。

**注意：**这两个盒子是不同的。例如，两个球颜色分别为 `a` 和 `b`，盒子分别为 `[]` 和 `()`，那么 `[a] (b)` 和 `[b] (a)` 这两种分配方式是不同的（请认真阅读示例的解释部分）。

请返回「两个盒子中球的颜色数相同」的情况的概率。答案与真实值误差在 `10^-5` 以内，则被视为正确答案

**示例 1：**

```text
输入：balls = [1,1]
输出：1.00000
解释：球平均分配的方式只有两种：
- 颜色为 1 的球放入第一个盒子，颜色为 2 的球放入第二个盒子
- 颜色为 2 的球放入第一个盒子，颜色为 1 的球放入第二个盒子
这两种分配，两个盒子中球的颜色数都相同。所以概率为 2/2 = 1 。
```

**示例 2：**

```text
输入：balls = [2,1,1]
输出：0.66667
解释：球的列表为 [1, 1, 2, 3]
随机打乱，得到 12 种等概率的不同打乱方案，每种方案概率为 1/12 ：
[1,1 / 2,3], [1,1 / 3,2], [1,2 / 1,3], [1,2 / 3,1], [1,3 / 1,2], [1,3 / 2,1], [2,1 / 1,3], [2,1 / 3,1], [2,3 / 1,1], [3,1 / 1,2], [3,1 / 2,1], [3,2 / 1,1]
然后，我们将前两个球放入第一个盒子，后两个球放入第二个盒子。
这 12 种可能的随机打乱方式中的 8 种满足「两个盒子中球的颜色数相同」。
概率 = 8/12 = 0.66667
```

**示例 3：**

```text
输入：balls = [1,2,1,2]
输出：0.60000
解释：球的列表为 [1, 2, 2, 3, 4, 4]。要想显示所有 180 种随机打乱方案是很难的，但只检查「两个盒子中球的颜色数相同」的 108 种情况是比较容易的。
概率 = 108 / 180 = 0.6 。
```

**提示：**

- `1 <= balls.length <= 8`

- `1 <= balls[i] <= 6`

- `sum(balls)` 是偶数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 回溯, 组合数学, 概率与统计」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们知道 $2n$ 个球，平均分到两个盒子中，总共有 $C_{2n}^n$ 种分法。接下来，我们可以求出每种分法中，两个盒子中球的颜色数相同的情况数。最后，将两者相除即可。

我们可以预处理出组合数 $C_{n}^m$，然后使用记忆化搜索求解。

设计一个函数 $dfs(i, j, diff)$，表示当前从第 $i$ 种球开始，第一个盒子剩余可放置 $j$ 个球，两个盒子中球的颜色数的差为 $diff$ 的方案数。

函数 $dfs(i, j, diff)$ 的执行逻辑如下：

- 如果 $i \geq k$，表示所有球都已经放完，如果 $j = 0$ 且 $diff = 0$，表示两个盒子中球的颜色数相同，返回 $1$，否则返回 $0$；
- 如果 $j < 0$，表示第一个盒子中球的数量超过了 $n$，返回 $0$；
- 如果 $f[i][j][diff]$ 不为 $-1$，表示已经计算过，直接返回 $f[i][j][diff]$；
- 否则，枚举第 $i$ 种球放入第一个盒子中的数量 $x$，则第 $i$ 种球放入第二个盒子中的数量为 $balls[i] - x$，两个盒子中球的颜色数的变化量为 $y$。如果所有球都放入第一个盒子中，那么 $y = 1$；如果所有球都放入第二个盒子中，那么 $y = -1$；否则 $y = 0$。然后，递归计算 $dfs(i + 1, j - x, diff + y)$，并将结果与 $C_{balls[i]}^x$ 相乘，累加到答案中。最后，将答案存入 $f[i][j][diff]$ 中，并返回答案。

时间复杂度 $O(n^2 \times k^2)$，空间复杂度 $O(n \times k^2)$。其中 $n$ 和 $k$ 分别是球的总数和颜色的种数。

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
// Probability of a Two Boxes Having The Same Number of Distinct Balls：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getProbability(balls []int) float64 {
	n, mx := 0, 0
	for _, x := range balls {
		n += x
		mx = max(mx, x)
	}
	n >>= 1
	m := max(mx, n<<1)
	c := make([][]int, m+1)
	for i := range c {
		c[i] = make([]int, m+1)
	}
	for i := 0; i <= m; i++ {
		c[i][0] = 1
		for j := 1; j <= i; j++ {
			c[i][j] = c[i-1][j-1] + c[i-1][j]
		}
	}
	k := len(balls)
	f := make([][][]int, k)
	for i := range f {
		f[i] = make([][]int, n+1)
		for j := range f[i] {
			f[i][j] = make([]int, k<<1|1)
			for h := range f[i][j] {
				f[i][j][h] = -1
			}
		}
	}
	var dfs func(int, int, int) int
	dfs = func(i, j, diff int) int {
		if i >= k {
			if j == 0 && diff == k {
				return 1
			}
			return 0
		}
		if j < 0 {
			return 0
		}
		if f[i][j][diff] != -1 {
			return f[i][j][diff]
		}
		ans := 0
		for x := 0; x <= balls[i]; x++ {
			y := 1
			if x != balls[i] {
				if x == 0 {
					y = -1
				} else {
					y = 0
				}
			}
			ans += dfs(i+1, j-x, diff+y) * c[balls[i]][x]
		}
		f[i][j][diff] = ans
		return ans
	}
	return float64(dfs(0, n, k)) / float64(c[n<<1][n])
}
```

### Java

```java
// Probability of a Two Boxes Having The Same Number of Distinct Balls：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private long[][] c;
    private int[] balls;
    private Map<List<Integer>, Long> f = new HashMap<>();

    public double getProbability(int[] balls) {
        int mx = 0;
        for (int x : balls) {
            n += x;
            mx = Math.max(mx, x);
        }
        n >>= 1;
        this.balls = balls;
        int m = Math.max(mx, n << 1);
        c = new long[m + 1][m + 1];
        for (int i = 0; i <= m; ++i) {
            c[i][0] = 1;
            for (int j = 1; j <= i; ++j) {
                c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
            }
        }
        return dfs(0, n, 0) * 1.0 / c[n << 1][n];
    }

    private long dfs(int i, int j, int diff) {
        if (i >= balls.length) {
            return j == 0 && diff == 0 ? 1 : 0;
        }
        if (j < 0) {
            return 0;
        }
        List<Integer> key = List.of(i, j, diff);
        if (f.containsKey(key)) {
            return f.get(key);
        }
        long ans = 0;
        for (int x = 0; x <= balls[i]; ++x) {
            int y = x == balls[i] ? 1 : (x == 0 ? -1 : 0);
            ans += dfs(i + 1, j - x, diff + y) * c[balls[i]][x];
        }
        f.put(key, ans);
        return ans;
    }
}
```

### Python

```python
# Probability of a Two Boxes Having The Same Number of Distinct Balls：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getProbability(self, balls: List[int]) -> float:
        @cache
        def dfs(i: int, j: int, diff: int) -> float:
            if i >= k:
                return 1 if j == 0 and diff == 0 else 0
            if j < 0:
                return 0
            ans = 0
            for x in range(balls[i] + 1):
                y = 1 if x == balls[i] else (-1 if x == 0 else 0)
                ans += dfs(i + 1, j - x, diff + y) * comb(balls[i], x)
            return ans

        n = sum(balls) >> 1
        k = len(balls)
        return dfs(0, n, 0) / comb(n << 1, n)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

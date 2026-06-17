# 1223. Dice Roll Simulation

---
编号: 1223
题目: Dice Roll Simulation
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/dice-roll-simulation/
---

## 题目描述

有一个骰子模拟器会每次投掷的时候生成一个 1 到 6 的随机数。

不过我们在使用它时有个约束，就是使得投掷骰子时，**连续** 掷出数字 `i` 的次数不能超过 `rollMax[i]`（`i` 从 1 开始编号）。

现在，给你一个整数数组 `rollMax` 和一个整数 `n`，请你来计算掷 `n` 次骰子可得到的不同点数序列的数量。

假如两个序列中至少存在一个元素不同，就认为这两个序列是不同的。由于答案可能很大，所以请返回 **模 `10^9 + 7`** 之后的结果。

**示例 1：**

```text
输入：n = 2, rollMax = [1,1,2,2,2,3]
输出：34
解释：我们掷 2 次骰子，如果没有约束的话，共有 6 * 6 = 36 种可能的组合。但是根据 rollMax 数组，数字 1 和 2 最多连续出现一次，所以不会出现序列 (1,1) 和 (2,2)。因此，最终答案是 36-2 = 34。
```

**示例 2：**

```text
输入：n = 2, rollMax = [1,1,1,1,1,1]
输出：30
```

**示例 3：**

```text
输入：n = 3, rollMax = [1,1,1,2,2,3]
输出：181
```

**提示：**

- `1 <= n <= 5000`

- `rollMax.length == 6`

- `1 <= rollMax[i] <= 15`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以设计一个函数 $dfs(i, j, x)$ 表示从第 $i$ 次掷骰子开始，当前掷出的点数为 $j$，且连续掷出 $j$ 的次数为 $x$ 的方案数。其中 $j$ 的取值范围为 $[1, 6]$，而 $x$ 的取值范围为 $[1, rollMax[j - 1]]$。那么答案就是 $dfs(0, 0, 0)$。

函数 $dfs(i, j, x)$ 的计算过程如下：

- 如果 $i \ge n$，说明已经掷完了 $n$ 次骰子，返回 $1$。
- 否则，我们枚举下一次掷出的点数 $k$，如果 $k \ne j$，那么我们可以直接掷出 $k$，此时连续掷出 $j$ 的次数 $x$ 就会被重置为 $1$，因此方案数为 $dfs(i + 1, k, 1)$。如果 $k = j$，那么我们需要判断 $x$ 是否小于 $rollMax[j - 1]$，如果小于，那么我们可以继续掷出 $j$，此时连续掷出 $j$ 的次数 $x$ 就会加 $1$，因此方案数为 $dfs(i + 1, j, x + 1)$。最后将所有方案数相加，即为 $dfs(i, j, x)$ 的值。注意答案可能很大，因此需要对 $10^9 + 7$ 取模。

过程中，我们可以使用记忆化搜索避免重复计算。

时间复杂度 $O(n \times k^2 \times M)$，空间复杂度 $O(n \times k \times M)$。其中 $k$ 为点数的取值范围，而 $M$ 为连续掷出某个点数的最大次数。

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
// Dice Roll Simulation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func dieSimulator(n int, rollMax []int) int {
	f := make([][7][16]int, n)
	const mod = 1e9 + 7
	var dfs func(i, j, x int) int
	dfs = func(i, j, x int) int {
		if i >= n {
			return 1
		}
		if f[i][j][x] != 0 {
			return f[i][j][x]
		}
		ans := 0
		for k := 1; k <= 6; k++ {
			if k != j {
				ans += dfs(i+1, k, 1)
			} else if x < rollMax[j-1] {
				ans += dfs(i+1, j, x+1)
			}
		}
		f[i][j][x] = ans % mod
		return f[i][j][x]
	}
	return dfs(0, 0, 0)
}
```

### Java

```java
// Dice Roll Simulation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][][] f;
    private int[] rollMax;

    public int dieSimulator(int n, int[] rollMax) {
        f = new Integer[n][7][16];
        this.rollMax = rollMax;
        return dfs(0, 0, 0);
    }

    private int dfs(int i, int j, int x) {
        if (i >= f.length) {
            return 1;
        }
        if (f[i][j][x] != null) {
            return f[i][j][x];
        }
        long ans = 0;
        for (int k = 1; k <= 6; ++k) {
            if (k != j) {
                ans += dfs(i + 1, k, 1);
            } else if (x < rollMax[j - 1]) {
                ans += dfs(i + 1, j, x + 1);
            }
        }
        ans %= 1000000007;
        return f[i][j][x] = (int) ans;
    }
}
```

### Python

```python
# Dice Roll Simulation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def dieSimulator(self, n: int, rollMax: List[int]) -> int:
        @cache
        def dfs(i, j, x):
            if i >= n:
                return 1
            ans = 0
            for k in range(1, 7):
                if k != j:
                    ans += dfs(i + 1, k, 1)
                elif x < rollMax[j - 1]:
                    ans += dfs(i + 1, j, x + 1)
            return ans % (10**9 + 7)

        return dfs(0, 0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0656. Coin Path

---
编号: 656
题目: Coin Path
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/coin-path/
---

## 题目描述

给你一个整数数组 `coins`（下标从 **1** 开始）长度为 `n`，以及一个整数 `maxJump`。你可以跳到数组 `coins` 的任意下标 `i`（满足 `coins[i] != -1`），访问下标 `i` 时需要支付 `coins[i]`。此外，如果你当前位于下标 `i`，你只能跳到下标 `i + k`（满足 `i + k 1, Pa2, ..., Pax]` 的长度为 `x`，路径 `p2 = [Pb1, Pb2, ..., Pbx]` 的长度为 `y` ，如果在两条路径的第一个不同的下标 `j` 处，`Paj` 小于 `Pbj`，则 `p1` 在字典序上小于 `p2`；如果不存在这样的 `j`，则较短的路径字典序较小。

示例 1：

```text
输入：coins = [1,2,4,-1,2], maxJump = 2
输出：[1,3,5]
```

示例 2：

```text
输入：coins = [1,2,4,-1,2], maxJump = 1
输出：[]
```

**提示：**

- `1 <= coins.length <= 1000`

- `-1 <= coins[i] <= 100`

- `coins[1] != -1`

- `1 <= maxJump <= 100`

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

题目需要我们找到从下标 1 到下标 n 的最小花费路径，且字典序最小，我们可以使用动态规划求解。

我们定义 $f[i]$ 表示从下标 $i$ 到下标 $n-1$ 的最小花费。如果 $coins[n - 1] = -1$，则不存在从下标 $n-1$ 到下标 $n-1$ 的路径，直接返回空数组即可。否则 $f[n - 1] = coins[n - 1]$。

接下来，我们从下标 $n-2$ 开始，逆向遍历数组，对于下标 $i$，如果 $coins[i] = -1$，则 $f[i] = \infty$，否则 $f[i] = \min_{j = i + 1}^{min(n - 1, i + maxJump)} f[j] + coins[i]$。

然后我们判断 $f[0]$ 是否为 $\infty$，如果是，则不存在一条满足条件的路径，返回空数组即可。否则，我们的总花费为 $s = f[0]$，我们从下标 0 开始，向后遍历数组，如果 $f[i] = s$，则说明从下标 $i$ 到下标 $n-1$ 的花费为 $s$，我们将 $s$ 减去 $coins[i]$，并将下标 $i+1$ 加入到结果数组中，直到遍历到下标 $n-1$，返回结果数组即可。

时间复杂度 $O(n \times m)$，空间复杂度 $O(n)$。其中 $n$ 和 $m$ 分别为数组的长度和最大跳跃长度。

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
// Coin Path：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func cheapestJump(coins []int, maxJump int) (ans []int) {
	n := len(coins)
	if coins[n-1] == -1 {
		return
	}
	f := make([]int, n)
	f[n-1] = coins[n-1]
	const inf = 1 << 30
	for i := n - 2; i >= 0; i-- {
		f[i] = inf
		if coins[i] != -1 {
			for j := i + 1; j < n && j < i+maxJump+1; j++ {
				if f[i] > f[j]+coins[i] {
					f[i] = f[j] + coins[i]
				}
			}
		}
	}
	if f[0] == inf {
		return
	}
	for i, s := 0, f[0]; i < n; i++ {
		if f[i] == s {
			s -= coins[i]
			ans = append(ans, i+1)
		}
	}
	return
}
```

### Java

```java
// Coin Path：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> cheapestJump(int[] coins, int maxJump) {
        int n = coins.length;
        List<Integer> ans = new ArrayList<>();
        if (coins[n - 1] == -1) {
            return ans;
        }
        int[] f = new int[n];
        final int inf = 1 << 30;
        Arrays.fill(f, inf);
        f[n - 1] = coins[n - 1];
        for (int i = n - 2; i >= 0; --i) {
            if (coins[i] != -1) {
                for (int j = i + 1; j < Math.min(n, i + maxJump + 1); ++j) {
                    if (f[i] > f[j] + coins[i]) {
                        f[i] = f[j] + coins[i];
                    }
                }
            }
        }
        if (f[0] == inf) {
            return ans;
        }
        for (int i = 0, s = f[0]; i < n; ++i) {
            if (f[i] == s) {
                s -= coins[i];
                ans.add(i + 1);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Coin Path：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def cheapestJump(self, coins: List[int], maxJump: int) -> List[int]:
        if coins[-1] == -1:
            return []
        n = len(coins)
        f = [inf] * n
        f[-1] = coins[-1]
        for i in range(n - 2, -1, -1):
            if coins[i] != -1:
                for j in range(i + 1, min(n, i + maxJump + 1)):
                    if f[i] > f[j] + coins[i]:
                        f[i] = f[j] + coins[i]
        if f[0] == inf:
            return []
        ans = []
        s = f[0]
        for i in range(n):
            if f[i] == s:
                s -= coins[i]
                ans.append(i + 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

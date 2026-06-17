# 0956. Tallest Billboard

---
编号: 956
题目: Tallest Billboard
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/tallest-billboard/
---

## 题目描述

你正在安装一个广告牌，并希望它高度最大。这块广告牌将有两个钢制支架，两边各一个。每个钢支架的高度必须相等。

你有一堆可以焊接在一起的钢筋 `rods`。举个例子，如果钢筋的长度为 `1`、`2` 和 `3`，则可以将它们焊接在一起形成长度为 `6` 的支架。

返回 *广告牌的最大可能安装高度* 。如果没法安装广告牌，请返回 `0` 。

**示例 1：**

```text
输入：[1,2,3,6]
输出：6
解释：我们有两个不相交的子集 {1,2,3} 和 {6}，它们具有相同的和 sum = 6。
```

**示例 2：**

```text
输入：[1,2,3,4,5,6]
输出：10
解释：我们有两个不相交的子集 {2,3,5} 和 {4,6}，它们具有相同的和 sum = 10。
```

**示例 3：**

```text
输入：[1,2]
输出：0
解释：没法安装广告牌，所以返回 0。
```

**提示：**

- `0

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

我们设计一个函数 $dfs(i, j)$，表示从第 $i$ 根钢筋开始，且当前高度差为 $j$ 时，两边的最大共同高度。那么答案就是 $dfs(0, 0)$。

函数 $dfs(i, j)$ 的计算过程如下：

如果 $i=n$，此时判断 $j$ 是否为 $0$，如果是则返回 $0$，否则返回 $-\infty$。

如果 $i \lt n$，此时有三种情况：

1. 不选择第 $i$ 根钢筋，此时 $dfs(i, j) = dfs(i+1, j)$；
1. 选择第 $i$ 根钢筋，并且放置在原本高度较高的一边，那么 $dfs(i, j) = dfs(i+1, j+rods[i])$；
1. 选择第 $i$ 根钢筋，并且放置在高度较低的一边，此时共同高度增加了 $\min(j, rods[i])$，那么 $dfs(i, j) = dfs(i+1, |rods[i]-j|) + \min(j, rods[i])$。

我们取这三种情况下的最大值，即可得到 $dfs(i, j)$ 的值。

为了避免重复计算，我们使用一个二维数组 $f$ 来记录已经计算过的 $dfs(i, j)$ 的值，调用 $dfs(i, j)$ 时，如果 $f[i][j]$ 已经被计算过，则直接返回 $f[i][j]$。否则，我们计算 $dfs(i, j)$ 的值，并将其存入 $f[i][j]$。

时间复杂度 $O(n \times S)$，空间复杂度 $O(n \times S)$。其中 $n$ 和 $S$ 分别为 $rods$ 的长度和 $rods$ 中所有元素的和。

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
// Tallest Billboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func tallestBillboard(rods []int) int {
	s := 0
	for _, x := range rods {
		s += x
	}
	n := len(rods)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, s+1)
		for j := range f[i] {
			f[i][j] = -1
		}
	}
	var dfs func(i, j int) int
	dfs = func(i, j int) int {
		if i >= n {
			if j == 0 {
				return 0
			}
			return -(1 << 30)
		}
		if f[i][j] != -1 {
			return f[i][j]
		}
		ans := max(dfs(i+1, j), dfs(i+1, j+rods[i]))
		ans = max(ans, dfs(i+1, abs(j-rods[i]))+min(j, rods[i]))
		f[i][j] = ans
		return ans
	}
	return dfs(0, 0)
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
// Tallest Billboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][] f;
    private int[] rods;
    private int n;

    public int tallestBillboard(int[] rods) {
        int s = 0;
        for (int x : rods) {
            s += x;
        }
        n = rods.length;
        this.rods = rods;
        f = new Integer[n][s + 1];
        return dfs(0, 0);
    }

    private int dfs(int i, int j) {
        if (i >= n) {
            return j == 0 ? 0 : -(1 << 30);
        }
        if (f[i][j] != null) {
            return f[i][j];
        }
        int ans = Math.max(dfs(i + 1, j), dfs(i + 1, j + rods[i]));
        ans = Math.max(ans, dfs(i + 1, Math.abs(rods[i] - j)) + Math.min(j, rods[i]));
        return f[i][j] = ans;
    }
}
```

### Python

```python
# Tallest Billboard：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def tallestBillboard(self, rods: List[int]) -> int:
        @cache
        def dfs(i: int, j: int) -> int:
            if i >= len(rods):
                return 0 if j == 0 else -inf
            ans = max(dfs(i + 1, j), dfs(i + 1, j + rods[i]))
            ans = max(ans, dfs(i + 1, abs(rods[i] - j)) + min(j, rods[i]))
            return ans

        return dfs(0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

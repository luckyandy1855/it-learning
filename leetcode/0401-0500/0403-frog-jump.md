# 0403. Frog Jump

---
编号: 403
题目: Frog Jump
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/frog-jump/
---

## 题目描述

一只青蛙想要过河。 假定河流被等分为若干个单元格，并且在每一个单元格内都有可能放有一块石子（也有可能没有）。 青蛙可以跳上石子，但是不可以跳入水中。

给你石子的位置列表 `stones`（用单元格序号 **升序** 表示）， 请判定青蛙能否成功过河（即能否在最后一步跳至最后一块石子上）。开始时， 青蛙默认已站在第一块石子上，并可以假定它第一步只能跳跃 `1` 个单位（即只能从单元格 1 跳至单元格 2 ）。

如果青蛙上一步跳跃了 `k`* *个单位，那么它接下来的跳跃距离只能选择为 `k - 1`、`k`* *或 `k + 1` 个单位。 另请注意，青蛙只能向前方（终点的方向）跳跃。

**示例 1：**

```text
输入：stones = [0,1,3,5,6,8,12,17]
输出：true
解释：青蛙可以成功过河，按照如下方案跳跃：跳 1 个单位到第 2 块石子, 然后跳 2 个单位到第 3 块石子, 接着 跳 2 个单位到第 4 块石子, 然后跳 3 个单位到第 6 块石子, 跳 4 个单位到第 7 块石子, 最后，跳 5 个单位到第 8 个石子（即最后一块石子）。
```

**示例 2：**

```text
输入：stones = [0,1,2,3,4,8,9,11]
输出：false
解释：这是因为第 5 和第 6 个石子之间的间距太大，没有可选的方案供青蛙跳跃过去。
```

**提示：**

- `2 <= stones.length <= 2000`

- `0 <= stones[i] <= 2^31 - 1`

- `stones[0] == 0`

- `stones` 按严格升序排列

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

我们用哈希表 $pos$ 记录每个石子的下标，接下来设计一个函数 $dfs(i, k)$，表示青蛙从第 $i$ 个石子跳跃且上一次跳跃距离为 $k$，如果青蛙能够到达终点，那么函数返回 `true`，否则返回 `false`。

函数 $dfs(i, k)$ 的计算过程如下：

如果 $i$ 是最后一个石子的下标，那么青蛙已经到达终点，返回 `true`；

否则，我们需要枚举青蛙接下来的跳跃距离 $j$，其中 $j \in [k-1, k, k+1]$。如果 $j$ 是正数，并且哈希表 $pos$ 中存在位置 $stones[i] + j$，那么青蛙在第 $i$ 个石子上可以选择跳跃 $j$ 个单位，如果 $dfs(pos[stones[i] + j], j)$ 返回 `true`，那么青蛙可以从第 $i$ 个石子成功跳跃到终点，我们就可以返回 `true`。

枚举结束，说明青蛙在第 $i$ 个石子上无法选择合适的跳跃距离跳到终点，我们就返回 `false`。

为了防止函数 $dfs(i, k)$ 中出现重复计算，我们可以使用记忆化搜索，将 $dfs(i, k)$ 的结果记录在一个数组 $f$ 中，每当函数 $dfs(i, k)$ 返回结果，我们就将 $f[i][k]$ 进行赋值，并在下次遇到 $dfs(i, k)$ 时直接返回 $f[i][k]$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 是石子的数量。

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
// Frog Jump：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canCross(stones []int) bool {
	n := len(stones)
	f := make([][]int, n)
	pos := map[int]int{}
	for i := range f {
		pos[stones[i]] = i
		f[i] = make([]int, n)
		for j := range f[i] {
			f[i][j] = -1
		}
	}
	var dfs func(int, int) bool
	dfs = func(i, k int) bool {
		if i == n-1 {
			return true
		}
		if f[i][k] != -1 {
			return f[i][k] == 1
		}
		for j := k - 1; j <= k+1; j++ {
			if j > 0 {
				if p, ok := pos[stones[i]+j]; ok {
					if dfs(p, j) {
						f[i][k] = 1
						return true
					}
				}
			}
		}
		f[i][k] = 0
		return false
	}
	return dfs(0, 0)
}
```

### Java

```java
// Frog Jump：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Boolean[][] f;
    private Map<Integer, Integer> pos = new HashMap<>();
    private int[] stones;
    private int n;

    public boolean canCross(int[] stones) {
        n = stones.length;
        f = new Boolean[n][n];
        this.stones = stones;
        for (int i = 0; i < n; ++i) {
            pos.put(stones[i], i);
        }
        return dfs(0, 0);
    }

    private boolean dfs(int i, int k) {
        if (i == n - 1) {
            return true;
        }
        if (f[i][k] != null) {
            return f[i][k];
        }
        for (int j = k - 1; j <= k + 1; ++j) {
            if (j > 0) {
                int h = stones[i] + j;
                if (pos.containsKey(h) && dfs(pos.get(h), j)) {
                    return f[i][k] = true;
                }
            }
        }
        return f[i][k] = false;
    }
}
```

### Python

```python
# Frog Jump：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canCross(self, stones: List[int]) -> bool:
        @cache
        def dfs(i, k):
            if i == n - 1:
                return True
            for j in range(k - 1, k + 2):
                if j > 0 and stones[i] + j in pos and dfs(pos[stones[i] + j], j):
                    return True
            return False

        n = len(stones)
        pos = {s: i for i, s in enumerate(stones)}
        return dfs(0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

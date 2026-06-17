# 0254. Factor Combinations

---
编号: 254
题目: Factor Combinations
难度: 中等
标签: [回溯]
来源链接: https://leetcode.com/problems/factor-combinations/
---

## 题目描述

整数可以被看作是其因子的乘积。

例如：

```text
8 = 2 x 2 x 2;
  = 2 x 4.
```

请实现一个函数，该函数接收一个整数 *n* 并返回该整数所有的因子组合。

**注意：**

- 你可以假定 *n* 为永远为正数。

- 因子必须大于 1 并且小于 *n*。

**示例 1：**

```text
输入: 1
输出: []
```

**示例 2：**

```text
输入: 37
输出: []
```

**示例 3：**

```text
输入: 12
输出:
[
  [2, 6],
  [2, 2, 3],
  [3, 4]
]
```

**示例 4：**

```text
输入: 32
输出:
[
  [2, 16],
  [2, 2, 8],
  [2, 2, 2, 4],
  [2, 2, 2, 2, 2],
  [2, 4, 4],
  [4, 8]
]
```

提示：

- `1 <= n <= 10^7`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计函数 $dfs(n, i)$，其中 $n$ 表示当前待分解的数，$i$ 表示当前分解的数的最大因子，函数的作用是将 $n$ 分解为若干个因子，其中每个因子都不小于 $i$，并将所有分解结果保存到 $ans$ 中。

在函数 $dfs(n, i)$ 中，我们从 $i$ 开始枚举 $n$ 的因子 $j$，如果 $j$ 是 $n$ 的因子，那么我们将 $j$ 加入当前分解结果，然后继续分解 $n / j$，即调用函数 $dfs(n / j, j)$。

时间复杂度 $O(\sqrt{n})$。

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
// Factor Combinations：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getFactors(n int) [][]int {
	t := []int{}
	ans := [][]int{}
	var dfs func(n, i int)
	dfs = func(n, i int) {
		if len(t) > 0 {
			ans = append(ans, append(slices.Clone(t), n))
		}
		for j := i; j <= n/j; j++ {
			if n%j == 0 {
				t = append(t, j)
				dfs(n/j, j)
				t = t[:len(t)-1]
			}
		}
	}
	dfs(n, 2)
	return ans
}
```

### Java

```java
import java.util.*;
// Factor Combinations：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private List<Integer> t = new ArrayList<>();
    private List<List<Integer>> ans = new ArrayList<>();

    public List<List<Integer>> getFactors(int n) {
        dfs(n, 2);
        return ans;
    }

    private void dfs(int n, int i) {
        if (!t.isEmpty()) {
            List<Integer> cp = new ArrayList<>(t);
            cp.add(n);
            ans.add(cp);
        }
        for (int j = i; j <= n / j; ++j) {
            if (n % j == 0) {
                t.add(j);
                dfs(n / j, j);
                t.remove(t.size() - 1);
            }
        }
    }
}
```

### Python

```python
# Factor Combinations：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getFactors(self, n: int) -> List[List[int]]:
        def dfs(n, i):
            if t:
                ans.append(t + [n])
            j = i
            while j * j <= n:
                if n % j == 0:
                    t.append(j)
                    dfs(n // j, j)
                    t.pop()
                j += 1

        t = []
        ans = []
        dfs(n, 2)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

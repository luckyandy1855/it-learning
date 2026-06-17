# 1253. Reconstruct a 2-Row Binary Matrix

---
编号: 1253
题目: Reconstruct a 2-Row Binary Matrix
难度: 中等
标签: [贪心, 数组, 矩阵]
来源链接: https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix/
---

## 题目描述

给你一个 `2` 行 `n` 列的二进制数组：

- 矩阵是一个二进制矩阵，这意味着矩阵中的每个元素不是 `0` 就是 `1`。

- 第 `0` 行的元素之和为 `upper`。

- 第 `1` 行的元素之和为 `lower`。

- 第 `i` 列（从 `0` 开始编号）的元素之和为 `colsum[i]`，`colsum` 是一个长度为 `n` 的整数数组。

你需要利用 `upper`，`lower` 和 `colsum` 来重构这个矩阵，并以二维整数数组的形式返回它。

如果有多个不同的答案，那么任意一个都可以通过本题。

如果不存在符合要求的答案，就请返回一个空的二维数组。

**示例 1：**

```text
输入：upper = 2, lower = 1, colsum = [1,1,1]
输出：[[1,1,0],[0,0,1]]
解释：[[1,0,1],[0,1,0]] 和 [[0,1,1],[1,0,0]] 也是正确答案。
```

**示例 2：**

```text
输入：upper = 2, lower = 3, colsum = [2,2,1,1]
输出：[]
```

**示例 3：**

```text
输入：upper = 5, lower = 5, colsum = [2,1,2,0,1,0,1,2,0,1]
输出：[[1,1,1,0,1,0,0,1,0,0],[1,0,1,0,0,0,1,1,0,1]]
```

**提示：**

- `1 <= colsum.length <= 10^5`

- `0 <= upper, lower <= colsum.length`

- `0 <= colsum[i] <= 2`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先创建一个答案数组 $ans$，其中 $ans[0]$ 和 $ans[1]$ 分别表示矩阵的第一行和第二行。

接下来，从左到右遍历数组 $colsum$，对于当前遍历到的元素 $colsum[j]$，我们有以下几种情况：

- 如果 $colsum[j] = 2$，那么我们将 $ans[0][j]$ 和 $ans[1][j]$ 都置为 $1$。此时 $upper$ 和 $lower$ 都减去 $1$。
- 如果 $colsum[j] = 1$，那么我们将 $ans[0][j]$ 或 $ans[1][j]$ 置为 $1$。如果 $upper \gt lower$，那么我们优先将 $ans[0][j]$ 置为 $1$，否则我们优先将 $ans[1][j]$ 置为 $1$。此时 $upper$ 或 $lower$ 减去 $1$。
- 如果 $colsum[j] = 0$，那么我们将 $ans[0][j]$ 和 $ans[1][j]$ 都置为 $0$。
- 如果 $upper \lt 0$ 或 $lower \lt 0$，那么说明无法构造出满足要求的矩阵，我们返回一个空数组。

遍历结束，如果 $upper$ 和 $lower$ 都为 $0$，那么我们返回 $ans$，否则我们返回一个空数组。

时间复杂度 $O(n)$，其中 $n$ 是数组 $colsum$ 的长度。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Reconstruct a 2-Row Binary Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reconstructMatrix(upper int, lower int, colsum []int) [][]int {
	n := len(colsum)
	ans := make([][]int, 2)
	for i := range ans {
		ans[i] = make([]int, n)
	}
	for j, v := range colsum {
		if v == 2 {
			ans[0][j], ans[1][j] = 1, 1
			upper--
			lower--
		}
		if v == 1 {
			if upper > lower {
				upper--
				ans[0][j] = 1
			} else {
				lower--
				ans[1][j] = 1
			}
		}
		if upper < 0 || lower < 0 {
			break
		}
	}
	if upper != 0 || lower != 0 {
		return [][]int{}
	}
	return ans
}
```

### Java

```java
// Reconstruct a 2-Row Binary Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> reconstructMatrix(int upper, int lower, int[] colsum) {
        int n = colsum.length;
        List<Integer> first = new ArrayList<>();
        List<Integer> second = new ArrayList<>();
        for (int j = 0; j < n; ++j) {
            int a = 0, b = 0;
            if (colsum[j] == 2) {
                a = b = 1;
                upper--;
                lower--;
            } else if (colsum[j] == 1) {
                if (upper > lower) {
                    upper--;
                    a = 1;
                } else {
                    lower--;
                    b = 1;
                }
            }
            if (upper < 0 || lower < 0) {
                break;
            }
            first.add(a);
            second.add(b);
        }
        return upper == 0 && lower == 0 ? List.of(first, second) : List.of();
    }
}
```

### Python

```python
# Reconstruct a 2-Row Binary Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reconstructMatrix(
        self, upper: int, lower: int, colsum: List[int]
    ) -> List[List[int]]:
        n = len(colsum)
        ans = [[0] * n for _ in range(2)]
        for j, v in enumerate(colsum):
            if v == 2:
                ans[0][j] = ans[1][j] = 1
                upper, lower = upper - 1, lower - 1
            if v == 1:
                if upper > lower:
                    upper -= 1
                    ans[0][j] = 1
                else:
                    lower -= 1
                    ans[1][j] = 1
            if upper < 0 or lower < 0:
                return []
        return ans if lower == upper == 0 else []
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1072. Flip Columns For Maximum Number of Equal Rows

---
编号: 1072
题目: Flip Columns For Maximum Number of Equal Rows
难度: 中等
标签: [数组, 哈希表, 矩阵]
来源链接: https://leetcode.com/problems/flip-columns-for-maximum-number-of-equal-rows/
---

## 题目描述

给定 `m x n` 矩阵 `matrix` 。

你可以从中选出任意数量的列并翻转其上的 **每个 **单元格。（即翻转后，单元格的值从 `0` 变成 `1`，或者从 `1` 变为 `0` 。）

返回 *经过一些翻转后，行内所有值都相等的最大行数* 。

**示例 1：**

```text
输入：matrix = [[0,1],[1,1]]
输出：1
解释：不进行翻转，有 1 行所有值都相等。
```

**示例 2：**

```text
输入：matrix = [[0,1],[1,0]]
输出：2
解释：翻转第一列的值之后，这两行都由相等的值组成。
```

**示例 3：**

```text
输入：matrix = [[0,0,0],[0,0,1],[1,1,0]]
输出：2
解释：翻转前两列的值之后，后两行由相等的值组成。
```

**提示：**

- `m == matrix.length`

- `n == matrix[i].length`

- `1 <= m, n <= 300`

- `matrix[i][j] == 0` 或 `1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们观察发现，如果矩阵中的两行满足以下条件之一，则它们可以通过翻转某些列的方式得到相等的行：

1. 两行的对应位置元素相等，即如果其中一行元素为 $1,0,0,1$，则另一行元素也为 $1,0,0,1$；
1. 两行的对应位置元素相反，即如果其中一行元素为 $1,0,0,1$，则另一行元素为 $0,1,1,0$。

我们称满足以上条件之一的两行元素为“等价行”，那么题目所求的答案即为矩阵中最多包含等价行的行数。

因此，我们可以遍历矩阵的每一行，将每一行转换成第一个元素为 $0$ 的“等价行”。具体做法如下：

- 如果当前行的第一个元素为 $0$，那么当前行的元素保持不变；
- 如果当前行的第一个元素为 $1$，那么我们将当前行的每个元素进行翻转，即 $0$ 变成 $1$, $1$ 变成 $0$。也就是说，我们将以 $1$ 开头的行翻转成以 $0$ 开头的“等价行”。

这样一来，我们只需要用一个哈希表来统计转换后的每一行的出现次数，其中键为转换后的行（可以将所有数字拼接成一个字符串），值为该行出现的次数。最后，哈希表中值的最大值即为矩阵中最多包含等价行的行数。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

相似题目：

- [2128. 通过翻转行或列来去除所有的 1](https://github.com/doocs/leetcode/blob/main/solution/2100-2199/2128.Remove%20All%20Ones%20With%20Row%20and%20Column%20Flips/README.md)

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
// Flip Columns For Maximum Number of Equal Rows：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxEqualRowsAfterFlips(matrix [][]int) (ans int) {
	cnt := map[string]int{}
	for _, row := range matrix {
		s := []byte{}
		for _, x := range row {
			if row[0] == 1 {
				x ^= 1
			}
			s = append(s, byte(x)+'0')
		}
		t := string(s)
		cnt[t]++
		ans = max(ans, cnt[t])
	}
	return
}
```

### Java

```java
// Flip Columns For Maximum Number of Equal Rows：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxEqualRowsAfterFlips(int[][] matrix) {
        Map<String, Integer> cnt = new HashMap<>();
        int ans = 0, n = matrix[0].length;
        for (var row : matrix) {
            char[] cs = new char[n];
            for (int i = 0; i < n; ++i) {
                cs[i] = (char) (row[0] ^ row[i]);
            }
            ans = Math.max(ans, cnt.merge(String.valueOf(cs), 1, Integer::sum));
        }
        return ans;
    }
}
```

### Python

```python
# Flip Columns For Maximum Number of Equal Rows：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxEqualRowsAfterFlips(self, matrix: List[List[int]]) -> int:
        cnt = Counter()
        for row in matrix:
            t = tuple(row) if row[0] == 0 else tuple(x ^ 1 for x in row)
            cnt[t] += 1
        return max(cnt.values())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1074. Number of Submatrices That Sum to Target

---
编号: 1074
题目: Number of Submatrices That Sum to Target
难度: 困难
标签: [数组, 哈希表, 矩阵, 前缀和]
来源链接: https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/
---

## 题目描述

给出矩阵 `matrix` 和目标值 `target`，返回元素总和等于目标值的非空子矩阵的数量。

子矩阵 `x1, y1, x2, y2` 是满足 `x1

```text
输入：matrix = [[0,1,0],[1,1,1],[0,1,0]], target = 0
输出：4
解释：四个只含 0 的 1x1 子矩阵。
```

**示例 2：**

```text
输入：matrix = [[1,-1],[-1,1]], target = 0
输出：5
解释：两个 1x2 子矩阵，加上两个 2x1 子矩阵，再加上一个 2x2 子矩阵。
```

**示例 3：**

```text
输入：matrix = [[904]], target = 0
输出：0
```

**提示：**

- `1 <= matrix.length <= 100`

- `1 <= matrix[0].length <= 100`

- `-1000 <= matrix[i][j] <= 1000`

- `-10^8 <= target <= 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 矩阵, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举矩阵的上下边界 $i$ 和 $j$，每次算出当前上下边界内每列的元素和，记为数组 $col$，然后问题就转换为如何在数组 $col$ 中寻找和为目标值 $target$ 的子数组个数。我们累加这些子数组的个数，就是题目要求的答案。

那么题目就变成了：给定一个数组 $nums$ 和目标值 $target$，计算有多少个子数组的和为 $target$，我们可以通过函数 $f(nums, target)$ 来求解。

函数 $f(nums, target)$ 的计算方法如下：

- 定义一个哈希表 $d$，用来记录出现过的前缀和以及其出现次数，初始时 $d[0] = 1$；
- 初始化变量 $s = 0, cnt = 0$，其中 $s$ 表示前缀和，而 $cnt$ 表示和为 $target$ 的子数组个数；
- 从左到右遍历数组 $nums$，对于当前遍历到的元素 $x$，更新前缀和 $s = s + x$，如果 $d[s - target]$ 的值存在，那么更新 $cnt = cnt + d[s - target]$，即子数组个数增加 $d[s - target]$。然后更新哈希表中元素 $d[s]$ 的值，即 $d[s] = d[s] + 1$；继续遍历下一个元素；
- 遍历结束之后，返回子数组个数 $cnt$。

时间复杂度 $O(m^2 \times n)$，空间复杂度 $O(n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Number of Submatrices That Sum to Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numSubmatrixSumTarget(matrix [][]int, target int) (ans int) {
	m, n := len(matrix), len(matrix[0])
	for i := 0; i < m; i++ {
		col := make([]int, n)
		for j := i; j < m; j++ {
			for k := 0; k < n; k++ {
				col[k] += matrix[j][k]
			}
			ans += f(col, target)
		}
	}
	return
}

func f(nums []int, target int) (cnt int) {
	d := map[int]int{0: 1}
	s := 0
	for _, x := range nums {
		s += x
		if v, ok := d[s-target]; ok {
			cnt += v
		}
		d[s]++
	}
	return
}
```

### Java

```java
// Number of Submatrices That Sum to Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numSubmatrixSumTarget(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            int[] col = new int[n];
            for (int j = i; j < m; ++j) {
                for (int k = 0; k < n; ++k) {
                    col[k] += matrix[j][k];
                }
                ans += f(col, target);
            }
        }
        return ans;
    }

    private int f(int[] nums, int target) {
        Map<Integer, Integer> d = new HashMap<>();
        d.put(0, 1);
        int s = 0, cnt = 0;
        for (int x : nums) {
            s += x;
            cnt += d.getOrDefault(s - target, 0);
            d.merge(s, 1, Integer::sum);
        }
        return cnt;
    }
}
```

### Python

```python
# Number of Submatrices That Sum to Target：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numSubmatrixSumTarget(self, matrix: List[List[int]], target: int) -> int:
        def f(nums: List[int]) -> int:
            d = defaultdict(int)
            d[0] = 1
            cnt = s = 0
            for x in nums:
                s += x
                cnt += d[s - target]
                d[s] += 1
            return cnt

        m, n = len(matrix), len(matrix[0])
        ans = 0
        for i in range(m):
            col = [0] * n
            for j in range(i, m):
                for k in range(n):
                    col[k] += matrix[j][k]
                ans += f(col)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1292. Maximum Side Length of a Square with Sum Less than or Equal to Threshold

---
编号: 1292
题目: Maximum Side Length of a Square with Sum Less than or Equal to Threshold
难度: 中等
标签: [数组, 二分查找, 矩阵, 前缀和]
来源链接: https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/
---

## 题目描述

给你一个大小为 `m x n` 的矩阵 `mat` 和一个整数阈值 `threshold`。

请你返回元素总和小于或等于阈值的正方形区域的最大边长；如果没有这样的正方形区域，则返回 **0 **。

**示例 1：**

```text
输入：mat = [[1,1,3,2,4,3,2],[1,1,3,2,4,3,2],[1,1,3,2,4,3,2]], threshold = 4
输出：2
解释：总和小于或等于 4 的正方形的最大边长为 2，如图所示。
```

**示例 2：**

```text
输入：mat = [[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2]], threshold = 1
输出：0
```

**提示：**

- `m == mat.length`

- `n == mat[i].length`

- `1 <= m, n <= 300`

- `0 <= mat[i][j] <= 10^4`

- `0 <= threshold <= 10^5`^

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 矩阵, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先预处理得到二维前缀和数组 $s$，其中 $s[i + 1][j + 1]$ 表示矩阵 $mat$ 中从 $(0, 0)$ 到 $(i, j)$ 的元素和，那么对于任意的正方形区域，我们都可以在 $O(1)$ 的时间内得到其元素和。

接下来，我们可以使用二分查找的方法得到最大的边长。我们枚举正方形的边长 $k$，然后枚举正方形的左上角位置 $(i, j)$，那么我们可以得到正方形的元素和 $v$，如果 $v \leq threshold$，那么说明存在边长为 $k$ 的正方形区域的元素和小于或等于阈值，否则不存在。

时间复杂度 $O(m \times n \times \log \min(m, n))$，空间复杂度 $O(m \times n)$。

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
// Maximum Side Length of a Square with Sum Less than or Equal to Threshold：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSideLength(mat [][]int, threshold int) int {
	m, n := len(mat), len(mat[0])
	s := make([][]int, m+1)
	for i := range s {
		s[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			s[i][j] = s[i-1][j] + s[i][j-1] - s[i-1][j-1] + mat[i-1][j-1]
		}
	}
	check := func(k int) bool {
		for i := 0; i < m-k+1; i++ {
			for j := 0; j < n-k+1; j++ {
				if s[i+k][j+k]-s[i][j+k]-s[i+k][j]+s[i][j] <= threshold {
					return true
				}
			}
		}
		return false
	}
	l, r := 0, min(m, n)
	for l < r {
		mid := (l + r + 1) >> 1
		if check(mid) {
			l = mid
		} else {
			r = mid - 1
		}
	}
	return l
}
```

### Java

```java
// Maximum Side Length of a Square with Sum Less than or Equal to Threshold：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int m;
    private int n;
    private int threshold;
    private int[][] s;

    public int maxSideLength(int[][] mat, int threshold) {
        m = mat.length;
        n = mat[0].length;
        this.threshold = threshold;
        s = new int[m + 1][n + 1];
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + mat[i - 1][j - 1];
            }
        }
        int l = 0, r = Math.min(m, n);
        while (l < r) {
            int mid = (l + r + 1) >> 1;
            if (check(mid)) {
                l = mid;
            } else {
                r = mid - 1;
            }
        }
        return l;
    }

    private boolean check(int k) {
        for (int i = 0; i < m - k + 1; ++i) {
            for (int j = 0; j < n - k + 1; ++j) {
                if (s[i + k][j + k] - s[i][j + k] - s[i + k][j] + s[i][j] <= threshold) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

### Python

```python
# Maximum Side Length of a Square with Sum Less than or Equal to Threshold：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSideLength(self, mat: List[List[int]], threshold: int) -> int:
        def check(k: int) -> bool:
            for i in range(m - k + 1):
                for j in range(n - k + 1):
                    v = s[i + k][j + k] - s[i][j + k] - s[i + k][j] + s[i][j]
                    if v <= threshold:
                        return True
            return False

        m, n = len(mat), len(mat[0])
        s = [[0] * (n + 1) for _ in range(m + 1)]
        for i, row in enumerate(mat, 1):
            for j, x in enumerate(row, 1):
                s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + x
        l, r = 0, min(m, n)
        while l < r:
            mid = (l + r + 1) >> 1
            if check(mid):
                l = mid
            else:
                r = mid - 1
        return l
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

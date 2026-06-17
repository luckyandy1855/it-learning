# 0835. Image Overlap

---
编号: 835
题目: Image Overlap
难度: 中等
标签: [数组, 矩阵]
来源链接: https://leetcode.com/problems/image-overlap/
---

## 题目描述

给你两个图像 `img1` 和 `img2` ，两个图像的大小都是 `n x n` ，用大小相同的二进制正方形矩阵表示。二进制矩阵仅由若干 `0` 和若干 `1` 组成。

**转换** 其中一个图像，将所有的 `1` 向左，右，上，或下滑动任何数量的单位；然后把它放在另一个图像的上面。该转换的 **重叠** 是指两个图像 **都** 具有 `1` 的位置的数目。

请注意，转换 **不包括** 向任何方向旋转。越过矩阵边界的 `1` 都将被清除。

最大可能的重叠数量是多少？

**示例 1：**

```text
输入：img1 = [[1,1,0],[0,1,0],[0,1,0]], img2 = [[0,0,0],[0,1,1],[0,0,1]]
输出：3
解释：将 img1 向右移动 1 个单位，再向下移动 1 个单位。

两个图像都具有 1 的位置的数目是 3（用红色标识）。
```

**示例 2：**

```text
输入：img1 = [[1]], img2 = [[1]]
输出：1
```

**示例 3：**

```text
输入：img1 = [[0]], img2 = [[0]]
输出：0
```

**提示：**

- `n == img1.length == img1[i].length`

- `n == img2.length == img2[i].length`

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举 $\textit{img1}$ 和 $\textit{img2}$ 的每个 $1$ 的位置，分别记为 $(i, j)$ 和 $(h, k)$。然后我们计算得到偏移量 $(i - h, j - k)$，记为 $(dx, dy)$，用哈希表 $\textit{cnt}$ 记录每个偏移量出现的次数。最后我们遍历哈希表 $\textit{cnt}$，找到出现次数最多的偏移量，即为答案。

时间复杂度 $O(n^4)$，空间复杂度 $O(n^2)$。其中 $n$ 是 $\textit{img1}$ 的边长。

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
// Image Overlap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestOverlap(img1 [][]int, img2 [][]int) (ans int) {
	type pair struct{ x, y int }
	cnt := map[pair]int{}
	for i, row1 := range img1 {
		for j, x1 := range row1 {
			if x1 == 1 {
				for h, row2 := range img2 {
					for k, x2 := range row2 {
						if x2 == 1 {
							t := pair{i - h, j - k}
							cnt[t]++
							ans = max(ans, cnt[t])
						}
					}
				}
			}
		}
	}
	return
}
```

### Java

```java
// Image Overlap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int largestOverlap(int[][] img1, int[][] img2) {
        int n = img1.length;
        Map<List<Integer>, Integer> cnt = new HashMap<>();
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (img1[i][j] == 1) {
                    for (int h = 0; h < n; ++h) {
                        for (int k = 0; k < n; ++k) {
                            if (img2[h][k] == 1) {
                                List<Integer> t = List.of(i - h, j - k);
                                ans = Math.max(ans, cnt.merge(t, 1, Integer::sum));
                            }
                        }
                    }
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Image Overlap：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestOverlap(self, img1: List[List[int]], img2: List[List[int]]) -> int:
        n = len(img1)
        cnt = Counter()
        for i in range(n):
            for j in range(n):
                if img1[i][j]:
                    for h in range(n):
                        for k in range(n):
                            if img2[h][k]:
                                cnt[(i - h, j - k)] += 1
        return max(cnt.values()) if cnt else 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

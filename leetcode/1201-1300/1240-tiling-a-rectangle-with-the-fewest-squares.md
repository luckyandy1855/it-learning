# 1240. Tiling a Rectangle with the Fewest Squares

---
编号: 1240
题目: Tiling a Rectangle with the Fewest Squares
难度: 困难
标签: [回溯]
来源链接: https://leetcode.com/problems/tiling-a-rectangle-with-the-fewest-squares/
---

## 题目描述

给定一个大小为 `n` x `m` 的长方形，返回贴满矩形所需的整数边正方形的最小数量。

**示例 1：**

```text
输入：n = 2, m = 3
输出：3
解释：需要 3 个正方形来覆盖长方形。
     2 个 1x1 的正方形
     1 个 2x2 的正方形
```

**示例 2：**

```text
输入：n = 5, m = 8
输出：5
```

**示例 3：**

```text
输入：n = 11, m = 13
输出：6
```

**提示：**

- `1 <= n, m <= 13`

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

我们可以按位置进行递归回溯，过程中我们用一个变量 $t$ 记录当前使用的瓷砖数。

- 如果 $j = m$，即第 $i$ 行已经被完全填充，则递归到下一行，即 $(i + 1, 0)$。
- 如果 $i = n$，则表示所有位置都已经被填充，我们更新答案并返回。
- 如果当前位置 $(i, j)$ 已经被填充，则直接递归到下一个位置 $(i, j + 1)$。
- 否则，我们枚举当前位置 $(i, j)$ 可以填充的最大正方形的边长 $w$，并将当前位置 $(i, j)$ 到 $(i + w - 1, j + w - 1)$ 的位置全部填充，然后递归到下一个位置 $(i, j + w)$。在回溯时，我们需要将当前位置 $(i, j)$ 到 $(i + w - 1, j + w - 1)$ 的位置全部清空。

由于每个位置只有两种状态：填充或者未填充，因此我们可以使用一个整数来表示当前位置的状态。我们使用一个长度为 $n$ 的整数数组 $filled$，其中 $filled[i]$ 表示第 $i$ 行的状态。如果 $filled[i]$ 的第 $j$ 位为 $1$，则表示第 $i$ 行第 $j$ 列已经被填充，否则表示未填充。

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
// Tiling a Rectangle with the Fewest Squares：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func tilingRectangle(n int, m int) int {
	ans := n * m
	filled := make([]int, n)
	var dfs func(i, j, t int)
	dfs = func(i, j, t int) {
		if j == m {
			i++
			j = 0
		}
		if i == n {
			ans = t
			return
		}
		if filled[i]>>j&1 == 1 {
			dfs(i, j+1, t)
		} else if t+1 < ans {
			var r, c int
			for k := i; k < n; k++ {
				if filled[k]>>j&1 == 1 {
					break
				}
				r++
			}
			for k := j; k < m; k++ {
				if filled[i]>>k&1 == 1 {
					break
				}
				c++
			}
			mx := min(r, c)
			for w := 1; w <= mx; w++ {
				for k := 0; k < w; k++ {
					filled[i+w-1] |= 1 << (j + k)
					filled[i+k] |= 1 << (j + w - 1)
				}
				dfs(i, j+w, t+1)
			}
			for x := i; x < i+mx; x++ {
				for y := j; y < j+mx; y++ {
					filled[x] ^= 1 << y
				}
			}
		}
	}
	dfs(0, 0, 0)
	return ans
}
```

### Java

```java
// Tiling a Rectangle with the Fewest Squares：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private int m;
    private int[] filled;
    private int ans;

    public int tilingRectangle(int n, int m) {
        this.n = n;
        this.m = m;
        ans = n * m;
        filled = new int[n];
        dfs(0, 0, 0);
        return ans;
    }

    private void dfs(int i, int j, int t) {
        if (j == m) {
            ++i;
            j = 0;
        }
        if (i == n) {
            ans = t;
            return;
        }
        if ((filled[i] >> j & 1) == 1) {
            dfs(i, j + 1, t);
        } else if (t + 1 < ans) {
            int r = 0, c = 0;
            for (int k = i; k < n; ++k) {
                if ((filled[k] >> j & 1) == 1) {
                    break;
                }
                ++r;
            }
            for (int k = j; k < m; ++k) {
                if ((filled[i] >> k & 1) == 1) {
                    break;
                }
                ++c;
            }
            int mx = Math.min(r, c);
            for (int w = 1; w <= mx; ++w) {
                for (int k = 0; k < w; ++k) {
                    filled[i + w - 1] |= 1 << (j + k);
                    filled[i + k] |= 1 << (j + w - 1);
                }
                dfs(i, j + w, t + 1);
            }
            for (int x = i; x < i + mx; ++x) {
                for (int y = j; y < j + mx; ++y) {
                    filled[x] ^= 1 << y;
                }
            }
        }
    }
}
```

### Python

```python
# Tiling a Rectangle with the Fewest Squares：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def tilingRectangle(self, n: int, m: int) -> int:
        def dfs(i: int, j: int, t: int):
            nonlocal ans
            if j == m:
                i += 1
                j = 0
            if i == n:
                ans = t
                return
            if filled[i] >> j & 1:
                dfs(i, j + 1, t)
            elif t + 1 < ans:
                r = c = 0
                for k in range(i, n):
                    if filled[k] >> j & 1:
                        break
                    r += 1
                for k in range(j, m):
                    if filled[i] >> k & 1:
                        break
                    c += 1
                mx = r if r < c else c
                for w in range(1, mx + 1):
                    for k in range(w):
                        filled[i + w - 1] |= 1 << (j + k)
                        filled[i + k] |= 1 << (j + w - 1)
                    dfs(i, j + w, t + 1)
                for x in range(i, i + mx):
                    for y in range(j, j + mx):
                        filled[x] ^= 1 << y

        ans = n * m
        filled = [0] * n
        dfs(0, 0, 0)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0474. Ones and Zeroes

---
编号: 474
题目: Ones and Zeroes
难度: 中等
标签: [数组, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/ones-and-zeroes/
---

## 题目描述

给你一个二进制字符串数组 `strs` 和两个整数 `m` 和 `n` 。

请你找出并返回 `strs` 的最大子集的长度，该子集中 **最多** 有 `m` 个 `0` 和 `n` 个 `1` 。

如果 `x` 的所有元素也是 `y` 的元素，集合 `x` 是集合 `y` 的 **子集** 。

**示例 1：**

```text
输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
输出：4
解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
```

**示例 2：**

```text
输入：strs = ["10", "0", "1"], m = 1, n = 1
输出：2
解释：最大的子集是 {"0", "1"} ，所以答案是 2 。
```

**提示：**

- `1 <= strs.length <= 600`

- `1 <= strs[i].length <= 100`

- `strs[i]` 仅由 `'0'` 和 `'1'` 组成

- `1 <= m, n <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j][k]$ 表示在前 $i$ 个字符串中，使用 $j$ 个 0 和 $k$ 个 1 的情况下最多可以得到的字符串数量。初始时 $f[i][j][k]=0$，答案为 $f[sz][m][n]$，其中 $sz$ 是数组 $strs$ 的长度。

对于 $f[i][j][k]$，我们有两种决策：

- 不选第 $i$ 个字符串，此时 $f[i][j][k]=f[i-1][j][k]$；
- 选第 $i$ 个字符串，此时 $f[i][j][k]=f[i-1][j-a][k-b]+1$，其中 $a$ 和 $b$ 分别是第 $i$ 个字符串中 $0$ 和 $1$ 的数量。

我们取两种决策中的最大值，即可得到 $f[i][j][k]$ 的值。

最终的答案即为 $f[sz][m][n]$。

时间复杂度 $O(sz \times m \times n)$，空间复杂度 $O(sz \times m \times n)$。其中 $sz$ 是数组 $strs$ 的长度；而 $m$ 和 $n$ 分别是字符串中 $0$ 和 $1$ 的数量上限。

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
// Ones and Zeroes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMaxForm(strs []string, m int, n int) int {
	sz := len(strs)
	f := make([][][]int, sz+1)
	for i := range f {
		f[i] = make([][]int, m+1)
		for j := range f[i] {
			f[i][j] = make([]int, n+1)
		}
	}
	for i := 1; i <= sz; i++ {
		a, b := count(strs[i-1])
		for j := 0; j <= m; j++ {
			for k := 0; k <= n; k++ {
				f[i][j][k] = f[i-1][j][k]
				if j >= a && k >= b {
					f[i][j][k] = max(f[i][j][k], f[i-1][j-a][k-b]+1)
				}
			}
		}
	}
	return f[sz][m][n]
}

func count(s string) (int, int) {
	a := strings.Count(s, "0")
	return a, len(s) - a
}
```

### Java

```java
// Ones and Zeroes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        int sz = strs.length;
        int[][][] f = new int[sz + 1][m + 1][n + 1];
        for (int i = 1; i <= sz; ++i) {
            int[] cnt = count(strs[i - 1]);
            for (int j = 0; j <= m; ++j) {
                for (int k = 0; k <= n; ++k) {
                    f[i][j][k] = f[i - 1][j][k];
                    if (j >= cnt[0] && k >= cnt[1]) {
                        f[i][j][k] = Math.max(f[i][j][k], f[i - 1][j - cnt[0]][k - cnt[1]] + 1);
                    }
                }
            }
        }
        return f[sz][m][n];
    }

    private int[] count(String s) {
        int[] cnt = new int[2];
        for (int i = 0; i < s.length(); ++i) {
            ++cnt[s.charAt(i) - '0'];
        }
        return cnt;
    }
}
```

### Python

```python
# Ones and Zeroes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMaxForm(self, strs: List[str], m: int, n: int) -> int:
        sz = len(strs)
        f = [[[0] * (n + 1) for _ in range(m + 1)] for _ in range(sz + 1)]
        for i, s in enumerate(strs, 1):
            a, b = s.count("0"), s.count("1")
            for j in range(m + 1):
                for k in range(n + 1):
                    f[i][j][k] = f[i - 1][j][k]
                    if j >= a and k >= b:
                        f[i][j][k] = max(f[i][j][k], f[i - 1][j - a][k - b] + 1)
        return f[sz][m][n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

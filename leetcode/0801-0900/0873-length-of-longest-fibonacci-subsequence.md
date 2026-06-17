# 0873. Length of Longest Fibonacci Subsequence

---
编号: 873
题目: Length of Longest Fibonacci Subsequence
难度: 中等
标签: [数组, 哈希表, 动态规划]
来源链接: https://leetcode.com/problems/length-of-longest-fibonacci-subsequence/
---

## 题目描述

如果序列 `x1, x2, ..., xn` 满足下列条件，就说它是 *斐波那契式 *的：

- `n >= 3`

- 对于所有 `i + 2 i + xi+1 == xi+2`

给定一个 **严格递增 **的正整数数组形成序列 `arr` ，找到 `arr` 中最长的斐波那契式的子序列的长度。如果不存在，返回  `0` 。

**子序列** 是通过从另一个序列 `arr` 中删除任意数量的元素（包括删除 0 个元素）得到的，同时不改变剩余元素顺序。例如，`[3, 5, 8]` 是 `[3, 4, 5, 6, 7, 8]` 的子序列。

**示例 1：**

```text
输入: arr = [1,2,3,4,5,6,7,8]
输出: 5
解释: 最长的斐波那契式子序列为 [1,2,3,5,8] 。
```

**示例 2：**

```text
输入: arr = [1,3,7,11,12,14,18]
输出: 3
解释: 最长的斐波那契式子序列有 [1,11,12]、[3,11,14] 以及 [7,11,18] 。
```

**提示：**

- `3 <= arr.length <= 1000`

	-

`1 <= arr[i] < arr[i + 1] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示以 $\textit{arr}[i]$ 作为最后一个元素，以 $\textit{arr}[j]$ 作为倒数第二个元素的最长斐波那契子序列的长度。初始时，对于任意的 $i \in [0, n)$ 和 $j \in [0, i)$，都有 $f[i][j] = 2$。其余的元素都是 $0$。

我们用一个哈希表 $d$ 记录数组 $\textit{arr}$ 中每个元素对应的下标。

然后，我们可以枚举 $\textit{arr}[i]$ 和 $\textit{arr}[j]$，其中 $i \in [2, n)$ 且 $j \in [1, i)$。假设当前枚举到的元素是 $\textit{arr}[i]$ 和 $\textit{arr}[j]$，我们可以得到 $\textit{arr}[i] - \textit{arr}[j]$，记作 $t$。如果 $t$ 在数组 $\textit{arr}$ 中，且 $t$ 的下标 $k$ 满足 $k < j$，那么我们可以得到一个以 $\textit{arr}[j]$ 和 $\textit{arr}[i]$ 作为最后两个元素的斐波那契子序列，其长度为 $f[i][j] = \max(f[i][j], f[j][k] + 1)$。我们可以用这种方法不断更新 $f[i][j]$ 的值，然后更新答案。

枚举结束后，返回答案即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 是数组 $\textit{arr}$ 的长度。

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
// Length of Longest Fibonacci Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func lenLongestFibSubseq(arr []int) (ans int) {
	n := len(arr)
	f := make([][]int, n)
	for i := range f {
		f[i] = make([]int, n)
	}

	d := make(map[int]int)
	for i, x := range arr {
		d[x] = i
		for j := 0; j < i; j++ {
			f[i][j] = 2
		}
	}

	for i := 2; i < n; i++ {
		for j := 1; j < i; j++ {
			t := arr[i] - arr[j]
			if k, ok := d[t]; ok && k < j {
				f[i][j] = max(f[i][j], f[j][k]+1)
				ans = max(ans, f[i][j])
			}
		}
	}

	return
}
```

### Java

```java
// Length of Longest Fibonacci Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int lenLongestFibSubseq(int[] arr) {
        int n = arr.length;
        int[][] f = new int[n][n];
        Map<Integer, Integer> d = new HashMap<>();
        for (int i = 0; i < n; ++i) {
            d.put(arr[i], i);
            for (int j = 0; j < i; ++j) {
                f[i][j] = 2;
            }
        }
        int ans = 0;
        for (int i = 2; i < n; ++i) {
            for (int j = 1; j < i; ++j) {
                int t = arr[i] - arr[j];
                Integer k = d.get(t);
                if (k != null && k < j) {
                    f[i][j] = Math.max(f[i][j], f[j][k] + 1);
                    ans = Math.max(ans, f[i][j]);
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Length of Longest Fibonacci Subsequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def lenLongestFibSubseq(self, arr: List[int]) -> int:
        n = len(arr)
        f = [[0] * n for _ in range(n)]
        d = {x: i for i, x in enumerate(arr)}
        for i in range(n):
            for j in range(i):
                f[i][j] = 2
        ans = 0
        for i in range(2, n):
            for j in range(1, i):
                t = arr[i] - arr[j]
                if t in d and (k := d[t]) < j:
                    f[i][j] = max(f[i][j], f[j][k] + 1)
                    ans = max(ans, f[i][j])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

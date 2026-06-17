# 1310. XOR Queries of a Subarray

---
编号: 1310
题目: XOR Queries of a Subarray
难度: 中等
标签: [位运算, 数组, 前缀和]
来源链接: https://leetcode.com/problems/xor-queries-of-a-subarray/
---

## 题目描述

有一个正整数数组 `arr`，现给你一个对应的查询数组 `queries`，其中 `queries[i] = [Li, Ri]`。

对于每个查询 `i`，请你计算从 `Li` 到 `Ri` 的 **XOR** 值（即 `arr[Li] **xor** arr[Li+1] **xor** ... **xor** arr[Ri]`）作为本次查询的结果。

并返回一个包含给定查询 `queries` 所有结果的数组。

**示例 1：**

```text
输入：arr = [1,3,4,8], queries = [[0,1],[1,2],[0,3],[3,3]]
输出：[2,7,14,8]
解释：
数组中元素的二进制表示形式是：
1 = 0001
3 = 0011
4 = 0100
8 = 1000
查询的 XOR 值为：
[0,1] = 1 xor 3 = 2
[1,2] = 3 xor 4 = 7
[0,3] = 1 xor 3 xor 4 xor 8 = 14
[3,3] = 8
```

**示例 2：**

```text
输入：arr = [4,8,2,10], queries = [[2,3],[1,3],[0,0],[0,3]]
输出：[8,0,4,4]
```

**提示：**

- `1 <= arr.length <= 3 * 10^4`

- `1 <= arr[i] <= 10^9`

- `1 <= queries.length <= 3 * 10^4`

- `queries[i].length == 2`

- `0 <= queries[i][0] <= queries[i][1] < arr.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个长度为 $n+1$ 的前缀异或数组 $s$ 来存储数组 $\textit{arr}$ 的前缀异或结果，其中 $s[i] = s[i-1] \oplus \textit{arr}[i-1]$，即 $s[i]$ 表示 $\textit{arr}$ 的前 $i$ 个元素的异或结果。

那么对于一个查询 $[l,r]$，我们可以得到：


\begin{aligned}
\textit{arr}[l] \oplus \textit{arr}[l+1] \oplus \cdots \oplus \textit{arr}[r] &= (\textit{arr}[0] \oplus \textit{arr}[1] \oplus \cdots \oplus \textit{arr}[l-1]) \oplus (\textit{arr}[0] \oplus \textit{arr}[1] \oplus \cdots \oplus \textit{arr}[r]) \\
&= s[l] \oplus s[r+1]
\end{aligned}


时间复杂度 $O(n+m)$，空间复杂度 $O(n)$。其中 $n$ 和 $m$ 分别是数组 $\textit{arr}$ 的长度和查询数组 $\textit{queries}$ 的长度。

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
// XOR Queries of a Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func xorQueries(arr []int, queries [][]int) (ans []int) {
	n := len(arr)
	s := make([]int, n+1)
	for i, x := range arr {
		s[i+1] = s[i] ^ x
	}
	for _, q := range queries {
		l, r := q[0], q[1]
		ans = append(ans, s[r+1]^s[l])
	}
	return
}
```

### Java

```java
// XOR Queries of a Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] xorQueries(int[] arr, int[][] queries) {
        int n = arr.length;
        int[] s = new int[n + 1];
        for (int i = 1; i <= n; ++i) {
            s[i] = s[i - 1] ^ arr[i - 1];
        }
        int m = queries.length;
        int[] ans = new int[m];
        for (int i = 0; i < m; ++i) {
            int l = queries[i][0], r = queries[i][1];
            ans[i] = s[r + 1] ^ s[l];
        }
        return ans;
    }
}
```

### Python

```python
# XOR Queries of a Subarray：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def xorQueries(self, arr: List[int], queries: List[List[int]]) -> List[int]:
        s = list(accumulate(arr, xor, initial=0))
        return [s[r + 1] ^ s[l] for l, r in queries]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0668. Kth Smallest Number in Multiplication Table

---
编号: 668
题目: Kth Smallest Number in Multiplication Table
难度: 困难
标签: [数学, 二分查找]
来源链接: https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/
---

## 题目描述

几乎每一个人都用 乘法表。但是你能在乘法表中快速找到第 `k` 小的数字吗？

乘法表是大小为 `m x n` 的一个整数矩阵，其中 `mat[i][j] == i * j`（下标从 **1** 开始）。

给你三个整数 `m`、`n` 和 `k`，请你在大小为 `m x n` 的乘法表中，找出并返回第 `k` 小的数字。

**示例 1：**

```text
输入：m = 3, n = 3, k = 5
输出：3
解释：第 5 小的数字是 3 。
```

**示例 2：**

```text
输入：m = 2, n = 3, k = 6
输出：6
解释：第 6 小的数字是 6 。
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目可以转换为，求有多少个数不超过 x。对于每一行 i，所有数都是 i 的倍数，不超过 x 的个数有 `x / i` 个。

二分枚举 x，累加每一行不超过 x 的个数，得到 cnt。找到 `cnt >= k` 的最小 x。

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
// Kth Smallest Number in Multiplication Table：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findKthNumber(m int, n int, k int) int {
	left, right := 1, m*n
	for left < right {
		mid := (left + right) >> 1
		cnt := 0
		for i := 1; i <= m; i++ {
			cnt += min(mid/i, n)
		}
		if cnt >= k {
			right = mid
		} else {
			left = mid + 1
		}
	}
	return left
}
```

### Java

```java
// Kth Smallest Number in Multiplication Table：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findKthNumber(int m, int n, int k) {
        int left = 1, right = m * n;
        while (left < right) {
            int mid = (left + right) >>> 1;
            int cnt = 0;
            for (int i = 1; i <= m; ++i) {
                cnt += Math.min(mid / i, n);
            }
            if (cnt >= k) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```

### Python

```python
# Kth Smallest Number in Multiplication Table：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findKthNumber(self, m: int, n: int, k: int) -> int:
        left, right = 1, m * n
        while left < right:
            mid = (left + right) >> 1
            cnt = 0
            for i in range(1, m + 1):
                cnt += min(mid // i, n)
            if cnt >= k:
                right = mid
            else:
                left = mid + 1
        return left
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

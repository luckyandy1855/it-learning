# 0805. Split Array With Same Average

---
编号: 805
题目: Split Array With Same Average
难度: 困难
标签: [位运算, 数组, 哈希表, 数学, 动态规划, 位掩码]
来源链接: https://leetcode.com/problems/split-array-with-same-average/
---

## 题目描述

给定你一个整数数组 `nums`

我们要将 `nums` 数组中的每个元素移动到 `A` 数组 或者 `B` 数组中，使得 `A` 数组和 `B` 数组不为空，并且 `average(A) == average(B)` 。

如果可以完成则返回`true` ， 否则返回 `false`  。

**注意：**对于数组 `arr` ,  `average(arr)` 是 `arr` 的所有元素的和除以 `arr` 长度。

**示例 1:**

```text
输入: nums = [1,2,3,4,5,6,7,8]
输出: true
解释: 我们可以将数组分割为 [1,4,5,8] 和 [2,3,6,7], 他们的平均值都是4.5。
```

**示例 2:**

```text
输入: nums = [3,1]
输出: false
```

**提示:**

- `1 <= nums.length <= 30`

- `0 <= nums[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 哈希表, 数学, 动态规划, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目要求，要判断是否可以将数组 $\textit{nums}$ 划分为两个子数组 $A$ 和 $B$，使得两个子数组的平均值相等。

我们记数组 $\textit{nums}$ 的和为 $s$，元素个数为 $n$。子数组 $A$ 的和以及个数分别为 $s_1$ 和 $k$，那么子数组 $B$ 的和为 $s_2 = s - s_1$，个数为 $n - k$，即：


\frac{s_1}{k} = \frac{s_2}{n - k} = \frac{s-s_1}{n-k}


整理可得：


s_1 \times (n-k) = (s-s_1) \times k


化简可得：


\frac{s_1}{k} = \frac{s}{n}


也就是说，要我们找出一个子数组 $A$，使得其平均值等于数组 $\textit{nums}$ 的平均值。我们考虑将数组 $\textit{nums}$ 每个元素都减去数组 $\textit{nums}$ 的平均值，这样问题就转化为了在数组 $\textit{nums}$ 中找出一个子数组，使得其和为 $0$。

但是，数组 $\textit{nums}$ 的平均值可能不是整数，浮点数计算可能存在精度问题，我们不妨将数组 $\textit{nums}$ 中的每个元素都乘以 $n$，即 $nums[i] \leftarrow nums[i] \times n$，上述式子就变成：


\frac{s_1\times n}{k} = s


此时我们将数组 $\textit{nums}$ 中每个元素都减去整数 $s$，题目就转化为：在数组 $nums$ 中找出一个子数组 $A$，使得其和为 $0$。

数组 $\textit{nums}$ 的长度范围为 $[1, 30]$，如果我们使用暴力枚举子数组的方法，时间复杂度为 $O(2^n)$，会超时。我们可以使用折半查找的方法，将时间复杂度降低到 $O(2^{n/2})$。

我们将数组 $\textit{nums}$ 分成左右两部分，那么子数组 $A$ 可能存在三种情况：

1. 子数组 $A$ 完全在数组 $\textit{nums}$ 的左半部分；
2. 子数组 $A$ 完全在数组 $\textit{nums}$ 的右半部分；
3. 子数组 $A$ 一部分在数组 $\textit{nums}$ 的左半部分，一部分在数组 $\textit{nums}$ 的右半部分。

我们可以使用二进制枚举的方法，先枚举左半部分所有子数组的和，如果存在一个子数组和为 $0$，直接返回 `true`，否则我们将其存入哈希表 $\textit{vis}$ 中；然后枚举右半部分所有子数组的和，如果存在一个子数组和为 $0$，直接返回 `true`，否则我们判断此时哈希表 $\textit{vis}$ 中是否存在该和的相反数，如果存在，直接返回 `true`。

需要注意的是，我们不能同时全选左半部分和右半部分，因为这样会导致子数组 $B$ 为空，这是不符合题意的。在实现上，我们只需要考虑数组的 $n-1$ 个数。

时间复杂度 $O(n\times 2^{\frac{n}{2}})$，空间复杂度 $O(2^{\frac{n}{2}})$。

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
// Split Array With Same Average：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func splitArraySameAverage(nums []int) bool {
	n := len(nums)
	if n == 1 {
		return false
	}
	s := 0
	for _, v := range nums {
		s += v
	}
	for i, v := range nums {
		nums[i] = v*n - s
	}
	m := n >> 1
	vis := map[int]bool{}
	for i := 1; i < 1<<m; i++ {
		t := 0
		for j, v := range nums[:m] {
			if (i >> j & 1) == 1 {
				t += v
			}
		}
		if t == 0 {
			return true
		}
		vis[t] = true
	}
	for i := 1; i < 1<<(n-m); i++ {
		t := 0
		for j, v := range nums[m:] {
			if (i >> j & 1) == 1 {
				t += v
			}
		}
		if t == 0 || (i != (1<<(n-m))-1 && vis[-t]) {
			return true
		}
	}
	return false
}
```

### Java

```java
// Split Array With Same Average：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean splitArraySameAverage(int[] nums) {
        int n = nums.length;
        if (n == 1) {
            return false;
        }
        int s = Arrays.stream(nums).sum();
        for (int i = 0; i < n; ++i) {
            nums[i] = nums[i] * n - s;
        }
        int m = n >> 1;
        Set<Integer> vis = new HashSet<>();
        for (int i = 1; i < 1 << m; ++i) {
            int t = 0;
            for (int j = 0; j < m; ++j) {
                if (((i >> j) & 1) == 1) {
                    t += nums[j];
                }
            }
            if (t == 0) {
                return true;
            }
            vis.add(t);
        }
        for (int i = 1; i < 1 << (n - m); ++i) {
            int t = 0;
            for (int j = 0; j < (n - m); ++j) {
                if (((i >> j) & 1) == 1) {
                    t += nums[m + j];
                }
            }
            if (t == 0 || (i != (1 << (n - m)) - 1) && vis.contains(-t)) {
                return true;
            }
        }
        return false;
    }
}
```

### Python

```python
# Split Array With Same Average：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def splitArraySameAverage(self, nums: List[int]) -> bool:
        n = len(nums)
        if n == 1:
            return False
        s = sum(nums)
        for i, v in enumerate(nums):
            nums[i] = v * n - s
        m = n >> 1
        vis = set()
        for i in range(1, 1 << m):
            t = sum(v for j, v in enumerate(nums[:m]) if i >> j & 1)
            if t == 0:
                return True
            vis.add(t)
        for i in range(1, 1 << (n - m)):
            t = sum(v for j, v in enumerate(nums[m:]) if i >> j & 1)
            if t == 0 or (i != (1 << (n - m)) - 1 and -t in vis):
                return True
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

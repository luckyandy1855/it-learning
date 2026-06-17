# 1262. Greatest Sum Divisible by Three

---
编号: 1262
题目: Greatest Sum Divisible by Three
难度: 中等
标签: [贪心, 数组, 动态规划, 排序]
来源链接: https://leetcode.com/problems/greatest-sum-divisible-by-three/
---

## 题目描述

给你一个整数数组 `nums`，请你找出并返回能被三整除的元素 **最大和**。

示例 1：

```text
输入：nums = [3,6,5,1,8]
输出：18
解释：选出数字 3, 6, 1 和 8，它们的和是 18（可被 3 整除的最大和）。
```

示例 2：

```text
输入：nums = [4]
输出：0
解释：4 不能被 3 整除，所以无法选出数字，返回 0。
```

示例 3：

```text
输入：nums = [1,2,3,4,4]
输出：12
解释：选出数字 1, 3, 4 以及 4，它们的和是 12（可被 3 整除的最大和）。
```

**提示：**

- `1 <= nums.length <= 4 * 10^4`

- `1 <= nums[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 动态规划, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示前 $i$ 个数中选取若干个数，使得这若干个数的和模 $3$ 余 $j$ 的最大值。初始时 $f[0][0]=0$，其余为 $-\infty$。

对于 $f[i][j]$，我们可以考虑第 $i$ 个数 $x$ 的状态：

- 如果我们不选 $x$，那么 $f[i][j]=f[i-1][j]$；
- 如果我们选 $x$，那么 $f[i][j]=f[i-1][(j-x \bmod 3 + 3)\bmod 3]+x$。

因此我们可以得到状态转移方程：


f[i][j]=\max\{f[i-1][j],f[i-1][(j-x \bmod 3 + 3)\bmod 3]+x\}


最终答案为 $f[n][0]$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $nums$ 的长度。

注意到 $f[i][j]$ 的值只与 $f[i-1][j]$ 和 $f[i-1][(j-x \bmod 3 + 3)\bmod 3]$ 有关，因此我们可以使用滚动数组优化空间复杂度，使空间复杂度降低为 $O(1)$。

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
// Greatest Sum Divisible by Three：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSumDivThree(nums []int) int {
	n := len(nums)
	const inf = 1 << 30
	f := make([][3]int, n+1)
	f[0] = [3]int{0, -inf, -inf}
	for i, x := range nums {
		i++
		for j := 0; j < 3; j++ {
			f[i][j] = max(f[i-1][j], f[i-1][(j-x%3+3)%3]+x)
		}
	}
	return f[n][0]
}
```

### Java

```java
// Greatest Sum Divisible by Three：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxSumDivThree(int[] nums) {
        int n = nums.length;
        final int inf = 1 << 30;
        int[][] f = new int[n + 1][3];
        f[0][1] = f[0][2] = -inf;
        for (int i = 1; i <= n; ++i) {
            int x = nums[i - 1];
            for (int j = 0; j < 3; ++j) {
                f[i][j] = Math.max(f[i - 1][j], f[i - 1][(j - x % 3 + 3) % 3] + x);
            }
        }
        return f[n][0];
    }
}
```

### Python

```python
# Greatest Sum Divisible by Three：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSumDivThree(self, nums: List[int]) -> int:
        n = len(nums)
        f = [[-inf] * 3 for _ in range(n + 1)]
        f[0][0] = 0
        for i, x in enumerate(nums, 1):
            for j in range(3):
                f[i][j] = max(f[i - 1][j], f[i - 1][(j - x) % 3] + x)
        return f[n][0]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0996. Number of Squareful Arrays

---
编号: 996
题目: Number of Squareful Arrays
难度: 困难
标签: [位运算, 数组, 哈希表, 数学, 动态规划, 回溯, 位掩码]
来源链接: https://leetcode.com/problems/number-of-squareful-arrays/
---

## 题目描述

如果一个数组的任意两个相邻元素之和都是 **完全平方数 **，则该数组称为 **平方数组 **。

给定一个整数数组 `nums`，返回所有属于 **平方数组 **的 `nums` 的排列数量。

如果存在某个索引 `i` 使得 `perm1[i] != perm2[i]`，则认为两个排列 `perm1` 和 `perm2` 不同。

示例 1：

```text
输入：nums = [1,17,8]
输出：2
解释：[1,8,17] 和 [17,8,1] 是有效的排列。
```

示例 2：

```text
输入：nums = [2,2,2]
输出：1
```

**提示：**

- `1 <= nums.length <= 12`

- `0 <= nums[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 哈希表, 数学, 动态规划, 回溯, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

注意到，数组 $nums$ 的长度 $n$ 不超过 $12$，因此我们可以用一个二进制数表示当前所选的数字的状态，若第 $i$ 位为 $1$，则表示当前选择了第 $i$ 个数字，否则表示当前没有选择第 $i$ 个数字。

我们定义 $f[i][j]$ 表示当前所选的数字的状态为 $i$，且最后一个数字为 $nums[j]$ 的方案数。那么答案就是 $\sum_{j=0}^{n-1} f[2^n-1][j]$。由于最后求解的是排列数，因此还需要除以每个数字出现的次数的阶乘。

接下来，我们考虑如何进行状态转移。

假设当前所选的数字的状态为 $i$，最后一个数字为 $nums[j]$，那么我们可以枚举 $i$ 的每一位为 $1$ 的数字作为倒数第二个数，不妨设为 $nums[k]$，那么我们只需要判断 $nums[j]+nums[k]$ 是否为完全平方数即可，若是，方案数 $f[i][j]$ 就可以加上 $f[i \oplus 2^j][k]$，其中 $i \oplus 2^j$ 表示将 $i$ 的第 $j$ 位取反，即表示将 $nums[j]$ 从当前所选的数字中去除。

最后，我们还需要除以每个数字出现的次数的阶乘，因为我们在枚举 $i$ 的每一位为 $1$ 的数字时，可能会重复计算某些排列，因此需要除以每个数字出现的次数的阶乘。

时间复杂度 $O(2^n \times n^2)，空间复杂度 O(2^n \times n)$。其中 $n$ 为数组 $nums$ 的长度。

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
// Number of Squareful Arrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numSquarefulPerms(nums []int) (ans int) {
	n := len(nums)
	f := make([][]int, 1<<n)
	for i := range f {
		f[i] = make([]int, n)
	}
	for j := range nums {
		f[1<<j][j] = 1
	}
	for i := 0; i < 1<<n; i++ {
		for j := 0; j < n; j++ {
			if i>>j&1 == 1 {
				for k := 0; k < n; k++ {
					if i>>k&1 == 1 && k != j {
						s := nums[j] + nums[k]
						t := int(math.Sqrt(float64(s)))
						if t*t == s {
							f[i][j] += f[i^(1<<j)][k]
						}
					}
				}
			}
		}
	}
	for j := 0; j < n; j++ {
		ans += f[(1<<n)-1][j]
	}
	g := [13]int{1}
	for i := 1; i < 13; i++ {
		g[i] = g[i-1] * i
	}
	cnt := map[int]int{}
	for _, x := range nums {
		cnt[x]++
	}
	for _, v := range cnt {
		ans /= g[v]
	}
	return
}
```

### Java

```java
// Number of Squareful Arrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numSquarefulPerms(int[] nums) {
        int n = nums.length;
        int[][] f = new int[1 << n][n];
        for (int j = 0; j < n; ++j) {
            f[1 << j][j] = 1;
        }
        for (int i = 0; i < 1 << n; ++i) {
            for (int j = 0; j < n; ++j) {
                if ((i >> j & 1) == 1) {
                    for (int k = 0; k < n; ++k) {
                        if ((i >> k & 1) == 1 && k != j) {
                            int s = nums[j] + nums[k];
                            int t = (int) Math.sqrt(s);
                            if (t * t == s) {
                                f[i][j] += f[i ^ (1 << j)][k];
                            }
                        }
                    }
                }
            }
        }
        long ans = 0;
        for (int j = 0; j < n; ++j) {
            ans += f[(1 << n) - 1][j];
        }
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) {
            cnt.merge(x, 1, Integer::sum);
        }
        int[] g = new int[13];
        g[0] = 1;
        for (int i = 1; i < 13; ++i) {
            g[i] = g[i - 1] * i;
        }
        for (int v : cnt.values()) {
            ans /= g[v];
        }
        return (int) ans;
    }
}
```

### Python

```python
# Number of Squareful Arrays：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numSquarefulPerms(self, nums: List[int]) -> int:
        n = len(nums)
        f = [[0] * n for _ in range(1 << n)]
        for j in range(n):
            f[1 << j][j] = 1
        for i in range(1 << n):
            for j in range(n):
                if i >> j & 1:
                    for k in range(n):
                        if (i >> k & 1) and k != j:
                            s = nums[j] + nums[k]
                            t = int(sqrt(s))
                            if t * t == s:
                                f[i][j] += f[i ^ (1 << j)][k]

        ans = sum(f[(1 << n) - 1][j] for j in range(n))
        for v in Counter(nums).values():
            ans //= factorial(v)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

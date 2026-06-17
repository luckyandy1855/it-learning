# 0357. Count Numbers with Unique Digits

---
编号: 357
题目: Count Numbers with Unique Digits
难度: 中等
标签: [数学, 动态规划, 回溯]
来源链接: https://leetcode.com/problems/count-numbers-with-unique-digits/
---

## 题目描述

给你一个整数 `n` ，统计并返回各位数字都不同的数字 `x` 的个数，其中 `0

**示例 1：**

```text
输入：n = 2
输出：91
解释：答案应为除去 11、22、33、44、55、66、77、88、99 外，在 0 ≤ x < 100 范围内的所有数字。
```

**示例 2：**

```text
输入：n = 0
输出：1
```

**提示：**

	- `0 <= n <= 8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 动态规划, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

这道题实际上是求在给定区间 $[l,..r]$ 中，满足条件的数的个数。条件与数的大小无关，而只与数的组成有关，因此可以使用数位 DP 的思想求解。数位 DP 中，数的大小对复杂度的影响很小。

对于区间 $[l,..r]$ 问题，我们一般会将其转化为 $[1,..r]$ 然后再减去 $[1,..l - 1]$ 的问题，即：


ans = \sum_{i=1}^{r} ans_i -  \sum_{i=1}^{l-1} ans_i


不过对于本题而言，我们只需要求出区间 $[1,..10^n-1]$ 的值即可。

这里我们用记忆化搜索来实现数位 DP。从起点向下搜索，到最底层得到方案数，一层层向上返回答案并累加，最后从搜索起点得到最终的答案。

我们根据题目信息，设计一个函数 $\textit{dfs}(i, \textit{mask}, \textit{lead})$，其中：

- 数字 $i$ 表示当前搜索到的位置，我们从高位开始搜索，即 $i = 0$ 表示最高位。
- 数字 $\textit{mask}$ 表示当前数字的状态，即 $\textit{mask}$ 的第 $j$ 位为 $1$ 表示数字 $j$ 已经被使用过。
- 布尔值 $\textit{lead}$ 表示当前是否只包含前导 $0$。

函数的执行过程如下：

如果 $i$ 超过了数字 $n$ 的长度，即 $i \lt 0$，说明搜索结束，直接返回 $1$。

否则，我们从 $0$ 到 $9$ 枚举位置 $i$ 的数字 $j$，对于每一个 $j$：

- 如果 $\textit{mask}$ 的第 $j$ 位为 $1$，说明数字 $j$ 已经被使用过，直接跳过。
- 如果 $\textit{lead}$ 为真且 $j = 0$，说明当前数字只包含前导 $0$，递归到下一层时，此时 $\textit{lead}$ 仍为真。
- 否则，我们递归到下一层，更新 $\textit{mask}$ 的第 $j$ 位为 $1$，并将 $\textit{lead}$ 更新为假。

最后，我们将所有递归到下一层的结果累加，即为答案。

答案为 $\textit{dfs}(n - 1, 0, \textit{True})$。

关于函数的实现细节，可以参考下面的代码。

时间复杂度 $O(n \times 2^D \times D)$，空间复杂度 $O(n \times 2^D)$。其中 $n$ 为数字 $n$ 的长度，而 $D = 10$。

相似题目：

- [233. 数字 1 的个数](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0233.Number%20of%20Digit%20One/README.md)
- [600. 不含连续 1 的非负整数](https://github.com/doocs/leetcode/blob/main/solution/0600-0699/0600.Non-negative%20Integers%20without%20Consecutive%20Ones/README.md)
- [788. 旋转数字](https://github.com/doocs/leetcode/blob/main/solution/0700-0799/0788.Rotated%20Digits/README.md)
- [902. 最大为 N 的数字组合](https://github.com/doocs/leetcode/blob/main/solution/0900-0999/0902.Numbers%20At%20Most%20N%20Given%20Digit%20Set/README.md)
- [1012. 至少有 1 位重复的数字](https://github.com/doocs/leetcode/blob/main/solution/1000-1099/1012.Numbers%20With%20Repeated%20Digits/README.md)
- [2376. 统计特殊整数](https://github.com/doocs/leetcode/blob/main/solution/2300-2399/2376.Count%20Special%20Integers/README.md)

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
// Count Numbers with Unique Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countNumbersWithUniqueDigits(n int) int {
	f := make([][1 << 10]int, n)
	for i := range f {
		for j := range f[i] {
			f[i][j] = -1
		}
	}
	var dfs func(i, mask int, lead bool) int
	dfs = func(i, mask int, lead bool) int {
		if i < 0 {
			return 1
		}
		if !lead && f[i][mask] != -1 {
			return f[i][mask]
		}
		ans := 0
		for j := 0; j < 10; j++ {
			if mask>>j&1 == 1 {
				continue
			}
			if lead && j == 0 {
				ans += dfs(i-1, mask, true)
			} else {
				ans += dfs(i-1, mask|1<<j, false)
			}
		}
		if !lead {
			f[i][mask] = ans
		}
		return ans
	}
	return dfs(n-1, 0, true)
}
```

### Java

```java
// Count Numbers with Unique Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[][] f;

    public int countNumbersWithUniqueDigits(int n) {
        f = new Integer[n][1 << 10];
        return dfs(n - 1, 0, true);
    }

    private int dfs(int i, int mask, boolean lead) {
        if (i < 0) {
            return 1;
        }
        if (!lead && f[i][mask] != null) {
            return f[i][mask];
        }
        int ans = 0;
        for (int j = 0; j <= 9; ++j) {
            if ((mask >> j & 1) == 1) {
                continue;
            }
            if (lead && j == 0) {
                ans += dfs(i - 1, mask, true);
            } else {
                ans += dfs(i - 1, mask | 1 << j, false);
            }
        }
        if (!lead) {
            f[i][mask] = ans;
        }
        return ans;
    }
}
```

### Python

```python
# Count Numbers with Unique Digits：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countNumbersWithUniqueDigits(self, n: int) -> int:
        @cache
        def dfs(i: int, mask: int, lead: bool) -> int:
            if i < 0:
                return 1
            ans = 0
            for j in range(10):
                if mask >> j & 1:
                    continue
                if lead and j == 0:
                    ans += dfs(i - 1, mask, True)
                else:
                    ans += dfs(i - 1, mask | 1 << j, False)
            return ans

        return dfs(n - 1, 0, True)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

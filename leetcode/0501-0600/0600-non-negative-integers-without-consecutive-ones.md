# 0600. Non-negative Integers without Consecutive Ones

---
编号: 600
题目: Non-negative Integers without Consecutive Ones
难度: 困难
标签: [动态规划]
来源链接: https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/
---

## 题目描述

给定一个正整数 `n` ，请你统计在 `[0, n]` 范围的非负整数中，有多少个整数的二进制表示中不存在 **连续的 1 **。

**示例 1:**

```text
输入: n = 5
输出: 5
解释:
下面列出范围在 [0, 5] 的非负整数与其对应的二进制表示：
0 : 0
1 : 1
2 : 10
3 : 11
4 : 100
5 : 101
其中，只有整数 3 违反规则（有两个连续的 1 ），其他 5 个满足规则。
```

**示例 2:**

```text
输入: n = 1
输出: 2
```

**示例 3:**

```text
输入: n = 2
输出: 3
```

**提示:**

- `1 <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

这道题实际上是求在给定区间 $[l,..r]$ 中，数字的二进制表示不包含连续的 $1$ 的个数。个数与数的位数以及每个二进制位上的数字有关。我们可以用数位 DP 的思路来解决这道题。数位 DP 中，数的大小对复杂度的影响很小。

对于区间 $[l,..r]$ 问题，我们一般会将其转化为 $[0,..r]$ 然后再减去 $[0,..l - 1]$ 的问题，即：


ans = \sum_{i=0}^{r} ans_i -  \sum_{i=0}^{l-1} ans_i


不过对于本题而言，我们只需要求出区间 $[0,..r]$ 的值即可。

这里我们用记忆化搜索来实现数位 DP。基本步骤如下：

我们首先获取数字 $n$ 的二进制长度，记为 $m$。然后根据题目信息，我们设计函数 $\textit{dfs}(i, \textit{pre}, \textit{limit})$，其中：

- 数字 $i$ 表示当前搜索到的位置，我们从数字的最高位开始搜索，即二进制字符串的首字符；
- 数字 $\textit{pre}$ 表示上一个数字二进制位上的数字，对于本题，$\textit{pre}$ 的初始值为 $0$；
- 布尔值 $\textit{limit}$ 表示可填的数字的限制，如果无限制，那么可以选择 $[0,1]$，否则，只能选择 $[0, \textit{up}]$。

函数的执行过程如下：

如果 $i$ 超过了数字 $n$ 的长度，即 $i \lt 0$，说明搜索结束，直接返回 $1$。否则，我们从 $0$ 到 $\textit{up}$ 枚举位置 $i$ 的数字 $j$，对于每一个 $j$：

- 如果 $\textit{pre}$ 和 $j$ 都为 $1$，说明有连续的 $1$，直接跳过；
- 否则，我们递归到下一层，更新 $\textit{pre}$ 为 $j$，并将 $\textit{limit}$ 更新为 $\textit{limit}$ 与 $j$ 是否等于 $\textit{up}$ 的逻辑与。

最后，我们将所有递归到下一层的结果累加，即为答案。

时间复杂度 $O(\log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为题目给定的正整数。

相似题目：

- [233. 数字 1 的个数](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0233.Number%20of%20Digit%20One/README.md)
- [357. 统计各位数字都不同的数字个数](https://github.com/doocs/leetcode/blob/main/solution/0300-0399/0357.Count%20Numbers%20with%20Unique%20Digits/README.md)
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
// Non-negative Integers without Consecutive Ones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findIntegers(n int) int {
	m := bits.Len(uint(n))
	f := make([][2]int, m)
	for i := range f {
		f[i] = [2]int{-1, -1}
	}
	var dfs func(i, pre int, limit bool) int
	dfs = func(i, pre int, limit bool) int {
		if i < 0 {
			return 1
		}
		if !limit && f[i][pre] != -1 {
			return f[i][pre]
		}
		up := 1
		if limit {
			up = n >> i & 1
		}
		ans := 0
		for j := 0; j <= up; j++ {
			if j == 1 && pre == 1 {
				continue
			}
			ans += dfs(i-1, j, limit && j == up)
		}
		if !limit {
			f[i][pre] = ans
		}
		return ans
	}
	return dfs(m-1, 0, true)
}
```

### Java

```java
// Non-negative Integers without Consecutive Ones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private Integer[][] f;

    public int findIntegers(int n) {
        this.n = n;
        int m = Integer.SIZE - Integer.numberOfLeadingZeros(n);
        f = new Integer[m][2];
        return dfs(m - 1, 0, true);
    }

    private int dfs(int i, int pre, boolean limit) {
        if (i < 0) {
            return 1;
        }
        if (!limit && f[i][pre] != null) {
            return f[i][pre];
        }
        int up = limit ? (n >> i & 1) : 1;
        int ans = 0;
        for (int j = 0; j <= up; ++j) {
            if (j == 1 && pre == 1) {
                continue;
            }
            ans += dfs(i - 1, j, limit && j == up);
        }
        if (!limit) {
            f[i][pre] = ans;
        }
        return ans;
    }
}
```

### Python

```python
# Non-negative Integers without Consecutive Ones：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findIntegers(self, n: int) -> int:
        @cache
        def dfs(i: int, pre: int, limit: bool) -> int:
            if i < 0:
                return 1
            up = (n >> i & 1) if limit else 1
            ans = 0
            for j in range(up + 1):
                if pre and j:
                    continue
                ans += dfs(i - 1, j, limit and j == up)
            return ans

        return dfs(n.bit_length() - 1, 0, True)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1067. Digit Count in Range

---
编号: 1067
题目: Digit Count in Range
难度: 困难
标签: [数学, 动态规划]
来源链接: https://leetcode.com/problems/digit-count-in-range/
---

## 题目描述

给定一个在 `0` 到 `9` 之间的整数 `d`，和两个正整数 `low` 和 `high` 分别作为上下界。返回 `d` 在 `low` 和 `high` 之间的整数中出现的次数，包括边界 `low` 和 `high`。

**示例 1：**

```text
输入：d = 1, low = 1, high = 13
输出：6
解释：
数字 d=1 在 1,10,11,12,13 中出现 6 次。注意 d=1 在数字 11 中出现两次。
```

**示例 2：**

```text
输入：d = 3, low = 100, high = 250
输出：35
解释：
数字 d=3 在 103,113,123,130,131,...,238,239,243 出现 35 次。
```

**提示：**

- `0

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

这道题实际上是求在给定区间 $[l,..r]$ 中，数字中出现 $d$ 的个数。个数与数的位数以及每一位上的数字有关。我们可以用数位 DP 的思路来解决这道题。数位 DP 中，数的大小对复杂度的影响很小。

对于区间 $[l,..r]$ 问题，我们一般会将其转化为 $[1,..r]$ 然后再减去 $[1,..l - 1]$ 的问题，即：


ans = \sum_{i=1}^{r} ans_i -  \sum_{i=1}^{l-1} ans_i


这里我们用记忆化搜索来实现数位 DP。从起点向下搜索，到最底层得到方案数，一层层向上返回答案并累加，最后从搜索起点得到最终的答案。

基本步骤如下：

1. 将数字 $n$ 转为 int 数组 $a$，其中 $a[1]$ 为最低位，而 $a[len]$ 为最高位；
1. 根据题目信息，设计函数 $dfs()$，对于本题，我们定义 $dfs(pos, cnt, lead, limit)$，答案为 $dfs(len, 0, true, true)$。

其中：

- `pos` 表示数字的位数，从末位或者第一位开始，一般根据题目的数字构造性质来选择顺序。对于本题，我们选择从高位开始，因此，`pos` 的初始值为 `len`；
- `cnt` 表示当前数字中包含 $d$ 的个数；
- `lead` 表示当前数字是否有前导零，如果有前导零，则 `lead` 为 `true`，否则为 `false`，初始化为 `true`；
- `limit` 表示可填的数字的限制，如果无限制，那么可以选择 $[0,1,..9]$，否则，只能选择 $[0,..a[pos]]$。如果 `limit` 为 `true` 且已经取到了能取到的最大值，那么下一个 `limit` 同样为 `true`；如果 `limit` 为 `true` 但是还没有取到最大值，或者 `limit` 为 `false`，那么下一个 `limit` 为 `false`。

关于函数的实现细节，可以参考下面的代码。

时间复杂度 $O(\log m + \log n)$。其中 $m$, $n$ 分别为题目中的 `low` 和 `high`。

相似题目：

- [233. 数字 1 的个数](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0233.Number%20of%20Digit%20One/README.md)

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
// Digit Count in Range：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func digitsCount(d int, low int, high int) int {
	f := func(n int) int {
		a := make([]int, 11)
		dp := make([][]int, 11)
		for i := range dp {
			dp[i] = make([]int, 11)
			for j := range dp[i] {
				dp[i][j] = -1
			}
		}
		l := 0
		for n > 0 {
			l++
			a[l] = n % 10
			n /= 10
		}

		var dfs func(int, int, bool, bool) int
		dfs = func(pos, cnt int, lead, limit bool) int {
			if pos <= 0 {
				return cnt
			}
			if !lead && !limit && dp[pos][cnt] != -1 {
				return dp[pos][cnt]
			}
			up := 9
			if limit {
				up = a[pos]
			}
			ans := 0
			for i := 0; i <= up; i++ {
				if i == 0 && lead {
					ans += dfs(pos-1, cnt, lead, limit && i == up)
				} else {
					t := cnt
					if d == i {
						t++
					}
					ans += dfs(pos-1, t, false, limit && i == up)
				}
			}
			if !lead && !limit {
				dp[pos][cnt] = ans
			}
			return ans
		}

		return dfs(l, 0, true, true)
	}
	return f(high) - f(low-1)
}
```

### Java

```java
// Digit Count in Range：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int d;
    private int[] a = new int[11];
    private int[][] dp = new int[11][11];

    public int digitsCount(int d, int low, int high) {
        this.d = d;
        return f(high) - f(low - 1);
    }

    private int f(int n) {
        for (var e : dp) {
            Arrays.fill(e, -1);
        }
        int len = 0;
        while (n > 0) {
            a[++len] = n % 10;
            n /= 10;
        }
        return dfs(len, 0, true, true);
    }

    private int dfs(int pos, int cnt, boolean lead, boolean limit) {
        if (pos <= 0) {
            return cnt;
        }
        if (!lead && !limit && dp[pos][cnt] != -1) {
            return dp[pos][cnt];
        }
        int up = limit ? a[pos] : 9;
        int ans = 0;
        for (int i = 0; i <= up; ++i) {
            if (i == 0 && lead) {
                ans += dfs(pos - 1, cnt, lead, limit && i == up);
            } else {
                ans += dfs(pos - 1, cnt + (i == d ? 1 : 0), false, limit && i == up);
            }
        }
        if (!lead && !limit) {
            dp[pos][cnt] = ans;
        }
        return ans;
    }
}
```

### Python

```python
# Digit Count in Range：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def digitsCount(self, d: int, low: int, high: int) -> int:
        return self.f(high, d) - self.f(low - 1, d)

    def f(self, n, d):
        @cache
        def dfs(pos, cnt, lead, limit):
            if pos <= 0:
                return cnt
            up = a[pos] if limit else 9
            ans = 0
            for i in range(up + 1):
                if i == 0 and lead:
                    ans += dfs(pos - 1, cnt, lead, limit and i == up)
                else:
                    ans += dfs(pos - 1, cnt + (i == d), False, limit and i == up)
            return ans

        a = [0] * 11
        l = 0
        while n:
            l += 1
            a[l] = n % 10
            n //= 10
        return dfs(l, 0, True, True)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1012. Numbers With Repeated Digits

---
编号: 1012
题目: Numbers With Repeated Digits
难度: 困难
标签: [数学, 动态规划]
来源链接: https://leetcode.com/problems/numbers-with-repeated-digits/
---

## 题目描述

给定正整数 `n`，返回在* *`[1, n]`* *范围内具有 **至少 1 位** 重复数字的正整数的个数。

**示例 1：**

```text
输入：n = 20
输出：1
解释：具有至少 1 位重复数字的正数（<= 20）只有 11 。
```

**示例 2：**

```text
输入：n = 100
输出：10
解释：具有至少 1 位重复数字的正数（<= 100）有 11，22，33，44，55，66，77，88，99 和 100 。
```

**示例 3：**

```text
输入：n = 1000
输出：262
```

**提示：**

- `1 <= n <= 10^9`

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

题目要求统计 $[1,..n]$ 中至少有一位重复的数字的个数，我们可以换一种思路，用一个函数 $f(n)$ 统计 $[1,..n]$ 中没有重复数字的个数，那么答案就是 $n - f(n)$。

另外，我们可以用一个二进制数来记录数字中出现过的数字，比如数字中出现了 $1$, $2$, $4$，那么对应的二进制数就是 $\underline{1}0\underline{1}\underline{1}0$。

接下来，我们用记忆化搜索来实现数位 DP。从起点向下搜索，到最底层得到方案数，一层层向上返回答案并累加，最后从搜索起点得到最终的答案。

基本步骤如下：

我们将数字 $n$ 转为字符串 $s$，接下来，我们设计一个函数 $\textit{dfs}(i, \textit{mask}, \textit{lead}, \textit{limit})$，其中：

- 数字 $i$ 表示当前处理的数字下标，从 $0$ 开始。
- 数字 $\textit{mask}$ 表示当前数字中出现过的数字，用二进制数表示。其中 $\textit{mask}$ 的二进制的第 $j$ 位为 $1$ 表示数字 $j$ 出现过，为 $0$ 表示数字 $j$ 没有出现过。
- 布尔值 $\textit{lead}$ 表示是否只包含前导零。
- 布尔值 $\textit{limit}$ 表示当前位置是否受到上界的限制。

函数的执行过程如下：

如果 $i$ 大于等于 $m$，说明我们已经处理完了所有的位数，此时如果 $\textit{lead}$ 为真，说明当前的数字是前导零，我们应当返回 $0$；否则，我们应当返回 $1$。

否则，我们计算当前位置的上界 $\textit{up}$，如果 $\textit{limit}$ 为真，则 $up$ 为 $s[i]$ 对应的数字，否则 $up$ 为 $9$。

然后，我们在 $[0, \textit{up}]$ 的范围内枚举当前位置的数字 $j$，如果 $j$ 为 $0$ 且 $\textit{lead}$ 为真，我们递归计算 $\textit{dfs}(i + 1, \textit{mask}, \text{true}, \textit{limit} \wedge j = \textit{up})$；否则，如果 $\textit{mask}$ 的第 $j$ 位为 $0$，我们递归计算 $\textit{dfs}(i + 1, \textit{mask} \,|\, 2^j, \text{false}, \textit{limit} \wedge j = \textit{up})$。累加所有的结果即为答案。

答案为 $n - \textit{dfs}(0, 0, \text{true}, \text{true})$。

时间复杂度 $O(\log n \times 2^D \times D)$，空间复杂度 $O(\log n \times 2^D)$。其中 $D = 10$。

相似题目：

- [233. 数字 1 的个数](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0233.Number%20of%20Digit%20One/README.md)
- [357. 统计各位数字都不同的数字个数](https://github.com/doocs/leetcode/blob/main/solution/0300-0399/0357.Count%20Numbers%20with%20Unique%20Digits/README.md)
- [600. 不含连续 1 的非负整数](https://github.com/doocs/leetcode/blob/main/solution/0600-0699/0600.Non-negative%20Integers%20without%20Consecutive%20Ones/README.md)
- [788. 旋转数字](https://github.com/doocs/leetcode/blob/main/solution/0700-0799/0788.Rotated%20Digits/README.md)
- [902. 最大为 N 的数字组合](https://github.com/doocs/leetcode/blob/main/solution/0900-0999/0902.Numbers%20At%20Most%20N%20Given%20Digit%20Set/README.md)
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
// Numbers With Repeated Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numDupDigitsAtMostN(n int) int {
	s := []byte(strconv.Itoa(n))
	m := len(s)
	f := make([][]int, m)
	for i := range f {
		f[i] = make([]int, 1<<10)
		for j := range f[i] {
			f[i][j] = -1
		}
	}

	var dfs func(i, mask int, lead, limit bool) int
	dfs = func(i, mask int, lead, limit bool) int {
		if i >= m {
			if lead {
				return 0
			}
			return 1
		}
		if !lead && !limit && f[i][mask] != -1 {
			return f[i][mask]
		}
		up := 9
		if limit {
			up = int(s[i] - '0')
		}
		ans := 0
		for j := 0; j <= up; j++ {
			if lead && j == 0 {
				ans += dfs(i+1, mask, true, limit && j == up)
			} else if mask>>j&1 == 0 {
				ans += dfs(i+1, mask|(1<<j), false, limit && j == up)
			}
		}
		if !lead && !limit {
			f[i][mask] = ans
		}
		return ans
	}
	return n - dfs(0, 0, true, true)
}
```

### Java

```java
// Numbers With Repeated Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private char[] s;
    private Integer[][] f;

    public int numDupDigitsAtMostN(int n) {
        s = String.valueOf(n).toCharArray();
        f = new Integer[s.length][1 << 10];
        return n - dfs(0, 0, true, true);
    }

    private int dfs(int i, int mask, boolean lead, boolean limit) {
        if (i >= s.length) {
            return lead ? 0 : 1;
        }
        if (!lead && !limit && f[i][mask] != null) {
            return f[i][mask];
        }
        int up = limit ? s[i] - '0' : 9;
        int ans = 0;
        for (int j = 0; j <= up; ++j) {
            if (lead && j == 0) {
                ans += dfs(i + 1, mask, true, false);
            } else if ((mask >> j & 1) == 0) {
                ans += dfs(i + 1, mask | 1 << j, false, limit && j == up);
            }
        }
        if (!lead && !limit) {
            f[i][mask] = ans;
        }
        return ans;
    }
}
```

### Python

```python
# Numbers With Repeated Digits：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numDupDigitsAtMostN(self, n: int) -> int:
        @cache
        def dfs(i: int, mask: int, lead: bool, limit: bool) -> int:
            if i >= len(s):
                return lead ^ 1
            up = int(s[i]) if limit else 9
            ans = 0
            for j in range(up + 1):
                if lead and j == 0:
                    ans += dfs(i + 1, mask, True, False)
                elif mask >> j & 1 ^ 1:
                    ans += dfs(i + 1, mask | 1 << j, False, limit and j == up)
            return ans

        s = str(n)
        return n - dfs(0, 0, True, True)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

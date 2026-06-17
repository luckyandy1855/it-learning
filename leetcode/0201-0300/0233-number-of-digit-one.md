# 0233. Number of Digit One

---
编号: 233
题目: Number of Digit One
难度: 困难
标签: [递归, 数学, 动态规划]
来源链接: https://leetcode.com/problems/number-of-digit-one/
---

## 题目描述

给定一个整数 `n`，计算所有小于等于 `n` 的非负整数中数字 `1` 出现的个数。

**示例 1：**

```text
输入：n = 13
输出：6
```

**示例 2：**

```text
输入：n = 0
输出：0
```

**提示：**

- `0 <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「递归, 数学, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

这道题实际上是求在给定区间 $[l,..r]$ 中，数字中出现 $1$ 个数。个数与数的位数以及每一位上的数字有关。我们可以用数位 DP 的思路来解决这道题。数位 DP 中，数的大小对复杂度的影响很小。

对于区间 $[l,..r]$ 问题，我们一般会将其转化为 $[1,..r]$ 然后再减去 $[1,..l - 1]$ 的问题，即：


ans = \sum_{i=1}^{r} ans_i -  \sum_{i=1}^{l-1} ans_i


不过对于本题而言，我们只需要求出区间 $[1,..r]$ 的值即可。

这里我们用记忆化搜索来实现数位 DP。从起点向下搜索，到最底层得到方案数，一层层向上返回答案并累加，最后从搜索起点得到最终的答案。

基本步骤如下：

我们首先将数字 $n$ 转化为字符串 $s$。然后我们设计一个函数 $\textit{dfs}(i, \textit{cnt}, \textit{limit})$，其中：

- 数字 $i$ 表示当前搜索到的位置，我们从高位开始搜索，即 $i = 0$ 表示最高位。
- 数字 $\textit{cnt}$ 表示当前数字中 $1$ 出现的次数。
- 布尔值 $\textit{limit}$ 表示当前是否受到上界的限制。

函数的执行过程如下：

如果 $i$ 超过了数字 $n$ 的长度，说明搜索结束，直接返回 $cnt$。如果 $\textit{limit}$ 为真，那么 $up$ 为当前数字的第 $i$ 位，否则 $up = 9$。接下来，我们遍历 $j$ 从 $0$ 到 $up$，对于每一个 $j$：

- 如果 $j$ 等于 $1$，我们将 $cnt$ 加一。
- 递归调用 $\textit{dfs}(i + 1, \textit{cnt}, \textit{limit} \land j = up)$。

答案为 $\textit{dfs}(0, 0, \text{True})$。

时间复杂度 $O(m^2 \times D)$，空间复杂度 $O(m^2)$。其中 $m$ 为数字 $n$ 的长度，而 $D = 10$。

相似题目：

- [357. 统计各位数字都不同的数字个数](https://github.com/doocs/leetcode/blob/main/solution/0300-0399/0357.Count%20Numbers%20with%20Unique%20Digits/README.md)
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
// Number of Digit One：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countDigitOne(n int) int {
	s := strconv.Itoa(n)
	m := len(s)
	f := make([][]int, m)
	for i := range f {
		f[i] = make([]int, m)
		for j := range f[i] {
			f[i][j] = -1
		}
	}
	var dfs func(i, cnt int, limit bool) int
	dfs = func(i, cnt int, limit bool) int {
		if i >= m {
			return cnt
		}
		if !limit && f[i][cnt] != -1 {
			return f[i][cnt]
		}
		up := 9
		if limit {
			up = int(s[i] - '0')
		}
		ans := 0
		for j := 0; j <= up; j++ {
			t := 0
			if j == 1 {
				t = 1
			}
			ans += dfs(i+1, cnt+t, limit && j == up)
		}
		if !limit {
			f[i][cnt] = ans
		}
		return ans
	}
	return dfs(0, 0, true)
}
```

### Java

```java
import java.util.*;
// Number of Digit One：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private int m;
    private char[] s;
    private Integer[][] f;

    public int countDigitOne(int n) {
        s = String.valueOf(n).toCharArray();
        m = s.length;
        f = new Integer[m][m];
        return dfs(0, 0, true);
    }

    private int dfs(int i, int cnt, boolean limit) {
        if (i >= m) {
            return cnt;
        }
        if (!limit && f[i][cnt] != null) {
            return f[i][cnt];
        }
        int up = limit ? s[i] - '0' : 9;
        int ans = 0;
        for (int j = 0; j <= up; ++j) {
            ans += dfs(i + 1, cnt + (j == 1 ? 1 : 0), limit && j == up);
        }
        if (!limit) {
            f[i][cnt] = ans;
        }
        return ans;
    }
}
```

### Python

```python
# Number of Digit One：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countDigitOne(self, n: int) -> int:
        @cache
        def dfs(i: int, cnt: int, limit: bool) -> int:
            if i >= len(s):
                return cnt
            up = int(s[i]) if limit else 9
            ans = 0
            for j in range(up + 1):
                ans += dfs(i + 1, cnt + (j == 1), limit and j == up)
            return ans

        s = str(n)
        return dfs(0, 0, True)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

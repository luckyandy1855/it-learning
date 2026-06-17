# 0902. Numbers At Most N Given Digit Set

---
编号: 902
题目: Numbers At Most N Given Digit Set
难度: 困难
标签: [数组, 数学, 字符串, 二分查找, 动态规划]
来源链接: https://leetcode.com/problems/numbers-at-most-n-given-digit-set/
---

## 题目描述

给定一个按 **非递减顺序** 排列的数字数组 `digits` 。你可以用任意次数 `digits[i]` 来写的数字。例如，如果 `digits = ['1','3','5']`，我们可以写数字，如 `'13'`, `'551'`, 和 `'1351315'`。

返回 *可以生成的小于或等于给定整数 `n` 的正整数的个数* 。

**示例 1：**

```text
输入：digits = ["1","3","5","7"], n = 100
输出：20
解释：
可写出的 20 个数字是：
1, 3, 5, 7, 11, 13, 15, 17, 31, 33, 35, 37, 51, 53, 55, 57, 71, 73, 75, 77.
```

**示例 2：**

```text
输入：digits = ["1","4","9"], n = 1000000000
输出：29523
解释：
我们可以写 3 个一位数字，9 个两位数字，27 个三位数字，
81 个四位数字，243 个五位数字，729 个六位数字，
2187 个七位数字，6561 个八位数字和 19683 个九位数字。
总共，可以使用D中的数字写出 29523 个整数。
```

**示例 3:**

```text
输入：digits = ["7"], n = 8
输出：1
```

**提示：**

- `1 <= digits.length <= 9`

- `digits[i].length == 1`

- `digits[i]` 是从 `'1'` 到 `'9'` 的数

- `digits` 中的所有值都 **不同**

- `digits` 按 **非递减顺序** 排列

- `1 <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 字符串, 二分查找, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

这道题实际上是求在给定区间 $[l,..r]$ 中，由 `digits` 中的数字生成的正整数的个数。个数与数的位数以及每一位上的数字有关。我们可以用数位 DP 的思路来解决这道题。数位 DP 中，数的大小对复杂度的影响很小。

对于区间 $[l,..r]$ 问题，我们一般会将其转化为 $[1,..r]$ 然后再减去 $[1,..l - 1]$ 的问题，即：


ans = \sum_{i=1}^{r} ans_i -  \sum_{i=1}^{l-1} ans_i


不过对于本题而言，我们只需要求出区间 $[1,..r]$ 的值即可。

这里我们用记忆化搜索来实现数位 DP。从起点向下搜索，到最底层得到方案数，一层层向上返回答案并累加，最后从搜索起点得到最终的答案。

基本步骤如下：

我们将数字 $n$ 转化为字符串 $s$，记字符串 $s$ 的长度为 $m$。

接下来，我们设计一个函数 $\textit{dfs}(i, \textit{lead}, \textit{limit})$，表示当前处理到字符串的第 $i$ 位，到最后一位的方案数。其中：

- 数字 $i$ 表示当前处理到字符串 $s$ 的第 $i$ 位；
- 布尔值 $\textit{lead}$ 表示是否只包含前导零；
- 布尔值 $\textit{limit}$ 表示当前位置是否受到上界的限制。

函数的执行过程如下：

如果 $i$ 大于等于 $m$，说明我们已经处理完了所有的位数，此时如果 $\textit{lead}$ 为真，说明当前的数字是前导零，我们应当返回 $0$；否则，我们应当返回 $1$。

否则，我们计算当前位置的上界 $\textit{up}$，如果 $\textit{limit}$ 为真，则 $up$ 为 $s[i]$ 对应的数字，否则 $up$ 为 $9$。

然后，我们在 $[0, \textit{up}]$ 的范围内枚举当前位置的数字 $j$，如果 $j$ 为 $0$ 且 $\textit{lead}$ 为真，我们递归计算 $\textit{dfs}(i + 1, \text{true}, \textit{limit} \wedge j = \textit{up})$；否则，如果 $j$ 在 $\textit{digits}$ 中，我们递归计算 $\textit{dfs}(i + 1, \text{false}, \textit{limit} \wedge j = \textit{up})$。累加所有的结果即为答案。

最后，我们返回 $\textit{dfs}(0, \text{true}, \text{true})$ 即可。

时间复杂度 $O(\log n \times D)$，空间复杂度 $O(\log n)$。其中 $D = 10$。

相似题目：

- [233. 数字 1 的个数](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0233.Number%20of%20Digit%20One/README.md)
- [357. 统计各位数字都不同的数字个数](https://github.com/doocs/leetcode/blob/main/solution/0300-0399/0357.Count%20Numbers%20with%20Unique%20Digits/README.md)
- [600. 不含连续 1 的非负整数](https://github.com/doocs/leetcode/blob/main/solution/0600-0699/0600.Non-negative%20Integers%20without%20Consecutive%20Ones/README.md)
- [788. 旋转数字](https://github.com/doocs/leetcode/blob/main/solution/0700-0799/0788.Rotated%20Digits/README.md)
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
// Numbers At Most N Given Digit Set：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func atMostNGivenDigitSet(digits []string, n int) int {
	s := strconv.Itoa(n)
	m := len(s)
	f := make([]int, m)
	for i := range f {
		f[i] = -1
	}
	nums := map[int]bool{}
	for _, d := range digits {
		x, _ := strconv.Atoi(d)
		nums[x] = true
	}
	var dfs func(i int, lead, limit bool) int
	dfs = func(i int, lead, limit bool) int {
		if i >= m {
			if lead {
				return 0
			}
			return 1
		}
		if !lead && !limit && f[i] != -1 {
			return f[i]
		}
		up := 9
		if limit {
			up = int(s[i] - '0')
		}
		ans := 0
		for j := 0; j <= up; j++ {
			if j == 0 && lead {
				ans += dfs(i+1, true, limit && j == up)
			} else if nums[j] {
				ans += dfs(i+1, false, limit && j == up)
			}
		}
		if !lead && !limit {
			f[i] = ans
		}
		return ans
	}
	return dfs(0, true, true)
}
```

### Java

```java
// Numbers At Most N Given Digit Set：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Set<Integer> nums = new HashSet<>();
    private char[] s;
    private Integer[] f;

    public int atMostNGivenDigitSet(String[] digits, int n) {
        s = String.valueOf(n).toCharArray();
        f = new Integer[s.length];
        for (var x : digits) {
            nums.add(Integer.parseInt(x));
        }
        return dfs(0, true, true);
    }

    private int dfs(int i, boolean lead, boolean limit) {
        if (i >= s.length) {
            return lead ? 0 : 1;
        }
        if (!lead && !limit && f[i] != null) {
            return f[i];
        }
        int up = limit ? s[i] - '0' : 9;
        int ans = 0;
        for (int j = 0; j <= up; ++j) {
            if (j == 0 && lead) {
                ans += dfs(i + 1, true, limit && j == up);
            } else if (nums.contains(j)) {
                ans += dfs(i + 1, false, limit && j == up);
            }
        }
        if (!lead && !limit) {
            f[i] = ans;
        }
        return ans;
    }
}
```

### Python

```python
# Numbers At Most N Given Digit Set：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def atMostNGivenDigitSet(self, digits: List[str], n: int) -> int:
        @cache
        def dfs(i: int, lead: int, limit: bool) -> int:
            if i >= len(s):
                return lead ^ 1

            up = int(s[i]) if limit else 9
            ans = 0
            for j in range(up + 1):
                if j == 0 and lead:
                    ans += dfs(i + 1, 1, limit and j == up)
                elif j in nums:
                    ans += dfs(i + 1, 0, limit and j == up)
            return ans

        s = str(n)
        nums = {int(x) for x in digits}
        return dfs(0, 1, True)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0552. Student Attendance Record II

---
编号: 552
题目: Student Attendance Record II
难度: 困难
标签: [动态规划]
来源链接: https://leetcode.com/problems/student-attendance-record-ii/
---

## 题目描述

可以用字符串表示一个学生的出勤记录，其中的每个字符用来标记当天的出勤情况（缺勤、迟到、到场）。记录中只含下面三种字符：

- `'A'`：Absent，缺勤

- `'L'`：Late，迟到

- `'P'`：Present，到场

如果学生能够 **同时** 满足下面两个条件，则可以获得出勤奖励：

- 按 **总出勤** 计，学生缺勤（`'A'`）**严格** 少于两天。

- 学生 **不会** 存在 **连续** 3 天或 **连续** 3 天以上的迟到（`'L'`）记录。

给你一个整数 `n` ，表示出勤记录的长度（次数）。请你返回记录长度为 `n` 时，可能获得出勤奖励的记录情况 **数量** 。答案可能很大，所以返回对 `10^9 + 7` **取余** 的结果。

**示例 1：**

```text
输入：n = 2
输出：8
解释：
有 8 种长度为 2 的记录将被视为可奖励：
"PP" , "AP", "PA", "LP", "PL", "AL", "LA", "LL"
只有"AA"不会被视为可奖励，因为缺勤次数为 2 次（需要少于 2 次）。
```

**示例 2：**

```text
输入：n = 1
输出：3
```

**示例 3：**

```text
输入：n = 10101
输出：183236316
```

**提示：**

- `1 <= n <= 10^5`

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

我们设计一个函数 $dfs(i, j, k)$，表示从第 $i$ 个出勤记录开始，当前缺勤次数为 $j$，目前最后连续迟到次数为 $k$ 时，可获得出勤奖励的情况数量。那么答案就是 $dfs(0, 0, 0)$。

函数 $dfs(i, j, k)$ 的执行过程如下：

- 如果 $i \ge n$，说明已经遍历完所有出勤记录，返回 $1$；
- 如果 $j = 0$，说明当前缺勤次数为 $0$，那么可以选择缺勤，即 $dfs(i + 1, j + 1, 0)$；
- 如果 $k \lt 2$，说明当前连续迟到次数小于 $2$，那么可以选择迟到，即 $dfs(i + 1, j, k + 1)$；
- 无论如何，都可以选择到场，即 $dfs(i + 1, j, 0)$。

我们将上述三种情况的结果相加，即为 $dfs(i, j, k)$ 的结果。

为了避免重复计算，我们可以使用记忆化搜索。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为出勤记录的长度。

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
// Student Attendance Record II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func checkRecord(n int) int {
	f := make([][][]int, n)
	for i := range f {
		f[i] = make([][]int, 2)
		for j := range f[i] {
			f[i][j] = make([]int, 3)
			for k := range f[i][j] {
				f[i][j][k] = -1
			}
		}
	}
	const mod = 1e9 + 7
	var dfs func(i, j, k int) int
	dfs = func(i, j, k int) int {
		if i >= n {
			return 1
		}
		if f[i][j][k] != -1 {
			return f[i][j][k]
		}
		ans := dfs(i+1, j, 0)
		if j == 0 {
			ans = (ans + dfs(i+1, j+1, 0)) % mod
		}
		if k < 2 {
			ans = (ans + dfs(i+1, j, k+1)) % mod
		}
		f[i][j][k] = ans
		return ans
	}
	return dfs(0, 0, 0)
}
```

### Java

```java
// Student Attendance Record II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int mod = (int) 1e9 + 7;
    private int n;
    private Integer[][][] f;

    public int checkRecord(int n) {
        this.n = n;
        f = new Integer[n][2][3];
        return dfs(0, 0, 0);
    }

    private int dfs(int i, int j, int k) {
        if (i >= n) {
            return 1;
        }
        if (f[i][j][k] != null) {
            return f[i][j][k];
        }
        int ans = dfs(i + 1, j, 0);
        if (j == 0) {
            ans = (ans + dfs(i + 1, j + 1, 0)) % mod;
        }
        if (k < 2) {
            ans = (ans + dfs(i + 1, j, k + 1)) % mod;
        }
        return f[i][j][k] = ans;
    }
}
```

### Python

```python
# Student Attendance Record II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def checkRecord(self, n: int) -> int:
        @cache
        def dfs(i, j, k):
            if i >= n:
                return 1
            ans = 0
            if j == 0:
                ans += dfs(i + 1, j + 1, 0)
            if k < 2:
                ans += dfs(i + 1, j, k + 1)
            ans += dfs(i + 1, j, 0)
            return ans % mod

        mod = 10**9 + 7
        ans = dfs(0, 0, 0)
        dfs.cache_clear()
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

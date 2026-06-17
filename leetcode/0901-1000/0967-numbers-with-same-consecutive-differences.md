# 0967. Numbers With Same Consecutive Differences

---
编号: 967
题目: Numbers With Same Consecutive Differences
难度: 中等
标签: [广度优先搜索, 回溯]
来源链接: https://leetcode.com/problems/numbers-with-same-consecutive-differences/
---

## 题目描述

返回所有长度为 `n` 且满足其每两个连续位上的数字之间的差的绝对值为 `k` 的** 非负整数 **。

请注意，**除了 **数字 `0` 本身之外，答案中的每个数字都 **不能 **有前导零。例如，`01` 有一个前导零，所以是无效的；但 `0` 是有效的。

你可以按 **任何顺序** 返回答案。

**示例 1：**

```text
输入：n = 3, k = 7
输出：[181,292,707,818,929]
解释：注意，070 不是一个有效的数字，因为它有前导零。
```

**示例 2：**

```text
输入：n = 2, k = 1
输出：[10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]
```

**示例 3：**

```text
输入：n = 2, k = 0
输出：[11,22,33,44,55,66,77,88,99]
```

**示例 4：**

```text
输入：n = 2, k = 2
输出：[13,20,24,31,35,42,46,53,57,64,68,75,79,86,97]
```

**提示：**

- `2 <= n <= 9`

- `0 <= k <= 9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举所有长度为 $n$ 的数字的第一个数字，然后使用深度优先搜索的方法，递归地构造所有符合条件的数字。

具体地，我们首先定义一个边界值 $\textit{boundary} = 10^{n-1}$，表示我们需要构造的数字的最小值。然后，我们从 $1$ 到 $9$ 枚举第一个数字，对于每一个数字 $i$，我们递归地构造以 $i$ 为第一个数字的长度为 $n$ 的数字。

时间复杂度 $(n \times 2^n \times |\Sigma|)$，其中 $|\Sigma|$ 表示数字集合，本题中 $|\Sigma| = 9$。空间复杂度 $O(2^n)$。

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
// Numbers With Same Consecutive Differences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numsSameConsecDiff(n int, k int) (ans []int) {
	bounary := int(math.Pow10(n - 1))
	var dfs func(int)
	dfs = func(x int) {
		if x >= bounary {
			ans = append(ans, x)
			return
		}
		last := x % 10
		if last+k < 10 {
			dfs(x*10 + last + k)
		}
		if k > 0 && last-k >= 0 {
			dfs(x*10 + last - k)
		}
	}
	for i := 1; i < 10; i++ {
		dfs(i)
	}
	return
}
```

### Java

```java
// Numbers With Same Consecutive Differences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<Integer> ans = new ArrayList<>();
    private int boundary;
    private int k;

    public int[] numsSameConsecDiff(int n, int k) {
        this.k = k;
        boundary = (int) Math.pow(10, n - 1);
        for (int i = 1; i < 10; ++i) {
            dfs(i);
        }
        return ans.stream().mapToInt(i -> i).toArray();
    }

    private void dfs(int x) {
        if (x >= boundary) {
            ans.add(x);
            return;
        }
        int last = x % 10;
        if (last + k < 10) {
            dfs(x * 10 + last + k);
        }
        if (k != 0 && last - k >= 0) {
            dfs(x * 10 + last - k);
        }
    }
}
```

### Python

```python
# Numbers With Same Consecutive Differences：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numsSameConsecDiff(self, n: int, k: int) -> List[int]:
        def dfs(x: int):
            if x >= boundary:
                ans.append(x)
                return
            last = x % 10
            if last + k <= 9:
                dfs(x * 10 + last + k)
            if last - k >= 0 and k != 0:
                dfs(x * 10 + last - k)

        ans = []
        boundary = 10 ** (n - 1)
        for i in range(1, 10):
            dfs(i)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1340. Jump Game V

---
编号: 1340
题目: Jump Game V
难度: 困难
标签: [数组, 动态规划, 排序]
来源链接: https://leetcode.com/problems/jump-game-v/
---

## 题目描述

给你一个整数数组 `arr` 和一个整数 `d` 。每一步你可以从下标 `i` 跳到：

- `i + x` ，其中 `i + x = 0` 且 `0  arr[j]` 且 `arr[i] > arr[k]` ，其中下标 `k` 是所有 `i` 到 `j` 之间的数字（更正式的，`min(i, j)

```text
输入：arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
输出：4
解释：你可以从下标 10 出发，然后如上图依次经过 10 --> 8 --> 6 --> 7 。
注意，如果你从下标 6 开始，你只能跳到下标 7 处。你不能跳到下标 5 处因为 13 > 9 。你也不能跳到下标 4 处，因为下标 5 在下标 4 和 6 之间且 13 > 9 。
类似的，你不能从下标 3 处跳到下标 2 或者下标 1 处。
```

**示例 2：**

```text
输入：arr = [3,3,3,3,3], d = 3
输出：1
解释：你可以从任意下标处开始且你永远无法跳到任何其他坐标。
```

**示例 3：**

```text
输入：arr = [7,6,5,4,3,2,1], d = 1
输出：7
解释：从下标 0 处开始，你可以按照数值从大到小，访问所有的下标。
```

**示例 4：**

```text
输入：arr = [7,1,7,1,7,1], d = 2
输出：2
```

**示例 5：**

```text
输入：arr = [66], d = 1
输出：1
```

**提示：**

- `1 <= arr.length <= 1000`

- `1 <= arr[i] <= 10^5`

- `1 <= d <= arr.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $\text{dfs}(i)$，表示从下标 $i$ 开始跳跃能够访问的最大下标数。我们可以枚举 $i$ 的所有合法的跳跃目标 $j$，即 $i - d \leq j \leq i + d$，并且 $\text{arr}[i] > \text{arr}[j]$。对于每个合法的 $j$，我们可以递归地计算 $\text{dfs}(j)$，并取其中的最大值。最终的答案即为所有 $i$ 的 $\text{dfs}(i)$ 的最大值。

我们可以使用记忆化搜索来优化这个过程，即使用一个数组 $f$ 记录每个下标的 $\text{dfs}$ 值，避免重复计算。

时间复杂度 $O(n \times d)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\text{arr}$ 的长度。

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
// Jump Game V：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxJumps(arr []int, d int) (ans int) {
	n := len(arr)
	f := make([]int, n)
	var dfs func(int) int
	dfs = func(i int) int {
		if f[i] != 0 {
			return f[i]
		}
		ans := 1
		for j := i - 1; j >= 0; j-- {
			if i-j > d || arr[j] >= arr[i] {
				break
			}
			ans = max(ans, 1+dfs(j))
		}
		for j := i + 1; j < n; j++ {
			if j-i > d || arr[j] >= arr[i] {
				break
			}
			ans = max(ans, 1+dfs(j))
		}
		f[i] = ans
		return ans
	}
	for i := 0; i < n; i++ {
		ans = max(ans, dfs(i))
	}
	return
}
```

### Java

```java
// Jump Game V：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private int d;
    private int[] arr;
    private Integer[] f;

    public int maxJumps(int[] arr, int d) {
        n = arr.length;
        this.d = d;
        this.arr = arr;
        f = new Integer[n];
        int ans = 1;
        for (int i = 0; i < n; ++i) {
            ans = Math.max(ans, dfs(i));
        }
        return ans;
    }

    private int dfs(int i) {
        if (f[i] != null) {
            return f[i];
        }
        int ans = 1;
        for (int j = i - 1; j >= 0; --j) {
            if (i - j > d || arr[j] >= arr[i]) {
                break;
            }
            ans = Math.max(ans, 1 + dfs(j));
        }
        for (int j = i + 1; j < n; ++j) {
            if (j - i > d || arr[j] >= arr[i]) {
                break;
            }
            ans = Math.max(ans, 1 + dfs(j));
        }
        return f[i] = ans;
    }
}
```

### Python

```python
# Jump Game V：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxJumps(self, arr: List[int], d: int) -> int:
        @cache
        def dfs(i):
            ans = 1
            for j in range(i - 1, -1, -1):
                if i - j > d or arr[j] >= arr[i]:
                    break
                ans = max(ans, 1 + dfs(j))
            for j in range(i + 1, n):
                if j - i > d or arr[j] >= arr[i]:
                    break
                ans = max(ans, 1 + dfs(j))
            return ans

        n = len(arr)
        return max(dfs(i) for i in range(n))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

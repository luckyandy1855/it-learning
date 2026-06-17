# 1477. Find Two Non-overlapping Sub-arrays Each With Target Sum

---
编号: 1477
题目: Find Two Non-overlapping Sub-arrays Each With Target Sum
难度: 中等
标签: [数组, 哈希表, 二分查找, 动态规划, 滑动窗口]
来源链接: https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/
---

## 题目描述

给你一个整数数组 `arr` 和一个整数值 `target` 。

请你在 `arr` 中找 **两个互不重叠的子数组** 且它们的和都等于 `target` 。可能会有多种方案，请你返回满足要求的两个子数组长度和的 **最小值** 。

请返回满足要求的最小长度和，如果无法找到这样的两个子数组，请返回 **-1** 。

**示例 1：**

```text
输入：arr = [3,2,2,4,3], target = 3
输出：2
解释：只有两个子数组和为 3 （[3] 和 [3]）。它们的长度和为 2 。
```

**示例 2：**

```text
输入：arr = [7,3,4,7], target = 7
输出：2
解释：尽管我们有 3 个互不重叠的子数组和为 7 （[7], [3,4] 和 [7]），但我们会选择第一个和第三个子数组，因为它们的长度和 2 是最小值。
```

**示例 3：**

```text
输入：arr = [4,3,2,6,2,3,4], target = 6
输出：-1
解释：我们只有一个和为 6 的子数组。
```

**示例 4：**

```text
输入：arr = [5,5,4,4,5], target = 3
输出：-1
解释：我们无法找到和为 3 的子数组。
```

**示例 5：**

```text
输入：arr = [3,1,1,1,5,1,2,1], target = 3
输出：3
解释：注意子数组 [1,2] 和 [2,1] 不能成为一个方案因为它们重叠了。
```

**提示：**

- `1 <= arr.length <= 10^5`

- `1 <= arr[i] <= 1000`

- `1 <= target <= 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 二分查找, 动态规划, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用哈希表 $d$ 记录前缀和最近一次出现的位置，初始时 $d[0]=0$。

定义 $f[i]$ 表示前 $i$ 个元素中，长度和为 $target$ 的最短子数组的长度。初始时 $f[0]= \infty$。

遍历数组 $\textit{arr}$，对于当前位置 $i$，计算前缀和 $s$，如果 $s - \textit{target}$ 在哈希表中，记 $j=d[s - \textit{target}]$，则 $f[i]=\min(f[i], i - j)$，答案为 $ans=\min(ans, f[j] + i - j)$。继续遍历下个位置。

最后，如果答案大于数组长度，则返回 $-1$，否则返回答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

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
// Find Two Non-overlapping Sub-arrays Each With Target Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minSumOfLengths(arr []int, target int) int {
	d := map[int]int{0: 0}
	const inf = 1 << 30
	s, n := 0, len(arr)
	f := make([]int, n+1)
	f[0] = inf
	ans := inf
	for i, v := range arr {
		i++
		f[i] = f[i-1]
		s += v
		if j, ok := d[s-target]; ok {
			f[i] = min(f[i], i-j)
			ans = min(ans, f[j]+i-j)
		}
		d[s] = i
	}
	if ans > n {
		return -1
	}
	return ans
}
```

### Java

```java
// Find Two Non-overlapping Sub-arrays Each With Target Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minSumOfLengths(int[] arr, int target) {
        Map<Integer, Integer> d = new HashMap<>();
        d.put(0, 0);
        int n = arr.length;
        int[] f = new int[n + 1];
        final int inf = 1 << 30;
        f[0] = inf;
        int s = 0, ans = inf;
        for (int i = 1; i <= n; ++i) {
            int v = arr[i - 1];
            s += v;
            f[i] = f[i - 1];
            if (d.containsKey(s - target)) {
                int j = d.get(s - target);
                f[i] = Math.min(f[i], i - j);
                ans = Math.min(ans, f[j] + i - j);
            }
            d.put(s, i);
        }
        return ans > n ? -1 : ans;
    }
}
```

### Python

```python
# Find Two Non-overlapping Sub-arrays Each With Target Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minSumOfLengths(self, arr: List[int], target: int) -> int:
        d = {0: 0}
        s, n = 0, len(arr)
        f = [inf] * (n + 1)
        ans = inf
        for i, v in enumerate(arr, 1):
            s += v
            f[i] = f[i - 1]
            if s - target in d:
                j = d[s - target]
                f[i] = min(f[i], i - j)
                ans = min(ans, f[j] + i - j)
            d[s] = i
        return -1 if ans > n else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

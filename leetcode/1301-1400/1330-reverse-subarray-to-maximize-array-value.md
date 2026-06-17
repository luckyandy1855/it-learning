# 1330. Reverse Subarray To Maximize Array Value

---
编号: 1330
题目: Reverse Subarray To Maximize Array Value
难度: 困难
标签: [贪心, 数组, 数学]
来源链接: https://leetcode.com/problems/reverse-subarray-to-maximize-array-value/
---

## 题目描述

给你一个整数数组 `nums` 。「数组值」定义为所有满足 `0 <= i < nums.length-1` 的 `|nums[i]-nums[i+1]|` 的和。

你可以选择给定数组的任意子数组，并将该子数组翻转。但你只能执行这个操作 **一次** 。

请你找到可行的最大 **数组值 **。

**示例 1：**

```text
输入：nums = [2,3,1,5,4]
输出：10
解释：通过翻转子数组 [3,1,5] ，数组变成 [2,5,1,3,4] ，数组值为 10 。
```

**示例 2：**

```text
输入：nums = [2,4,9,24,2,1,10]
输出：68
```

**提示：**

- `2 <= nums.length <= 3*10^4`

- `-10^5 <= nums[i] <= 10^5`

- 答案保证在 32 位整数范围内。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们需要求出：在翻转一次子数组的情况下，数组值 $\sum_{i=0}^{n-2} |a_i - a_{i+1}|$ 的最大值。

接下来，我们分以下几种情况讨论：

1. 不翻转子数组
1. 翻转子数组，且子数组“包含”第一个元素
1. 翻转子数组，且子数组“包含”最后一个元素
1. 翻转子数组，且子数组“不包含”第一个元素和最后一个元素

我们记不翻转子数组时的数组值为 $s$，此时有 $s = \sum_{i=0}^{n-2} |a_i - a_{i+1}|$。我们可以将答案 $ans$ 初始化为 $s$。

如果翻转子数组，且子数组包含第一个元素，我们可以枚举翻转的子数组的最后一个元素 $a_i$，其中 $0 \leq i \lt n-1$，此时有 $ans = \max(ans, s + |a_0 - a_{i+1}| - |a_i - a_{i+1}|)$。

<p><img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1300-1399/1330.Reverse%20Subarray%20To%20Maximize%20Array%20Value/images/1-drawio.png" /></p>

同理，如果翻转子数组，且子数组包含最后一个元素，我们可以枚举翻转的子数组的第一个元素 $a_{i+1}$，其中 $0 \leq i \lt n-1$，此时有 $ans = \max(ans, s + |a_{n-1} - a_i| - |a_i - a_{i+1}|)$。

<p><img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1300-1399/1330.Reverse%20Subarray%20To%20Maximize%20Array%20Value/images/2-drawio.png" /></p>

如果翻转子数组，且子数组不包含第一个元素和最后一个元素，我们将数组任意两个相邻元素视为一个点对 $(x, y)$，记翻转的第一个元素为 $y_1$，其左侧相邻元素为 $x_1$；翻转的最后一个元素为 $x_2$，其右侧相邻元素为 $y_2$。

<p><img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1300-1399/1330.Reverse%20Subarray%20To%20Maximize%20Array%20Value/images/3-drawio.png" /></p>

此时相比较于不翻转子数组，数组值的变化量为 $|x_1 - x_2| + |y_1 - y_2| - |x_1 - y_1| - |x_2 - y_2|$，其中，前两项可以表示为：


\left | x_1 - x_2 \right |  + \left | y_1 - y_2 \right | = \max \begin{cases} (x_1 + y_1) - (x_2 + y_2) \\ (x_1 - y_1) - (x_2 - y_2) \\ (-x_1 + y_1) - (-x_2 + y_2) \\ (-x_1 - y_1) - (-x_2 - y_2) \end{cases}


那么数组值变化量为：


\left | x_1 - x_2 \right |  + \left | y_1 - y_2 \right | - \left | x_1 - y_1 \right | - \left | x_2 - y_2 \right |  = \max \begin{cases} (x_1 + y_1) - \left |x_1 - y_1 \right | - \left ( (x_2 + y_2) + \left |x_2 - y_2 \right | \right ) \\ (x_1 - y_1) - \left |x_1 - y_1 \right | - \left ( (x_2 - y_2) + \left |x_2 - y_2 \right | \right ) \\ (-x_1 + y_1) - \left |x_1 - y_1 \right | - \left ( (-x_2 + y_2) + \left |x_2 - y_2 \right | \right ) \\ (-x_1 - y_1) - \left |x_1 - y_1 \right | - \left ( (-x_2 - y_2) + \left |x_2 - y_2 \right | \right ) \end{cases}


因此，我们只要求出 $k_1 \times x + k_2 \times y$ 的最大值 $mx$，其中 $k_1, k_2 \in \{-1, 1\}$，以及对应的 $|x - y|$ 的最小值 $mi$，那么数组值变化量的最大值为 $mx - mi$。答案为 $ans = \max(ans, s + \max(0, mx - mi))$。

在代码实现上，我们定义了一个长度为 $5$ 的数组 $dirs=[1, -1, -1, 1, 1]$，每次取数组相邻两个元素作为 $k_1, k_2$ 的值，这样可以覆盖 $k_1, k_2 \in \{-1, 1\}$ 的所有情况。

时间复杂度 $O(n)$，其中 $n$ 是数组 $nums$ 的长度。空间复杂度 $O(1)$。

相似题目：

- [1131. 绝对值表达式的最大值](https://github.com/doocs/leetcode/blob/main/solution/1100-1199/1131.Maximum%20of%20Absolute%20Value%20Expression/README.md)

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
// Reverse Subarray To Maximize Array Value：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxValueAfterReverse(nums []int) int {
	s, n := 0, len(nums)
	for i, x := range nums[:n-1] {
		y := nums[i+1]
		s += abs(x - y)
	}
	ans := s
	for i, x := range nums[:n-1] {
		y := nums[i+1]
		ans = max(ans, s+abs(nums[0]-y)-abs(x-y))
		ans = max(ans, s+abs(nums[n-1]-x)-abs(x-y))
	}
	dirs := [5]int{1, -1, -1, 1, 1}
	const inf = 1 << 30
	for k := 0; k < 4; k++ {
		k1, k2 := dirs[k], dirs[k+1]
		mx, mi := -inf, inf
		for i, x := range nums[:n-1] {
			y := nums[i+1]
			a := k1*x + k2*y
			b := abs(x - y)
			mx = max(mx, a-b)
			mi = min(mi, a+b)
		}
		ans = max(ans, s+max(mx-mi, 0))
	}
	return ans
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Reverse Subarray To Maximize Array Value：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxValueAfterReverse(int[] nums) {
        int n = nums.length;
        int s = 0;
        for (int i = 0; i < n - 1; ++i) {
            s += Math.abs(nums[i] - nums[i + 1]);
        }
        int ans = s;
        for (int i = 0; i < n - 1; ++i) {
            ans = Math.max(
                ans, s + Math.abs(nums[0] - nums[i + 1]) - Math.abs(nums[i] - nums[i + 1]));
            ans = Math.max(
                ans, s + Math.abs(nums[n - 1] - nums[i]) - Math.abs(nums[i] - nums[i + 1]));
        }
        int[] dirs = {1, -1, -1, 1, 1};
        final int inf = 1 << 30;
        for (int k = 0; k < 4; ++k) {
            int k1 = dirs[k], k2 = dirs[k + 1];
            int mx = -inf, mi = inf;
            for (int i = 0; i < n - 1; ++i) {
                int a = k1 * nums[i] + k2 * nums[i + 1];
                int b = Math.abs(nums[i] - nums[i + 1]);
                mx = Math.max(mx, a - b);
                mi = Math.min(mi, a + b);
            }
            ans = Math.max(ans, s + Math.max(0, mx - mi));
        }
        return ans;
    }
}
```

### Python

```python
# Reverse Subarray To Maximize Array Value：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxValueAfterReverse(self, nums: List[int]) -> int:
        ans = s = sum(abs(x - y) for x, y in pairwise(nums))
        for x, y in pairwise(nums):
            ans = max(ans, s + abs(nums[0] - y) - abs(x - y))
            ans = max(ans, s + abs(nums[-1] - x) - abs(x - y))
        for k1, k2 in pairwise((1, -1, -1, 1, 1)):
            mx, mi = -inf, inf
            for x, y in pairwise(nums):
                a = k1 * x + k2 * y
                b = abs(x - y)
                mx = max(mx, a - b)
                mi = min(mi, a + b)
            ans = max(ans, s + max(mx - mi, 0))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

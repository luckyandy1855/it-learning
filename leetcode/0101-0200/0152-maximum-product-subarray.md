# 0152. Maximum Product Subarray

---
编号: 152
题目: Maximum Product Subarray
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/maximum-product-subarray/
---

## 题目描述

给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 **32-位** 整数。

**请注意**，一个只包含一个元素的数组的乘积是这个元素的值。

示例 1:

```text
输入: nums = [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
```

示例 2:

```text
输入: nums = [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
```

**提示:**

	- `1 <= nums.length <= 2 * 10^4`

	- `-10 <= nums[i] <= 10`

	- `nums` 的任何子数组的乘积都 **保证** 是一个 **32-位** 整数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个变量 $f$ 和 $g$，其中 $f$ 表示以 $nums[i]$ 结尾的乘积最大子数组的乘积，而 $g$ 表示以 $nums[i]$ 结尾的乘积最小子数组的乘积。初始时 $f$ 和 $g$ 都等于 $nums[0]$。答案为所有 $f$ 中的最大值。

从 $i=1$ 开始，我们可以考虑将第 $i$ 个数 $nums[i]$ 添加到前面的乘积最大或者乘积最小的子数组乘积的后面，或者单独作为一个子数组乘积（即此时子数组长度只有 $1$）。我们将此前的乘积最大值记为 $ff$，乘积最小值记为 $gg$，那么 $f = \max(f, ff \times nums[i], gg \times nums[i])$，而 $g = \min(g, ff \times nums[i], gg \times nums[i])$。接下来，我们更新答案 $ans = \max(ans, f)$，然后继续计算下一个位置。

最后的答案即为 $ans$。

时间复杂度 $O(n)$，其中 $n$ 是数组 $nums$ 的长度。我们只需要遍历数组一次即可求得答案。空间复杂度 $O(1)$。

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
// Maximum Product Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxProduct(nums []int) int {
	f, g, ans := nums[0], nums[0], nums[0]
	for _, x := range nums[1:] {
		ff, gg := f, g
		f = max(x, max(ff*x, gg*x))
		g = min(x, min(ff*x, gg*x))
		ans = max(ans, f)
	}
	return ans
}
```

### Java

```java
// Maximum Product Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxProduct(int[] nums) {
        int f = nums[0], g = nums[0], ans = nums[0];
        for (int i = 1; i < nums.length; ++i) {
            int ff = f, gg = g;
            f = Math.max(nums[i], Math.max(ff * nums[i], gg * nums[i]));
            g = Math.min(nums[i], Math.min(ff * nums[i], gg * nums[i]));
            ans = Math.max(ans, f);
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Product Subarray：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        ans = f = g = nums[0]
        for x in nums[1:]:
            ff, gg = f, g
            f = max(x, ff * x, gg * x)
            g = min(x, ff * x, gg * x)
            ans = max(ans, f)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

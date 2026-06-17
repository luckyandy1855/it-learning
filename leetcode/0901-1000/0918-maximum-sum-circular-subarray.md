# 0918. Maximum Sum Circular Subarray

---
编号: 918
题目: Maximum Sum Circular Subarray
难度: 中等
标签: [队列, 数组, 分治, 动态规划, 单调队列]
来源链接: https://leetcode.com/problems/maximum-sum-circular-subarray/
---

## 题目描述

给定一个长度为 `n` 的**环形整数数组** `nums` ，返回* `nums` 的非空 **子数组** 的最大可能和 *。

**环形数组*** *意味着数组的末端将会与开头相连呈环状。形式上， `nums[i]` 的下一个元素是 `nums[(i + 1) % n]` ， `nums[i]` 的前一个元素是 `nums[(i - 1 + n) % n]` 。

**子数组** 最多只能包含固定缓冲区 `nums` 中的每个元素一次。形式上，对于子数组 `nums[i], nums[i + 1], ..., nums[j]` ，不存在 `i <= k1, k2 <= j` 其中 `k1 % n == k2 % n` 。

**示例 1：**

```text
输入：nums = [1,-2,3,-2]
输出：3
解释：从子数组 [3] 得到最大和 3
```

**示例 2：**

```text
输入：nums = [5,-3,5]
输出：10
解释：从子数组 [5,5] 得到最大和 5 + 5 = 10
```

**示例 3：**

```text
输入：nums = [3,-2,2,-3]
输出：3
解释：从子数组 [3] 和 [3,-2,2] 都可以得到最大和 3
```

**提示：**

- `n == nums.length`

- `1 <= n <= 3 * 10^4`

- `-3 * 10^4 <= nums[i] <= 3 * 10^4`​​​​​​​

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「队列, 数组, 分治, 动态规划, 单调队列」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

求环形子数组的最大和，可以分为两种情况：

- 情况一：最大和的子数组不包含环形部分，即为普通的最大子数组和；
- 情况二：最大和的子数组包含环形部分，我们可以转换为：求数组总和减去最小子数组和。

因此，我们维护以下几个变量：

- 前缀和最小值 $pmi$，初始值为 $0$；
- 前缀和最大值 $pmx$，初始值为 $-\infty$；
- 前缀和 $s$，初始值为 $0$；
- 最小子数组和 $smi$，初始值为 $\infty$；
- 答案 $ans$，初始值为 $-\infty$。

接下来，我们只需要遍历数组 $nums$，对于当前遍历到的元素 $x$，我们做以下更新操作：

- 更新前缀和 $s = s + x$；
- 更新答案 $ans = \max(ans, s - pmi)$，即为情况一的答案（前缀和 $s$ 减去最小前缀和 $pmi$，可以得到最大子数组和）；
- 更新 $smi = \min(smi, s - pmx)$，即为情况二的最小子数组和；
- 更新 $pmi = \min(pmi, s)$，即为最小前缀和；
- 更新 $pmx = \max(pmx, s)$，即为最大前缀和。

遍历结束，我们取 $ans$ 以及 $s - smi$ 的最大值作为答案返回即可。

时间复杂度 $O(n)$，其中 $n$ 为数组长度。空间复杂度 $O(1)$。

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
// Maximum Sum Circular Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSubarraySumCircular(nums []int) int {
	const inf = 1 << 30
	pmi, pmx := 0, -inf
	ans, s, smi := -inf, 0, inf
	for _, x := range nums {
		s += x
		ans = max(ans, s-pmi)
		smi = min(smi, s-pmx)
		pmi = min(pmi, s)
		pmx = max(pmx, s)
	}
	return max(ans, s-smi)
}
```

### Java

```java
// Maximum Sum Circular Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        final int inf = 1 << 30;
        int pmi = 0, pmx = -inf;
        int ans = -inf, s = 0, smi = inf;
        for (int x : nums) {
            s += x;
            ans = Math.max(ans, s - pmi);
            smi = Math.min(smi, s - pmx);
            pmi = Math.min(pmi, s);
            pmx = Math.max(pmx, s);
        }
        return Math.max(ans, s - smi);
    }
}
```

### Python

```python
# Maximum Sum Circular Subarray：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        pmi, pmx = 0, -inf
        ans, s, smi = -inf, 0, inf
        for x in nums:
            s += x
            ans = max(ans, s - pmi)
            smi = min(smi, s - pmx)
            pmi = min(pmi, s)
            pmx = max(pmx, s)
        return max(ans, s - smi)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

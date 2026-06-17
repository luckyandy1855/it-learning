# 1464. Maximum Product of Two Elements in an Array

---
编号: 1464
题目: Maximum Product of Two Elements in an Array
难度: 简单
标签: [数组, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/
---

## 题目描述

给你一个整数数组 `nums`，请你选择数组的两个不同下标 `i` 和 `j`*，*使 `(nums[i]-1)*(nums[j]-1)` 取得最大值。

请你计算并返回该式的最大值。

**示例 1：**

```text
输入：nums = [3,4,5,2]
输出：12
解释：如果选择下标 i=1 和 j=2（下标从 0 开始），则可以获得最大值，(nums[1]-1)*(nums[2]-1) = (4-1)*(5-1) = 3*4 = 12 。
```

**示例 2：**

```text
输入：nums = [1,5,4,5]
输出：16
解释：选择下标 i=1 和 j=3（下标从 0 开始），则可以获得最大值 (5-1)*(5-1) = 16 。
```

**示例 3：**

```text
输入：nums = [3,7]
输出：12
```

**提示：**

- `2 <= nums.length <= 500`

- `1 <= nums[i] <= 10^3`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

双重循环，枚举所有的下标对，求出 $(nums[i]-1) \times (nums[j]-1)$ 的最大值。其中 $i \neq j$。

时间复杂度 $O(n^2)$。

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
// Maximum Product of Two Elements in an Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxProduct(nums []int) int {
	ans := 0
	for i, a := range nums {
		for _, b := range nums[i+1:] {
			t := (a - 1) * (b - 1)
			if ans < t {
				ans = t
			}
		}
	}
	return ans
}
```

### Java

```java
// Maximum Product of Two Elements in an Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxProduct(int[] nums) {
        int ans = 0;
        int n = nums.length;
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                ans = Math.max(ans, (nums[i] - 1) * (nums[j] - 1));
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Product of Two Elements in an Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        ans = 0
        for i, a in enumerate(nums):
            for b in nums[i + 1 :]:
                ans = max(ans, (a - 1) * (b - 1))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

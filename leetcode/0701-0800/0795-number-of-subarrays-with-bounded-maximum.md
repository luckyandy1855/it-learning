# 0795. Number of Subarrays with Bounded Maximum

---
编号: 795
题目: Number of Subarrays with Bounded Maximum
难度: 中等
标签: [数组, 双指针]
来源链接: https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/
---

## 题目描述

给你一个整数数组 `nums` 和两个整数：`left` 及 `right` 。找出 `nums` 中连续、非空且其中最大元素在范围 `[left, right]` 内的子数组，并返回满足条件的子数组的个数。

生成的测试用例保证结果符合 **32-bit** 整数范围。

**示例 1：**

```text
输入：nums = [2,1,4,3], left = 2, right = 3
输出：3
解释：满足条件的三个子数组：[2], [2, 1], [3]
```

**示例 2：**

```text
输入：nums = [2,9,2,5,6], left = 2, right = 8
输出：7
```

**提示：**

- `1 <= nums.length <= 10^5`

- `0 <= nums[i] <= 10^9`

- `0 <= left <= right <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要我们统计数组 `nums` 中，最大值在区间 $[left, right]$ 范围内的子数组个数。

对于区间 $[left,..right]$ 问题，我们可以考虑将其转换为 $[0,..right]$ 然后再减去 $[0,..left-1]$ 的问题。也就是说，所有最大元素不超过 $right$ 的子数组个数，减去所有最大元素不超过 $left-1$ 的子数组个数，剩下的就是最大元素在区间 $[left,..right]$ 范围内的子数组个数，即题目要求的结果。


ans = \sum_{i=0}^{right} ans_i -  \sum_{i=0}^{left-1} ans_i


对于本题，我们设计一个函数 $f(x)$，表示数组 `nums` 中，最大值不超过 $x$ 的子数组个数。那么答案为 $f(right) - f(left-1)$。函数 $f(x)$ 的执行逻辑如下：

- 用变量 $cnt$ 记录最大值不超过 $x$ 的子数组的个数，用 $t$ 记录当前子数组的长度。
- 遍历数组 `nums`，对于每个元素 $nums[i]$，如果 $nums[i] \leq x$，则当前子数组的长度加一，即 $t=t+1$，否则当前子数组的长度重置为 0，即 $t=0$。然后将当前子数组的长度加到 $cnt$ 中，即 $cnt = cnt + t$。
- 遍历结束，将 $cnt$ 返回即可。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为数组 `nums` 的长度。

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
// Number of Subarrays with Bounded Maximum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numSubarrayBoundedMax(nums []int, left int, right int) int {
	f := func(x int) (cnt int) {
		t := 0
		for _, v := range nums {
			t++
			if v > x {
				t = 0
			}
			cnt += t
		}
		return
	}
	return f(right) - f(left-1)
}
```

### Java

```java
// Number of Subarrays with Bounded Maximum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numSubarrayBoundedMax(int[] nums, int left, int right) {
        return f(nums, right) - f(nums, left - 1);
    }

    private int f(int[] nums, int x) {
        int cnt = 0, t = 0;
        for (int v : nums) {
            t = v > x ? 0 : t + 1;
            cnt += t;
        }
        return cnt;
    }
}
```

### Python

```python
# Number of Subarrays with Bounded Maximum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numSubarrayBoundedMax(self, nums: List[int], left: int, right: int) -> int:
        def f(x):
            cnt = t = 0
            for v in nums:
                t = 0 if v > x else t + 1
                cnt += t
            return cnt

        return f(right) - f(left - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

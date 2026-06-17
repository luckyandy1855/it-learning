# 0896. Monotonic Array

---
编号: 896
题目: Monotonic Array
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/monotonic-array/
---

## 题目描述

如果数组是单调递增或单调递减的，那么它是 **单调 ***的*。

如果对于所有 `i = nums[j]`，那么数组 `nums` 是单调递减的。

当给定的数组 `nums` 是单调数组时返回 `true`，否则返回 `false`。

**示例 1：**

```text
输入：nums = [1,2,2,3]
输出：true
```

**示例 2：**

```text
输入：nums = [6,5,4,4]
输出：true
```

**示例 3：**

```text
输入：nums = [1,3,2]
输出：false
```

**提示：**

- `1 <= nums.length <= 10^5`

- `-10^5 <= nums[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

遍历数组，如果出现递增或递减的情况，记录下来。判断是否出现过递增和递减的情况，如果都出现过，说明不是单调数组，返回 `false`。

否则遍历结束，说明是单调数组，返回 `true`。

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
// Monotonic Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isMonotonic(nums []int) bool {
	asc, desc := false, false
	for i, x := range nums[1:] {
		if nums[i] < x {
			asc = true
		} else if nums[i] > x {
			desc = true
		}
		if asc && desc {
			return false
		}
	}
	return true
}
```

### Java

```java
// Monotonic Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isMonotonic(int[] nums) {
        boolean asc = false, desc = false;
        for (int i = 1; i < nums.length; ++i) {
            if (nums[i - 1] < nums[i]) {
                asc = true;
            } else if (nums[i - 1] > nums[i]) {
                desc = true;
            }
            if (asc && desc) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Monotonic Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isMonotonic(self, nums: List[int]) -> bool:
        asc = all(a <= b for a, b in pairwise(nums))
        desc = all(a >= b for a, b in pairwise(nums))
        return asc or desc
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

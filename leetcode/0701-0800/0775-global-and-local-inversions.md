# 0775. Global and Local Inversions

---
编号: 775
题目: Global and Local Inversions
难度: 中等
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/global-and-local-inversions/
---

## 题目描述

给你一个长度为 `n` 的整数数组 `nums` ，表示由范围 `[0, n - 1]` 内所有整数组成的一个排列。

**全局倒置** 的数目等于满足下述条件不同下标对 `(i, j)` 的数目：

- `0  nums[j]`

**局部倒置** 的数目等于满足下述条件的下标 `i` 的数目：

- `0  nums[i + 1]`

当数组 `nums` 中 **全局倒置** 的数量等于 **局部倒置** 的数量时，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```text
输入：nums = [1,0,2]
输出：true
解释：有 1 个全局倒置，和 1 个局部倒置。
```

**示例 2：**

```text
输入：nums = [1,2,0]
输出：false
解释：有 2 个全局倒置，和 1 个局部倒置。
```

**提示：**

- `n == nums.length`

- `1 <= n <= 10^5`

- `0 <= nums[i] < n`

- `nums` 中的所有整数 **互不相同**

- `nums` 是范围 `[0, n - 1]` 内所有数字组成的一个排列

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题意，我们可以发现，一个数组中的局部倒置一定是全局倒置，但是全局倒置不一定是局部倒置。也就是说，全局倒置的数量一定大于等于局部倒置的数量。

因此，我们枚举每个数 $nums[i]$，其中 $2 \leq i \leq n - 1$，维护前缀数组 $nums[0,..i-2]$ 中的最大值，记为 $mx$。如果存在 $mx$ 大于 $nums[i]$，则说明全局倒置的数量大于局部倒置的数量，返回 `false` 即可。

遍历结束后，返回 `true`。

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
// Global and Local Inversions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isIdealPermutation(nums []int) bool {
	mx := 0
	for i := 2; i < len(nums); i++ {
		mx = max(mx, nums[i-2])
		if mx > nums[i] {
			return false
		}
	}
	return true
}
```

### Java

```java
// Global and Local Inversions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isIdealPermutation(int[] nums) {
        int mx = 0;
        for (int i = 2; i < nums.length; ++i) {
            mx = Math.max(mx, nums[i - 2]);
            if (mx > nums[i]) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Global and Local Inversions：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isIdealPermutation(self, nums: List[int]) -> bool:
        mx = 0
        for i in range(2, len(nums)):
            if (mx := max(mx, nums[i - 2])) > nums[i]:
                return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0413. Arithmetic Slices

---
编号: 413
题目: Arithmetic Slices
难度: 中等
标签: [数组, 动态规划, 滑动窗口]
来源链接: https://leetcode.com/problems/arithmetic-slices/
---

## 题目描述

如果一个数列 **至少有三个元素** ，并且任意两个相邻元素之差相同，则称该数列为等差数列。

- 例如，`[1,3,5,7,9]`、`[7,7,7,7]` 和 `[3,-1,-5,-9]` 都是等差数列。

给你一个整数数组 `nums` ，返回数组 `nums` 中所有为等差数组的 **子数组** 个数。

**子数组** 是数组中的一个连续序列。

**示例 1：**

```text
输入：nums = [1,2,3,4]
输出：3
解释：nums 中有三个子等差数组：[1, 2, 3]、[2, 3, 4] 和 [1,2,3,4] 自身。
```

**示例 2：**

```text
输入：nums = [1]
输出：0
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用 $d$ 表示当前相邻两个元素的差值，用 $cnt$ 表示当前等差数列的长度，初始时 $d = 3000$, $cnt = 2$。

遍历数组 `nums`，对于相邻的两个元素 $a$ 和 $b$，如果 $b - a = d$，则说明当前元素 $b$ 也属于当前等差数列，此时 $cnt$ 自增 1；否则说明当前元素 $b$ 不属于当前等差数列，此时更新 $d = b - a$，且 $cnt = 2$。如果 $cnt \ge 3$，则说明当前等差数列的长度至少为 3，此时等差数列的个数为 $cnt - 2$，将其加到答案中。

遍历结束后，即可得到答案。

在代码实现上，我们也可以将 $cnt$ 初始化为 $0$，重置 $cnt$ 时，直接将 $cnt$ 置为 $0$；累加答案时，直接累加 $cnt$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 是数组 `nums` 的长度。

相似题目：

- [1513. 仅含 1 的子串数](https://github.com/doocs/leetcode/blob/main/solution/1500-1599/1513.Number%20of%20Substrings%20With%20Only%201s/README.md)
- [2348. 全 0 子数组的数目](https://github.com/doocs/leetcode/blob/main/solution/2300-2399/2348.Number%20of%20Zero-Filled%20Subarrays/README.md)

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
// Arithmetic Slices：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberOfArithmeticSlices(nums []int) (ans int) {
	cnt, d := 0, 3000
	for i, b := range nums[1:] {
		a := nums[i]
		if b-a == d {
			cnt++
		} else {
			d = b - a
			cnt = 0
		}
		ans += cnt
	}
	return
}
```

### Java

```java
// Arithmetic Slices：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numberOfArithmeticSlices(int[] nums) {
        int ans = 0, cnt = 0;
        int d = 3000;
        for (int i = 0; i < nums.length - 1; ++i) {
            if (nums[i + 1] - nums[i] == d) {
                ++cnt;
            } else {
                d = nums[i + 1] - nums[i];
                cnt = 0;
            }
            ans += cnt;
        }
        return ans;
    }
}
```

### Python

```python
# Arithmetic Slices：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        ans = cnt = 0
        d = 3000
        for a, b in pairwise(nums):
            if b - a == d:
                cnt += 1
            else:
                d = b - a
                cnt = 0
            ans += cnt
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

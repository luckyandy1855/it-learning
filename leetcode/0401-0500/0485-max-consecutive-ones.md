# 0485. Max Consecutive Ones

---
编号: 485
题目: Max Consecutive Ones
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/max-consecutive-ones/
---

## 题目描述

给定一个二进制数组 `nums` ， 计算其中最大连续 `1` 的个数。

**示例 1：**

```text
输入：nums = [1,1,0,1,1,1]
输出：3
解释：开头的两位和最后的三位都是连续 1 ，所以最大连续 1 的个数是 3.
```

**示例 2:**

```text
输入：nums = [1,0,1,1,0,1]
输出：2
```

**提示：**

- `1 <= nums.length <= 10^5`

- `nums[i]` 不是 `0` 就是 `1`.

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

我们可以遍历数组，用一个变量 $\textit{cnt}$ 记录当前连续的 1 的个数，用另一个变量 $\textit{ans}$ 记录最大连续 1 的个数。

当遍历到一个 1 时，将 $\textit{cnt}$ 加一，然后更新 $\textit{ans}$ 的值为 $\textit{cnt}$ 和 $\textit{ans}$ 本身的最大值，即 $\textit{ans} = \max(\textit{ans}, \textit{cnt})$。否则，将 $\textit{cnt}$ 重置为 0。

遍历结束后，返回 $\textit{ans}$ 的值即可。

时间复杂度 $O(n)$，其中 $n$ 为数组的长度。空间复杂度 $O(1)$。

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
// Max Consecutive Ones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMaxConsecutiveOnes(nums []int) (ans int) {
	cnt := 0
	for _, x := range nums {
		if x == 1 {
			cnt++
			ans = max(ans, cnt)
		} else {
			cnt = 0
		}
	}
	return
}
```

### Java

```java
// Max Consecutive Ones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int ans = 0, cnt = 0;
        for (int x : nums) {
            if (x == 1) {
                ans = Math.max(ans, ++cnt);
            } else {
                cnt = 0;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Max Consecutive Ones：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        ans = cnt = 0
        for x in nums:
            if x:
                cnt += 1
                ans = max(ans, cnt)
            else:
                cnt = 0
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

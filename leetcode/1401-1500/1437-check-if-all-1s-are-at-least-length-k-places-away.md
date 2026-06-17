# 1437. Check If All 1's Are at Least Length K Places Away

---
编号: 1437
题目: Check If All 1's Are at Least Length K Places Away
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/check-if-all-1s-are-at-least-length-k-places-away/
---

## 题目描述

给你一个由若干 `0` 和 `1` 组成的数组 `nums` 以及整数 `k`。如果所有 `1` 都至少相隔 `k` 个元素，则返回 true ；否则，返回 `false` 。

**示例 1：**

****

```text
输入：nums = [1,0,0,0,1,0,0,1], k = 2
输出：true
解释：每个 1 都至少相隔 2 个元素。
```

**示例 2：**

****

```text
输入：nums = [1,0,0,1,0,1], k = 2
输出：false
解释：第二个 1 和第三个 1 之间只隔了 1 个元素。
```

**提示：**

- `1 <= nums.length <= 10^5`

- `0 <= k <= nums.length`

- `nums[i]` 的值为 `0` 或 `1`

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

我们可以遍历数组 $\textit{nums}$，用变量 $j$ 记录上一个 $1$ 的下标，那么当前位置 $i$ 的元素为 $1$ 时，只需要判断 $i - j - 1$ 是否小于 $k$ 即可。如果小于 $k$，则说明存在两个 $1$ 之间的 $0$ 的个数小于 $k$，返回 $\text{false}$；否则，将 $j$ 更新为 $i$，继续遍历数组。

遍历结束后，返回 $\text{true}$。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{nums}$ 的长度。空间复杂度 $O(1)$。

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
// Check If All 1's Are at Least Length K Places Away：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func kLengthApart(nums []int, k int) bool {
	j := -(k + 1)
	for i, x := range nums {
		if x == 1 {
			if i-j-1 < k {
				return false
			}
			j = i
		}
	}
	return true
}
```

### Java

```java
// Check If All 1's Are at Least Length K Places Away：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean kLengthApart(int[] nums, int k) {
        int j = -(k + 1);
        for (int i = 0; i < nums.length; ++i) {
            if (nums[i] == 1) {
                if (i - j - 1 < k) {
                    return false;
                }
                j = i;
            }
        }
        return true;
    }
}
```

### Python

```python
# Check If All 1's Are at Least Length K Places Away：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kLengthApart(self, nums: List[int], k: int) -> bool:
        j = -inf
        for i, x in enumerate(nums):
            if x:
                if i - j - 1 < k:
                    return False
                j = i
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

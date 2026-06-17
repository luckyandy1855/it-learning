# 0961. N-Repeated Element in Size 2N Array

---
编号: 961
题目: N-Repeated Element in Size 2N Array
难度: 简单
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/n-repeated-element-in-size-2n-array/
---

## 题目描述

给你一个整数数组 `nums` ，该数组具有以下属性：

- `nums.length == 2 * n`.

- `nums` 包含 `n + 1` 个 **不同的** 元素，其中 `n` 个值在数组中出现 **恰好一次**。

- `nums` 中恰有一个元素重复 `n` 次

找出并返回重复了 `n`* *次的那个元素。

**示例 1：**

```text
输入：nums = [1,2,3,3]
输出：3
```

**示例 2：**

```text
输入：nums = [2,1,2,5,3,2]
输出：2
```

**示例 3：**

```text
输入：nums = [5,1,5,2,5,3,5,4]
输出：5
```

**提示：**

- `2 <= n <= 5000`

- `nums.length == 2 * n`

- `0 <= nums[i] <= 10^4`

- `nums` 由 `n + 1` 个** 不同的** 元素组成，且其中一个元素恰好重复 `n` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于数组 $\textit{nums}$ 一共有 $2n$ 个元素，其中有 $n + 1$ 个不同的元素，且有一个元素重复了 $n$ 次，说明数组中的其余 $n$ 个元素都是不同的。

因此，我们只需要遍历数组 $\textit{nums}$，用哈希表 $s$ 记录遍历过的元素。当遍历到某个元素 $x$ 时，如果 $x$ 在哈希表 $s$ 中已经存在，说明 $x$ 是重复的元素，直接返回 $x$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{nums}$ 的长度。

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
// N-Repeated Element in Size 2N Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func repeatedNTimes(nums []int) int {
	s := map[int]bool{}
	for i := 0; ; i++ {
		if s[nums[i]] {
			return nums[i]
		}
		s[nums[i]] = true
	}
}
```

### Java

```java
// N-Repeated Element in Size 2N Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int repeatedNTimes(int[] nums) {
        Set<Integer> s = new HashSet<>(nums.length / 2 + 1);
        for (int i = 0;; ++i) {
            if (!s.add(nums[i])) {
                return nums[i];
            }
        }
    }
}
```

### Python

```python
# N-Repeated Element in Size 2N Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def repeatedNTimes(self, nums: List[int]) -> int:
        s = set()
        for x in nums:
            if x in s:
                return x
            s.add(x)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0219. Contains Duplicate II

---
编号: 219
题目: Contains Duplicate II
难度: 简单
标签: [数组, 哈希表, 滑动窗口]
来源链接: https://leetcode.com/problems/contains-duplicate-ii/
---

## 题目描述

给你一个整数数组 `nums` 和一个整数 `k` ，判断数组中是否存在两个 **不同的索引*** *`i` 和* *`j` ，满足 `nums[i] == nums[j]` 且 `abs(i - j) <= k` 。如果存在，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```text
输入：nums = [1,2,3,1], k = 3
输出：true
```

**示例 2：**

```text
输入：nums = [1,0,1,1], k = 1
输出：true
```

**示例 3：**

```text
输入：nums = [1,2,3,1,2,3], k = 2
输出：false
```

**提示：**

- `1 <= nums.length <= 10^5`

- `-10^9 <= nums[i] <= 10^9`

- `0 <= k <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $\textit{d}$ 存放最近遍历到的数以及对应的下标。

遍历数组 $\textit{nums}$，对于当前遍历到的元素 $\textit{nums}[i]$，如果在哈希表中存在，并且下标与当前元素的下标之差不超过 $k$，则返回 $\text{true}$，否则将当前元素加入哈希表中。

遍历结束后，返回 $\text{false}$。

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
// Contains Duplicate II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func containsNearbyDuplicate(nums []int, k int) bool {
	d := map[int]int{}
	for i, x := range nums {
		if j, ok := d[x]; ok && i-j <= k {
			return true
		}
		d[x] = i
	}
	return false
}
```

### Java

```java
import java.util.*;
// Contains Duplicate II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> d = new HashMap<>();
        for (int i = 0; i < nums.length; ++i) {
            if (i - d.getOrDefault(nums[i], -1000000) <= k) {
                return true;
            }
            d.put(nums[i], i);
        }
        return false;
    }
}
```

### Python

```python
# Contains Duplicate II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        d = {}
        for i, x in enumerate(nums):
            if x in d and i - d[x] <= k:
                return True
            d[x] = i
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

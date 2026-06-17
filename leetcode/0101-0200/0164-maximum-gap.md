# 0164. Maximum Gap

---
编号: 164
题目: Maximum Gap
难度: 中等
标签: [数组, 桶排序, 基数排序, 排序]
来源链接: https://leetcode.com/problems/maximum-gap/
---

## 题目描述

给定一个无序的数组 `nums`，返回 *数组在排序之后，相邻元素之间最大的差值* 。如果数组元素个数小于 2，则返回 `0` 。

您必须编写一个在「线性时间」内运行并使用「线性额外空间」的算法。

**示例 1:**

```text
输入: nums = [3,6,9,1]
输出: 3
解释: 排序后的数组是 [1,3,6,9], 其中相邻元素 (3,6) 和 (6,9) 之间都存在最大差值 3。
```

**示例 2:**

```text
输入: nums = [10]
输出: 0
解释: 数组元素个数小于 2，因此返回 0。
```

**提示:**

	- `1 <= nums.length <= 10^5`

	- `0 <= nums[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 桶排序, 基数排序, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

假设数组 $nums$ 有 $n$ 个元素，所有元素从小到大依次是 $nums_0$ 到 $nums_{n - 1}$，最大间距是 $maxGap$。考虑数组中的最大元素和最小元素之差。


nums_{n - 1} - nums_0 = \sum_{i = 1}^{n - 1} (nums_i - nums_{i - 1}) \le{maxGap} \times (n - 1)


因此 $maxGap \ge \dfrac{nums_{n - 1} - nums_0}{n - 1}$，即最大间距至少为 $\dfrac{nums_{n - 1} - nums_0}{n - 1}$。

可以利用桶排序的思想，设定桶的大小（即每个桶最多包含的不同元素个数）为 $\dfrac{nums_{n - 1} - nums_0}{n - 1}$，将元素按照元素值均匀分布到各个桶内，则同一个桶内的任意两个元素之差小于 ${maxGap}$，差为 ${maxGap}$ 的两个元素一定在两个不同的桶内。对于每个桶，维护桶内的最小值和最大值，初始时每个桶内的最小值和最大值分别是正无穷和负无穷，表示桶内没有元素。

遍历数组 ${nums}$ 中的所有元素。对于每个元素，根据该元素与最小元素之差以及桶的大小计算该元素应该分到的桶的编号，可以确保编号小的桶内的元素都小于编号大的桶内的元素，使用元素值更新元素所在的桶内的最小值和最大值。

遍历数组结束之后，每个非空的桶内的最小值和最大值都可以确定。按照桶的编号从小到大的顺序依次遍历每个桶，当前的桶的最小值和上一个非空的桶的最大值是排序后的相邻元素，计算两个相邻元素之差，并更新最大间距。遍历桶结束之后即可得到最大间距。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $nums$ 的长度。

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
// Maximum Gap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maximumGap(nums []int) int {
	n := len(nums)
	if n < 2 {
		return 0
	}
	inf := 0x3f3f3f3f
	mi, mx := inf, -inf
	for _, v := range nums {
		mi = min(mi, v)
		mx = max(mx, v)
	}
	bucketSize := max(1, (mx-mi)/(n-1))
	bucketCount := (mx-mi)/bucketSize + 1
	buckets := make([][]int, bucketCount)
	for i := range buckets {
		buckets[i] = []int{inf, -inf}
	}
	for _, v := range nums {
		i := (v - mi) / bucketSize
		buckets[i][0] = min(buckets[i][0], v)
		buckets[i][1] = max(buckets[i][1], v)
	}
	ans := 0
	prev := inf
	for _, bucket := range buckets {
		if bucket[0] > bucket[1] {
			continue
		}
		ans = max(ans, bucket[0]-prev)
		prev = bucket[1]
	}
	return ans
}
```

### Java

```java
// Maximum Gap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maximumGap(int[] nums) {
        int n = nums.length;
        if (n < 2) {
            return 0;
        }
        int inf = 0x3f3f3f3f;
        int mi = inf, mx = -inf;
        for (int v : nums) {
            mi = Math.min(mi, v);
            mx = Math.max(mx, v);
        }
        int bucketSize = Math.max(1, (mx - mi) / (n - 1));
        int bucketCount = (mx - mi) / bucketSize + 1;
        int[][] buckets = new int[bucketCount][2];
        for (var bucket : buckets) {
            bucket[0] = inf;
            bucket[1] = -inf;
        }
        for (int v : nums) {
            int i = (v - mi) / bucketSize;
            buckets[i][0] = Math.min(buckets[i][0], v);
            buckets[i][1] = Math.max(buckets[i][1], v);
        }
        int prev = inf;
        int ans = 0;
        for (var bucket : buckets) {
            if (bucket[0] > bucket[1]) {
                continue;
            }
            ans = Math.max(ans, bucket[0] - prev);
            prev = bucket[1];
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Gap：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maximumGap(self, nums: List[int]) -> int:
        n = len(nums)
        if n < 2:
            return 0
        mi, mx = min(nums), max(nums)
        bucket_size = max(1, (mx - mi) // (n - 1))
        bucket_count = (mx - mi) // bucket_size + 1
        buckets = [[inf, -inf] for _ in range(bucket_count)]
        for v in nums:
            i = (v - mi) // bucket_size
            buckets[i][0] = min(buckets[i][0], v)
            buckets[i][1] = max(buckets[i][1], v)
        ans = 0
        prev = inf
        for curmin, curmax in buckets:
            if curmin > curmax:
                continue
            ans = max(ans, curmin - prev)
            prev = curmax
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

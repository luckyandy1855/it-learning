# 0410. Split Array Largest Sum

---
编号: 410
题目: Split Array Largest Sum
难度: 困难
标签: [贪心, 数组, 二分查找, 动态规划, 前缀和]
来源链接: https://leetcode.com/problems/split-array-largest-sum/
---

## 题目描述

给定一个非负整数数组 `nums` 和一个整数 `k` ，你需要将这个数组分成 `k`* *个非空的连续子数组，使得这 `k`* *个子数组各自和的最大值 **最小**。

返回分割后最小的和的最大值。

**子数组** 是数组中连续的部分。

**示例 1：**

```text
输入：nums = [7,2,5,10,8], k = 2
输出：18
解释：
一共有四种方法将 nums 分割为 2 个子数组。
其中最好的方式是将其分为 [7,2,5] 和 [10,8] 。
因为此时这两个子数组各自的和的最大值为18，在所有情况中最小。
```

**示例 2：**

```text
输入：nums = [1,2,3,4,5], k = 2
输出：9
```

**示例 3：**

```text
输入：nums = [1,4,4], k = 3
输出：4
```

**提示：**

- `1 <= nums.length <= 1000`

- `0 <= nums[i] <= 10^6`

- `1 <= k <= min(50, nums.length)`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 二分查找, 动态规划, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，当子数组的和的最大值越大，子数组的个数越少，当存在一个满足条件的子数组和的最大值时，那么比这个最大值更大的子数组和的最大值一定也满足条件。也就是说，我们可以对子数组和的最大值进行二分查找，找到满足条件的最小值。

我们定义二分查找的左边界 $left = \max(nums)$，右边界 $right = sum(nums)$，然后对于二分查找的每一步，我们取中间值 $mid = \lfloor \frac{left + right}{2} \rfloor$，然后判断是否存在一个分割方式，使得子数组的和的最大值不超过 $mid$，如果存在，则说明 $mid$ 可能是满足条件的最小值，因此我们将右边界调整为 $mid$，否则我们将左边界调整为 $mid + 1$。

我们如何判断是否存在一个分割方式，使得子数组的和的最大值不超过 $mid$ 呢？我们可以使用贪心的方法，从左到右遍历数组，将数组中的元素依次加入到子数组中，如果当前子数组的和大于 $mid$，则我们将当前元素加入到下一个子数组中。如果我们能够将数组分割成不超过 $k$ 个子数组，且每个子数组的和的最大值不超过 $mid$，则说明 $mid$ 是满足条件的最小值，否则 $mid$ 不是满足条件的最小值。

时间复杂度 $O(n \times \log m)$，空间复杂度 $O(1)$。其中 $n$ 和 $m$ 分别是数组的长度和数组所有元素的和。

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
// Split Array Largest Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func splitArray(nums []int, k int) int {
	left, right := 0, 0
	for _, x := range nums {
		left = max(left, x)
		right += x
	}
	return left + sort.Search(right-left, func(mx int) bool {
		mx += left
		s, cnt := 1<<30, 0
		for _, x := range nums {
			s += x
			if s > mx {
				s = x
				cnt++
			}
		}
		return cnt <= k
	})
}
```

### Java

```java
// Split Array Largest Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int splitArray(int[] nums, int k) {
        int left = 0, right = 0;
        for (int x : nums) {
            left = Math.max(left, x);
            right += x;
        }
        while (left < right) {
            int mid = (left + right) >> 1;
            if (check(nums, mid, k)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }

    private boolean check(int[] nums, int mx, int k) {
        int s = 1 << 30, cnt = 0;
        for (int x : nums) {
            s += x;
            if (s > mx) {
                ++cnt;
                s = x;
            }
        }
        return cnt <= k;
    }
}
```

### Python

```python
# Split Array Largest Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def check(mx):
            s, cnt = inf, 0
            for x in nums:
                s += x
                if s > mx:
                    s = x
                    cnt += 1
            return cnt <= k

        left, right = max(nums), sum(nums)
        return left + bisect_left(range(left, right + 1), True, key=check)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0259. 3Sum Smaller

---
编号: 259
题目: 3Sum Smaller
难度: 中等
标签: [数组, 双指针, 二分查找, 排序]
来源链接: https://leetcode.com/problems/3sum-smaller/
---

## 题目描述

给定一个长度为 `n` 的整数数组和一个目标值 `target` ，寻找能够使条件 `nums[i] + nums[j] + nums[k] < target` 成立的三元组  `i, j, k` 个数（`0 <= i < j < k < n`）。

**示例 1：**

```text
输入: nums = [-2,0,1,3], target = 2
输出: 2
解释: 因为一共有两个三元组满足累加和小于 2:
     [-2,0,1]
     [-2,0,3]
```

**示例 2：**

```text
输入: nums = [], target = 0
输出: 0
```

**示例 3：**

```text
输入: nums = [0], target = 0
输出: 0
```

**提示:**

- `n == nums.length`

- `0 <= n <= 3500`

- `-100 <= nums[i] <= 100`

- `-100 <= target <= 100`

- 输入保证答案小于或等于 10^9。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于元素的顺序不影响结果，我们可以先对数组进行排序，然后使用双指针的方法来解决这个问题。

我们先将数组排序，然后枚举第一个元素 $\textit{nums}[i]$，并在 $\textit{nums}[i+1:n-1]$ 的区间内使用双指针分别指向 $\textit{nums}[j]$ 和 $\textit{nums}[k]$，其中 $j$ 是 $\textit{nums}[i]$ 的下一个元素，而 $k$ 是数组的最后一个元素。

- 如果 $\textit{nums}[i] + \textit{nums}[j] + \textit{nums}[k] < \textit{target}$，那么对于任意 $j \lt k' \leq k$ 的元素，都有 $\textit{nums}[i] + \textit{nums}[j] + \textit{nums}[k'] \lt \textit{target}$，一共有 $k - j$ 个这样的 $k'$，我们将 $k - j$ 累加到答案中。接下来，将 $j$ 右移一个位置，继续寻找下一个满足条件的 $k$，直到 $j \geq k$ 为止。
- 如果 $\textit{nums}[i] + \textit{nums}[j] + \textit{nums}[k] \geq \textit{target}$，那么对于任意 $j \leq j' \lt k$ 的元素，都不可能使得 $\textit{nums}[i] + \textit{nums}[j'] + \textit{nums}[k] \lt \textit{target}$，因此我们将 $k$ 左移一个位置，继续寻找下一个满足条件的 $k$，直到 $j \geq k$ 为止。

枚举完所有的 $i$ 后，我们就得到了满足条件的三元组的个数。

时间复杂度 $O(n^2)$，空间复杂度 $O(\log n)$。其中 $n$ 是数组 $\textit{nums}$ 的长度。

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
// 3Sum Smaller：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func threeSumSmaller(nums []int, target int) (ans int) {
	sort.Ints(nums)
	n := len(nums)
	for i := 0; i < n-2; i++ {
		j, k := i+1, n-1
		for j < k {
			x := nums[i] + nums[j] + nums[k]
			if x < target {
				ans += k - j
				j++
			} else {
				k--
			}
		}
	}
	return
}
```

### Java

```java
import java.util.*;
// 3Sum Smaller：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int threeSumSmaller(int[] nums, int target) {
        Arrays.sort(nums);
        int ans = 0, n = nums.length;
        for (int i = 0; i + 2 < n; ++i) {
            int j = i + 1, k = n - 1;
            while (j < k) {
                int x = nums[i] + nums[j] + nums[k];
                if (x < target) {
                    ans += k - j;
                    ++j;
                } else {
                    --k;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# 3Sum Smaller：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def threeSumSmaller(self, nums: List[int], target: int) -> int:
        nums.sort()
        ans, n = 0, len(nums)
        for i in range(n - 2):
            j, k = i + 1, n - 1
            while j < k:
                x = nums[i] + nums[j] + nums[k]
                if x < target:
                    ans += k - j
                    j += 1
                else:
                    k -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

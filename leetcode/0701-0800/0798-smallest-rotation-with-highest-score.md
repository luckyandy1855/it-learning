# 0798. Smallest Rotation with Highest Score

---
编号: 798
题目: Smallest Rotation with Highest Score
难度: 困难
标签: [数组, 前缀和]
来源链接: https://leetcode.com/problems/smallest-rotation-with-highest-score/
---

## 题目描述

给你一个数组 `nums`，我们可以将它按一个非负整数 `k` 进行轮调，这样可以使数组变为 `[nums[k], nums[k + 1], ... nums[nums.length - 1], nums[0], nums[1], ..., nums[k-1]]` 的形式。此后，任何值小于或等于其索引的项都可以记作一分。

- 例如，数组为 `nums = [2,4,1,3,0]`，我们按 `k = 2` 进行轮调后，它将变成 `[1,3,0,2,4]`。这将记为 `3` 分，因为 `1 > 0` [不计分]、`3 > 1` [不计分]、`0 <= 2` [计 1 分]、`2 <= 3` [计 1 分]，`4 <= 4` [计 1 分]。

在所有可能的轮调中，返回我们所能得到的最高分数对应的轮调下标 `k` 。如果有多个答案，返回满足条件的最小的下标 `k` 。

**示例 1：**

```text
输入：nums = [2,3,1,4,0]
输出：3
解释：
下面列出了每个 k 的得分：
k = 0,  nums = [2,3,1,4,0],    score 2
k = 1,  nums = [3,1,4,0,2],    score 3
k = 2,  nums = [1,4,0,2,3],    score 3
k = 3,  nums = [4,0,2,3,1],    score 4
k = 4,  nums = [0,2,3,1,4],    score 3
所以我们应当选择 k = 3，得分最高。
```

**示例 2：**

```text
输入：nums = [1,3,0,2,4]
输出：0
解释：
nums 无论怎么变化总是有 3 分。
所以我们将选择最小的 k，即 0。
```

**提示：**

- `1 <= nums.length <= 10^5`

- `0 <= nums[i] < nums.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于每个数，都有一个固定的 k 生效区间。我们先利用差分，预处理每个数的 k 生效区间。有最多个数能覆盖到的 k 即是答案。

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
// Smallest Rotation with Highest Score：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func bestRotation(nums []int) int {
	n := len(nums)
	d := make([]int, n)
	for i, v := range nums {
		l, r := (i+1)%n, (n+i+1-v)%n
		d[l]++
		d[r]--
	}
	mx, ans, s := -1, n, 0
	for k, t := range d {
		s += t
		if s > mx {
			mx = s
			ans = k
		}
	}
	return ans
}
```

### Java

```java
// Smallest Rotation with Highest Score：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int bestRotation(int[] nums) {
        int n = nums.length;
        int[] d = new int[n];
        for (int i = 0; i < n; ++i) {
            int l = (i + 1) % n;
            int r = (n + i + 1 - nums[i]) % n;
            ++d[l];
            --d[r];
        }
        int mx = -1;
        int s = 0;
        int ans = n;
        for (int k = 0; k < n; ++k) {
            s += d[k];
            if (s > mx) {
                mx = s;
                ans = k;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Smallest Rotation with Highest Score：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def bestRotation(self, nums: List[int]) -> int:
        n = len(nums)
        mx, ans = -1, n
        d = [0] * n
        for i, v in enumerate(nums):
            l, r = (i + 1) % n, (n + i + 1 - v) % n
            d[l] += 1
            d[r] -= 1
        s = 0
        for k, t in enumerate(d):
            s += t
            if s > mx:
                mx = s
                ans = k
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

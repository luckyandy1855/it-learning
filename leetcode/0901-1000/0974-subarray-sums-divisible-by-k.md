# 0974. Subarray Sums Divisible by K

---
编号: 974
题目: Subarray Sums Divisible by K
难度: 中等
标签: [数组, 哈希表, 前缀和]
来源链接: https://leetcode.com/problems/subarray-sums-divisible-by-k/
---

## 题目描述

给定一个整数数组 `nums` 和一个整数 `k` ，返回其中元素之和可被 `k` 整除的非空 **子数组** 的数目。

**子数组** 是数组中 **连续** 的部分。

**示例 1：**

```text
输入：nums = [4,5,0,-2,-3,1], k = 5
输出：7
解释：
有 7 个子数组满足其元素之和可被 k = 5 整除：
[4, 5, 0, -2, -3, 1], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3]
```

**示例 2:**

```text
输入: nums = [5], k = 9
输出: 0
```

**提示:**

- `1 <= nums.length <= 3 * 10^4`

- `-10^4 <= nums[i] <= 10^4`

- `2 <= k <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

假设存在 $i \leq j$，使得 $\textit{nums}[i,..j]$ 的和能被 $k$ 整除，如果我们令 $s_i$ 表示 $\textit{nums}[0,..i]$ 的和，令 $s_j$ 表示 $\textit{nums}[0,..j]$ 的和，那么 $s_j - s_i$ 能被 $k$ 整除，即 $(s_j - s_i) \bmod k = 0$，也即 $s_j \bmod k = s_i \bmod k$。因此，我们可以用哈希表统计前缀和模 $k$ 的值的个数，从而快速判断是否存在满足条件的子数组。

我们用一个哈希表 $\textit{cnt}$ 统计前缀和模 $k$ 的值的个数，即 $\textit{cnt}[i]$ 表示前缀和模 $k$ 的值为 $i$ 的个数。初始时 $\textit{cnt}[0]=1$。用变量 $s$ 表示前缀和，初始时 $s = 0$。

接下来，从左到右遍历数组 $\textit{nums}$，对于遍历到的每个元素 $x$，我们计算 $s = (s + x) \bmod k$，然后更新答案 $\textit{ans} = \textit{ans} + \textit{cnt}[s]$，其中 $\textit{cnt}[s]$ 表示前缀和模 $k$ 的值为 $s$ 的个数。最后我们将 $\textit{cnt}[s]$ 的值加 $1$，继续遍历下一个元素。

最终，我们返回答案 $\textit{ans}$。

> 注意，由于 $s$ 的值可能为负数，因此我们可以将 $s$ 模 $k$ 的结果加上 $k$，再对 $k$ 取模，以确保 $s$ 的值为非负数。

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
// Subarray Sums Divisible by K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func subarraysDivByK(nums []int, k int) (ans int) {
	cnt := map[int]int{0: 1}
	s := 0
	for _, x := range nums {
		s = ((s+x)%k + k) % k
		ans += cnt[s]
		cnt[s]++
	}
	return
}
```

### Java

```java
// Subarray Sums Divisible by K：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int subarraysDivByK(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        cnt.put(0, 1);
        int ans = 0, s = 0;
        for (int x : nums) {
            s = ((s + x) % k + k) % k;
            ans += cnt.getOrDefault(s, 0);
            cnt.merge(s, 1, Integer::sum);
        }
        return ans;
    }
}
```

### Python

```python
# Subarray Sums Divisible by K：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def subarraysDivByK(self, nums: List[int], k: int) -> int:
        cnt = Counter({0: 1})
        ans = s = 0
        for x in nums:
            s = (s + x) % k
            ans += cnt[s]
            cnt[s] += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

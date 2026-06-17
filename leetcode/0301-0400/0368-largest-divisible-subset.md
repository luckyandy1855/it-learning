# 0368. Largest Divisible Subset

---
编号: 368
题目: Largest Divisible Subset
难度: 中等
标签: [数组, 数学, 动态规划, 排序]
来源链接: https://leetcode.com/problems/largest-divisible-subset/
---

## 题目描述

给你一个由 **无重复** 正整数组成的集合 `nums` ，请你找出并返回其中最大的整除子集 `answer` ，子集中每一元素对 `(answer[i], answer[j])` 都应当满足：

	- `answer[i] % answer[j] == 0` ，或

	- `answer[j] % answer[i] == 0`

如果存在多个有效解子集，返回其中任何一个均可。

**示例 1：**

```text
输入：nums = [1,2,3]
输出：[1,2]
解释：[1,3] 也会被视为正确答案。
```

**示例 2：**

```text
输入：nums = [1,2,4,8]
输出：[1,2,4,8]
```

**提示：**

	- `1 <= nums.length <= 1000`

	- `1 <= nums[i] <= 2 * 10^9`

	- `nums` 中的所有整数 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先对数组进行排序，这样可以保证对于任意的 $i \lt j$，如果 $nums[i]$ 可以整除 $nums[j]$，那么 $nums[i]$ 一定在 $nums[j]$ 的左边。

接下来，我们定义 $f[i]$ 表示以 $nums[i]$ 为最大元素的最大整除子集的大小，初始时 $f[i]=1$。

对于每一个 $i$，我们从左往右枚举 $j$，如果 $nums[i]$ 可以被 $nums[j]$ 整除，那么 $f[i]$ 可以从 $f[j]$ 转移而来，我们更新 $f[i]=max(f[i], f[j]+1)$。过程中，我们记录 $f[i]$ 的最大值的下标 $k$ 以及对应的子集大小 $m$。

最后，我们从 $k$ 开始倒序遍历，如果 $nums[k]$ 可以被 $nums[i]$ 整除，且 $f[i]=m$，那么 $nums[i]$ 就是一个整除子集的元素，我们将 $nums[i]$ 加入答案，并将 $m$ 减 $1$，同时更新 $k=i$。继续倒序遍历，直到 $m=0$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 是数组的长度。

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
// Largest Divisible Subset：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestDivisibleSubset(nums []int) (ans []int) {
	sort.Ints(nums)
	n := len(nums)
	f := make([]int, n)
	k := 0
	for i := 0; i < n; i++ {
		f[i] = 1
		for j := 0; j < i; j++ {
			if nums[i]%nums[j] == 0 {
				f[i] = max(f[i], f[j]+1)
			}
		}
		if f[k] < f[i] {
			k = i
		}
	}
	m := f[k]
	for i := k; m > 0; i-- {
		if nums[k]%nums[i] == 0 && f[i] == m {
			ans = append(ans, nums[i])
			k = i
			m--
		}
	}
	return
}
```

### Java

```java
// Largest Divisible Subset：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> largestDivisibleSubset(int[] nums) {
        Arrays.sort(nums);
        int n = nums.length;
        int[] f = new int[n];
        Arrays.fill(f, 1);
        int k = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                if (nums[i] % nums[j] == 0) {
                    f[i] = Math.max(f[i], f[j] + 1);
                }
            }
            if (f[k] < f[i]) {
                k = i;
            }
        }
        int m = f[k];
        List<Integer> ans = new ArrayList<>();
        for (int i = k; m > 0; --i) {
            if (nums[k] % nums[i] == 0 && f[i] == m) {
                ans.add(nums[i]);
                k = i;
                --m;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Largest Divisible Subset：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestDivisibleSubset(self, nums: List[int]) -> List[int]:
        nums.sort()
        n = len(nums)
        f = [1] * n
        k = 0
        for i in range(n):
            for j in range(i):
                if nums[i] % nums[j] == 0:
                    f[i] = max(f[i], f[j] + 1)
            if f[k] < f[i]:
                k = i
        m = f[k]
        i = k
        ans = []
        while m:
            if nums[k] % nums[i] == 0 and f[i] == m:
                ans.append(nums[i])
                k, m = i, m - 1
            i -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

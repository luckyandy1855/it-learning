# 1296. Divide Array in Sets of K Consecutive Numbers

---
编号: 1296
题目: Divide Array in Sets of K Consecutive Numbers
难度: 中等
标签: [贪心, 数组, 哈希表, 排序]
来源链接: https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/
---

## 题目描述

给你一个整数数组 `nums` 和一个正整数 `k`，请你判断是否可以把这个数组划分成一些由 `k` 个连续数字组成的集合。

如果可以，请返回 `true`；否则，返回 `false`。

**示例 1：**

```text
输入：nums = [1,2,3,3,4,4,5,6], k = 4
输出：true
解释：数组可以分成 [1,2,3,4] 和 [3,4,5,6]。
```

**示例 2：**

```text
输入：nums = [3,2,1,2,3,4,3,4,5,9,10,11], k = 3
输出：true
解释：数组可以分成 [1,2,3] , [2,3,4] , [3,4,5] 和 [9,10,11]。
```

**示例 4：**

```text
输入：nums = [1,2,3,4], k = 3
输出：false
解释：数组不能分成几个大小为 3 的子数组。
```

**提示：**

- `1 https://leetcode.cn/problems/hand-of-straights/

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断数组 $\textit{nums}$ 的长度是否能被 $\textit{k}$ 整除，如果不能整除，说明无法将数组划分成若干个长度为 $\textit{k}$ 的子数组，直接返回 $\text{false}$。

接下来，我们用一个哈希表 $\textit{cnt}$ 统计数组 $\textit{nums}$ 中每个数字出现的次数，然后对数组 $\textit{nums}$ 进行排序。

然后，我们遍历排序后的数组 $\textit{nums}$，对于每个数字 $x$，如果 $\textit{cnt}[x]$ 不为 $0$，我们枚举 $x$ 到 $x+\textit{k}-1$ 的每个数字 $y$，如果 $\textit{cnt}[y]$ 为 $0$，说明无法将数组划分成若干个长度为 $\textit{k}$ 的子数组，直接返回 $\text{false}$。否则，我们将 $\textit{cnt}[y]$ 减 $1$。

遍历结束后，说明可以将数组划分成若干个长度为 $\textit{k}$ 的子数组，返回 $\text{true}$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $\textit{nums}$ 的长度。

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
// Divide Array in Sets of K Consecutive Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isPossibleDivide(nums []int, k int) bool {
	if len(nums)%k != 0 {
		return false
	}
	sort.Ints(nums)
	cnt := map[int]int{}
	for _, x := range nums {
		cnt[x]++
	}
	for _, x := range nums {
		if cnt[x] > 0 {
			for y := x; y < x+k; y++ {
				if cnt[y] == 0 {
					return false
				}
				cnt[y]--
			}
		}
	}
	return true
}
```

### Java

```java
// Divide Array in Sets of K Consecutive Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isPossibleDivide(int[] nums, int k) {
        if (nums.length % k != 0) {
            return false;
        }
        Arrays.sort(nums);
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) {
            cnt.merge(x, 1, Integer::sum);
        }
        for (int x : nums) {
            if (cnt.getOrDefault(x, 0) > 0) {
                for (int y = x; y < x + k; ++y) {
                    if (cnt.merge(y, -1, Integer::sum) < 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
```

### Python

```python
# Divide Array in Sets of K Consecutive Numbers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isPossibleDivide(self, nums: List[int], k: int) -> bool:
        if len(nums) % k:
            return False
        cnt = Counter(nums)
        for x in sorted(nums):
            if cnt[x]:
                for y in range(x, x + k):
                    if cnt[y] == 0:
                        return False
                    cnt[y] -= 1
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

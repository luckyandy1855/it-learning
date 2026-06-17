# 0594. Longest Harmonious Subsequence

---
编号: 594
题目: Longest Harmonious Subsequence
难度: 简单
标签: [数组, 哈希表, 计数, 排序, 滑动窗口]
来源链接: https://leetcode.com/problems/longest-harmonious-subsequence/
---

## 题目描述

和谐数组是指一个数组里元素的最大值和最小值之间的差别 **正好是 `1`** 。

给你一个整数数组 `nums` ，请你在所有可能的 子序列 中找到最长的和谐子序列的长度。

数组的 **子序列** 是一个由数组派生出来的序列，它可以通过删除一些元素或不删除元素、且不改变其余元素的顺序而得到。

示例 1：

**输入：**nums = [1,3,2,2,5,2,3,7]

输出：5

**解释：**

最长和谐子序列是 `[3,2,2,2,3]`。

示例 2：

输入：nums = [1,2,3,4]

输出：2

**解释：**

最长和谐子序列是 `[1,2]`，`[2,3]` 和 `[3,4]`，长度都为 2。

示例 3：

**输入：**nums = [1,1,1,1]

输出：0

**解释：**

不存在和谐子序列。

**提示：**

- `1 <= nums.length <= 2 * 10^4`

- `-10^9 <= nums[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 计数, 排序, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $\textit{cnt}$ 记录数组 $\textit{nums}$ 中每个元素出现的次数，然后遍历哈希表中的每个键值对 $(x, c)$，如果哈希表中存在键 $x + 1$，那么 $\textit{nums}$ 中元素 $x$ 和 $x + 1$ 出现的次数之和 $c + \textit{cnt}[x + 1]$ 就是一个和谐子序列，我们只需要在所有和谐子序列中找到最大的长度即可。

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
// Longest Harmonious Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findLHS(nums []int) (ans int) {
	cnt := map[int]int{}
	for _, x := range nums {
		cnt[x]++
	}
	for x, c := range cnt {
		if c1, ok := cnt[x+1]; ok {
			ans = max(ans, c+c1)
		}
	}
	return
}
```

### Java

```java
// Longest Harmonious Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findLHS(int[] nums) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) {
            cnt.merge(x, 1, Integer::sum);
        }
        int ans = 0;
        for (var e : cnt.entrySet()) {
            int x = e.getKey(), c = e.getValue();
            if (cnt.containsKey(x + 1)) {
                ans = Math.max(ans, c + cnt.get(x + 1));
            }
        }
        return ans;
    }
}
```

### Python

```python
# Longest Harmonious Subsequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findLHS(self, nums: List[int]) -> int:
        cnt = Counter(nums)
        return max((c + cnt[x + 1] for x, c in cnt.items() if cnt[x + 1]), default=0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

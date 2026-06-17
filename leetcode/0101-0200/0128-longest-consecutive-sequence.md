# 0128. Longest Consecutive Sequence

---
编号: 128
题目: Longest Consecutive Sequence
难度: 中等
标签: [并查集, 数组, 哈希表]
来源链接: https://leetcode.com/problems/longest-consecutive-sequence/
---

## 题目描述

给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 `O(n)`* *的算法解决此问题。

**示例 1：**

```text
输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
```

**示例 2：**

```text
输入：nums = [0,3,7,2,5,8,4,6,0,1]
输出：9
```

示例 3：

```text
输入：nums = [1,0,1,2]
输出：3
```

**提示：**

	- `0 <= nums.length <= 10^5`

	- `-10^9 <= nums[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $\textit{s}$ 存储数组中所有的元素，用一个变量 $\textit{ans}$ 记录最长连续序列的长度，用一个哈希表 $\textit{d}$ 记录每个元素 $x$ 所在的连续序列的长度。

接下来，我们遍历数组中每个元素 $x$，用一个临时变量 $y$ 记录当前连续序列的最大值，初始时 $y = x$。然后，我们不断尝试匹配 $y+1, y+2, y+3, \dots$，直到匹配不到为止，过程中将匹配到的元素从哈希表 $\textit{s}$ 中移除。那么，当前元素 $x$ 所在的连续序列的长度即为 $d[x] = d[y] + y - x$，然后更新答案 $\textit{ans} = \max(\textit{ans}, d[x])$。

遍历结束后，返回答案 $\textit{ans}$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $\textit{nums}$ 的长度。

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
// Longest Consecutive Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestConsecutive(nums []int) (ans int) {
	s := map[int]bool{}
	for _, x := range nums {
		s[x] = true
	}
	d := map[int]int{}
	for _, x := range nums {
		y := x
		for s[y] {
			delete(s, y)
			y++
		}
		d[x] = d[y] + y - x
		ans = max(ans, d[x])
	}
	return
}
```

### Java

```java
// Longest Consecutive Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) {
            s.add(x);
        }
        int ans = 0;
        Map<Integer, Integer> d = new HashMap<>();
        for (int x : nums) {
            int y = x;
            while (s.contains(y)) {
                s.remove(y++);
            }
            d.put(x, d.getOrDefault(y, 0) + y - x);
            ans = Math.max(ans, d.get(x));
        }
        return ans;
    }
}
```

### Python

```python
# Longest Consecutive Sequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        ans = 0
        d = defaultdict(int)
        for x in nums:
            y = x
            while y in s:
                s.remove(y)
                y += 1
            d[x] = d[y] + y - x
            ans = max(ans, d[x])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

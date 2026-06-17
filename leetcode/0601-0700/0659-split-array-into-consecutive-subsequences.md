# 0659. Split Array into Consecutive Subsequences

---
编号: 659
题目: Split Array into Consecutive Subsequences
难度: 中等
标签: [贪心, 数组, 哈希表, 堆（优先队列）]
来源链接: https://leetcode.com/problems/split-array-into-consecutive-subsequences/
---

## 题目描述

给你一个按 **非递减顺序** 排列的整数数组 `nums` 。

请你判断是否能在将 `nums` 分割成 **一个或多个子序列** 的同时满足下述 **两个** 条件：

- 每个子序列都是一个 **连续递增序列**（即，每个整数 **恰好** 比前一个整数大 **1** ）。

- 所有子序列的长度 **至少** 为 `3`** **。

如果可以分割 `nums` 并满足上述条件，则返回 `true` ；否则，返回 `false` 。

示例 1：

```text
输入：nums = [1,2,3,3,4,5]
输出：true
解释：nums 可以分割成以下子序列：
[1,2,3,3,4,5] --> 1, 2, 3
[1,2,3,3,4,5] --> 3, 4, 5
```

示例 2：

```text
输入：nums = [1,2,3,3,4,4,5,5]
输出：true
解释：nums 可以分割成以下子序列：
[1,2,3,3,4,4,5,5] --> 1, 2, 3, 4, 5
[1,2,3,3,4,4,5,5] --> 3, 4, 5
```

示例 3：

```text
输入：nums = [1,2,3,4,4,5]
输出：false
解释：无法将 nums 分割成长度至少为 3 的连续递增子序列。
```

提示：

- `1 <= nums.length <= 10^4`

- `-1000 <= nums[i] <= 1000`

- `nums` 按非递减顺序排列

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于题目中的子序列是由连续整数组成的，因此，只要知道子序列的最后一个数以及子序列的长度，就能够确定子序列。

我们可以使用哈希表存储每个子序列的最后一个数，使用优先队列存储当前数作为子序列的末尾时，子序列的长度。我们要优先选择长度较短的子序列，因此使用小根堆。

遍历数组 `nums`，对于当前遍历到的数 `num`，如果 `num` 不能加入到任何子序列中，那么我们就创建一个新的子序列，长度为 1；否则，我们就将 `num` 加入到某个子序列中，具体的子序列是哪个呢？我们可以从 `num - 1` 对应的子序列中取出一个长度最短的子序列，将 `num` 加入到该子序列中，然后将该子序列的最后一个数更新为 `num`，同时将该子序列的长度加 1。

如果我们遍历完数组 `nums`，优先队列中所有的子序列的长度都不小于 3，那么我们就可以将数组 `nums` 分割成若干个子序列，否则，我们就无法将数组 `nums` 分割成若干个子序列。

时间复杂度 $O(n\log n)$，其中 $n$ 是数组 `nums` 的长度。空间复杂度 $O(n)$。

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
// Split Array into Consecutive Subsequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isPossible(nums []int) bool {
	d := map[int]*hp{}
	for _, v := range nums {
		if d[v] == nil {
			d[v] = new(hp)
		}
		if h := d[v-1]; h != nil {
			heap.Push(d[v], heap.Pop(h).(int)+1)
			if h.Len() == 0 {
				delete(d, v-1)
			}
		} else {
			heap.Push(d[v], 1)
		}
	}
	for _, q := range d {
		if q.IntSlice[0] < 3 {
			return false
		}
	}
	return true
}

type hp struct{ sort.IntSlice }

func (h *hp) Push(v any) { h.IntSlice = append(h.IntSlice, v.(int)) }
func (h *hp) Pop() any {
	a := h.IntSlice
	v := a[len(a)-1]
	h.IntSlice = a[:len(a)-1]
	return v
}
```

### Java

```java
// Split Array into Consecutive Subsequences：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isPossible(int[] nums) {
        Map<Integer, PriorityQueue<Integer>> d = new HashMap<>();
        for (int v : nums) {
            if (d.containsKey(v - 1)) {
                var q = d.get(v - 1);
                d.computeIfAbsent(v, k -> new PriorityQueue<>()).offer(q.poll() + 1);
                if (q.isEmpty()) {
                    d.remove(v - 1);
                }
            } else {
                d.computeIfAbsent(v, k -> new PriorityQueue<>()).offer(1);
            }
        }
        for (var v : d.values()) {
            if (v.peek() < 3) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Split Array into Consecutive Subsequences：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isPossible(self, nums: List[int]) -> bool:
        d = defaultdict(list)
        for v in nums:
            if h := d[v - 1]:
                heappush(d[v], heappop(h) + 1)
            else:
                heappush(d[v], 1)
        return all(not v or v and v[0] > 2 for v in d.values())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1481. Least Number of Unique Integers after K Removals

---
编号: 1481
题目: Least Number of Unique Integers after K Removals
难度: 中等
标签: [贪心, 数组, 哈希表, 计数, 排序]
来源链接: https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/
---

## 题目描述

给你一个整数数组 `arr` 和一个整数 `k` 。现需要从数组中恰好移除 `k` 个元素，请找出移除后数组中不同整数的最少数目。

**示例 1：**

```text
输入：arr = [5,5,4], k = 1
输出：1
解释：移除 1 个 4 ，数组中只剩下 5 一种整数。
```

**示例 2：**

```text
输入：arr = [4,3,1,1,3,3,2], k = 3
输出：2
解释：先移除 4、2 ，然后再移除两个 1 中的任意 1 个或者三个 3 中的任意 1 个，最后剩下 1 和 3 两种整数。
```

**提示：**

- `1 <= arr.length <= 10^5`

- `1 <= arr[i] <= 10^9`

- `0 <= k <= arr.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 计数, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 $cnt$ 统计数组 $arr$ 中每个整数出现的次数，然后将 $cnt$ 中的值按照从小到大的顺序排序，记录在数组 $nums$ 中。

接下来，我们遍历数组 $nums$，对于当前遍历到的每个值 $nums[i]$，我们将 $k$ 减去 $nums[i]$，如果 $k \lt 0$，则说明我们已经移除了 $k$ 个元素，此时数组中不同整数的最少数目为 $nums$ 的长度减去当前遍历到的下标 $i$，直接返回即可。

若遍历结束，说明我们移除了所有的元素，此时数组中不同整数的最少数目为 $0$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $arr$ 的长度。

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
// Least Number of Unique Integers after K Removals：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findLeastNumOfUniqueInts(arr []int, k int) int {
	cnt := map[int]int{}
	for _, x := range arr {
		cnt[x]++
	}
	nums := make([]int, 0, len(cnt))
	for _, v := range cnt {
		nums = append(nums, v)
	}
	sort.Ints(nums)
	for i, v := range nums {
		k -= v
		if k < 0 {
			return len(nums) - i
		}
	}
	return 0
}
```

### Java

```java
// Least Number of Unique Integers after K Removals：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findLeastNumOfUniqueInts(int[] arr, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : arr) {
            cnt.merge(x, 1, Integer::sum);
        }
        List<Integer> nums = new ArrayList<>(cnt.values());
        Collections.sort(nums);
        for (int i = 0, m = nums.size(); i < m; ++i) {
            k -= nums.get(i);
            if (k < 0) {
                return m - i;
            }
        }
        return 0;
    }
}
```

### Python

```python
# Least Number of Unique Integers after K Removals：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findLeastNumOfUniqueInts(self, arr: List[int], k: int) -> int:
        cnt = Counter(arr)
        for i, v in enumerate(sorted(cnt.values())):
            k -= v
            if k < 0:
                return len(cnt) - i
        return 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0350. Intersection of Two Arrays II

---
编号: 350
题目: Intersection of Two Arrays II
难度: 简单
标签: [数组, 哈希表, 双指针, 二分查找, 排序]
来源链接: https://leetcode.com/problems/intersection-of-two-arrays-ii/
---

## 题目描述

给你两个整数数组 `nums1` 和 `nums2` ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。

**示例 1：**

```text
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2,2]
```

**示例 2:**

```text
输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[4,9]
```

**提示：**

	- `1 进阶**：

	- 如果给定的数组已经排好序呢？你将如何优化你的算法？

	- 如果 `nums1`* *的大小比 `nums2` 小，哪种方法更优？

	- 如果 `nums2`* *的元素存储在磁盘上，内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 双指针, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $\textit{cnt}$ 统计数组 $\textit{nums1}$ 中每个元素出现的次数，然后遍历数组 $\textit{nums2}$，如果元素 $x$ 在 $\textit{cnt}$ 中，并且 $x$ 的出现次数大于 $0$，那么将 $x$ 加入答案，然后将 $x$ 的出现次数减一。

遍历结束后，返回答案数组即可。

时间复杂度 $O(m + n)$，空间复杂度 $O(m)$。其中 $m$ 和 $n$ 分别是数组 $\textit{nums1}$ 和 $\textit{nums2}$ 的长度。

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
// Intersection of Two Arrays II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func intersect(nums1 []int, nums2 []int) (ans []int) {
	cnt := map[int]int{}
	for _, x := range nums1 {
		cnt[x]++
	}
	for _, x := range nums2 {
		if cnt[x] > 0 {
			ans = append(ans, x)
			cnt[x]--
		}
	}
	return
}
```

### Java

```java
// Intersection of Two Arrays II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        int[] cnt = new int[1001];
        for (int x : nums1) {
            ++cnt[x];
        }
        List<Integer> ans = new ArrayList<>();
        for (int x : nums2) {
            if (cnt[x]-- > 0) {
                ans.add(x);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

### Python

```python
# Intersection of Two Arrays II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def intersect(self, nums1: List[int], nums2: List[int]) -> List[int]:
        cnt = Counter(nums1)
        ans = []
        for x in nums2:
            if cnt[x]:
                ans.append(x)
                cnt[x] -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

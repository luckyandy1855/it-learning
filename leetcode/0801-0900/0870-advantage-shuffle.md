# 0870. Advantage Shuffle

---
编号: 870
题目: Advantage Shuffle
难度: 中等
标签: [贪心, 数组, 双指针, 排序]
来源链接: https://leetcode.com/problems/advantage-shuffle/
---

## 题目描述

给定两个长度相等的数组 `nums1` 和 `nums2`，`nums1` 相对于 `nums2` 的*优势*可以用满足 `nums1[i] > nums2[i]` 的索引 `i` 的数目来描述。

返回 `nums1` 的 **任意 **排列，使其相对于 `nums2` 的优势最大化。

**示例 1：**

```text
输入：nums1 = [2,7,11,15], nums2 = [1,10,4,11]
输出：[2,11,7,15]
```

**示例 2：**

```text
输入：nums1 = [12,24,8,32], nums2 = [13,25,32,11]
输出：[24,32,8,12]
```

**提示：**

- `1 <= nums1.length <= 10^5`

- `nums2.length == nums1.length`

- `0 <= nums1[i], nums2[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 双指针, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

类似田忌赛马。将 $nums1$, $nums2$ 按照升序排列。然后遍历 $nums1$ 中的每个元素 $v$，若在 $nums2[i..j]$ 中找不到比 $v$ 小的，则将 $v$ 与当前 $nums2[i..j]$ 中的最大元素匹配。

时间复杂度 $O(nlogn)$。

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
// Advantage Shuffle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func advantageCount(nums1 []int, nums2 []int) []int {
	n := len(nums1)
	t := make([][]int, n)
	for i, v := range nums2 {
		t[i] = []int{v, i}
	}
	sort.Slice(t, func(i, j int) bool {
		return t[i][0] < t[j][0]
	})
	sort.Ints(nums1)
	ans := make([]int, n)
	i, j := 0, n-1
	for _, v := range nums1 {
		if v <= t[i][0] {
			ans[t[j][1]] = v
			j--
		} else {
			ans[t[i][1]] = v
			i++
		}
	}
	return ans
}
```

### Java

```java
// Advantage Shuffle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] advantageCount(int[] nums1, int[] nums2) {
        int n = nums1.length;
        int[][] t = new int[n][2];
        for (int i = 0; i < n; ++i) {
            t[i] = new int[] {nums2[i], i};
        }
        Arrays.sort(t, (a, b) -> a[0] - b[0]);
        Arrays.sort(nums1);
        int[] ans = new int[n];
        int i = 0, j = n - 1;
        for (int v : nums1) {
            if (v <= t[i][0]) {
                ans[t[j--][1]] = v;
            } else {
                ans[t[i++][1]] = v;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Advantage Shuffle：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def advantageCount(self, nums1: List[int], nums2: List[int]) -> List[int]:
        nums1.sort()
        t = sorted((v, i) for i, v in enumerate(nums2))
        n = len(nums2)
        ans = [0] * n
        i, j = 0, n - 1
        for v in nums1:
            if v <= t[i][0]:
                ans[t[j][1]] = v
                j -= 1
            else:
                ans[t[i][1]] = v
                i += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

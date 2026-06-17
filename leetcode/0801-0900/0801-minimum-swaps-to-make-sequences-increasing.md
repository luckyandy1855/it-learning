# 0801. Minimum Swaps To Make Sequences Increasing

---
编号: 801
题目: Minimum Swaps To Make Sequences Increasing
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/
---

## 题目描述

我们有两个长度相等且不为空的整型数组 `nums1` 和 `nums2` 。在一次操作中，我们可以交换 `nums1[i]` 和 `nums2[i]`的元素。

- 例如，如果 `nums1 = [1,2,3,8]` ， `nums2 =[5,6,7,4]` ，你可以交换 `i = 3` 处的元素，得到 `nums1 =[1,2,3,4]` 和 `nums2 =[5,6,7,8]` 。

返回 *使 `nums1` 和 `nums2` **严格递增 **所需操作的最小次数* 。

数组 `arr` **严格递增** 且  `arr[0] 注意：

- 用例保证可以实现操作。

**示例 1:**

```text
输入: nums1 = [1,3,5,4], nums2 = [1,2,3,7]
输出: 1
解释:
交换 A[3] 和 B[3] 后，两个数组如下:
A = [1, 3, 5, 7] ， B = [1, 2, 3, 4]
两个数组均为严格递增的。
```

**示例 2:**

```text
输入: nums1 = [0,3,5,8,9], nums2 = [2,1,4,6,9]
输出: 1
```

**提示:**

- `2 <= nums1.length <= 10^5`

- `nums2.length == nums1.length`

- `0 <= nums1[i], nums2[i] <= 2 * 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

定义 $a$, $b$ 分别表示使得下标 $[0..i]$ 的元素序列严格递增，且第 $i$ 个元素不交换、交换的最小交换次数。下标从 $0$ 开始。

当 $i=0$ 时，有 $a = 0$, $b=1$。

当 $i\gt 0$ 时，我们先将此前 $a$, $b$ 的值保存在 $x$, $y$ 中，然后分情况讨论：

如果 $nums1[i - 1] \ge nums1[i]$ 或者 $nums2[i - 1] \ge nums2[i]$，为了使得两个序列均严格递增，下标 $i-1$ 和 $i$ 对应的元素的相对位置必须发生变化。也就是说，如果前一个位置交换了，那么当前位置不交换，因此有 $a = y$；如果前一个位置没有交换，那么当前位置必须交换，因此有 $b = x + 1$。

否则，下标 $i-1$ 和 $i$ 对应的元素的相对位置可以不发生变化，那么有 $b = y + 1$。另外，如果满足 $nums1[i - 1] \lt nums2[i]$ 并且 $nums2[i - 1] \lt nums1[i]$，那么下标 $i-1$ 和 $i$ 对应的元素的相对位置可以发生变化，此时 $a$ 和 $b$ 可以取较小值，因此有 $a = \min(a, y)$ 和 $b = \min(b, x + 1)$。

最后，返回 $a$ 和 $b$ 中较小值即可。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。

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
// Minimum Swaps To Make Sequences Increasing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minSwap(nums1 []int, nums2 []int) int {
	a, b, n := 0, 1, len(nums1)
	for i := 1; i < n; i++ {
		x, y := a, b
		if nums1[i-1] >= nums1[i] || nums2[i-1] >= nums2[i] {
			a, b = y, x+1
		} else {
			b = y + 1
			if nums1[i-1] < nums2[i] && nums2[i-1] < nums1[i] {
				a = min(a, y)
				b = min(b, x+1)
			}
		}
	}
	return min(a, b)
}
```

### Java

```java
// Minimum Swaps To Make Sequences Increasing：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minSwap(int[] nums1, int[] nums2) {
        int a = 0, b = 1;
        for (int i = 1; i < nums1.length; ++i) {
            int x = a, y = b;
            if (nums1[i - 1] >= nums1[i] || nums2[i - 1] >= nums2[i]) {
                a = y;
                b = x + 1;
            } else {
                b = y + 1;
                if (nums1[i - 1] < nums2[i] && nums2[i - 1] < nums1[i]) {
                    a = Math.min(a, y);
                    b = Math.min(b, x + 1);
                }
            }
        }
        return Math.min(a, b);
    }
}
```

### Python

```python
# Minimum Swaps To Make Sequences Increasing：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minSwap(self, nums1: List[int], nums2: List[int]) -> int:
        a, b = 0, 1
        for i in range(1, len(nums1)):
            x, y = a, b
            if nums1[i - 1] >= nums1[i] or nums2[i - 1] >= nums2[i]:
                a, b = y, x + 1
            else:
                b = y + 1
                if nums1[i - 1] < nums2[i] and nums2[i - 1] < nums1[i]:
                    a, b = min(a, y), min(b, x + 1)
        return min(a, b)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

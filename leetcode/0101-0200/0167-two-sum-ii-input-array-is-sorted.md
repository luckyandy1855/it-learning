# 0167. Two Sum II - Input Array Is Sorted

---
编号: 167
题目: Two Sum II - Input Array Is Sorted
难度: 中等
标签: [数组, 双指针, 二分查找]
来源链接: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
---

## 题目描述

给你一个下标从 **1** 开始的整数数组 `numbers` ，该数组已按*** *非递减顺序排列  **，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。如果设这两个数分别是 `numbers[index1]` 和 `numbers[index2]` ，则 `1 1 2 1, index2]` 的形式返回这两个整数的下标 `index1`* *和* *`index2`。

你可以假设每个输入 **只对应唯一的答案** ，而且你 **不可以** 重复使用相同的元素。

你所设计的解决方案必须只使用常量级的额外空间。

示例 1：

```text
输入：numbers = [2,7,11,15], target = 9
输出：[1,2]
解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。
```

示例 2：

```text
输入：numbers = [2,3,4], target = 6
输出：[1,3]
解释：2 与 4 之和等于目标数 6 。因此 index1 = 1, index2 = 3 。返回 [1, 3] 。
```

示例 3：

```text
输入：numbers = [-1,0], target = -1
输出：[1,2]
解释：-1 与 0 之和等于目标数 -1 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。
```

**提示：**

	- `2 <= numbers.length <= 3 * 10^4`

	- `-1000 <= numbers[i] <= 1000`

	- `numbers` 按 **非递减顺序** 排列

	- `-1000 <= target <= 1000`

	- **仅存在一个有效答案**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到数组按照非递减顺序排列，因此对于每个 $numbers[i]$，可以通过二分查找的方式找到 $target - numbers[i]$ 的位置，如果存在，那么返回 $[i + 1, j + 1]$ 即可。

时间复杂度 $O(n \times \log n)$，其中 $n$ 为数组 $numbers$ 的长度。空间复杂度 $O(1)$。

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
// Two Sum II - Input Array Is Sorted：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func twoSum(numbers []int, target int) []int {
	for i, n := 0, len(numbers); ; i++ {
		x := target - numbers[i]
		j := sort.SearchInts(numbers[i+1:], x) + i + 1
		if j < n && numbers[j] == x {
			return []int{i + 1, j + 1}
		}
	}
}
```

### Java

```java
// Two Sum II - Input Array Is Sorted：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        for (int i = 0, n = numbers.length;; ++i) {
            int x = target - numbers[i];
            int l = i + 1, r = n - 1;
            while (l < r) {
                int mid = (l + r) >> 1;
                if (numbers[mid] >= x) {
                    r = mid;
                } else {
                    l = mid + 1;
                }
            }
            if (numbers[l] == x) {
                return new int[] {i + 1, l + 1};
            }
        }
    }
}
```

### Python

```python
# Two Sum II - Input Array Is Sorted：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        n = len(numbers)
        for i in range(n - 1):
            x = target - numbers[i]
            j = bisect_left(numbers, x, lo=i + 1)
            if j < n and numbers[j] == x:
                return [i + 1, j + 1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

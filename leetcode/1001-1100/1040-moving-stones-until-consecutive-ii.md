# 1040. Moving Stones Until Consecutive II

---
编号: 1040
题目: Moving Stones Until Consecutive II
难度: 中等
标签: [数组, 数学, 排序, 滑动窗口]
来源链接: https://leetcode.com/problems/moving-stones-until-consecutive-ii/
---

## 题目描述

在 X 轴上有一些不同位置的石子。给定一个整数数组 `stones` 表示石子的位置。

如果一个石子在最小或最大的位置，称其为 **端点石子**。每个回合，你可以将一颗 **端点石子** 拿起并移动到一个未占用的位置，使得该石子不再是一颗 **端点石子**。

- 值得注意的是，如果石子像 `stones = [1,2,5]` 这样，你将 **无法 **移动位于位置 `5` 的端点石子，因为无论将它移动到任何位置（例如 `0` 或 `3`），该石子都仍然会是端点石子。

当你无法进行任何移动时，即，这些石子的位置连续时，游戏结束。

以长度为 2 的数组形式返回答案，其中：

- `answer[0]` 是你可以移动的最小次数

- `answer[1]` 是你可以移动的最大次数。

**示例 1：**

```text
输入：[7,4,9]
输出：[1,2]
解释：
我们可以移动一次，4 -> 8，游戏结束。
或者，我们可以移动两次 9 -> 5，4 -> 6，游戏结束。
```

**示例 2：**

```text
输入：[6,5,4,3,10]
输出：[2,3]
解释：
我们可以移动 3 -> 8，接着是 10 -> 7，游戏结束。
或者，我们可以移动 3 -> 7, 4 -> 8, 5 -> 9，游戏结束。
注意，我们无法进行 10 -> 2 这样的移动来结束游戏，因为这是不合要求的移动。
```

**提示：**

- `3 <= stones.length <= 10^4`

- `1 <= stones[i] <= 10^9`

- `stones` 的值各不相同。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 排序, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先对数组 `stones` 进行升序排序，接下来分别考虑最大移动次数 $mx$ 和最小移动次数 $mi$。

对于最大移动次数 $mx$：

由于我们每一次只能选择将端点石子移动到未占用且不是端点石子的位置，如果我们选择 `stones[0]` 作为第一次移动的端点石子，那么从 `stones[0]` 到 `stones[1]` 之间的所有未占用的位置都会被跳过，我们可以选择移动到最近的且未占用的位置，接下来每一次都将最左端的石子移动到最近的且未占用的位置，那么最多可以移动的次数为 $stones[n - 1] - stones[1] + 1 - (n - 1)$；同理，如果我们选择 `stones[n - 1]` 作为第一次移动的端点石子，那么最多可以移动的次数为 $stones[n - 2] - stones[0] + 1 - (n - 1)$。取两者的最大值即为最大移动次数 $mx$。

对于最小移动次数 $mi$：

我们用双指针 $i$ 和 $j$ 标识一个窗口的左右端点，若窗口内的位置数 $stones[j] - stones[i] + 1 \gt n$ 时，我们需要缩小窗口，即指针 $i$ 向右移动。如果此时窗口中有连续的 $n-1$ 个石子，即满足 $j - i + 1 = n - 1$ 且 $stones[j] - stones[i] + 1 = n - 1$，那么最少需要移动的次数为 $2$；否则，我们用 $n$ 减去窗口内的石子数，可以得到最少需要移动的次数，即 $n - (j - i + 1)$。取所有情况的最小值即为最小移动次数 $mi$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 为数组 `stones` 的长度。

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
// Moving Stones Until Consecutive II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numMovesStonesII(stones []int) []int {
	sort.Ints(stones)
	n := len(stones)
	mi := n
	mx := max(stones[n-1]-stones[1]+1, stones[n-2]-stones[0]+1) - (n - 1)
	i := 0
	for j, x := range stones {
		for x-stones[i]+1 > n {
			i++
		}
		if j-i+1 == n-1 && stones[j]-stones[i] == n-2 {
			mi = min(mi, 2)
		} else {
			mi = min(mi, n-(j-i+1))
		}
	}
	return []int{mi, mx}
}
```

### Java

```java
// Moving Stones Until Consecutive II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] numMovesStonesII(int[] stones) {
        Arrays.sort(stones);
        int n = stones.length;
        int mi = n;
        int mx = Math.max(stones[n - 1] - stones[1] + 1, stones[n - 2] - stones[0] + 1) - (n - 1);
        for (int i = 0, j = 0; j < n; ++j) {
            while (stones[j] - stones[i] + 1 > n) {
                ++i;
            }
            if (j - i + 1 == n - 1 && stones[j] - stones[i] == n - 2) {
                mi = Math.min(mi, 2);
            } else {
                mi = Math.min(mi, n - (j - i + 1));
            }
        }
        return new int[] {mi, mx};
    }
}
```

### Python

```python
# Moving Stones Until Consecutive II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numMovesStonesII(self, stones: List[int]) -> List[int]:
        stones.sort()
        mi = n = len(stones)
        mx = max(stones[-1] - stones[1] + 1, stones[-2] - stones[0] + 1) - (n - 1)
        i = 0
        for j, x in enumerate(stones):
            while x - stones[i] + 1 > n:
                i += 1
            if j - i + 1 == n - 1 and x - stones[i] == n - 2:
                mi = min(mi, 2)
            else:
                mi = min(mi, n - (j - i + 1))
        return [mi, mx]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

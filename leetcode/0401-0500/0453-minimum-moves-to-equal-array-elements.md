# 0453. Minimum Moves to Equal Array Elements

---
编号: 453
题目: Minimum Moves to Equal Array Elements
难度: 中等
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/minimum-moves-to-equal-array-elements/
---

## 题目描述

给你一个长度为 `n` 的整数数组，每次操作将会使 `n - 1` 个元素增加 `1` 。返回让数组所有元素相等的最小操作次数。

**示例 1：**

```text
输入：nums = [1,2,3]
输出：3
解释：
只需要3次操作（注意每次操作会增加两个元素的值）：
[1,2,3]  =>  [2,3,3]  =>  [3,4,3]  =>  [4,4,4]
```

**示例 2：**

```text
输入：nums = [1,1,1]
输出：0
```

**提示：**

- `n == nums.length`

- `1 <= nums.length <= 10^5`

- `-10^9 <= nums[i] <= 10^9`

- 答案保证符合 **32-bit** 整数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨记数组 $\textit{nums}$ 的最小值为 $\textit{mi}$，数组的和为 $\textit{s}$，数组的长度为 $\textit{n}$。

假设最小操作次数为 $\textit{k}$，最终数组的所有元素都为 $\textit{x}$，则有：


\begin{aligned}
\textit{s} + (\textit{n} - 1) \times \textit{k} &= \textit{n} \times \textit{x} \\
\textit{x} &= \textit{mi} + \textit{k} \\
\end{aligned}


将第二个式子代入第一个式子，得到：


\begin{aligned}
\textit{s} + (\textit{n} - 1) \times \textit{k} &= \textit{n} \times (\textit{mi} + \textit{k}) \\
\textit{s} + (\textit{n} - 1) \times \textit{k} &= \textit{n} \times \textit{mi} + \textit{n} \times \textit{k} \\
\textit{k} &= \textit{s} - \textit{n} \times \textit{mi} \\
\end{aligned}


因此，最小操作次数为 $\textit{s} - \textit{n} \times \textit{mi}$。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为数组的长度。

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
// Minimum Moves to Equal Array Elements：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minMoves(nums []int) int {
	mi := 1 << 30
	s := 0
	for _, x := range nums {
		s += x
		if x < mi {
			mi = x
		}
	}
	return s - mi*len(nums)
}
```

### Java

```java
// Minimum Moves to Equal Array Elements：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minMoves(int[] nums) {
        return Arrays.stream(nums).sum() - Arrays.stream(nums).min().getAsInt() * nums.length;
    }
}
```

### Python

```python
# Minimum Moves to Equal Array Elements：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minMoves(self, nums: List[int]) -> int:
        return sum(nums) - min(nums) * len(nums)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

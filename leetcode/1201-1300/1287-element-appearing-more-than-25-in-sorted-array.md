# 1287. Element Appearing More Than 25% In Sorted Array

---
编号: 1287
题目: Element Appearing More Than 25% In Sorted Array
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/element-appearing-more-than-25-in-sorted-array/
---

## 题目描述

给你一个非递减的 **有序 **整数数组，已知这个数组中恰好有一个整数，它的出现次数超过数组元素总数的 25%。

请你找到并返回这个整数

**示例：**

```text
输入：arr = [1,2,2,6,6,6,6,7,10]
输出：6
```

**提示：**

- `1 <= arr.length <= 10^4`

- `0 <= arr[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们从头开始遍历数组 $\textit{arr}$，对于每个元素 $\textit{arr}[i]$，我们检查 $\textit{arr}[i]$ 是否等于 $\textit{arr}[i + \left\lfloor \frac{n}{4} \right\rfloor]$，其中 $n$ 是数组的长度。如果等于，那么 $\textit{arr}[i]$ 就是我们要找的元素，直接返回即可。

时间复杂度 $O(n)$，其中 $n$ 是数组 $\textit{arr}$ 的长度。空间复杂度 $O(1)$。

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
// Element Appearing More Than 25% In Sorted Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findSpecialInteger(arr []int) int {
	for i := 0; ; i++ {
		if arr[i] == arr[i+len(arr)/4] {
			return arr[i]
		}
	}
}
```

### Java

```java
// Element Appearing More Than 25% In Sorted Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findSpecialInteger(int[] arr) {
        for (int i = 0;; ++i) {
            if (arr[i] == (arr[i + (arr.length >> 2)])) {
                return arr[i];
            }
        }
    }
}
```

### Python

```python
# Element Appearing More Than 25% In Sorted Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findSpecialInteger(self, arr: List[int]) -> int:
        n = len(arr)
        for i, x in enumerate(arr):
            if x == arr[(i + (n >> 2))]:
                return x
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

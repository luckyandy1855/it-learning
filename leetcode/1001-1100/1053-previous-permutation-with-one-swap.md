# 1053. Previous Permutation With One Swap

---
编号: 1053
题目: Previous Permutation With One Swap
难度: 中等
标签: [贪心, 数组]
来源链接: https://leetcode.com/problems/previous-permutation-with-one-swap/
---

## 题目描述

给你一个正整数数组 `arr`（可能存在重复的元素），请你返回可在 **一次交换**（交换两数字 `arr[i]` 和 `arr[j]` 的位置）后得到的、按字典序排列小于 `arr` 的最大排列。

如果无法这么操作，就请返回原数组。

**示例 1：**

```text
输入：arr = [3,2,1]
输出：[3,1,2]
解释：交换 2 和 1
```

**示例 2：**

```text
输入：arr = [1,1,5]
输出：[1,1,5]
解释：已经是最小排列
```

**示例 3：**

```text
输入：arr = [1,9,4,6,7]
输出：[1,7,4,6,9]
解释：交换 9 和 7
```

**提示：**

- `1 <= arr.length <= 10^4`

- `1 <= arr[i] <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先从右到左遍历数组，找到第一个满足 $arr[i - 1] \gt arr[i]$ 的下标 $i$，此时 $arr[i - 1]$ 就是我们要交换的数字，我们再从右到左遍历数组，找到第一个满足 $arr[j] \lt arr[i - 1]$ 且 $arr[j] \neq arr[j - 1]$ 的下标 $j$，此时我们交换 $arr[i - 1]$ 和 $arr[j]$ 后返回即可。

如果遍历完数组都没有找到满足条件的下标 $i$，说明数组已经是最小排列，直接返回原数组即可。

时间复杂度 $O(n)$，其中 $n$ 为数组长度。空间复杂度 $O(1)$。

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
// Previous Permutation With One Swap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func prevPermOpt1(arr []int) []int {
	n := len(arr)
	for i := n - 1; i > 0; i-- {
		if arr[i-1] > arr[i] {
			for j := n - 1; j > i-1; j-- {
				if arr[j] < arr[i-1] && arr[j] != arr[j-1] {
					arr[i-1], arr[j] = arr[j], arr[i-1]
					return arr
				}
			}
		}
	}
	return arr
}
```

### Java

```java
// Previous Permutation With One Swap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] prevPermOpt1(int[] arr) {
        int n = arr.length;
        for (int i = n - 1; i > 0; --i) {
            if (arr[i - 1] > arr[i]) {
                for (int j = n - 1; j > i - 1; --j) {
                    if (arr[j] < arr[i - 1] && arr[j] != arr[j - 1]) {
                        int t = arr[i - 1];
                        arr[i - 1] = arr[j];
                        arr[j] = t;
                        return arr;
                    }
                }
            }
        }
        return arr;
    }
}
```

### Python

```python
# Previous Permutation With One Swap：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def prevPermOpt1(self, arr: List[int]) -> List[int]:
        n = len(arr)
        for i in range(n - 1, 0, -1):
            if arr[i - 1] > arr[i]:
                for j in range(n - 1, i - 1, -1):
                    if arr[j] < arr[i - 1] and arr[j] != arr[j - 1]:
                        arr[i - 1], arr[j] = arr[j], arr[i - 1]
                        return arr
        return arr
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

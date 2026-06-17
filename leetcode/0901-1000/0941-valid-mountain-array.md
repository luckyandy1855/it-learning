# 0941. Valid Mountain Array

---
编号: 941
题目: Valid Mountain Array
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/valid-mountain-array/
---

## 题目描述

给定一个整数数组 `arr`，如果它是有效的山脉数组就返回 `true`，否则返回 `false`。

让我们回顾一下，如果 `arr` 满足下述条件，那么它是一个山脉数组：

- `arr.length >= 3`

- 在 `0  arr[i+1] > ... > arr[arr.length - 1]`

**示例 1：**

```text
输入：arr = [2,1]
输出：false
```

**示例 2：**

```text
输入：arr = [3,5,5]
输出：false
```

**示例 3：**

```text
输入：arr = [0,3,2,1]
输出：true
```

**提示：**

- `1 <= arr.length <= 10^4`

- `0 <= arr[i] <= 10^4`

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

我们首先判断数组的长度是否小于 $3$，如果小于 $3$，那么一定不是山脉数组，直接返回 `false`。

然后，我们使用指针 $i$ 从数组的左端开始向右移动，直到找到一个位置 $i$，使得 $arr[i] > arr[i + 1]$。然后，我们使用指针 $j$ 从数组的右端开始向左移动，直到找到一个位置 $j$，使得 $arr[j] > arr[j - 1]$。如果满足条件 $i = j$，那么就说明数组 $arr$ 是一个山脉数组。

时间复杂度 $O(n)$，其中 $n$ 是数组的长度。空间复杂度 $O(1)$。

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
// Valid Mountain Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validMountainArray(arr []int) bool {
	n := len(arr)
	if n < 3 {
		return false
	}
	i, j := 0, n-1
	for i+1 < n-1 && arr[i] < arr[i+1] {
		i++
	}
	for j-1 > 0 && arr[j-1] > arr[j] {
		j--
	}
	return i == j
}
```

### Java

```java
// Valid Mountain Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean validMountainArray(int[] arr) {
        int n = arr.length;
        if (n < 3) {
            return false;
        }
        int i = 0, j = n - 1;
        while (i + 1 < n - 1 && arr[i] < arr[i + 1]) {
            ++i;
        }
        while (j - 1 > 0 && arr[j - 1] > arr[j]) {
            --j;
        }
        return i == j;
    }
}
```

### Python

```python
# Valid Mountain Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validMountainArray(self, arr: List[int]) -> bool:
        n = len(arr)
        if n < 3:
            return False
        i, j = 0, n - 1
        while i + 1 < n - 1 and arr[i] < arr[i + 1]:
            i += 1
        while j - 1 > 0 and arr[j - 1] > arr[j]:
            j -= 1
        return i == j
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

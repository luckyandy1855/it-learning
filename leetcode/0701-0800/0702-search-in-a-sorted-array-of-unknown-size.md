# 0702. Search in a Sorted Array of Unknown Size

---
编号: 702
题目: Search in a Sorted Array of Unknown Size
难度: 中等
标签: [数组, 二分查找, 交互]
来源链接: https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/
---

## 题目描述

这是一个**交互问题**。

您有一个**升序**整数数组，其**长度未知**。您没有访问数组的权限，但是可以使用 `ArrayReader` 接口访问它。你可以调用 `ArrayReader.get(i)`:

	-

返回数组第`i^th`个索引(**0-indexed**)处的值(即 `secret[i]`)，或者

	-

如果 `i`  超出了数组的边界，则返回 `2^31 - 1`

你也会得到一个整数 `target`。

如果存在`secret[k] == target`，请返回索引 `k` 的值；否则返回 `-1`

你必须写一个时间复杂度为 `O(log n)` 的算法。

**示例 1：**

```text
输入: secret = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 存在在 nums 中，下标为 4
```

**示例 2：**

```text
输入: secret = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不在数组中所以返回 -1
```

**提示：**

- `1 <= secret.length <= 10^4`

- `-10^4 <= secret[i], target <= 10^4`

- `secret` 严格递增

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 交互」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先定义一个指针 $r = 1$，每一次判断 $r$ 处的值是否小于目标值，如果小于目标值，我们将 $r$ 乘以 $2$，即左移一位，直到 $r$ 处的值大于等于目标值。此时，我们可以确定目标值在 $[r / 2, r]$ 的区间内。

接下来，我们定义一个指针 $l = r / 2$，然后我们可以使用二分查找的方法在 $[l, r]$ 的区间内查找目标值的位置。

时间复杂度 $O(\log M)$，其中 $M$ 为目标值的位置。空间复杂度 $O(1)$。

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
// Search in a Sorted Array of Unknown Size：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * // This is the ArrayReader's API interface.
 * // You should not implement it, or speculate about its implementation
 * type ArrayReader struct {
 * }
 *
 * func (this *ArrayReader) get(index int) int {}
 */

func search(reader ArrayReader, target int) int {
	r := 1
	for reader.get(r) < target {
		r <<= 1
	}
	l := r >> 1
	for l < r {
		mid := (l + r) >> 1
		if reader.get(mid) >= target {
			r = mid
		} else {
			l = mid + 1
		}
	}
	if reader.get(l) == target {
		return l
	}
	return -1
}
```

### Java

```java
// Search in a Sorted Array of Unknown Size：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is ArrayReader's API interface.
 * // You should not implement it, or speculate about its implementation
 * interface ArrayReader {
 *     public int get(int index) {}
 * }
 */

class Solution {
    public int search(ArrayReader reader, int target) {
        int r = 1;
        while (reader.get(r) < target) {
            r <<= 1;
        }
        int l = r >> 1;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (reader.get(mid) >= target) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return reader.get(l) == target ? l : -1;
    }
}
```

### Python

```python
# Search in a Sorted Array of Unknown Size：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is ArrayReader's API interface.
# You should not implement it, or speculate about its implementation
# """
# class ArrayReader:
#    def get(self, index: int) -> int:


class Solution:
    def search(self, reader: "ArrayReader", target: int) -> int:
        r = 1
        while reader.get(r) < target:
            r <<= 1
        l = r >> 1
        while l < r:
            mid = (l + r) >> 1
            if reader.get(mid) >= target:
                r = mid
            else:
                l = mid + 1
        return l if reader.get(l) == target else -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

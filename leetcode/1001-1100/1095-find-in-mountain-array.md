# 1095. Find in Mountain Array

---
编号: 1095
题目: Find in Mountain Array
难度: 困难
标签: [数组, 二分查找, 交互]
来源链接: https://leetcode.com/problems/find-in-mountain-array/
---

## 题目描述

（这是一个 **交互式问题 **）

你可以将一个数组 `arr` 称为 **山脉数组 **当且仅当：

- `arr.length >= 3`

- 存在一些 `0  arr[i + 1] > ... > arr[arr.length - 1]`

给定一个山脉数组 `mountainArr` ，返回 **最小** 的 `index` 使得 `mountainArr.get(index) == target`。如果不存在这样的 `index`，返回 `-1` 。

**你无法直接访问山脉数组**。你只能使用 `MountainArray` 接口来访问数组：

- `MountainArray.get(k)` 返回数组中下标为 `k` 的元素（从 0 开始）。

- `MountainArray.length()` 返回数组的长度。

调用 `MountainArray.get` 超过 `100` 次的提交会被判定为错误答案。此外，任何试图绕过在线评测的解决方案都将导致取消资格。

**示例 1：**

```text
输入：mountainArr = [1,2,3,4,5,3,1], target = 3
输出：2
解释：3 在数组中出现了两次，下标分别为 2 和 5，我们返回最小的下标 2。
```

**示例 2：**

```text
输入：mountainArr = [0,1,2,4,2,1], target = 3
输出：-1
解释：3 在数组中没有出现，返回 -1。
```

**提示：**

- `3 <= mountainArr.length() <= 10^4`

- `0 <= target <= 10^9`

- `0 <= mountainArr.get(index) <= 10^9`

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

我们先通过二分查找，找到数组中的最大值所在的下标 $l$，那么数组就可以被分成两段，前半段是递增的，后半段是递减的。

然后我们在前半段中使用二分查找，查找目标值所在的下标，如果找不到，再在后半段中使用二分查找，查找目标值所在的下标。

时间复杂度 $O(\log n)$，其中 $n$ 是数组的长度。空间复杂度 $O(1)$。

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
// Find in Mountain Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * // This is the MountainArray's API interface.
 * // You should not implement it, or speculate about its implementation
 * type MountainArray struct {
 * }
 *
 * func (this *MountainArray) get(index int) int {}
 * func (this *MountainArray) length() int {}
 */

func findInMountainArray(target int, mountainArr *MountainArray) int {
	n := mountainArr.length()
	l, r := 0, n-1
	for l < r {
		mid := (l + r) >> 1
		if mountainArr.get(mid) > mountainArr.get(mid+1) {
			r = mid
		} else {
			l = mid + 1
		}
	}
	search := func(l, r, k int) int {
		for l < r {
			mid := (l + r) >> 1
			if k*mountainArr.get(mid) >= k*target {
				r = mid
			} else {
				l = mid + 1
			}
		}
		if mountainArr.get(l) == target {
			return l
		}
		return -1
	}
	ans := search(0, l, 1)
	if ans == -1 {
		return search(l+1, n-1, -1)
	}
	return ans
}
```

### Java

```java
// Find in Mountain Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is MountainArray's API interface.
 * // You should not implement it, or speculate about its implementation
 * interface MountainArray {
 *     public int get(int index) {}
 *     public int length() {}
 * }
 */

class Solution {
    private MountainArray mountainArr;
    private int target;

    public int findInMountainArray(int target, MountainArray mountainArr) {
        int n = mountainArr.length();
        int l = 0, r = n - 1;
        while (l < r) {
            int mid = (l + r) >>> 1;
            if (mountainArr.get(mid) > mountainArr.get(mid + 1)) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        this.mountainArr = mountainArr;
        this.target = target;
        int ans = search(0, l, 1);
        return ans == -1 ? search(l + 1, n - 1, -1) : ans;
    }

    private int search(int l, int r, int k) {
        while (l < r) {
            int mid = (l + r) >>> 1;
            if (k * mountainArr.get(mid) >= k * target) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return mountainArr.get(l) == target ? l : -1;
    }
}
```

### Python

```python
# Find in Mountain Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is MountainArray's API interface.
# You should not implement it, or speculate about its implementation
# """
# class MountainArray:
#    def get(self, index: int) -> int:
#    def length(self) -> int:


class Solution:
    def findInMountainArray(self, target: int, mountain_arr: 'MountainArray') -> int:
        def search(l: int, r: int, k: int) -> int:
            while l < r:
                mid = (l + r) >> 1
                if k * mountain_arr.get(mid) >= k * target:
                    r = mid
                else:
                    l = mid + 1
            return -1 if mountain_arr.get(l) != target else l

        n = mountain_arr.length()
        l, r = 0, n - 1
        while l < r:
            mid = (l + r) >> 1
            if mountain_arr.get(mid) > mountain_arr.get(mid + 1):
                r = mid
            else:
                l = mid + 1
        ans = search(0, l, 1)
        return search(l + 1, n - 1, -1) if ans == -1 else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

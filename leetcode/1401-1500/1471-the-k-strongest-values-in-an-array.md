# 1471. The k Strongest Values in an Array

---
编号: 1471
题目: The k Strongest Values in an Array
难度: 中等
标签: [数组, 双指针, 排序]
来源链接: https://leetcode.com/problems/the-k-strongest-values-in-an-array/
---

## 题目描述

给你一个整数数组 `arr` 和一个整数 `k` 。

设 `m` 为数组的中位数，只要满足下述两个前提之一，就可以判定 `arr[i]` 的值比 `arr[j]` 的值更强：

-  `|arr[i] - m| > |arr[j] - m|`

-  `|arr[i] - m| == |arr[j] - m|`，且 `arr[i] > arr[j]`

请返回由数组中最强的 `k` 个值组成的列表。答案可以以 **任意顺序** 返回。

**中位数** 是一个有序整数列表中处于中间位置的值。形式上，如果列表的长度为 `n` ，那么中位数就是该有序列表（下标从 0 开始）中位于 `((n - 1) / 2)` 的元素。

- 例如 `arr = [6, -3, 7, 2, 11]`，`n = 5`：数组排序后得到 `arr = [-3, 2, 6, 7, 11]` ，数组的中间位置为 `m = ((5 - 1) / 2) = 2` ，中位数 `arr[m]` 的值为 `6` 。

- 例如 `arr = [-7, 22, 17, 3]`，`n = 4`：数组排序后得到 `arr = [-7, 3, 17, 22]` ，数组的中间位置为 `m = ((4 - 1) / 2) = 1` ，中位数 `arr[m]` 的值为 `3` 。

**示例 1：**

```text
输入：arr = [1,2,3,4,5], k = 2
输出：[5,1]
解释：中位数为 3，按从强到弱顺序排序后，数组变为 [5,1,4,2,3]。最强的两个元素是 [5, 1]。[1, 5] 也是正确答案。
注意，尽管 |5 - 3| == |1 - 3| ，但是 5 比 1 更强，因为 5 > 1 。
```

**示例 2：**

```text
输入：arr = [1,1,3,5,5], k = 2
输出：[5,5]
解释：中位数为 3, 按从强到弱顺序排序后，数组变为 [5,5,1,1,3]。最强的两个元素是 [5, 5]。
```

**示例 3：**

```text
输入：arr = [6,7,11,7,6,8], k = 5
输出：[11,8,6,6,7]
解释：中位数为 7, 按从强到弱顺序排序后，数组变为 [11,8,6,6,7,7]。
[11,8,6,6,7] 的任何排列都是正确答案。
```

**提示：**

- `1 <= arr.length <= 10^5`

- `-10^5 <= arr[i] <= 10^5`

- `1 <= k <= arr.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先对数组 $\textit{arr}$ 进行排序，然后找到数组的中位数 $m$。

接下来，我们按照题目描述的规则对数组进行排序，最后返回数组的前 $k$ 个元素即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $\textit{arr}$ 的长度。

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
// The k Strongest Values in an Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getStrongest(arr []int, k int) []int {
	sort.Ints(arr)
	m := arr[(len(arr)-1)>>1]
	sort.Slice(arr, func(i, j int) bool {
		x, y := abs(arr[i]-m), abs(arr[j]-m)
		if x == y {
			return arr[i] > arr[j]
		}
		return x > y
	})
	return arr[:k]
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// The k Strongest Values in an Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] getStrongest(int[] arr, int k) {
        Arrays.sort(arr);
        int m = arr[(arr.length - 1) >> 1];
        List<Integer> nums = new ArrayList<>();
        for (int v : arr) {
            nums.add(v);
        }
        nums.sort((a, b) -> {
            int x = Math.abs(a - m);
            int y = Math.abs(b - m);
            return x == y ? b - a : y - x;
        });
        int[] ans = new int[k];
        for (int i = 0; i < k; ++i) {
            ans[i] = nums.get(i);
        }
        return ans;
    }
}
```

### Python

```python
# The k Strongest Values in an Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getStrongest(self, arr: List[int], k: int) -> List[int]:
        arr.sort()
        m = arr[(len(arr) - 1) >> 1]
        arr.sort(key=lambda x: (-abs(x - m), -x))
        return arr[:k]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

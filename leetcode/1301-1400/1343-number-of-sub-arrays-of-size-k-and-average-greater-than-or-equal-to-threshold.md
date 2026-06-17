# 1343. Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold

---
编号: 1343
题目: Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold
难度: 中等
标签: [数组, 滑动窗口]
来源链接: https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/
---

## 题目描述

给你一个整数数组 `arr` 和两个整数 `k` 和 `threshold` 。

请你返回长度为 `k` 且平均值大于等于 `threshold` 的子数组数目。

**示例 1：**

```text
输入：arr = [2,2,2,2,5,5,5,8], k = 3, threshold = 4
输出：3
解释：子数组 [2,5,5],[5,5,5] 和 [5,5,8] 的平均值分别为 4，5 和 6 。其他长度为 3 的子数组的平均值都小于 4 （threshold 的值)。
```

**示例 2：**

```text
输入：arr = [11,13,17,23,29,31,7,5,2,3], k = 3, threshold = 5
输出：6
解释：前 6 个长度为 3 的子数组平均值都大于 5 。注意平均值不是整数。
```

**提示：**

- `1 <= arr.length <= 10^5`

- `1 <= arr[i] <= 10^4`

- `1 <= k <= arr.length`

- `0 <= threshold <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

不妨将 `threshold` 乘以 $k$，这样我们就可以直接比较窗口内的和与 `threshold` 的大小关系。

我们维护一个长度为 $k$ 的滑动窗口，每次计算窗口内的和 $s$，如果 $s$ 大于等于 `threshold`，则答案加一。

时间复杂度 $O(n)$，其中 $n$ 为数组 `arr` 的长度。空间复杂度 $O(1)$。

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
// Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numOfSubarrays(arr []int, k int, threshold int) (ans int) {
	threshold *= k
	s := 0
	for _, x := range arr[:k] {
		s += x
	}
	if s >= threshold {
		ans++
	}
	for i := k; i < len(arr); i++ {
		s += arr[i] - arr[i-k]
		if s >= threshold {
			ans++
		}
	}
	return
}
```

### Java

```java
// Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numOfSubarrays(int[] arr, int k, int threshold) {
        threshold *= k;
        int s = 0;
        for (int i = 0; i < k; ++i) {
            s += arr[i];
        }
        int ans = s >= threshold ? 1 : 0;
        for (int i = k; i < arr.length; ++i) {
            s += arr[i] - arr[i - k];
            ans += s >= threshold ? 1 : 0;
        }
        return ans;
    }
}
```

### Python

```python
# Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numOfSubarrays(self, arr: List[int], k: int, threshold: int) -> int:
        threshold *= k
        s = sum(arr[:k])
        ans = int(s >= threshold)
        for i in range(k, len(arr)):
            s += arr[i] - arr[i - k]
            ans += int(s >= threshold)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

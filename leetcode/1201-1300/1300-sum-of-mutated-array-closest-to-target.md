# 1300. Sum of Mutated Array Closest to Target

---
编号: 1300
题目: Sum of Mutated Array Closest to Target
难度: 中等
标签: [数组, 二分查找, 排序]
来源链接: https://leetcode.com/problems/sum-of-mutated-array-closest-to-target/
---

## 题目描述

给你一个整数数组 `arr` 和一个目标值 `target` ，请你返回一个整数 `value` ，使得将数组中所有大于 `value` 的值变成 `value` 后，数组的和最接近  `target` （最接近表示两者之差的绝对值最小）。

如果有多种使得和最接近 `target` 的方案，请你返回这些整数中的最小值。

请注意，答案不一定是 `arr` 中的数字。

**示例 1：**

```text
输入：arr = [4,9,3], target = 10
输出：3
解释：当选择 value 为 3 时，数组会变成 [3, 3, 3]，和为 9 ，这是最接近 target 的方案。
```

**示例 2：**

```text
输入：arr = [2,3,5], target = 10
输出：5
```

**示例 3：**

```text
输入：arr = [60864,25176,27249,21296,20204], target = 56803
输出：11361
```

**提示：**

- `1 <= arr.length <= 10^4`

- `1 <= arr[i], target <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，题目中要把所有大于 `value` 的值变成 `value`，并且求和，因此我们可以考虑先对数组 `arr` 进行排序，然后求出前缀和数组 $s$，其中 $s[i]$ 表示数组前 $i$ 个元素之和。

接下来，我们可以从小到大枚举所有 `value` 值，对于每个 `value`，我们可以通过二分查找找到数组中第一个大于 `value` 的元素的下标 $i$，此时数组中大于 `value` 的元素个数为 $n - i$，因此数组中小于等于 `value` 的元素个数为 $i$，此时数组中小于等于 `value` 的元素之和为 $s[i]$，数组中大于 `value` 的元素之和为 $(n - i) \times \textit{value}$，因此数组中所有元素之和为 $s[i] + (n - i) \times \textit{value}$。如果 $s[i] + (n - i) \times \textit{value}$ 与 `target` 的差的绝对值小于当前的最小差值 `diff`，则更新 `diff` 和 `ans`。

枚举完所有 `value` 后，即可得到最终答案 `ans`。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 `arr` 的长度。

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
// Sum of Mutated Array Closest to Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findBestValue(arr []int, target int) (ans int) {
	sort.Ints(arr)
	n := len(arr)
	s := make([]int, n+1)
	mx := slices.Max(arr)
	for i, x := range arr {
		s[i+1] = s[i] + x
	}
	diff := 1 << 30
	for value := 0; value <= mx; value++ {
		i := sort.SearchInts(arr, value+1)
		d := abs(s[i] + (n-i)*value - target)
		if diff > d {
			diff = d
			ans = value
		}
	}
	return
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
// Sum of Mutated Array Closest to Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findBestValue(int[] arr, int target) {
        Arrays.sort(arr);
        int n = arr.length;
        int[] s = new int[n + 1];
        int mx = 0;
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + arr[i];
            mx = Math.max(mx, arr[i]);
        }
        int ans = 0, diff = 1 << 30;
        for (int value = 0; value <= mx; ++value) {
            int i = search(arr, value);
            int d = Math.abs(s[i] + (n - i) * value - target);
            if (diff > d) {
                diff = d;
                ans = value;
            }
        }
        return ans;
    }

    private int search(int[] arr, int x) {
        int left = 0, right = arr.length;
        while (left < right) {
            int mid = (left + right) >> 1;
            if (arr[mid] > x) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```

### Python

```python
# Sum of Mutated Array Closest to Target：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findBestValue(self, arr: List[int], target: int) -> int:
        arr.sort()
        s = list(accumulate(arr, initial=0))
        ans, diff = 0, inf
        for value in range(max(arr) + 1):
            i = bisect_right(arr, value)
            d = abs(s[i] + (len(arr) - i) * value - target)
            if diff > d:
                diff = d
                ans = value
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1497. Check If Array Pairs Are Divisible by k

---
编号: 1497
题目: Check If Array Pairs Are Divisible by k
难度: 中等
标签: [数组, 哈希表, 计数]
来源链接: https://leetcode.com/problems/check-if-array-pairs-are-divisible-by-k/
---

## 题目描述

给你一个整数数组 `arr` 和一个整数 `k` ，其中数组长度是偶数，值为 `n` 。

现在需要把数组恰好分成 `n / 2` 对，以使每对数字的和都能够被 `k` 整除。

如果存在这样的分法，请返回 `true` ；否则，返回 `false`。

**示例 1：**

```text
输入：arr = [1,2,3,4,5,10,6,7,8,9], k = 5
输出：true
解释：划分后的数字对为 (1,9),(2,8),(3,7),(4,6) 以及 (5,10) 。
```

**示例 2：**

```text
输入：arr = [1,2,3,4,5,6], k = 7
输出：true
解释：划分后的数字对为 (1,6),(2,5) 以及 (3,4) 。
```

**示例 3：**

```text
输入：arr = [1,2,3,4,5,6], k = 10
输出：false
解释：无法在将数组中的数字分为三对的同时满足每对数字和能够被 10 整除的条件。
```

**提示：**

- `arr.length == n`

- `1

- `-10^9 <= arr[i] <= 10^9`

- `1 <= k <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

两个数 $a$ 和 $b$ 的和能被 $k$ 整除，当且仅当这两个数分别对 $k$ 取模的结果之和能被 $k$ 整除。

因此，我们可以统计数组中每个数对 $k$ 取模的结果，即余数，记录在数组 $\textit{cnt}$ 中。然后我们遍历数组 $\textit{cnt}$，对于范围在 $[1,..k-1]$ 的每个数 $i$，如果 $\textit{cnt}[i]$ 和 $\textit{cnt}[k-i]$ 的值不相等，说明无法将数组中的数字分为 $n/2$ 对，使得每对数字的和都能被 $k$ 整除。如果 $\textit{cnt}[0]$ 的值不是偶数，也说明无法将数组中的数字分为 $n/2$ 对，使得每对数字的和都能被 $k$ 整除。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{arr}$ 的长度。空间复杂度 $O(k)$。

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
// Check If Array Pairs Are Divisible by k：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canArrange(arr []int, k int) bool {
	cnt := make([]int, k)
	for _, x := range arr {
		cnt[(x%k+k)%k]++
	}
	for i := 1; i < k; i++ {
		if cnt[i] != cnt[k-i] {
			return false
		}
	}
	return cnt[0]%2 == 0
}
```

### Java

```java
// Check If Array Pairs Are Divisible by k：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canArrange(int[] arr, int k) {
        int[] cnt = new int[k];
        for (int x : arr) {
            ++cnt[(x % k + k) % k];
        }
        for (int i = 1; i < k; ++i) {
            if (cnt[i] != cnt[k - i]) {
                return false;
            }
        }
        return cnt[0] % 2 == 0;
    }
}
```

### Python

```python
# Check If Array Pairs Are Divisible by k：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canArrange(self, arr: List[int], k: int) -> bool:
        cnt = Counter(x % k for x in arr)
        return cnt[0] % 2 == 0 and all(cnt[i] == cnt[k - i] for i in range(1, k))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

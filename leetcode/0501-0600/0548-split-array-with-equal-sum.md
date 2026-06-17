# 0548. Split Array with Equal Sum

---
编号: 548
题目: Split Array with Equal Sum
难度: 困难
标签: [数组, 哈希表, 前缀和]
来源链接: https://leetcode.com/problems/split-array-with-equal-sum/
---

## 题目描述

给定一个有 `n` 个整数的数组 `nums` ，如果能找到满足以下条件的三元组  `(i, j, k)`  则返回 `true` ：

- `0

这里我们定义子数组 `(l, r)` 表示原数组从索引为 `l` 的元素开始至索引为 `r` 的元素。

**示例 1：**

```text
输入: nums = [1,2,1,2,1,2,1]
输出: True
解释:
i = 1, j = 3, k = 5.
sum(0, i - 1) = sum(0, 0) = 1
sum(i + 1, j - 1) = sum(2, 2) = 1
sum(j + 1, k - 1) = sum(4, 4) = 1
sum(k + 1, n - 1) = sum(6, 6) = 1
```

**示例 2:**

```text
输入: nums = [1,2,1,2,1,2,1,2]
输出: false
```

**提示:**

- `n == nums.length`

- `1 <= n <= 2000`

- `-10^6 <= nums[i] <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

先求出前缀和数组 s。

然后遍历 j 所有可能的位置，对于每个 j，找出 i，使得前两个子数组的和相等。同时将和添加到哈希表中。

接着对于每个 j，找出 k，使得后两个子数组的和相等，然后判断哈希表中是否存在该和，如果存在，则找到满足条件的三元组 `(i, j, k)`，返回 true。

否则遍历结束返回 false。

时间复杂度 $O(n^2)$。

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
// Split Array with Equal Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func splitArray(nums []int) bool {
	n := len(nums)
	s := make([]int, n+1)
	for i, v := range nums {
		s[i+1] = s[i] + v
	}
	for j := 3; j < n-3; j++ {
		seen := map[int]bool{}
		for i := 1; i < j-1; i++ {
			if s[i] == s[j]-s[i+1] {
				seen[s[i]] = true
			}
		}
		for k := j + 2; k < n-1; k++ {
			if s[n]-s[k+1] == s[k]-s[j+1] && seen[s[n]-s[k+1]] {
				return true
			}
		}
	}
	return false
}
```

### Java

```java
// Split Array with Equal Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean splitArray(int[] nums) {
        int n = nums.length;
        int[] s = new int[n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        for (int j = 3; j < n - 3; ++j) {
            Set<Integer> seen = new HashSet<>();
            for (int i = 1; i < j - 1; ++i) {
                if (s[i] == s[j] - s[i + 1]) {
                    seen.add(s[i]);
                }
            }
            for (int k = j + 2; k < n - 1; ++k) {
                if (s[n] - s[k + 1] == s[k] - s[j + 1] && seen.contains(s[n] - s[k + 1])) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

### Python

```python
# Split Array with Equal Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def splitArray(self, nums: List[int]) -> bool:
        n = len(nums)
        s = [0] * (n + 1)
        for i, v in enumerate(nums):
            s[i + 1] = s[i] + v
        for j in range(3, n - 3):
            seen = set()
            for i in range(1, j - 1):
                if s[i] == s[j] - s[i + 1]:
                    seen.add(s[i])
            for k in range(j + 2, n - 1):
                if s[n] - s[k + 1] == s[k] - s[j + 1] and s[n] - s[k + 1] in seen:
                    return True
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

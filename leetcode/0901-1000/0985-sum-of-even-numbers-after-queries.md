# 0985. Sum of Even Numbers After Queries

---
编号: 985
题目: Sum of Even Numbers After Queries
难度: 中等
标签: [数组, 模拟]
来源链接: https://leetcode.com/problems/sum-of-even-numbers-after-queries/
---

## 题目描述

给出一个整数数组 `A` 和一个查询数组 `queries`。

对于第 `i` 次查询，有 `val = queries[i][0], index = queries[i][1]`，我们会把 `val` 加到 `A[index]` 上。然后，第 `i` 次查询的答案是 `A` 中偶数值的和。

*（此处给定的 `index = queries[i][1]` 是从 0 开始的索引，每次查询都会永久修改数组 `A`。）*

返回所有查询的答案。你的答案应当以数组 `answer` 给出，`answer[i]` 为第 `i` 次查询的答案。

**示例：**

```text
输入：A = [1,2,3,4], queries = [[1,0],[-3,1],[-4,0],[2,3]]
输出：[8,6,2,4]
解释：
开始时，数组为 [1,2,3,4]。
将 1 加到 A[0] 上之后，数组为 [2,2,3,4]，偶数值之和为 2 + 2 + 4 = 8。
将 -3 加到 A[1] 上之后，数组为 [2,-1,3,4]，偶数值之和为 2 + 4 = 6。
将 -4 加到 A[0] 上之后，数组为 [-2,-1,3,4]，偶数值之和为 -2 + 4 = 2。
将 2 加到 A[3] 上之后，数组为 [-2,-1,3,6]，偶数值之和为 -2 + 6 = 4。
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个整型变量 $\textit{s}$ 记录数组 $\textit{nums}$ 中所有偶数的和，初始时 $\textit{s}$ 为数组 $\textit{nums}$ 中所有偶数的和。

对于每次查询 $(v, i)$，我们首先判断 $\textit{nums}[i]$ 是否为偶数，若 $\textit{nums}[i]$ 为偶数，则将 $\textit{s}$ 减去 $\textit{nums}[i]$；然后将 $\textit{nums}[i]$ 加上 $v$；若 $\textit{nums}[i]$ 为偶数，则将 $\textit{s}$ 加上 $\textit{nums}[i]$，然后将 $\textit{s}$ 加入答案数组。

时间复杂度 $O(n + m)$，其中 $n$ 和 $m$ 分别为数组 $\textit{nums}$ 和 $\textit{queries}$ 的长度。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Sum of Even Numbers After Queries：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sumEvenAfterQueries(nums []int, queries [][]int) (ans []int) {
	s := 0
	for _, x := range nums {
		if x%2 == 0 {
			s += x
		}
	}
	for _, q := range queries {
		v, i := q[0], q[1]
		if nums[i]%2 == 0 {
			s -= nums[i]
		}
		nums[i] += v
		if nums[i]%2 == 0 {
			s += nums[i]
		}
		ans = append(ans, s)
	}
	return
}
```

### Java

```java
// Sum of Even Numbers After Queries：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] sumEvenAfterQueries(int[] nums, int[][] queries) {
        int s = 0;
        for (int x : nums) {
            if (x % 2 == 0) {
                s += x;
            }
        }
        int m = queries.length;
        int[] ans = new int[m];
        int k = 0;
        for (var q : queries) {
            int v = q[0], i = q[1];
            if (nums[i] % 2 == 0) {
                s -= nums[i];
            }
            nums[i] += v;
            if (nums[i] % 2 == 0) {
                s += nums[i];
            }
            ans[k++] = s;
        }
        return ans;
    }
}
```

### Python

```python
# Sum of Even Numbers After Queries：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sumEvenAfterQueries(
        self, nums: List[int], queries: List[List[int]]
    ) -> List[int]:
        s = sum(x for x in nums if x % 2 == 0)
        ans = []
        for v, i in queries:
            if nums[i] % 2 == 0:
                s -= nums[i]
            nums[i] += v
            if nums[i] % 2 == 0:
                s += nums[i]
            ans.append(s)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

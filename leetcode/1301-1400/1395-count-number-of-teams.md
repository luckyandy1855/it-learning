# 1395. Count Number of Teams

---
编号: 1395
题目: Count Number of Teams
难度: 中等
标签: [树状数组, 线段树, 数组, 动态规划]
来源链接: https://leetcode.com/problems/count-number-of-teams/
---

## 题目描述

`n` 名士兵站成一排。每个士兵都有一个 **独一无二** 的评分 `rating` 。

从中选出 **3** 个士兵组成一个作战单位，规则如下：

- 从队伍中选出下标分别为 `i`、`j`、`k` 的 3 名士兵，他们的评分分别为 `rating[i]`、`rating[j]`、`rating[k]`

- 作战单位需满足： `rating[i]  rating[j] > rating[k]` ，其中  `0 <= i < j < k < n`

请你返回按上述条件组建的作战单位的方案数。

**示例 1：**

```text
输入：rating = [2,5,3,4,1]
输出：3
解释：我们可以组建三个作战单位 (2,3,4)、(5,4,1)、(5,3,1) 。
```

**示例 2：**

```text
输入：rating = [2,1,3]
输出：0
解释：根据题目条件，我们无法组建作战单位。
```

**示例 3：**

```text
输入：rating = [1,2,3,4]
输出：4
```

**提示：**

- `n == rating.length`

- `3 <= n <= 1000`

- `1 <= rating[i] <= 10^5`

- `rating` 中的元素都是唯一的

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树状数组, 线段树, 数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举数组 $rating$ 中每个元素 $rating[i]$ 作为中间元素，然后统计左边比它小的元素的个数 $l$，右边比它大的元素的个数 $r$，那么以该元素为中间元素的作战单位的个数为 $l \times r + (i - l) \times (n - i - 1 - r)$，累加到答案中即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(1)$。其中 $n$ 为数组 $rating$ 的长度。

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
// Count Number of Teams：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numTeams(rating []int) (ans int) {
	n := len(rating)
	for i, b := range rating {
		l, r := 0, 0
		for _, a := range rating[:i] {
			if a < b {
				l++
			}
		}
		for _, c := range rating[i+1:] {
			if c < b {
				r++
			}
		}
		ans += l * r
		ans += (i - l) * (n - i - 1 - r)
	}
	return
}
```

### Java

```java
// Count Number of Teams：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numTeams(int[] rating) {
        int n = rating.length;
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            int l = 0, r = 0;
            for (int j = 0; j < i; ++j) {
                if (rating[j] < rating[i]) {
                    ++l;
                }
            }
            for (int j = i + 1; j < n; ++j) {
                if (rating[j] > rating[i]) {
                    ++r;
                }
            }
            ans += l * r;
            ans += (i - l) * (n - i - 1 - r);
        }
        return ans;
    }
}
```

### Python

```python
# Count Number of Teams：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numTeams(self, rating: List[int]) -> int:
        ans, n = 0, len(rating)
        for i, b in enumerate(rating):
            l = sum(a < b for a in rating[:i])
            r = sum(c > b for c in rating[i + 1 :])
            ans += l * r
            ans += (i - l) * (n - i - 1 - r)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

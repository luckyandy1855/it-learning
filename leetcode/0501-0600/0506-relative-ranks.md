# 0506. Relative Ranks

---
编号: 506
题目: Relative Ranks
难度: 简单
标签: [数组, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/relative-ranks/
---

## 题目描述

给你一个长度为 `n` 的整数数组 `score` ，其中 `score[i]` 是第 `i` 位运动员在比赛中的得分。所有得分都 **互不相同** 。

运动员将根据得分 **决定名次** ，其中名次第 `1` 的运动员得分最高，名次第 `2` 的运动员得分第 `2` 高，依此类推。运动员的名次决定了他们的获奖情况：

- 名次第 `1` 的运动员获金牌 `"Gold Medal"` 。

- 名次第 `2` 的运动员获银牌 `"Silver Medal"` 。

- 名次第 `3` 的运动员获铜牌 `"Bronze Medal"` 。

- 从名次第 `4` 到第 `n` 的运动员，只能获得他们的名次编号（即，名次第 `x` 的运动员获得编号 `"x"`）。

使用长度为 `n` 的数组 `answer` 返回获奖，其中 `answer[i]` 是第 `i` 位运动员的获奖情况。

**示例 1：**

```text
输入：score = [5,4,3,2,1]
输出：["Gold Medal","Silver Medal","Bronze Medal","4","5"]
解释：名次为 [1st, 2nd, 3rd, 4th, 5th] 。
```

**示例 2：**

```text
输入：score = [10,3,8,9,4]
输出：["Gold Medal","5","Bronze Medal","Silver Medal","4"]
解释：名次为 [1st, 5th, 3rd, 2nd, 4th] 。
```

**提示：**

- `n == score.length`

- `1 <= n <= 10^4`

- `0 <= score[i] <= 10^6`

- `score` 中的所有值 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们使用一个数组 $\textit{idx}$ 存储 $0$ 到 $n-1$ 的下标，然后对 $\textit{idx}$ 进行排序，排序规则为：按照 $\textit{score}$ 的值从大到小排序。

然后我们定义一个数组 $\textit{top3} = [\text{Gold Medal}, \text{Silver Medal}, \text{Bronze Medal}]$，遍历 $\textit{idx}$，对于每个下标 $j$，如果 $j$ 小于 $3$，则 $\textit{ans}[j]$ 为 $\textit{top3}[j]$，否则为 $j+1$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{score}$ 的长度。

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
// Relative Ranks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findRelativeRanks(score []int) []string {
	n := len(score)
	idx := make([][]int, n)
	for i := 0; i < n; i++ {
		idx[i] = []int{score[i], i}
	}
	sort.Slice(idx, func(i1, i2 int) bool {
		return idx[i1][0] > idx[i2][0]
	})
	ans := make([]string, n)
	top3 := []string{"Gold Medal", "Silver Medal", "Bronze Medal"}
	for i := 0; i < n; i++ {
		if i < 3 {
			ans[idx[i][1]] = top3[i]
		} else {
			ans[idx[i][1]] = strconv.Itoa(i + 1)
		}
	}
	return ans
}
```

### Java

```java
// Relative Ranks：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String[] findRelativeRanks(int[] score) {
        int n = score.length;
        Integer[] idx = new Integer[n];
        Arrays.setAll(idx, i -> i);
        Arrays.sort(idx, (i1, i2) -> score[i2] - score[i1]);
        String[] ans = new String[n];
        String[] top3 = new String[] {"Gold Medal", "Silver Medal", "Bronze Medal"};
        for (int i = 0; i < n; ++i) {
            ans[idx[i]] = i < 3 ? top3[i] : String.valueOf(i + 1);
        }
        return ans;
    }
}
```

### Python

```python
# Relative Ranks：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findRelativeRanks(self, score: List[int]) -> List[str]:
        n = len(score)
        idx = list(range(n))
        idx.sort(key=lambda x: -score[x])
        top3 = ["Gold Medal", "Silver Medal", "Bronze Medal"]
        ans = [None] * n
        for i, j in enumerate(idx):
            ans[j] = top3[i] if i < 3 else str(i + 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

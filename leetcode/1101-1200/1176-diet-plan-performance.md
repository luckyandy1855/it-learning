# 1176. Diet Plan Performance

---
编号: 1176
题目: Diet Plan Performance
难度: 简单
标签: [数组, 滑动窗口]
来源链接: https://leetcode.com/problems/diet-plan-performance/
---

## 题目描述

一个节食者在第 `i` 天消耗 `calories[i]` 卡路里。

给定一个整数 `k`，对于 **每个** 连续的 `k` 天序列（对于所有的 `0  upper`，那么这份计划相对优秀，并获得 1 分；

- 否则，这份计划普普通通，分值不做变动。

请返回统计完所有 `calories.length` 天后得到的总分作为评估结果。

注意：总分可能是负数。

**示例 1：**

```text
输入：calories = [1,2,3,4,5], k = 1, lower = 3, upper = 3
输出：0
解释：calories[0], calories[1]  upper, 总分 = 0.
```

**示例 2：**

```text
输入：calories = [3,2], k = 2, lower = 0, upper = 1
输出：1
解释：calories[0] + calories[1] > upper, 总分 = 1.
```

**示例 3：**

```text
输入：calories = [6,5,0,0], k = 2, lower = 1, upper = 5
输出：0
解释：calories[0] + calories[1] > upper, calories[2] + calories[3] < lower, 总分 = 0.
```

**提示：**

- `1 <= k <= calories.length <= 10^5`

- `0 <= calories[i] <= 20000`

- `0 <= lower <= upper`

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

我们先预处理出长度为 $n+1$ 的前缀和数组 $s$，其中 $s[i]$ 表示前 $i$ 天的卡路里总和。

然后遍历前缀和数组 $s$，对于每个位置 $i$，计算 $s[i+k]-s[i]$，即为第 $i$ 天开始的连续 $k$ 天的卡路里总和。根据题意，对于每个 $s[i+k]-s[i]$，判断值与 $lower$ 和 $upper$ 的关系，更新答案即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 `calories` 的长度。

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
// Diet Plan Performance：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func dietPlanPerformance(calories []int, k int, lower int, upper int) (ans int) {
	n := len(calories)
	s := make([]int, n+1)
	for i, x := range calories {
		s[i+1] = s[i] + x
	}
	for i := 0; i < n-k+1; i++ {
		t := s[i+k] - s[i]
		if t < lower {
			ans--
		} else if t > upper {
			ans++
		}
	}
	return
}
```

### Java

```java
// Diet Plan Performance：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int dietPlanPerformance(int[] calories, int k, int lower, int upper) {
        int n = calories.length;
        int[] s = new int[n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + calories[i];
        }
        int ans = 0;
        for (int i = 0; i < n - k + 1; ++i) {
            int t = s[i + k] - s[i];
            if (t < lower) {
                --ans;
            } else if (t > upper) {
                ++ans;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Diet Plan Performance：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def dietPlanPerformance(
        self, calories: List[int], k: int, lower: int, upper: int
    ) -> int:
        s = list(accumulate(calories, initial=0))
        ans, n = 0, len(calories)
        for i in range(n - k + 1):
            t = s[i + k] - s[i]
            if t < lower:
                ans -= 1
            elif t > upper:
                ans += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

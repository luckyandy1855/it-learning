# 1482. Minimum Number of Days to Make m Bouquets

---
编号: 1482
题目: Minimum Number of Days to Make m Bouquets
难度: 中等
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/
---

## 题目描述

给你一个整数数组 `bloomDay`，以及两个整数 `m` 和 `k` 。

现需要制作 `m` 束花。制作花束时，需要使用花园中 **相邻的 `k` 朵花** 。

花园中有 `n` 朵花，第 `i` 朵花会在 `bloomDay[i]` 时盛开，**恰好** 可以用于 **一束** 花中。

请你返回从花园中摘 `m` 束花需要等待的最少的天数。如果不能摘到 `m` 束花则返回 **-1** 。

**示例 1：**

```text
输入：bloomDay = [1,10,3,10,2], m = 3, k = 1
输出：3
解释：让我们一起观察这三天的花开过程，x 表示花开，而 _ 表示花还未开。
现在需要制作 3 束花，每束只需要 1 朵。
1 天后：[x, _, _, _, _]   // 只能制作 1 束花
2 天后：[x, _, _, _, x]   // 只能制作 2 束花
3 天后：[x, _, x, _, x]   // 可以制作 3 束花，答案为 3
```

**示例 2：**

```text
输入：bloomDay = [1,10,3,10,2], m = 3, k = 2
输出：-1
解释：要制作 3 束花，每束需要 2 朵花，也就是一共需要 6 朵花。而花园中只有 5 朵花，无法满足制作要求，返回 -1 。
```

**示例 3：**

```text
输入：bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3
输出：12
解释：要制作 2 束花，每束需要 3 朵。
花园在 7 天后和 12 天后的情况如下：
7 天后：[x, x, x, x, _, x, x]
可以用前 3 朵盛开的花制作第一束花。但不能使用后 3 朵盛开的花，因为它们不相邻。
12 天后：[x, x, x, x, x, x, x]
显然，我们可以用不同的方式制作两束花。
```

**示例 4：**

```text
输入：bloomDay = [1000000000,1000000000], m = 1, k = 1
输出：1000000000
解释：需要等 1000000000 天才能采到花来制作花束
```

**示例 5：**

```text
输入：bloomDay = [1,10,2,9,3,8,4,7,5,6], m = 4, k = 2
输出：9
```

**提示：**

- `bloomDay.length == n`

- `1 <= n <= 10^5`

- `1 <= bloomDay[i] <= 10^9`

- `1 <= m <= 10^6`

- `1 <= k <= n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，如果一个天数 $t$ 可以满足制作 $m$ 束花，那么对任意 $t' > t$，也一定可以满足制作 $m$ 束花。因此，我们可以使用二分查找的方法找到最小的满足制作 $m$ 束花的天数。

我们记花园中最大的开花天数为 $mx$，接下来，我们定义二分查找的左边界 $l = 1$，右边界 $r = mx + 1$。

然后，我们进行二分查找，对于每一个中间值 $\textit{mid} = \frac{l + r}{2}$，我们判断是否可以制作 $m$ 束花。如果可以，我们将右边界 $r$ 更新为 $\textit{mid}$，否则，我们将左边界 $l$ 更新为 $\textit{mid} + 1$。

最终，当 $l = r$ 时，结束二分查找。此时如果 $l > mx$，说明无法制作 $m$ 束花，返回 $-1$，否则返回 $l$。

因此，问题转换为判断一个天数 $\textit{days}$ 是否可以制作 $m$ 束花。

我们可以使用一个函数 $\text{check}(\textit{days})$ 来判断是否可以制作 $m$ 束花。具体地，我们从左到右遍历花园中的每一朵花，如果当前花开的天数小于等于 $\textit{days}$，我们将当前花加入到当前花束中，否则，我们将当前花束清空。当当前花束中的花的数量等于 $k$ 时，我们将当前花束的数量加一，并清空当前花束。最后，我们判断当前花束的数量是否大于等于 $m$，如果是，说明可以制作 $m$ 束花，否则，说明无法制作 $m$ 束花。

时间复杂度 $O(n \times \log M)$，其中 $n$ 和 $M$ 分别为花园中的花的数量和最大的开花天数，本题中 $M \leq 10^9$。空间复杂度 $O(1)$。

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
// Minimum Number of Days to Make m Bouquets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minDays(bloomDay []int, m int, k int) int {
	mx := slices.Max(bloomDay)
	if l := sort.Search(mx+2, func(days int) bool {
		cnt, cur := 0, 0
		for _, x := range bloomDay {
			if x <= days {
				cur++
				if cur == k {
					cnt++
					cur = 0
				}
			} else {
				cur = 0
			}
		}
		return cnt >= m
	}); l <= mx {
		return l
	}
	return -1

}
```

### Java

```java
// Minimum Number of Days to Make m Bouquets：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] bloomDay;
    private int m, k;

    public int minDays(int[] bloomDay, int m, int k) {
        this.bloomDay = bloomDay;
        this.m = m;
        this.k = k;
        final int mx = (int) 1e9;
        int l = 1, r = mx + 1;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (check(mid)) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l > mx ? -1 : l;
    }

    private boolean check(int days) {
        int cnt = 0, cur = 0;
        for (int x : bloomDay) {
            cur = x <= days ? cur + 1 : 0;
            if (cur == k) {
                ++cnt;
                cur = 0;
            }
        }
        return cnt >= m;
    }
}
```

### Python

```python
# Minimum Number of Days to Make m Bouquets：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        def check(days: int) -> int:
            cnt = cur = 0
            for x in bloomDay:
                cur = cur + 1 if x <= days else 0
                if cur == k:
                    cnt += 1
                    cur = 0
            return cnt >= m

        mx = max(bloomDay)
        l = bisect_left(range(mx + 2), True, key=check)
        return -1 if l > mx else l
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

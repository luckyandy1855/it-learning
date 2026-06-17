# 1231. Divide Chocolate

---
编号: 1231
题目: Divide Chocolate
难度: 困难
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/divide-chocolate/
---

## 题目描述

你有一大块巧克力，它由一些甜度不完全相同的小块组成。我们用数组 `sweetness` 来表示每一小块的甜度。

你打算和 `K` 名朋友一起分享这块巧克力，所以你需要将切割 `K` 次才能得到 `K+1` 块，每一块都由一些 **连续 **的小块组成。

为了表现出你的慷慨，你将会吃掉 **总甜度最小** 的一块，并将其余几块分给你的朋友们。

请找出一个最佳的切割策略，使得你所分得的巧克力 **总甜度最大**，并返回这个 **最大总甜度**。

**示例 1：**

```text
输入：sweetness = [1,2,3,4,5,6,7,8,9], K = 5
输出：6
解释：你可以把巧克力分成 [1,2,3], [4,5], [6], [7], [8], [9]。
```

**示例 2：**

```text
输入：sweetness = [5,6,7,8,9,1,2,3,4], K = 8
输出：1
解释：只有一种办法可以把巧克力分成 9 块。
```

**示例 3：**

```text
输入：sweetness = [1,2,2,1,2,2,1,2,2], K = 2
输出：5
解释：你可以把巧克力分成 [1,2,2], [1,2,2], [1,2,2]。
```

**提示：**

- `0 <= K < sweetness.length <= 10^4`

- `1 <= sweetness[i] <= 10^5`

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

我们注意到，如果我们能吃到一块甜度为 $x$ 的巧克力，那么甜度小于等于 $x$ 的巧克力也都能吃到。这存在着单调性，因此，我们可以使用二分查找，找到最大的满足条件的 $x$。

我们定义二分查找的左边界 $l=0$，右边界 $r=\sum_{i=0}^{n-1} sweetness[i]$。每一次，我们取 $l$ 和 $r$ 的中间值 $mid$，然后判断能否吃到一块甜度为 $mid$ 的巧克力。如果能吃到，那么我们就尝试吃掉甜度更大的巧克力，即令 $l=mid$；否则，我们就尝试吃掉甜度更小的巧克力，即令 $r=mid-1$。在二分查找结束后，我们返回 $l$ 即可。

问题的关键在于，我们如何判断能否吃到一块甜度为 $x$ 的巧克力。我们可以使用贪心的思想，从左到右遍历数组，每次累加当前的甜度，当累加的甜度大于等于 $x$ 时，那么巧克力数 $cnt$ 加 $1$，并将累加的甜度清零。最后判断 $cnt$ 是否大于 $k$ 即可。

时间复杂度 $O(n \times \log \sum_{i=0}^{n-1} sweetness[i])$，空间复杂度 $O(1)$。其中 $n$ 是数组的长度。

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
// Divide Chocolate：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maximizeSweetness(sweetness []int, k int) int {
	l, r := 0, 0
	for _, v := range sweetness {
		r += v
	}
	check := func(x int) bool {
		s, cnt := 0, 0
		for _, v := range sweetness {
			s += v
			if s >= x {
				s = 0
				cnt++
			}
		}
		return cnt > k
	}
	for l < r {
		mid := (l + r + 1) >> 1
		if check(mid) {
			l = mid
		} else {
			r = mid - 1
		}
	}
	return l
}
```

### Java

```java
// Divide Chocolate：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maximizeSweetness(int[] sweetness, int k) {
        int l = 0, r = 0;
        for (int v : sweetness) {
            r += v;
        }
        while (l < r) {
            int mid = (l + r + 1) >> 1;
            if (check(sweetness, mid, k)) {
                l = mid;
            } else {
                r = mid - 1;
            }
        }
        return l;
    }

    private boolean check(int[] nums, int x, int k) {
        int s = 0, cnt = 0;
        for (int v : nums) {
            s += v;
            if (s >= x) {
                s = 0;
                ++cnt;
            }
        }
        return cnt > k;
    }
}
```

### Python

```python
# Divide Chocolate：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maximizeSweetness(self, sweetness: List[int], k: int) -> int:
        def check(x: int) -> bool:
            s = cnt = 0
            for v in sweetness:
                s += v
                if s >= x:
                    s = 0
                    cnt += 1
            return cnt > k

        l, r = 0, sum(sweetness)
        while l < r:
            mid = (l + r + 1) >> 1
            if check(mid):
                l = mid
            else:
                r = mid - 1
        return l
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1387. Sort Integers by The Power Value

---
编号: 1387
题目: Sort Integers by The Power Value
难度: 中等
标签: [记忆化, 动态规划, 排序]
来源链接: https://leetcode.com/problems/sort-integers-by-the-power-value/
---

## 题目描述

我们将整数 `x` 的 **权重** 定义为按照下述规则将 `x` 变成 `1` 所需要的步数：

- 如果 `x` 是偶数，那么 `x = x / 2`

- 如果 `x` 是奇数，那么 `x = 3 * x + 1`

比方说，x=3 的权重为 7 。因为 3 需要 7 步变成 1 （3 --> 10 --> 5 --> 16 --> 8 --> 4 --> 2 --> 1）。

给你三个整数 `lo`， `hi` 和 `k` 。你的任务是将区间 `[lo, hi]` 之间的整数按照它们的权重 **升序排序 **，如果大于等于 2 个整数有 **相同** 的权重，那么按照数字自身的数值 **升序排序** 。

请你返回区间 `[lo, hi]` 之间的整数按权重排序后的第 `k` 个数。

注意，题目保证对于任意整数 `x` `（lo <= x <= hi）` ，它变成 `1` 所需要的步数是一个 32 位有符号整数。

**示例 1：**

```text
输入：lo = 12, hi = 15, k = 2
输出：13
解释：12 的权重为 9（12 --> 6 --> 3 --> 10 --> 5 --> 16 --> 8 --> 4 --> 2 --> 1）
13 的权重为 9
14 的权重为 17
15 的权重为 17
区间内的数按权重排序以后的结果为 [12,13,14,15] 。对于 k = 2 ，答案是第二个整数也就是 13 。
注意，12 和 13 有相同的权重，所以我们按照它们本身升序排序。14 和 15 同理。
```

**示例 2：**

```text
输入：lo = 7, hi = 11, k = 4
输出：7
解释：区间内整数 [7, 8, 9, 10, 11] 对应的权重为 [16, 3, 19, 6, 14] 。
按权重排序后得到的结果为 [8, 10, 11, 7, 9] 。
排序后数组中第 4 个数字为 7 。
```

**提示：**

- `1 <= lo <= hi <= 1000`

- `1 <= k <= hi - lo + 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「记忆化, 动态规划, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先定义一个函数 $\textit{f}(x)$，表示将数字 $x$ 变成 $1$ 所需要的步数，也即是数字 $x$ 的权重。

然后我们将区间 $[\textit{lo}, \textit{hi}]$ 内的所有数字按照权重升序排序，如果权重相同，按照数字自身的数值升序排序。

最后返回排序后的第 $k$ 个数字。

时间复杂度 $O(n \times \log n \times M)$，空间复杂度 $O(n)$。其中 $n$ 是区间 $[\textit{lo}, \textit{hi}]$ 内的数字个数，而 $M$ 是 $f(x)$ 的最大值，本题中 $M$ 最大为 $178$。

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
// Sort Integers by The Power Value：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getKth(lo int, hi int, k int) int {
	f := func(x int) (ans int) {
		for ; x != 1; ans++ {
			if x%2 == 0 {
				x /= 2
			} else {
				x = 3*x + 1
			}
		}
		return
	}
	nums := make([]int, hi-lo+1)
	for i := range nums {
		nums[i] = lo + i
	}
	sort.Slice(nums, func(i, j int) bool {
		fx, fy := f(nums[i]), f(nums[j])
		if fx != fy {
			return fx < fy
		}
		return nums[i] < nums[j]
	})
	return nums[k-1]
}
```

### Java

```java
// Sort Integers by The Power Value：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int getKth(int lo, int hi, int k) {
        Integer[] nums = new Integer[hi - lo + 1];
        for (int i = lo; i <= hi; ++i) {
            nums[i - lo] = i;
        }
        Arrays.sort(nums, (a, b) -> {
            int fa = f(a), fb = f(b);
            return fa == fb ? a - b : fa - fb;
        });
        return nums[k - 1];
    }

    private int f(int x) {
        int ans = 0;
        for (; x != 1; ++ans) {
            if (x % 2 == 0) {
                x /= 2;
            } else {
                x = x * 3 + 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Sort Integers by The Power Value：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
@cache
def f(x: int) -> int:
    ans = 0
    while x != 1:
        if x % 2 == 0:
            x //= 2
        else:
            x = 3 * x + 1
        ans += 1
    return ans


class Solution:
    def getKth(self, lo: int, hi: int, k: int) -> int:
        return sorted(range(lo, hi + 1), key=f)[k - 1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

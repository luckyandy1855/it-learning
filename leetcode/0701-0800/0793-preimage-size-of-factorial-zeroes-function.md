# 0793. Preimage Size of Factorial Zeroes Function

---
编号: 793
题目: Preimage Size of Factorial Zeroes Function
难度: 困难
标签: [数学, 二分查找]
来源链接: https://leetcode.com/problems/preimage-size-of-factorial-zeroes-function/
---

## 题目描述

`f(x)` 是 `x!` 末尾是 0 的数量。回想一下 `x! = 1 * 2 * 3 * ... * x`，且 `0! = 1` 。

- 例如， `f(3) = 0` ，因为 `3! = 6` 的末尾没有 0 ；而 `f(11) = 2` ，因为 `11!= 39916800` 末端有 2 个 0 。

给定 `k`，找出返回能满足 `f(x) = k` 的非负整数 `x` 的数量。

**示例 1：**** **

```text
输入：k = 0
输出：5
解释：0!, 1!, 2!, 3!, 和 4! 均符合 k = 0 的条件。
```

**示例 2：**

```text
输入：k = 5
输出：0
解释：没有匹配到这样的 x!，符合 k = 5 的条件。
```

**示例 3:**

```text
输入: k = 3
输出: 5
```

**提示:**

- `0 <= k <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

定义 $f(x)$ 为 $x!$ 末尾零的个数，那么


f(x)=
\begin{cases}
0, x=0\\
x/5+f(x/5), x>0
\end{cases}


定义 $g(k)$ 表示 $x!$ 末尾为零的个数为 $k$ 的最小的 $x$ 值，那么题目等价于求解 $g(k+1)-g(k)$。

由于 $g(k)$ 是单调递增的，因此可以使用二分查找求解 $g(k)$。

同时，由于 $f(x)=x/5+f(x/5) \ge x/5$，因此 $f(5k)\ge k$。所以，求解 $g(k)$ 时，二分的右边界可以取 $5k$。

时间复杂度 $O(log^2k)$，其中 $k$ 为题目给定的整数。二分查找 $g(k)$ 的时间复杂度为 $O(logk)$，计算 $f(x)$ 的时间复杂度为 $O(logx)$，因此总时间复杂度为 $O(log^2k)$。

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
// Preimage Size of Factorial Zeroes Function：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func preimageSizeFZF(k int) int {
	f := func(x int) int {
		res := 0
		for x != 0 {
			x /= 5
			res += x
		}
		return res
	}

	g := func(k int) int {
		left, right := 0, k*5
		for left < right {
			mid := (left + right) >> 1
			if f(mid) >= k {
				right = mid
			} else {
				left = mid + 1
			}
		}
		return left
	}

	return g(k+1) - g(k)
}
```

### Java

```java
// Preimage Size of Factorial Zeroes Function：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int preimageSizeFZF(int k) {
        return g(k + 1) - g(k);
    }

    private int g(int k) {
        long left = 0, right = 5 * k;
        while (left < right) {
            long mid = (left + right) >> 1;
            if (f(mid) >= k) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return (int) left;
    }

    private int f(long x) {
        if (x == 0) {
            return 0;
        }
        return (int) (x / 5) + f(x / 5);
    }
}
```

### Python

```python
# Preimage Size of Factorial Zeroes Function：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def preimageSizeFZF(self, k: int) -> int:
        def f(x):
            if x == 0:
                return 0
            return x // 5 + f(x // 5)

        def g(k):
            return bisect_left(range(5 * k), k, key=f)

        return g(k + 1) - g(k)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

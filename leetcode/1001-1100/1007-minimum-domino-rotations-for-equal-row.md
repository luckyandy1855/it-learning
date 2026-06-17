# 1007. Minimum Domino Rotations For Equal Row

---
编号: 1007
题目: Minimum Domino Rotations For Equal Row
难度: 中等
标签: [贪心, 数组]
来源链接: https://leetcode.com/problems/minimum-domino-rotations-for-equal-row/
---

## 题目描述

在一排多米诺骨牌中，`tops[i]` 和 `bottoms[i]` 分别代表第 `i` 个多米诺骨牌的上半部分和下半部分。（一个多米诺是两个从 1 到 6 的数字同列平铺形成的 —— 该平铺的每一半上都有一个数字。）

我们可以旋转第 `i` 张多米诺，使得 `tops[i]` 和 `bottoms[i]` 的值交换。

返回能使 `tops` 中所有值或者 `bottoms` 中所有值都相同的最小旋转次数。

如果无法做到，返回 `-1`.

示例 1：

```text
输入：tops = [2,1,2,4,2,2], bottoms = [5,2,6,2,3,2]
输出：2
解释：
图一表示：在我们旋转之前， tops 和 bottoms 给出的多米诺牌。
如果我们旋转第二个和第四个多米诺骨牌，我们可以使上面一行中的每个值都等于 2，如图二所示。
```

示例 2：

```text
输入：tops = [3,5,1,2,3], bottoms = [3,6,3,3,4]
输出：-1
解释： 在这种情况下，不可能旋转多米诺牌使一行的值相等。
```

**提示：**

- `2 <= tops.length <= 2 * 10^4`

- `bottoms.length == tops.length`

- `1 <= tops[i], bottoms[i] <= 6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们知道，要使得 $tops$ 中所有值或者 $bottoms$ 中所有值都相同，那么这个值必须是 $tops[0]$ 或者 $bottoms[0]$ 中的一个。

因此，我们设计一个函数 $f(x)$，表示将所有的值都变成 $x$ 的最小旋转次数，那么答案就是 $\min\{f(\textit{tops}[0]), f(\textit{bottoms}[0])\}$。

函数 $f(x)$ 的计算方法如下：

我们用两个变量 $cnt1$ 和 $cnt2$ 统计 $tops$ 和 $bottoms$ 中等于 $x$ 的个数，用 $n$ 减去它们的最大值，就是将所有值都变成 $x$ 的最小旋转次数。注意，如果 $tops$ 和 $bottoms$ 中没有等于 $x$ 的值，那么 $f(x)$ 的值就是一个很大的数，我们用 $n + 1$ 表示这个数。

时间复杂度 $O(n)$，其中 $n$ 是数组的长度。空间复杂度 $O(1)$。

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
// Minimum Domino Rotations For Equal Row：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minDominoRotations(tops []int, bottoms []int) int {
	n := len(tops)
	f := func(x int) int {
		cnt1, cnt2 := 0, 0
		for i, a := range tops {
			b := bottoms[i]
			if a != x && b != x {
				return n + 1
			}
			if a == x {
				cnt1++
			}
			if b == x {
				cnt2++
			}
		}
		return n - max(cnt1, cnt2)
	}
	ans := min(f(tops[0]), f(bottoms[0]))
	if ans > n {
		return -1
	}
	return ans
}
```

### Java

```java
// Minimum Domino Rotations For Equal Row：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private int[] tops;
    private int[] bottoms;

    public int minDominoRotations(int[] tops, int[] bottoms) {
        n = tops.length;
        this.tops = tops;
        this.bottoms = bottoms;
        int ans = Math.min(f(tops[0]), f(bottoms[0]));
        return ans > n ? -1 : ans;
    }

    private int f(int x) {
        int cnt1 = 0, cnt2 = 0;
        for (int i = 0; i < n; ++i) {
            if (tops[i] != x && bottoms[i] != x) {
                return n + 1;
            }
            cnt1 += tops[i] == x ? 1 : 0;
            cnt2 += bottoms[i] == x ? 1 : 0;
        }
        return n - Math.max(cnt1, cnt2);
    }
}
```

### Python

```python
# Minimum Domino Rotations For Equal Row：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minDominoRotations(self, tops: List[int], bottoms: List[int]) -> int:
        def f(x: int) -> int:
            cnt1 = cnt2 = 0
            for a, b in zip(tops, bottoms):
                if x not in (a, b):
                    return inf
                cnt1 += a == x
                cnt2 += b == x
            return len(tops) - max(cnt1, cnt2)

        ans = min(f(tops[0]), f(bottoms[0]))
        return -1 if ans == inf else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

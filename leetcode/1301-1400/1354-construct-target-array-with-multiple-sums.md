# 1354. Construct Target Array With Multiple Sums

---
编号: 1354
题目: Construct Target Array With Multiple Sums
难度: 困难
标签: [数组, 堆（优先队列）]
来源链接: https://leetcode.com/problems/construct-target-array-with-multiple-sums/
---

## 题目描述

给你一个整数数组 `target` 。一开始，你有一个数组 `A` ，它的所有元素均为 1 ，你可以执行以下操作：

- 令 `x` 为你数组里所有元素的和

- 选择满足 `0 <= i < target.size` 的任意下标 `i` ，并让 `A` 数组里下标为 `i` 处的值为 `x` 。

- 你可以重复该过程任意次

如果能从 `A` 开始构造出目标数组 `target` ，请你返回 True ，否则返回 False 。

**示例 1：**

```text
输入：target = [9,3,5]
输出：true
解释：从 [1, 1, 1] 开始
[1, 1, 1], 和为 3 ，选择下标 1
[1, 3, 1], 和为 5， 选择下标 2
[1, 3, 5], 和为 9， 选择下标 0
[9, 3, 5] 完成
```

**示例 2：**

```text
输入：target = [1,1,1,2]
输出：false
解释：不可能从 [1,1,1,1] 出发构造目标数组。
```

**示例 3：**

```text
输入：target = [8,5]
输出：true
```

**提示：**

- `N == target.length`

- `1 <= target.length <= 5 * 10^4`

- `1 <= target[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们发现，如果从数组 $\textit{arr}$ 开始正向构造目标数组 $\textit{target}$，每次都不好确定选择哪个下标 $i$，问题比较复杂。而如果我们从数组 $\textit{target}$ 开始逆向构造，每次构造都一定是选择当前数组中最大的元素，这样就可以保证每次构造都是唯一的，问题比较简单。

因此，我们可以使用优先队列（大根堆）来存储数组 $\textit{target}$ 中的元素，用一个变量 $s$ 记录数组 $\textit{target}$ 中所有元素的和。每次从优先队列中取出最大的元素 $mx$，计算当前数组中除 $mx$ 以外的所有元素之和 $t$，如果 $t \lt 1$ 或者 $mx - t \lt 1$，则说明无法构造目标数组 $\textit{target}$，返回 `false`。否则，我们计算 $mx \bmod t$，如果 $mx \bmod t = 0$，则令 $x = t$，否则令 $x = mx \bmod t$，将 $x$ 加入优先队列中，并更新 $s$ 的值，重复上述操作，直到优先队列中的所有元素都变为 $1$，此时返回 `true`。

时间复杂度 $O(n \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{target}$ 的长度。

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
// Construct Target Array With Multiple Sums：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isPossible(target []int) bool {
	pq := &hp{target}
	s := 0
	for _, x := range target {
		s += x
	}
	heap.Init(pq)
	for target[0] > 1 {
		mx := target[0]
		t := s - mx
		if t < 1 || mx-t < 1 {
			return false
		}
		x := mx % t
		if x == 0 {
			x = t
		}
		target[0] = x
		heap.Fix(pq, 0)
		s = s - mx + x
	}
	return true
}

type hp struct{ sort.IntSlice }

func (h hp) Less(i, j int) bool { return h.IntSlice[i] > h.IntSlice[j] }
func (hp) Pop() (_ any)         { return }
func (hp) Push(any)             {}
```

### Java

```java
// Construct Target Array With Multiple Sums：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isPossible(int[] target) {
        PriorityQueue<Long> pq = new PriorityQueue<>(Collections.reverseOrder());
        long s = 0;
        for (int x : target) {
            s += x;
            pq.offer((long) x);
        }
        while (pq.peek() > 1) {
            long mx = pq.poll();
            long t = s - mx;
            if (t == 0 || mx - t < 1) {
                return false;
            }
            long x = mx % t;
            if (x == 0) {
                x = t;
            }
            pq.offer(x);
            s = s - mx + x;
        }
        return true;
    }
}
```

### Python

```python
# Construct Target Array With Multiple Sums：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isPossible(self, target: List[int]) -> bool:
        s = sum(target)
        pq = [-x for x in target]
        heapify(pq)
        while -pq[0] > 1:
            mx = -heappop(pq)
            t = s - mx
            if t == 0 or mx - t < 1:
                return False
            x = (mx % t) or t
            heappush(pq, -x)
            s = s - mx + x
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

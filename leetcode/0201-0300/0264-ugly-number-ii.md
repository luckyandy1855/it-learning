# 0264. Ugly Number II

---
编号: 264
题目: Ugly Number II
难度: 中等
标签: [哈希表, 数学, 动态规划, 堆（优先队列）]
来源链接: https://leetcode.com/problems/ugly-number-ii/
---

## 题目描述

给你一个整数 `n` ，请你找出并返回第 `n` 个 **丑数** 。

**丑数 **就是质因子只包含 `2`、`3` 和 `5` 的正整数。

**示例 1：**

```text
输入：n = 10
输出：12
解释：[1, 2, 3, 4, 5, 6, 8, 9, 10, 12] 是由前 10 个丑数组成的序列。
```

**示例 2：**

```text
输入：n = 1
输出：1
解释：1 通常被视为丑数。
```

**提示：**

- `1 <= n <= 1690`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 数学, 动态规划, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

初始时，将第一个丑数 $1$ 加入堆。每次取出堆顶元素 $x$，由于 $2x$, $3x$, $5x$ 也是丑数，因此将它们加入堆中。为了避免重复元素，可以用哈希表 $vis$ 去重。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。

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
// Ugly Number II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func nthUglyNumber(n int) int {
	h := IntHeap([]int{1})
	heap.Init(&h)
	ans := 1
	vis := map[int]bool{1: true}
	for n > 0 {
		ans = heap.Pop(&h).(int)
		for _, v := range []int{2, 3, 5} {
			nxt := ans * v
			if !vis[nxt] {
				vis[nxt] = true
				heap.Push(&h, nxt)
			}
		}
		n--
	}
	return ans
}

type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any) {
	*h = append(*h, x.(int))
}
func (h *IntHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}
```

### Java

```java
import java.util.*;
// Ugly Number II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int nthUglyNumber(int n) {
        Set<Long> vis = new HashSet<>();
        PriorityQueue<Long> q = new PriorityQueue<>();
        int[] f = new int[] {2, 3, 5};
        q.offer(1L);
        vis.add(1L);
        long ans = 0;
        while (n-- > 0) {
            ans = q.poll();
            for (int v : f) {
                long next = ans * v;
                if (vis.add(next)) {
                    q.offer(next);
                }
            }
        }
        return (int) ans;
    }
}
```

### Python

```python
# Ugly Number II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def nthUglyNumber(self, n: int) -> int:
        h = [1]
        vis = {1}
        ans = 1
        for _ in range(n):
            ans = heappop(h)
            for v in [2, 3, 5]:
                nxt = ans * v
                if nxt not in vis:
                    vis.add(nxt)
                    heappush(h, nxt)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

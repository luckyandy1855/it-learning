# 0786. K-th Smallest Prime Fraction

---
编号: 786
题目: K-th Smallest Prime Fraction
难度: 中等
标签: [数组, 双指针, 二分查找, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/k-th-smallest-prime-fraction/
---

## 题目描述

给你一个按递增顺序排序的数组 `arr` 和一个整数 `k` 。数组 `arr` 由 `1` 和若干 **质数** 组成，且其中所有整数互不相同。

对于每对满足 `0  0`

- `arr` 中的所有数字 **互不相同** ，且按 **严格递增** 排序

- `1 <= k <= arr.length * (arr.length - 1) / 2`

**进阶：**你可以设计并实现时间复杂度小于 `O(n^2)` 的算法解决此问题吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 二分查找, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// K-th Smallest Prime Fraction：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type frac struct{ x, y, i, j int }
type hp []frac

func (a hp) Len() int           { return len(a) }
func (a hp) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a hp) Less(i, j int) bool { return a[i].x*a[j].y < a[j].x*a[i].y }
func (a *hp) Push(x any)        { *a = append(*a, x.(frac)) }
func (a *hp) Pop() any          { l := len(*a); tmp := (*a)[l-1]; *a = (*a)[:l-1]; return tmp }

func kthSmallestPrimeFraction(arr []int, k int) []int {
	n := len(arr)
	h := make(hp, 0, n-1)
	for i := 1; i < n; i++ {
		h = append(h, frac{1, arr[i], 0, i})
	}
	heap.Init(&h)
	for i := 1; i < k; i++ {
		f := heap.Pop(&h).(frac)
		if f.i+1 < f.j {
			heap.Push(&h, frac{arr[f.i+1], arr[f.j], f.i + 1, f.j})
		}
	}
	return []int{h[0].x, h[0].y}
}
```

### Java

```java
// K-th Smallest Prime Fraction：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] kthSmallestPrimeFraction(int[] arr, int k) {
        int n = arr.length;
        Queue<Frac> pq = new PriorityQueue<>();
        for (int i = 1; i < n; i++) {
            pq.offer(new Frac(1, arr[i], 0, i));
        }
        for (int i = 1; i < k; i++) {
            Frac f = pq.poll();
            if (f.i + 1 < f.j) {
                pq.offer(new Frac(arr[f.i + 1], arr[f.j], f.i + 1, f.j));
            }
        }
        Frac f = pq.peek();
        return new int[] {f.x, f.y};
    }

    static class Frac implements Comparable {
        int x, y, i, j;

        public Frac(int x, int y, int i, int j) {
            this.x = x;
            this.y = y;
            this.i = i;
            this.j = j;
        }

        @Override
        public int compareTo(Object o) {
            return x * ((Frac) o).y - ((Frac) o).x * y;
        }
    }
}
```

### Python

```python
# K-th Smallest Prime Fraction：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def kthSmallestPrimeFraction(self, arr: List[int], k: int) -> List[int]:
        h = [(1 / y, 0, j + 1) for j, y in enumerate(arr[1:])]
        heapify(h)
        for _ in range(k - 1):
            _, i, j = heappop(h)
            if i + 1 < j:
                heappush(h, (arr[i + 1] / arr[j], i + 1, j))
        return [arr[h[0][1]], arr[h[0][2]]]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

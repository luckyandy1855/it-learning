# 1272. Remove Interval

---
编号: 1272
题目: Remove Interval
难度: 中等
标签: [数组]
来源链接: https://leetcode.com/problems/remove-interval/
---

## 题目描述

实数集合可以表示为若干不相交区间的并集，其中每个区间的形式为 `[a, b)`（左闭右开），表示满足 `a i, bi]` 都表示一个区间 `[ai, bi)` 。再给你一个要删除的区间 `toBeRemoved` 。

返回 *一组实数，该实数表示`intervals` 中 **删除** 了 `toBeRemoved` 的部分* 。*换句话说，返回实数集合，并满足集合中的每个实数 `x` 都在 `intervals` 中，但不在 `toBeRemoved` 中。你的答案应该是一个如上所述的 **有序的** 不相连的间隔列表 。*

**示例 1：**

```text
输入：intervals = [[0,2],[3,4],[5,7]], toBeRemoved = [1,6]
输出：[[0,1],[6,7]]
```

**示例 2：**

```text
输入：intervals = [[0,5]], toBeRemoved = [2,3]
输出：[[0,2],[3,5]]
```

**示例 3：**

```text
输入：intervals = [[-5,-4],[-3,-2],[1,2],[3,5],[8,9]], toBeRemoved = [-1,4]
输出：[[-5,-4],[-3,-2],[4,5],[8,9]]
```

**提示：**

- `1 i i <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们记要删除的区间为 $[x, y)$，遍历区间列表，对于每个区间 $[a, b)$，有以下三种情况：

- $a \geq y$ 或 $b \leq x$，表示该区间与要删除的区间没有交集，直接将该区间加入答案；
- $a \lt x$, $b \gt y$，表示该区间与要删除的区间有交集，将该区间分成两个区间加入答案；
- $a \geq x$, $b \leq y$，表示该区间被要删除的区间完全覆盖，不加入答案。

时间复杂度 $O(n)$，其中 $n$ 为区间列表的长度。空间复杂度 $O(1)$。

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
// Remove Interval：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeInterval(intervals [][]int, toBeRemoved []int) (ans [][]int) {
	x, y := toBeRemoved[0], toBeRemoved[1]
	for _, e := range intervals {
		a, b := e[0], e[1]
		if a >= y || b <= x {
			ans = append(ans, e)
		} else {
			if a < x {
				ans = append(ans, []int{a, x})
			}
			if b > y {
				ans = append(ans, []int{y, b})
			}
		}
	}
	return
}
```

### Java

```java
// Remove Interval：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> removeInterval(int[][] intervals, int[] toBeRemoved) {
        int x = toBeRemoved[0], y = toBeRemoved[1];
        List<List<Integer>> ans = new ArrayList<>();
        for (var e : intervals) {
            int a = e[0], b = e[1];
            if (a >= y || b <= x) {
                ans.add(Arrays.asList(a, b));
            } else {
                if (a < x) {
                    ans.add(Arrays.asList(a, x));
                }
                if (b > y) {
                    ans.add(Arrays.asList(y, b));
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Remove Interval：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeInterval(
        self, intervals: List[List[int]], toBeRemoved: List[int]
    ) -> List[List[int]]:
        x, y = toBeRemoved
        ans = []
        for a, b in intervals:
            if a >= y or b <= x:
                ans.append([a, b])
            else:
                if a < x:
                    ans.append([a, x])
                if b > y:
                    ans.append([y, b])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

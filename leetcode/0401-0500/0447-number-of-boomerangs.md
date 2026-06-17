# 0447. Number of Boomerangs

---
编号: 447
题目: Number of Boomerangs
难度: 中等
标签: [数组, 哈希表, 数学]
来源链接: https://leetcode.com/problems/number-of-boomerangs/
---

## 题目描述

给定平面上* *`n`* *对 **互不相同** 的点 `points` ，其中 `points[i] = [xi, yi]` 。**回旋镖** 是由点 `(i, j, k)` 表示的元组 ，其中 `i` 和 `j` 之间的欧式距离和 `i` 和 `k` 之间的欧式距离相等（**需要考虑元组的顺序**）。

返回平面上所有回旋镖的数量。

**示例 1：**

```text
输入：points = [[0,0],[1,0],[2,0]]
输出：2
解释：两个回旋镖为 [[1,0],[0,0],[2,0]] 和 [[1,0],[2,0],[0,0]]
```

**示例 2：**

```text
输入：points = [[1,1],[2,2],[3,3]]
输出：2
```

**示例 3：**

```text
输入：points = [[1,1]]
输出：0
```

**提示：**

- `n == points.length`

- `1 i, yi <= 10^4`

- 所有点都 **互不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举 `points` 中的每个点作为回旋镖的点 $i$，然后用一个哈希表 $cnt$ 记录其他点到 $i$ 的距离出现的次数。

如果有 $x$ 个点到 $i$ 的距离相等，那么我们可以任选其中 $2$ 个点作为回旋镖的 $j$ 和 $k$，方案数为 $A_x^2 = x \times (x - 1)$。因此，我们对哈希表中的每个值 $x$，都计算并累加 $A_x^2$，就可以得到满足题目要求的回旋镖数量之和。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 是数组 `points` 的长度。

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
// Number of Boomerangs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberOfBoomerangs(points [][]int) (ans int) {
	for _, p1 := range points {
		cnt := map[int]int{}
		for _, p2 := range points {
			d := (p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1])
			ans += cnt[d]
			cnt[d]++
		}
	}
	ans <<= 1
	return
}
```

### Java

```java
// Number of Boomerangs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numberOfBoomerangs(int[][] points) {
        int ans = 0;
        for (int[] p1 : points) {
            Map<Integer, Integer> cnt = new HashMap<>();
            for (int[] p2 : points) {
                int d = (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]);
                ans += cnt.getOrDefault(d, 0);
                cnt.merge(d, 1, Integer::sum);
            }
        }
        return ans << 1;
    }
}
```

### Python

```python
# Number of Boomerangs：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberOfBoomerangs(self, points: List[List[int]]) -> int:
        ans = 0
        for p1 in points:
            cnt = Counter()
            for p2 in points:
                d = dist(p1, p2)
                ans += cnt[d]
                cnt[d] += 1
        return ans << 1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

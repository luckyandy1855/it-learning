# 0624. Maximum Distance in Arrays

---
编号: 624
题目: Maximum Distance in Arrays
难度: 中等
标签: [贪心, 数组]
来源链接: https://leetcode.com/problems/maximum-distance-in-arrays/
---

## 题目描述

给定 `m` 个数组，每个数组都已经按照升序排好序了。

现在你需要从两个不同的数组中选择两个整数（每个数组选一个）并且计算它们的距离。两个整数 `a` 和 `b` 之间的距离定义为它们差的绝对值 `|a-b|` 。

返回最大距离。

**示例 1：**

```text
输入：[[1,2,3],[4,5],[1,2,3]]
输出：4
解释：
一种得到答案 4 的方法是从第一个数组或者第三个数组中选择 1，同时从第二个数组中选择 5 。
```

示例 2：

```text
输入：arrays = [[1],[1]]
输出：0
```

**提示：**

- `m == arrays.length`

- `2 <= m <= 10^5`

- `1 <= arrays[i].length <= 500`

- `-10^4 <= arrays[i][j] <= 10^4`

- `arrays[i]` 以 **升序** 排序。

- 所有数组中最多有 `10^5` 个整数。

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

我们注意到，最大距离一定是两个数组中的一个最大值和另一个最小值之间的距离。因此，我们可以维护两个变量 $\textit{mi}$ 和 $\textit{mx}$，分别表示已经遍历过的数组中的最小值和最大值。初始时 $\textit{mi}$ 和 $\textit{mx}$ 分别为第一个数组的第一个元素和最后一个元素。

接下来，我们从第二个数组开始遍历，对于每个数组，我们首先计算当前数组的第一个元素和 $\textit{mx}$ 之间的距离，以及当前数组的最后一个元素和 $\textit{mi}$ 之间的距离，然后更新最大距离。同时，我们更新 $\textit{mi} = \min(\textit{mi}, \textit{arr}[0])$ 和 $\textit{mx} = \max(\textit{mx}, \textit{arr}[\textit{size} - 1])$。

遍历结束后，即可得到最大距离。

时间复杂度 $O(m)$，其中 $m$ 为数组的个数。空间复杂度 $O(1)$。

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
// Maximum Distance in Arrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxDistance(arrays [][]int) (ans int) {
	mi, mx := arrays[0][0], arrays[0][len(arrays[0])-1]
	for _, arr := range arrays[1:] {
		a, b := abs(arr[0]-mx), abs(arr[len(arr)-1]-mi)
		ans = max(ans, max(a, b))
		mi = min(mi, arr[0])
		mx = max(mx, arr[len(arr)-1])
	}
	return ans
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Maximum Distance in Arrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxDistance(List<List<Integer>> arrays) {
        int ans = 0;
        int mi = arrays.get(0).get(0);
        int mx = arrays.get(0).get(arrays.get(0).size() - 1);
        for (int i = 1; i < arrays.size(); ++i) {
            var arr = arrays.get(i);
            int a = Math.abs(arr.get(0) - mx);
            int b = Math.abs(arr.get(arr.size() - 1) - mi);
            ans = Math.max(ans, Math.max(a, b));
            mi = Math.min(mi, arr.get(0));
            mx = Math.max(mx, arr.get(arr.size() - 1));
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Distance in Arrays：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxDistance(self, arrays: List[List[int]]) -> int:
        ans = 0
        mi, mx = arrays[0][0], arrays[0][-1]
        for arr in arrays[1:]:
            a, b = abs(arr[0] - mx), abs(arr[-1] - mi)
            ans = max(ans, a, b)
            mi = min(mi, arr[0])
            mx = max(mx, arr[-1])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

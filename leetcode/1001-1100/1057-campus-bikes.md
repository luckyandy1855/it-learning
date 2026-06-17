# 1057. Campus Bikes

---
编号: 1057
题目: Campus Bikes
难度: 中等
标签: [数组, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/campus-bikes/
---

## 题目描述

在 X-Y 平面上表示的校园中，有 `n` 名工人和 `m` 辆自行车，其中 `n j, yj]` 是第 `j` 辆自行车的位置。所有给定的位置都是 **唯一** 的。

我们需要为每位工人分配一辆自行车。在所有可用的自行车和工人中，我们选取彼此之间 **曼哈顿距离** 最短的工人自行车对 `(workeri, bikej)` ，并将其中的自行车分配給工人。

如果有多个 `(workeri, bikej)` 对之间的 **曼哈顿距离** 相同，那么我们选择 **工人索引最小** 的那对。类似地，如果有多种不同的分配方法，则选择 **自行车索引最小** 的一对。不断重复这一过程，直到所有工人都分配到自行车为止。

返回长度为 `n` 的向量 `answer`，其中 `answer[i]` 是第 `i` 位工人分配到的自行车的索引（**从 0 开始**）。

给定两点 `p1` 和 `p2` 之间的 **曼哈顿距离** 为 `Manhattan(p1, p2) = |p1.x - p2.x| + |p1.y - p2.y|`。

**示例 1：**

```text
输入：workers = [[0,0],[2,1]], bikes = [[1,2],[3,3]]
输出：[1,0]
解释：工人 1 分配到自行车 0，因为他们最接近且不存在冲突，工人 0 分配到自行车 1 。所以输出是 [1,0]。
```

**示例 2：**

```text
输入：workers = [[0,0],[1,1],[2,0]], bikes = [[1,0],[2,2],[2,1]]
输出：[0,2,1]
解释：工人 0 首先分配到自行车 0 。工人 1 和工人 2 与自行车 2 距离相同，因此工人 1 分配到自行车 2，工人 2 将分配到自行车 1 。因此输出为 [0,2,1]。
```

**提示：**

- `n == workers.length`

- `m == bikes.length`

- `1 i, yi j, yj < 1000`

- 所有工人和自行车的位置都**不相同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

先计算每个工人和每个自行车之间的曼哈顿距离，然后按照曼哈顿距离从小到大排序，遍历排序后的数组，如果当前工人和自行车都未被分配，则分配给当前工人和自行车。

时间复杂度 $O(n\times m\times \log (n\times m))$。其中 $n$ 和 $m$ 分别为工人和自行车的数量。

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
// Campus Bikes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func assignBikes(workers [][]int, bikes [][]int) []int {
	n, m := len(workers), len(bikes)
	type tuple struct{ d, i, j int }
	arr := make([]tuple, n*m)
	for i, k := 0, 0; i < n; i++ {
		for j := 0; j < m; j++ {
			d := abs(workers[i][0]-bikes[j][0]) + abs(workers[i][1]-bikes[j][1])
			arr[k] = tuple{d, i, j}
			k++
		}
	}
	sort.Slice(arr, func(i, j int) bool {
		if arr[i].d != arr[j].d {
			return arr[i].d < arr[j].d
		}
		if arr[i].i != arr[j].i {
			return arr[i].i < arr[j].i
		}
		return arr[i].j < arr[j].j
	})
	vis1, vis2 := make([]bool, n), make([]bool, m)
	ans := make([]int, n)
	for _, e := range arr {
		i, j := e.i, e.j
		if !vis1[i] && !vis2[j] {
			vis1[i], vis2[j] = true, true
			ans[i] = j
		}
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
// Campus Bikes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] assignBikes(int[][] workers, int[][] bikes) {
        int n = workers.length, m = bikes.length;
        int[][] arr = new int[m * n][3];
        for (int i = 0, k = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                int dist
                    = Math.abs(workers[i][0] - bikes[j][0]) + Math.abs(workers[i][1] - bikes[j][1]);
                arr[k++] = new int[] {dist, i, j};
            }
        }
        Arrays.sort(arr, (a, b) -> {
            if (a[0] != b[0]) {
                return a[0] - b[0];
            }
            if (a[1] != b[1]) {
                return a[1] - b[1];
            }
            return a[2] - b[2];
        });
        boolean[] vis1 = new boolean[n];
        boolean[] vis2 = new boolean[m];
        int[] ans = new int[n];
        for (var e : arr) {
            int i = e[1], j = e[2];
            if (!vis1[i] && !vis2[j]) {
                vis1[i] = true;
                vis2[j] = true;
                ans[i] = j;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Campus Bikes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def assignBikes(
        self, workers: List[List[int]], bikes: List[List[int]]
    ) -> List[int]:
        n, m = len(workers), len(bikes)
        arr = []
        for i, j in product(range(n), range(m)):
            dist = abs(workers[i][0] - bikes[j][0]) + abs(workers[i][1] - bikes[j][1])
            arr.append((dist, i, j))
        arr.sort()
        vis1 = [False] * n
        vis2 = [False] * m
        ans = [0] * n
        for _, i, j in arr:
            if not vis1[i] and not vis2[j]:
                vis1[i] = vis2[j] = True
                ans[i] = j
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

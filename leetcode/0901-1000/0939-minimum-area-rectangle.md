# 0939. Minimum Area Rectangle

---
编号: 939
题目: Minimum Area Rectangle
难度: 中等
标签: [几何, 数组, 哈希表, 数学, 排序]
来源链接: https://leetcode.com/problems/minimum-area-rectangle/
---

## 题目描述

给你一个 **X-Y **平面上的点数组 `points`，其中 `points[i] = [xi, yi]`。

返回由这些点形成的矩形的最小面积，矩形的边与 X 轴和 Y 轴平行。如果不存在这样的矩形，则返回 `0`。

示例 1：

```text
输入： points = [[1,1],[1,3],[3,1],[3,3],[2,2]]
输出： 4
```

示例 2：

```text
输入： points = [[1,1],[1,3],[3,1],[3,3],[4,1],[4,3]]
输出： 2
```

**提示：**

- `1 i, yi <= 4 * 10^4`

- 所有给定的点都是 **唯一 **的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 哈希表, 数学, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于每个点，我们将其横坐标作为键，纵坐标作为值存入哈希表 $d$ 中。对于哈希表中的每个键，我们将其对应的纵坐标按照从小到大的顺序排序。

然后我们从小到大枚举横坐标，对于每个横坐标，我们枚举其对应的纵坐标中的所有点对 $(y_1, y_2)$，其中 $y_1 \lt y_2$。如果我们之前已经遇到过点对 $(y_1, y_2)$，那么就可以用当前的横坐标和之前的横坐标计算出一个矩形的面积。我们用哈希表 $pos$ 记录每个点对 $(y_1, y_2)$ 第一次出现的横坐标，这样我们就可以在常数时间内找到这个横坐标。

最后，我们返回所有矩形的面积中的最小值。

时间复杂度 $O(n^2 \times \log n)$，空间复杂度 $O(n^2)$。其中 $n$ 是点的数量。

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
// Minimum Area Rectangle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minAreaRect(points [][]int) int {
	d := map[int][]int{}
	xs := []int{}
	for _, p := range points {
		x, y := p[0], p[1]
		d[x] = append(d[x], y)
	}
	for x := range d {
		xs = append(xs, x)
	}
	sort.Ints(xs)
	type pair struct{ x, y int }
	pos := map[pair]int{}
	ans := 1 << 30
	for _, x := range xs {
		ys := d[x]
		sort.Ints(ys)
		for i, y1 := range ys {
			for _, y2 := range ys[i+1:] {
				p := pair{y1, y2}
				if x1, ok := pos[p]; ok {
					ans = min(ans, (x-x1)*(y2-y1))
				}
				pos[p] = x
			}
		}
	}
	if ans == 1<<30 {
		return 0
	}
	return ans
}
```

### Java

```java
// Minimum Area Rectangle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minAreaRect(int[][] points) {
        TreeMap<Integer, List<Integer>> d = new TreeMap<>();
        for (var p : points) {
            int x = p[0], y = p[1];
            d.computeIfAbsent(x, k -> new ArrayList<>()).add(y);
        }
        Map<Integer, Integer> pos = new HashMap<>();
        int ans = 1 << 30;
        for (var e : d.entrySet()) {
            int x = e.getKey();
            var ys = e.getValue();
            Collections.sort(ys);
            int n = ys.size();
            for (int i = 0; i < n; ++i) {
                int y1 = ys.get(i);
                for (int j = i + 1; j < n; ++j) {
                    int y2 = ys.get(j);
                    int p = y1 * 40001 + y2;
                    if (pos.containsKey(p)) {
                        ans = Math.min(ans, (x - pos.get(p)) * (y2 - y1));
                    }
                    pos.put(p, x);
                }
            }
        }
        return ans == 1 << 30 ? 0 : ans;
    }
}
```

### Python

```python
# Minimum Area Rectangle：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minAreaRect(self, points: List[List[int]]) -> int:
        d = defaultdict(list)
        for x, y in points:
            d[x].append(y)
        pos = {}
        ans = inf
        for x in sorted(d):
            ys = d[x]
            ys.sort()
            n = len(ys)
            for i, y1 in enumerate(ys):
                for y2 in ys[i + 1 :]:
                    if (y1, y2) in pos:
                        ans = min(ans, (x - pos[(y1, y2)]) * (y2 - y1))
                    pos[(y1, y2)] = x
        return 0 if ans == inf else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

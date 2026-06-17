# 1184. Distance Between Bus Stops

---
编号: 1184
题目: Distance Between Bus Stops
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/distance-between-bus-stops/
---

## 题目描述

环形公交路线上有 `n` 个站，按次序从 `0` 到 `n - 1` 进行编号。我们已知每一对相邻公交站之间的距离，`distance[i]` 表示编号为 `i` 的车站和编号为 `(i + 1) % n` 的车站之间的距离。

环线上的公交车都可以按顺时针和逆时针的方向行驶。

返回乘客从出发点 `start` 到目的地 `destination` 之间的最短距离。

**示例 1：**

```text
输入：distance = [1,2,3,4], start = 0, destination = 1
输出：1
解释：公交站 0 和 1 之间的距离是 1 或 9，最小值是 1。
```

**示例 2：**

```text
输入：distance = [1,2,3,4], start = 0, destination = 2
输出：3
解释：公交站 0 和 2 之间的距离是 3 或 7，最小值是 3。
```

**示例 3：**

```text
输入：distance = [1,2,3,4], start = 0, destination = 3
输出：4
解释：公交站 0 和 3 之间的距离是 6 或 4，最小值是 4。
```

**提示：**

- `1 <= n <= 10^4`

- `distance.length == n`

- `0 <= start, destination < n`

- `0 <= distance[i] <= 10^4`

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

我们可以先统计出公交车的总行驶距离 $s$，然后模拟公交车的行驶过程，从出发点开始，每次向右移动一站，直到到达目的地为止，记录下这个过程中的行驶距离 $t$，最后返回 $t$ 和 $s - t$ 中的最小值即可。

时间复杂度 $O(n)$，其中 $n$ 是数组 $\textit{distance}$ 的长度。空间复杂度 $O(1)$。

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
// Distance Between Bus Stops：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func distanceBetweenBusStops(distance []int, start int, destination int) int {
	s, t := 0, 0
	for _, x := range distance {
		s += x
	}
	for start != destination {
		t += distance[start]
		start = (start + 1) % len(distance)
	}
	return min(t, s-t)
}
```

### Java

```java
// Distance Between Bus Stops：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int distanceBetweenBusStops(int[] distance, int start, int destination) {
        int s = Arrays.stream(distance).sum();
        int n = distance.length, t = 0;
        while (start != destination) {
            t += distance[start];
            start = (start + 1) % n;
        }
        return Math.min(t, s - t);
    }
}
```

### Python

```python
# Distance Between Bus Stops：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def distanceBetweenBusStops(
        self, distance: List[int], start: int, destination: int
    ) -> int:
        s = sum(distance)
        t, n = 0, len(distance)
        while start != destination:
            t += distance[start]
            start = (start + 1) % n
        return min(t, s - t)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0774. Minimize Max Distance to Gas Station

---
编号: 774
题目: Minimize Max Distance to Gas Station
难度: 困难
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/minimize-max-distance-to-gas-station/
---

## 题目描述

整数数组 `stations` 表示 **水平数轴** 上各个加油站的位置。给你一个整数 `k` 。

请你在数轴上增设 `k` 个加油站，新增加油站可以位于 **水平数轴** 上的任意位置，而不必放在整数位置上。

设 `penalty()` 是：增设 `k` 个新加油站后，**相邻** 两个加油站间的最大距离。

请你返回 `penalty()`** **可能的最小值。与实际答案误差在 `10^-6` 范围内的答案将被视作正确答案。

**示例 1：**

```text
输入：stations = [1,2,3,4,5,6,7,8,9,10], k = 9
输出：0.50000
```

**示例 2：**

```text
输入：stations = [23,24,36,39,46,56,57,65,84,98], k = 1
输出：14.00000
```

**提示：**

- `10 <= stations.length <= 2000`

- `0 <= stations[i] <= 10^8`

- `stations` 按 **严格递增** 顺序排列

- `1 <= k <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们二分枚举相邻两个加油站间的距离，找到最小的距离，使得加油站的数量不超过 $k$。

时间复杂度 $O(n\log M)$。其中 $n$ 为加油站的数量；而 $M$ 为答案的范围，即 $10^8$ 除以答案的精度 $10^{-6}$。

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
// Minimize Max Distance to Gas Station：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minmaxGasDist(stations []int, k int) float64 {
	check := func(x float64) bool {
		s := 0
		for i, v := range stations[:len(stations)-1] {
			s += int(float64(stations[i+1]-v) / x)
		}
		return s <= k
	}
	var left, right float64 = 0, 1e8
	for right-left > 1e-6 {
		mid := (left + right) / 2.0
		if check(mid) {
			right = mid
		} else {
			left = mid
		}
	}
	return left
}
```

### Java

```java
// Minimize Max Distance to Gas Station：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double minmaxGasDist(int[] stations, int k) {
        double left = 0, right = 1e8;
        while (right - left > 1e-6) {
            double mid = (left + right) / 2.0;
            if (check(mid, stations, k)) {
                right = mid;
            } else {
                left = mid;
            }
        }
        return left;
    }

    private boolean check(double x, int[] stations, int k) {
        int s = 0;
        for (int i = 0; i < stations.length - 1; ++i) {
            s += (int) ((stations[i + 1] - stations[i]) / x);
        }
        return s <= k;
    }
}
```

### Python

```python
# Minimize Max Distance to Gas Station：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minmaxGasDist(self, stations: List[int], k: int) -> float:
        def check(x):
            return sum(int((b - a) / x) for a, b in pairwise(stations)) <= k

        left, right = 0, 1e8
        while right - left > 1e-6:
            mid = (left + right) / 2
            if check(mid):
                right = mid
            else:
                left = mid
        return left
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

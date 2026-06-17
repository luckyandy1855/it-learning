# 0853. Car Fleet

---
编号: 853
题目: Car Fleet
难度: 中等
标签: [栈, 数组, 排序, 单调栈]
来源链接: https://leetcode.com/problems/car-fleet/
---

## 题目描述

在一条单行道上，有 `n` 辆车开往同一目的地。目的地是几英里以外的 `target` 。

给定两个整数数组 `position` 和 `speed` ，长度都是 `n` ，其中 `position[i]` 是第 `i` 辆车的位置， `speed[i]` 是第 `i` 辆车的速度(单位是英里/小时)。

一辆车永远不会超过前面的另一辆车，但它可以追上去，并以较慢车的速度在另一辆车旁边行驶。

**车队 **是指并排行驶的一辆或几辆汽车。车队的速度是车队中 **最慢** 的车的速度。

即便一辆车在 `target` 才赶上了一个车队，它们仍然会被视作是同一个车队。

返回到达目的地的车队数量 。

示例 1：

输入：target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]

输出：3

**解释：**

- 从 10（速度为 2）和 8（速度为 4）开始的车会组成一个车队，它们在 12 相遇。车队在 `target` 形成。

- 从 0（速度为 1）开始的车不会追上其它任何车，所以它自己是一个车队。

- 从 5（速度为 1） 和 3（速度为 3）开始的车组成一个车队，在 6 相遇。车队以速度 1 移动直到它到达 `target`。

示例 2：

输入：target = 10, position = [3], speed = [3]

输出：1

**解释：**

只有一辆车，因此只有一个车队。

示例 3：

输入：target = 100, position = [0,2,4], speed = [4,2,1]

输出：1

**解释：**

- 从 0（速度为 4） 和 2（速度为 2）开始的车组成一个车队，在 4 相遇。从 4 开始的车（速度为 1）移动到了 5。

- 然后，在 4（速度为 2）的车队和在 5（速度为 1）的车成为一个车队，在 6 相遇。车队以速度 1 移动直到它到达 `target`。

**提示：**

- `n == position.length == speed.length`

- `1 <= n <= 10^5`

- `0 < target <= 10^6`

- `0 <= position[i] < target`

- `position` 中每个值都 **不同**

- `0 < speed[i] <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 排序, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将车辆按照位置降序排序，这样我们只需要比较相邻两辆车的到达时间即可。

我们初始化一个变量 $pre$ 表示上一辆车到达终点的时间，如果当前车辆到达终点的时间大于 $pre$，说明当前车辆无法追上前面的车辆，因此需要另外开一个车队，否则当前车辆会与前面的车辆组成一个车队。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是车辆的数量。

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
// Car Fleet：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func carFleet(target int, position []int, speed []int) (ans int) {
	n := len(position)
	idx := make([]int, n)
	for i := range idx {
		idx[i] = i
	}
	sort.Slice(idx, func(i, j int) bool { return position[idx[j]] < position[idx[i]] })
	var pre float64
	for _, i := range idx {
		t := float64(target-position[i]) / float64(speed[i])
		if t > pre {
			ans++
			pre = t
		}
	}
	return
}
```

### Java

```java
// Car Fleet：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        Integer[] idx = new Integer[n];
        Arrays.setAll(idx, i -> i);
        Arrays.sort(idx, (i, j) -> position[j] - position[i]);
        int ans = 0;
        double pre = 0;
        for (int i : idx) {
            double t = 1.0 * (target - position[i]) / speed[i];
            if (t > pre) {
                ++ans;
                pre = t;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Car Fleet：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        idx = sorted(range(len(position)), key=lambda i: position[i])
        ans = pre = 0
        for i in idx[::-1]:
            t = (target - position[i]) / speed[i]
            if t > pre:
                ans += 1
                pre = t
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

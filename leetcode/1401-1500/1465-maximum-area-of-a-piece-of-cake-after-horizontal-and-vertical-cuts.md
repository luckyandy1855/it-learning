# 1465. Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts

---
编号: 1465
题目: Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts
难度: 中等
标签: [贪心, 数组, 排序]
来源链接: https://leetcode.com/problems/maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts/
---

## 题目描述

矩形蛋糕的高度为 `h` 且宽度为 `w`，给你两个整数数组 `horizontalCuts` 和 `verticalCuts`，其中：

-  `horizontalCuts[i]` 是从矩形蛋糕顶部到第  `i` 个水平切口的距离

- `verticalCuts[j]` 是从矩形蛋糕的左侧到第 `j` 个竖直切口的距离

请你按数组 *`horizontalCuts` *和* `verticalCuts` *中提供的水平和竖直位置切割后，请你找出 **面积最大** 的那份蛋糕，并返回其 **面积** 。由于答案可能是一个很大的数字，因此需要将结果 **对** `10^9 + 7` **取余** 后返回。

**示例 1：**

```text
输入：h = 5, w = 4, horizontalCuts = [1,2,4], verticalCuts = [1,3]
输出：4
解释：上图所示的矩阵蛋糕中，红色线表示水平和竖直方向上的切口。切割蛋糕后，绿色的那份蛋糕面积最大。
```

**示例 2：**

****

```text
输入：h = 5, w = 4, horizontalCuts = [3,1], verticalCuts = [1]
输出：6
解释：上图所示的矩阵蛋糕中，红色线表示水平和竖直方向上的切口。切割蛋糕后，绿色和黄色的两份蛋糕面积最大。
```

**示例 3：**

```text
输入：h = 5, w = 4, horizontalCuts = [3], verticalCuts = [3]
输出：9
```

**提示：**

- `2 <= h, w <= 10^9`

- `1 <= horizontalCuts.length <= min(h - 1, 10^5)`

- `1 <= verticalCuts.length <= min(w - 1, 10^5)`

- `1 <= horizontalCuts[i] < h`

- `1 <= verticalCuts[i] < w`

- 题目数据保证 `horizontalCuts` 中的所有元素各不相同

- 题目数据保证 `verticalCuts` 中的所有元素各不相同

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先分别对 `horizontalCuts` 和 `verticalCuts` 排序，然后分别遍历两个数组，计算相邻两个元素的最大差值，分别记为 $x$ 和 $y$，最后返回 $x \times y$ 即可。

注意要考虑边界情况，即 `horizontalCuts` 和 `verticalCuts` 的首尾元素。

时间复杂度 $O(m\log m + n\log n)$，空间复杂度 $(\log m + \log n)$。其中 $m$ 和 $n$ 分别为 `horizontalCuts` 和 `verticalCuts` 的长度。

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
// Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxArea(h int, w int, horizontalCuts []int, verticalCuts []int) int {
	horizontalCuts = append(horizontalCuts, []int{0, h}...)
	verticalCuts = append(verticalCuts, []int{0, w}...)
	sort.Ints(horizontalCuts)
	sort.Ints(verticalCuts)
	x, y := 0, 0
	const mod int = 1e9 + 7
	for i := 1; i < len(horizontalCuts); i++ {
		x = max(x, horizontalCuts[i]-horizontalCuts[i-1])
	}
	for i := 1; i < len(verticalCuts); i++ {
		y = max(y, verticalCuts[i]-verticalCuts[i-1])
	}
	return (x * y) % mod
}
```

### Java

```java
// Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxArea(int h, int w, int[] horizontalCuts, int[] verticalCuts) {
        final int mod = (int) 1e9 + 7;
        Arrays.sort(horizontalCuts);
        Arrays.sort(verticalCuts);
        int m = horizontalCuts.length;
        int n = verticalCuts.length;
        long x = Math.max(horizontalCuts[0], h - horizontalCuts[m - 1]);
        long y = Math.max(verticalCuts[0], w - verticalCuts[n - 1]);
        for (int i = 1; i < m; ++i) {
            x = Math.max(x, horizontalCuts[i] - horizontalCuts[i - 1]);
        }
        for (int i = 1; i < n; ++i) {
            y = Math.max(y, verticalCuts[i] - verticalCuts[i - 1]);
        }
        return (int) ((x * y) % mod);
    }
}
```

### Python

```python
# Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxArea(
        self, h: int, w: int, horizontalCuts: List[int], verticalCuts: List[int]
    ) -> int:
        horizontalCuts.extend([0, h])
        verticalCuts.extend([0, w])
        horizontalCuts.sort()
        verticalCuts.sort()
        x = max(b - a for a, b in pairwise(horizontalCuts))
        y = max(b - a for a, b in pairwise(verticalCuts))
        return (x * y) % (10**9 + 7)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

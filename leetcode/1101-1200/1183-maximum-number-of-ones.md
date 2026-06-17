# 1183. Maximum Number of Ones

---
编号: 1183
题目: Maximum Number of Ones
难度: 困难
标签: [贪心, 数学, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/maximum-number-of-ones/
---

## 题目描述

现在有一个尺寸为 `width * height` 的矩阵 `M`，矩阵中的每个单元格的值不是 `0` 就是 `1`。

而且矩阵 `M` 中每个大小为 `sideLength * sideLength` 的 **正方形** 子阵中，`1` 的数量不得超过 `maxOnes`。

请你设计一个算法，计算矩阵中最多可以有多少个 `1`。

**示例 1：**

```text
输入：width = 3, height = 3, sideLength = 2, maxOnes = 1
输出：4
解释：
题目要求：在一个 3*3 的矩阵中，每一个 2*2 的子阵中的 1 的数目不超过 1 个。
最好的解决方案中，矩阵 M 里最多可以有 4 个 1，如下所示：
[1,0,1]
[0,0,0]
[1,0,1]
```

**示例 2：**

```text
输入：width = 3, height = 3, sideLength = 2, maxOnes = 2
输出：6
解释：
[1,0,1]
[1,0,1]
[1,0,1]
```

**提示：**

- `1 <= width, height <= 100`

- `1 <= sideLength <= width, height`

- `0 <= maxOnes <= sideLength * sideLength`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数学, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

为了方便说明，我们不妨令 $x = sideLength$。

考虑一个 $x\times x$ 的正方形，我们需要在正方形里面取最多 $maxOnes$ 个点，将其置为 1。注意到当坐标 $(i, j)$ 处的点被选取后，所有坐标为 $(i\pm k_1 \times x, j\pm k_2 \times x)$ 的点都可以等效地置为 1。因此，我们算出坐标 $(i, j)$ 在矩阵中的等效位置的数量，取数量最多的前 $maxOnes$ 个即可。

时间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Maximum Number of Ones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maximumNumberOfOnes(width int, height int, sideLength int, maxOnes int) int {
	x := sideLength
	cnt := make([]int, x*x)
	for i := 0; i < width; i++ {
		for j := 0; j < height; j++ {
			k := (i%x)*x + (j % x)
			cnt[k]++
		}
	}
	sort.Ints(cnt)
	ans := 0
	for i := range cnt[:maxOnes] {
		ans += cnt[len(cnt)-i-1]
	}
	return ans
}
```

### Java

```java
// Maximum Number of Ones：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maximumNumberOfOnes(int width, int height, int sideLength, int maxOnes) {
        int x = sideLength;
        int[] cnt = new int[x * x];
        for (int i = 0; i < width; ++i) {
            for (int j = 0; j < height; ++j) {
                int k = (i % x) * x + (j % x);
                ++cnt[k];
            }
        }
        Arrays.sort(cnt);
        int ans = 0;
        for (int i = 0; i < maxOnes; ++i) {
            ans += cnt[cnt.length - i - 1];
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Number of Ones：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maximumNumberOfOnes(
        self, width: int, height: int, sideLength: int, maxOnes: int
    ) -> int:
        x = sideLength
        cnt = [0] * (x * x)
        for i in range(width):
            for j in range(height):
                k = (i % x) * x + (j % x)
                cnt[k] += 1
        cnt.sort(reverse=True)
        return sum(cnt[:maxOnes])
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

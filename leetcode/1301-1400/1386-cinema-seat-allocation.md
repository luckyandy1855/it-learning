# 1386. Cinema Seat Allocation

---
编号: 1386
题目: Cinema Seat Allocation
难度: 中等
标签: [贪心, 位运算, 数组, 哈希表]
来源链接: https://leetcode.com/problems/cinema-seat-allocation/
---

## 题目描述

如上图所示，电影院的观影厅中有 `n` 行座位，行编号从 1 到 `n` ，且每一行内总共有 10 个座位，列编号从 1 到 10 。

给你数组 `reservedSeats` ，包含所有已经被预约了的座位。比如说，`reservedSeats[i]=[3,8]` ，它表示第 **3** 行第 **8** 个座位被预约了。

请你返回 **最多能安排多少个 4 人家庭** 。4 人家庭要占据 **同一行内连续 **的 4 个座位。隔着过道的座位（比方说 [3,3] 和 [3,4]）不是连续的座位，但是如果你可以将 4 人家庭拆成过道两边各坐 2 人，这样子是允许的。

**示例 1：**

```text
输入：n = 3, reservedSeats = [[1,2],[1,3],[1,8],[2,6],[3,1],[3,10]]
输出：4
解释：上图所示是最优的安排方案，总共可以安排 4 个家庭。蓝色的叉表示被预约的座位，橙色的连续座位表示一个 4 人家庭。
```

**示例 2：**

```text
输入：n = 2, reservedSeats = [[2,1],[1,8],[2,6]]
输出：2
```

**示例 3：**

```text
输入：n = 4, reservedSeats = [[4,3],[1,4],[4,6],[1,7]]
输出：4
```

**提示：**

- `1 <= n <= 10^9`

- `1 <= reservedSeats.length <= min(10*n, 10^4)`

- `reservedSeats[i].length == 2`

- `1 <= reservedSeats[i][0] <= n`

- `1 <= reservedSeats[i][1] <= 10`

- 所有 `reservedSeats[i]` 都是互不相同的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 位运算, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 $d$ 来存储所有已经被预约的座位，其中键为行号，值为该行上已经被预约的座位的状态，即一个二进制数，第 $j$ 位为 $1$ 表示第 $j$ 个座位已经被预约，为 $0$ 表示第 $j$ 个座位尚未被预约。

我们遍历 $reservedSeats$，对于每个座位 $(i, j)$，将第 $j$ 个座位（对应低位的第 $10-j$ 位）的状态加入到 $d[i]$ 中即可。

对于没有出现在哈希表 $d$ 中的行，我们可以任意安排 $2$ 个家庭，因此，初始答案为 $(n - len(d)) \times 2$。

接下来，我们遍历哈希表中每一行的状态，对于每一行，我们依次尝试安排 $1234, 5678, 3456$ 这几种情况，如果某种情况可以安排，我们就将答案加 $1$。

遍历结束后，我们就得到了最终的答案。

时间复杂度 $O(m)$，空间复杂度 $O(m)$，其中 $m$ 是 $reservedSeats$ 的长度。

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
// Cinema Seat Allocation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxNumberOfFamilies(n int, reservedSeats [][]int) int {
	d := map[int]int{}
	for _, e := range reservedSeats {
		i, j := e[0], e[1]
		d[i] |= 1 << (10 - j)
	}
	ans := (n - len(d)) * 2
	masks := [3]int{0b0111100000, 0b0000011110, 0b0001111000}
	for _, x := range d {
		for _, mask := range masks {
			if x&mask == 0 {
				x |= mask
				ans++
			}
		}
	}
	return ans
}
```

### Java

```java
// Cinema Seat Allocation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxNumberOfFamilies(int n, int[][] reservedSeats) {
        Map<Integer, Integer> d = new HashMap<>();
        for (var e : reservedSeats) {
            int i = e[0], j = e[1];
            d.merge(i, 1 << (10 - j), (x, y) -> x | y);
        }
        int[] masks = {0b0111100000, 0b0000011110, 0b0001111000};
        int ans = (n - d.size()) * 2;
        for (int x : d.values()) {
            for (int mask : masks) {
                if ((x & mask) == 0) {
                    x |= mask;
                    ++ans;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Cinema Seat Allocation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxNumberOfFamilies(self, n: int, reservedSeats: List[List[int]]) -> int:
        d = defaultdict(int)
        for i, j in reservedSeats:
            d[i] |= 1 << (10 - j)
        masks = (0b0111100000, 0b0000011110, 0b0001111000)
        ans = (n - len(d)) * 2
        for x in d.values():
            for mask in masks:
                if (x & mask) == 0:
                    x |= mask
                    ans += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

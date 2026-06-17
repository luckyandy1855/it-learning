# 0765. Couples Holding Hands

---
编号: 765
题目: Couples Holding Hands
难度: 困难
标签: [贪心, 深度优先搜索, 广度优先搜索, 并查集, 图]
来源链接: https://leetcode.com/problems/couples-holding-hands/
---

## 题目描述

`n` 对情侣坐在连续排列的 `2n` 个座位上，想要牵到对方的手。

人和座位由一个整数数组 `row` 表示，其中 `row[i]` 是坐在第 `i `个座位上的人的 **ID**。情侣们按顺序编号，第一对是 `(0, 1)`，第二对是 `(2, 3)`，以此类推，最后一对是 `(2n - 2, 2n - 1)`。

返回 *最少交换座位的次数，以便每对情侣可以并肩坐在一起*。 每次交换可选择任意两人，让他们站起来交换座位。

**示例 1:**

```text
输入: row = [0,2,1,3]
输出: 1
解释: 只需要交换第二个人（row[1]）和第三个人（row[2]）的位置即可。
```

**示例 2:**

```text
输入: row = [3,2,0,1]
输出: 0
解释: 无需交换座位，所有的情侣都已经可以手牵手了。
```

**提示:**

- `2n == row.length`

- `2 <= n <= 30`

- `n` 是偶数

- `0 <= row[i] < 2n`

- `row` 中所有元素均 **无重复**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 深度优先搜索, 广度优先搜索, 并查集, 图」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以给每一对情侣编号，编号 $0$ 和 $1$ 的人对应情侣 $0$，编号 $2$ 和 $3$ 的人对应情侣 $1$...即编号为 $row[i]$ 对应的情侣编号为 $\lfloor \frac{row[i]}{2} \rfloor$。

如果有 $k$ 对情侣相互之间坐错了位置，也即是说，有 $k$ 对情侣处于一个置换环中，那么他们之间需要经过 $k-1$ 次交换才能都坐到正确的位置上。

为什么？不妨这样考虑，我们先调整一对情侣的位置，使其坐到正确的位置上，那么问题就从 $k$ 对情侣的问题，转换成了 $k-1$ 对情侣的问题。依此类推，最终 $k=1$ 时，交换次数为 $0$。所以，如果 $k$ 对情侣相互之间坐错了位置，那么需要 $k-1$ 次交换。

因此，我们只需要遍历一遍数组，利用并查集找出有多少个置换环，假设有 $x$ 个，每个环的大小（情侣的对数）为 $y_1, y_2, \cdots, y_x$，那么需要交换的次数为 $y_1-1 + y_2-1 + \cdots + y_x-1 = y_1 + y_2 + \cdots + y_x - x = n - x$。

时间复杂度 $O(n \times \alpha(n))$，空间复杂度 $O(n)$。其中 $\alpha(n)$ 为阿克曼函数的反函数，可以认为是一个很小的常数。

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
// Couples Holding Hands：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minSwapsCouples(row []int) int {
	n := len(row) >> 1
	p := make([]int, n)
	for i := range p {
		p[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}
	for i := 0; i < n<<1; i += 2 {
		a, b := row[i]>>1, row[i+1]>>1
		p[find(a)] = find(b)
	}
	ans := n
	for i := range p {
		if find(i) == i {
			ans--
		}
	}
	return ans
}
```

### Java

```java
// Couples Holding Hands：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public int minSwapsCouples(int[] row) {
        int n = row.length >> 1;
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
        }
        for (int i = 0; i < n << 1; i += 2) {
            int a = row[i] >> 1, b = row[i + 1] >> 1;
            p[find(a)] = find(b);
        }
        int ans = n;
        for (int i = 0; i < n; ++i) {
            if (i == find(i)) {
                --ans;
            }
        }
        return ans;
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}
```

### Python

```python
# Couples Holding Hands：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minSwapsCouples(self, row: List[int]) -> int:
        def find(x: int) -> int:
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        n = len(row) >> 1
        p = list(range(n))
        for i in range(0, len(row), 2):
            a, b = row[i] >> 1, row[i + 1] >> 1
            p[find(a)] = find(b)
        return n - sum(i == find(i) for i in range(n))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

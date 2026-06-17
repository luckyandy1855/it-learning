# 1449. Form Largest Integer With Digits That Add up to Target

---
编号: 1449
题目: Form Largest Integer With Digits That Add up to Target
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/form-largest-integer-with-digits-that-add-up-to-target/
---

## 题目描述

给你一个整数数组 `cost` 和一个整数 `target` 。请你返回满足如下规则可以得到的 **最大** 整数：

- 给当前结果添加一个数位（`i + 1`）的成本为 `cost[i]` （`cost` 数组下标从 0 开始）。

- 总成本必须恰好等于 `target` 。

- 添加的数位中没有数字 0 。

由于答案可能会很大，请你以字符串形式返回。

如果按照上述要求无法得到任何整数，请你返回 "0" 。

**示例 1：**

```text
输入：cost = [4,3,2,5,6,7,2,5,5], target = 9
输出："7772"
解释：添加数位 '7' 的成本为 2 ，添加数位 '2' 的成本为 3 。所以 "7772" 的代价为 2*3+ 3*1 = 9 。 "977" 也是满足要求的数字，但 "7772" 是较大的数字。
 数字     成本
  1  ->   4
  2  ->   3
  3  ->   2
  4  ->   5
  5  ->   6
  6  ->   7
  7  ->   2
  8  ->   5
  9  ->   5
```

**示例 2：**

```text
输入：cost = [7,6,5,5,5,6,8,7,8], target = 12
输出："85"
解释：添加数位 '8' 的成本是 7 ，添加数位 '5' 的成本是 5 。"85" 的成本为 7 + 5 = 12 。
```

**示例 3：**

```text
输入：cost = [2,4,6,2,4,6,4,4,4], target = 5
输出："0"
解释：总成本是 target 的条件下，无法生成任何整数。
```

**示例 4：**

```text
输入：cost = [6,10,15,40,40,40,40,40,40], target = 47
输出："32211"
```

**提示：**

- `cost.length == 9`

- `1 <= cost[i] <= 5000`

- `1 <= target <= 5000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示使用前 $i$ 个数位，花费恰好为 $j$ 的情况下，能够得到的最大位数。初始时，$f[0][0]=0$，其余为 $-\infty$。

考虑 $f[i][j]$，第 $i$ 个数的花费为 $c = cost[i-1]$，如果 $j \lt c$，那么我们无法选取第 $i$ 个数位，此时有 $f[i][j]=f[i-1][j]$；否则我们可以选取第 $i$ 个数位，此时有 $f[i][j]=f[i][j-c]+1$。

如果 $f[9][target] \lt 0$，那么说明无法得到满足要求的整数，返回 "0" 即可。

否则，我们需要从 $f[9][target]$ 开始，倒推出每一位的数字。我们可以使用一个数组 $g[i][j]$ 记录 $f[i][j]$ 的上一个状态，从而倒推出每一位的数字。

具体地，在状态转移时，如果 $j \lt c$，或者 $f[i][j-c]+1 \lt f[i-1][j]$，那么我们不选取第 $i$ 个数位，此时有 $g[i][j]=j$；否则我们选取第 $i$ 个数位，此时有 $g[i][j]=j-c$。

最后，我们定义 $i = 9$, $j = target$，从 $g[i][j]$ 开始不断地倒推，如果 $g[i][j]=j$，说明数字 $i$ 没有被选取，我们令 $i = i - 1$；否则说明数字 $i$ 被选取，我们令 $j = g[i][j]$，并将数字 $i$ 加入答案中。重复上述操作，直到 $i = 0$。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$，其中 $m$ 和 $n$ 分别为数组 $cost$ 和 $target$ 的长度。

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
// Form Largest Integer With Digits That Add up to Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestNumber(cost []int, target int) string {
	const inf = 1 << 30
	f := make([][]int, 10)
	g := make([][]int, 10)
	for i := range f {
		f[i] = make([]int, target+1)
		g[i] = make([]int, target+1)
		for j := range f[i] {
			f[i][j] = -inf
		}
	}
	f[0][0] = 0
	for i := 1; i <= 9; i++ {
		c := cost[i-1]
		for j := 0; j <= target; j++ {
			if j < c || f[i][j-c]+1 < f[i-1][j] {
				f[i][j] = f[i-1][j]
				g[i][j] = j
			} else {
				f[i][j] = f[i][j-c] + 1
				g[i][j] = j - c
			}
		}
	}
	if f[9][target] < 0 {
		return "0"
	}
	ans := []byte{}
	for i, j := 9, target; i > 0; {
		if g[i][j] == j {
			i--
		} else {
			ans = append(ans, '0'+byte(i))
			j = g[i][j]
		}
	}
	return string(ans)
}
```

### Java

```java
// Form Largest Integer With Digits That Add up to Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String largestNumber(int[] cost, int target) {
        final int inf = 1 << 30;
        int[][] f = new int[10][target + 1];
        int[][] g = new int[10][target + 1];
        for (var e : f) {
            Arrays.fill(e, -inf);
        }
        f[0][0] = 0;
        for (int i = 1; i <= 9; ++i) {
            int c = cost[i - 1];
            for (int j = 0; j <= target; ++j) {
                if (j < c || f[i][j - c] + 1 < f[i - 1][j]) {
                    f[i][j] = f[i - 1][j];
                    g[i][j] = j;
                } else {
                    f[i][j] = f[i][j - c] + 1;
                    g[i][j] = j - c;
                }
            }
        }
        if (f[9][target] < 0) {
            return "0";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 9, j = target; i > 0;) {
            if (j == g[i][j]) {
                --i;
            } else {
                sb.append(i);
                j = g[i][j];
            }
        }
        return sb.toString();
    }
}
```

### Python

```python
# Form Largest Integer With Digits That Add up to Target：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestNumber(self, cost: List[int], target: int) -> str:
        f = [[-inf] * (target + 1) for _ in range(10)]
        f[0][0] = 0
        g = [[0] * (target + 1) for _ in range(10)]
        for i, c in enumerate(cost, 1):
            for j in range(target + 1):
                if j < c or f[i][j - c] + 1 < f[i - 1][j]:
                    f[i][j] = f[i - 1][j]
                    g[i][j] = j
                else:
                    f[i][j] = f[i][j - c] + 1
                    g[i][j] = j - c
        if f[9][target] < 0:
            return "0"
        ans = []
        i, j = 9, target
        while i:
            if j == g[i][j]:
                i -= 1
            else:
                ans.append(str(i))
                j = g[i][j]
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

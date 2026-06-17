# 1128. Number of Equivalent Domino Pairs

---
编号: 1128
题目: Number of Equivalent Domino Pairs
难度: 简单
标签: [数组, 哈希表, 计数]
来源链接: https://leetcode.com/problems/number-of-equivalent-domino-pairs/
---

## 题目描述

给你一组多米诺骨牌 `dominoes` 。

形式上，`dominoes[i] = [a, b]` 与 `dominoes[j] = [c, d]` **等价** 当且仅当 (`a == c` 且 `b == d`) 或者 (`a == d` 且 `b == c`) 。即一张骨牌可以通过旋转 `0` 度或 `180` 度得到另一张多米诺骨牌。

在 `0 <= i < j < dominoes.length` 的前提下，找出满足 `dominoes[i]` 和 `dominoes[j]` 等价的骨牌对 `(i, j)` 的数量。

**示例 1：**

```text
输入：dominoes = [[1,2],[2,1],[3,4],[5,6]]
输出：1
```

**示例 2：**

```text
输入：dominoes = [[1,2],[1,2],[1,1],[1,2],[2,2]]
输出：3
```

**提示：**

- `1 <= dominoes.length <= 4 * 10^4`

- `dominoes[i].length == 2`

- `1 <= dominoes[i][j] <= 9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以将每个多米诺骨牌的两个数字按照大小顺序拼接成一个两位数，这样就可以将等价的多米诺骨牌拼接成相同的两位数。例如，`[1, 2]` 和 `[2, 1]` 拼接成的两位数都是 `12`，`[3, 4]` 和 `[4, 3]` 拼接成的两位数都是 `34`。

然后我们遍历所有的多米诺骨牌，用一个哈希表或者一个长度为 $100$ 的数组 $cnt$ 记录每个两位数出现的次数。对于每个多米诺骨牌，我们拼接成的两位数为 $x$，那么答案就会增加 $cnt[x]$，接着我们将 $cnt[x]$ 的值加 $1$。继续遍历下一个多米诺骨牌，就可以统计出所有等价的多米诺骨牌对的数量。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 是多米诺骨牌的数量，而 $C$ 是多米诺骨牌中拼接成的两位数的最大数量，即 $100$。

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
// Number of Equivalent Domino Pairs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numEquivDominoPairs(dominoes [][]int) (ans int) {
	cnt := [100]int{}
	for _, e := range dominoes {
		x := e[0]*10 + e[1]
		if e[0] > e[1] {
			x = e[1]*10 + e[0]
		}
		ans += cnt[x]
		cnt[x]++
	}
	return
}
```

### Java

```java
// Number of Equivalent Domino Pairs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numEquivDominoPairs(int[][] dominoes) {
        int[] cnt = new int[100];
        int ans = 0;
        for (var e : dominoes) {
            int x = e[0] < e[1] ? e[0] * 10 + e[1] : e[1] * 10 + e[0];
            ans += cnt[x]++;
        }
        return ans;
    }
}
```

### Python

```python
# Number of Equivalent Domino Pairs：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numEquivDominoPairs(self, dominoes: List[List[int]]) -> int:
        cnt = Counter()
        ans = 0
        for a, b in dominoes:
            x = a * 10 + b if a < b else b * 10 + a
            ans += cnt[x]
            cnt[x] += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

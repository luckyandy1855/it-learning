# 0810. Chalkboard XOR Game

---
编号: 810
题目: Chalkboard XOR Game
难度: 困难
标签: [位运算, 脑筋急转弯, 数组, 数学, 博弈]
来源链接: https://leetcode.com/problems/chalkboard-xor-game/
---

## 题目描述

黑板上写着一个非负整数数组 `nums[i]` 。

Alice 和 Bob 轮流从黑板上擦掉一个数字，Alice 先手。如果擦除一个数字后，剩余的所有数字按位异或运算得出的结果等于 `0` 的话，当前玩家游戏失败。 另外，如果只剩一个数字，按位异或运算得到它本身；如果无数字剩余，按位异或运算结果为 `0`。

并且，轮到某个玩家时，如果当前黑板上所有数字按位异或运算结果等于 `0` ，这个玩家获胜。

假设两个玩家每步都使用最优解，当且仅当 Alice 获胜时返回 `true`。

**示例 1：**

```text
输入: nums = [1,1,2]
输出: false
解释:
Alice 有两个选择: 擦掉数字 1 或 2。
如果擦掉 1, 数组变成 [1, 2]。剩余数字按位异或得到 1 XOR 2 = 3。那么 Bob 可以擦掉任意数字，因为 Alice 会成为擦掉最后一个数字的人，她总是会输。
如果 Alice 擦掉 2，那么数组变成[1, 1]。剩余数字按位异或得到 1 XOR 1 = 0。Alice 仍然会输掉游戏。
```

**示例 2:**

```text
输入: nums = [0,1]
输出: true
```

**示例 3:**

```text
输入: nums = [1,2,3]
输出: true
```

**提示：**

- `1 <= nums.length <= 1000`

- `0 <= nums[i] < 2^16`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 脑筋急转弯, 数组, 数学, 博弈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据游戏规则，轮到某个玩家时，如果当前黑板上所有数字按位异或运算结果为 $0$，这个玩家获胜。由于 Alice 先手，因此当 $\textit{nums}$ 中所有数字的异或结果为 $0$ 时，Alice 可以获胜。

当 $\textit{nums}$ 中所有数字的异或结果不为 $0$ 时，我们不妨考虑从数组 $\textit{nums}$ 的长度奇偶性来分析 Alice 的获胜情况。

当 $\textit{nums}$ 的长度为偶数时，如果 Alice 必败，那么只有一种情况，就是 Alice 无论擦掉哪个数字，剩余所有数字的异或结果都等于 $0$。我们来分析一下是否存在这种情况。

假设数组 $\textit{nums}$ 长度为 $n$，并且 $n$ 是偶数，记所有数字异或结尾为 $S$，则有：


S = \textit{nums}[0] \oplus \textit{nums}[1] \oplus \cdots \oplus \textit{nums}[n-1] \neq 0


我们记 $S_i$ 为数组 $\textit{nums}$ 擦掉第 $i$ 个数字后的异或结果，那么有：


S_i \oplus \textit{nums}[i] = S


等式两边同时异或 $\textit{nums}[i]$，得到：


S_i = S \oplus \textit{nums}[i]


如果无论 Alice 擦掉哪个数字，剩余所有数字的异或结果都等于 $0$，那么对所有 $i$，都有 $S_i = 0$，即：


S_0 \oplus S_1 \oplus \cdots \oplus S_{n-1} = 0


我们将 $S_i = S \oplus \textit{nums}[i]$ 代入上式，得到：


S \oplus \textit{nums}[0] \oplus S \oplus \textit{nums}[1] \oplus \cdots \oplus S \oplus \textit{nums}[n-1] = 0


上式共有 $n$（偶数）个 $S$，而 $\textit{nums}[0] \oplus \textit{nums}[1] \oplus \cdots \oplus \textit{nums}[n-1]$ 也等于 $S$，因此上式等价于 $0 \oplus S = 0$。这与 $S \neq 0$ 矛盾，因此不存在这种情况。因此当 $\textit{nums}$ 的长度为偶数时，Alice 必胜。

如果长度为奇数，那么 Alice 擦掉一个数字后，剩余数字个数为偶数，也就是将偶数长度的情况留给 Bob，那么 Bob 必胜，也即 Alice 必败。

综上，当 $\textit{nums}$ 的长度为偶数，或者 $\textit{nums}$ 中所有数字的异或结果为 $0$ 时，Alice 可以获胜。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{nums}$ 的长度。空间复杂度 $O(1)$。

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
// Chalkboard XOR Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func xorGame(nums []int) bool {
	if len(nums)%2 == 0 {
		return true
	}
	x := 0
	for _, v := range nums {
		x ^= v
	}
	return x == 0
}
```

### Java

```java
// Chalkboard XOR Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean xorGame(int[] nums) {
        return nums.length % 2 == 0 || Arrays.stream(nums).reduce(0, (a, b) -> a ^ b) == 0;
    }
}
```

### Python

```python
# Chalkboard XOR Game：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def xorGame(self, nums: List[int]) -> bool:
        return len(nums) % 2 == 0 or reduce(xor, nums) == 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

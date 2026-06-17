# 0762. Prime Number of Set Bits in Binary Representation

---
编号: 762
题目: Prime Number of Set Bits in Binary Representation
难度: 简单
标签: [位运算, 数学]
来源链接: https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/
---

## 题目描述

给你两个整数 `left` 和 `right` ，在闭区间 `[left, right]` 范围内，统计并返回 **计算置位位数为质数** 的整数个数。

**计算置位位数** 就是二进制表示中 `1` 的个数。

- 例如， `21` 的二进制表示 `10101` 有 `3` 个计算置位。

**示例 1：**

```text
输入：left = 6, right = 10
输出：4
解释：
6 -> 110 (2 个计算置位，2 是质数)
7 -> 111 (3 个计算置位，3 是质数)
9 -> 1001 (2 个计算置位，2 是质数)
10-> 1010 (2 个计算置位，2 是质数)
共计 4 个计算置位为质数的数字。
```

**示例 2：**

```text
输入：left = 10, right = 15
输出：5
解释：
10 -> 1010 (2 个计算置位, 2 是质数)
11 -> 1011 (3 个计算置位, 3 是质数)
12 -> 1100 (2 个计算置位, 2 是质数)
13 -> 1101 (3 个计算置位, 3 是质数)
14 -> 1110 (3 个计算置位, 3 是质数)
15 -> 1111 (4 个计算置位, 4 不是质数)
共计 5 个计算置位为质数的数字。
```

**提示：**

- `1 <= left <= right <= 10^6`

- `0 <= right - left <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目中 $\textit{left}$ 和 $\textit{right}$ 的范围均在 $10^6$ 以内，而 $2^{20} = 1048576$，因此，二进制中 $1$ 的个数最多也就 $20$ 个，而 $20$ 以内的质数有 $[2, 3, 5, 7, 11, 13, 17, 19]$。

我们枚举 $[\textit{left},.. \textit{right}]$ 范围内的每个数，统计其二进制中 $1$ 的个数，然后判断该个数是否为质数，如果是，答案加一。

时间复杂度 $O(n\times \log m)$。其中 $n = \textit{right} - \textit{left} + 1$，而 $m$ 为 $[\textit{left},.. \textit{right}]$ 范围内的最大数。

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
// Prime Number of Set Bits in Binary Representation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countPrimeSetBits(left int, right int) (ans int) {
	primes := map[int]int{}
	for _, v := range []int{2, 3, 5, 7, 11, 13, 17, 19} {
		primes[v] = 1
	}
	for i := left; i <= right; i++ {
		ans += primes[bits.OnesCount(uint(i))]
	}
	return
}
```

### Java

```java
// Prime Number of Set Bits in Binary Representation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static Set<Integer> primes = Set.of(2, 3, 5, 7, 11, 13, 17, 19);

    public int countPrimeSetBits(int left, int right) {
        int ans = 0;
        for (int i = left; i <= right; ++i) {
            if (primes.contains(Integer.bitCount(i))) {
                ++ans;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Prime Number of Set Bits in Binary Representation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countPrimeSetBits(self, left: int, right: int) -> int:
        primes = {2, 3, 5, 7, 11, 13, 17, 19}
        return sum(i.bit_count() in primes for i in range(left, right + 1))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

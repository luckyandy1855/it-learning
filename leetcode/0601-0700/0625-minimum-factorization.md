# 0625. Minimum Factorization

---
编号: 625
题目: Minimum Factorization
难度: 中等
标签: [贪心, 数学]
来源链接: https://leetcode.com/problems/minimum-factorization/
---

## 题目描述

给定一个正整数 `num`，找出最小的正整数 `x` 使得 `x` 的所有数位相乘恰好等于 `num`。

如果不存在这样的结果或者结果不是 32 位有符号整数，返回 `0`。

示例 1：

```text
输入：num = 48
输出：68
```

示例 2：

```text
输入：num = 15
输出：35
```

**提示：**

- `1 <= num <= 2^31 - 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先判断 $num$ 是否小于 $2$，如果是，直接返回 $num$。然后从 $9$ 开始，尽可能多地将数字分解为 $9$，然后分解为 $8$，以此类推，直到分解为 $2$。如果最后剩下的数字不是 $1$，或者结果超过了 $2^{31} - 1$，则返回 $0$。否则，我们返回结果。

> 注意，分解后的数字，应该依次填充到结果的个位、十位、百位、千位……上，因此我们需要维护一个变量 $mul$，表示当前的位数。

时间复杂度 $O(\log n)$，空间复杂度 $O(1)$。其中 $n$ 为 $num$ 的值。

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
// Minimum Factorization：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func smallestFactorization(num int) int {
	if num < 2 {
		return num
	}
	ans, mul := 0, 1
	for i := 9; i >= 2; i-- {
		if num%i == 0 {
			for num%i == 0 {
				num /= i
				ans = mul*i + ans
				mul *= 10
			}
		}
	}
	if num < 2 && ans <= math.MaxInt32 {
		return ans
	}
	return 0
}
```

### Java

```java
// Minimum Factorization：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int smallestFactorization(int num) {
        if (num < 2) {
            return num;
        }
        long ans = 0, mul = 1;
        for (int i = 9; i >= 2; --i) {
            if (num % i == 0) {
                while (num % i == 0) {
                    num /= i;
                    ans = mul * i + ans;
                    mul *= 10;
                }
            }
        }
        return num < 2 && ans <= Integer.MAX_VALUE ? (int) ans : 0;
    }
}
```

### Python

```python
# Minimum Factorization：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def smallestFactorization(self, num: int) -> int:
        if num < 2:
            return num
        ans, mul = 0, 1
        for i in range(9, 1, -1):
            while num % i == 0:
                num //= i
                ans = mul * i + ans
                mul *= 10
        return ans if num < 2 and ans <= 2**31 - 1 else 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

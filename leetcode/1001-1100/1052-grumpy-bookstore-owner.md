# 1052. Grumpy Bookstore Owner

---
编号: 1052
题目: Grumpy Bookstore Owner
难度: 中等
标签: [数组, 滑动窗口]
来源链接: https://leetcode.com/problems/grumpy-bookstore-owner/
---

## 题目描述

有一个书店老板，他的书店开了 `n` 分钟。每分钟都有一些顾客进入这家商店。给定一个长度为 `n` 的整数数组 `customers` ，其中 `customers[i]` 是在第 `i` 分钟开始时进入商店的顾客数量，所有这些顾客在第 `i` 分钟结束后离开。

在某些分钟内，书店老板会生气。 如果书店老板在第 `i` 分钟生气，那么 `grumpy[i] = 1`，否则 `grumpy[i] = 0`。

当书店老板生气时，那一分钟的顾客就会不满意，若老板不生气则顾客是满意的。

书店老板知道一个秘密技巧，能抑制自己的情绪，可以让自己连续 `minutes` 分钟不生气，但却只能使用一次。

请你返回 *这一天营业下来，最多有多少客户能够感到满意* 。

**示例 1：**

```text
输入：customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3
输出：16
解释：书店老板在最后 3 分钟保持冷静。
感到满意的最大客户数量 = 1 + 1 + 1 + 1 + 7 + 5 = 16.
```

**示例 2：**

```text
输入：customers = [1], grumpy = [0], minutes = 1
输出：1
```

**提示：**

- `n == customers.length == grumpy.length`

- `1 <= minutes <= n <= 2 * 10^4`

- `0 <= customers[i] <= 1000`

- `grumpy[i] == 0 or 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 滑动窗口」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们只需要统计老板不生气时的客户数量 $tot$，再加上一个大小为 `minutes` 的滑动窗口中，老板生气时的客户数量的最大值 $mx$ 即可。

我们定义一个变量 $cnt$ 来记录滑动窗口中老板生气时的客户数量，初始值为前 `minutes` 分钟老板生气时的客户数量。然后我们遍历数组，每次移动滑动窗口时，更新 $cnt$ 的值，同时更新 $mx$ 的值。

最后返回 $tot + mx$ 即可。

时间复杂度 $O(n)$，其中 $n$ 为数组 `customers` 的长度。空间复杂度 $O(1)$。

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
// Grumpy Bookstore Owner：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxSatisfied(customers []int, grumpy []int, minutes int) int {
	var cnt, tot int
	for i, c := range customers[:minutes] {
		cnt += c * grumpy[i]
		tot += c * (grumpy[i] ^ 1)
	}
	mx := cnt
	for i := minutes; i < len(customers); i++ {
		cnt += customers[i] * grumpy[i]
		cnt -= customers[i-minutes] * grumpy[i-minutes]
		mx = max(mx, cnt)
		tot += customers[i] * (grumpy[i] ^ 1)
	}
	return tot + mx
}
```

### Java

```java
// Grumpy Bookstore Owner：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
        int cnt = 0;
        int tot = 0;
        for (int i = 0; i < minutes; ++i) {
            cnt += customers[i] * grumpy[i];
            tot += customers[i] * (grumpy[i] ^ 1);
        }
        int mx = cnt;
        int n = customers.length;
        for (int i = minutes; i < n; ++i) {
            cnt += customers[i] * grumpy[i];
            cnt -= customers[i - minutes] * grumpy[i - minutes];
            mx = Math.max(mx, cnt);
            tot += customers[i] * (grumpy[i] ^ 1);
        }
        return tot + mx;
    }
}
```

### Python

```python
# Grumpy Bookstore Owner：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxSatisfied(
        self, customers: List[int], grumpy: List[int], minutes: int
    ) -> int:
        mx = cnt = sum(c * g for c, g in zip(customers[:minutes], grumpy))
        for i in range(minutes, len(customers)):
            cnt += customers[i] * grumpy[i]
            cnt -= customers[i - minutes] * grumpy[i - minutes]
            mx = max(mx, cnt)
        return sum(c * (g ^ 1) for c, g in zip(customers, grumpy)) + mx
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0991. Broken Calculator

---
编号: 991
题目: Broken Calculator
难度: 中等
标签: [贪心, 数学]
来源链接: https://leetcode.com/problems/broken-calculator/
---

## 题目描述

在显示着数字 `startValue` 的坏计算器上，我们可以执行以下两种操作：

- **双倍（Double）：**将显示屏上的数字乘 2；

- **递减（Decrement）：**将显示屏上的数字减 `1` 。

给定两个整数 `startValue` 和 `target` 。返回显示数字 `target` 所需的最小操作数。

**示例 1：**

```text
输入：startValue = 2, target = 3
输出：2
解释：先进行双倍运算，然后再进行递减运算 {2 -> 4 -> 3}.
```

**示例 2：**

```text
输入：startValue = 5, target = 8
输出：2
解释：先递减，再双倍 {5 -> 4 -> 8}.
```

**示例 3：**

```text
输入：startValue = 3, target = 10
输出：3
解释：先双倍，然后递减，再双倍 {3 -> 6 -> 5 -> 10}.
```

**提示：**

- `1 <= startValue, target <= 10^9`

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

我们可以采用逆向计算的方式，从 $\textit{target}$ 开始，如果 $\textit{target}$ 是奇数，那么 $\textit{target} = \textit{target} + 1$，否则 $\textit{target} = \textit{target} / 2$，累加操作次数，直到 $\textit{target} \leq \textit{startValue}$，此时的操作次数加上 $\textit{startValue} - \textit{target}$ 即为最终结果。

时间复杂度 $O(\log n)$，其中 $n$ 为 $\textit{target}$。空间复杂度 $O(1)$。

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
// Broken Calculator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func brokenCalc(startValue int, target int) (ans int) {
	for startValue < target {
		if target&1 == 1 {
			target++
		} else {
			target >>= 1
		}
		ans++
	}
	ans += startValue - target
	return
}
```

### Java

```java
// Broken Calculator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int brokenCalc(int startValue, int target) {
        int ans = 0;
        while (startValue < target) {
            if ((target & 1) == 1) {
                target++;
            } else {
                target >>= 1;
            }
            ans += 1;
        }
        ans += startValue - target;
        return ans;
    }
}
```

### Python

```python
# Broken Calculator：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def brokenCalc(self, startValue: int, target: int) -> int:
        ans = 0
        while startValue < target:
            if target & 1:
                target += 1
            else:
                target >>= 1
            ans += 1
        ans += startValue - target
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0507. Perfect Number

---
编号: 507
题目: Perfect Number
难度: 简单
标签: [数学]
来源链接: https://leetcode.com/problems/perfect-number/
---

## 题目描述

对于一个 **正整数**，如果它和除了它自身以外的所有 **正因子** 之和相等，我们称它为 **「完美数」**。

给定一个 **整数 **`n`， 如果是完美数，返回 `true`；否则返回 `false`。

**示例 1：**

```text
输入：num = 28
输出：true
解释：28 = 1 + 2 + 4 + 7 + 14
1, 2, 4, 7, 和 14 是 28 的所有正因子。
```

**示例 2：**

```text
输入：num = 7
输出：false
```

**提示：**

- `1 <= num <= 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断 $\textit{num}$ 是否为 1，如果为 1，则 $\textit{num}$ 不是完美数，返回 $\text{false}$。

然后，我们从 2 开始枚举 $\textit{num}$ 的所有正因子，如果 $\textit{num}$ 能被 $\textit{num}$ 的某个正因子 $i$ 整除，那么我们将 $i$ 加入到答案 $\textit{s}$ 中。如果 $\textit{num}$ 除以 $i$ 得到的商不等于 $i$，我们也将 $\textit{num}$ 除以 $i$ 得到的商加入到答案 $\textit{s}$ 中。

最后，我们判断 $\textit{s}$ 是否等于 $\textit{num}$ 即可。

时间复杂度 $O(\sqrt{n})$，其中 $n$ 为 $\textit{num}$ 的大小。空间复杂度 $O(1)$。

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
// Perfect Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func checkPerfectNumber(num int) bool {
	if num == 1 {
		return false
	}
	s := 1
	for i := 2; i <= num/i; i++ {
		if num%i == 0 {
			s += i
			if j := num / i; i != j {
				s += j
			}
		}
	}
	return s == num
}
```

### Java

```java
// Perfect Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean checkPerfectNumber(int num) {
        if (num == 1) {
            return false;
        }
        int s = 1;
        for (int i = 2; i <= num / i; ++i) {
            if (num % i == 0) {
                s += i;
                if (i != num / i) {
                    s += num / i;
                }
            }
        }
        return s == num;
    }
}
```

### Python

```python
# Perfect Number：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def checkPerfectNumber(self, num: int) -> bool:
        if num == 1:
            return False
        s, i = 1, 2
        while i <= num // i:
            if num % i == 0:
                s += i
                if i != num // i:
                    s += num // i
            i += 1
        return s == num
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

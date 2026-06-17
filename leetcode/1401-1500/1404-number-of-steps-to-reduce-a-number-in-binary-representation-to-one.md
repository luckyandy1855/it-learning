# 1404. Number of Steps to Reduce a Number in Binary Representation to One

---
编号: 1404
题目: Number of Steps to Reduce a Number in Binary Representation to One
难度: 中等
标签: [位运算, 字符串, 模拟]
来源链接: https://leetcode.com/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/
---

## 题目描述

给你一个以二进制形式表示的数字 `s` 。请你返回按下述规则将其减少到 1 所需要的步骤数：

	-

如果当前数字为偶数，则将其除以 `2` 。

	-

如果当前数字为奇数，则将其加上 `1` 。

题目保证你总是可以按上述规则将测试用例变为 1 。

**示例 1：**

```text
输入：s = "1101"
输出：6
解释："1101" 表示十进制数 13 。
Step 1) 13 是奇数，加 1 得到 14
Step 2) 14 是偶数，除 2 得到 7
Step 3) 7  是奇数，加 1 得到 8
Step 4) 8  是偶数，除 2 得到 4
Step 5) 4  是偶数，除 2 得到 2
Step 6) 2  是偶数，除 2 得到 1
```

**示例 2：**

```text
输入：s = "10"
输出：1
解释："10" 表示十进制数 2 。
Step 1) 2 是偶数，除 2 得到 1
```

**示例 3：**

```text
输入：s = "1"
输出：0
```

**提示：**

- `1 <= s.length <= 500`

- `s` 由字符 `'0'` 或 `'1'` 组成。

- `s[0] == '1'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 字符串, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们模拟操作 $1$ 和 $2$，同时维护一个进位 $\textit{carry}$ 来表示当前是否有进位，初始时 $\textit{carry} = \text{false}$。

我们从字符串 $s$ 的末尾开始向前遍历：

- 如果 $\textit{carry}$ 为 $\text{true}$，则当前位 $c$ 需要加 $1$，如果 $c$ 是 $0$，则加 $1$ 后变为 $1$，同时 $\textit{carry}$ 变为 $\text{false}$；如果 $c$ 是 $1$，则加 $1$ 后变为 $0$，同时 $\textit{carry}$ 保持为 $\text{true}$。
- 如果 $c$ 是 $1$，则需要执行操作 $1$，即加 $1$，同时 $\textit{carry}$ 变为 $\text{true}$。
- 此时 $c$ 是 $0$，则需要执行操作 $2$，即除以 $2$。

当遍历结束后，如果 $\textit{carry}$ 仍然为 $\text{true}$，则需要再执行一次操作 $1$。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $s$ 的长度。空间复杂度 $O(1)$。

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
// Number of Steps to Reduce a Number in Binary Representation to One：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numSteps(s string) int {
	ans := 0
	carry := false
	for i := len(s) - 1; i > 0; i-- {
		c := s[i]
		if carry {
			if c == '0' {
				c = '1'
				carry = false
			} else {
				c = '0'
			}
		}
		if c == '1' {
			ans++
			carry = true
		}
		ans++
	}
	if carry {
		ans++
	}
	return ans
}
```

### Java

```java
// Number of Steps to Reduce a Number in Binary Representation to One：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numSteps(String s) {
        boolean carry = false;
        int ans = 0;
        for (int i = s.length() - 1; i > 0; --i) {
            char c = s.charAt(i);
            if (carry) {
                if (c == '0') {
                    c = '1';
                    carry = false;
                } else {
                    c = '0';
                }
            }
            if (c == '1') {
                ++ans;
                carry = true;
            }
            ++ans;
        }
        if (carry) {
            ++ans;
        }
        return ans;
    }
}
```

### Python

```python
# Number of Steps to Reduce a Number in Binary Representation to One：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numSteps(self, s: str) -> int:
        carry = False
        ans = 0
        for c in s[:0:-1]:
            if carry:
                if c == '0':
                    c = '1'
                    carry = False
                else:
                    c = '0'
            if c == '1':
                ans += 1
                carry = True
            ans += 1
        if carry:
            ans += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1111. Maximum Nesting Depth of Two Valid Parentheses Strings

---
编号: 1111
题目: Maximum Nesting Depth of Two Valid Parentheses Strings
难度: 中等
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/
---

## 题目描述

如果一个字符串仅由字符 `"("` 和 `")"` 组成，并且满足以下条件，则称为有效括号字符串（VPS）：

- 它是空字符串，或

- 它可以表示为 `AB`（`A` 连接 `B`），其中 `A` 和 `B` 都是VPS，或者

- 它可以表示为 `(A)`，其中 `A` 是一个 VPS。

我们可以类似地定义任何 VPS `S` 的嵌套深度 `depth(S)` 如下：

- `depth("") = 0`

- `depth(A + B) = max(depth(A), depth(B))`，其中 `A` 和 `B` 都是 VPS

- `depth("(" + A + ")") = 1 + depth(A)`，其中 `A` 是一个 VPS。

例如，`""`，`"()()"` 和 `"()(()())"` 都是 VPS（嵌套深度 0，1 和 2），并且 `")("` 和 `"(()"` 不是 VPS。

给定一个 VPS 序列，将其拆分成两个不相交的子序列 `A` 和 `B`，使得 `A` 和 `B` 都是 VPS（且 `A.length + B.length = seq.length`）。这些子序列不一定是连续的。

例如，对于序列 `123456789`，一种可能的拆分是：

	A = {1, 3, 5, 7, 9}，

	B = {2, 4, 6, 8}。

	这对应于输出 `[0, 1, 0, 1, 0, 1, 0, 1, 0]`，其中 0 表示属于 `A`，1 表示属于 `B`。

现在选择 **任意** 这样的 `A` 和 `B`，使得 `max(depth(A), depth(B))` 的值是最小的。

返回一个 `answer` 数组（长度为 `seq.length`），该数组编码了 `A` 和 `B` 的选择：如果 `seq[i]` 是 `A` 的一部分则 `answer[i] = 0`，否则 `answer[i] = 1`。请注意，尽管可能存在多种答案，但你可以返回其中任意一种。

**示例 1：**

```text
输入：seq = "(()())"
输出：[0,1,1,1,1,0]
```

**示例 2：**

```text
输入：seq = "()(())()"
输出：[0,0,0,1,1,0,1,1]
解释：本示例答案不唯一。
按此输出 A = "()()", B = "()()", max(depth(A), depth(B)) = 1，它们的深度最小。
像 [1,1,1,0,0,1,1,1]，也是正确结果，其中 A = "()()()", B = "()", max(depth(A), depth(B)) = 1 。
```

**提示：**

- `1 < seq.size <= 10000`

**有效括号字符串：**

```text
仅由 "(" 和 ")" 构成的字符串，对于每个左括号，都能找到与之对应的右括号，反之亦然。
下述几种情况同样属于有效括号字符串：

  1. 空字符串
  2. 连接，可以记作 AB（A 与 B 连接），其中 A 和 B 都是有效括号字符串
  3. 嵌套，可以记作 (A)，其中 A 是有效括号字符串
```

**嵌套深度：**

```text
类似地，我们可以定义任意有效括号字符串 s 的 嵌套深度 depth(S)：

  1. s 为空时，depth("") = 0
  2. s 为 A 与 B 连接时，depth(A + B) = max(depth(A), depth(B))，其中 A 和 B 都是有效括号字符串
  3. s 为嵌套情况，depth("(" + A + ")") = 1 + depth(A)，其中 A 是有效括号字符串

例如：""，"()()"，和 "()(()())" 都是有效括号字符串，嵌套深度分别为 0，1，2，而 ")(" 和 "(()" 都不是有效括号字符串。
```

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个变量 $x$ 维护当前括号的平衡度，也就是左括号的数量减去右括号的数量。

遍历字符串 $seq$，更新 $x$ 的值。如果 $x$ 为奇数，我们将当前的左括号分给 $A$，否则分给 $B$。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $seq$ 的长度。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Maximum Nesting Depth of Two Valid Parentheses Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxDepthAfterSplit(seq string) []int {
	n := len(seq)
	ans := make([]int, n)
	for i, x := 0, 0; i < n; i++ {
		if seq[i] == '(' {
			ans[i] = x & 1
			x++
		} else {
			x--
			ans[i] = x & 1
		}
	}
	return ans
}
```

### Java

```java
// Maximum Nesting Depth of Two Valid Parentheses Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] maxDepthAfterSplit(String seq) {
        int n = seq.length();
        int[] ans = new int[n];
        for (int i = 0, x = 0; i < n; ++i) {
            if (seq.charAt(i) == '(') {
                ans[i] = x++ & 1;
            } else {
                ans[i] = --x & 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Nesting Depth of Two Valid Parentheses Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxDepthAfterSplit(self, seq: str) -> List[int]:
        ans = [0] * len(seq)
        x = 0
        for i, c in enumerate(seq):
            if c == "(":
                ans[i] = x & 1
                x += 1
            else:
                x -= 1
                ans[i] = x & 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

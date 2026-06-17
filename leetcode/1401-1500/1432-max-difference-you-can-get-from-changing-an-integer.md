# 1432. Max Difference You Can Get From Changing an Integer

---
编号: 1432
题目: Max Difference You Can Get From Changing an Integer
难度: 中等
标签: [贪心, 数学]
来源链接: https://leetcode.com/problems/max-difference-you-can-get-from-changing-an-integer/
---

## 题目描述

给你一个整数 `num` 。你可以对它进行以下步骤共计 **两次**：

- 选择一个数字 `x (0 <= x <= 9)`.

- 选择另一个数字 `y (0 <= y <= 9)` 。数字 `y` 可以等于 `x` 。

- 将 `num` 中所有出现 `x` 的数位都用 `y` 替换。

令两次对 `num` 的操作得到的结果分别为 `a` 和 `b` 。

请你返回 `a` 和 `b` 的 **最大差值** 。

注意，`a` 和 `b` **必须不能** 含有前导 0，并且 **不为** 0。

**示例 1：**

```text
输入：num = 555
输出：888
解释：第一次选择 x = 5 且 y = 9 ，并把得到的新数字保存在 a 中。
第二次选择 x = 5 且 y = 1 ，并把得到的新数字保存在 b 中。
现在，我们有 a = 999 和 b = 111 ，最大差值为 888
```

**示例 2：**

```text
输入：num = 9
输出：8
解释：第一次选择 x = 9 且 y = 9 ，并把得到的新数字保存在 a 中。
第二次选择 x = 9 且 y = 1 ，并把得到的新数字保存在 b 中。
现在，我们有 a = 9 和 b = 1 ，最大差值为 8
```

**示例 3：**

```text
输入：num = 123456
输出：820000
```

**示例 4：**

```text
输入：num = 10000
输出：80000
```

**示例 5：**

```text
输入：num = 9288
输出：8700
```

**提示：**

- `1 <= num <= 10^8`

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

要想得到最大差值，那么我们应该拿到最大值与最小值，这样差值最大。

因此，我们先从高到低枚举 $\textit{nums}$ 每个位置上的数，如果数字不为 `9`，就将所有该数字替换为 `9`，得到最大整数 $a$。

接下来，我们再从高到低枚举 $\textit{nums}$ 每个位置上的数，首位不能为 `0`，因此如果首位不为 `1`，我们将其替换为 `1`；如果非首位，且数字不与首位相同，我们将其替换为 `0`，得到最大整数 $b$。

答案为差值 $a - b$。

时间复杂度 $O(\log \textit{num})$，空间复杂度 $O(\log \textit{num})$。其中 $\textit{nums}$ 为给定整数。

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
// Max Difference You Can Get From Changing an Integer：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxDiff(num int) int {
	a, b := num, num
	s := strconv.Itoa(num)
	for i := range s {
		if s[i] != '9' {
			a, _ = strconv.Atoi(strings.ReplaceAll(s, string(s[i]), "9"))
			break
		}
	}
	if s[0] > '1' {
		b, _ = strconv.Atoi(strings.ReplaceAll(s, string(s[0]), "1"))
	} else {
		for i := 1; i < len(s); i++ {
			if s[i] != '0' && s[i] != '1' {
				b, _ = strconv.Atoi(strings.ReplaceAll(s, string(s[i]), "0"))
				break
			}
		}
	}
	return a - b
}
```

### Java

```java
// Max Difference You Can Get From Changing an Integer：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxDiff(int num) {
        String a = String.valueOf(num);
        String b = a;
        for (int i = 0; i < a.length(); ++i) {
            if (a.charAt(i) != '9') {
                a = a.replace(a.charAt(i), '9');
                break;
            }
        }
        if (b.charAt(0) != '1') {
            b = b.replace(b.charAt(0), '1');
        } else {
            for (int i = 1; i < b.length(); ++i) {
                if (b.charAt(i) != '0' && b.charAt(i) != '1') {
                    b = b.replace(b.charAt(i), '0');
                    break;
                }
            }
        }
        return Integer.parseInt(a) - Integer.parseInt(b);
    }
}
```

### Python

```python
# Max Difference You Can Get From Changing an Integer：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxDiff(self, num: int) -> int:
        a, b = str(num), str(num)
        for c in a:
            if c != "9":
                a = a.replace(c, "9")
                break
        if b[0] != "1":
            b = b.replace(b[0], "1")
        else:
            for c in b[1:]:
                if c not in "01":
                    b = b.replace(c, "0")
                    break
        return int(a) - int(b)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

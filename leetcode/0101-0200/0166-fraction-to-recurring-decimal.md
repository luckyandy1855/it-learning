# 0166. Fraction to Recurring Decimal

---
编号: 166
题目: Fraction to Recurring Decimal
难度: 中等
标签: [哈希表, 数学, 字符串]
来源链接: https://leetcode.com/problems/fraction-to-recurring-decimal/
---

## 题目描述

给定两个整数，分别表示分数的分子 `numerator` 和分母 `denominator`，以 **字符串形式返回小数** 。

如果小数部分为循环小数，则将循环的部分括在括号内。

如果存在多个答案，只需返回 **任意一个** 。

对于所有给定的输入，**保证** 答案字符串的长度小于 `10^4` 。

**注意**，如果分数可以表示为有限长度的字符串，则 **必须** 返回它。

**示例 1：**

```text
输入：numerator = 1, denominator = 2
输出："0.5"
```

**示例 2：**

```text
输入：numerator = 2, denominator = 1
输出："2"
```

**示例 3：**

```text
输入：numerator = 4, denominator = 333
输出："0.(012)"
```

**提示：**

	- `-2^31 <= numerator, denominator <= 2^31 - 1`

	- `denominator != 0`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断 $numerator$ 是否为 $0$，如果是，则直接返回 `"0"`。

接着我们判断 $numerator$ 和 $denominator$ 是否异号，如果是，则结果为负数，我们将结果的第一个字符设为 `"-"`。

然后我们将 $numerator$ 和 $denominator$ 取绝对值，分别记为 $a$ 和 $b$。由于分子和分母的范围为 $[-2^{31}, 2^{31} - 1]$，直接取绝对值可能会溢出，因此我们将 $a$ 和 $b$ 都转换为长整型。

接着我们计算整数部分，即 $a$ 除以 $b$ 的整数部分，将其转换为字符串并添加到结果中。然后我们将 $a$ 取余 $b$，记为 $a$。

如果 $a$ 为 $0$，说明结果为整数，直接返回结果。

接着我们计算小数部分，我们使用哈希表 $d$ 记录每个余数对应的结果的长度。我们不断将 $a$ 乘以 $10$，然后将 $a$ 除以 $b$ 的整数部分添加到结果中，然后将 $a$ 取余 $b$，记为 $a$。如果 $a$ 为 $0$，说明结果为有限小数，直接返回结果。如果 $a$ 在哈希表中出现过，说明结果为循环小数，我们找到循环的起始位置，将结果插入括号中，然后返回结果。

时间复杂度 $O(l)$，空间复杂度 $O(l)$，其中 $l$ 为结果的长度，本题中 $l < 10^4$。

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
// Fraction to Recurring Decimal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func fractionToDecimal(numerator int, denominator int) string {
	if numerator == 0 {
		return "0"
	}
	ans := ""
	if (numerator > 0) != (denominator > 0) {
		ans += "-"
	}
	a := int64(numerator)
	b := int64(denominator)
	a = abs(a)
	b = abs(b)
	ans += strconv.FormatInt(a/b, 10)
	a %= b
	if a == 0 {
		return ans
	}
	ans += "."
	d := make(map[int64]int)
	for a != 0 {
		if pos, ok := d[a]; ok {
			ans = ans[:pos] + "(" + ans[pos:] + ")"
			break
		}
		d[a] = len(ans)
		a *= 10
		ans += strconv.FormatInt(a/b, 10)
		a %= b
	}
	return ans
}

func abs(x int64) int64 {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Fraction to Recurring Decimal：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String fractionToDecimal(int numerator, int denominator) {
        if (numerator == 0) {
            return "0";
        }
        StringBuilder sb = new StringBuilder();
        boolean neg = (numerator > 0) ^ (denominator > 0);
        sb.append(neg ? "-" : "");
        long a = Math.abs((long) numerator), b = Math.abs((long) denominator);
        sb.append(a / b);
        a %= b;
        if (a == 0) {
            return sb.toString();
        }
        sb.append(".");
        Map<Long, Integer> d = new HashMap<>();
        while (a != 0) {
            d.put(a, sb.length());
            a *= 10;
            sb.append(a / b);
            a %= b;
            if (d.containsKey(a)) {
                sb.insert(d.get(a), "(");
                sb.append(")");
                break;
            }
        }
        return sb.toString();
    }
}
```

### Python

```python
# Fraction to Recurring Decimal：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def fractionToDecimal(self, numerator: int, denominator: int) -> str:
        if numerator == 0:
            return "0"
        ans = []
        neg = (numerator > 0) ^ (denominator > 0)
        if neg:
            ans.append("-")
        a, b = abs(numerator), abs(denominator)
        ans.append(str(a // b))
        a %= b
        if a == 0:
            return "".join(ans)
        ans.append(".")
        d = {}
        while a:
            d[a] = len(ans)
            a *= 10
            ans.append(str(a // b))
            a %= b
            if a in d:
                ans.insert(d[a], "(")
                ans.append(")")
                break
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0984. String Without AAA or BBB

---
编号: 984
题目: String Without AAA or BBB
难度: 中等
标签: [贪心, 字符串]
来源链接: https://leetcode.com/problems/string-without-aaa-or-bbb/
---

## 题目描述

给定两个整数 `a` 和 `b` ，返回 **任意** 字符串 `s` ，要求满足：

- `s` 的长度为 `a + b`，且正好包含 `a` 个 `'a'` 字母与 `b` 个 `'b'` 字母；

- 子串 `'aaa'` 没有出现在 `s` 中；

- 子串 `'bbb'` 没有出现在 `s` 中。

**示例 1：**

```text
输入：a = 1, b = 2
输出："abb"
解释："abb", "bab" 和 "bba" 都是正确答案。
```

**示例 2：**

```text
输入：a = 4, b = 1
输出："aabaa"
```

**提示：**

- `0 ​​​

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

循环构造字符串，当 $a$ 和 $b$ 都大于 `0` 时：

1. 如果 $a\gt b$，添加字符串 "aab"
1. 如果 $b\gt a$，添加字符串 "bba"
1. 如果 $a=b$，添加字符串 "ab"

循环结束，若 $a$ 有剩余，则添加 $a$ 个字符串 "a"；若 $b$ 有剩余，则添加 $b$ 个字符串 "b"。

时间复杂度 $O(a+b)$。

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
// String Without AAA or BBB：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func strWithout3a3b(a int, b int) string {
	var ans strings.Builder
	for a > 0 && b > 0 {
		if a > b {
			ans.WriteString("aab")
			a -= 2
			b -= 1
		} else if a < b {
			ans.WriteString("bba")
			a -= 1
			b -= 2
		} else {
			ans.WriteString("ab")
			a--
			b--
		}
	}
	if a > 0 {
		ans.WriteString(strings.Repeat("a", a))
	}
	if b > 0 {
		ans.WriteString(strings.Repeat("b", b))
	}
	return ans.String()
}
```

### Java

```java
// String Without AAA or BBB：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String strWithout3a3b(int a, int b) {
        StringBuilder ans = new StringBuilder();
        while (a > 0 && b > 0) {
            if (a > b) {
                ans.append("aab");
                a -= 2;
                b -= 1;
            } else if (a < b) {
                ans.append("bba");
                a -= 1;
                b -= 2;
            } else {
                ans.append("ab");
                --a;
                --b;
            }
        }
        if (a > 0) {
            ans.append("a".repeat(a));
        }
        if (b > 0) {
            ans.append("b".repeat(b));
        }
        return ans.toString();
    }
}
```

### Python

```python
# String Without AAA or BBB：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def strWithout3a3b(self, a: int, b: int) -> str:
        ans = []
        while a and b:
            if a > b:
                ans.append('aab')
                a, b = a - 2, b - 1
            elif a < b:
                ans.append('bba')
                a, b = a - 1, b - 2
            else:
                ans.append('ab')
                a, b = a - 1, b - 1
        if a:
            ans.append('a' * a)
        if b:
            ans.append('b' * b)
        return ''.join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

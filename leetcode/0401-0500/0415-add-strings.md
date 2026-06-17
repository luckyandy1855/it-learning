# 0415. Add Strings

---
编号: 415
题目: Add Strings
难度: 简单
标签: [数学, 字符串, 模拟]
来源链接: https://leetcode.com/problems/add-strings/
---

## 题目描述

给定两个字符串形式的非负整数 `num1` 和`num2` ，计算它们的和并同样以字符串形式返回。

你不能使用任何內建的用于处理大整数的库（比如 `BigInteger`）， 也不能直接将输入的字符串转换为整数形式。

**示例 1：**

```text
输入：num1 = "11", num2 = "123"
输出："134"
```

**示例 2：**

```text
输入：num1 = "456", num2 = "77"
输出："533"
```

**示例 3：**

```text
输入：num1 = "0", num2 = "0"
输出："0"
```

**提示：**

- `1 <= num1.length, num2.length <= 10^4`

- `num1` 和`num2` 都只包含数字 `0-9`

- `num1` 和`num2` 都不包含任何前导零

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用两个指针 $i$ 和 $j$ 分别指向两个字符串的末尾，从末尾开始逐位相加。每次取出对应位的数字 $a$ 和 $b$，计算它们的和 $a + b + c$，其中 $c$ 表示上一次相加的进位，最后将 $a + b + c$ 的个位数添加到追加到答案字符串的末尾，然后将 $a + b + c$ 的十位数作为进位 $c$ 的值，循环此过程直至两个字符串的指针都已经指向了字符串的开头并且进位 $c$ 的值为 $0$。

最后将答案字符串反转并返回即可。

时间复杂度 $O(\max(m, n))$，其中 $m$ 和 $n$ 分别是两个字符串的长度。忽略答案字符串的空间消耗，空间复杂度 $O(1)$。

以下代码还实现了字符串相减，参考 `subStrings(num1, num2)` 函数。

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
// Add Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func addStrings(num1 string, num2 string) string {
	i, j := len(num1)-1, len(num2)-1
	ans := []byte{}
	for c := 0; i >= 0 || j >= 0 || c > 0; i, j = i-1, j-1 {
		if i >= 0 {
			c += int(num1[i] - '0')
		}
		if j >= 0 {
			c += int(num2[j] - '0')
		}
		ans = append(ans, byte(c%10+'0'))
		c /= 10
	}
	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
	return string(ans)
}

func subStrings(num1 string, num2 string) string {
	m, n := len(num1), len(num2)
	neg := m < n || (m == n && num1 < num2)
	if neg {
		num1, num2 = num2, num1
	}
	i, j := len(num1)-1, len(num2)-1
	ans := []byte{}
	for c := 0; i >= 0; i, j = i-1, j-1 {
		c = int(num1[i]-'0') - c
		if j >= 0 {
			c -= int(num2[j] - '0')
		}
		ans = append(ans, byte((c+10)%10+'0'))
		if c < 0 {
			c = 1
		} else {
			c = 0
		}
	}
	for len(ans) > 1 && ans[len(ans)-1] == '0' {
		ans = ans[:len(ans)-1]
	}
	if neg {
		ans = append(ans, '-')
	}
	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
	return string(ans)
}
```

### Java

```java
// Add Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String addStrings(String num1, String num2) {
        int i = num1.length() - 1, j = num2.length() - 1;
        StringBuilder ans = new StringBuilder();
        for (int c = 0; i >= 0 || j >= 0 || c > 0; --i, --j) {
            int a = i < 0 ? 0 : num1.charAt(i) - '0';
            int b = j < 0 ? 0 : num2.charAt(j) - '0';
            c += a + b;
            ans.append(c % 10);
            c /= 10;
        }
        return ans.reverse().toString();
    }

    public String subStrings(String num1, String num2) {
        int m = num1.length(), n = num2.length();
        boolean neg = m < n || (m == n && num1.compareTo(num2) < 0);
        if (neg) {
            String t = num1;
            num1 = num2;
            num2 = t;
        }
        int i = num1.length() - 1, j = num2.length() - 1;
        StringBuilder ans = new StringBuilder();
        for (int c = 0; i >= 0; --i, --j) {
            c = (num1.charAt(i) - '0') - c - (j < 0 ? 0 : num2.charAt(j) - '0');
            ans.append((c + 10) % 10);
            c = c < 0 ? 1 : 0;
        }
        while (ans.length() > 1 && ans.charAt(ans.length() - 1) == '0') {
            ans.deleteCharAt(ans.length() - 1);
        }
        if (neg) {
            ans.append('-');
        }
        return ans.reverse().toString();
    }
}
```

### Python

```python
# Add Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def addStrings(self, num1: str, num2: str) -> str:
        i, j = len(num1) - 1, len(num2) - 1
        ans = []
        c = 0
        while i >= 0 or j >= 0 or c:
            a = 0 if i < 0 else int(num1[i])
            b = 0 if j < 0 else int(num2[j])
            c, v = divmod(a + b + c, 10)
            ans.append(str(v))
            i, j = i - 1, j - 1
        return "".join(ans[::-1])

    def subStrings(self, num1: str, num2: str) -> str:
        m, n = len(num1), len(num2)
        neg = m < n or (m == n and num1 < num2)
        if neg:
            num1, num2 = num2, num1
        i, j = len(num1) - 1, len(num2) - 1
        ans = []
        c = 0
        while i >= 0:
            c = int(num1[i]) - c - (0 if j < 0 else int(num2[j]))
            ans.append(str((c + 10) % 10))
            c = 1 if c < 0 else 0
            i, j = i - 1, j - 1
        while len(ans) > 1 and ans[-1] == '0':
            ans.pop()
        if neg:
            ans.append('-')
        return ''.join(ans[::-1])
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

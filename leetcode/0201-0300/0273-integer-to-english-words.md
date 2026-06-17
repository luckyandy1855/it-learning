# 0273. Integer to English Words

---
编号: 273
题目: Integer to English Words
难度: 困难
标签: [递归, 数学, 字符串]
来源链接: https://leetcode.com/problems/integer-to-english-words/
---

## 题目描述

将非负整数 `num` 转换为其对应的英文表示。

**示例 1：**

```text
输入：num = 123
输出："One Hundred Twenty Three"
```

**示例 2：**

```text
输入：num = 12345
输出："Twelve Thousand Three Hundred Forty Five"
```

**示例 3：**

```text
输入：num = 1234567
输出："One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"
```

**提示：**

- `0 <= num <= 2^31 - 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「递归, 数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Integer to English Words：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberToWords(num int) string {
	if num == 0 {
		return "Zero"
	}

	lt20 := []string{
		"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
		"Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
		"Sixteen", "Seventeen", "Eighteen", "Nineteen",
	}
	tens := []string{
		"", "Ten", "Twenty", "Thirty", "Forty", "Fifty",
		"Sixty", "Seventy", "Eighty", "Ninety",
	}
	thousands := []string{"Billion", "Million", "Thousand", ""}

	var transfer func(int) string
	transfer = func(num int) string {
		if num == 0 {
			return ""
		}
		if num < 20 {
			return lt20[num]
		}
		if num < 100 {
			if num%10 == 0 {
				return tens[num/10]
			}
			return tens[num/10] + " " + transfer(num%10)
		}
		if num%100 == 0 {
			return lt20[num/100] + " Hundred"
		}
		return lt20[num/100] + " Hundred " + transfer(num%100)
	}

	res := ""
	for i, j := 1000000000, 0; i > 0; i, j = i/1000, j+1 {
		cur := num / i
		if cur == 0 {
			continue
		}
		if res != "" {
			res += " "
		}
		res += transfer(cur)
		if thousands[j] != "" {
			res += " " + thousands[j]
		}
		num %= i
	}
	return res
}
```

### Java

```java
import java.util.*;
// Integer to English Words：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private String[] lt20 = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
        "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"};
    private String[] tens
        = {"", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};
    private String[] thousands = {"Billion", "Million", "Thousand", ""};

    public String numberToWords(int num) {
        if (num == 0) {
            return "Zero";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1000000000, j = 0; i > 0; i /= 1000, ++j) {
            if (num / i == 0) {
                continue;
            }
            sb.append(transfer(num / i)).append(thousands[j]).append(' ');
            num %= i;
        }
        return sb.toString().trim();
    }

    private String transfer(int num) {
        if (num == 0) {
            return "";
        }
        if (num < 20) {
            return lt20[num] + " ";
        }
        if (num < 100) {
            return tens[num / 10] + " " + transfer(num % 10);
        }
        return lt20[num / 100] + " Hundred " + transfer(num % 100);
    }
}
```

### Python

```python
# Integer to English Words：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberToWords(self, num: int) -> str:
        if num == 0:
            return 'Zero'

        lt20 = [
            '',
            'One',
            'Two',
            'Three',
            'Four',
            'Five',
            'Six',
            'Seven',
            'Eight',
            'Nine',
            'Ten',
            'Eleven',
            'Twelve',
            'Thirteen',
            'Fourteen',
            'Fifteen',
            'Sixteen',
            'Seventeen',
            'Eighteen',
            'Nineteen',
        ]
        tens = [
            '',
            'Ten',
            'Twenty',
            'Thirty',
            'Forty',
            'Fifty',
            'Sixty',
            'Seventy',
            'Eighty',
            'Ninety',
        ]
        thousands = ['Billion', 'Million', 'Thousand', '']

        def transfer(num):
            if num == 0:
                return ''
            if num < 20:
                return lt20[num] + ' '
            if num < 100:
                return tens[num // 10] + ' ' + transfer(num % 10)
            return lt20[num // 100] + ' Hundred ' + transfer(num % 100)

        res = []
        i, j = 1000000000, 0
        while i > 0:
            if num // i != 0:
                res.append(transfer(num // i))
                res.append(thousands[j])
                res.append(' ')
                num %= i
            j += 1
            i //= 1000
        return ''.join(res).strip()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

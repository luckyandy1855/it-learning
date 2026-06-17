# 0591. Tag Validator

---
编号: 591
题目: Tag Validator
难度: 困难
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/tag-validator/
---

## 题目描述

给定一个表示代码片段的字符串，你需要实现一个验证器来解析这段代码，并返回它是否合法。合法的代码片段需要遵守以下的所有规则：

- 代码必须被**合法的闭合标签**包围。否则，代码是无效的。

- **闭合标签**（不一定合法）要严格符合格式：`TAG_CONTENT`。其中，``是起始标签，``是结束标签。起始和结束标签中的 TAG_NAME 应当相同。当且仅当 TAG_NAME 和 TAG_CONTENT 都是合法的，闭合标签才是**合法的**。

- **合法的** `TAG_NAME` 仅含有**大写字母**，长度在范围 [1,9] 之间。否则，该 `TAG_NAME` 是**不合法的**。

- **合法的** `TAG_CONTENT` 可以包含其他**合法的闭合标签**，**cdata** （请参考规则7）和任意字符（注意参考规则1）**除了**不匹配的``与之匹配，是不合法的。并且当你找到一个``的前的字符，都应当被解析为 TAG_NAME（不一定合法）。

- cdata 有如下格式：``。`CDATA_CONTENT` 的范围被定义成 ``之间的字符。

- `CDATA_CONTENT` 可以包含**任意字符**。cdata 的功能是阻止验证器解析`CDATA_CONTENT`，所以即使其中有一些字符可以被解析为标签（无论合法还是不合法），也应该将它们视为**常规字符**。

示例 1：

```text
输入：code = "This is the first line ]]>"
输出：true
解释：
代码被闭合的标签包围： 和 。
TAG_NAME 是合法的，TAG_CONTENT 只包含一些字母和 cdata。
尽管 CDATA_CONTENT 有一个非法 TAG_NAME 的未匹配开始标签，它可以被认为是普通文本，不被解析为一个标签。
所以 TAG_CONTENT 是合法的，并且代码是合法的。因此返回 true。
```

示例 2：

```text
输入：code = ">>  ![cdata[]] ]>]]>]]>>]"
输出：true
解释：
我们首先将代码分割为：start_tag|tag_content|end_tag。
start_tag -> ""
end_tag -> ""
tag_content 也可以被分割为：text1|cdata|text2。
text1 -> ">>  ![cdata[]] "
cdata -> "]>]]>"，其中 CDATA_CONTENT 是 "]>"
text2 -> "]]>>]"
start_tag 不是 ">>" 的原因是规则 6。
cdata 不是 "]>]]>]]>" 的原因是规则 7。
```

示例 3：

```text
输入：code = "      "
输出：false
解释：不平衡。如果 "" 是闭合的，那么 "" 一定没有匹配，反之亦然。
```

**提示：**

- `1 '`，`'/'`，`'!'`，`'['`，`']'`，`'.'` 和 `' '`。

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
// Tag Validator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isValid(code string) bool {
	var stk []string
	for i := 0; i < len(code); i++ {
		if i > 0 && len(stk) == 0 {
			return false
		}
		if strings.HasPrefix(code[i:], "<![CDATA[") {
			n := strings.Index(code[i+9:], "]]>")
			if n == -1 {
				return false
			}
			i += n + 11
		} else if strings.HasPrefix(code[i:], "</") {
			if len(stk) == 0 {
				return false
			}
			j := i + 2
			n := strings.IndexByte(code[j:], '>')
			if n == -1 {
				return false
			}
			t := code[j : j+n]
			last := stk[len(stk)-1]
			stk = stk[:len(stk)-1]
			if !check(t) || last != t {
				return false
			}
			i += n + 2
		} else if strings.HasPrefix(code[i:], "<") {
			j := i + 1
			n := strings.IndexByte(code[j:], '>')
			if n == -1 {
				return false
			}
			t := code[j : j+n]
			if !check(t) {
				return false
			}
			stk = append(stk, t)
			i += n + 1
		}
	}
	return len(stk) == 0
}

func check(tag string) bool {
	n := len(tag)
	if n < 1 || n > 9 {
		return false
	}
	for _, c := range tag {
		if c < 'A' || c > 'Z' {
			return false
		}
	}
	return true
}
```

### Java

```java
// Tag Validator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isValid(String code) {
        Deque<String> stk = new ArrayDeque<>();
        for (int i = 0; i < code.length(); ++i) {
            if (i > 0 && stk.isEmpty()) {
                return false;
            }
            if (code.startsWith("<![CDATA[", i)) {
                i = code.indexOf("]]>", i + 9);
                if (i < 0) {
                    return false;
                }
                i += 2;
            } else if (code.startsWith("</", i)) {
                int j = i + 2;
                i = code.indexOf(">", j);
                if (i < 0) {
                    return false;
                }
                String t = code.substring(j, i);
                if (!check(t) || stk.isEmpty() || !stk.pop().equals(t)) {
                    return false;
                }
            } else if (code.startsWith("<", i)) {
                int j = i + 1;
                i = code.indexOf(">", j);
                if (i < 0) {
                    return false;
                }
                String t = code.substring(j, i);
                if (!check(t)) {
                    return false;
                }
                stk.push(t);
            }
        }
        return stk.isEmpty();
    }

    private boolean check(String tag) {
        int n = tag.length();
        if (n < 1 || n > 9) {
            return false;
        }
        for (char c : tag.toCharArray()) {
            if (!Character.isUpperCase(c)) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Tag Validator：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isValid(self, code: str) -> bool:
        def check(tag):
            return 1 <= len(tag) <= 9 and all(c.isupper() for c in tag)

        stk = []
        i, n = 0, len(code)
        while i < n:
            if i and not stk:
                return False
            if code[i : i + 9] == '<![CDATA[':
                i = code.find(']]>', i + 9)
                if i < 0:
                    return False
                i += 2
            elif code[i : i + 2] == '</':
                j = i + 2
                i = code.find('>', j)
                if i < 0:
                    return False
                t = code[j:i]
                if not check(t) or not stk or stk.pop() != t:
                    return False
            elif code[i] == '<':
                j = i + 1
                i = code.find('>', j)
                if i < 0:
                    return False
                t = code[j:i]
                if not check(t):
                    return False
                stk.append(t)
            i += 1
        return not stk
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

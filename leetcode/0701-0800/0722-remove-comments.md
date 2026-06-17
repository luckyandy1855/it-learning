# 0722. Remove Comments

---
编号: 722
题目: Remove Comments
难度: 中等
标签: [数组, 字符串]
来源链接: https://leetcode.com/problems/remove-comments/
---

## 题目描述

给一个 C++ 程序，删除程序中的注释。这个程序`source`是一个数组，其中`source[i]`表示第 `i` 行源码。 这表示每行源码由 `'\n'` 分隔。

在 C++ 中有两种注释风格，行内注释和块注释。

- 字符串`//` 表示行注释，表示`//`和其右侧的其余字符应该被忽略。

- 字符串`/*` 表示一个块注释，它表示直到下一个（非重叠）出现的`*/`之间的所有字符都应该被忽略。（阅读顺序为从左到右）非重叠是指，字符串`/*/`并没有结束块注释，因为注释的结尾与开头相重叠。

第一个有效注释优先于其他注释。

- 如果字符串`//`出现在块注释中会被忽略。

- 同样，如果字符串`/*`出现在行或块注释中也会被忽略。

如果一行在删除注释之后变为空字符串，那么**不要**输出该行。即，答案列表中的每个字符串都是非空的。

样例中**没有**控制字符，单引号或双引号字符。

- 比如，`source = "string s = "/* Not a comment. */";"` 不会出现在测试样例里。

此外，没有其他内容（如定义或宏）会干扰注释。

我们保证每一个块注释最终都会被闭合， 所以在行或块注释之外的`/*`总是开始新的注释。

最后，隐式换行符**可以**通过块注释删除。 有关详细信息，请参阅下面的示例。

从源代码中删除注释后，需要以相同的格式返回源代码。

**示例 1:**

```text
输入: source = ["/*Test program */", "int main()", "{ ", "  // variable declaration ", "int a, b, c;", "/* This is a test", "   multiline  ", "   comment for ", "   testing */", "a = b + c;", "}"]
输出: ["int main()","{ ","  ","int a, b, c;","a = b + c;","}"]
解释: 示例代码可以编排成这样:
/*Test program */
int main()
{
  // variable declaration
int a, b, c;
/* This is a test
   multiline
   comment for
   testing */
a = b + c;
}
第 1 行和第 6-9 行的字符串 /* 表示块注释。第 4 行的字符串 // 表示行注释。
编排后:
int main()
{

int a, b, c;
a = b + c;
}
```

**示例 2:**

```text
输入: source = ["a/*comment", "line", "more_comment*/b"]
输出: ["ab"]
解释: 原始的 source 字符串是 "a/*comment\nline\nmore_comment*/b", 其中我们用粗体显示了换行符。删除注释后，隐含的换行符被删除，留下字符串 "ab" 用换行符分隔成数组时就是 ["ab"].
```

**提示:**

- `1  ​​​​​​

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个变量 来表示当前是否处于块注释中，初始时 $\textit{blockComment}$ 为 `false`；用一个变量 $t$ 来存储当前行的有效字符。

接下来，遍历每一行，分情况讨论：

如果当前处于块注释中，那么如果当前字符和下一个字符是 `'*/'`，说明块注释结束，我们将 $\textit{blockComment}$ 置为 `false`，并且跳过这两个字符；否则，我们继续保持块注释状态，不做任何操作；

如果当前不处于块注释中，那么如果当前字符和下一个字符是 `'/*'`，说明块注释开始，我们将 $\textit{blockComment}$ 置为 `true`，并且跳过这两个字符；如果当前字符和下一个字符是 `'//'`，那么说明行注释开始，我们直接退出当前行的遍历；否则，说明当前字符是有效字符，我们将其加入 $t$ 中；

遍历完当前行后，如果 $\textit{blockComment}$ 为 `false`，并且 $t$ 不为空，说明当前行是有效行，我们将其加入答案数组中，并且清空 $t$。继续遍历下一行。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 是源代码的总长度。

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
// Remove Comments：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeComments(source []string) (ans []string) {
	t := []byte{}
	blockComment := false
	for _, s := range source {
		m := len(s)
		for i := 0; i < m; i++ {
			if blockComment {
				if i+1 < m && s[i] == '*' && s[i+1] == '/' {
					blockComment = false
					i++
				}
			} else {
				if i+1 < m && s[i] == '/' && s[i+1] == '*' {
					blockComment = true
					i++
				} else if i+1 < m && s[i] == '/' && s[i+1] == '/' {
					break
				} else {
					t = append(t, s[i])
				}
			}
		}
		if !blockComment && len(t) > 0 {
			ans = append(ans, string(t))
			t = []byte{}
		}
	}
	return
}
```

### Java

```java
// Remove Comments：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> removeComments(String[] source) {
        List<String> ans = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean blockComment = false;
        for (String s : source) {
            int m = s.length();
            for (int i = 0; i < m; ++i) {
                if (blockComment) {
                    if (i + 1 < m && s.charAt(i) == '*' && s.charAt(i + 1) == '/') {
                        blockComment = false;
                        ++i;
                    }
                } else {
                    if (i + 1 < m && s.charAt(i) == '/' && s.charAt(i + 1) == '*') {
                        blockComment = true;
                        ++i;
                    } else if (i + 1 < m && s.charAt(i) == '/' && s.charAt(i + 1) == '/') {
                        break;
                    } else {
                        sb.append(s.charAt(i));
                    }
                }
            }
            if (!blockComment && sb.length() > 0) {
                ans.add(sb.toString());
                sb.setLength(0);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Remove Comments：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeComments(self, source: List[str]) -> List[str]:
        ans = []
        t = []
        block_comment = False
        for s in source:
            i, m = 0, len(s)
            while i < m:
                if block_comment:
                    if i + 1 < m and s[i : i + 2] == "*/":
                        block_comment = False
                        i += 1
                else:
                    if i + 1 < m and s[i : i + 2] == "/*":
                        block_comment = True
                        i += 1
                    elif i + 1 < m and s[i : i + 2] == "//":
                        break
                    else:
                        t.append(s[i])
                i += 1
            if not block_comment and t:
                ans.append("".join(t))
                t.clear()
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0929. Unique Email Addresses

---
编号: 929
题目: Unique Email Addresses
难度: 简单
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/unique-email-addresses/
---

## 题目描述

每个 **有效电子邮件地址** 都由一个 **本地名** 和一个 **域名** 组成，以 `'@'` 符号分隔。除小写字母之外，电子邮件地址还可以含有一个或多个 `'.'` 或 `'+'` 。

- 例如，在 `alice@leetcode.com`中， `alice` 是 **本地名** ，而 `leetcode.com` 是 **域名** 。

如果在电子邮件地址的** 本地名 **部分中的某些字符之间添加句点（`'.'`），则发往那里的邮件将会转发到本地名中没有点的同一地址。请注意，此规则 **不适用于域名** 。

- 例如，`"alice.z@leetcode.com”` 和 `“alicez@leetcode.com”` 会转发到同一电子邮件地址。

如果在** 本地名 **中添加加号（`'+'`），则会忽略第一个加号后面的所有内容。这允许过滤某些电子邮件。同样，此规则 **不适用于域名** 。

- 例如 `m.y+name@email.com` 将转发到 `my@email.com`。

可以同时使用这两个规则。

给你一个字符串数组 `emails`，我们会向每个 `emails[i]` 发送一封电子邮件。返回实际收到邮件的不同地址数目。

**示例 1：**

```text
输入：emails = ["test.email+alex@leetcode.com","test.e.mail+bob.cathy@leetcode.com","testemail+david@lee.tcode.com"]
输出：2
解释：实际收到邮件的是 "testemail@leetcode.com" 和 "testemail@lee.tcode.com"。
```

**示例 2：**

```text
输入：emails = ["a@leetcode.com","b@leetcode.com","c@leetcode.com"]
输出：3
```

**提示：**

- `1 <= emails.length <= 100`

- `1 <= emails[i].length <= 100`

- `emails[i]` 由小写英文字母、`'+'`、`'.'` 和 `'@'` 组成

- 每个 `emails[i]` 都包含有且仅有一个 `'@'` 字符

- 所有本地名和域名都不为空

- 本地名不会以 `'+'` 字符作为开头

- 域名以 `".com"` 后缀结尾。

- 域名在 `".com"` 后缀前至少包含一个字符

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表 $s$ 来存储所有的电子邮件地址，然后遍历数组 $\textit{emails}$，对于每个电子邮件地址，我们将其分为本地名和域名两部分，然后对本地名进行处理，去掉所有的点号和加号后面的字符，最后将处理后的本地名和域名拼接起来，加入哈希表 $s$ 中。

最后返回哈希表 $s$ 的大小即可。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 为所有电子邮件地址的长度之和。

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
// Unique Email Addresses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numUniqueEmails(emails []string) int {
	s := make(map[string]struct{})
	for _, email := range emails {
		parts := strings.Split(email, "@")
		local := parts[0]
		domain := parts[1]
		var t strings.Builder
		for _, c := range local {
			if c == '.' {
				continue
			}
			if c == '+' {
				break
			}
			t.WriteByte(byte(c))
		}
		s[t.String()+"@"+domain] = struct{}{}
	}
	return len(s)
}
```

### Java

```java
// Unique Email Addresses：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numUniqueEmails(String[] emails) {
        Set<String> s = new HashSet<>();
        for (String email : emails) {
            String[] parts = email.split("@");
            String local = parts[0];
            String domain = parts[1];
            StringBuilder t = new StringBuilder();
            for (char c : local.toCharArray()) {
                if (c == '.') {
                    continue;
                }
                if (c == '+') {
                    break;
                }
                t.append(c);
            }
            s.add(t.toString() + "@" + domain);
        }
        return s.size();
    }
}
```

### Python

```python
# Unique Email Addresses：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numUniqueEmails(self, emails: List[str]) -> int:
        s = set()
        for email in emails:
            local, domain = email.split("@")
            t = []
            for c in local:
                if c == ".":
                    continue
                if c == "+":
                    break
                t.append(c)
            s.add("".join(t) + "@" + domain)
        return len(s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

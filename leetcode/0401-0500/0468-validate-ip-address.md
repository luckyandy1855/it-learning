# 0468. Validate IP Address

---
编号: 468
题目: Validate IP Address
难度: 中等
标签: [字符串]
来源链接: https://leetcode.com/problems/validate-ip-address/
---

## 题目描述

给定一个字符串 `queryIP`。如果是有效的 IPv4 地址，返回 `"IPv4"` ；如果是有效的 IPv6 地址，返回 `"IPv6"` ；如果不是上述类型的 IP 地址，返回 `"Neither"` 。

**有效的IPv4地址** 是 `“x1.x2.x3.x4”` 形式的IP地址。 其中 `0 i i` **不能包含** 前导零。例如: `“192.168.1.1”` 、 `“192.168.1.0”` 为有效IPv4地址， `“192.168.01.1”` 为无效IPv4地址; `“192.168.1.00”` 、 `“192.168@1.1”` 为无效IPv4地址。

**一个有效的IPv6地址 **是一个格式为`“x1:x2:x3:x4:x5:x6:x7:x8”` 的IP地址，其中:

- `1 i.length i` 是一个 **十六进制字符串** ，可以包含数字、小写英文字母( `'a'` 到 `'f'` )和大写英文字母( `'A'` 到 `'F'` )。

- 在 `xi` 中允许前导零。

例如 `"2001:0db8:85a3:0000:0000:8a2e:0370:7334"` 和 `"2001:db8:85a3:0:0:8A2E:0370:7334"` 是有效的 IPv6 地址，而 `"2001:0db8:85a3::8A2E:037j:7334"` 和 `"02001:0db8:85a3:0000:0000:8a2e:0370:7334"` 是无效的 IPv6 地址。

**示例 1：**

```text
输入：queryIP = "172.16.254.1"
输出："IPv4"
解释：有效的 IPv4 地址，返回 "IPv4"
```

**示例 2：**

```text
输入：queryIP = "2001:0db8:85a3:0:0:8A2E:0370:7334"
输出："IPv6"
解释：有效的 IPv6 地址，返回 "IPv6"
```

**示例 3：**

```text
输入：queryIP = "256.256.256.256"
输出："Neither"
解释：既不是 IPv4 地址，又不是 IPv6 地址
```

**提示：**

- `queryIP` 仅由英文字母，数字，字符 `'.'` 和 `':'` 组成。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以定义两个函数 `isIPv4` 和 `isIPv6` 来判断一个字符串是否是有效的 IPv4 地址和 IPv6 地址。

函数 `isIPv4` 的实现如下：

1. 我们首先判断字符串 `s` 是否以 `.` 结尾，如果是的话，说明 `s` 不是一个有效的 IPv4 地址，直接返回 `false`。
1. 然后我们将字符串 `s` 以 `.` 分割成一个字符串数组 `ss`，如果 `ss` 的长度不等于 `4`，说明 `s` 不是一个有效的 IPv4 地址，直接返回 `false`。
1. 对于数组 `ss` 中的每个字符串 `t`，我们判断：
    - 如果 `t` 的长度大于 `1` 且 `t` 的第一个字符是 `0`，说明 `t` 不是一个有效的 IPv4 地址，直接返回 `false`。
    - 如果 `t` 不是一个数字或者 `t` 不在 `0` 到 `255` 的范围内，说明 `t` 不是一个有效的 IPv4 地址，直接返回 `false`。
1. 如果上述条件都不满足，说明 `s` 是一个有效的 IPv4 地址，返回 `true`。

函数 `isIPv6` 的实现如下：

1. 我们首先判断字符串 `s` 是否以 `:` 结尾，如果是的话，说明 `s` 不是一个有效的 IPv6 地址，直接返回 `false`。
1. 然后我们将字符串 `s` 以 `:` 分割成一个字符串数组 `ss`，如果 `ss` 的长度不等于 `8`，说明 `s` 不是一个有效的 IPv6 地址，直接返回 `false`。
1. 对于数组 `ss` 中的每个字符串 `t`，我们判断：
    - 如果 `t` 的长度小于 `1` 或大于 `4`，说明 `t` 不是一个有效的 IPv6 地址，直接返回 `false`。
    - 如果 `t` 中的字符不全是 `0` 到 `9` 和 `a` 到 `f`（不区分大小写），说明 `t` 不是一个有效的 IPv6 地址，直接返回 `false`。
1. 如果上述条件都不满足，说明 `s` 是一个有效的 IPv6 地址，返回 `true`。

最后，我们调用 `isIPv4` 和 `isIPv6` 函数判断 `queryIP` 是不是一个有效的 IPv4 地址或 IPv6 地址，如果都不是，返回 `Neither`。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 `queryIP` 的长度。

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
// Validate IP Address：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validIPAddress(queryIP string) string {
	if isIPv4(queryIP) {
		return "IPv4"
	}
	if isIPv6(queryIP) {
		return "IPv6"
	}
	return "Neither"
}

func isIPv4(s string) bool {
	if strings.HasSuffix(s, ".") {
		return false
	}
	ss := strings.Split(s, ".")
	if len(ss) != 4 {
		return false
	}
	for _, t := range ss {
		if len(t) == 0 || (len(t) > 1 && t[0] == '0') {
			return false
		}
		x := convert(t)
		if x < 0 || x > 255 {
			return false
		}
	}
	return true
}

func isIPv6(s string) bool {
	if strings.HasSuffix(s, ":") {
		return false
	}
	ss := strings.Split(s, ":")
	if len(ss) != 8 {
		return false
	}
	for _, t := range ss {
		if len(t) < 1 || len(t) > 4 {
			return false
		}
		for _, c := range t {
			if !unicode.IsDigit(c) && !strings.ContainsRune("0123456789abcdefABCDEF", c) {
				return false
			}
		}
	}
	return true
}

func convert(s string) int {
	x := 0
	for _, c := range s {
		if !unicode.IsDigit(c) {
			return -1
		}
		x = x*10 + int(c-'0')
		if x > 255 {
			return x
		}
	}
	return x
}
```

### Java

```java
// Validate IP Address：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String validIPAddress(String queryIP) {
        if (isIPv4(queryIP)) {
            return "IPv4";
        }
        if (isIPv6(queryIP)) {
            return "IPv6";
        }
        return "Neither";
    }

    private boolean isIPv4(String s) {
        if (s.endsWith(".")) {
            return false;
        }
        String[] ss = s.split("\\.");
        if (ss.length != 4) {
            return false;
        }
        for (String t : ss) {
            if (t.length() == 0 || t.length() > 1 && t.charAt(0) == '0') {
                return false;
            }
            int x = convert(t);
            if (x < 0 || x > 255) {
                return false;
            }
        }
        return true;
    }

    private boolean isIPv6(String s) {
        if (s.endsWith(":")) {
            return false;
        }
        String[] ss = s.split(":");
        if (ss.length != 8) {
            return false;
        }
        for (String t : ss) {
            if (t.length() < 1 || t.length() > 4) {
                return false;
            }
            for (char c : t.toCharArray()) {
                if (!Character.isDigit(c)
                    && !"0123456789abcdefABCDEF".contains(String.valueOf(c))) {
                    return false;
                }
            }
        }
        return true;
    }

    private int convert(String s) {
        int x = 0;
        for (char c : s.toCharArray()) {
            if (!Character.isDigit(c)) {
                return -1;
            }
            x = x * 10 + (c - '0');
            if (x > 255) {
                return x;
            }
        }
        return x;
    }
}
```

### Python

```python
# Validate IP Address：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validIPAddress(self, queryIP: str) -> str:
        def is_ipv4(s: str) -> bool:
            ss = s.split(".")
            if len(ss) != 4:
                return False
            for t in ss:
                if len(t) > 1 and t[0] == "0":
                    return False
                if not t.isdigit() or not 0 <= int(t) <= 255:
                    return False
            return True

        def is_ipv6(s: str) -> bool:
            ss = s.split(":")
            if len(ss) != 8:
                return False
            for t in ss:
                if not 1 <= len(t) <= 4:
                    return False
                if not all(c in "0123456789abcdefABCDEF" for c in t):
                    return False
            return True

        if is_ipv4(queryIP):
            return "IPv4"
        if is_ipv6(queryIP):
            return "IPv6"
        return "Neither"
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

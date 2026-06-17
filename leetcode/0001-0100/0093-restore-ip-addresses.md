# 0093. Restore IP Addresses

---
编号: 93
题目: Restore IP Addresses
难度: 中等
标签: [字符串, 回溯]
来源链接: https://leetcode.com/problems/restore-ip-addresses/
---

## 题目描述

给定一个只含数字的字符串 `s`，返回所有可能从 `s` 还原的**有效 IP 地址**，可以按任意顺序返回结果。

有效 IP 地址由 4 个整数（每个整数在 0 到 255 之间组成，且不能含有前导零）组成，整数之间用 `'.'` 分隔。

### Example 1

```text
Input: s = "25525511135"
Output: ["255.255.11.135","255.255.111.35"]
```

### Example 2

```text
Input: s = "0000"
Output: ["0.0.0.0"]
```

### Example 3

```text
Input: s = "101023"
Output: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
```

### 约束条件

- `1 <= s.length <= 20`

## 思路分析

### 突破口

回溯：每次从当前位置截取 1-3 位数字作为一个 IP 段，验证合法性后递归处理剩余字符串；当已确定 4 段且字符串恰好用完时记录结果。

### 思路拆解

1. **回溯参数**：`start`（当前字符位置）、`parts`（已确定的段列表，最多 4 个）。

2. **合法性检查**：
   - 长度 1-3，且不含前导零（除非段本身就是 `"0"`）
   - 数值 <= 255

3. **终止条件**：`len(parts) == 4 && start == len(s)` → 记录 `".".join(parts)`。

4. **剪枝**：段数超过 4 或剩余字符数超过 `(4-len(parts))*3` 则提前退出。

### 示意图

```text
s="25525511135"
回溯(start=0, parts=[]):
  取"2"→ 回溯(1, ["2"]):
    取"5"→...（太深）
  取"25"→ 回溯(2, ["25"]):
    取"5"→ 回溯(3, ["25","5"]):
      ...
  取"255"→ 回溯(3, ["255"]):
    取"2"→ 回溯(4, ["255","2"]):
      ...
    取"25"→ 回溯(5, ["255","25"]):
      取"5"→ 回溯(6, ["255","25","5"]):
        ...
    取"255"→ 回溯(6, ["255","255"]):
      取"1"→ ["255","255","1"] ...
      取"11"→ ["255","255","11"] ...
      取"111"→ 回溯(9,["255","255","111"]):
        取"35"→ ["255","255","111","35"] len=4, start=11=end → 记录!
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 回溯 | O(3^4) = O(1) | O(4) = O(1) |

注：最多 4 段，每段最多 3 种选择，搜索空间是常数。

## 代码实现

### Go

```go
// restoreIpAddresses 返回从 s 能还原的所有有效 IP 地址
func restoreIpAddresses(s string) []string {
    result := []string{}
    parts := []string{}

    var backtrack func(start int)
    backtrack = func(start int) {
        if len(parts) == 4 && start == len(s) {
            result = append(result, parts[0]+"."+parts[1]+"."+parts[2]+"."+parts[3])
            return
        }
        if len(parts) == 4 || start == len(s) {
            return
        }
        for length := 1; length <= 3; length++ {
            if start+length > len(s) {
                break
            }
            seg := s[start : start+length]
            if length > 1 && seg[0] == '0' { // 前导零
                break
            }
            if length == 3 && seg > "255" { // 超出255
                break
            }
            parts = append(parts, seg)
            backtrack(start + length)
            parts = parts[:len(parts)-1]
        }
    }
    backtrack(0)
    return result
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 返回从 s 能还原的所有有效 IP 地址（回溯）。
     */
    public List<String> restoreIpAddresses(String s) {
        List<String> result = new ArrayList<>();
        List<String> parts = new ArrayList<>();
        backtrack(s, 0, parts, result);
        return result;
    }

    private void backtrack(String s, int start, List<String> parts, List<String> result) {
        if (parts.size() == 4 && start == s.length()) {
            result.add(String.join(".", parts));
            return;
        }
        if (parts.size() == 4 || start == s.length()) return;

        for (int len = 1; len <= 3; len++) {
            if (start + len > s.length()) break;
            String seg = s.substring(start, start + len);
            if (len > 1 && seg.charAt(0) == '0') break; // 前导零
            if (Integer.parseInt(seg) > 255) break;      // 超出255
            parts.add(seg);
            backtrack(s, start + len, parts, result);
            parts.remove(parts.size() - 1);
        }
    }
}
```

### Python

```python
class Solution:
    def restoreIpAddresses(self, s: str) -> list[str]:
        """
        返回从 s 能还原的所有有效 IP 地址（回溯）。
        """
        result = []

        def backtrack(start: int, parts: list) -> None:
            if len(parts) == 4 and start == len(s):
                result.append('.'.join(parts))
                return
            if len(parts) == 4 or start == len(s):
                return

            for length in range(1, 4):
                if start + length > len(s):
                    break
                seg = s[start:start + length]
                if length > 1 and seg[0] == '0':  # 前导零
                    break
                if int(seg) > 255:                 # 超出范围
                    break
                parts.append(seg)
                backtrack(start + length, parts)
                parts.pop()

        backtrack(0, [])
        return result
```

## 踩坑记录

- **前导零使用 `break` 而非 `continue`**：前导零只在 length>1 时出现，且一旦出现（如 `seg="01"`），length=3 的情况也一定是前导零（`seg="012"`），所以 `break` 而非跳过当前继续。
- **字符串比较 `seg > "255"` 在 Go 中合法**：字符串字典序比较，三位且首位 ≥ '3' 时一定 > 255；但严格来说应该转数字比较（两位数永远 ≤ 99，三位数首位 ≥ 3 一定 > 255），Python/Java 直接 `int(seg) > 255`。
- **终止条件需要同时满足两个条件**：`len(parts) == 4` 且 `start == len(s)`，缺一不可——4 段但字符串未用完，或字符串用完但不足 4 段，都不合法。

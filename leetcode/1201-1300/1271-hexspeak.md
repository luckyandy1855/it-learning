# 1271. Hexspeak

---
编号: 1271
题目: Hexspeak
难度: 简单
标签: [数学, 字符串]
来源链接: https://leetcode.com/problems/hexspeak/
---

## 题目描述

你有一个十进制数字，请按照此规则将它变成「十六进制魔术数字」：首先将它变成字母大写的十六进制字符串，然后将所有的数字 `0` 变成字母 `O` ，将数字 `1`  变成字母 `I` 。

如果一个数字在转换后只包含 `{"A", "B", "C", "D", "E", "F", "I", "O"}` ，那么我们就认为这个转换是有效的。

给你一个字符串 `num` ，它表示一个十进制数 `N`，如果它的十六进制魔术数字转换是有效的，请返回转换后的结果，否则返回 `"ERROR"` 。

**示例 1：**

```text
输入：num = "257"
输出："IOI"
解释：257 的十六进制表示是 101 。
```

**示例 2：**

```text
输入：num = "3"
输出："ERROR"
```

**提示：**

- `1 <= N <= 10^12`

- 给定字符串不会有前导 0 。

- 结果中的所有字母都应该是大写字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

将数字转换为十六进制字符串，然后遍历字符串，将数字 $0$ 转换为字母 $O$，将数字 $1$ 转换为字母 $I$，最后判断转换后的字符串是否合法。

时间复杂度 $O(\log n)$，其中 $n$ 为 $num$ 所表示的十进制数字的大小。

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
// Hexspeak：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func toHexspeak(num string) string {
	x, _ := strconv.Atoi(num)
	t := strings.ToUpper(fmt.Sprintf("%x", x))
	t = strings.ReplaceAll(t, "0", "O")
	t = strings.ReplaceAll(t, "1", "I")
	for _, c := range t {
		if c >= '2' && c <= '9' {
			return "ERROR"
		}
	}
	return t
}
```

### Java

```java
// Hexspeak：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static final Set<Character> S = Set.of('A', 'B', 'C', 'D', 'E', 'F', 'I', 'O');

    public String toHexspeak(String num) {
        String t
            = Long.toHexString(Long.valueOf(num)).toUpperCase().replace("0", "O").replace("1", "I");
        for (char c : t.toCharArray()) {
            if (!S.contains(c)) {
                return "ERROR";
            }
        }
        return t;
    }
}
```

### Python

```python
# Hexspeak：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def toHexspeak(self, num: str) -> str:
        s = set('ABCDEFIO')
        t = hex(int(num))[2:].upper().replace('0', 'O').replace('1', 'I')
        return t if all(c in s for c in t) else 'ERROR'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

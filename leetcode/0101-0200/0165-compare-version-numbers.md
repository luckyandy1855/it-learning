# 0165. Compare Version Numbers

---
编号: 165
题目: Compare Version Numbers
难度: 中等
标签: [双指针, 字符串]
来源链接: https://leetcode.com/problems/compare-version-numbers/
---

## 题目描述

给你两个 **版本号字符串** `version1` 和 `version2` ，请你比较它们。版本号由被点 `'.'` 分开的修订号组成。**修订号的值** 是它 **转换为整数** 并忽略前导零。

比较版本号时，请按 **从左到右的顺序** 依次比较它们的修订号。如果其中一个版本字符串的修订号较少，则将缺失的修订号视为 `0`。

返回规则如下：

	- 如果 `*version1 * *version2*` 返回 `1`，

	- 除此之外返回 `0`。

示例 1：

**输入：**version1 = "1.2", version2 = "1.10"

**输出：**-1

**解释：**

version1 的第二个修订号为 "2"，version2 的第二个修订号为 "10"：2

示例 2：

**输入：**version1 = "1.01", version2 = "1.001"

**输出：**0

**解释：**

忽略前导零，"01" 和 "001" 都代表相同的整数 "1"。

示例 3：

**输入：**version1 = "1.0", version2 = "1.0.0.0"

**输出：**0

**解释：**

version1 有更少的修订号，每个缺失的修订号按 "0" 处理。

**提示：**

	- `1 <= version1.length, version2.length <= 500`

	- `version1` 和 `version2` 仅包含数字和 `'.'`

	- `version1` 和 `version2` 都是 **有效版本号**

	- `version1` 和 `version2` 的所有修订号都可以存储在 **32 位整数** 中

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「双指针, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

同时遍历两个字符串，用两个指针 $i$ 和 $j$ 分别指向两个字符串的当前位置，初始时 $i = j = 0$。

每次取出两个字符串中对应的修订号，记为 $a$ 和 $b$，比较 $a$ 和 $b$ 的大小，如果 $a \lt b$，则返回 $-1$；如果 $a \gt b$，则返回 $1$；如果 $a = b$，则继续比较下一对修订号。

时间复杂度 $O(\max(m, n))$，空间复杂度 $O(1)$。其中 $m$ 和 $n$ 分别是两个字符串的长度。

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
// Compare Version Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func compareVersion(version1 string, version2 string) int {
	m, n := len(version1), len(version2)
	for i, j := 0, 0; i < m || j < n; i, j = i+1, j+1 {
		var a, b int
		for i < m && version1[i] != '.' {
			a = a*10 + int(version1[i]-'0')
			i++
		}
		for j < n && version2[j] != '.' {
			b = b*10 + int(version2[j]-'0')
			j++
		}
		if a < b {
			return -1
		}
		if a > b {
			return 1
		}
	}
	return 0
}
```

### Java

```java
// Compare Version Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int compareVersion(String version1, String version2) {
        int m = version1.length(), n = version2.length();
        for (int i = 0, j = 0; i < m || j < n; ++i, ++j) {
            int a = 0, b = 0;
            while (i < m && version1.charAt(i) != '.') {
                a = a * 10 + (version1.charAt(i++) - '0');
            }
            while (j < n && version2.charAt(j) != '.') {
                b = b * 10 + (version2.charAt(j++) - '0');
            }
            if (a != b) {
                return a < b ? -1 : 1;
            }
        }
        return 0;
    }
}
```

### Python

```python
# Compare Version Numbers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        m, n = len(version1), len(version2)
        i = j = 0
        while i < m or j < n:
            a = b = 0
            while i < m and version1[i] != '.':
                a = a * 10 + int(version1[i])
                i += 1
            while j < n and version2[j] != '.':
                b = b * 10 + int(version2[j])
                j += 1
            if a != b:
                return -1 if a < b else 1
            i, j = i + 1, j + 1
        return 0
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

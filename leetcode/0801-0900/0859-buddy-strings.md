# 0859. Buddy Strings

---
编号: 859
题目: Buddy Strings
难度: 简单
标签: [哈希表, 字符串]
来源链接: https://leetcode.com/problems/buddy-strings/
---

## 题目描述

给你两个字符串 `s` 和 `goal` ，只要我们可以通过交换 `s` 中的两个字母得到与 `goal` 相等的结果，就返回 `true` ；否则返回 `false` 。

交换字母的定义是：取两个下标 `i` 和 `j` （下标从 `0` 开始）且满足 `i != j` ，接着交换 `s[i]` 和 `s[j]` 处的字符。

- 例如，在 `"abcd"` 中交换下标 `0` 和下标 `2` 的元素可以生成 `"cbad"` 。

**示例 1：**

```text
输入：s = "ab", goal = "ba"
输出：true
解释：你可以交换 s[0] = 'a' 和 s[1] = 'b' 生成 "ba"，此时 s 和 goal 相等。
```

**示例 2：**

```text
输入：s = "ab", goal = "ab"
输出：false
解释：你只能交换 s[0] = 'a' 和 s[1] = 'b' 生成 "ba"，此时 s 和 goal 不相等。
```

**示例 3：**

```text
输入：s = "aa", goal = "aa"
输出：true
解释：你可以交换 s[0] = 'a' 和 s[1] = 'a' 生成 "aa"，此时 s 和 goal 相等。
```

**提示：**

- `1 <= s.length, goal.length <= 2 * 10^4`

- `s` 和 `goal` 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

首先，先理解亲密字符串的意思：

- 若两个字符串的长度或字符出现的频数不等，一定不是亲密字符串；
- 若两个字符串对应位置不相等的字符数量为 2，或者数量为 0 并且字符串存在两个相同字符，则是亲密字符串。

因此，我们先判断两个字符串长度，若不等，直接返回 `false`。

接着，统计两个字符串的字符频数，记为 `cnt1` 和 `cnt2`，若 `cnt1` 不等于 `cnt2`，直接返回 `false`。

然后枚举两个字符串，统计对应位置不相等的字符数量，若为 2，则返回 `true`；若为 0，且字符串存在两个相同字符，则返回 `true`。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 是字符串 `s` 或 `goal` 的长度；而 $C$ 为字符集大小。

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
// Buddy Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func buddyStrings(s string, goal string) bool {
	m, n := len(s), len(goal)
	if m != n {
		return false
	}
	diff := 0
	cnt1 := make([]int, 26)
	cnt2 := make([]int, 26)
	for i := 0; i < n; i++ {
		cnt1[s[i]-'a']++
		cnt2[goal[i]-'a']++
		if s[i] != goal[i] {
			diff++
		}
	}
	f := false
	for i := 0; i < 26; i++ {
		if cnt1[i] != cnt2[i] {
			return false
		}
		if cnt1[i] > 1 {
			f = true
		}
	}
	return diff == 2 || (diff == 0 && f)
}
```

### Java

```java
// Buddy Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean buddyStrings(String s, String goal) {
        int m = s.length(), n = goal.length();
        if (m != n) {
            return false;
        }
        int diff = 0;
        int[] cnt1 = new int[26];
        int[] cnt2 = new int[26];
        for (int i = 0; i < n; ++i) {
            int a = s.charAt(i), b = goal.charAt(i);
            ++cnt1[a - 'a'];
            ++cnt2[b - 'a'];
            if (a != b) {
                ++diff;
            }
        }
        boolean f = false;
        for (int i = 0; i < 26; ++i) {
            if (cnt1[i] != cnt2[i]) {
                return false;
            }
            if (cnt1[i] > 1) {
                f = true;
            }
        }
        return diff == 2 || (diff == 0 && f);
    }
}
```

### Python

```python
# Buddy Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def buddyStrings(self, s: str, goal: str) -> bool:
        m, n = len(s), len(goal)
        if m != n:
            return False
        cnt1, cnt2 = Counter(s), Counter(goal)
        if cnt1 != cnt2:
            return False
        diff = sum(s[i] != goal[i] for i in range(n))
        return diff == 2 or (diff == 0 and any(v > 1 for v in cnt1.values()))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

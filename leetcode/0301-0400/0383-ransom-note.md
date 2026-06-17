# 0383. Ransom Note

---
编号: 383
题目: Ransom Note
难度: 简单
标签: [哈希表, 字符串, 计数]
来源链接: https://leetcode.com/problems/ransom-note/
---

## 题目描述

给你两个字符串：`ransomNote` 和 `magazine` ，判断 `ransomNote` 能不能由 `magazine` 里面的字符构成。

如果可以，返回 `true` ；否则返回 `false` 。

`magazine` 中的每个字符只能在 `ransomNote` 中使用一次。

**示例 1：**

```text
输入：ransomNote = "a", magazine = "b"
输出：false
```

**示例 2：**

```text
输入：ransomNote = "aa", magazine = "ab"
输出：false
```

**示例 3：**

```text
输入：ransomNote = "aa", magazine = "aab"
输出：true
```

**提示：**

	- `1 <= ransomNote.length, magazine.length <= 10^5`

	- `ransomNote` 和 `magazine` 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个哈希表或长度为 $26$ 的数组 $cnt$ 记录字符串 `magazine` 中所有字符出现的次数。然后遍历字符串 `ransomNote`，对于其中的每个字符 $c$，我们将其从 $cnt$ 的次数减 $1$，如果减 $1$ 之后的次数小于 $0$，说明 $c$ 在 `magazine` 中出现的次数不够，因此无法构成 `ransomNote`，返回 $false$ 即可。

否则，遍历结束后，说明 `ransomNote` 中的每个字符都可以在 `magazine` 中找到对应的字符，因此返回 $true$。

时间复杂度 $O(m + n)$，空间复杂度 $O(C)$。其中 $m$ 和 $n$ 分别为字符串 `ransomNote` 和 `magazine` 的长度；而 $C$ 为字符集的大小，本题中 $C = 26$。

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
// Ransom Note：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canConstruct(ransomNote string, magazine string) bool {
	cnt := [26]int{}
	for _, c := range magazine {
		cnt[c-'a']++
	}
	for _, c := range ransomNote {
		cnt[c-'a']--
		if cnt[c-'a'] < 0 {
			return false
		}
	}
	return true
}
```

### Java

```java
// Ransom Note：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] cnt = new int[26];
        for (int i = 0; i < magazine.length(); ++i) {
            ++cnt[magazine.charAt(i) - 'a'];
        }
        for (int i = 0; i < ransomNote.length(); ++i) {
            if (--cnt[ransomNote.charAt(i) - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Ransom Note：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        cnt = Counter(magazine)
        for c in ransomNote:
            cnt[c] -= 1
            if cnt[c] < 0:
                return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

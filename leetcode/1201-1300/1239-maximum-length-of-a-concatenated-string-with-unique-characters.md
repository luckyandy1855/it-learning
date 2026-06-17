# 1239. Maximum Length of a Concatenated String with Unique Characters

---
编号: 1239
题目: Maximum Length of a Concatenated String with Unique Characters
难度: 中等
标签: [位运算, 数组, 字符串, 回溯]
来源链接: https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/
---

## 题目描述

给定一个字符串数组 `arr`，字符串 `s` 是将 `arr` 的含有 **不同字母** 的 **子序列** 字符串 **连接** 所得的字符串。

请返回所有可行解 `s` 中最长长度。

**子序列** 是一种可以从另一个数组派生而来的数组，通过删除某些元素或不删除元素而不改变其余元素的顺序。

**示例 1：**

```text
输入：arr = ["un","iq","ue"]
输出：4
解释：所有可能的串联组合是：
- ""
- "un"
- "iq"
- "ue"
- "uniq" ("un" + "iq")
- "ique" ("iq" + "ue")
最大长度为 4。
```

**示例 2：**

```text
输入：arr = ["cha","r","act","ers"]
输出：6
解释：可能的解答有 "chaers" 和 "acters"。
```

**示例 3：**

```text
输入：arr = ["abcdefghijklmnopqrstuvwxyz"]
输出：26
```

**提示：**

- `1 <= arr.length <= 16`

- `1 <= arr[i].length <= 26`

- `arr[i]` 中只含有小写英文字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于题目要求子序列的字符不能重复，字符都是小写字母，因此，我们可以用一个长度为 $26$ 的二进制整数来表示一个子序列，其中第 $i$ 位为 $1$ 表示子序列中含有滴 $i$ 个字符，为 $0$ 表示不含有第 $i$ 个字符。

我们可以用一个数组 $s$ 来存储所有满足条件的子序列的状态，初始时 $s$ 中只有一个元素 $0$。

然后我们遍历数组 $\textit{arr}$，对于每个字符串 $t$，我们用一个整数 $x$ 来表示 $t$ 的状态，然后我们遍历数组 $s$，对于每个状态 $y$，如果 $x$ 和 $y$ 之间没有相同的字符，那么我们将 $x$ 和 $y$ 的并集加入到 $s$ 中，并更新答案。

最后我们返回答案即可。

时间复杂度 $O(2^n + L)$，空间复杂度 $O(2^n)$，其中 $n$ 是字符串数组的长度，而 $L$ 是字符串数组中所有字符串的长度之和。

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
// Maximum Length of a Concatenated String with Unique Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxLength(arr []string) (ans int) {
	s := []int{0}
	for _, t := range arr {
		x := 0
		for _, c := range t {
			b := int(c - 'a')
			if (x>>b)&1 == 1 {
				x = 0
				break
			}
			x |= 1 << b
		}
		if x > 0 {
			for i := len(s) - 1; i >= 0; i-- {
				y := s[i]
				if (x & y) == 0 {
					s = append(s, x|y)
					ans = max(ans, bits.OnesCount(uint(x|y)))
				}
			}
		}
	}
	return ans
}
```

### Java

```java
// Maximum Length of a Concatenated String with Unique Characters：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxLength(List<String> arr) {
        List<Integer> s = new ArrayList<>();
        s.add(0);
        int ans = 0;
        for (var t : arr) {
            int x = 0;
            for (char c : t.toCharArray()) {
                int b = c - 'a';
                if ((x >> b & 1) == 1) {
                    x = 0;
                    break;
                }
                x |= 1 << b;
            }
            if (x > 0) {
                for (int i = s.size() - 1; i >= 0; --i) {
                    int y = s.get(i);
                    if ((x & y) == 0) {
                        s.add(x | y);
                        ans = Math.max(ans, Integer.bitCount(x | y));
                    }
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Length of a Concatenated String with Unique Characters：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxLength(self, arr: List[str]) -> int:
        s = [0]
        for t in arr:
            x = 0
            for b in map(lambda c: ord(c) - 97, t):
                if x >> b & 1:
                    x = 0
                    break
                x |= 1 << b
            if x:
                s.extend((x | y) for y in s if (x & y) == 0)
        return max(x.bit_count() for x in s)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1147. Longest Chunked Palindrome Decomposition

---
编号: 1147
题目: Longest Chunked Palindrome Decomposition
难度: 困难
标签: [贪心, 双指针, 字符串, 动态规划, 哈希函数, 滚动哈希]
来源链接: https://leetcode.com/problems/longest-chunked-palindrome-decomposition/
---

## 题目描述

你会得到一个字符串 `text` 。你应该把它分成 `k` 个子字符串 `(subtext1, subtext2，…， subtextk)` ，要求满足:

- `subtexti` 是 **非空 **字符串

- 所有子字符串的连接等于 `text` ( 即`subtext1 + subtext2 + ... + subtextk == text` )

- 对于所有 i 的有效值( 即 `1 i == subtextk - i + 1` 均成立

返回`k`可能最大值。

**示例 1：**

```text
输入：text = "ghiabcdefhelloadamhelloabcdefghi"
输出：7
解释：我们可以把字符串拆分成 "(ghi)(abcdef)(hello)(adam)(hello)(abcdef)(ghi)"。
```

**示例 2：**

```text
输入：text = "merchant"
输出：1
解释：我们可以把字符串拆分成 "(merchant)"。
```

**示例 3：**

```text
输入：text = "antaprezatepzapreanta"
输出：11
解释：我们可以把字符串拆分成 "(a)(nt)(a)(pre)(za)(tep)(za)(pre)(a)(nt)(a)"。
```

**提示：**

- `1 <= text.length <= 1000`

- `text` 仅由小写英文字符组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 双指针, 字符串, 动态规划, 哈希函数, 滚动哈希」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以从字符串的两端开始，寻找长度最短的、相同且不重叠的前后缀：

- 如果找不到这样的前后缀，那么整个字符串作为一个段式回文，答案加 $1$；
- 如果找到了这样的前后缀，那么这个前后缀作为一个段式回文，答案加 $2$，然后继续寻找剩下的字符串的前后缀。

以上贪心策略的证明如下：

假设有一个前后缀 $A_1$ 和 $A_2$ 满足条件，又有一个前后缀 $B_1$ 和 $B_4$ 满足条件，由于 $A_1 = A_2$，且 $B_1=B_4$，那么有 $B_3=B_1=B_4=B_2$，并且 $C_1 = C_2$，因此，如果我们贪心地将 $B_1$ 和 $B_4$ 分割出来，那么剩下的 $C_1$ 和 $C_2$，以及 $B_2$ 和 $B_3$ 也能成功分割。因此我们应该贪心地选择长度最短的相同前后缀进行分割，这样剩余的字符串中，将可能分割出更多的段式回文串。

<p><img alt="" src="https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1100-1199/1147.Longest%20Chunked%20Palindrome%20Decomposition/images/demo.png" style="width: 300px;" /></p>

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$ 或 $O(1)$。其中 $n$ 为字符串的长度。

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
// Longest Chunked Palindrome Decomposition：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestDecomposition(text string) (ans int) {
	for i, j := 0, len(text)-1; i <= j; {
		ok := false
		for k := 1; i+k-1 < j-k+1; k++ {
			if text[i:i+k] == text[j-k+1:j+1] {
				ans += 2
				i += k
				j -= k
				ok = true
				break
			}
		}
		if !ok {
			ans++
			break
		}
	}
	return
}
```

### Java

```java
// Longest Chunked Palindrome Decomposition：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestDecomposition(String text) {
        int ans = 0;
        for (int i = 0, j = text.length() - 1; i <= j;) {
            boolean ok = false;
            for (int k = 1; i + k - 1 < j - k + 1; ++k) {
                if (check(text, i, j - k + 1, k)) {
                    ans += 2;
                    i += k;
                    j -= k;
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                ++ans;
                break;
            }
        }
        return ans;
    }

    private boolean check(String s, int i, int j, int k) {
        while (k-- > 0) {
            if (s.charAt(i++) != s.charAt(j++)) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Longest Chunked Palindrome Decomposition：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestDecomposition(self, text: str) -> int:
        ans = 0
        i, j = 0, len(text) - 1
        while i <= j:
            k = 1
            ok = False
            while i + k - 1 < j - k + 1:
                if text[i : i + k] == text[j - k + 1 : j + 1]:
                    ans += 2
                    i += k
                    j -= k
                    ok = True
                    break
                k += 1
            if not ok:
                ans += 1
                break
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

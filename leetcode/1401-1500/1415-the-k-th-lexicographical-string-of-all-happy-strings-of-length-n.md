# 1415. The k-th Lexicographical String of All Happy Strings of Length n

---
编号: 1415
题目: The k-th Lexicographical String of All Happy Strings of Length n
难度: 中等
标签: [字符串, 回溯]
来源链接: https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/
---

## 题目描述

一个 「开心字符串」定义为：

- 仅包含小写字母 `[&#39;a&#39;, &#39;b&#39;, &#39;c&#39;]`.

- 对所有在 `1` 到 `s.length - 1` 之间的 `i` ，满足 `s[i] != s[i + 1]` （字符串的下标从 1 开始）。

比方说，字符串 **"abc"**，**"ac"，"b"** 和 **"abcbabcbcb"** 都是开心字符串，但是 **"aa"**，**"baa"** 和 **"ababbc"** 都不是开心字符串。

给你两个整数 `n` 和 `k` ，你需要将长度为 `n` 的所有开心字符串按字典序排序。

请你返回排序后的第 k 个开心字符串，如果长度为 `n` 的开心字符串少于 `k` 个，那么请你返回 **空字符串** 。

**示例 1：**

```text
输入：n = 1, k = 3
输出："c"
解释：列表 ["a", "b", "c"] 包含了所有长度为 1 的开心字符串。按照字典序排序后第三个字符串为 "c" 。
```

**示例 2：**

```text
输入：n = 1, k = 4
输出：""
解释：长度为 1 的开心字符串只有 3 个。
```

**示例 3：**

```text
输入：n = 3, k = 9
输出："cab"
解释：长度为 3 的开心字符串总共有 12 个 ["aba", "abc", "aca", "acb", "bab", "bac", "bca", "bcb", "cab", "cac", "cba", "cbc"] 。第 9 个字符串为 "cab"
```

**示例 4：**

```text
输入：n = 2, k = 7
输出：""
```

**示例 5：**

```text
输入：n = 10, k = 100
输出："abacbabacb"
```

**提示：**

- `1 <= n <= 10`

- `1 <= k <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个字符串 $\textit{s}$ 来记录当前的字符串，初始时为空字符串。然后，我们设计一个函数 $\text{dfs}$，用来生成所有长度为 $n$ 的开心字符串。

函数 $\text{dfs}$ 的具体实现如下：

1. 如果当前字符串的长度等于 $n$，则将当前字符串加入答案数组 $\textit{ans}$ 中，然后返回；
2. 如果答案数组的长度大于等于 $k$，则直接返回；
3. 否则，我们遍历字符集 $\{a, b, c\}$，对于每个字符 $c$，如果当前字符串为空，或者当前字符串的最后一个字符不等于 $c$，则将字符 $c$ 加入当前字符串，然后递归调用 $\text{dfs}$，递归结束后，将当前字符串的最后一个字符删除。

最后，我们判断答案数组的长度是否小于 $k$，如果是，则返回空字符串，否则返回答案数组的第 $k-1$ 个元素。

时间复杂度 $O(n \times 2^n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串长度。

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
// The k-th Lexicographical String of All Happy Strings of Length n：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getHappyString(n int, k int) string {
    ans := []string{}
    var s []byte

    var dfs func()
    dfs = func() {
        if len(s) == n {
            ans = append(ans, string(s))
            return
        }
        if len(ans) >= k {
            return
        }
        for c := byte('a'); c <= 'c'; c++ {
            if len(s) == 0 || s[len(s)-1] != c {
                s = append(s, c)
                dfs()
                s = s[:len(s)-1]
            }
        }
    }

    dfs()
    if len(ans) < k {
        return ""
    }
    return ans[k-1]
}
```

### Java

```java
// The k-th Lexicographical String of All Happy Strings of Length n：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<String> ans = new ArrayList<>();
    private StringBuilder s = new StringBuilder();
    private int n, k;

    public String getHappyString(int n, int k) {
        this.n = n;
        this.k = k;
        dfs();
        return ans.size() < k ? "" : ans.get(k - 1);
    }

    private void dfs() {
        if (s.length() == n) {
            ans.add(s.toString());
            return;
        }
        if (ans.size() >= k) {
            return;
        }
        for (char c : "abc".toCharArray()) {
            if (s.isEmpty() || s.charAt(s.length() - 1) != c) {
                s.append(c);
                dfs();
                s.deleteCharAt(s.length() - 1);
            }
        }
    }
}
```

### Python

```python
# The k-th Lexicographical String of All Happy Strings of Length n：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getHappyString(self, n: int, k: int) -> str:
        def dfs():
            if len(s) == n:
                ans.append("".join(s))
                return
            if len(ans) >= k:
                return
            for c in "abc":
                if not s or s[-1] != c:
                    s.append(c)
                    dfs()
                    s.pop()

        ans = []
        s = []
        dfs()
        return "" if len(ans) < k else ans[k - 1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

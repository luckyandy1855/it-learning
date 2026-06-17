# 0691. Stickers to Spell Word

---
编号: 691
题目: Stickers to Spell Word
难度: 困难
标签: [位运算, 记忆化, 数组, 哈希表, 字符串, 动态规划, 回溯, 位掩码]
来源链接: https://leetcode.com/problems/stickers-to-spell-word/
---

## 题目描述

我们有 `n` 种不同的贴纸。每个贴纸上都有一个小写的英文单词。

您想要拼写出给定的字符串 `target` ，方法是从收集的贴纸中切割单个字母并重新排列它们。如果你愿意，你可以多次使用每个贴纸，每个贴纸的数量是无限的。

返回你需要拼出 `target` 的最小贴纸数量。如果任务不可能，则返回 `-1` 。

**注意：**在所有的测试用例中，所有的单词都是从 `1000` 个最常见的美国英语单词中随机选择的，并且 `target` 被选择为两个随机单词的连接。

**示例 1：**

```text
输入： stickers = ["with","example","science"], target = "thehat"
输出：3
解释：
我们可以使用 2 个 "with" 贴纸，和 1 个 "example" 贴纸。
把贴纸上的字母剪下来并重新排列后，就可以形成目标 “thehat“ 了。
此外，这是形成目标字符串所需的最小贴纸数量。
```

**示例 2:**

```text
输入：stickers = ["notice","possible"], target = "basicbasic"
输出：-1
解释：我们不能通过剪切给定贴纸的字母来形成目标“basicbasic”。
```

**提示:**

- `n == stickers.length`

- `1 <= n <= 50`

- `1 <= stickers[i].length <= 10`

- `1 <= target.length <= 15`

- `stickers[i]` 和 `target` 由小写英文单词组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 记忆化, 数组, 哈希表, 字符串, 动态规划, 回溯, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，字符串 $\textit{target}$ 的长度不超过 $15$，我们可以使用一个长度为 $15$ 的二进制数来表示 $\textit{target}$ 的每个字符是否被拼出，如果第 $i$ 位为 $1$，表示 $\textit{target}$ 的第 $i$ 个字符已经被拼出，否则表示未被拼出。

我们定义一个初始状态 $0$，表示所有字符都未被拼出，然后我们使用广度优先搜索的方法，从初始状态开始，每次搜索时，我们枚举所有的贴纸，对于每一张贴纸，我们尝试拼出 $\textit{target}$ 的每一个字符，如果拼出了某个字符，我们就将对应的二进制数的第 $i$ 位设置为 $1$，表示该字符已经被拼出，然后我们继续搜索，直到我们拼出了 $\textit{target}$ 的所有字符。

时间复杂度 $O(2^n \times m \times (l + n))$，空间复杂度 $O(2^n)$。其中 $n$ 是字符串 $\textit{target}$ 的长度，而 $m$ 和 $l$ 分别是贴纸的数量和贴纸的平均长度。

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
// Stickers to Spell Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minStickers(stickers []string, target string) (ans int) {
	n := len(target)
	q := []int{0}
	vis := make([]bool, 1<<n)
	vis[0] = true
	for ; len(q) > 0; ans++ {
		for m := len(q); m > 0; m-- {
			cur := q[0]
			q = q[1:]
			if cur == 1<<n-1 {
				return
			}
			for _, s := range stickers {
				cnt := [26]int{}
				for _, c := range s {
					cnt[c-'a']++
				}
				nxt := cur
				for i, c := range target {
					if cur>>i&1 == 0 && cnt[c-'a'] > 0 {
						nxt |= 1 << i
						cnt[c-'a']--
					}
				}
				if !vis[nxt] {
					vis[nxt] = true
					q = append(q, nxt)
				}
			}
		}
	}
	return -1
}
```

### Java

```java
// Stickers to Spell Word：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minStickers(String[] stickers, String target) {
        int n = target.length();
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(0);
        boolean[] vis = new boolean[1 << n];
        vis[0] = true;
        for (int ans = 0; !q.isEmpty(); ++ans) {
            for (int m = q.size(); m > 0; --m) {
                int cur = q.poll();
                if (cur == (1 << n) - 1) {
                    return ans;
                }
                for (String s : stickers) {
                    int[] cnt = new int[26];
                    int nxt = cur;
                    for (char c : s.toCharArray()) {
                        ++cnt[c - 'a'];
                    }
                    for (int i = 0; i < n; ++i) {
                        int j = target.charAt(i) - 'a';
                        if ((cur >> i & 1) == 0 && cnt[j] > 0) {
                            --cnt[j];
                            nxt |= 1 << i;
                        }
                    }
                    if (!vis[nxt]) {
                        vis[nxt] = true;
                        q.offer(nxt);
                    }
                }
            }
        }
        return -1;
    }
}
```

### Python

```python
# Stickers to Spell Word：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minStickers(self, stickers: List[str], target: str) -> int:
        n = len(target)
        q = deque([0])
        vis = [False] * (1 << n)
        vis[0] = True
        ans = 0
        while q:
            for _ in range(len(q)):
                cur = q.popleft()
                if cur == (1 << n) - 1:
                    return ans
                for s in stickers:
                    cnt = Counter(s)
                    nxt = cur
                    for i, c in enumerate(target):
                        if (cur >> i & 1) == 0 and cnt[c] > 0:
                            cnt[c] -= 1
                            nxt |= 1 << i
                    if not vis[nxt]:
                        vis[nxt] = True
                        q.append(nxt)
            ans += 1
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

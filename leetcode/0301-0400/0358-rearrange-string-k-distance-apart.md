# 0358. Rearrange String k Distance Apart

---
编号: 358
题目: Rearrange String k Distance Apart
难度: 困难
标签: [贪心, 哈希表, 字符串, 计数, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/rearrange-string-k-distance-apart/
---

## 题目描述

给你一个非空的字符串 `s` 和一个整数 `k` ，你要将这个字符串 `s` 中的字母进行重新排列，使得重排后的字符串中相同字母的位置间隔距离 **至少** 为 `k` 。如果无法做到，请返回一个空字符串 `""`。

**示例 1：**

```text
输入: s = "aabbcc", k = 3
输出: "abcabc"
解释: 相同的字母在新的字符串中间隔至少 3 个单位距离。
```

**示例 2:**

```text
输入: s = "aaabc", k = 3
输出: ""
解释: 没有办法找到可能的重排结果。
```

**示例 3:**

```text
输入: s = "aaadbbcc", k = 2
输出: "abacabcd"
解释: 相同的字母在新的字符串中间隔至少 2 个单位距离。
```

**提示：**

	- `1 <= s.length <= 3 * 10^5`

	- `s` 仅由小写英文字母组成

	- `0 <= k <= s.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 哈希表, 字符串, 计数, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表或数组 $\textit{cnt}$ 来统计字符串中每个字母出现的次数，然后用一个大根堆 $\textit{pq}$ 来存储每个字母及其出现次数。堆中的每个元素是一个二元组 $(v, c)$，其中 $v$ 和 $c$ 分别表示字母出现的次数和字母本身。

在重排字符串时，我们每次从堆顶弹出一个元素 $(v, c)$，将字母 $c$ 添加到结果字符串中，并将 $(v-1, c)$ 放入一个队列 $\textit{q}$ 中。当队列 $\textit{q}$ 的长度达到 $k$ 及以上时，弹出队首元素，若此时 $v$ 大于 $0$，则将队首元素重新放入堆中。重复该过程，直到堆为空。

最后，我们判断结果字符串的长度是否与原字符串相等，若相等则返回结果字符串，否则返回空串。

时间复杂度为 $O(n \log n)$，其中 $n$ 是字符串的长度。空间复杂度 $O(|\Sigma|)$，其中 $|\Sigma|$ 是字符集的大小，本题中 $|\Sigma| = 26$。

相似题目：

- [767. 重构字符串](https://github.com/doocs/leetcode/blob/main/solution/0700-0799/0767.Reorganize%20String/README.md)

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
// Rearrange String k Distance Apart：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func rearrangeString(s string, k int) string {
	cnt := [26]int{}
	for _, c := range s {
		cnt[c-'a']++
	}
	pq := priorityqueue.NewWith(func(a, b any) int {
		x := a.([2]int)
		y := b.([2]int)
		return y[0] - x[0]
	})

	for i := 0; i < 26; i++ {
		if cnt[i] > 0 {
			pq.Enqueue([2]int{cnt[i], i})
		}
	}

	var q [][2]int
	var ans strings.Builder

	for pq.Size() > 0 {
		p, _ := pq.Dequeue()
		pair := p.([2]int)
		pair[0]--
		ans.WriteByte(byte('a' + pair[1]))
		q = append(q, pair)

		if len(q) >= k {
			front := q[0]
			q = q[1:]
			if front[0] > 0 {
				pq.Enqueue(front)
			}
		}
	}

	if ans.Len() < len(s) {
		return ""
	}
	return ans.String()
}
```

### Java

```java
// Rearrange String k Distance Apart：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String rearrangeString(String s, int k) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) {
            ++cnt[c - 'a'];
        }
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (int i = 0; i < cnt.length; ++i) {
            if (cnt[i] > 0) {
                pq.offer(new int[] {cnt[i], i});
            }
        }
        Deque<int[]> q = new ArrayDeque<>();
        StringBuilder ans = new StringBuilder();
        while (!pq.isEmpty()) {
            var p = pq.poll();
            p[0] -= 1;
            ans.append((char) ('a' + p[1]));
            q.offerLast(p);
            if (q.size() >= k) {
                p = q.pollFirst();
                if (p[0] > 0) {
                    pq.offer(p);
                }
            }
        }
        return ans.length() < s.length() ? "" : ans.toString();
    }
}
```

### Python

```python
# Rearrange String k Distance Apart：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def rearrangeString(self, s: str, k: int) -> str:
        cnt = Counter(s)
        pq = [(-v, c) for c, v in cnt.items()]
        heapify(pq)
        q = deque()
        ans = []
        while pq:
            v, c = heappop(pq)
            ans.append(c)
            q.append((v + 1, c))
            if len(q) >= k:
                e = q.popleft()
                if e[0]:
                    heappush(pq, e)
        return "" if len(ans) < len(s) else "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0936. Stamping The Sequence

---
编号: 936
题目: Stamping The Sequence
难度: 困难
标签: [栈, 贪心, 队列, 字符串]
来源链接: https://leetcode.com/problems/stamping-the-sequence/
---

## 题目描述

你想要用**小写字母**组成一个目标字符串 `target`。

开始的时候，序列由 `target.length` 个 `&#39;?&#39;` 记号组成。而你有一个小写字母印章 `stamp`。

在每个回合，你可以将印章放在序列上，并将序列中的每个字母替换为印章上的相应字母。你最多可以进行 `10 * target.length`  个回合。

举个例子，如果初始序列为 "?????"，而你的印章 `stamp` 是 `"abc"`，那么在第一回合，你可以得到 "abc??"、"?abc?"、"??abc"。（请注意，印章必须完全包含在序列的边界内才能盖下去。）

如果可以印出序列，那么返回一个数组，该数组由每个回合中被印下的最左边字母的索引组成。如果不能印出序列，就返回一个空数组。

例如，如果序列是 "ababc"，印章是 `"abc"`，那么我们就可以返回与操作 "?????" -> "abc??" -> "ababc" 相对应的答案 `[0, 2]`；

另外，如果可以印出序列，那么需要保证可以在 `10 * target.length` 个回合内完成。任何超过此数字的答案将不被接受。

**示例 1：**

```text
输入：stamp = "abc", target = "ababc"
输出：[0,2]
（[1,0,2] 以及其他一些可能的结果也将作为答案被接受）
```

**示例 2：**

```text
输入：stamp = "abca", target = "aabcaca"
输出：[3,0,1]
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 贪心, 队列, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

如果我们正向地对序列进行操作，那么处理起来会比较麻烦，因为后续的操作会把前面的操作覆盖掉。我们不妨考虑逆向地对序列进行操作，即从目标字符串 $target$ 开始，考虑将 $target$ 变成 $?????$ 的过程。

我们不妨记字母印章的长度为 $m$，目标字符串的长度为 $n$。如果我们拿着字母印章在目标字符串上操作，那么一共有 $n-m+1$ 个开始位置可以放置字母印章。我们可以枚举这 $n-m+1$ 个开始位置，利用类似拓扑排序的方法，逆向地进行操作。

首先，我们明确，每个开始位置都对应着一个长度为 $m$ 的窗口。

接下来，我们定义以下数据结构或变量，其中：

- 入度数组 $indeg$，其中 $indeg[i]$ 表示第 $i$ 个窗口中有多少位置的字符与字母印章中的字符不同，初始时，$indeg[i]=m$。若 $indeg[i]=0$，说明第 $i$ 个窗口中的字符都与字母印章中的字符相同，那么我们就可以在第 $i$ 个窗口中放置字母印章。
- 邻接表 $g$，其中 $g[i]$ 表示目标字符串 $target$ 的第 $i$ 个位置上，所有与字母印章存在不同字符的窗口的集合。
- 队列 $q$，用于存储所有入度为 $0$ 的窗口的编号。
- 数组 $vis$，用于标记目标字符串 $target$ 的每个位置是否已经被覆盖。
- 数组 $ans$，用于存储答案。

接下来，我们进行拓扑排序。在拓扑排序的每一步中，我们取出队首的窗口编号 $i$，并将 $i$ 放入答案数组 $ans$ 中。然后，我们枚举字母印章中的每个位置 $j$，如果第 $i$ 个窗口中的第 $j$ 个位置未被覆盖，那么我们就将其覆盖，并将 $indeg$ 数组中所有与第 $i$ 个窗口中的第 $j$ 个位置相同的窗口的入度减少 $1$。如果某个窗口的入度变为 $0$，那么我们就将其放入队列 $q$ 中等待下一次处理。

在拓扑排序结束后，如果目标字符串 $target$ 的每个位置都被覆盖，那么答案数组 $ans$ 中存储的就是我们要求的答案。否则，目标字符串 $target$ 无法被覆盖，我们就返回一个空数组。

时间复杂度 $O(n \times (n - m + 1))$，空间复杂度 $O(n \times (n - m + 1))$。其中 $n$ 和 $m$ 分别是目标字符串 $target$ 和字母印章的长度。

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
// Stamping The Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func movesToStamp(stamp string, target string) (ans []int) {
	m, n := len(stamp), len(target)
	indeg := make([]int, n-m+1)
	for i := range indeg {
		indeg[i] = m
	}
	g := make([][]int, n)
	q := []int{}
	for i := 0; i < n-m+1; i++ {
		for j := range stamp {
			if target[i+j] == stamp[j] {
				indeg[i]--
				if indeg[i] == 0 {
					q = append(q, i)
				}
			} else {
				g[i+j] = append(g[i+j], i)
			}
		}
	}
	vis := make([]bool, n)
	for len(q) > 0 {
		i := q[0]
		q = q[1:]
		ans = append(ans, i)
		for j := range stamp {
			if !vis[i+j] {
				vis[i+j] = true
				for _, k := range g[i+j] {
					indeg[k]--
					if indeg[k] == 0 {
						q = append(q, k)
					}
				}
			}
		}
	}
	for _, v := range vis {
		if !v {
			return []int{}
		}
	}
	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
	return
}
```

### Java

```java
// Stamping The Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] movesToStamp(String stamp, String target) {
        int m = stamp.length(), n = target.length();
        int[] indeg = new int[n - m + 1];
        Arrays.fill(indeg, m);
        List<Integer>[] g = new List[n];
        Arrays.setAll(g, i -> new ArrayList<>());
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n - m + 1; ++i) {
            for (int j = 0; j < m; ++j) {
                if (target.charAt(i + j) == stamp.charAt(j)) {
                    if (--indeg[i] == 0) {
                        q.offer(i);
                    }
                } else {
                    g[i + j].add(i);
                }
            }
        }
        List<Integer> ans = new ArrayList<>();
        boolean[] vis = new boolean[n];
        while (!q.isEmpty()) {
            int i = q.poll();
            ans.add(i);
            for (int j = 0; j < m; ++j) {
                if (!vis[i + j]) {
                    vis[i + j] = true;
                    for (int k : g[i + j]) {
                        if (--indeg[k] == 0) {
                            q.offer(k);
                        }
                    }
                }
            }
        }
        for (int i = 0; i < n; ++i) {
            if (!vis[i]) {
                return new int[0];
            }
        }
        Collections.reverse(ans);
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

### Python

```python
# Stamping The Sequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def movesToStamp(self, stamp: str, target: str) -> List[int]:
        m, n = len(stamp), len(target)
        indeg = [m] * (n - m + 1)
        q = deque()
        g = [[] for _ in range(n)]
        for i in range(n - m + 1):
            for j, c in enumerate(stamp):
                if target[i + j] == c:
                    indeg[i] -= 1
                    if indeg[i] == 0:
                        q.append(i)
                else:
                    g[i + j].append(i)
        ans = []
        vis = [False] * n
        while q:
            i = q.popleft()
            ans.append(i)
            for j in range(m):
                if not vis[i + j]:
                    vis[i + j] = True
                    for k in g[i + j]:
                        indeg[k] -= 1
                        if indeg[k] == 0:
                            q.append(k)
        return ans[::-1] if all(vis) else []
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

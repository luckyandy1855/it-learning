# 1405. Longest Happy String

---
编号: 1405
题目: Longest Happy String
难度: 中等
标签: [贪心, 字符串, 堆（优先队列）]
来源链接: https://leetcode.com/problems/longest-happy-string/
---

## 题目描述

如果字符串中不含有任何 `&#39;aaa&#39;`，`&#39;bbb&#39;` 或 `&#39;ccc&#39;` 这样的字符串作为子串，那么该字符串就是一个「快乐字符串」。

给你三个整数 `a`，`b` ，`c`，请你返回 **任意一个** 满足下列全部条件的字符串 `s`：

- `s` 是一个尽可能长的快乐字符串。

- `s` 中 **最多** 有`a` 个字母 `&#39;a&#39;`、`b` 个字母 `&#39;b&#39;`、`c` 个字母 `&#39;c&#39;` 。

- `s `中只含有 `&#39;a&#39;`、`&#39;b&#39;` 、`&#39;c&#39;` 三种字母。

如果不存在这样的字符串 `s` ，请返回一个空字符串 `""`。

**示例 1：**

```text
输入：a = 1, b = 1, c = 7
输出："ccaccbcc"
解释："ccbccacc" 也是一种正确答案。
```

**示例 2：**

```text
输入：a = 2, b = 2, c = 1
输出："aabbc"
```

**示例 3：**

```text
输入：a = 7, b = 1, c = 0
输出："aabaa"
解释：这是该测试用例的唯一正确答案。
```

**提示：**

- `0  0`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 字符串, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

贪心，优先选择剩余最多的字符，通过优先队列或排序，确保每次选到的字符都是剩余最多的（为了避免出现连续 3 个一样的字符，一些情况需要选择剩余第二多的字符）。

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
// Longest Happy String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type pair struct {
	c   byte
	num int
}

type hp []pair

func (a hp) Len() int           { return len(a) }
func (a hp) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a hp) Less(i, j int) bool { return a[i].num > a[j].num }
func (a *hp) Push(x any)        { *a = append(*a, x.(pair)) }
func (a *hp) Pop() any          { l := len(*a); t := (*a)[l-1]; *a = (*a)[:l-1]; return t }

func longestDiverseString(a int, b int, c int) string {
	var h hp
	if a > 0 {
		heap.Push(&h, pair{'a', a})
	}
	if b > 0 {
		heap.Push(&h, pair{'b', b})
	}
	if c > 0 {
		heap.Push(&h, pair{'c', c})
	}

	var ans []byte
	for len(h) > 0 {
		cur := heap.Pop(&h).(pair)
		if len(ans) >= 2 && ans[len(ans)-1] == cur.c && ans[len(ans)-2] == cur.c {
			if len(h) == 0 {
				break
			}
			next := heap.Pop(&h).(pair)
			ans = append(ans, next.c)
			if next.num > 1 {
				next.num--
				heap.Push(&h, next)
			}
			heap.Push(&h, cur)
		} else {
			ans = append(ans, cur.c)
			if cur.num > 1 {
				cur.num--
				heap.Push(&h, cur)
			}
		}
	}

	return string(ans)
}
```

### Java

```java
// Longest Happy String：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String longestDiverseString(int a, int b, int c) {
        Queue<int[]> pq = new PriorityQueue<>((x, y) -> y[1] - x[1]);
        if (a > 0) {
            pq.offer(new int[] {'a', a});
        }
        if (b > 0) {
            pq.offer(new int[] {'b', b});
        }
        if (c > 0) {
            pq.offer(new int[] {'c', c});
        }

        StringBuilder sb = new StringBuilder();
        while (pq.size() > 0) {
            int[] cur = pq.poll();
            int n = sb.length();
            if (n >= 2 && sb.codePointAt(n - 1) == cur[0] && sb.codePointAt(n - 2) == cur[0]) {
                if (pq.size() == 0) {
                    break;
                }
                int[] next = pq.poll();
                sb.append((char) next[0]);
                if (next[1] > 1) {
                    next[1]--;
                    pq.offer(next);
                }
                pq.offer(cur);
            } else {
                sb.append((char) cur[0]);
                if (cur[1] > 1) {
                    cur[1]--;
                    pq.offer(cur);
                }
            }
        }

        return sb.toString();
    }
}
```

### Python

```python
# Longest Happy String：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestDiverseString(self, a: int, b: int, c: int) -> str:
        h = []
        if a > 0:
            heappush(h, [-a, 'a'])
        if b > 0:
            heappush(h, [-b, 'b'])
        if c > 0:
            heappush(h, [-c, 'c'])

        ans = []
        while len(h) > 0:
            cur = heappop(h)
            if len(ans) >= 2 and ans[-1] == cur[1] and ans[-2] == cur[1]:
                if len(h) == 0:
                    break
                nxt = heappop(h)
                ans.append(nxt[1])
                if -nxt[0] > 1:
                    nxt[0] += 1
                    heappush(h, nxt)
                heappush(h, cur)
            else:
                ans.append(cur[1])
                if -cur[0] > 1:
                    cur[0] += 1
                    heappush(h, cur)

        return ''.join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1101. The Earliest Moment When Everyone Become Friends

---
编号: 1101
题目: The Earliest Moment When Everyone Become Friends
难度: 中等
标签: [并查集, 数组, 排序]
来源链接: https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/
---

## 题目描述

在一个社交圈子当中，有 `n` 个人。每个人都有一个从 `0` 到 `n - 1` 的唯一编号。我们有一份日志列表 `logs`，其中 `logs[i] = [timestampi, xi, yi]` 表示 `xi` 和 `yi` 将在同一时间 `timestampi` 成为朋友。

友谊是 **相互** 的。也就是说，如果 `a` 和 `b` 是朋友，那么 `b` 和 `a` 也是朋友。同样，如果 `a` 和 `b` 是朋友，或者 `a` 是 `b` 朋友的朋友 ，那么 `a` 和 `b` 认识。

返回圈子里所有人之间都认识的最早时间。如果找不到最早时间，就返回 `-1` 。

示例 1：

```text
输入：logs = [[20190101,0,1],[20190104,3,4],[20190107,2,3],[20190211,1,5],[20190224,2,4],[20190301,0,3],[20190312,1,2],[20190322,4,5]], N = 6
输出：20190301
解释：
第一次结交发生在 timestamp = 20190101，0 和 1 成为好友，社交朋友圈如下 [0,1], [2], [3], [4], [5]。
第二次结交发生在 timestamp = 20190104，3 和 4 成为好友，社交朋友圈如下 [0,1], [2], [3,4], [5].
第三次结交发生在 timestamp = 20190107，2 和 3 成为好友，社交朋友圈如下 [0,1], [2,3,4], [5].
第四次结交发生在 timestamp = 20190211，1 和 5 成为好友，社交朋友圈如下 [0,1,5], [2,3,4].
第五次结交发生在 timestamp = 20190224，2 和 4 已经是好友了。
第六次结交发生在 timestamp = 20190301，0 和 3 成为好友，大家都互相熟识了。
```

示例 2:

```text
输入: logs = [[0,2,0],[1,0,1],[3,0,3],[4,1,2],[7,3,1]], n = 4
输出: 3
```

**提示：**

- `2 i i, yi i != yi`

- `timestampi` 中的所有时间戳 **均****不同**

- 所有的对 `(xi, yi)` 在输入中最多出现一次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 数组, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将所有的日志按照时间戳从小到大排序，然后遍历排序后的日志，利用并查集判断当前日志中的两个人是否已经是朋友，如果不是朋友，则将两个人合并成一个朋友圈，直到所有人都在一个朋友圈中，返回当前日志的时间戳。

如果遍历完所有日志，还没有所有人都在一个朋友圈中，则返回 $-1$。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为日志的数量。

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
// The Earliest Moment When Everyone Become Friends：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func earliestAcq(logs [][]int, n int) int {
	sort.Slice(logs, func(i, j int) bool { return logs[i][0] < logs[j][0] })
	p := make([]int, n)
	for i := range p {
		p[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		if p[x] != x {
			p[x] = find(p[x])
		}
		return p[x]
	}
	for _, log := range logs {
		t, x, y := log[0], log[1], log[2]
		if find(x) == find(y) {
			continue
		}
		p[find(x)] = find(y)
		n--
		if n == 1 {
			return t
		}
	}
	return -1
}
```

### Java

```java
// The Earliest Moment When Everyone Become Friends：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] p;

    public int earliestAcq(int[][] logs, int n) {
        Arrays.sort(logs, (a, b) -> a[0] - b[0]);
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
        }
        for (int[] log : logs) {
            int t = log[0], x = log[1], y = log[2];
            if (find(x) == find(y)) {
                continue;
            }
            p[find(x)] = find(y);
            if (--n == 1) {
                return t;
            }
        }
        return -1;
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}
```

### Python

```python
# The Earliest Moment When Everyone Become Friends：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def earliestAcq(self, logs: List[List[int]], n: int) -> int:
        def find(x):
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        p = list(range(n))
        for t, x, y in sorted(logs):
            if find(x) == find(y):
                continue
            p[find(x)] = find(y)
            n -= 1
            if n == 1:
                return t
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

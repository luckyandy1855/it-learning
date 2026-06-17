# 0683. K Empty Slots

---
编号: 683
题目: K Empty Slots
难度: 困难
标签: [树状数组, 线段树, 队列, 数组, 有序集合, 滑动窗口, 单调队列, 堆（优先队列）]
来源链接: https://leetcode.com/problems/k-empty-slots/
---

## 题目描述

`n` 个灯泡排成一行，编号从 `1` 到 `n` 。最初，所有灯泡都关闭。每天 **只打开一个** 灯泡，直到 `n` 天后所有灯泡都打开。

给你一个长度为 `n` 的灯泡数组 `bulbs` ，其中 `bulbs[i] = x` 意味着在第 `(i+1)` 天，我们会把在位置 `x` 的灯泡打开，其中 `i` **从 0 开始**，`x` **从 1 开始**。

给你一个整数 `k` ，请返回*恰好有两个打开的灯泡，且它们中间 **正好** 有 `k` 个 **全部关闭的** 灯泡的 **最小的天数** *。*如果不存在这种情况，返回 `-1` 。*

示例 1：

```text
输入：
bulbs = [1,3,2]，k = 1
输出：2
解释：
第一天 bulbs[0] = 1，打开第一个灯泡 [1,0,0]
第二天 bulbs[1] = 3，打开第三个灯泡 [1,0,1]
第三天 bulbs[2] = 2，打开第二个灯泡 [1,1,1]
返回2，因为在第二天，两个打开的灯泡之间恰好有一个关闭的灯泡。
```

**示例 2：**

```text
输入：bulbs = [1,2,3]，k = 1
输出：-1
```

提示：

- `n == bulbs.length`

- `1 <= n <= 2 * 10^4`

- `1 <= bulbs[i] <= n`

- `bulbs` 是一个由从 `1` 到 `n` 的数字构成的排列

- `0 <= k <= 2 * 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树状数组, 线段树, 队列, 数组, 有序集合, 滑动窗口, 单调队列, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用树状数组来维护区间和，每一次打开灯泡，我们就在树状数组中更新对应位置的值，然后查询当前位置左边 $k$ 个灯泡是否都是关闭的，并且第 $k+1$ 个灯泡是否已经打开；或者查询当前位置右边 $k$ 个灯泡是否都是关闭的，并且第 $k+1$ 个灯泡是否已经打开。如果满足这两个条件之一，那么就说明当前位置是一个符合要求的位置，我们就可以返回当前的天数。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是灯泡的数量。

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
// K Empty Slots：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type BinaryIndexedTree struct {
	n int
	c []int
}

func newBinaryIndexedTree(n int) *BinaryIndexedTree {
	c := make([]int, n+1)
	return &BinaryIndexedTree{n, c}
}

func (this *BinaryIndexedTree) update(x, delta int) {
	for ; x <= this.n; x += x & -x {
		this.c[x] += delta
	}
}

func (this *BinaryIndexedTree) query(x int) (s int) {
	for ; x > 0; x -= x & -x {
		s += this.c[x]
	}
	return
}

func kEmptySlots(bulbs []int, k int) int {
	n := len(bulbs)
	tree := newBinaryIndexedTree(n)
	vis := make([]bool, n+1)
	for i, x := range bulbs {
		tree.update(x, 1)
		vis[x] = true
		i++
		y := x - k - 1
		if y > 0 && vis[y] && tree.query(x-1)-tree.query(y) == 0 {
			return i
		}
		y = x + k + 1
		if y <= n && vis[y] && tree.query(y-1)-tree.query(x) == 0 {
			return i
		}
	}
	return -1
}
```

### Java

```java
// K Empty Slots：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int kEmptySlots(int[] bulbs, int k) {
        int n = bulbs.length;
        BinaryIndexedTree tree = new BinaryIndexedTree(n);
        boolean[] vis = new boolean[n + 1];
        for (int i = 1; i <= n; ++i) {
            int x = bulbs[i - 1];
            tree.update(x, 1);
            vis[x] = true;
            int y = x - k - 1;
            if (y > 0 && vis[y] && tree.query(x - 1) - tree.query(y) == 0) {
                return i;
            }
            y = x + k + 1;
            if (y <= n && vis[y] && tree.query(y - 1) - tree.query(x) == 0) {
                return i;
            }
        }
        return -1;
    }
}

class BinaryIndexedTree {
    private int n;
    private int[] c;

    public BinaryIndexedTree(int n) {
        this.n = n;
        this.c = new int[n + 1];
    }

    public void update(int x, int delta) {
        for (; x <= n; x += x & -x) {
            c[x] += delta;
        }
    }

    public int query(int x) {
        int s = 0;
        for (; x > 0; x -= x & -x) {
            s += c[x];
        }
        return s;
    }
}
```

### Python

```python
# K Empty Slots：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class BinaryIndexedTree:
    def __init__(self, n):
        self.n = n
        self.c = [0] * (n + 1)

    def update(self, x, delta):
        while x <= self.n:
            self.c[x] += delta
            x += x & -x

    def query(self, x):
        s = 0
        while x:
            s += self.c[x]
            x -= x & -x
        return s


class Solution:
    def kEmptySlots(self, bulbs: List[int], k: int) -> int:
        n = len(bulbs)
        tree = BinaryIndexedTree(n)
        vis = [False] * (n + 1)
        for i, x in enumerate(bulbs, 1):
            tree.update(x, 1)
            vis[x] = True
            y = x - k - 1
            if y > 0 and vis[y] and tree.query(x - 1) - tree.query(y) == 0:
                return i
            y = x + k + 1
            if y <= n and vis[y] and tree.query(y - 1) - tree.query(x) == 0:
                return i
        return -1
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

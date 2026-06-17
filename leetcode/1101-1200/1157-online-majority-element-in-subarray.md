# 1157. Online Majority Element In Subarray

---
编号: 1157
题目: Online Majority Element In Subarray
难度: 困难
标签: [设计, 树状数组, 线段树, 数组, 二分查找]
来源链接: https://leetcode.com/problems/online-majority-element-in-subarray/
---

## 题目描述

设计一个数据结构，有效地找到给定子数组的 **多数元素** 。

子数组的 **多数元素** 是在子数组中出现 `threshold` 次数或次数以上的元素。

实现 `MajorityChecker` 类:

- `MajorityChecker(int[] arr)` 会用给定的数组 `arr` 对 `MajorityChecker` 初始化。

- `int query(int left, int right, int threshold)` 返回子数组中的元素  `arr[left...right]` 至少出现 `threshold` 次数，如果不存在这样的元素则返回 `-1`。

**示例 1：**

```text
输入:
["MajorityChecker", "query", "query", "query"]
[[[1, 1, 2, 2, 1, 1]], [0, 5, 4], [0, 3, 3], [2, 3, 2]]
输出：
[null, 1, -1, 2]

解释：
MajorityChecker majorityChecker = new MajorityChecker([1,1,2,2,1,1]);
majorityChecker.query(0,5,4); // 返回 1
majorityChecker.query(0,3,3); // 返回 -1
majorityChecker.query(2,3,2); // 返回 2
```

**提示：**

- `1  right - left + 1`

- 调用 `query` 的次数最多为 `10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 树状数组, 线段树, 数组, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，题目需要我们找出特定区间内可能的众数，考虑使用线段树来维护每个区间内的候选众数以及其出现的次数。

我们定义线段树的每个节点为 `Node`，每个节点包含如下属性：

- `l`：节点的左端点，下标从 $1$ 开始。
- `r`：节点的右端点，下标从 $1$ 开始。
- `x`：节点的候选众数。
- `cnt`：节点的候选众数出现的次数。

线段树主要有以下几个操作：

- `build(u, l, r)`：建立线段树。
- `pushup(u)`：用子节点的信息更新父节点的信息。
- `query(u, l, r)`：查询区间和。

在主函数的初始化方法中，我们先创建一个线段树，并且用哈希表 $d$ 记录每个元素在数组中的所有下标。

在 `query(left, right, threshold)` 方法中，我们直接调用线段树的 `query` 方法，得到候选众数 $x$。然后使用二分查找，找到 $x$ 在数组中第一个大于等于 $left$ 的下标 $l$，以及第一个大于 $right$ 的下标 $r$。如果 $r - l \ge threshold$，则返回 $x$，否则返回 $-1$。

时间复杂度方面，初始化方法的时间复杂度为 $O(n)$，查询方法的时间复杂度为 $O(\log n)$。空间复杂度为 $O(n)$。其中 $n$ 为数组的长度。

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
// Online Majority Element In Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type node struct {
	l, r, x, cnt int
}

type segmentTree struct {
	nums []int
	tr   []*node
}

type pair struct{ x, cnt int }

func newSegmentTree(nums []int) *segmentTree {
	n := len(nums)
	tr := make([]*node, n<<2)
	for i := range tr {
		tr[i] = &node{}
	}
	t := &segmentTree{nums, tr}
	t.build(1, 1, n)
	return t
}

func (t *segmentTree) build(u, l, r int) {
	t.tr[u].l, t.tr[u].r = l, r
	if l == r {
		t.tr[u].x = t.nums[l-1]
		t.tr[u].cnt = 1
		return
	}
	mid := (l + r) >> 1
	t.build(u<<1, l, mid)
	t.build(u<<1|1, mid+1, r)
	t.pushup(u)
}

func (t *segmentTree) query(u, l, r int) pair {
	if t.tr[u].l >= l && t.tr[u].r <= r {
		return pair{t.tr[u].x, t.tr[u].cnt}
	}
	mid := (t.tr[u].l + t.tr[u].r) >> 1
	if r <= mid {
		return t.query(u<<1, l, r)
	}
	if l > mid {
		return t.query(u<<1|1, l, r)
	}
	left, right := t.query(u<<1, l, r), t.query(u<<1|1, l, r)
	if left.x == right.x {
		left.cnt += right.cnt
	} else if left.cnt >= right.cnt {
		left.cnt -= right.cnt
	} else {
		right.cnt -= left.cnt
		left = right
	}
	return left
}

func (t *segmentTree) pushup(u int) {
	if t.tr[u<<1].x == t.tr[u<<1|1].x {
		t.tr[u].x = t.tr[u<<1].x
		t.tr[u].cnt = t.tr[u<<1].cnt + t.tr[u<<1|1].cnt
	} else if t.tr[u<<1].cnt >= t.tr[u<<1|1].cnt {
		t.tr[u].x = t.tr[u<<1].x
		t.tr[u].cnt = t.tr[u<<1].cnt - t.tr[u<<1|1].cnt
	} else {
		t.tr[u].x = t.tr[u<<1|1].x
		t.tr[u].cnt = t.tr[u<<1|1].cnt - t.tr[u<<1].cnt
	}
}

type MajorityChecker struct {
	tree *segmentTree
	d    map[int][]int
}

func Constructor(arr []int) MajorityChecker {
	tree := newSegmentTree(arr)
	d := map[int][]int{}
	for i, x := range arr {
		d[x] = append(d[x], i)
	}
	return MajorityChecker{tree, d}
}

func (this *MajorityChecker) Query(left int, right int, threshold int) int {
	x := this.tree.query(1, left+1, right+1).x
	l := sort.SearchInts(this.d[x], left)
	r := sort.SearchInts(this.d[x], right+1)
	if r-l >= threshold {
		return x
	}
	return -1
}

/**
 * Your MajorityChecker object will be instantiated and called as such:
 * obj := Constructor(arr);
 * param_1 := obj.Query(left,right,threshold);
 */
```

### Java

```java
// Online Majority Element In Subarray：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Node {
    int l, r;
    int x, cnt;
}

class SegmentTree {
    private Node[] tr;
    private int[] nums;

    public SegmentTree(int[] nums) {
        int n = nums.length;
        this.nums = nums;
        tr = new Node[n << 2];
        for (int i = 0; i < tr.length; ++i) {
            tr[i] = new Node();
        }
        build(1, 1, n);
    }

    private void build(int u, int l, int r) {
        tr[u].l = l;
        tr[u].r = r;
        if (l == r) {
            tr[u].x = nums[l - 1];
            tr[u].cnt = 1;
            return;
        }
        int mid = (l + r) >> 1;
        build(u << 1, l, mid);
        build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }

    public int[] query(int u, int l, int r) {
        if (tr[u].l >= l && tr[u].r <= r) {
            return new int[] {tr[u].x, tr[u].cnt};
        }
        int mid = (tr[u].l + tr[u].r) >> 1;
        if (r <= mid) {
            return query(u << 1, l, r);
        }
        if (l > mid) {
            return query(u << 1 | 1, l, r);
        }
        var left = query(u << 1, l, r);
        var right = query(u << 1 | 1, l, r);
        if (left[0] == right[0]) {
            left[1] += right[1];
        } else if (left[1] >= right[1]) {
            left[1] -= right[1];
        } else {
            right[1] -= left[1];
            left = right;
        }
        return left;
    }

    private void pushup(int u) {
        if (tr[u << 1].x == tr[u << 1 | 1].x) {
            tr[u].x = tr[u << 1].x;
            tr[u].cnt = tr[u << 1].cnt + tr[u << 1 | 1].cnt;
        } else if (tr[u << 1].cnt >= tr[u << 1 | 1].cnt) {
            tr[u].x = tr[u << 1].x;
            tr[u].cnt = tr[u << 1].cnt - tr[u << 1 | 1].cnt;
        } else {
            tr[u].x = tr[u << 1 | 1].x;
            tr[u].cnt = tr[u << 1 | 1].cnt - tr[u << 1].cnt;
        }
    }
}

class MajorityChecker {
    private SegmentTree tree;
    private Map<Integer, List<Integer>> d = new HashMap<>();

    public MajorityChecker(int[] arr) {
        tree = new SegmentTree(arr);
        for (int i = 0; i < arr.length; ++i) {
            d.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
        }
    }

    public int query(int left, int right, int threshold) {
        int x = tree.query(1, left + 1, right + 1)[0];
        int l = search(d.get(x), left);
        int r = search(d.get(x), right + 1);
        return r - l >= threshold ? x : -1;
    }

    private int search(List<Integer> arr, int x) {
        int left = 0, right = arr.size();
        while (left < right) {
            int mid = (left + right) >> 1;
            if (arr.get(mid) >= x) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}

/**
 * Your MajorityChecker object will be instantiated and called as such:
 * MajorityChecker obj = new MajorityChecker(arr);
 * int param_1 = obj.query(left,right,threshold);
 */
```

### Python

```python
# Online Majority Element In Subarray：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Node:
    __slots__ = ("l", "r", "x", "cnt")

    def __init__(self):
        self.l = self.r = 0
        self.x = self.cnt = 0


class SegmentTree:
    def __init__(self, nums):
        self.nums = nums
        n = len(nums)
        self.tr = [Node() for _ in range(n << 2)]
        self.build(1, 1, n)

    def build(self, u, l, r):
        self.tr[u].l, self.tr[u].r = l, r
        if l == r:
            self.tr[u].x = self.nums[l - 1]
            self.tr[u].cnt = 1
            return
        mid = (l + r) >> 1
        self.build(u << 1, l, mid)
        self.build(u << 1 | 1, mid + 1, r)
        self.pushup(u)

    def query(self, u, l, r):
        if self.tr[u].l >= l and self.tr[u].r <= r:
            return self.tr[u].x, self.tr[u].cnt
        mid = (self.tr[u].l + self.tr[u].r) >> 1
        if r <= mid:
            return self.query(u << 1, l, r)
        if l > mid:
            return self.query(u << 1 | 1, l, r)
        x1, cnt1 = self.query(u << 1, l, r)
        x2, cnt2 = self.query(u << 1 | 1, l, r)
        if x1 == x2:
            return x1, cnt1 + cnt2
        if cnt1 >= cnt2:
            return x1, cnt1 - cnt2
        else:
            return x2, cnt2 - cnt1

    def pushup(self, u):
        if self.tr[u << 1].x == self.tr[u << 1 | 1].x:
            self.tr[u].x = self.tr[u << 1].x
            self.tr[u].cnt = self.tr[u << 1].cnt + self.tr[u << 1 | 1].cnt
        elif self.tr[u << 1].cnt >= self.tr[u << 1 | 1].cnt:
            self.tr[u].x = self.tr[u << 1].x
            self.tr[u].cnt = self.tr[u << 1].cnt - self.tr[u << 1 | 1].cnt
        else:
            self.tr[u].x = self.tr[u << 1 | 1].x
            self.tr[u].cnt = self.tr[u << 1 | 1].cnt - self.tr[u << 1].cnt


class MajorityChecker:
    def __init__(self, arr: List[int]):
        self.tree = SegmentTree(arr)
        self.d = defaultdict(list)
        for i, x in enumerate(arr):
            self.d[x].append(i)

    def query(self, left: int, right: int, threshold: int) -> int:
        x, _ = self.tree.query(1, left + 1, right + 1)
        l = bisect_left(self.d[x], left)
        r = bisect_left(self.d[x], right + 1)
        return x if r - l >= threshold else -1


# Your MajorityChecker object will be instantiated and called as such:
# obj = MajorityChecker(arr)
# param_1 = obj.query(left,right,threshold)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0307. Range Sum Query - Mutable

---
编号: 307
题目: Range Sum Query - Mutable
难度: 中等
标签: [设计, 树状数组, 线段树, 数组, 分治]
来源链接: https://leetcode.com/problems/range-sum-query-mutable/
---

## 题目描述

给你一个数组 `nums` ，请你完成两类查询。

	- 其中一类查询要求 **更新** 数组 `nums` 下标对应的值

	- 另一类查询要求返回数组 `nums` 中索引 `left` 和索引 `right` 之间（ **包含 **）的nums元素的 **和** ，其中 `left

实现 `NumArray` 类：

	- `NumArray(int[] nums)` 用整数数组 `nums` 初始化对象

	- `void update(int index, int val)` 将 `nums[index]` 的值 **更新** 为 `val`

	- `int sumRange(int left, int right)` 返回数组 `nums` 中索引 `left` 和索引 `right` 之间（ **包含 **）的nums元素的 **和** （即，`nums[left] + nums[left + 1], ..., nums[right]`）

**示例 1：**

```text
输入：
["NumArray", "sumRange", "update", "sumRange"]
[[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]
输出：
[null, 9, null, 8]

解释：
NumArray numArray = new NumArray([1, 3, 5]);
numArray.sumRange(0, 2); // 返回 1 + 3 + 5 = 9
numArray.update(1, 2);   // nums = [1,2,5]
numArray.sumRange(0, 2); // 返回 1 + 2 + 5 = 8
```

**提示：**

	- `1 <= nums.length <= 3 * 10^4`

	- `-100 <= nums[i] <= 100`

	- `0 <= index < nums.length`

	- `-100 <= val <= 100`

	- `0 <= left <= right < nums.length`

	- 调用 `update` 和 `sumRange` 方法次数不大于 `3 * 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 树状数组, 线段树, 数组, 分治」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

树状数组，也称作“二叉索引树”（Binary Indexed Tree）或 Fenwick 树。 它可以高效地实现如下两个操作：

1. **单点更新** $update(x, delta)$： 把序列 $x$ 位置的数加上一个值 $delta$；
1. **前缀和查询** $query(x)$：查询序列 $[1,...x]$ 区间的区间和，即位置 $x$ 的前缀和。

这两个操作的时间复杂度均为 $O(\log n)$。

树状数组最基本的功能就是求比某点 $x$ 小的点的个数（这里的比较是抽象的概念，可以是数的大小、坐标的大小、质量的大小等等）。

对于本题，我们在构造函数中，先创建一个树状数组，然后遍历数组中每个元素的下标 $i$（从 $1$ 开始）和对应的值 $v$，调用 $update(i, v)$，即可完成树状数组的初始化。时间复杂度为 $O(n \log n)$。

对于 $sumRange(left, right)$，我们可以通过 $query(right + 1) - query(left)$ 得到区间和。时间复杂度为 $O(\log n)$。

对于 $update(index, val)$，我们可以先通过 $sumRange(index, index)$ 得到原来的值 $prev$，然后调用 $update(index, val - prev)$，即可完成更新。时间复杂度为 $O(\log n)$。

空间复杂度为 $O(n)$。

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
// Range Sum Query - Mutable：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type BinaryIndexedTree struct {
	n int
	c []int
}

func newBinaryIndexedTree(n int) *BinaryIndexedTree {
	c := make([]int, n+1)
	return &BinaryIndexedTree{n, c}
}

func (t *BinaryIndexedTree) update(x, delta int) {
	for ; x <= t.n; x += x & -x {
		t.c[x] += delta
	}
}

func (t *BinaryIndexedTree) query(x int) (s int) {
	for ; x > 0; x -= x & -x {
		s += t.c[x]
	}
	return s
}

type NumArray struct {
	tree *BinaryIndexedTree
}

func Constructor(nums []int) NumArray {
	tree := newBinaryIndexedTree(len(nums))
	for i, v := range nums {
		tree.update(i+1, v)
	}
	return NumArray{tree}
}

func (t *NumArray) Update(index int, val int) {
	prev := t.SumRange(index, index)
	t.tree.update(index+1, val-prev)
}

func (t *NumArray) SumRange(left int, right int) int {
	return t.tree.query(right+1) - t.tree.query(left)
}

/**
 * Your NumArray object will be instantiated and called as such:
 * obj := Constructor(nums);
 * obj.Update(index,val);
 * param_2 := obj.SumRange(left,right);
 */
```

### Java

```java
// Range Sum Query - Mutable：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class BinaryIndexedTree {
    private int n;
    private int[] c;

    public BinaryIndexedTree(int n) {
        this.n = n;
        c = new int[n + 1];
    }

    public void update(int x, int delta) {
        while (x <= n) {
            c[x] += delta;
            x += x & -x;
        }
    }

    public int query(int x) {
        int s = 0;
        while (x > 0) {
            s += c[x];
            x -= x & -x;
        }
        return s;
    }
}

class NumArray {
    private BinaryIndexedTree tree;

    public NumArray(int[] nums) {
        int n = nums.length;
        tree = new BinaryIndexedTree(n);
        for (int i = 0; i < n; ++i) {
            tree.update(i + 1, nums[i]);
        }
    }

    public void update(int index, int val) {
        int prev = sumRange(index, index);
        tree.update(index + 1, val - prev);
    }

    public int sumRange(int left, int right) {
        return tree.query(right + 1) - tree.query(left);
    }
}

/**
 * Your NumArray object will be instantiated and called as such:
 * NumArray obj = new NumArray(nums);
 * obj.update(index,val);
 * int param_2 = obj.sumRange(left,right);
 */
```

### Python

```python
# Range Sum Query - Mutable：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class BinaryIndexedTree:
    __slots__ = ["n", "c"]

    def __init__(self, n):
        self.n = n
        self.c = [0] * (n + 1)

    def update(self, x: int, delta: int):
        while x <= self.n:
            self.c[x] += delta
            x += x & -x

    def query(self, x: int) -> int:
        s = 0
        while x > 0:
            s += self.c[x]
            x -= x & -x
        return s


class NumArray:
    __slots__ = ["tree"]

    def __init__(self, nums: List[int]):
        self.tree = BinaryIndexedTree(len(nums))
        for i, v in enumerate(nums, 1):
            self.tree.update(i, v)

    def update(self, index: int, val: int) -> None:
        prev = self.sumRange(index, index)
        self.tree.update(index + 1, val - prev)

    def sumRange(self, left: int, right: int) -> int:
        return self.tree.query(right + 1) - self.tree.query(left)


# Your NumArray object will be instantiated and called as such:
# obj = NumArray(nums)
# obj.update(index,val)
# param_2 = obj.sumRange(left,right)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0327. Count of Range Sum

---
编号: 327
题目: Count of Range Sum
难度: 困难
标签: [树状数组, 线段树, 数组, 二分查找, 分治, 有序集合, 归并排序]
来源链接: https://leetcode.com/problems/count-of-range-sum/
---

## 题目描述

给你一个整数数组 `nums` 以及两个整数 `lower` 和 `upper` 。求数组中，值位于范围 `[lower, upper]` （包含 `lower` 和 `upper`）之内的 **区间和的个数** 。

**区间和** `S(i, j)` 表示在 `nums` 中，位置从 `i` 到 `j` 的元素之和，包含 `i` 和 `j` (`i` ≤ `j`)。

**示例 1：**

```text
输入：nums = [-2,5,-1], lower = -2, upper = 2
输出：3
解释：存在三个区间：[0,0]、[2,2] 和 [0,2] ，对应的区间和分别是：-2 、-1 、2 。
```

**示例 2：**

```text
输入：nums = [0], lower = 0, upper = 0
输出：1
```

**提示：**

	- `1 <= nums.length <= 10^5`

	- `-2^31 <= nums[i] <= 2^31 - 1`

	- `-10^5 <= lower <= upper <= 10^5`

	- 题目数据保证答案是一个 **32 位** 的整数

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树状数组, 线段树, 数组, 二分查找, 分治, 有序集合, 归并排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目要求区间和，因此我们可以先求出前缀和数组 $s$，其中 $s[i]$ 表示 $nums$ 中前 $i$ 个元素的和。那么对于任意的 $i \lt j$，$s[j+1] - s[i]$ 就是 $nums$ 中下标在 $[i, j]$ 的元素之和。

而 $lower \leq s[j+1] - s[i] \leq upper$，可以转换为 $s[j+1] - upper \leq s[i] \leq s[j+1] - lower$，也就是说，对于当前前缀和 $s[j+1]$，我们需要统计 $s$ 中有多少个下标 $i$ 满足 $s[j+1] - upper \leq s[i] \leq s[j+1] - lower$。

我们可以用树状数组来维护每个前缀和出现的次数，这样对于每个前缀和 $s[j+1]$，我们只需要查询树状数组中有多少个前缀和 $s[i]$ 满足 $s[j+1] - upper \leq s[i] \leq s[j+1] - lower$ 即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

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
// Count of Range Sum：按照上方思路实现主解法。
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
	for x <= this.n {
		this.c[x] += delta
		x += x & -x
	}
}

func (this *BinaryIndexedTree) query(x int) int {
	s := 0
	for x > 0 {
		s += this.c[x]
		x -= x & -x
	}
	return s
}

func countRangeSum(nums []int, lower int, upper int) (ans int) {
	n := len(nums)
	s := make([]int, n+1)
	for i, x := range nums {
		s[i+1] = s[i] + x
	}
	arr := make([]int, (n+1)*3)
	for i, j := 0, 0; i <= n; i, j = i+1, j+3 {
		arr[j] = s[i]
		arr[j+1] = s[i] - lower
		arr[j+2] = s[i] - upper
	}
	sort.Ints(arr)
	m := 0
	for i := range arr {
		if i == 0 || arr[i] != arr[i-1] {
			arr[m] = arr[i]
			m++
		}
	}
	arr = arr[:m]
	tree := newBinaryIndexedTree(m)
	for _, x := range s {
		l := sort.SearchInts(arr, x-upper) + 1
		r := sort.SearchInts(arr, x-lower) + 1
		ans += tree.query(r) - tree.query(l-1)
		tree.update(sort.SearchInts(arr, x)+1, 1)
	}
	return
}
```

### Java

```java
// Count of Range Sum：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class BinaryIndexedTree {
    private int n;
    private int[] c;

    public BinaryIndexedTree(int n) {
        this.n = n;
        this.c = new int[n + 1];
    }

    public void update(int x, int v) {
        while (x <= n) {
            c[x] += v;
            x += x & -x;
        }
    }

    public int query(int x) {
        int s = 0;
        while (x != 0) {
            s += c[x];
            x -= x & -x;
        }
        return s;
    }
}

class Solution {
    public int countRangeSum(int[] nums, int lower, int upper) {
        int n = nums.length;
        long[] s = new long[n + 1];
        for (int i = 0; i < n; ++i) {
            s[i + 1] = s[i] + nums[i];
        }
        long[] arr = new long[n * 3 + 3];
        for (int i = 0, j = 0; i <= n; ++i, j += 3) {
            arr[j] = s[i];
            arr[j + 1] = s[i] - lower;
            arr[j + 2] = s[i] - upper;
        }
        Arrays.sort(arr);
        int m = 0;
        for (int i = 0; i < arr.length; ++i) {
            if (i == 0 || arr[i] != arr[i - 1]) {
                arr[m++] = arr[i];
            }
        }
        BinaryIndexedTree tree = new BinaryIndexedTree(m);
        int ans = 0;
        for (long x : s) {
            int l = search(arr, m, x - upper);
            int r = search(arr, m, x - lower);
            ans += tree.query(r) - tree.query(l - 1);
            tree.update(search(arr, m, x), 1);
        }
        return ans;
    }

    private int search(long[] nums, int r, long x) {
        int l = 0;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (nums[mid] >= x) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        return l + 1;
    }
}
```

### Python

```python
# Count of Range Sum：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class BinaryIndexedTree:
    def __init__(self, n):
        self.n = n
        self.c = [0] * (n + 1)

    def update(self, x, v):
        while x <= self.n:
            self.c[x] += v
            x += x & -x

    def query(self, x):
        s = 0
        while x > 0:
            s += self.c[x]
            x -= x & -x
        return s


class Solution:
    def countRangeSum(self, nums: List[int], lower: int, upper: int) -> int:
        s = list(accumulate(nums, initial=0))
        arr = sorted(set(v for x in s for v in (x, x - lower, x - upper)))
        tree = BinaryIndexedTree(len(arr))
        ans = 0
        for x in s:
            l = bisect_left(arr, x - upper) + 1
            r = bisect_left(arr, x - lower) + 1
            ans += tree.query(r) - tree.query(l - 1)
            tree.update(bisect_left(arr, x) + 1, 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

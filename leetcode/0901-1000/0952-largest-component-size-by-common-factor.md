# 0952. Largest Component Size by Common Factor

---
编号: 952
题目: Largest Component Size by Common Factor
难度: 困难
标签: [并查集, 数组, 哈希表, 数学, 数论]
来源链接: https://leetcode.com/problems/largest-component-size-by-common-factor/
---

## 题目描述

给定一个由不同正整数的组成的非空数组 `nums` ，考虑下面的图：

- 有 `nums.length` 个节点，按从 `nums[0]` 到 `nums[nums.length - 1]` 标记；

- 只有当 `nums[i]` 和 `nums[j]` 共用一个大于 1 的公因数时，`nums[i]` 和 `nums[j]`之间才有一条边。

返回 *图中最大连通组件的大小* 。

**示例 1：**

```text
输入：nums = [4,6,15,35]
输出：4
```

**示例 2：**

```text
输入：nums = [20,50,9,63]
输出：2
```

**示例 3：**

```text
输入：nums = [2,3,6,7,4,12,21,39]
输出：8
```

**提示：**

- `1 <= nums.length <= 2 * 10^4`

- `1 <= nums[i] <= 10^5`

- `nums` 中所有值都 **不同**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「并查集, 数组, 哈希表, 数学, 数论」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

利用“试除法”，对 $nums$ 中的每个数 $v$ 分解因数，然后将每个因数 $i$ 与 $v$ 合并，$v / i$ 与 $v$ 合并。此过程用并查集来维护连通分量。

最后，遍历 $nums$ 中每个数 $v$，找出所在的连通分量，出现次数最多的连通分量就是所求的答案。

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
// Largest Component Size by Common Factor：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestComponentSize(nums []int) int {
	m := slices.Max(nums)
	p := make([]int, m+1)
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
	union := func(a, b int) {
		pa, pb := find(a), find(b)
		if pa != pb {
			p[pa] = pb
		}
	}
	for _, v := range nums {
		i := 2
		for i <= v/i {
			if v%i == 0 {
				union(v, i)
				union(v, v/i)
			}
			i++
		}
	}
	cnt := make([]int, m+1)
	for _, v := range nums {
		t := find(v)
		cnt[t]++
	}
	return slices.Max(cnt)
}
```

### Java

```java
// Largest Component Size by Common Factor：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class UnionFind {
    int[] p;

    UnionFind(int n) {
        p = new int[n];
        for (int i = 0; i < n; ++i) {
            p[i] = i;
        }
    }

    void union(int a, int b) {
        int pa = find(a), pb = find(b);
        if (pa != pb) {
            p[pa] = pb;
        }
    }

    int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}

class Solution {
    public int largestComponentSize(int[] nums) {
        int m = 0;
        for (int v : nums) {
            m = Math.max(m, v);
        }
        UnionFind uf = new UnionFind(m + 1);
        for (int v : nums) {
            int i = 2;
            while (i <= v / i) {
                if (v % i == 0) {
                    uf.union(v, i);
                    uf.union(v, v / i);
                }
                ++i;
            }
        }
        int[] cnt = new int[m + 1];
        int ans = 0;
        for (int v : nums) {
            int t = uf.find(v);
            ++cnt[t];
            ans = Math.max(ans, cnt[t]);
        }
        return ans;
    }
}
```

### Python

```python
# Largest Component Size by Common Factor：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class UnionFind:
    def __init__(self, n):
        self.p = list(range(n))

    def union(self, a, b):
        pa, pb = self.find(a), self.find(b)
        if pa != pb:
            self.p[pa] = pb

    def find(self, x):
        if self.p[x] != x:
            self.p[x] = self.find(self.p[x])
        return self.p[x]


class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        uf = UnionFind(max(nums) + 1)
        for v in nums:
            i = 2
            while i <= v // i:
                if v % i == 0:
                    uf.union(v, i)
                    uf.union(v, v // i)
                i += 1
        return max(Counter(uf.find(v) for v in nums).values())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

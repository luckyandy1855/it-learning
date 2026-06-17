# 0632. Smallest Range Covering Elements from K Lists

---
编号: 632
题目: Smallest Range Covering Elements from K Lists
难度: 困难
标签: [贪心, 数组, 哈希表, 排序, 滑动窗口, 堆（优先队列）]
来源链接: https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/
---

## 题目描述

你有 `k` 个 **非递减排列** 的整数列表。找到一个 **最小 **区间，使得 `k` 个列表中的每个列表至少有一个数包含在其中。

我们定义如果 `b-a < d-c` 或者在 `b-a == d-c` 时 `a < c`，则区间 `[a,b]` 比 `[c,d]` 小。

**示例 1：**

```text
输入：nums = [[4,10,15,24,26], [0,9,12,20], [5,18,22,30]]
输出：[20,24]
解释：
列表 1：[4, 10, 15, 24, 26]，24 在区间 [20,24] 中。
列表 2：[0, 9, 12, 20]，20 在区间 [20,24] 中。
列表 3：[5, 18, 22, 30]，22 在区间 [20,24] 中。
```

**示例 2：**

```text
输入：nums = [[1,2,3],[1,2,3],[1,2,3]]
输出：[1,1]
```

**提示：**

- `nums.length == k`

- `1 <= k <= 3500`

- `1 <= nums[i].length <= 50`

- `-10^5 <= nums[i][j] <= 10^5`

- `nums[i]` 按非递减顺序排列

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 排序, 滑动窗口, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将每个数字 $x$ 及其所在的组 $i$，构成数据项 $(x, i)$，存放在一个新的数组 $t$ 中，然后对 $t$ 按照数字的大小进行排序（类似于将多个有序数组合并成一个新的有序数组）。

接下来，我们遍历 $t$ 中的每个数据项，只看其中数字所在的组，用哈希表记录滑动窗口内的数字出现的组，如果组数为 $k$，说明当前窗口满足题目要求，此时算出窗口的起始和结束位置，更新答案。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为所有数组中数字的个数。

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
// Smallest Range Covering Elements from K Lists：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func smallestRange(nums [][]int) []int {
	t := [][]int{}
	for i, x := range nums {
		for _, v := range x {
			t = append(t, []int{v, i})
		}
	}
	sort.Slice(t, func(i, j int) bool { return t[i][0] < t[j][0] })
	ans := []int{-1000000, 1000000}
	j := 0
	cnt := map[int]int{}
	for _, x := range t {
		b, v := x[0], x[1]
		cnt[v]++
		for len(cnt) == len(nums) {
			a, w := t[j][0], t[j][1]
			x := b - a - (ans[1] - ans[0])
			if x < 0 || (x == 0 && a < ans[0]) {
				ans[0], ans[1] = a, b
			}
			cnt[w]--
			if cnt[w] == 0 {
				delete(cnt, w)
			}
			j++
		}
	}
	return ans
}
```

### Java

```java
// Smallest Range Covering Elements from K Lists：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] smallestRange(List<List<Integer>> nums) {
        int n = 0;
        for (var v : nums) {
            n += v.size();
        }
        int[][] t = new int[n][2];
        int k = nums.size();
        for (int i = 0, j = 0; i < k; ++i) {
            for (int x : nums.get(i)) {
                t[j++] = new int[] {x, i};
            }
        }
        Arrays.sort(t, (a, b) -> a[0] - b[0]);
        int j = 0;
        Map<Integer, Integer> cnt = new HashMap<>();
        int[] ans = new int[] {-1000000, 1000000};
        for (int[] e : t) {
            int b = e[0];
            int v = e[1];
            cnt.merge(v, 1, Integer::sum);
            while (cnt.size() == k) {
                int a = t[j][0];
                int w = t[j][1];
                int x = b - a - (ans[1] - ans[0]);
                if (x < 0 || (x == 0 && a < ans[0])) {
                    ans[0] = a;
                    ans[1] = b;
                }
                if (cnt.merge(w, -1, Integer::sum) == 0) {
                    cnt.remove(w);
                }
                ++j;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Smallest Range Covering Elements from K Lists：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        t = [(x, i) for i, v in enumerate(nums) for x in v]
        t.sort()
        cnt = Counter()
        ans = [-inf, inf]
        j = 0
        for i, (b, v) in enumerate(t):
            cnt[v] += 1
            while len(cnt) == len(nums):
                a = t[j][0]
                x = b - a - (ans[1] - ans[0])
                if x < 0 or (x == 0 and a < ans[0]):
                    ans = [a, b]
                w = t[j][1]
                cnt[w] -= 1
                if cnt[w] == 0:
                    cnt.pop(w)
                j += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

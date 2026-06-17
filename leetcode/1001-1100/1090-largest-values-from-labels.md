# 1090. Largest Values From Labels

---
编号: 1090
题目: Largest Values From Labels
难度: 中等
标签: [贪心, 数组, 哈希表, 计数, 排序]
来源链接: https://leetcode.com/problems/largest-values-from-labels/
---

## 题目描述

以两个整数数组  `values` 和 `labels` 给定 `n` 个项的值和标签，并且给出两个整数 `numWanted` 和 `useLimit` 。

你的任务是从这些项中找到一个值的和 **最大** 的子集使得：

- 项的数量 **最多** 为 `numWanted`。

- 相同标签的项的数量 **最多 **为 `useLimit`。

返回最大的和。

示例 1：

**输入：**values = [5,4,3,2,1], labels = [1,1,2,2,3], numWanted = 3, useLimit = 1

**输出：**9

**解释：**

选择的子集是第一个、第三个和第五个项，其值之和为 5 + 3 + 1。

示例 2：

**输入：**values = [5,4,3,2,1], labels = [1,3,3,3,2], numWanted = 3, useLimit = 2

**输出：**12

**解释：**

选择的子集是第一个、第二个和第三个项，其值之和为 5 + 4 + 3。

示例 3：

**输入：**values = [9,8,8,7,6], labels = [0,0,0,1,1], numWanted = 3, useLimit = 1

**输出：**16

**解释：**

选择的子集是第一个和第四个项，其值之和为 9 + 7。

**提示：**

- `n == values.length == labels.length`

- `1 <= n <= 2 * 10^4`

- `0 <= values[i], labels[i] <= 2 * 10^4`

- `1 <= numWanted, useLimit <= n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 计数, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们需要从 $n$ 个元素的集合中选出一个子集，子集元素个数不超过 $numWanted$，且子集中最多有相同标签的 $useLimit$ 项，使得子集的值之和最大。因此，我们应该贪心地选择集合中值较大的元素，同时记录每个标签出现的次数，当某个标签出现的次数达到 $useLimit$ 时，我们就不能再选择该标签对应的元素了。

具体地，我们先将集合中的元素按照值从大到小进行排序，然后从前向后遍历排序后的元素。在遍历的过程中，我们使用一个哈希表 $cnt$ 记录每个标签出现的次数，如果某个标签出现的次数达到了 $useLimit$，那么我们就跳过该元素，否则我们就将该元素的值加到最终的答案中，并将该标签出现的次数加 $1$。同时，我们用一个变量 $num$ 记录当前子集中的元素个数，当 $num$ 达到 $numWanted$ 时，我们就可以结束遍历了。

遍历结束后，我们就得到了最大的分数。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是集合中的元素个数。

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
// Largest Values From Labels：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestValsFromLabels(values []int, labels []int, numWanted int, useLimit int) (ans int) {
	n := len(values)
	pairs := make([][2]int, n)
	for i := 0; i < n; i++ {
		pairs[i] = [2]int{values[i], labels[i]}
	}
	sort.Slice(pairs, func(i, j int) bool { return pairs[i][0] > pairs[j][0] })
	cnt := map[int]int{}
	for i, num := 0, 0; i < n && num < numWanted; i++ {
		v, l := pairs[i][0], pairs[i][1]
		if cnt[l] < useLimit {
			cnt[l]++
			num++
			ans += v
		}
	}
	return
}
```

### Java

```java
// Largest Values From Labels：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int largestValsFromLabels(int[] values, int[] labels, int numWanted, int useLimit) {
        int n = values.length;
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; ++i) {
            pairs[i] = new int[] {values[i], labels[i]};
        }
        Arrays.sort(pairs, (a, b) -> b[0] - a[0]);
        Map<Integer, Integer> cnt = new HashMap<>();
        int ans = 0, num = 0;
        for (int i = 0; i < n && num < numWanted; ++i) {
            int v = pairs[i][0], l = pairs[i][1];
            if (cnt.getOrDefault(l, 0) < useLimit) {
                cnt.merge(l, 1, Integer::sum);
                num += 1;
                ans += v;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Largest Values From Labels：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestValsFromLabels(
        self, values: List[int], labels: List[int], numWanted: int, useLimit: int
    ) -> int:
        ans = num = 0
        cnt = Counter()
        for v, l in sorted(zip(values, labels), reverse=True):
            if cnt[l] < useLimit:
                cnt[l] += 1
                num += 1
                ans += v
                if num == numWanted:
                    break
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

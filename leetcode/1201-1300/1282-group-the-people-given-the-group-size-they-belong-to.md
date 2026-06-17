# 1282. Group the People Given the Group Size They Belong To

---
编号: 1282
题目: Group the People Given the Group Size They Belong To
难度: 中等
标签: [贪心, 数组, 哈希表]
来源链接: https://leetcode.com/problems/group-the-people-given-the-group-size-they-belong-to/
---

## 题目描述

有 `n` 个人被分成数量未知的组。每个人都被标记为一个从 `0` 到 `n - 1` 的**唯一ID** 。

给定一个整数数组 `groupSizes` ，其中 `groupSizes[i]` 是第 `i` 个人所在的组的大小。例如，如果 `groupSizes[1] = 3` ，则第 `1` 个人必须位于大小为 `3` 的组中。

返回一个组列表，使每个人 `i` 都在一个大小为* `groupSizes[i]` *的组中。

每个人应该 **恰好只 **出现在 **一个组 **中，并且每个人必须在一个组中。如果有多个答案，返回其中 **任何 **一个。可以 **保证 **给定输入 **至少有一个 **有效的解。

**示例 1：**

```text
输入：groupSizes = [3,3,3,3,3,1,3]
输出：[[5],[0,1,2],[3,4,6]]
解释：
第一组是 [5]，大小为 1，groupSizes[5] = 1。
第二组是 [0,1,2]，大小为 3，groupSizes[0] = groupSizes[1] = groupSizes[2] = 3。
第三组是 [3,4,6]，大小为 3，groupSizes[3] = groupSizes[4] = groupSizes[6] = 3。
其他可能的解决方案有 [[2,1,6],[5],[0,4,3]] 和 [[5],[0,6,2],[4,3,1]]。
```

**示例 2：**

```text
输入：groupSizes = [2,1,3,3,3,2]
输出：[[1],[0,5],[2,3,4]]
```

**提示：**

- `groupSizes.length == n`

- `1 <= n <= 500`

- `1 <= groupSizes[i] <= n`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $g$ 来存放每个 $groupSize$ 都有哪些人。然后对每个 $groupSize$ 中的人划分为 $k$ 等份，每一等份有 $groupSize$ 个人。

由于题目中的 $n$ 范围较小，我们也可以直接创建一个大小为 $n+1$ 的数组来存放数据，运行效率较高。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为 $groupSizes$ 的长度。

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
// Group the People Given the Group Size They Belong To：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func groupThePeople(groupSizes []int) [][]int {
	n := len(groupSizes)
	g := make([][]int, n+1)
	for i, v := range groupSizes {
		g[v] = append(g[v], i)
	}
	ans := [][]int{}
	for i, v := range g {
		for j := 0; j < len(v); j += i {
			ans = append(ans, v[j:j+i])
		}
	}
	return ans
}
```

### Java

```java
// Group the People Given the Group Size They Belong To：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<Integer>> groupThePeople(int[] groupSizes) {
        int n = groupSizes.length;
        List<Integer>[] g = new List[n + 1];
        Arrays.setAll(g, k -> new ArrayList<>());
        for (int i = 0; i < n; ++i) {
            g[groupSizes[i]].add(i);
        }
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < g.length; ++i) {
            List<Integer> v = g[i];
            for (int j = 0; j < v.size(); j += i) {
                ans.add(v.subList(j, j + i));
            }
        }
        return ans;
    }
}
```

### Python

```python
# Group the People Given the Group Size They Belong To：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def groupThePeople(self, groupSizes: List[int]) -> List[List[int]]:
        g = defaultdict(list)
        for i, v in enumerate(groupSizes):
            g[v].append(i)
        return [v[j : j + i] for i, v in g.items() for j in range(0, len(v), i)]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

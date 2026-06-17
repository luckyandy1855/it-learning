# 1409. Queries on a Permutation With Key

---
编号: 1409
题目: Queries on a Permutation With Key
难度: 中等
标签: [树状数组, 数组, 模拟]
来源链接: https://leetcode.com/problems/queries-on-a-permutation-with-key/
---

## 题目描述

给定一个正整数数组 `queries` ，其取值范围在 `1` 到 `m` 之间。 请你根据以下规则按顺序处理所有 `queries[i]`（从 `i=0` 到 `i=queries.length-1`）：

- 首先，你有一个排列 `P=[1,2,3,...,m]`。

- 对于当前的 `i` ，找到 `queries[i]` 在排列 `P` 中的位置（从 0 开始索引），然后将它移到排列 `P` 的开头（即下标为 0 处）。注意， `queries[i]` 的查询结果是 `queries[i]` 在 `P` 中移动前的位置。

返回一个数组，包含从给定  `queries` 中查询到的结果。

**示例 1：**

```text
输入：queries = [3,1,2,1], m = 5
输出：[2,1,2,1]
解释：处理 queries 的过程如下：
对于 i=0: queries[i]=3, P=[1,2,3,4,5], 3 在 P 中的位置是 2，然后我们把 3 移动到 P 的开头，得到 P=[3,1,2,4,5] 。
对于 i=1: queries[i]=1, P=[3,1,2,4,5], 1 在 P 中的位置是 1，然后我们把 1 移动到 P 的开头，得到 P=[1,3,2,4,5] 。
对于 i=2: queries[i]=2, P=[1,3,2,4,5], 2 在 P 中的位置是 2，然后我们把 2 移动到 P 的开头，得到 P=[2,1,3,4,5] 。
对于 i=3: queries[i]=1, P=[2,1,3,4,5], 1 在 P 中的位置是 1，然后我们把 1 移动到 P 的开头，得到 P=[1,2,3,4,5] 。
因此，包含结果的数组为 [2,1,2,1] 。
```

**示例 2：**

```text
输入：queries = [4,1,2,2], m = 4
输出：[3,1,2,0]
```

**示例 3：**

```text
输入：queries = [7,5,5,8,3], m = 8
输出：[6,5,0,7,5]
```

**提示：**

- `1 <= m <= 10^3`

- `1 <= queries.length <= m`

- `1 <= queries[i] <= m`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树状数组, 数组, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目数据规模不大，可以直接模拟。

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
// Queries on a Permutation With Key：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func processQueries(queries []int, m int) []int {
	p := make([]int, m)
	for i := range p {
		p[i] = i + 1
	}
	ans := []int{}
	for _, v := range queries {
		j := 0
		for i := range p {
			if p[i] == v {
				j = i
				break
			}
		}
		ans = append(ans, j)
		p = append(p[:j], p[j+1:]...)
		p = append([]int{v}, p...)
	}
	return ans
}
```

### Java

```java
// Queries on a Permutation With Key：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] processQueries(int[] queries, int m) {
        List<Integer> p = new LinkedList<>();
        for (int i = 1; i <= m; ++i) {
            p.add(i);
        }
        int[] ans = new int[queries.length];
        int i = 0;
        for (int v : queries) {
            int j = p.indexOf(v);
            ans[i++] = j;
            p.remove(j);
            p.add(0, v);
        }
        return ans;
    }
}
```

### Python

```python
# Queries on a Permutation With Key：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def processQueries(self, queries: List[int], m: int) -> List[int]:
        p = list(range(1, m + 1))
        ans = []
        for v in queries:
            j = p.index(v)
            ans.append(j)
            p.pop(j)
            p.insert(0, v)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1488. Avoid Flood in The City

---
编号: 1488
题目: Avoid Flood in The City
难度: 中等
标签: [贪心, 数组, 哈希表, 二分查找, 堆（优先队列）]
来源链接: https://leetcode.com/problems/avoid-flood-in-the-city/
---

## 题目描述

你的国家有 10^9 个湖泊，所有湖泊一开始都是空的。当第 `n` 个湖泊下雨前是空的，那么它就会装满水。如果第 `n` 个湖泊下雨前是 **满的 **，这个湖泊会发生 **洪水** 。你的目标是避免任意一个湖泊发生洪水。

给你一个整数数组 `rains` ，其中：

- `rains[i] > 0` 表示第 `i` 天时，第 `rains[i]` 个湖泊会下雨。

- `rains[i] == 0` 表示第 `i` 天没有湖泊会下雨，你 **必须** 选择 **一个** 湖泊并 **抽干** 这个湖泊的水。

请返回一个数组* *`ans` ，满足：

- `ans.length == rains.length`

- 如果 `rains[i] > 0` ，那么`ans[i] == -1` 。

- 如果 `rains[i] == 0` ，`ans[i]` 是你第 `i` 天选择抽干的湖泊。

如果有多种可行解，请返回它们中的 **任意一个** 。如果没办法阻止洪水，请返回一个 **空的数组** 。

请注意，如果你选择抽干一个装满水的湖泊，它会变成一个空的湖泊。但如果你选择抽干一个空的湖泊，那么将无事发生。

**示例 1：**

```text
输入：rains = [1,2,3,4]
输出：[-1,-1,-1,-1]
解释：第一天后，装满水的湖泊包括 [1]
第二天后，装满水的湖泊包括 [1,2]
第三天后，装满水的湖泊包括 [1,2,3]
第四天后，装满水的湖泊包括 [1,2,3,4]
没有哪一天你可以抽干任何湖泊的水，也没有湖泊会发生洪水。
```

**示例 2：**

```text
输入：rains = [1,2,0,0,2,1]
输出：[-1,-1,2,1,-1,-1]
解释：第一天后，装满水的湖泊包括 [1]
第二天后，装满水的湖泊包括 [1,2]
第三天后，我们抽干湖泊 2 。所以剩下装满水的湖泊包括 [1]
第四天后，我们抽干湖泊 1 。所以暂时没有装满水的湖泊了。
第五天后，装满水的湖泊包括 [2]。
第六天后，装满水的湖泊包括 [1,2]。
可以看出，这个方案下不会有洪水发生。同时， [-1,-1,1,2,-1,-1] 也是另一个可行的没有洪水的方案。
```

**示例 3：**

```text
输入：rains = [1,2,0,1,2]
输出：[]
解释：第二天后，装满水的湖泊包括 [1,2]。我们可以在第三天抽干一个湖泊的水。
但第三天后，湖泊 1 和 2 都会再次下雨，所以不管我们第三天抽干哪个湖泊的水，另一个湖泊都会发生洪水。
```

**提示：**

- `1 <= rains.length <= 10^5`

- `0 <= rains[i] <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 二分查找, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将所有晴天都存入 $sunny$ 数组或者有序集合中，使用哈希表 $rainy$ 记录每个湖泊最近一次下雨的日期。初始化答案数组 $ans$ 每个元素为 $-1$。

接下来，我们遍历 $rains$ 数组。对于每个下雨的日期 $i$，如果 $rainy[rains[i]]$ 存在，说明该湖泊在之前下过雨，那么我们需要找到 $sunny$ 数组中第一个大于 $rainy[rains[i]]$ 的日期，将其替换为下雨的日期，否则说明无法阻止洪水，返回空数组。对于没下雨的日期 $i$，我们将 $i$ 存入 $sunny$ 数组中，并且将 $ans[i]$ 置为 $1$。

遍历结束，返回答案数组。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为 $rains$ 数组的长度。

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
// Avoid Flood in The City：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func avoidFlood(rains []int) []int {
	n := len(rains)
	ans := make([]int, n)
	for i := range ans {
		ans[i] = -1
	}

	sunny := redblacktree.New[int, struct{}]()
	rainy := map[int]int{}

	for i, v := range rains {
		if v > 0 {
			if last, ok := rainy[v]; ok {
				node, found := sunny.Ceiling(last + 1)
				if !found {
					return []int{}
				}
				t := node.Key
				ans[t] = v
				sunny.Remove(t)
			}
			rainy[v] = i
		} else {
			sunny.Put(i, struct{}{})
			ans[i] = 1
		}
	}
	return ans
}
```

### Java

```java
// Avoid Flood in The City：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] avoidFlood(int[] rains) {
        int n = rains.length;
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        TreeSet<Integer> sunny = new TreeSet<>();
        Map<Integer, Integer> rainy = new HashMap<>();
        for (int i = 0; i < n; ++i) {
            int v = rains[i];
            if (v > 0) {
                if (rainy.containsKey(v)) {
                    Integer t = sunny.higher(rainy.get(v));
                    if (t == null) {
                        return new int[0];
                    }
                    ans[t] = v;
                    sunny.remove(t);
                }
                rainy.put(v, i);
            } else {
                sunny.add(i);
                ans[i] = 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Avoid Flood in The City：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def avoidFlood(self, rains: List[int]) -> List[int]:
        n = len(rains)
        ans = [-1] * n
        sunny = SortedList()
        rainy = {}
        for i, v in enumerate(rains):
            if v:
                if v in rainy:
                    idx = sunny.bisect_right(rainy[v])
                    if idx == len(sunny):
                        return []
                    ans[sunny[idx]] = v
                    sunny.discard(sunny[idx])
                rainy[v] = i
            else:
                sunny.add(i)
                ans[i] = 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

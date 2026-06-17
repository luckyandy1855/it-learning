# 0599. Minimum Index Sum of Two Lists

---
编号: 599
题目: Minimum Index Sum of Two Lists
难度: 简单
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/minimum-index-sum-of-two-lists/
---

## 题目描述

给定两个字符串数组 `list1` 和 `list2`，找到 **索引和最小的公共字符串**。

**公共字符串** 是同时出现在 `list1` 和 `list2` 中的字符串。

具有 **最小索引和的公共字符串** 是指，如果它在 `list1[i]` 和 `list2[j]` 中出现，那么 `i + j` 应该是所有其他 **公共字符串** 中的最小值。

返回所有 **具有最小索引和的公共字符串**。以 **任何顺序** 返回答案。

**示例 1:**

```text
输入: list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]，list2 = ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"]
输出: ["Shogun"]
解释: 唯一的公共字符串是 “Shogun”。
```

**示例 2:**

```text
输入:list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]，list2 = ["KFC", "Shogun", "Burger King"]
输出: ["Shogun"]
解释: 具有最小索引和的公共字符串是 “Shogun”，它有最小的索引和 = (0 + 1) = 1。
```

**示例 3：**

```text
输入：list1 = ["happy","sad","good"], list2 = ["sad","happy","good"]
输出：["sad","happy"]
解释：有三个公共字符串：
"happy" 索引和 = (0 + 1) = 1.
"sad" 索引和 = (1 + 0) = 1.
"good" 索引和 = (2 + 2) = 4.
最小索引和的字符串是 "sad" 和 "happy"。
```

**提示:**

- `1  `' '` 和英文字母组成。

- `list1` 的所有字符串都是 **唯一** 的。

- `list2` 中的所有字符串都是 **唯一** 的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $\textit{d}$ 记录 $\textit{list2}$ 中的字符串和它们的下标，用一个变量 $\textit{mi}$ 记录最小的下标和。

然后遍历 $\textit{list1}$，对于每个字符串 $\textit{s}$，如果 $\textit{s}$ 在 $\textit{list2}$ 中出现，那么我们计算 $\textit{s}$ 在 $\textit{list1}$ 中的下标 $\textit{i}$ 和在 $\textit{list2}$ 中的下标 $\textit{j}$，如果 $\textit{i} + \textit{j} < \textit{mi}$，我们就更新答案数组 $\textit{ans}$ 为 $\textit{s}$，并且更新 $\textit{mi}$ 为 $\textit{i} + \textit{j}$；如果 $\textit{i} + \textit{j} = \textit{mi}$，我们就将 $\textit{s}$ 加入答案数组 $\textit{ans}$。

遍历结束后，返回答案数组 $\textit{ans}$ 即可。

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
// Minimum Index Sum of Two Lists：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findRestaurant(list1 []string, list2 []string) []string {
	d := map[string]int{}
	for i, s := range list2 {
		d[s] = i
	}
	ans := []string{}
	mi := 1 << 30
	for i, s := range list1 {
		if j, ok := d[s]; ok {
			if i+j < mi {
				mi = i + j
				ans = []string{s}
			} else if i+j == mi {
				ans = append(ans, s)
			}
		}
	}
	return ans
}
```

### Java

```java
// Minimum Index Sum of Two Lists：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String[] findRestaurant(String[] list1, String[] list2) {
        Map<String, Integer> d = new HashMap<>();
        for (int i = 0; i < list2.length; ++i) {
            d.put(list2[i], i);
        }
        List<String> ans = new ArrayList<>();
        int mi = 1 << 30;
        for (int i = 0; i < list1.length; ++i) {
            if (d.containsKey(list1[i])) {
                int j = d.get(list1[i]);
                if (i + j < mi) {
                    mi = i + j;
                    ans.clear();
                    ans.add(list1[i]);
                } else if (i + j == mi) {
                    ans.add(list1[i]);
                }
            }
        }
        return ans.toArray(new String[0]);
    }
}
```

### Python

```python
# Minimum Index Sum of Two Lists：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findRestaurant(self, list1: List[str], list2: List[str]) -> List[str]:
        d = {s: i for i, s in enumerate(list2)}
        ans = []
        mi = inf
        for i, s in enumerate(list1):
            if s in d:
                j = d[s]
                if i + j < mi:
                    mi = i + j
                    ans = [s]
                elif i + j == mi:
                    ans.append(s)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

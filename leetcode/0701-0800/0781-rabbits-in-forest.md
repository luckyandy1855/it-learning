# 0781. Rabbits in Forest

---
编号: 781
题目: Rabbits in Forest
难度: 中等
标签: [贪心, 数组, 哈希表, 数学]
来源链接: https://leetcode.com/problems/rabbits-in-forest/
---

## 题目描述

森林中有未知数量的兔子。提问其中若干只兔子** "还有多少只其它兔子与你（指被提问的兔子）颜色相同?"** ，将答案收集到一个整数数组 `answers` 中，其中 `answers[i]` 是第 `i` 只兔子的回答。

给你数组 `answers` ，返回森林中兔子的最少数量。

**示例 1：**

```text
输入：answers = [1,1,2]
输出：5
解释：
两只回答了 "1" 的兔子可能有相同的颜色，设为红色。
之后回答了 "2" 的兔子不会是红色，否则他们的回答会相互矛盾。
设回答了 "2" 的兔子为蓝色。
此外，森林中还应有另外 2 只蓝色兔子的回答没有包含在数组中。
因此森林中兔子的最少数量是 5 只：3 只回答的和 2 只没有回答的。
```

**示例 2：**

```text
输入：answers = [10,10,10]
输出：11
```

**提示：**

- `1 <= answers.length <= 1000`

- `0 <= answers[i] < 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，回答相同的兔子，可能属于同一种颜色，而回答不同的兔子，不可能属于同一种颜色。

因此，我们用一个哈希表 $\textit{cnt}$ 记录每种回答出现的次数。对于每种回答 $x$ 及其出现次数 $v$，我们按照每种颜色有 $x + 1$ 只兔子的原则，计算出兔子的最少数量，并将其加入答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $\textit{answers}$ 的长度。

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
// Rabbits in Forest：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numRabbits(answers []int) (ans int) {
	cnt := map[int]int{}
	for _, x := range answers {
		cnt[x]++
	}
	for x, v := range cnt {
		group := x + 1
		ans += (v + group - 1) / group * group
	}
	return
}
```

### Java

```java
// Rabbits in Forest：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numRabbits(int[] answers) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : answers) {
            cnt.merge(x, 1, Integer::sum);
        }
        int ans = 0;
        for (var e : cnt.entrySet()) {
            int group = e.getKey() + 1;
            ans += (e.getValue() + group - 1) / group * group;
        }
        return ans;
    }
}
```

### Python

```python
# Rabbits in Forest：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numRabbits(self, answers: List[int]) -> int:
        cnt = Counter(answers)
        ans = 0
        for x, v in cnt.items():
            group = x + 1
            ans += (v + group - 1) // group * group
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

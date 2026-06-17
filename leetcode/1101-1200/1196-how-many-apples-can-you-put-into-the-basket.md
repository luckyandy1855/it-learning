# 1196. How Many Apples Can You Put into the Basket

---
编号: 1196
题目: How Many Apples Can You Put into the Basket
难度: 简单
标签: [贪心, 数组, 排序]
来源链接: https://leetcode.com/problems/how-many-apples-can-you-put-into-the-basket/
---

## 题目描述

你有一些苹果和一个可以承载 `5000` 单位重量的篮子。

给定一个整数数组 `weight` ，其中 `weight[i]` 是第 `i` 个苹果的重量，返回 *你可以放入篮子的最大苹果数量* 。

**示例 1：**

```text
输入：weight = [100,200,150,1000]
输出：4
解释：所有 4 个苹果都可以装进去，因为它们的重量之和为 1450。
```

**示例 2：**

```text
输入：weight = [900,950,800,1000,700,800]
输出：5
解释：6 个苹果的总重量超过了 5000，所以我们只能从中任选 5 个。
```

**提示：**

- `1 <= weight.length <= 10^3`

- `1 <= weight[i] <= 10^3`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

要使得苹果数量最多，那么就要使得苹果的重量尽可能的小，因此我们可以对苹果的重量进行排序，然后从小到大依次放入篮子中，直到篮子的重量超过 $5000$ 为止，返回此时放入篮子的苹果数量。

如果所有的苹果都能放入篮子中，那么就返回苹果的数量。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 是苹果的数量。

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
// How Many Apples Can You Put into the Basket：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxNumberOfApples(weight []int) int {
	sort.Ints(weight)
	s := 0
	for i, x := range weight {
		s += x
		if s > 5000 {
			return i
		}
	}
	return len(weight)
}
```

### Java

```java
// How Many Apples Can You Put into the Basket：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxNumberOfApples(int[] weight) {
        Arrays.sort(weight);
        int s = 0;
        for (int i = 0; i < weight.length; ++i) {
            s += weight[i];
            if (s > 5000) {
                return i;
            }
        }
        return weight.length;
    }
}
```

### Python

```python
# How Many Apples Can You Put into the Basket：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxNumberOfApples(self, weight: List[int]) -> int:
        weight.sort()
        s = 0
        for i, x in enumerate(weight):
            s += x
            if s > 5000:
                return i
        return len(weight)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

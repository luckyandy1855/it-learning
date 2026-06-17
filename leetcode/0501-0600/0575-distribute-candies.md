# 0575. Distribute Candies

---
编号: 575
题目: Distribute Candies
难度: 简单
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/distribute-candies/
---

## 题目描述

Alice 有 `n` 枚糖，其中第 `i` 枚糖的类型为 `candyType[i]` 。Alice 注意到她的体重正在增长，所以前去拜访了一位医生。

医生建议 Alice 要少摄入糖分，只吃掉她所有糖的 `n / 2` 即可（`n` 是一个偶数）。Alice 非常喜欢这些糖，她想要在遵循医生建议的情况下，尽可能吃到最多不同种类的糖。

给你一个长度为 `n` 的整数数组 `candyType` ，返回： Alice *在仅吃掉 `n / 2` 枚糖的情况下，可以吃到糖的 **最多** 种类数*。

**示例 1：**

```text
输入：candyType = [1,1,2,2,3,3]
输出：3
解释：Alice 只能吃 6 / 2 = 3 枚糖，由于只有 3 种糖，她可以每种吃一枚。
```

**示例 2：**

```text
输入：candyType = [1,1,2,3]
输出：2
解释：Alice 只能吃 4 / 2 = 2 枚糖，不管她选择吃的种类是 [1,2]、[1,3] 还是 [2,3]，她只能吃到两种不同类的糖。
```

**示例 3：**

```text
输入：candyType = [6,6,6,6]
输出：1
解释：Alice 只能吃 4 / 2 = 2 枚糖，尽管她能吃 2 枚，但只能吃到 1 种糖。
```

**提示：**

- `n == candyType.length`

- `2 <= n <= 10^4`

- `n` 是一个偶数

- `-10^5 <= candyType[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表来存储糖果的种类，如果糖果的种类数小于 $n / 2$，那么 Alice 最多可以吃到的糖果种类数就是糖果的种类数；否则，Alice 最多可以吃到的糖果种类数就是 $n / 2$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为糖果的数量。

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
// Distribute Candies：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func distributeCandies(candyType []int) int {
	s := hashset.New()
	for _, c := range candyType {
		s.Add(c)
	}
	return min(len(candyType)>>1, s.Size())
}
```

### Java

```java
// Distribute Candies：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int distributeCandies(int[] candyType) {
        Set<Integer> s = new HashSet<>();
        for (int c : candyType) {
            s.add(c);
        }
        return Math.min(candyType.length >> 1, s.size());
    }
}
```

### Python

```python
# Distribute Candies：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def distributeCandies(self, candyType: List[int]) -> int:
        return min(len(candyType) >> 1, len(set(candyType)))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

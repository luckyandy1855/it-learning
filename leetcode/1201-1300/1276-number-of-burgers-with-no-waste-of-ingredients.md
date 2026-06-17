# 1276. Number of Burgers with No Waste of Ingredients

---
编号: 1276
题目: Number of Burgers with No Waste of Ingredients
难度: 中等
标签: [数学]
来源链接: https://leetcode.com/problems/number-of-burgers-with-no-waste-of-ingredients/
---

## 题目描述

圣诞活动预热开始啦，汉堡店推出了全新的汉堡套餐。为了避免浪费原料，请你帮他们制定合适的制作计划。

给你两个整数 `tomatoSlices` 和 `cheeseSlices`，分别表示番茄片和奶酪片的数目。不同汉堡的原料搭配如下：

- **巨无霸汉堡：**4 片番茄和 1 片奶酪

- **小皇堡：**2 片番茄和 1 片奶酪

请你以 `[total_jumbo, total_small]`（[巨无霸汉堡总数，小皇堡总数]）的格式返回恰当的制作方案，使得剩下的番茄片 `tomatoSlices` 和奶酪片 `cheeseSlices` 的数量都是 `0`。

如果无法使剩下的番茄片 `tomatoSlices` 和奶酪片 `cheeseSlices` 的数量为 `0`，就请返回 `[]`。

**示例 1：**

```text
输入：tomatoSlices = 16, cheeseSlices = 7
输出：[1,6]
解释：制作 1 个巨无霸汉堡和 6 个小皇堡需要 4*1 + 2*6 = 16 片番茄和 1 + 6 = 7 片奶酪。不会剩下原料。
```

**示例 2：**

```text
输入：tomatoSlices = 17, cheeseSlices = 4
输出：[]
解释：只制作小皇堡和巨无霸汉堡无法用光全部原料。
```

**示例 3：**

```text
输入：tomatoSlices = 4, cheeseSlices = 17
输出：[]
解释：制作 1 个巨无霸汉堡会剩下 16 片奶酪，制作 2 个小皇堡会剩下 15 片奶酪。
```

**示例 4：**

```text
输入：tomatoSlices = 0, cheeseSlices = 0
输出：[0,0]
```

**示例 5：**

```text
输入：tomatoSlices = 2, cheeseSlices = 1
输出：[0,1]
```

**提示：**

- `0 <= tomatoSlices <= 10^7`

- `0 <= cheeseSlices <= 10^7`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设巨无霸汉堡数量为 $x$，小皇堡数量为 $y$，则有：


\begin{aligned}
4x + 2y &= tomatoSlices \\
x + y &= cheeseSlices
\end{aligned}


将上述两式转换，可以得到：


\begin{aligned}
y = (4 \times cheeseSlices - tomatoSlices) / 2 \\
x = cheeseSlices - y
\end{aligned}


其中 $x$ 和 $y$ 必须为非负整数。

时间复杂度 $O(1)$，空间复杂度 $O(1)$。

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
// Number of Burgers with No Waste of Ingredients：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numOfBurgers(tomatoSlices int, cheeseSlices int) []int {
	k := 4*cheeseSlices - tomatoSlices
	y := k / 2
	x := cheeseSlices - y
	if k%2 != 0 || x < 0 || y < 0 {
		return []int{}
	}
	return []int{x, y}
}
```

### Java

```java
// Number of Burgers with No Waste of Ingredients：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> numOfBurgers(int tomatoSlices, int cheeseSlices) {
        int k = 4 * cheeseSlices - tomatoSlices;
        int y = k / 2;
        int x = cheeseSlices - y;
        return k % 2 != 0 || y < 0 || x < 0 ? List.of() : List.of(x, y);
    }
}
```

### Python

```python
# Number of Burgers with No Waste of Ingredients：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numOfBurgers(self, tomatoSlices: int, cheeseSlices: int) -> List[int]:
        k = 4 * cheeseSlices - tomatoSlices
        y = k // 2
        x = cheeseSlices - y
        return [] if k % 2 or y < 0 or x < 0 else [x, y]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

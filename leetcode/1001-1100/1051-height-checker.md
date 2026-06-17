# 1051. Height Checker

---
编号: 1051
题目: Height Checker
难度: 简单
标签: [数组, 计数排序, 排序]
来源链接: https://leetcode.com/problems/height-checker/
---

## 题目描述

学校打算为全体学生拍一张年度纪念照。根据要求，学生需要按照 **非递减** 的高度顺序排成一行。

排序后的高度情况用整数数组 `expected` 表示，其中 `expected[i]` 是预计排在这一行中第 `i` 位的学生的高度（**下标从 0 开始**）。

给你一个整数数组 `heights` ，表示 **当前学生站位** 的高度情况。`heights[i]` 是这一行中第 `i` 位学生的高度（**下标从 0 开始**）。

返回满足* *`heights[i] != expected[i]` 的 **下标数量** 。

**示例：**

```text
输入：heights = [1,1,4,2,1,3]
输出：3
解释：
高度：[1,1,4,2,1,3]
预期：[1,1,1,2,3,4]
下标 2 、4 、5 处的学生高度不匹配。
```

**示例 2：**

```text
输入：heights = [5,1,2,3,4]
输出：5
解释：
高度：[5,1,2,3,4]
预期：[1,2,3,4,5]
所有下标的对应学生高度都不匹配。
```

**示例 3：**

```text
输入：heights = [1,2,3,4,5]
输出：0
解释：
高度：[1,2,3,4,5]
预期：[1,2,3,4,5]
所有下标的对应学生高度都匹配。
```

**提示：**

- `1 <= heights.length <= 100`

- `1 <= heights[i] <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 计数排序, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先对学生的高度进行排序，然后比较排序后的高度和原始高度，统计不同的位置即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 是学生的数量。

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
// Height Checker：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func heightChecker(heights []int) (ans int) {
	expected := slices.Clone(heights)
	sort.Ints(expected)
	for i, v := range heights {
		if v != expected[i] {
			ans++
		}
	}
	return
}
```

### Java

```java
// Height Checker：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int heightChecker(int[] heights) {
        int[] expected = heights.clone();
        Arrays.sort(expected);
        int ans = 0;
        for (int i = 0; i < heights.length; ++i) {
            if (heights[i] != expected[i]) {
                ++ans;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Height Checker：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def heightChecker(self, heights: List[int]) -> int:
        expected = sorted(heights)
        return sum(a != b for a, b in zip(heights, expected))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

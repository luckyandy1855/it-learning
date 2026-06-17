# 1237. Find Positive Integer Solution for a Given Equation

---
编号: 1237
题目: Find Positive Integer Solution for a Given Equation
难度: 中等
标签: [数学, 双指针, 二分查找, 交互]
来源链接: https://leetcode.com/problems/find-positive-integer-solution-for-a-given-equation/
---

## 题目描述

给你一个函数  `f(x, y)` 和一个目标结果 `z`，函数公式未知，请你计算方程 `f(x,y) == z` 所有可能的正整数 **数对** `x` 和 `y`。满足条件的结果数对可以按任意顺序返回。

尽管函数的具体式子未知，但它是单调递增函数，也就是说：

- `f(x, y) < f(x + 1, y)`

- `f(x, y) < f(x, y + 1)`

函数接口定义如下：

```text
interface CustomFunction {
public:
  // Returns some positive integer f(x, y) for two positive integers x and y based on a formula.
  int f(int x, int y);
};
```

你的解决方案将按如下规则进行评判：

- 判题程序有一个由 `CustomFunction` 的 `9` 种实现组成的列表，以及一种为特定的 `z` 生成所有有效数对的答案的方法。

- 判题程序接受两个输入：`function_id`（决定使用哪种实现测试你的代码）以及目标结果 `z` 。

- 判题程序将会调用你实现的 `findSolution` 并将你的结果与答案进行比较。

- 如果你的结果与答案相符，那么解决方案将被视作正确答案，即 `Accepted` 。

**示例 1：**

```text
输入：function_id = 1, z = 5
输出：[[1,4],[2,3],[3,2],[4,1]]
解释：function_id = 1 暗含的函数式子为 f(x, y) = x + y
以下 x 和 y 满足 f(x, y) 等于 5：
x=1, y=4 -> f(1, 4) = 1 + 4 = 5
x=2, y=3 -> f(2, 3) = 2 + 3 = 5
x=3, y=2 -> f(3, 2) = 3 + 2 = 5
x=4, y=1 -> f(4, 1) = 4 + 1 = 5
```

**示例 2：**

```text
输入：function_id = 2, z = 5
输出：[[1,5],[5,1]]
解释：function_id = 2 暗含的函数式子为 f(x, y) = x * y
以下 x 和 y 满足 f(x, y) 等于 5：
x=1, y=5 -> f(1, 5) = 1 * 5 = 5
x=5, y=1 -> f(5, 1) = 5 * 1 = 5
```

**提示：**

- `1 <= function_id <= 9`

- `1 <= z <= 100`

- 题目保证 `f(x, y) == z` 的解处于 `1 <= x, y <= 1000` 的范围内。

- 在 `1 <= x, y <= 1000` 的前提下，题目保证 `f(x, y)` 是一个 32 位有符号整数。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 双指针, 二分查找, 交互」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目我们可以知道，函数 $f(x, y)$ 是单调递增函数，因此，我们可以枚举 $x$，然后在 $[1,...z]$ 中二分查找 $y$，使得 $f(x, y) = z$。如果找到了，就将 $(x, y)$ 加入答案中。

时间复杂度 $(n \log n)$，其中 $n$ 是 $z$ 的值，空间复杂度 $O(1)$。

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
// Find Positive Integer Solution for a Given Equation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * This is the declaration of customFunction API.
 * @param  x    int
 * @param  x    int
 * @return 	    Returns f(x, y) for any given positive integers x and y.
 *			    Note that f(x, y) is increasing with respect to both x and y.
 *              i.e. f(x, y) < f(x + 1, y), f(x, y) < f(x, y + 1)
 */

func findSolution(customFunction func(int, int) int, z int) (ans [][]int) {
	for x := 1; x <= 1000; x++ {
		y := 1 + sort.Search(999, func(y int) bool { return customFunction(x, y+1) >= z })
		if customFunction(x, y) == z {
			ans = append(ans, []int{x, y})
		}
	}
	return
}
```

### Java

```java
// Find Positive Integer Solution for a Given Equation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/*
 * // This is the custom function interface.
 * // You should not implement it, or speculate about its implementation
 * class CustomFunction {
 *     // Returns f(x, y) for any given positive integers x and y.
 *     // Note that f(x, y) is increasing with respect to both x and y.
 *     // i.e. f(x, y) < f(x + 1, y), f(x, y) < f(x, y + 1)
 *     public int f(int x, int y);
 * };
 */

class Solution {
    public List<List<Integer>> findSolution(CustomFunction customfunction, int z) {
        List<List<Integer>> ans = new ArrayList<>();
        for (int x = 1; x <= 1000; ++x) {
            int l = 1, r = 1000;
            while (l < r) {
                int mid = (l + r) >> 1;
                if (customfunction.f(x, mid) >= z) {
                    r = mid;
                } else {
                    l = mid + 1;
                }
            }
            if (customfunction.f(x, l) == z) {
                ans.add(Arrays.asList(x, l));
            }
        }
        return ans;
    }
}
```

### Python

```python
# Find Positive Integer Solution for a Given Equation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
"""
   This is the custom function interface.
   You should not implement it, or speculate about its implementation
   class CustomFunction:
       # Returns f(x, y) for any given positive integers x and y.
       # Note that f(x, y) is increasing with respect to both x and y.
       # i.e. f(x, y) < f(x + 1, y), f(x, y) < f(x, y + 1)
       def f(self, x, y):

"""


class Solution:
    def findSolution(self, customfunction: "CustomFunction", z: int) -> List[List[int]]:
        ans = []
        for x in range(1, z + 1):
            y = 1 + bisect_left(
                range(1, z + 1), z, key=lambda y: customfunction.f(x, y)
            )
            if customfunction.f(x, y) == z:
                ans.append([x, y])
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0360. Sort Transformed Array

---
编号: 360
题目: Sort Transformed Array
难度: 中等
标签: [数组, 数学, 双指针, 排序]
来源链接: https://leetcode.com/problems/sort-transformed-array/
---

## 题目描述

给你一个已经** 排好序** 的整数数组 `nums` 和整数 `a` 、 `b` 、 `c` 。对于数组中的每一个元素 `nums[i]` ，计算函数值 `f(*x*) = *ax*^2 + *bx* + c` ，请 *按升序返回数组* 。

**示例 1：**

```text
输入: nums = [-4,-2,2,4], a = 1, b = 3, c = 5
输出: [3,9,15,33]
```

**示例 2：**

```text
输入: nums = [-4,-2,2,4], a = -1, b = 3, c = 5
输出: [-23,-5,1,7]
```

**提示：**

	- `1 <= nums.length <= 200`

	- `-100 <= nums[i], a, b, c <= 100`

	- `nums` 按照 **升序排列**

**进阶：**你可以在时间复杂度为 `O(n)` 的情况下解决这个问题吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 双指针, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据数学知识可知，二次函数的图像是一条抛物线，当 $a \gt 0$ 时，抛物线开口向上，顶点为最小值；当 $a \lt 0$ 时，抛物线开口向下，顶点为最大值。

由于数组 $\textit{nums}$ 已经排好序，我们可以使用双指针分别指向数组的两端，根据 $a$ 的正负决定从结果数组的头部还是尾部开始填充较大（或较小）的值。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $\textit{nums}$ 的长度。

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
// Sort Transformed Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sortTransformedArray(nums []int, a int, b int, c int) []int {
	f := func(x int) int {
		return a*x*x + b*x + c
	}

	n := len(nums)
	ans := make([]int, n)
	i, j := 0, n-1

	for k := 0; k < n; k++ {
		y1, y2 := f(nums[i]), f(nums[j])
		if a > 0 {
			if y1 > y2 {
				ans[n-k-1] = y1
				i++
			} else {
				ans[n-k-1] = y2
				j--
			}
		} else {
			if y1 > y2 {
				ans[k] = y2
				j--
			} else {
				ans[k] = y1
				i++
			}
		}
	}
	return ans
}
```

### Java

```java
// Sort Transformed Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] sortTransformedArray(int[] nums, int a, int b, int c) {
        int n = nums.length;
        int[] ans = new int[n];
        int i = 0, j = n - 1;

        IntUnaryOperator f = x -> a * x * x + b * x + c;

        for (int k = 0; k < n; k++) {
            int y1 = f.applyAsInt(nums[i]);
            int y2 = f.applyAsInt(nums[j]);
            if (a > 0) {
                if (y1 > y2) {
                    ans[n - k - 1] = y1;
                    i++;
                } else {
                    ans[n - k - 1] = y2;
                    j--;
                }
            } else {
                if (y1 > y2) {
                    ans[k] = y2;
                    j--;
                } else {
                    ans[k] = y1;
                    i++;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Sort Transformed Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sortTransformedArray(
        self, nums: List[int], a: int, b: int, c: int
    ) -> List[int]:
        def f(x: int) -> int:
            return a * x * x + b * x + c

        n = len(nums)
        i, j = 0, n - 1
        ans = [0] * n
        for k in range(n):
            y1, y2 = f(nums[i]), f(nums[j])
            if a > 0:
                if y1 > y2:
                    ans[n - k - 1] = y1
                    i += 1
                else:
                    ans[n - k - 1] = y2
                    j -= 1
            else:
                if y1 > y2:
                    ans[k] = y2
                    j -= 1
                else:
                    ans[k] = y1
                    i += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

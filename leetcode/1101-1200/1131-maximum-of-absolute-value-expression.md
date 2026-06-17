# 1131. Maximum of Absolute Value Expression

---
编号: 1131
题目: Maximum of Absolute Value Expression
难度: 中等
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/maximum-of-absolute-value-expression/
---

## 题目描述

给你两个长度相等的整数数组，返回下面表达式的最大值：

`|arr1[i] - arr1[j]| + |arr2[i] - arr2[j]| + |i - j|`

其中下标 `i`，`j` 满足 `0 <= i, j < arr1.length`。

**示例 1：**

```text
输入：arr1 = [1,2,3,4], arr2 = [-1,4,5,6]
输出：13
```

**示例 2：**

```text
输入：arr1 = [1,-2,-5,0,10], arr2 = [0,-2,-1,-7,-4]
输出：20
```

**提示：**

- `2 <= arr1.length == arr2.length <= 40000`

- `-10^6 <= arr1[i], arr2[i] <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨令 $x_i = arr1[i]$, $y_i = arr2[i]$，由于 $i$ 和 $j$ 的大小关系不影响表达式的值，我们不妨假设 $i \ge j$，那么表达式可以变为：


| x_i - x_j | + | y_i - y_j | + i - j = \max \begin{cases} (x_i + y_i) - (x_j + y_j) \\ (x_i - y_i) - (x_j - y_j) \\ (-x_i + y_i) - (-x_j + y_j) \\ (-x_i - y_i) - (-x_j - y_j) \end{cases} + i - j\\
= \max \begin{cases} (x_i + y_i + i) - (x_j + y_j + j) \\ (x_i - y_i + i) - (x_j - y_j + j) \\ (-x_i + y_i + i) - (-x_j + y_j + j) \\ (-x_i - y_i + i) - (-x_j - y_j + j) \end{cases}


因此，我们只要求出 $a \times x_i + b \times y_i + i$ 的最大值 $mx$，以及最小值 $mi$，其中 $a, b \in \{-1, 1\}$。那么答案就是所有 $mx - mi$ 中的最大值。

时间复杂度 $O(n)$，其中 $n$ 是数组长度。空间复杂度 $O(1)$。

相似题目：

- [1330. 翻转子数组得到最大的数组值](https://github.com/doocs/leetcode/blob/main/solution/1300-1399/1330.Reverse%20Subarray%20To%20Maximize%20Array%20Value/README.md)

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
// Maximum of Absolute Value Expression：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxAbsValExpr(arr1 []int, arr2 []int) int {
	dirs := [5]int{1, -1, -1, 1, 1}
	const inf = 1 << 30
	ans := -inf
	for k := 0; k < 4; k++ {
		a, b := dirs[k], dirs[k+1]
		mx, mi := -inf, inf
		for i, x := range arr1 {
			y := arr2[i]
			mx = max(mx, a*x+b*y+i)
			mi = min(mi, a*x+b*y+i)
			ans = max(ans, mx-mi)
		}
	}
	return ans
}
```

### Java

```java
// Maximum of Absolute Value Expression：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxAbsValExpr(int[] arr1, int[] arr2) {
        int[] dirs = {1, -1, -1, 1, 1};
        final int inf = 1 << 30;
        int ans = -inf;
        int n = arr1.length;
        for (int k = 0; k < 4; ++k) {
            int a = dirs[k], b = dirs[k + 1];
            int mx = -inf, mi = inf;
            for (int i = 0; i < n; ++i) {
                mx = Math.max(mx, a * arr1[i] + b * arr2[i] + i);
                mi = Math.min(mi, a * arr1[i] + b * arr2[i] + i);
                ans = Math.max(ans, mx - mi);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum of Absolute Value Expression：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxAbsValExpr(self, arr1: List[int], arr2: List[int]) -> int:
        dirs = (1, -1, -1, 1, 1)
        ans = -inf
        for a, b in pairwise(dirs):
            mx, mi = -inf, inf
            for i, (x, y) in enumerate(zip(arr1, arr2)):
                mx = max(mx, a * x + b * y + i)
                mi = min(mi, a * x + b * y + i)
                ans = max(ans, mx - mi)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

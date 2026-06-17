# 0845. Longest Mountain in Array

---
编号: 845
题目: Longest Mountain in Array
难度: 中等
标签: [数组, 双指针, 动态规划, 枚举]
来源链接: https://leetcode.com/problems/longest-mountain-in-array/
---

## 题目描述

把符合下列属性的数组 `arr` 称为 **山脉数组** ：

- `arr.length >= 3`

- 存在下标 `i`（`0  arr[i + 1] > ... > arr[arr.length - 1]`

给出一个整数数组 `arr`，返回最长山脉子数组的长度。如果不存在山脉子数组，返回 `0` 。

**示例 1：**

```text
输入：arr = [2,1,4,7,3,2,5]
输出：5
解释：最长的山脉子数组是 [1,4,7,3,2]，长度为 5。
```

**示例 2：**

```text
输入：arr = [2,2,2]
输出：0
解释：不存在山脉子数组。
```

**提示：**

- `1 <= arr.length <= 10^4`

- `0 <= arr[i] <= 10^4`

**进阶：**

- 你可以仅用一趟扫描解决此问题吗？

- 你可以用 `O(1)` 空间解决此问题吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 动态规划, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个数组 $f$ 和 $g$，其中 $f[i]$ 表示以 $arr[i]$ 结尾的最长上升子序列的长度，而 $g[i]$ 表示以 $arr[i]$ 开头的最长下降子序列的长度。那么对于每个下标 $i$，如果 $f[i] \gt 1$ 且 $g[i] \gt 1$，那么以 $arr[i]$ 为山顶的山脉的长度为 $f[i] + g[i] - 1$，我们只需要枚举所有的 $i$，找出最大的那个值即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $arr$ 的长度。

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
// Longest Mountain in Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func longestMountain(arr []int) (ans int) {
	n := len(arr)
	f := make([]int, n)
	g := make([]int, n)
	for i := range f {
		f[i] = 1
		g[i] = 1
	}
	for i := 1; i < n; i++ {
		if arr[i] > arr[i-1] {
			f[i] = f[i-1] + 1
		}
	}
	for i := n - 2; i >= 0; i-- {
		if arr[i] > arr[i+1] {
			g[i] = g[i+1] + 1
			if f[i] > 1 {
				ans = max(ans, f[i]+g[i]-1)
			}
		}
	}
	return
}
```

### Java

```java
// Longest Mountain in Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int longestMountain(int[] arr) {
        int n = arr.length;
        int[] f = new int[n];
        int[] g = new int[n];
        Arrays.fill(f, 1);
        Arrays.fill(g, 1);
        for (int i = 1; i < n; ++i) {
            if (arr[i] > arr[i - 1]) {
                f[i] = f[i - 1] + 1;
            }
        }
        int ans = 0;
        for (int i = n - 2; i >= 0; --i) {
            if (arr[i] > arr[i + 1]) {
                g[i] = g[i + 1] + 1;
                if (f[i] > 1) {
                    ans = Math.max(ans, f[i] + g[i] - 1);
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Longest Mountain in Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def longestMountain(self, arr: List[int]) -> int:
        n = len(arr)
        f = [1] * n
        g = [1] * n
        for i in range(1, n):
            if arr[i] > arr[i - 1]:
                f[i] = f[i - 1] + 1
        ans = 0
        for i in range(n - 2, -1, -1):
            if arr[i] > arr[i + 1]:
                g[i] = g[i + 1] + 1
                if f[i] > 1:
                    ans = max(ans, f[i] + g[i] - 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0932. Beautiful Array

---
编号: 932
题目: Beautiful Array
难度: 中等
标签: [数组, 数学, 分治]
来源链接: https://leetcode.com/problems/beautiful-array/
---

## 题目描述

如果长度为 `n` 的数组 `nums` 满足下述条件，则认为该数组是一个 **漂亮数组** ：

- `nums` 是由范围 `[1, n]` 的整数组成的一个排列。

- 对于每个 `0 示例 1 ：

```text
输入：n = 4
输出：[2,1,4,3]
```

示例 2 ：

```text
输入：n = 5
输出：[3,1,2,5,4]
```

**提示：**

- `1 <= n <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 分治」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题意，漂亮数组 $A$ 需要满足对于任意 $i<k<j$, $A_k*2 \neq A_i+A_j$。

我们可以发现，不等式左侧一定是偶数，那么我们只要保证不等式右侧 $A_i$ 和 $A_j$ 分别是一奇一偶，那么不等式就恒成立。

利用分治，我们将 $n$ 缩小规模为原来的一半，递归调用，可以得到两个漂亮数组 $left$, $right$。我们将 $left$ 中每个元素 $x_i$ 变为 $x_i*2-1$ 可以得到一个奇数数组；将 $right$ 中每个元素 $x_i$ 变为 $x_i*2$，可以得到一个偶数数组。这两个数组仍然是漂亮数组。

> 基于一个性质，将漂亮数组中的每个元素 $x_i$ 变换为 $kx_i+b$，得到的数组仍然是漂亮数组。

将这两个漂亮数组合并在一起，由于满足一奇一偶，那么合并后的数组也是漂亮数组，从而得到了答案。

时间复杂度 $O(nlogn)$。

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
// Beautiful Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func beautifulArray(n int) []int {
	if n == 1 {
		return []int{1}
	}
	left := beautifulArray((n + 1) >> 1)
	right := beautifulArray(n >> 1)
	var ans []int
	for _, x := range left {
		ans = append(ans, x*2-1)
	}
	for _, x := range right {
		ans = append(ans, x*2)
	}
	return ans
}
```

### Java

```java
// Beautiful Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] beautifulArray(int n) {
        if (n == 1) {
            return new int[] {1};
        }
        int[] left = beautifulArray((n + 1) >> 1);
        int[] right = beautifulArray(n >> 1);
        int[] ans = new int[n];
        int i = 0;
        for (int x : left) {
            ans[i++] = x * 2 - 1;
        }
        for (int x : right) {
            ans[i++] = x * 2;
        }
        return ans;
    }
}
```

### Python

```python
# Beautiful Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def beautifulArray(self, n: int) -> List[int]:
        if n == 1:
            return [1]
        left = self.beautifulArray((n + 1) >> 1)
        right = self.beautifulArray(n >> 1)
        left = [x * 2 - 1 for x in left]
        right = [x * 2 for x in right]
        return left + right
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

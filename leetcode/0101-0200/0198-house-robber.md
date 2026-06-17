# 0198. House Robber

---
编号: 198
题目: House Robber
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/house-robber/
---

## 题目描述

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你** 不触动警报装置的情况下 **，一夜之内能够偷窃到的最高金额。

**示例 1：**

```text
输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
```

**示例 2：**

```text
输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
```

**提示：**

	- `1 <= nums.length <= 100`

	- `0 <= nums[i] <= 400`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $\textit{dfs}(i)$，表示从第 $i$ 间房屋开始偷窃能够得到的最高金额。那么答案即为 $\textit{dfs}(0)$。

函数 $\textit{dfs}(i)$ 的执行过程如下：

- 如果 $i \ge \textit{len}(\textit{nums})$，表示所有房屋都被考虑过了，直接返回 $0$；
- 否则，考虑偷窃第 $i$ 间房屋，那么 $\textit{dfs}(i) = \textit{nums}[i] + \textit{dfs}(i+2)$；不偷窃第 $i$ 间房屋，那么 $\textit{dfs}(i) = \textit{dfs}(i+1)$。
- 返回 $\max(\textit{nums}[i] + \textit{dfs}(i+2), \textit{dfs}(i+1))$。

为了避免重复计算，我们使用记忆化搜索的方法，将 $\textit{dfs}(i)$ 的结果保存在一个数组或哈希表中，每次计算前先查询是否已经计算过，如果计算过直接返回结果。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组长度。

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
// House Robber：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func rob(nums []int) int {
	n := len(nums)
	f := make([]int, n)
	for i := range f {
		f[i] = -1
	}
	var dfs func(int) int
	dfs = func(i int) int {
		if i >= n {
			return 0
		}
		if f[i] < 0 {
			f[i] = max(nums[i]+dfs(i+2), dfs(i+1))
		}
		return f[i]
	}
	return dfs(0)
}
```

### Java

```java
// House Robber：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Integer[] f;
    private int[] nums;

    public int rob(int[] nums) {
        this.nums = nums;
        f = new Integer[nums.length];
        return dfs(0);
    }

    private int dfs(int i) {
        if (i >= nums.length) {
            return 0;
        }
        if (f[i] == null) {
            f[i] = Math.max(nums[i] + dfs(i + 2), dfs(i + 1));
        }
        return f[i];
    }
}
```

### Python

```python
# House Robber：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def rob(self, nums: List[int]) -> int:
        @cache
        def dfs(i: int) -> int:
            if i >= len(nums):
                return 0
            return max(nums[i] + dfs(i + 2), dfs(i + 1))

        return dfs(0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

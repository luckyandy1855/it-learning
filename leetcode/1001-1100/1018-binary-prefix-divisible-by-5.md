# 1018. Binary Prefix Divisible By 5

---
编号: 1018
题目: Binary Prefix Divisible By 5
难度: 简单
标签: [位运算, 数组]
来源链接: https://leetcode.com/problems/binary-prefix-divisible-by-5/
---

## 题目描述

给定一个二进制数组 `nums` ( **索引从0开始 **)。

我们将`xi` 定义为其二进制表示形式为子数组 `nums[0..i]` (从最高有效位到最低有效位)。

- 例如，如果 `nums =[1,0,1]` ，那么 `x0 = 1`, `x1 = 2`, 和 `x2 = 5`。

返回布尔值列表 `answer`，只有当 `xi`* *可以被 `5` 整除时，答案 `answer[i]` 为 `true`，否则为 `false`。

**示例 1：**

```text
输入：nums = [0,1,1]
输出：[true,false,false]
解释：
输入数字为 0, 01, 011；也就是十进制中的 0, 1, 3 。只有第一个数可以被 5 整除，因此 answer[0] 为 true 。
```

**示例 2：**

```text
输入：nums = [1,1,1]
输出：[false,false,false]
```

**提示：**

- `1 <= nums.length <= 10^5`^

- `nums[i]` 仅为 `0` 或 `1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个变量 $x$ 来表示当前的二进制前缀，然后遍历数组 $nums$，对于每个元素 $v$，我们将 $x$ 左移一位，然后加上 $v$，再对 $5$ 取模，判断是否等于 $0$，如果等于 $0$，则说明当前的二进制前缀可以被 $5$ 整除，我们将 $\textit{true}$ 加入答案数组，否则将 $\textit{false}$ 加入答案数组。

时间复杂度 $O(n)$，忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Binary Prefix Divisible By 5：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func prefixesDivBy5(nums []int) (ans []bool) {
	x := 0
	for _, v := range nums {
		x = (x<<1 | v) % 5
		ans = append(ans, x == 0)
	}
	return
}
```

### Java

```java
// Binary Prefix Divisible By 5：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Boolean> prefixesDivBy5(int[] nums) {
        List<Boolean> ans = new ArrayList<>();
        int x = 0;
        for (int v : nums) {
            x = (x << 1 | v) % 5;
            ans.add(x == 0);
        }
        return ans;
    }
}
```

### Python

```python
# Binary Prefix Divisible By 5：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def prefixesDivBy5(self, nums: List[int]) -> List[bool]:
        ans = []
        x = 0
        for v in nums:
            x = (x << 1 | v) % 5
            ans.append(x == 0)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

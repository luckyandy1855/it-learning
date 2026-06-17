# 0364. Nested List Weight Sum II

---
编号: 364
题目: Nested List Weight Sum II
难度: 中等
标签: [栈, 深度优先搜索, 广度优先搜索]
来源链接: https://leetcode.com/problems/nested-list-weight-sum-ii/
---

## 题目描述

给你一个整数嵌套列表 `nestedList` ，每一个元素要么是一个整数，要么是一个列表（这个列表中的每个元素也同样是整数或列表）。

整数的 **深度** 取决于它位于多少个列表内部。例如，嵌套列表 `[1,[2,2],[[3],2],1]` 的每个整数的值都等于它的 **深度** 。令 `maxDepth` 是任意整数的 **最大深度** 。

整数的 **权重** 为 `maxDepth - (整数的深度) + 1` 。

将 `nestedList` 列表中每个整数先乘权重再求和，返回该加权和。

**示例 1：**

```text
输入：nestedList = [[1,1],2,[1,1]]
输出：8
解释：4 个 1 在深度为 1 的位置， 一个 2 在深度为 2 的位置。
1*1 + 1*1 + 2*2 + 1*1 + 1*1 = 8
```

**示例 2：**

```text
输入：nestedList = [1,[4,[6]]]
输出：17
解释：一个 1 在深度为 3 的位置， 一个 4 在深度为 2 的位置，一个 6 在深度为 1 的位置。
1*3 + 4*2 + 6*1 = 17
```

**提示：**

	- `1 <= nestedList.length <= 50`

	- 嵌套列表中整数的值在范围 `[-100, 100]`

	- 任意整数的最大 **深度** 小于等于 `50`

	- 没有空列表

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 深度优先搜索, 广度优先搜索」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨假设整数分别为 $a_1, a_2, \cdots, a_n$，它们的深度分别为 $d_1, d_2, \cdots, d_n$，最大深度为 $\textit{maxDepth}$，那么答案就是：


a_1 \times \textit{maxDepth} - a_1 \times d_1 + a_1 + a_2 \times \textit{maxDepth} - a_2 \times d_2 + a_2 + \cdots + a_n \times \textit{maxDepth} - a_n \times d_n + a_n


即：


(\textit{maxDepth} + 1) \times (a_1 + a_2 + \cdots + a_n) - (a_1 \times d_1 + a_2 \times d_2 + \cdots + a_n \times d_n)


如果我们记所有整数的和为 $s$，所有整数乘以深度的和为 $ws$，那么答案就是：


(\textit{maxDepth} + 1) \times s - ws


因此，我们设计一个函数 $dfs(x, d)$，表示从 $x$ 开始，深度为 $d$ 开始搜索，函数 $dfs(x, d)$ 的执行过程如下：

- 我们先更新 $\textit{maxDepth} = \max(\textit{maxDepth}, d)$；
- 如果 $x$ 是一个整数，那么我们更新 $s = s + x$, $ws = ws + x \times d$；
- 否则，我们递归地遍历 $x$ 的每一个元素 $y$，调用 $dfs(y, d + 1)$。

我们遍历整个列表，对于每一个元素 $x$，我们调用 $dfs(x, 1)$，最终返回 $(\textit{maxDepth} + 1) \times s - ws$ 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为整数的个数。

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
// Nested List Weight Sum II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * type NestedInteger struct {
 * }
 *
 * // Return true if this NestedInteger holds a single integer, rather than a nested list.
 * func (n NestedInteger) IsInteger() bool {}
 *
 * // Return the single integer that this NestedInteger holds, if it holds a single integer
 * // The result is undefined if this NestedInteger holds a nested list
 * // So before calling this method, you should have a check
 * func (n NestedInteger) GetInteger() int {}
 *
 * // Set this NestedInteger to hold a single integer.
 * func (n *NestedInteger) SetInteger(value int) {}
 *
 * // Set this NestedInteger to hold a nested list and adds a nested integer to it.
 * func (n *NestedInteger) Add(elem NestedInteger) {}
 *
 * // Return the nested list that this NestedInteger holds, if it holds a nested list
 * // The list length is zero if this NestedInteger holds a single integer
 * // You can access NestedInteger's List element directly if you want to modify it
 * func (n NestedInteger) GetList() []*NestedInteger {}
 */
func depthSumInverse(nestedList []*NestedInteger) int {
	var maxDepth, ws, s int
	var dfs func(*NestedInteger, int)
	dfs = func(x *NestedInteger, d int) {
		maxDepth = max(maxDepth, d)
		if x.IsInteger() {
			ws += x.GetInteger() * d
			s += x.GetInteger()
		} else {
			for _, y := range x.GetList() {
				dfs(y, d+1)
			}
		}
	}
	for _, x := range nestedList {
		dfs(x, 1)
	}
	return (maxDepth+1)*s - ws
}
```

### Java

```java
// Nested List Weight Sum II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * public interface NestedInteger {
 *     // Constructor initializes an empty nested list.
 *     public NestedInteger();
 *
 *     // Constructor initializes a single integer.
 *     public NestedInteger(int value);
 *
 *     // @return true if this NestedInteger holds a single integer, rather than a nested list.
 *     public boolean isInteger();
 *
 *     // @return the single integer that this NestedInteger holds, if it holds a single integer
 *     // Return null if this NestedInteger holds a nested list
 *     public Integer getInteger();
 *
 *     // Set this NestedInteger to hold a single integer.
 *     public void setInteger(int value);
 *
 *     // Set this NestedInteger to hold a nested list and adds a nested integer to it.
 *     public void add(NestedInteger ni);
 *
 *     // @return the nested list that this NestedInteger holds, if it holds a nested list
 *     // Return empty list if this NestedInteger holds a single integer
 *     public List<NestedInteger> getList();
 * }
 */
class Solution {
    private int maxDepth;
    private int ws;
    private int s;

    public int depthSumInverse(List<NestedInteger> nestedList) {
        for (NestedInteger x : nestedList) {
            dfs(x, 1);
        }
        return (maxDepth + 1) * s - ws;
    }

    private void dfs(NestedInteger x, int d) {
        maxDepth = Math.max(maxDepth, d);
        if (x.isInteger()) {
            ws += x.getInteger() * d;
            s += x.getInteger();
        } else {
            for (NestedInteger y : x.getList()) {
                dfs(y, d + 1);
            }
        }
    }
}
```

### Python

```python
# Nested List Weight Sum II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is the interface that allows for creating nested lists.
# You should not implement it, or speculate about its implementation
# """
# class NestedInteger:
#    def __init__(self, value=None):
#        """
#        If value is not specified, initializes an empty list.
#        Otherwise initializes a single integer equal to value.
#        """
#
#    def isInteger(self):
#        """
#        @return True if this NestedInteger holds a single integer, rather than a nested list.
#        :rtype bool
#        """
#
#    def add(self, elem):
#        """
#        Set this NestedInteger to hold a nested list and adds a nested integer elem to it.
#        :rtype void
#        """
#
#    def setInteger(self, value):
#        """
#        Set this NestedInteger to hold a single integer equal to value.
#        :rtype void
#        """
#
#    def getInteger(self):
#        """
#        @return the single integer that this NestedInteger holds, if it holds a single integer
#        Return None if this NestedInteger holds a nested list
#        :rtype int
#        """
#
#    def getList(self):
#        """
#        @return the nested list that this NestedInteger holds, if it holds a nested list
#        Return None if this NestedInteger holds a single integer
#        :rtype List[NestedInteger]
#        """
class Solution:
    def depthSumInverse(self, nestedList: List[NestedInteger]) -> int:
        def dfs(x, d):
            nonlocal maxDepth, s, ws
            maxDepth = max(maxDepth, d)
            if x.isInteger():
                s += x.getInteger()
                ws += x.getInteger() * d
            else:
                for y in x.getList():
                    dfs(y, d + 1)

        maxDepth = s = ws = 0
        for x in nestedList:
            dfs(x, 1)
        return (maxDepth + 1) * s - ws
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0255. Verify Preorder Sequence in Binary Search Tree

---
编号: 255
题目: Verify Preorder Sequence in Binary Search Tree
难度: 中等
标签: [栈, 树, 二叉搜索树, 递归, 数组, 二叉树, 单调栈]
来源链接: https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree/
---

## 题目描述

给定一个 无重复元素 的整数数组 `preorder` ， *如果它是以二叉搜索树的**先序遍历**排列** *，返回 `true` 。

**示例 1：**

```text
输入: preorder = [5,2,1,3,6]
输出: true
```

**示例 2：**

```text
输入: preorder = [5,2,6,1,3]
输出: false
```

**提示:**

- `1 <= preorder.length <= 10^4`

- `1 <= preorder[i] <= 10^4`

- `preorder` 中 **无重复元素**

**进阶：**您能否使用恒定的空间复杂度来完成此题？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 树, 二叉搜索树, 递归, 数组, 二叉树, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Verify Preorder Sequence in Binary Search Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func verifyPreorder(preorder []int) bool {
	var stk []int
	last := math.MinInt32
	for _, x := range preorder {
		if x < last {
			return false
		}
		for len(stk) > 0 && stk[len(stk)-1] < x {
			last = stk[len(stk)-1]
			stk = stk[0 : len(stk)-1]
		}
		stk = append(stk, x)
	}
	return true
}
```

### Java

```java
import java.util.*;
// Verify Preorder Sequence in Binary Search Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public boolean verifyPreorder(int[] preorder) {
        Deque<Integer> stk = new ArrayDeque<>();
        int last = Integer.MIN_VALUE;
        for (int x : preorder) {
            if (x < last) {
                return false;
            }
            while (!stk.isEmpty() && stk.peek() < x) {
                last = stk.poll();
            }
            stk.push(x);
        }
        return true;
    }
}
```

### Python

```python
# Verify Preorder Sequence in Binary Search Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def verifyPreorder(self, preorder: List[int]) -> bool:
        stk = []
        last = -inf
        for x in preorder:
            if x < last:
                return False
            while stk and stk[-1] < x:
                last = stk.pop()
            stk.append(x)
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

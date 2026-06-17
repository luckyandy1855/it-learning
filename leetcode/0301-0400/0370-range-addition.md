# 0370. Range Addition

---
编号: 370
题目: Range Addition
难度: 中等
标签: [数组, 前缀和]
来源链接: https://leetcode.com/problems/range-addition/
---

## 题目描述

假设你有一个长度为 ***n*** 的数组，初始情况下所有的数字均为 **0**，你将会被给出 ***k***​​​​​​*​* 个更新的操作。

其中，每个操作会被表示为一个三元组：**[startIndex, endIndex, inc]**，你需要将子数组 **A[startIndex ... endIndex]**（包括 startIndex 和 endIndex）增加 **inc**。

请你返回 ***k*** 次操作后的数组。

**示例:**

```text
输入: length = 5, updates = [[1,3,2],[2,4,3],[0,2,-2]]
输出: [-2,0,3,5,3]
```

**解释:**

```text
初始数组:
[0,0,0,0,0]

进行了操作 [1,3,2] 后的数组:
[0,2,2,2,0]

进行了操作 [2,4,3] 后的数组:
[0,2,5,5,3]

进行了操作 [0,2,-2] 后的数组:
[-2,0,3,5,3]
```

**提示：**

	- `1 i i i <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

差分数组模板题。

我们定义 $d$ 为差分数组。给区间 $[l,..r]$ 中的每一个数加上 $c$，那么有 $d[l] += c$，并且 $d[r+1] -= c$。最后我们对差分数组求前缀和，即可得到原数组。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

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
// Range Addition：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getModifiedArray(length int, updates [][]int) []int {
	d := make([]int, length)
	for _, e := range updates {
		l, r, c := e[0], e[1], e[2]
		d[l] += c
		if r+1 < length {
			d[r+1] -= c
		}
	}
	for i := 1; i < length; i++ {
		d[i] += d[i-1]
	}
	return d
}
```

### Java

```java
// Range Addition：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] getModifiedArray(int length, int[][] updates) {
        int[] d = new int[length];
        for (var e : updates) {
            int l = e[0], r = e[1], c = e[2];
            d[l] += c;
            if (r + 1 < length) {
                d[r + 1] -= c;
            }
        }
        for (int i = 1; i < length; ++i) {
            d[i] += d[i - 1];
        }
        return d;
    }
}
```

### Python

```python
# Range Addition：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getModifiedArray(self, length: int, updates: List[List[int]]) -> List[int]:
        d = [0] * length
        for l, r, c in updates:
            d[l] += c
            if r + 1 < length:
                d[r + 1] -= c
        return list(accumulate(d))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

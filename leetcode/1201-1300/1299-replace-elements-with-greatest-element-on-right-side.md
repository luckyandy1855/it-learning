# 1299. Replace Elements with Greatest Element on Right Side

---
编号: 1299
题目: Replace Elements with Greatest Element on Right Side
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/
---

## 题目描述

给你一个数组 `arr` ，请你将每个元素用它右边最大的元素替换，如果是最后一个元素，用 `-1` 替换。

完成所有替换操作后，请你返回这个数组。

**示例 1：**

```text
输入：arr = [17,18,5,4,6,1]
输出：[18,6,6,6,1,-1]
解释：
- 下标 0 的元素 --> 右侧最大元素是下标 1 的元素 (18)
- 下标 1 的元素 --> 右侧最大元素是下标 4 的元素 (6)
- 下标 2 的元素 --> 右侧最大元素是下标 4 的元素 (6)
- 下标 3 的元素 --> 右侧最大元素是下标 4 的元素 (6)
- 下标 4 的元素 --> 右侧最大元素是下标 5 的元素 (1)
- 下标 5 的元素 --> 右侧没有其他元素，替换为 -1
```

**示例 2：**

```text
输入：arr = [400]
输出：[-1]
解释：下标 0 的元素右侧没有其他元素。
```

**提示：**

- `1 <= arr.length <= 10^4`

- `1 <= arr[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个变量 $mx$ 记录当前位置右侧的最大值，初始时 $mx = -1$。

然后我们从右向左遍历数组，对于每个位置 $i$，我们记当前位置的值为 $x$，将当前位置的值更新为 $mx$，然后更新 $mx = \max(mx, x)$。

最后返回原数组即可。

时间复杂度 $O(n)$，其中 $n$ 为数组长度。空间复杂度 $O(1)$。

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
// Replace Elements with Greatest Element on Right Side：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func replaceElements(arr []int) []int {
	for i, mx := len(arr)-1, -1; i >= 0; i-- {
		x := arr[i]
		arr[i] = mx
		mx = max(mx, x)
	}
	return arr
}
```

### Java

```java
// Replace Elements with Greatest Element on Right Side：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] replaceElements(int[] arr) {
        for (int i = arr.length - 1, mx = -1; i >= 0; --i) {
            int x = arr[i];
            arr[i] = mx;
            mx = Math.max(mx, x);
        }
        return arr;
    }
}
```

### Python

```python
# Replace Elements with Greatest Element on Right Side：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def replaceElements(self, arr: List[int]) -> List[int]:
        mx = -1
        for i in reversed(range(len(arr))):
            x = arr[i]
            arr[i] = mx
            mx = max(mx, x)
        return arr
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

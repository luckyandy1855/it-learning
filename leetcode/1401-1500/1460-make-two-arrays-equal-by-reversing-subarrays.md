# 1460. Make Two Arrays Equal by Reversing Subarrays

---
编号: 1460
题目: Make Two Arrays Equal by Reversing Subarrays
难度: 简单
标签: [数组, 哈希表, 排序]
来源链接: https://leetcode.com/problems/make-two-arrays-equal-by-reversing-subarrays/
---

## 题目描述

给你两个长度相同的整数数组 `target` 和 `arr` 。每一步中，你可以选择 `arr` 的任意 **非空子数组** 并将它翻转。你可以执行此过程任意次。

*如果你能让 `arr` 变得与 `target` 相同，返回 True；否则，返回 False 。*

**示例 1：**

```text
输入：target = [1,2,3,4], arr = [2,4,1,3]
输出：true
解释：你可以按照如下步骤使 arr 变成 target：
1- 翻转子数组 [2,4,1] ，arr 变成 [1,4,2,3]
2- 翻转子数组 [4,2] ，arr 变成 [1,2,4,3]
3- 翻转子数组 [4,3] ，arr 变成 [1,2,3,4]
上述方法并不是唯一的，还存在多种将 arr 变成 target 的方法。
```

**示例 2：**

```text
输入：target = [7], arr = [7]
输出：true
解释：arr 不需要做任何翻转已经与 target 相等。
```

**示例 3：**

```text
输入：target = [3,7,9], arr = [3,7,11]
输出：false
解释：arr 没有数字 9 ，所以无论如何也无法变成 target 。
```

**提示：**

- `target.length == arr.length`

- `1 <= target.length <= 1000`

- `1 <= target[i] <= 1000`

- `1 <= arr[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

如果两个数组排序后相等，那么它们可以通过翻转子数组变成相等的数组。

因此，我们只需要对两个数组进行排序，然后判断排序后的数组是否相等即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(\log n)$。其中 $n$ 是数组 $arr$ 的长度。

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
// Make Two Arrays Equal by Reversing Subarrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canBeEqual(target []int, arr []int) bool {
	sort.Ints(target)
	sort.Ints(arr)
	return reflect.DeepEqual(target, arr)
}
```

### Java

```java
// Make Two Arrays Equal by Reversing Subarrays：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canBeEqual(int[] target, int[] arr) {
        Arrays.sort(target);
        Arrays.sort(arr);
        return Arrays.equals(target, arr);
    }
}
```

### Python

```python
# Make Two Arrays Equal by Reversing Subarrays：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canBeEqual(self, target: List[int], arr: List[int]) -> bool:
        return sorted(target) == sorted(arr)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

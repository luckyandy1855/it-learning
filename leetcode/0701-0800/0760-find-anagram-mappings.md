# 0760. Find Anagram Mappings

---
编号: 760
题目: Find Anagram Mappings
难度: 简单
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/find-anagram-mappings/
---

## 题目描述

给你两个整数数组 `nums1` 和 `nums2`，其中 `nums2` 是 `nums1` 的一个** 变位词 **。两个数组都可能包含重复元素。

返回一个下标映射数组 `mapping`，它将 `nums1` 映射到 `nums2`，其中 `mapping[i] = j` 表示 `nums1` 中的第 `i` 个元素出现在 `nums2` 的第 `j` 个下标上。如果有多个答案，返回 **任意一个 **。

数组 `a` 是数组 `b` 的一个 **变位词 **意味着 `b` 是通过将 `a` 中元素的顺序随机打乱生成的。

示例 1：

```text
输入：nums1 = [12,28,46,32,50], nums2 = [50,12,32,46,28]
输出：[1,4,3,2,0]
解释：因为 nums1 中的第 0 个元素出现在 nums2[1] 上，所以 mapping[0] = 1，而 nums1 中的第 1 个元素出现在 nums2[4] 上，所以 mapping[1] = 4，以此类推。
```

示例 2：

```text
输入：nums1 = [84,46], nums2 = [84,46]
输出：[0,1]
```

**提示：**

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用一个哈希表 $\textit{d}$ 来存储数组 $\textit{nums2}$ 中每个元素及其对应的下标。然后我们遍历数组 $\textit{nums1}$，对于每个元素 $\textit{nums1}[i]$，我们从哈希表 $\textit{d}$ 中获取其对应的下标并存入结果数组中。

时间复杂度 $O(n)$，空间复杂度 $O(n)$，其中 $n$ 是数组的长度。

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
// Find Anagram Mappings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func anagramMappings(nums1 []int, nums2 []int) []int {
	d := map[int]int{}
	for i, x := range nums2 {
		d[x] = i
	}
	ans := make([]int, len(nums1))
	for i, x := range nums1 {
		ans[i] = d[x]
	}
	return ans
}
```

### Java

```java
// Find Anagram Mappings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] anagramMappings(int[] nums1, int[] nums2) {
        int n = nums1.length;
        Map<Integer, Integer> d = new HashMap<>(n);
        for (int i = 0; i < n; ++i) {
            d.put(nums2[i], i);
        }
        int[] ans = new int[n];
        for (int i = 0; i < n; ++i) {
            ans[i] = d.get(nums1[i]);
        }
        return ans;
    }
}
```

### Python

```python
# Find Anagram Mappings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def anagramMappings(self, nums1: List[int], nums2: List[int]) -> List[int]:
        d = {x: i for i, x in enumerate(nums2)}
        return [d[x] for x in nums1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

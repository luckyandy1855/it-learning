# 1313. Decompress Run-Length Encoded List

---
编号: 1313
题目: Decompress Run-Length Encoded List
难度: 简单
标签: [数组]
来源链接: https://leetcode.com/problems/decompress-run-length-encoded-list/
---

## 题目描述

给你一个以行程长度编码压缩的整数列表 `nums` 。

考虑每对相邻的两个元素 `[freq, val] = [nums[2*i], nums[2*i+1]]` （其中 `i >= 0` ），每一对都表示解压后子列表中有 `freq` 个值为 `val` 的元素，你需要从左到右连接所有子列表以生成解压后的列表。

请你返回解压后的列表。

**示例 1：**

```text
输入：nums = [1,2,3,4]
输出：[2,4,4,4]
解释：第一对 [1,2] 代表着 2 的出现频次为 1，所以生成数组 [2]。
第二对 [3,4] 代表着 4 的出现频次为 3，所以生成数组 [4,4,4]。
最后将它们串联到一起 [2] + [4,4,4] = [2,4,4,4]。
```

**示例 2：**

```text
输入：nums = [1,1,2,3]
输出：[1,3,3]
```

**提示：**

- `2 <= nums.length <= 100`

- `nums.length % 2 == 0`

- `1 <= nums[i] <= 100`

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

我们可以直接模拟题目描述的过程，从左到右遍历数组 $\textit{nums}$，每次取出两个数 $\textit{freq}$ 和 $\textit{val}$，然后将 $\textit{val}$ 重复 $\textit{freq}$ 次，将这 $\textit{freq}$ 个 $\textit{val}$ 加入答案数组即可。

时间复杂度 $O(n)$，其中 $n$ 是数组 $\textit{nums}$ 的长度。我们只需要遍历一次数组 $\textit{nums}$ 即可。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Decompress Run-Length Encoded List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func decompressRLElist(nums []int) (ans []int) {
	for i := 1; i < len(nums); i += 2 {
		for j := 0; j < nums[i-1]; j++ {
			ans = append(ans, nums[i])
		}
	}
	return
}
```

### Java

```java
// Decompress Run-Length Encoded List：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] decompressRLElist(int[] nums) {
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < nums.length; i += 2) {
            for (int j = 0; j < nums[i]; ++j) {
                ans.add(nums[i + 1]);
            }
        }
        return ans.stream().mapToInt(i -> i).toArray();
    }
}
```

### Python

```python
# Decompress Run-Length Encoded List：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def decompressRLElist(self, nums: List[int]) -> List[int]:
        return [nums[i + 1] for i in range(0, len(nums), 2) for _ in range(nums[i])]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

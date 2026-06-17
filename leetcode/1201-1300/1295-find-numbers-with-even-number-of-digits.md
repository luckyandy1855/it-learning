# 1295. Find Numbers with Even Number of Digits

---
编号: 1295
题目: Find Numbers with Even Number of Digits
难度: 简单
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/find-numbers-with-even-number-of-digits/
---

## 题目描述

给你一个整数数组 `nums`，请你返回其中包含 **偶数** 个数位的数字的个数。

**示例 1：**

```text
输入：nums = [12,345,2,6,7896]
输出：2
解释：
12 是 2 位数字（位数为偶数）
345 是 3 位数字（位数为奇数）
2 是 1 位数字（位数为奇数）
6 是 1 位数字 位数为奇数）
7896 是 4 位数字（位数为偶数）
因此只有 12 和 7896 是位数为偶数的数字
```

**示例 2：**

```text
输入：nums = [555,901,482,1771]
输出：1
解释：
只有 1771 是位数为偶数的数字。
```

**提示：**

- `1 <= nums.length <= 500`

- `1 <= nums[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们遍历数组 $\textit{nums}$ 中的每个元素，对于当前遍历到的元素 $x$，我们直接将其转换为字符串，然后判断其长度是否为偶数即可。若是则将答案加一。

遍历结束后，我们返回答案即可。

时间复杂度 $O(n \times \log M)$，空间复杂度 $O(\log M)$。其中 $n$ 是数组 $\textit{nums}$ 的长度，而 $M$ 是数组 $\textit{nums}$ 中的元素的最大值。

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
// Find Numbers with Even Number of Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findNumbers(nums []int) (ans int) {
	for _, x := range nums {
		if len(strconv.Itoa(x))%2 == 0 {
			ans++
		}
	}
	return
}
```

### Java

```java
// Find Numbers with Even Number of Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findNumbers(int[] nums) {
        int ans = 0;
        for (int x : nums) {
            if (String.valueOf(x).length() % 2 == 0) {
                ++ans;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Find Numbers with Even Number of Digits：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findNumbers(self, nums: List[int]) -> int:
        return sum(len(str(x)) % 2 == 0 for x in nums)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

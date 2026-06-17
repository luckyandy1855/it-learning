# 0611. Valid Triangle Number

---
编号: 611
题目: Valid Triangle Number
难度: 中等
标签: [贪心, 数组, 双指针, 二分查找, 排序]
来源链接: https://leetcode.com/problems/valid-triangle-number/
---

## 题目描述

给定一个包含非负整数的数组 `nums` ，返回其中可以组成三角形三条边的三元组个数。

**示例 1:**

```text
输入: nums = [2,2,3,4]
输出: 3
解释:有效的组合是:
2,3,4 (使用第一个 2)
2,3,4 (使用第二个 2)
2,2,3
```

**示例 2:**

```text
输入: nums = [4,2,3,4]
输出: 4
```

**提示:**

- `1 <= nums.length <= 1000`

- `0 <= nums[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 双指针, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

一个有效三角形需要满足：**任意两边之和大于第三边**。即：

a + b \gt c \tag{1}

a + c \gt b \tag{2}

b + c \gt a \tag{3}

如果我们将边按从小到大顺序排列，即 $a \leq b \leq c$，那么显然 (2)(3) 成立，我们只需要确保 (1) 也成立，就可以形成一个有效三角形。

我们在 $[0, n - 3]$ 范围内枚举 i，在 $[i + 1, n - 2]$ 范围内枚举 j，在 $[j + 1, n - 1]$ 范围内进行二分查找，找出第一个大于等于 $nums[i] + nums[j]$ 的下标 left，那么在 $[j + 1, left - 1]$ 范围内的 k 满足条件，将其累加到结果 $\textit{ans}$。

时间复杂度 $O(n^2\log n)$，空间复杂度 $O(\log n)$。其中 $n$ 是数组的长度。

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
// Valid Triangle Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func triangleNumber(nums []int) int {
	sort.Ints(nums)
	n := len(nums)
	ans := 0
	for i := 0; i < n-2; i++ {
		for j := i + 1; j < n-1; j++ {
			sum := nums[i] + nums[j]
			k := sort.SearchInts(nums[j+1:], sum) + j + 1 - 1
			if k > j {
				ans += k - j
			}
		}
	}
	return ans
}
```

### Java

```java
// Valid Triangle Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int triangleNumber(int[] nums) {
        Arrays.sort(nums);
        int ans = 0;
        for (int i = 0, n = nums.length; i < n - 2; ++i) {
            for (int j = i + 1; j < n - 1; ++j) {
                int left = j + 1, right = n;
                while (left < right) {
                    int mid = (left + right) >> 1;
                    if (nums[mid] >= nums[i] + nums[j]) {
                        right = mid;
                    } else {
                        left = mid + 1;
                    }
                }
                ans += left - j - 1;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Valid Triangle Number：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def triangleNumber(self, nums: List[int]) -> int:
        nums.sort()
        ans, n = 0, len(nums)
        for i in range(n - 2):
            for j in range(i + 1, n - 1):
                k = bisect_left(nums, nums[i] + nums[j], lo=j + 1) - 1
                ans += k - j
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

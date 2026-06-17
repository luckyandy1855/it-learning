# 1389. Create Target Array in the Given Order

---
编号: 1389
题目: Create Target Array in the Given Order
难度: 简单
标签: [数组, 模拟]
来源链接: https://leetcode.com/problems/create-target-array-in-the-given-order/
---

## 题目描述

给你两个整数数组 `nums` 和 `index`。你需要按照以下规则创建目标数组：

- 目标数组 `target` 最初为空。

- 按从左到右的顺序依次读取 `nums[i]` 和 `index[i]`，在 `target` 数组中的下标 `index[i]` 处插入值 `nums[i]` 。

- 重复上一步，直到在 `nums` 和 `index` 中都没有要读取的元素。

请你返回目标数组。

题目保证数字插入位置总是存在。

**示例 1：**

```text
输入：nums = [0,1,2,3,4], index = [0,1,2,2,1]
输出：[0,4,1,3,2]
解释：
nums       index     target
0            0        [0]
1            1        [0,1]
2            2        [0,1,2]
3            2        [0,1,3,2]
4            1        [0,4,1,3,2]
```

**示例 2：**

```text
输入：nums = [1,2,3,4,0], index = [0,1,2,3,0]
输出：[0,1,2,3,4]
解释：
nums       index     target
1            0        [1]
2            1        [1,2]
3            2        [1,2,3]
4            3        [1,2,3,4]
0            0        [0,1,2,3,4]
```

**示例 3：**

```text
输入：nums = [1], index = [0]
输出：[1]
```

**提示：**

- `1 <= nums.length, index.length <= 100`

- `nums.length == index.length`

- `0 <= nums[i] <= 100`

- `0 <= index[i] <= i`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们创建一个列表 $target$，用于存储目标数组。由于题目保证数字插入位置总是存在，因此我们可以直接按照给定的顺序插入到对应的位置。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 是数组的长度。

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
// Create Target Array in the Given Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func createTargetArray(nums []int, index []int) []int {
	target := make([]int, len(nums))
	for i, x := range nums {
		copy(target[index[i]+1:], target[index[i]:])
		target[index[i]] = x
	}
	return target
}
```

### Java

```java
// Create Target Array in the Given Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] createTargetArray(int[] nums, int[] index) {
        int n = nums.length;
        List<Integer> target = new ArrayList<>();
        for (int i = 0; i < n; ++i) {
            target.add(index[i], nums[i]);
        }
        // return target.stream().mapToInt(i -> i).toArray();
        int[] ans = new int[n];
        for (int i = 0; i < n; ++i) {
            ans[i] = target.get(i);
        }
        return ans;
    }
}
```

### Python

```python
# Create Target Array in the Given Order：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def createTargetArray(self, nums: List[int], index: List[int]) -> List[int]:
        target = []
        for x, i in zip(nums, index):
            target.insert(i, x)
        return target
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

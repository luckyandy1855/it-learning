# 0457. Circular Array Loop

---
编号: 457
题目: Circular Array Loop
难度: 中等
标签: [数组, 哈希表, 双指针]
来源链接: https://leetcode.com/problems/circular-array-loop/
---

## 题目描述

存在一个不含 `0` 的** 环形 **数组 `nums` ，每个 `nums[i]` 都表示位于下标 `i` 的角色应该向前或向后移动的下标个数：

- 如果 `nums[i]` 是正数，**向前**（下标递增方向）移动 `nums[i]` 步

- 如果 `nums[i]` 是负数，**向后**（下标递减方向）移动 `abs(nums[i])` 步

因为数组是 **环形** 的，所以可以假设从最后一个元素向前移动一步会到达第一个元素，而第一个元素向后移动一步会到达最后一个元素。

数组中的 **循环** 由长度为 `k` 的下标序列 `seq` 标识：

- 遵循上述移动规则将导致一组重复下标序列 `seq[0] -> seq[1] -> ... -> seq[k - 1] -> seq[0] -> ...`

- 所有 `nums[seq[j]]` 应当不是 **全正** 就是 **全负**

- `k > 1`

如果 `nums` 中存在循环，返回 `true` ；否则，返回* *`false`* *。

示例 1：

```text
输入：nums = [2,-1,1,2,2]
输出：true
解释：图片展示了节点间如何连接。白色节点向前跳跃，而红色节点向后跳跃。
我们可以看到存在循环，按下标 0 -> 2 -> 3 -> 0 --> ...，并且其中的所有节点都是白色（以相同方向跳跃）。
```

示例 2：

```text
输入：nums = [-1,-2,-3,-4,-5,6]
输出：false
解释：图片展示了节点间如何连接。白色节点向前跳跃，而红色节点向后跳跃。
唯一的循环长度为 1，所以返回 false。
```

示例 3：

```text
输入：nums = [1,-1,5,1,4]
输出：true
解释：图片展示了节点间如何连接。白色节点向前跳跃，而红色节点向后跳跃。
我们可以看到存在循环，按下标 0 --> 1 --> 0 --> ...，当它的大小大于 1 时，它有一个向前跳的节点和一个向后跳的节点，所以 它不是一个循环。
我们可以看到存在循环，按下标 3 --> 4 --> 3 --> ...，并且其中的所有节点都是白色（以相同方向跳跃）。
```

**提示：**

- `1 <= nums.length <= 5000`

- `-1000 <= nums[i] <= 1000`

- `nums[i] != 0`

**进阶：**你能设计一个时间复杂度为 `O(n)` 且额外空间复杂度为 `O(1)` 的算法吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 双指针」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Circular Array Loop：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func circularArrayLoop(nums []int) bool {
	for i, num := range nums {
		if num == 0 {
			continue
		}
		slow, fast := i, next(nums, i)
		for nums[slow]*nums[fast] > 0 && nums[slow]*nums[next(nums, fast)] > 0 {
			if slow == fast {
				if slow != next(nums, slow) {
					return true
				}
				break
			}
			slow, fast = next(nums, slow), next(nums, next(nums, fast))
		}
		j := i
		for nums[j]*nums[next(nums, j)] > 0 {
			nums[j] = 0
			j = next(nums, j)
		}
	}
	return false
}

func next(nums []int, i int) int {
	n := len(nums)
	return (i + nums[i]%n + n) % n
}
```

### Java

```java
// Circular Array Loop：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;
    private int[] nums;

    public boolean circularArrayLoop(int[] nums) {
        n = nums.length;
        this.nums = nums;
        for (int i = 0; i < n; ++i) {
            if (nums[i] == 0) {
                continue;
            }
            int slow = i, fast = next(i);
            while (nums[slow] * nums[fast] > 0 && nums[slow] * nums[next(fast)] > 0) {
                if (slow == fast) {
                    if (slow != next(slow)) {
                        return true;
                    }
                    break;
                }
                slow = next(slow);
                fast = next(next(fast));
            }
            int j = i;
            while (nums[j] * nums[next(j)] > 0) {
                nums[j] = 0;
                j = next(j);
            }
        }
        return false;
    }

    private int next(int i) {
        return (i + nums[i] % n + n) % n;
    }
}
```

### Python

```python
# Circular Array Loop：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def circularArrayLoop(self, nums: List[int]) -> bool:
        n = len(nums)

        def next(i):
            return (i + nums[i] % n + n) % n

        for i in range(n):
            if nums[i] == 0:
                continue
            slow, fast = i, next(i)
            while nums[slow] * nums[fast] > 0 and nums[slow] * nums[next(fast)] > 0:
                if slow == fast:
                    if slow != next(slow):
                        return True
                    break
                slow, fast = next(slow), next(next(fast))
            j = i
            while nums[j] * nums[next(j)] > 0:
                nums[j] = 0
                j = next(j)
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

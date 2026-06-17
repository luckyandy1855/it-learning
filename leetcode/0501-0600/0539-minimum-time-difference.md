# 0539. Minimum Time Difference

---
编号: 539
题目: Minimum Time Difference
难度: 中等
标签: [数组, 数学, 字符串, 排序]
来源链接: https://leetcode.com/problems/minimum-time-difference/
---

## 题目描述

给定一个 24 小时制（小时:分钟 **"HH:MM"**）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。

**示例 1：**

```text
输入：timePoints = ["23:59","00:00"]
输出：1
```

**示例 2：**

```text
输入：timePoints = ["00:00","23:59","00:00"]
输出：0
```

**提示：**

- `2 <= timePoints.length <= 2 * 10^4`

- `timePoints[i]` 格式为 **"HH:MM"**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，时间点最多只有 $24 \times 60 = 1440$ 个，因此，当 $timePoints$ 长度超过 $1440$，说明有重复的时间点，提前返回 $0$。

接下来，我们首先遍历时间列表，将其转换为“分钟制”列表 $nums$，比如，对于时间点 `13:14`，将其转换为 $13 \times 60 + 14$。

接着将“分钟制”列表按升序排列，然后将此列表的最小时间 $nums[0]$ 加上 $1440$ 追加至列表尾部，用于处理最大值、最小值的差值这种特殊情况。

最后遍历“分钟制”列表，找出相邻两个时间的最小值即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为时间点个数。

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
// Minimum Time Difference：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findMinDifference(timePoints []string) int {
	if len(timePoints) > 1440 {
		return 0
	}

	n := len(timePoints)
	nums := make([]int, n+1)
	for i, time := range timePoints {
		parts := strings.Split(time, ":")
		hours, _ := strconv.Atoi(parts[0])
		minutes, _ := strconv.Atoi(parts[1])
		nums[i] = hours*60 + minutes
	}

	sort.Ints(nums[:n])
	nums[n] = nums[0] + 1440

	ans := 1 << 30
	for i := 1; i <= n; i++ {
		ans = min(ans, nums[i]-nums[i-1])
	}

	return ans
}
```

### Java

```java
// Minimum Time Difference：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findMinDifference(List<String> timePoints) {
        if (timePoints.size() > 1440) {
            return 0;
        }
        int n = timePoints.size();
        int[] nums = new int[n + 1];
        for (int i = 0; i < n; ++i) {
            String[] t = timePoints.get(i).split(":");
            nums[i] = Integer.parseInt(t[0]) * 60 + Integer.parseInt(t[1]);
        }
        Arrays.sort(nums, 0, n);
        nums[n] = nums[0] + 1440;
        int ans = 1 << 30;
        for (int i = 1; i <= n; ++i) {
            ans = Math.min(ans, nums[i] - nums[i - 1]);
        }
        return ans;
    }
}
```

### Python

```python
# Minimum Time Difference：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findMinDifference(self, timePoints: List[str]) -> int:
        if len(timePoints) > 1440:
            return 0
        nums = sorted(int(x[:2]) * 60 + int(x[3:]) for x in timePoints)
        nums.append(nums[0] + 1440)
        return min(b - a for a, b in pairwise(nums))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

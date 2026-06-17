# 1215. Stepping Numbers

---
编号: 1215
题目: Stepping Numbers
难度: 中等
标签: [广度优先搜索, 数学, 回溯]
来源链接: https://leetcode.com/problems/stepping-numbers/
---

## 题目描述

如果一个整数上的每一位数字与其相邻位上的数字的绝对差都是 `1`，那么这个数就是一个「**步进数**」。

例如，`321` 是一个 **步进数**，而 `421` 不是。

给你两个整数，`low` 和 `high`，请你找出在 `[low, high]` 范围内的所有 **步进数**，并返回 **排序后** 的结果。

**示例 1：**

```text
输入：low = 0, high = 21
输出：[0,1,2,3,4,5,6,7,8,9,10,12,21]
```

示例 2：

```text
输入：low = 10, high = 15
输出：[10,12]
```

**提示：**

- `0 <= low <= high <= 2 * 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 数学, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

首先，如果 $low$ 为 $0$，那么我们需要将 $0$ 加入答案中。

接下来，我们创建一个队列 $q$，并将 $1 \sim 9$ 加入队列中。然后我们不断从队列中取出元素，记当前元素为 $v$，如果 $v$ 大于 $high$，那么我们就停止搜索；如果 $v$ 在 $[low, high]$ 的范围内，那么我们将 $v$ 加入答案中。然后，我们需要将 $v$ 的最后一位数字记为 $x$，如果 $x \gt 0$，那么我们将 $v \times 10 + x - 1$ 加入队列中；如果 $x \lt 9$，那么我们将 $v \times 10 + x + 1$ 加入队列中。重复上述操作，直到队列为空。

时间复杂度 $O(10 \times 2^{\log M})$，空间复杂度 $O(2^{\log M})$，其中 $M$ 为 $high$ 的位数。

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
// Stepping Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countSteppingNumbers(low int, high int) []int {
	ans := []int{}
	if low == 0 {
		ans = append(ans, 0)
	}
	q := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}
	for len(q) > 0 {
		v := q[0]
		q = q[1:]
		if v > high {
			break
		}
		if v >= low {
			ans = append(ans, v)
		}
		x := v % 10
		if x > 0 {
			q = append(q, v*10+x-1)
		}
		if x < 9 {
			q = append(q, v*10+x+1)
		}
	}
	return ans
}
```

### Java

```java
// Stepping Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> countSteppingNumbers(int low, int high) {
        List<Integer> ans = new ArrayList<>();
        if (low == 0) {
            ans.add(0);
        }
        Deque<Long> q = new ArrayDeque<>();
        for (long i = 1; i < 10; ++i) {
            q.offer(i);
        }
        while (!q.isEmpty()) {
            long v = q.pollFirst();
            if (v > high) {
                break;
            }
            if (v >= low) {
                ans.add((int) v);
            }
            int x = (int) v % 10;
            if (x > 0) {
                q.offer(v * 10 + x - 1);
            }
            if (x < 9) {
                q.offer(v * 10 + x + 1);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Stepping Numbers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countSteppingNumbers(self, low: int, high: int) -> List[int]:
        ans = []
        if low == 0:
            ans.append(0)
        q = deque(range(1, 10))
        while q:
            v = q.popleft()
            if v > high:
                break
            if v >= low:
                ans.append(v)
            x = v % 10
            if x:
                q.append(v * 10 + x - 1)
            if x < 9:
                q.append(v * 10 + x + 1)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

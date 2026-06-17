# 1306. Jump Game III

---
编号: 1306
题目: Jump Game III
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 数组]
来源链接: https://leetcode.com/problems/jump-game-iii/
---

## 题目描述

这里有一个非负整数数组 `arr`，你最开始位于该数组的起始下标 `start` 处。当你位于下标 `i` 处时，你可以跳到 `i + arr[i]` 或者 `i - arr[i]`。

请你判断自己是否能够跳到对应元素值为 0 的 **任一** 下标处。

注意，不管是什么情况下，你都无法跳到数组之外。

**示例 1：**

```text
输入：arr = [4,2,3,0,3,1,2], start = 5
输出：true
解释：
到达值为 0 的下标 3 有以下可能方案：
下标 5 -> 下标 4 -> 下标 1 -> 下标 3
下标 5 -> 下标 6 -> 下标 4 -> 下标 1 -> 下标 3
```

**示例 2：**

```text
输入：arr = [4,2,3,0,3,1,2], start = 0
输出：true
解释：
到达值为 0 的下标 3 有以下可能方案：
下标 0 -> 下标 4 -> 下标 1 -> 下标 3
```

**示例 3：**

```text
输入：arr = [3,0,2,1,2], start = 2
输出：false
解释：无法到达值为 0 的下标 1 处。
```

**提示：**

- `1 <= arr.length <= 5 * 10^4`

- `0 <= arr[i] < arr.length`

- `0 <= start < arr.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用 BFS 来判断是否能够到达值为 $0$ 的下标。

定义一个队列 $q$，用于存储当前能够到达的下标。初始时，将 $start$ 下标入队。

当队列不为空时，取出队首下标 $i$，如果 $arr[i] = 0$，则返回 `true`。否则，我们将下标 $i$ 标记为已访问，如果 $i + arr[i]$ 和 $i - arr[i]$ 在数组范围内且未被访问过，则将其入队，继续搜索。

最后，如果队列为空，说明无法到达值为 $0$ 的下标，返回 `false`。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为数组长度。

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
// Jump Game III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canReach(arr []int, start int) bool {
	q := []int{start}
	for len(q) > 0 {
		i := q[0]
		q = q[1:]
		if arr[i] == 0 {
			return true
		}
		x := arr[i]
		arr[i] = -1
		for _, j := range []int{i + x, i - x} {
			if j >= 0 && j < len(arr) && arr[j] >= 0 {
				q = append(q, j)
			}
		}
	}
	return false
}
```

### Java

```java
// Jump Game III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean canReach(int[] arr, int start) {
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(start);
        while (!q.isEmpty()) {
            int i = q.poll();
            if (arr[i] == 0) {
                return true;
            }
            int x = arr[i];
            arr[i] = -1;
            for (int j : List.of(i + x, i - x)) {
                if (j >= 0 && j < arr.length && arr[j] >= 0) {
                    q.offer(j);
                }
            }
        }
        return false;
    }
}
```

### Python

```python
# Jump Game III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canReach(self, arr: List[int], start: int) -> bool:
        q = deque([start])
        while q:
            i = q.popleft()
            if arr[i] == 0:
                return True
            x = arr[i]
            arr[i] = -1
            for j in (i + x, i - x):
                if 0 <= j < len(arr) and arr[j] >= 0:
                    q.append(j)
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

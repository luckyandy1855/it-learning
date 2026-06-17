# 1298. Maximum Candies You Can Get from Boxes

---
编号: 1298
题目: Maximum Candies You Can Get from Boxes
难度: 困难
标签: [广度优先搜索, 图, 数组]
来源链接: https://leetcode.com/problems/maximum-candies-you-can-get-from-boxes/
---

## 题目描述

给你 `n` 个盒子，每个盒子的格式为 `[status, candies, keys, containedBoxes]` ，其中：

- 状态字 `status[i]`：整数，如果 `box[i]` 是开的，那么是 **1 **，否则是 **0 **。

- 糖果数 `candies[i]`: 整数，表示 `box[i]` 中糖果的数目。

- 钥匙 `keys[i]`：数组，表示你打开 `box[i]` 后，可以得到一些盒子的钥匙，每个元素分别为该钥匙对应盒子的下标。

- 内含的盒子 `containedBoxes[i]`：整数，表示放在 `box[i]` 里的盒子所对应的下标。

给你一个整数数组 `initialBoxes`，包含你最初拥有的盒子。你可以拿走每个 **已打开盒子 **里的所有糖果，并且可以使用其中的钥匙去开启新的盒子，并且可以使用在其中发现的其他盒子。

请你按照上述规则，返回可以获得糖果的 **最大数目 **。

**示例 1：**

```text
输入：status = [1,0,1,0], candies = [7,5,4,100], keys = [[],[],[1],[]], containedBoxes = [[1,2],[3],[],[]], initialBoxes = [0]
输出：16
解释：
一开始你有盒子 0 。你将获得它里面的 7 个糖果和盒子 1 和 2。
盒子 1 目前状态是关闭的，而且你还没有对应它的钥匙。所以你将会打开盒子 2 ，并得到里面的 4 个糖果和盒子 1 的钥匙。
在盒子 1 中，你会获得 5 个糖果和盒子 3 ，但是你没法获得盒子 3 的钥匙所以盒子 3 会保持关闭状态。
你总共可以获得的糖果数目 = 7 + 4 + 5 = 16 个。
```

**示例 2：**

```text
输入：status = [1,0,0,0,0,0], candies = [1,1,1,1,1,1], keys = [[1,2,3,4,5],[],[],[],[],[]], containedBoxes = [[1,2,3,4,5],[],[],[],[],[]], initialBoxes = [0]
输出：6
解释：
你一开始拥有盒子 0 。打开它你可以找到盒子 1,2,3,4,5 和它们对应的钥匙。
打开这些盒子，你将获得所有盒子的糖果，所以总糖果数为 6 个。
```

**示例 3：**

```text
输入：status = [1,1,1], candies = [100,1,100], keys = [[],[0,2],[]], containedBoxes = [[],[],[]], initialBoxes = [1]
输出：1
```

**示例 4：**

```text
输入：status = [1], candies = [100], keys = [[]], containedBoxes = [[]], initialBoxes = []
输出：0
```

**示例 5：**

```text
输入：status = [1,1,1], candies = [2,3,2], keys = [[],[],[]], containedBoxes = [[],[],[]], initialBoxes = [2,1,0]
输出：7
```

**提示：**

- `1 <= status.length <= 1000`

- `status.length == candies.length == keys.length == containedBoxes.length == n`

- `status[i]` 要么是 `0` 要么是 `1` 。

- `1 <= candies[i] <= 1000`

- `0 <= keys[i].length <= status.length`

- `0 <= keys[i][j] < status.length`

- `keys[i]` 中的值都是互不相同的。

- `0 <= containedBoxes[i].length <= status.length`

- `0 <= containedBoxes[i][j] < status.length`

- `containedBoxes[i]` 中的值都是互不相同的。

- 每个盒子最多被一个盒子包含。

- `0 <= initialBoxes.length <= status.length`

- `0 <= initialBoxes[i] < status.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 图, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目给定一批盒子，每个盒子可能有状态（开/关）、糖果、钥匙、以及其他盒子。我们的目标是通过初始给定的一些盒子，尽可能多地打开更多盒子，并收集其中的糖果。可以通过获得钥匙来解锁新盒子，通过盒子中嵌套的盒子来获取更多资源。

我们采用 BFS 的方式模拟整个探索过程。

我们用一个队列 $q$ 表示当前可以访问的、**已经开启** 的盒子；用两个集合 $\textit{has}$ 和 $\textit{took}$ 分别记录**我们拥有的所有盒子**和**已经处理过的盒子**，防止重复。

初始时，将所有 $\textit{initialBoxes}$ 添加到 $\textit{has}$ 中，如果初始盒子状态为开启，立即加入队列 $\textit{q}$ 并累计糖果；

然后进行 BFS，依次从 $\textit{q}$ 中取出盒子：

- 获取盒子中的钥匙 $\textit{keys[box]}$，将能解锁的盒子加入队列；
- 收集盒子中包含的其他盒子 $\textit{containedBoxes[box]}$，如果状态是开启的且未处理过，则立即处理；

每个盒子最多处理一次，糖果累计一次，最终返回总糖果数 $\textit{ans}$。

时间复杂度 $O(n)$，空间复杂度 $O(n)$，其中 $n$ 是盒子的总数。

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
// Maximum Candies You Can Get from Boxes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxCandies(status []int, candies []int, keys [][]int, containedBoxes [][]int, initialBoxes []int) (ans int) {
	q := []int{}
	has := make(map[int]bool)
	took := make(map[int]bool)
	for _, box := range initialBoxes {
		has[box] = true
		if status[box] == 1 {
			q = append(q, box)
			took[box] = true
			ans += candies[box]
		}
	}
	for len(q) > 0 {
		box := q[0]
		q = q[1:]
		for _, k := range keys[box] {
			if status[k] == 0 {
				status[k] = 1
				if has[k] && !took[k] {
					q = append(q, k)
					took[k] = true
					ans += candies[k]
				}
			}
		}
		for _, b := range containedBoxes[box] {
			has[b] = true
			if status[b] == 1 && !took[b] {
				q = append(q, b)
				took[b] = true
				ans += candies[b]
			}
		}
	}
	return
}
```

### Java

```java
// Maximum Candies You Can Get from Boxes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int maxCandies(
        int[] status, int[] candies, int[][] keys, int[][] containedBoxes, int[] initialBoxes) {
        Deque<Integer> q = new ArrayDeque<>();
        Set<Integer> has = new HashSet<>();
        Set<Integer> took = new HashSet<>();
        int ans = 0;
        for (int box : initialBoxes) {
            has.add(box);
            if (status[box] == 1) {
                q.offer(box);
                took.add(box);
                ans += candies[box];
            }
        }
        while (!q.isEmpty()) {
            int box = q.poll();
            for (int k : keys[box]) {
                if (status[k] == 0) {
                    status[k] = 1;
                    if (has.contains(k) && !took.contains(k)) {
                        q.offer(k);
                        took.add(k);
                        ans += candies[k];
                    }
                }
            }
            for (int b : containedBoxes[box]) {
                has.add(b);
                if (status[b] == 1 && !took.contains(b)) {
                    q.offer(b);
                    took.add(b);
                    ans += candies[b];
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Candies You Can Get from Boxes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxCandies(
        self,
        status: List[int],
        candies: List[int],
        keys: List[List[int]],
        containedBoxes: List[List[int]],
        initialBoxes: List[int],
    ) -> int:
        q = deque()
        has, took = set(initialBoxes), set()
        ans = 0

        for box in initialBoxes:
            if status[box]:
                q.append(box)
                took.add(box)
                ans += candies[box]
        while q:
            box = q.popleft()
            for k in keys[box]:
                if not status[k]:
                    status[k] = 1
                    if k in has and k not in took:
                        q.append(k)
                        took.add(k)
                        ans += candies[k]

            for b in containedBoxes[box]:
                has.add(b)
                if status[b] and b not in took:
                    q.append(b)
                    took.add(b)
                    ans += candies[b]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

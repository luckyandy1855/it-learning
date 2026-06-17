# 1376. Time Needed to Inform All Employees

---
编号: 1376
题目: Time Needed to Inform All Employees
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索]
来源链接: https://leetcode.com/problems/time-needed-to-inform-all-employees/
---

## 题目描述

公司里有 `n` 名员工，每个员工的 ID 都是独一无二的，编号从 `0` 到 `n - 1`。公司的总负责人通过 `headID` 进行标识。

在 `manager` 数组中，每个员工都有一个直属负责人，其中 `manager[i]` 是第 `i` 名员工的直属负责人。对于总负责人，`manager[headID] = -1`。题目保证从属关系可以用树结构显示。

公司总负责人想要向公司所有员工通告一条紧急消息。他将会首先通知他的直属下属们，然后由这些下属通知他们的下属，直到所有的员工都得知这条紧急消息。

第 `i` 名员工需要 `informTime[i]` 分钟来通知它的所有直属下属（也就是说在 `informTime[i]` 分钟后，他的所有直属下属都可以开始传播这一消息）。

返回通知所有员工这一紧急消息所需要的 **分钟数** 。

**示例 1：**

```text
输入：n = 1, headID = 0, manager = [-1], informTime = [0]
输出：0
解释：公司总负责人是该公司的唯一一名员工。
```

**示例 2：**

```text
输入：n = 6, headID = 2, manager = [2,2,-1,2,2,2], informTime = [0,0,1,0,0,0]
输出：1
解释：id = 2 的员工是公司的总负责人，也是其他所有员工的直属负责人，他需要 1 分钟来通知所有员工。
上图显示了公司员工的树结构。
```

**提示：**

- `1 <= n <= 10^5`

- `0 <= headID < n`

- `manager.length == n`

- `0 <= manager[i] < n`

- `manager[headID] == -1`

- `informTime.length == n`

- `0 <= informTime[i] <= 1000`

- 如果员工 `i` 没有下属，`informTime[i] == 0` 。

- 题目 **保证** 所有员工都可以收到通知。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先根据 $manager$ 数组构建邻接表 $g$，其中 $g[i]$ 表示员工 $i$ 的所有直接下属。

接下来，我们设计一个函数 $dfs(i)$，表示从员工 $i$ 开始，将消息通知给他的所有下属（包括直接下属、间接下属）所需要的时间，那么答案就是 $dfs(headID)$。

在函数 $dfs(i)$ 中，我们需要遍历 $i$ 的所有直接下属 $j$，对于每个下属，员工 $i$ 需要将消息通知给他，这需要花费 $informTime[i]$ 的时间，而他的所有下属需要将消息通知给他们的下属，这需要花费 $dfs(j)$ 的时间，取 $informTime[i] + dfs(j)$ 的最大值作为函数 $dfs(i)$ 的返回值即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为员工数量。

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
// Time Needed to Inform All Employees：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numOfMinutes(n int, headID int, manager []int, informTime []int) int {
	g := make([][]int, n)
	for i, x := range manager {
		if x != -1 {
			g[x] = append(g[x], i)
		}
	}
	var dfs func(int) int
	dfs = func(i int) (ans int) {
		for _, j := range g[i] {
			ans = max(ans, dfs(j)+informTime[i])
		}
		return
	}
	return dfs(headID)
}
```

### Java

```java
// Time Needed to Inform All Employees：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<Integer>[] g;
    private int[] informTime;

    public int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
        g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        this.informTime = informTime;
        for (int i = 0; i < n; ++i) {
            if (manager[i] >= 0) {
                g[manager[i]].add(i);
            }
        }
        return dfs(headID);
    }

    private int dfs(int i) {
        int ans = 0;
        for (int j : g[i]) {
            ans = Math.max(ans, dfs(j) + informTime[i]);
        }
        return ans;
    }
}
```

### Python

```python
# Time Needed to Inform All Employees：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numOfMinutes(
        self, n: int, headID: int, manager: List[int], informTime: List[int]
    ) -> int:
        def dfs(i: int) -> int:
            ans = 0
            for j in g[i]:
                ans = max(ans, dfs(j) + informTime[i])
            return ans

        g = defaultdict(list)
        for i, x in enumerate(manager):
            g[x].append(i)
        return dfs(headID)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

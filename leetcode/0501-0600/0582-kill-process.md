# 0582. Kill Process

---
编号: 582
题目: Kill Process
难度: 中等
标签: [树, 深度优先搜索, 广度优先搜索, 数组, 哈希表]
来源链接: https://leetcode.com/problems/kill-process/
---

## 题目描述

系统中存在 `n` 个进程，形成一个有根树结构。给你两个整数数组 `pid` 和 `ppid` ，其中 `pid[i]` 是第 `i` 个进程的 ID ，`ppid[i]` 是第 `i` 个进程的父进程 ID 。

每一个进程只有 **一个父进程** ，但是可能会有 **一个或者多个子进程** 。只有一个进程的 `ppid[i] = 0` ，意味着这个进程 **没有父进程** 。

当一个进程 **被杀掉** 的时候，它所有的子进程和后代进程都要被杀掉。

给你一个整数 `kill` 表示要杀掉​​进程的 ID ，返回被杀掉的进程的 ID 列表。可以按 **任意顺序** 返回答案。

**示例 1：**

```text
输入：pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5
输出：[5,10]
解释：涂为红色的进程是应该被杀掉的进程。
```

**示例 2：**

```text
输入：pid = [1], ppid = [0], kill = 1
输出：[1]
```

**提示：**

- `n == pid.length`

- `n == ppid.length`

- `1 <= n <= 5 * 10^4`

- `1 <= pid[i] <= 5 * 10^4`

- `0 <= ppid[i] <= 5 * 10^4`

- 仅有一个进程没有父进程

- `pid` 中的所有值 **互不相同**

- 题目数据保证 `kill` 在 `pid` 中

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 深度优先搜索, 广度优先搜索, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先根据 $pid$ 和 $ppid$ 构建出图 $g$，其中 $g[i]$ 表示进程 $i$ 的所有子进程。然后从进程 $kill$ 开始，进行深度优先搜索，即可得到所有被杀掉的进程。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是进程的数量。

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
// Kill Process：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func killProcess(pid []int, ppid []int, kill int) (ans []int) {
	g := map[int][]int{}
	for i, p := range ppid {
		g[p] = append(g[p], pid[i])
	}
	var dfs func(int)
	dfs = func(i int) {
		ans = append(ans, i)
		for _, j := range g[i] {
			dfs(j)
		}
	}
	dfs(kill)
	return
}
```

### Java

```java
// Kill Process：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Map<Integer, List<Integer>> g = new HashMap<>();
    private List<Integer> ans = new ArrayList<>();

    public List<Integer> killProcess(List<Integer> pid, List<Integer> ppid, int kill) {
        int n = pid.size();
        for (int i = 0; i < n; ++i) {
            g.computeIfAbsent(ppid.get(i), k -> new ArrayList<>()).add(pid.get(i));
        }
        dfs(kill);
        return ans;
    }

    private void dfs(int i) {
        ans.add(i);
        for (int j : g.getOrDefault(i, Collections.emptyList())) {
            dfs(j);
        }
    }
}
```

### Python

```python
# Kill Process：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def killProcess(self, pid: List[int], ppid: List[int], kill: int) -> List[int]:
        def dfs(i: int):
            ans.append(i)
            for j in g[i]:
                dfs(j)

        g = defaultdict(list)
        for i, p in zip(pid, ppid):
            g[p].append(i)
        ans = []
        dfs(kill)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

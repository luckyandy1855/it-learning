# 0365. Water and Jug Problem

---
编号: 365
题目: Water and Jug Problem
难度: 中等
标签: [深度优先搜索, 广度优先搜索, 数学]
来源链接: https://leetcode.com/problems/water-and-jug-problem/
---

## 题目描述

有两个水壶，容量分别为 `x` 和 `y` 升。水的供应是无限的。确定是否有可能使用这两个壶准确得到 `target` 升。

你可以：

	- 装满任意一个水壶

	- 清空任意一个水壶

	- 将水从一个水壶倒入另一个水壶，直到接水壶已满，或倒水壶已空。

**示例 1:**

```text
输入: x = 3,y = 5,target = 4
输出: true
解释：
按照以下步骤操作，以达到总共 4 升水：
1. 装满 5 升的水壶(0, 5)。
2. 把 5 升的水壶倒进 3 升的水壶，留下 2 升(3, 2)。
3. 倒空 3 升的水壶(0, 2)。
4. 把 2 升水从 5 升的水壶转移到 3 升的水壶(2, 0)。
5. 再次加满 5 升的水壶(2, 5)。
6. 从 5 升的水壶向 3 升的水壶倒水直到 3 升的水壶倒满。5 升的水壶里留下了 4 升水(3, 4)。
7. 倒空 3 升的水壶。现在，5 升的水壶里正好有 4 升水(0, 4)。
参考：来自著名的 "Die Hard"
```

**示例 2:**

```text
输入: x = 2, y = 6, target = 5
输出: false
```

**示例 3:**

```text
输入: x = 1, y = 2, target = 3
输出: true
解释：同时倒满两个水壶。现在两个水壶中水的总量等于 3。
```

**提示:**

	- `1 <= x, y, target <= 10^3`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 广度优先搜索, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨记 $\textit{jug1Capacity}$ 为 $x$, $\textit{jug2Capacity}$ 为 $y$, $\textit{targetCapacity}$ 为 $z$。

接下来，我们设计一个函数 $dfs(i, j)$，表示当前 $jug1$ 中有 $i$ 升水，$jug2$ 中有 $j$ 升水，是否可以得到 $z$ 升水。

函数 $dfs(i, j)$ 的执行过程如下：

- 如果 $(i, j)$ 已经被访问过，返回 $false$。
- 如果 $i = z$ 或者 $j = z$ 或者 $i + j = z$，返回 $true$。
- 如果我们给 $jug1$ 倒满水，或者给 $jug2$ 倒满水，或者将 $jug1$ 清空，或者将 $jug2$ 清空，可以得到 $z$ 升水，返回 $true$。
- 如果我们将 $jug1$ 中的水倒入 $jug2$，或者将 $jug2$ 中的水倒入 $jug1$，可以得到 $z$ 升水，返回 $true$。

答案即为 $dfs(0, 0)$。

时间复杂度 $O(x + y)$，空间复杂度 $O(x + y)$。其中 $x$ 和 $y$ 分别为 $\textit{jug1Capacity}$ 和 $\textit{jug2Capacity}$。

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
// Water and Jug Problem：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canMeasureWater(x int, y int, z int) bool {
	type pair struct{ x, y int }
	vis := map[pair]bool{}
	var dfs func(int, int) bool
	dfs = func(i, j int) bool {
		st := pair{i, j}
		if vis[st] {
			return false
		}
		vis[st] = true
		if i == z || j == z || i+j == z {
			return true
		}
		if dfs(x, j) || dfs(i, y) || dfs(0, j) || dfs(i, 0) {
			return true
		}
		a := min(i, y-j)
		b := min(j, x-i)
		return dfs(i-a, j+a) || dfs(i+b, j-b)
	}
	return dfs(0, 0)
}
```

### Java

```java
// Water and Jug Problem：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Set<Long> vis = new HashSet<>();
    private int x, y, z;

    public boolean canMeasureWater(int jug1Capacity, int jug2Capacity, int targetCapacity) {
        x = jug1Capacity;
        y = jug2Capacity;
        z = targetCapacity;
        return dfs(0, 0);
    }

    private boolean dfs(int i, int j) {
        long st = f(i, j);
        if (!vis.add(st)) {
            return false;
        }
        if (i == z || j == z || i + j == z) {
            return true;
        }
        if (dfs(x, j) || dfs(i, y) || dfs(0, j) || dfs(i, 0)) {
            return true;
        }
        int a = Math.min(i, y - j);
        int b = Math.min(j, x - i);
        return dfs(i - a, j + a) || dfs(i + b, j - b);
    }

    private long f(int i, int j) {
        return i * 1000000L + j;
    }
}
```

### Python

```python
# Water and Jug Problem：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canMeasureWater(self, x: int, y: int, z: int) -> bool:
        def dfs(i: int, j: int) -> bool:
            if (i, j) in vis:
                return False
            vis.add((i, j))
            if i == z or j == z or i + j == z:
                return True
            if dfs(x, j) or dfs(i, y) or dfs(0, j) or dfs(i, 0):
                return True
            a = min(i, y - j)
            b = min(j, x - i)
            return dfs(i - a, j + a) or dfs(i + b, j - b)

        vis = set()
        return dfs(0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

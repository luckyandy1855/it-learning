# 1406. Stone Game III

---
编号: 1406
题目: Stone Game III
难度: 困难
标签: [数组, 数学, 动态规划, 博弈]
来源链接: https://leetcode.com/problems/stone-game-iii/
---

## 题目描述

Alice 和 Bob 继续他们的石子游戏。几堆石子 **排成一行** ，每堆石子都对应一个得分，由数组 `stoneValue` 给出。

Alice 和 Bob 轮流取石子，**Alice** 总是先开始。在每个玩家的回合中，该玩家可以拿走剩下石子中的的前 **1、2 或 3 堆石子** 。比赛一直持续到所有石头都被拿走。

每个玩家的最终得分为他所拿到的每堆石子的对应得分之和。每个玩家的初始分数都是 **0** 。

比赛的目标是决出最高分，得分最高的选手将会赢得比赛，比赛也可能会出现平局。

假设 Alice 和 Bob 都采取 **最优策略** 。

如果 Alice 赢了就返回 `"Alice"` *，*Bob 赢了就返回* *`"Bob"`*，*分数相同返回 `"Tie"` 。

**示例 1：**

```text
输入：values = [1,2,3,7]
输出："Bob"
解释：Alice 总是会输，她的最佳选择是拿走前三堆，得分变成 6 。但是 Bob 的得分为 7，Bob 获胜。
```

**示例 2：**

```text
输入：values = [1,2,3,-9]
输出："Alice"
解释：Alice 要想获胜就必须在第一个回合拿走前三堆石子，给 Bob 留下负分。
如果 Alice 只拿走第一堆，那么她的得分为 1，接下来 Bob 拿走第二、三堆，得分为 5 。之后 Alice 只能拿到分数 -9 的石子堆，输掉比赛。
如果 Alice 拿走前两堆，那么她的得分为 3，接下来 Bob 拿走第三堆，得分为 3 。之后 Alice 只能拿到分数 -9 的石子堆，同样会输掉比赛。
注意，他们都应该采取 最优策略 ，所以在这里 Alice 将选择能够使她获胜的方案。
```

**示例 3：**

```text
输入：values = [1,2,3,6]
输出："Tie"
解释：Alice 无法赢得比赛。如果她决定选择前三堆，她可以以平局结束比赛，否则她就会输。
```

**提示：**

- `1 <= stoneValue.length <= 5 * 10^4`

- `-1000 <= stoneValue[i] <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 动态规划, 博弈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(i)$，表示当前玩家在 $[i, n)$ 范围内进行游戏时，可以获得的最大得分差值。如果 $dfs(0) \gt 0$，则表示先手玩家 Alice 可以获胜；如果 $dfs(0) \lt 0$，则表示后手玩家 Bob 可以获胜；否则，表示两人打成平局。

函数 $dfs(i)$ 的执行逻辑如下：

- 如果 $i \geq n$，说明当前没有石子可以拿了，直接返回 $0$ 即可；
- 否则，我们枚举当前玩家拿走前 $j+1$ 堆石子，其中 $j \in \{0, 1, 2\}$，那么另一个玩家在下一轮可以获得的得分差值为 $dfs(i + j + 1)$，从而当前玩家可以获得的得分差值为 $\sum_{k=i}^{i+j} stoneValue[k] - dfs(i + j + 1)$。我们要使得当前玩家的得分差值最大，因此可以用 $\max$ 函数得到最大得分差值，即：


dfs(i) = \max_{j \in \{0, 1, 2\}} \left\{\sum_{k=i}^{i+j} stoneValue[k] - dfs(i + j + 1)\right\}


为了防止重复计算，我们可以使用记忆化搜索。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是石子的堆数。

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
// Stone Game III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func stoneGameIII(stoneValue []int) string {
	n := len(stoneValue)
	f := make([]int, n)
	const inf = 1 << 30
	for i := range f {
		f[i] = inf
	}
	var dfs func(int) int
	dfs = func(i int) int {
		if i >= n {
			return 0
		}
		if f[i] != inf {
			return f[i]
		}
		ans, s := -(1 << 30), 0
		for j := 0; j < 3 && i+j < n; j++ {
			s += stoneValue[i+j]
			ans = max(ans, s-dfs(i+j+1))
		}
		f[i] = ans
		return ans
	}
	ans := dfs(0)
	if ans == 0 {
		return "Tie"
	}
	if ans > 0 {
		return "Alice"
	}
	return "Bob"
}
```

### Java

```java
// Stone Game III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] stoneValue;
    private Integer[] f;
    private int n;

    public String stoneGameIII(int[] stoneValue) {
        n = stoneValue.length;
        f = new Integer[n];
        this.stoneValue = stoneValue;
        int ans = dfs(0);
        if (ans == 0) {
            return "Tie";
        }
        return ans > 0 ? "Alice" : "Bob";
    }

    private int dfs(int i) {
        if (i >= n) {
            return 0;
        }
        if (f[i] != null) {
            return f[i];
        }
        int ans = -(1 << 30);
        int s = 0;
        for (int j = 0; j < 3 && i + j < n; ++j) {
            s += stoneValue[i + j];
            ans = Math.max(ans, s - dfs(i + j + 1));
        }
        return f[i] = ans;
    }
}
```

### Python

```python
# Stone Game III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def stoneGameIII(self, stoneValue: List[int]) -> str:
        @cache
        def dfs(i: int) -> int:
            if i >= n:
                return 0
            ans, s = -inf, 0
            for j in range(3):
                if i + j >= n:
                    break
                s += stoneValue[i + j]
                ans = max(ans, s - dfs(i + j + 1))
            return ans

        n = len(stoneValue)
        ans = dfs(0)
        if ans == 0:
            return 'Tie'
        return 'Alice' if ans > 0 else 'Bob'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

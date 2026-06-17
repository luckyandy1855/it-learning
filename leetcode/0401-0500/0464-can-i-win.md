# 0464. Can I Win

---
编号: 464
题目: Can I Win
难度: 中等
标签: [位运算, 记忆化, 数学, 动态规划, 位掩码, 博弈]
来源链接: https://leetcode.com/problems/can-i-win/
---

## 题目描述

在 "100 game" 这个游戏中，两名玩家轮流选择从 `1` 到 `10` 的任意整数，累计整数和，先使得累计整数和 **达到或超过**  100 的玩家，即为胜者。

如果我们将游戏规则改为 “玩家 **不能** 重复使用整数” 呢？

例如，两个玩家可以轮流从公共整数池中抽取从 1 到 15 的整数（不放回），直到累计整数和 >= 100。

给定两个整数 `maxChoosableInteger` （整数池中可选择的最大数）和 `desiredTotal`（累计和），若先出手的玩家能稳赢则返回 `true` ，否则返回 `false` 。假设两位玩家游戏时都表现 **最佳** 。

**示例 1：**

```text
输入：maxChoosableInteger = 10, desiredTotal = 11
输出：false
解释：
无论第一个玩家选择哪个整数，他都会失败。
第一个玩家可以选择从 1 到 10 的整数。
如果第一个玩家选择 1，那么第二个玩家只能选择从 2 到 10 的整数。
第二个玩家可以通过选择整数 10（那么累积和为 11 >= desiredTotal），从而取得胜利.
同样地，第一个玩家选择任意其他整数，第二个玩家都会赢。
```

**示例 2:**

```text
输入：maxChoosableInteger = 10, desiredTotal = 0
输出：true
```

**示例 3:**

```text
输入：maxChoosableInteger = 10, desiredTotal = 1
输出：true
```

**提示:**

- `1 <= maxChoosableInteger <= 20`

- `0 <= desiredTotal <= 300`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 记忆化, 数学, 动态规划, 位掩码, 博弈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断可以选择的所有整数的和是否小于目标值，如果是，说明无论如何都无法赢，直接返回 `false`。

然后，我们设计一个函数 $\textit{dfs}(mask, s)$，其中 `mask` 表示当前已选择的整数的状态，`s` 表示当前的累计和。函数返回值为当前玩家是否能赢。

函数 $\textit{dfs}(mask, s)$ 的执行过程如下：

我们遍历 $1$ 到 $maxChoosableInteger$ 中的每个整数 $i$，如果 $i$ 还没有被选择，我们可以选择 $i$，如果选择 $i$ 后的累计和 $s + i$ 大于等于目标值 `desiredTotal`，或者对手选择 $i$ 后的结果是输的，那么当前玩家就是赢的，返回 `true`。

如果没有任何一个选择能让当前玩家赢，那么当前玩家就是输的，返回 `false`。

为了避免重复计算，我们使用一个哈希表 `f` 记录已经计算过的状态，键为 `mask`，值为当前玩家是否能赢。

时间复杂度 $O(2^n)$，空间复杂度 $O(2^n)$。其中 $n$ 是 `maxChoosableInteger`。

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
// Can I Win：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canIWin(maxChoosableInteger int, desiredTotal int) bool {
	if (1+maxChoosableInteger)*maxChoosableInteger/2 < desiredTotal {
		return false
	}
	f := map[int]bool{}
	var dfs func(int, int) bool
	dfs = func(mask, s int) bool {
		if v, ok := f[mask]; ok {
			return v
		}
		for i := 1; i <= maxChoosableInteger; i++ {
			if mask>>i&1 == 0 {
				if s+i >= desiredTotal || !dfs(mask|1<<i, s+i) {
					f[mask] = true
					return true
				}
			}
		}
		f[mask] = false
		return false
	}
	return dfs(0, 0)
}
```

### Java

```java
// Can I Win：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private Map<Integer, Boolean> f = new HashMap<>();
    private int maxChoosableInteger;
    private int desiredTotal;

    public boolean canIWin(int maxChoosableInteger, int desiredTotal) {
        if ((1 + maxChoosableInteger) * maxChoosableInteger / 2 < desiredTotal) {
            return false;
        }
        this.maxChoosableInteger = maxChoosableInteger;
        this.desiredTotal = desiredTotal;
        return dfs(0, 0);
    }

    private boolean dfs(int mask, int s) {
        if (f.containsKey(mask)) {
            return f.get(mask);
        }
        for (int i = 0; i < maxChoosableInteger; ++i) {
            if ((mask >> i & 1) == 0) {
                if (s + i + 1 >= desiredTotal || !dfs(mask | 1 << i, s + i + 1)) {
                    f.put(mask, true);
                    return true;
                }
            }
        }
        f.put(mask, false);
        return false;
    }
}
```

### Python

```python
# Can I Win：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canIWin(self, maxChoosableInteger: int, desiredTotal: int) -> bool:
        @cache
        def dfs(mask: int, s: int) -> bool:
            for i in range(1, maxChoosableInteger + 1):
                if mask >> i & 1 ^ 1:
                    if s + i >= desiredTotal or not dfs(mask | 1 << i, s + i):
                        return True
            return False

        if (1 + maxChoosableInteger) * maxChoosableInteger // 2 < desiredTotal:
            return False
        return dfs(0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

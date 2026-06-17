# 0294. Flip Game II

---
编号: 294
题目: Flip Game II
难度: 中等
标签: [记忆化, 数学, 动态规划, 回溯, 博弈]
来源链接: https://leetcode.com/problems/flip-game-ii/
---

## 题目描述

你和朋友玩一个叫做「翻转游戏」的游戏。游戏规则如下：

给你一个字符串 `currentState` ，其中只含 `'+'` 和 `'-'` 。你和朋友轮流将 **连续 **的两个 `"++"` 反转成 `"--"` 。当一方无法进行有效的翻转时便意味着游戏结束，则另一方获胜。默认每个人都会采取最优策略。

请你写出一个函数来判定起始玩家 **是否存在必胜的方案** ：如果存在，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```text
输入：currentState = "++++"
输出：true
解释：起始玩家可将中间的 "++" 翻转变为 "+--+" 从而得胜。
```

**示例 2：**

```text
输入：currentState = "+"
输出：false
```

**提示：**

- `1 <= currentState.length <= 60`

- `currentState[i]` 不是 `'+'` 就是 `'-'`

- 不能有超过 20 个连续的 `'+'`。

**进阶：**请推导你算法的时间复杂度。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「记忆化, 数学, 动态规划, 回溯, 博弈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Flip Game II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func canWin(currentState string) bool {
	n := len(currentState)
	memo := map[int]bool{}
	mask := 0
	for i, c := range currentState {
		if c == '+' {
			mask |= 1 << i
		}
	}
	var dfs func(int) bool
	dfs = func(mask int) bool {
		if v, ok := memo[mask]; ok {
			return v
		}
		for i := 0; i < n-1; i++ {
			if (mask&(1<<i)) == 0 || (mask&(1<<(i+1))) == 0 {
				continue
			}
			if dfs(mask ^ (1 << i) ^ (1 << (i + 1))) {
				continue
			}
			memo[mask] = true
			return true
		}
		memo[mask] = false
		return false
	}
	return dfs(mask)
}
```

### Java

```java
import java.util.*;
// Flip Game II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private int n;
    private Map<Long, Boolean> memo = new HashMap<>();

    public boolean canWin(String currentState) {
        long mask = 0;
        n = currentState.length();
        for (int i = 0; i < n; ++i) {
            if (currentState.charAt(i) == '+') {
                mask |= 1 << i;
            }
        }
        return dfs(mask);
    }

    private boolean dfs(long mask) {
        if (memo.containsKey(mask)) {
            return memo.get(mask);
        }
        for (int i = 0; i < n - 1; ++i) {
            if ((mask & (1 << i)) == 0 || (mask & (1 << (i + 1))) == 0) {
                continue;
            }
            if (dfs(mask ^ (1 << i) ^ (1 << (i + 1)))) {
                continue;
            }
            memo.put(mask, true);
            return true;
        }
        memo.put(mask, false);
        return false;
    }
}
```

### Python

```python
# Flip Game II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def canWin(self, currentState: str) -> bool:
        @cache
        def dfs(mask):
            for i in range(n - 1):
                if (mask & (1 << i)) == 0 or (mask & (1 << (i + 1)) == 0):
                    continue
                if dfs(mask ^ (1 << i) ^ (1 << (i + 1))):
                    continue
                return True
            return False

        mask, n = 0, len(currentState)
        for i, c in enumerate(currentState):
            if c == '+':
                mask |= 1 << i
        return dfs(mask)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

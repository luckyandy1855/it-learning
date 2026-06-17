# 0789. Escape The Ghosts

---
编号: 789
题目: Escape The Ghosts
难度: 中等
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/escape-the-ghosts/
---

## 题目描述

你在进行一个简化版的吃豆人游戏。你从 `[0, 0]` 点开始出发，你的目的地是 `target = [xtarget, ytarget]` 。地图上有一些阻碍者，以数组 `ghosts` 给出，第 `i` 个阻碍者从 `ghosts[i] = [xi, yi]` 出发。所有输入均为 **整数坐标** 。

每一回合，你和阻碍者们可以同时向东，西，南，北四个方向移动，每次可以移动到距离原位置 **1 个单位** 的新位置。当然，也可以选择 **不动** 。所有动作 **同时** 发生。

如果你可以在任何阻碍者抓住你 **之前** 到达目的地（阻碍者可以采取任意行动方式），则被视为逃脱成功。如果你和阻碍者 **同时** 到达了一个位置（包括目的地） **都不算** 是逃脱成功。

如果不管阻碍者怎么移动都可以成功逃脱时，输出 `true` ；否则，输出 `false` 。

**示例 1：**

```text
输入：ghosts = [[1,0],[0,3]], target = [0,1]
输出：true
解释：你可以直接一步到达目的地 (0,1) ，在 (1, 0) 或者 (0, 3) 位置的阻碍者都不可能抓住你。
```

**示例 2：**

```text
输入：ghosts = [[1,0]], target = [2,0]
输出：false
解释：你需要走到位于 (2, 0) 的目的地，但是在 (1, 0) 的阻碍者位于你和目的地之间。
```

**示例 3：**

```text
输入：ghosts = [[2,0]], target = [1,0]
输出：false
解释：阻碍者可以和你同时达到目的地。
```

**提示：**

- `1 i, yi target, ytarget <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于任意一个阻碍者，如果它到目的地的曼哈顿距离小于等于你到目的地的曼哈顿距离，那么它就可以在你到达目的地之前抓住你。因此，我们只需要判断所有阻碍者到目的地的曼哈顿距离是否都大于你到目的地的曼哈顿距离即可。

时间复杂度 $O(n)$，空间复杂度 $O(1)$。其中 $n$ 为阻碍者的数量。

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
// Escape The Ghosts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func escapeGhosts(ghosts [][]int, target []int) bool {
	tx, ty := target[0], target[1]
	for _, g := range ghosts {
		x, y := g[0], g[1]
		if abs(tx-x)+abs(ty-y) <= abs(tx)+abs(ty) {
			return false
		}
	}
	return true
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Escape The Ghosts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean escapeGhosts(int[][] ghosts, int[] target) {
        int tx = target[0], ty = target[1];
        for (var g : ghosts) {
            int x = g[0], y = g[1];
            if (Math.abs(tx - x) + Math.abs(ty - y) <= Math.abs(tx) + Math.abs(ty)) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Escape The Ghosts：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def escapeGhosts(self, ghosts: List[List[int]], target: List[int]) -> bool:
        tx, ty = target
        return all(abs(tx - x) + abs(ty - y) > abs(tx) + abs(ty) for x, y in ghosts)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

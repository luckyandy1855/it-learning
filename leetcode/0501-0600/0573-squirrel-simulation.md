# 0573. Squirrel Simulation

---
编号: 573
题目: Squirrel Simulation
难度: 中等
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/squirrel-simulation/
---

## 题目描述

给你两个整数 `height` 和 `width` ，代表一个大小为 `height x width` 的花园。你还得到了以下信息：

- 一个数组 `tree` ，其中 `tree = [treer, treec]` 是花园中树的位置，

- 一个数组 `squirrel` ，其中 `squirrel = [squirrelr, squirrelc]` 是花园中松鼠的位置，

- 一个数组 `nuts` ，其中 `nuts[i] = [nutir, nutic]` 是花园中第 `i^th` 个坚果的位置。

松鼠一次最多只能携带一个坚果，并且能够向上、下、左、右四个方向移动到相邻的单元格。

返回松鼠收集所有坚果并逐一放在树下的 **最小距离** 。

**距离** 是指移动的次数。

示例 1：

```text
输入：height = 5, width = 7, tree = [2,2], squirrel = [4,4], nuts = [[3,0], [2,5]]
输出：12
解释：为实现最小的距离，松鼠应该先摘 [2, 5] 位置的坚果。
```

示例 2：

```text
输入：height = 1, width = 3, tree = [0,1], squirrel = [0,0], nuts = [[0,2]]
输出：3
```

**提示：**

- `1 r, squirrelr, nutir c, squirrelc, nutic <= width`

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

我们观察松鼠的移动路径，可以发现，松鼠会首先移动到某个坚果的位置，然后移动到树的位置。接下来，松鼠的移动路径之和等于“其余坚果到树的位置之和”再乘以 $2$。

因此，我们只需要选出一个坚果，作为松鼠的第一个目标，使得其到树的位置之和最小，即可得到最小路径。

时间复杂度 $O(n)$，其中 $n$ 为坚果的数量。空间复杂度 $O(1)$。

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
// Squirrel Simulation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minDistance(height int, width int, tree []int, squirrel []int, nuts [][]int) int {
	tr, tc := tree[0], tree[1]
	sr, sc := squirrel[0], squirrel[1]
	s := 0
	for _, e := range nuts {
		s += abs(e[0]-tr) + abs(e[1]-tc)
	}
	s <<= 1
	ans := math.MaxInt32
	for _, e := range nuts {
		a := abs(e[0]-tr) + abs(e[1]-tc)
		b := abs(e[0]-sr) + abs(e[1]-sc)
		ans = min(ans, s-a+b)
	}
	return ans
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
// Squirrel Simulation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import static java.lang.Math.*;

class Solution {
    public int minDistance(int height, int width, int[] tree, int[] squirrel, int[][] nuts) {
        int tr = tree[0], tc = tree[1];
        int sr = squirrel[0], sc = squirrel[1];
        int s = 0;
        for (var e : nuts) {
            s += abs(e[0] - tr) + abs(e[1] - tc);
        }
        s <<= 1;
        int ans = Integer.MAX_VALUE;
        for (var e : nuts) {
            int a = abs(e[0] - tr) + abs(e[1] - tc);
            int b = abs(e[0] - sr) + abs(e[1] - sc);
            ans = min(ans, s - a + b);
        }
        return ans;
    }
}
```

### Python

```python
# Squirrel Simulation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minDistance(
        self,
        height: int,
        width: int,
        tree: List[int],
        squirrel: List[int],
        nuts: List[List[int]],
    ) -> int:
        tr, tc = tree
        sr, sc = squirrel
        s = sum(abs(r - tr) + abs(c - tc) for r, c in nuts) * 2
        ans = inf
        for r, c in nuts:
            a = abs(r - tr) + abs(c - tc)
            b = abs(r - sr) + abs(c - sc)
            ans = min(ans, s - a + b)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

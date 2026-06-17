# 0874. Walking Robot Simulation

---
编号: 874
题目: Walking Robot Simulation
难度: 中等
标签: [数组, 哈希表, 模拟]
来源链接: https://leetcode.com/problems/walking-robot-simulation/
---

## 题目描述

机器人在一个无限大小的 XY 网格平面上行走，从点 `(0, 0)` 处开始出发，面向北方。该机器人可以接收以下三种类型的命令 `commands` ：

- `-2` ：向左转 `90` 度

- `-1` ：向右转 `90` 度

- `1 i, yi)` 。

机器人无法走到障碍物上，它将会停留在障碍物的前一个网格方块上，并继续执行下一个命令。

返回机器人距离原点的 **最大欧式距离** 的 **平方** 。（即，如果距离为 `5` ，则返回 `25` ）

**注意：**

	北方表示 +Y 方向。

	东方表示 +X 方向。

	南方表示 -Y 方向。

	西方表示 -X 方向。

	原点 [0,0] 可能会有障碍物。

**示例 1：**

```text
输入：commands = [4,-1,3], obstacles = []
输出：25
解释：
机器人开始位于 (0, 0)：
1. 向北移动 4 个单位，到达 (0, 4)
2. 右转
3. 向东移动 3 个单位，到达 (3, 4)
距离原点最远的是 (3, 4) ，距离为 32 + 42 = 25
```

**示例 2：**

```text
输入：commands = [4,-1,4,-2,4], obstacles = [[2,4]]
输出：65
解释：机器人开始位于 (0, 0)：
1. 向北移动 4 个单位，到达 (0, 4)
2. 右转
3. 向东移动 1 个单位，然后被位于 (2, 4) 的障碍物阻挡，机器人停在 (1, 4)
4. 左转
5. 向北走 4 个单位，到达 (1, 8)
距离原点最远的是 (1, 8) ，距离为 12 + 82 = 65
```

**示例 3：**

```text
输入：commands = [6,-1,-1,6], obstacles = []
输出：36
解释：机器人开始位于 (0, 0):
1. 向北移动 6 个单位，到达 (0, 6).
2. 右转
3. 右转
4. 向南移动 6 个单位，到达 (0, 0).
机器人距离原点最远的点是 (0, 6)，其距离的平方是 62 = 36 个单位。
```

**提示：**

- `1 i, yi <= 3 * 10^4`

- 答案保证小于 `2^31`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个长度为 $5$ 的方向数组 $dirs=[0, 1, 0, -1, 0]$，数组中的相邻两个元素表示一个方向。即 $(dirs[0], dirs[1])$ 表示向北，而 $(dirs[1], dirs[2])$ 表示向东，以此类推。

我们使用一个哈希表 $s$ 来存储所有障碍物的坐标，这样可以在 $O(1)$ 的时间内判断下一步是否会遇到障碍物。

另外，使用两个变量 $x$ 和 $y$ 来表示机器人当前所在的坐标，初始时 $x = y = 0$。变量 $k$ 表示机器人当前的方向，答案变量 $ans$ 表示机器人距离原点的最大欧式距离的平方。

接下来，我们遍历数组 $commands$ 中的每个元素 $c$：

- 如果 $c = -2$，表示机器人向左转 $90$ 度，即 $k = (k + 3) \bmod 4$；
- 如果 $c = -1$，表示机器人向右转 $90$ 度，即 $k = (k + 1) \bmod 4$；
- 否则，表示机器人向前移动 $c$ 个单位长度。我们将机器人当前的方向 $k$ 与方向数组 $dirs$ 结合，即可得到机器人在 $x$ 轴和 $y$ 轴上的增量。我们将 $c$ 个单位长度的增量分别累加到 $x$ 和 $y$ 上，并判断每次移动后的新坐标 $(nx, ny)$ 是否在障碍物的坐标中，如果不在，则更新答案 $ans$，否则停止模拟，进行下一条指令的模拟。

最后返回答案 $ans$ 即可。

时间复杂度 $O(C \times n + m)$，空间复杂度 $O(m)$。其中 $C$ 表示每次可以移动的最大步数，而 $n$ 和 $m$ 分别表示数组 $commands$ 和数组 $obstacles$ 的长度。

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
// Walking Robot Simulation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func robotSim(commands []int, obstacles [][]int) (ans int) {
	dirs := [5]int{0, 1, 0, -1, 0}
	type pair struct{ x, y int }
	s := map[pair]bool{}
	for _, e := range obstacles {
		s[pair{e[0], e[1]}] = true
	}
	var x, y, k int
	for _, c := range commands {
		if c == -2 {
			k = (k + 3) % 4
		} else if c == -1 {
			k = (k + 1) % 4
		} else {
			for ; c > 0 && !s[pair{x + dirs[k], y + dirs[k+1]}]; c-- {
				x += dirs[k]
				y += dirs[k+1]
				ans = max(ans, x*x+y*y)
			}
		}
	}
	return
}
```

### Java

```java
// Walking Robot Simulation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int robotSim(int[] commands, int[][] obstacles) {
        int[] dirs = {0, 1, 0, -1, 0};
        Set<Integer> s = new HashSet<>(obstacles.length);
        for (var e : obstacles) {
            s.add(f(e[0], e[1]));
        }
        int ans = 0, k = 0;
        int x = 0, y = 0;
        for (int c : commands) {
            if (c == -2) {
                k = (k + 3) % 4;
            } else if (c == -1) {
                k = (k + 1) % 4;
            } else {
                while (c-- > 0) {
                    int nx = x + dirs[k], ny = y + dirs[k + 1];
                    if (s.contains(f(nx, ny))) {
                        break;
                    }
                    x = nx;
                    y = ny;
                    ans = Math.max(ans, x * x + y * y);
                }
            }
        }
        return ans;
    }

    private int f(int x, int y) {
        return x * 60010 + y;
    }
}
```

### Python

```python
# Walking Robot Simulation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def robotSim(self, commands: List[int], obstacles: List[List[int]]) -> int:
        dirs = (0, 1, 0, -1, 0)
        s = {(x, y) for x, y in obstacles}
        ans = k = 0
        x = y = 0
        for c in commands:
            if c == -2:
                k = (k + 3) % 4
            elif c == -1:
                k = (k + 1) % 4
            else:
                for _ in range(c):
                    nx, ny = x + dirs[k], y + dirs[k + 1]
                    if (nx, ny) in s:
                        break
                    x, y = nx, ny
                    ans = max(ans, x * x + y * y)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

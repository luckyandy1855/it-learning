# 0489. Robot Room Cleaner

---
编号: 489
题目: Robot Room Cleaner
难度: 困难
标签: [回溯, 交互]
来源链接: https://leetcode.com/problems/robot-room-cleaner/
---

## 题目描述

房间中的某个位置上有一个机器人，你需要控制它清扫房间。房间被建模为一个 `m x n` 的二进制网格，其中 `0` 表示单元格中有障碍物，`1` 表示空单元格。

机器人从一个未知的空单元格开始出发，并且你无法访问网格，但你可以使用给定的 API `Robot` 控制机器人。

你的任务是使用机器人清扫整个房间（即清理房间中的每个空单元格）。机器人具有四个给定的API，可以前进、向左转或向右转。每次转弯 `90` 度。

当机器人试图移动到一个存在障碍物的单元格时，它的碰撞传感器会检测到障碍物，并停留在当前单元格。

设计一个算法，使用下述 API 清扫整个房间：

```text
interface Robot {
  // 若下一个单元格为空，则返回 true ，并移动至该单元格。
  // 若下一个单元格为障碍物，则返回 false ，并停留在当前单元格。
  boolean move();

  // 在调用 turnLeft/turnRight 后机器人会停留在当前单元格。
  // 每次转弯 90 度。
  void turnLeft();
  void turnRight();

  // 清理当前单元格。
  void clean();
}
```

**注意** 扫地机器人的初始方向向上。你可以假定网格的四周都被墙包围。

**自定义测试：**

输入只用于初始化房间和机器人的位置。你需要「盲解」这个问题。换而言之，你必须在对房间和机器人位置一无所知的情况下，只使用 4 个给出的 API 解决问题。

**示例 1：**

```text
输入：room = [[1,1,1,1,1,0,1,1],[1,1,1,1,1,0,1,1],[1,0,1,1,1,1,1,1],[0,0,0,1,0,0,0,0],[1,1,1,1,1,1,1,1]], row = 1, col = 3
输出：Robot cleaned all rooms.
解释：
房间内的所有单元格用 0 或 1 填充。
0 表示障碍物，1 表示可以通过。
机器人从 row=1, col=3 的初始位置出发。
在左上角的一行以下，三列以右。
```

**示例 2：**

```text
输入：room = [[1]], row = 0, col = 0
输出：Robot cleaned all rooms.
```

**提示：**

- `m == room.length`

- `n == room[i].length`

- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「回溯, 交互」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们不妨假设机器人的初始位置为 $(0, 0)$，方向为 $d=0$。我们将初始位置进行打扫，并标记为已访问。然后，我们依次选择上、右、下、左四个方向进行探索，每次探索前都先判断是否已经访问过，如果没有访问过，我们就朝着该方向前进一步，然后递归探索。如果已经访问过，我们就顺时针旋转 $90^\circ$，然后继续探索下一个方向。当我们探索完所有的方向后，我们需要回到上一个位置，这时我们只需要顺时针旋转 $180^\circ$，然后前进一步，再顺时针旋转 $180^\circ$ 即可。

时间复杂度 $O(4^{n-m})$，空间复杂度 $O(n-m)$。其中 $n$ 和 $m$ 分别是房间的数量以及障碍物的数量。

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
// Robot Room Cleaner：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * // This is the robot's control interface.
 * // You should not implement it, or speculate about its implementation
 * type Robot struct {
 * }
 *
 * // Returns true if the cell in front is open and robot moves into the cell.
 * // Returns false if the cell in front is blocked and robot stays in the current cell.
 * func (robot *Robot) Move() bool {}
 *
 * // Robot will stay in the same cell after calling TurnLeft/TurnRight.
 * // Each turn will be 90 degrees.
 * func (robot *Robot) TurnLeft() {}
 * func (robot *Robot) TurnRight() {}
 *
 * // Clean the current cell.
 * func (robot *Robot) Clean() {}
 */

func cleanRoom(robot *Robot) {
	vis := map[[2]int]bool{}
	dirs := [5]int{-1, 0, 1, 0, -1}
	var dfs func(int, int, int)
	dfs = func(i, j, d int) {
		vis[[2]int{i, j}] = true
		robot.Clean()
		for k := 0; k < 4; k++ {
			nd := (d + k) % 4
			x, y := i+dirs[nd], j+dirs[nd+1]
			if !vis[[2]int{x, y}] && robot.Move() {
				dfs(x, y, nd)
				robot.TurnRight()
				robot.TurnRight()
				robot.Move()
				robot.TurnRight()
				robot.TurnRight()
			}
			robot.TurnRight()
		}
	}
	dfs(0, 0, 0)
}
```

### Java

```java
// Robot Room Cleaner：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * // This is the robot's control interface.
 * // You should not implement it, or speculate about its implementation
 * interface Robot {
 *     // Returns true if the cell in front is open and robot moves into the cell.
 *     // Returns false if the cell in front is blocked and robot stays in the current cell.
 *     public boolean move();
 *
 *     // Robot will stay in the same cell after calling turnLeft/turnRight.
 *     // Each turn will be 90 degrees.
 *     public void turnLeft();
 *     public void turnRight();
 *
 *     // Clean the current cell.
 *     public void clean();
 * }
 */

class Solution {
    private int[] dirs = {-1, 0, 1, 0, -1};
    private Set<List<Integer>> vis = new HashSet<>();
    private Robot robot;

    public void cleanRoom(Robot robot) {
        this.robot = robot;
        dfs(0, 0, 0);
    }

    private void dfs(int i, int j, int d) {
        robot.clean();
        vis.add(List.of(i, j));
        for (int k = 0; k < 4; ++k) {
            int nd = (d + k) % 4;
            int x = i + dirs[nd], y = j + dirs[nd + 1];
            if (!vis.contains(List.of(x, y)) && robot.move()) {
                dfs(x, y, nd);
                robot.turnRight();
                robot.turnRight();
                robot.move();
                robot.turnRight();
                robot.turnRight();
            }
            robot.turnRight();
        }
    }
}
```

### Python

```python
# Robot Room Cleaner：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# """
# This is the robot's control interface.
# You should not implement it, or speculate about its implementation
# """
# class Robot:
#    def move(self):
#        """
#        Returns true if the cell in front is open and robot moves into the cell.
#        Returns false if the cell in front is blocked and robot stays in the current cell.
#        :rtype bool
#        """
#
#    def turnLeft(self):
#        """
#        Robot will stay in the same cell after calling turnLeft/turnRight.
#        Each turn will be 90 degrees.
#        :rtype void
#        """
#
#    def turnRight(self):
#        """
#        Robot will stay in the same cell after calling turnLeft/turnRight.
#        Each turn will be 90 degrees.
#        :rtype void
#        """
#
#    def clean(self):
#        """
#        Clean the current cell.
#        :rtype void
#        """


class Solution:
    def cleanRoom(self, robot):
        """
        :type robot: Robot
        :rtype: None
        """

        def dfs(i, j, d):
            vis.add((i, j))
            robot.clean()
            for k in range(4):
                nd = (d + k) % 4
                x, y = i + dirs[nd], j + dirs[nd + 1]
                if (x, y) not in vis and robot.move():
                    dfs(x, y, nd)
                    robot.turnRight()
                    robot.turnRight()
                    robot.move()
                    robot.turnRight()
                    robot.turnRight()
                robot.turnRight()

        dirs = (-1, 0, 1, 0, -1)
        vis = set()
        dfs(0, 0, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

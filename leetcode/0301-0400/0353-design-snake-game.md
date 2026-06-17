# 0353. Design Snake Game

---
编号: 353
题目: Design Snake Game
难度: 中等
标签: [设计, 队列, 数组, 哈希表, 模拟]
来源链接: https://leetcode.com/problems/design-snake-game/
---

## 题目描述

请你设计一个 贪吃蛇游戏，该游戏将会在一个 **屏幕尺寸 = 宽度 x 高度 **的屏幕上运行。如果你不熟悉这个游戏，可以 点击这里 在线试玩。

起初时，蛇在左上角的 `(0, 0)`** **位置，身体长度为 `1` 个单位。

你将会被给出一个数组形式的食物位置序列 `food` ，其中 `food[i] = (ri, ci)` 。当蛇吃到食物时，身子的长度会增加 `1` 个单位，得分也会 `+1` 。

食物不会同时出现，会按列表的顺序逐一显示在屏幕上。比方讲，第一个食物被蛇吃掉后，第二个食物才会出现。

当一个食物在屏幕上出现时，保证 **不会** 出现在被蛇身体占据的格子里。

如果蛇越界（与边界相撞）或者头与 **移动后** 的身体相撞（即，身长为 `4` 的蛇无法与自己相撞），游戏结束。

实现 `SnakeGame` 类：

	- `SnakeGame(int width, int height, int[][] food)` 初始化对象，屏幕大小为 `height x width` ，食物位置序列为 `food`

	- `int move(String direction)` 返回蛇在方向 `direction` 上移动后的得分。如果游戏结束，返回 `-1` 。

**示例 1：**

```text
输入：
["SnakeGame", "move", "move", "move", "move", "move", "move"]
[[3, 2, [[1, 2], [0, 1]]], ["R"], ["D"], ["R"], ["U"], ["L"], ["U"]]
输出：
[null, 0, 0, 1, 1, 2, -1]

解释：
SnakeGame snakeGame = new SnakeGame(3, 2, [[1, 2], [0, 1]]);
snakeGame.move("R"); // 返回 0
snakeGame.move("D"); // 返回 0
snakeGame.move("R"); // 返回 1 ，蛇吃掉了第一个食物，同时第二个食物出现在 (0, 1)
snakeGame.move("U"); // 返回 1
snakeGame.move("L"); // 返回 2 ，蛇吃掉了第二个食物，没有出现更多食物
snakeGame.move("U"); // 返回 -1 ，蛇与边界相撞，游戏结束
```

**提示：**

	- `1 i i < width`

	- `direction.length == 1`

	- `direction` is `'U'`, `'D'`, `'L'`, or `'R'`.

	- 最多调用 `10^4` 次 `move` 方法

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 队列, 数组, 哈希表, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用双端队列来模拟蛇的移动。

定义一个双端队列 $q$，其中保存蛇的身体坐标，队头为蛇头，队尾为蛇尾。同时使用一个集合 $vis$ 来保存蛇的身体坐标，用于快速判断蛇头是否与蛇身相撞。

定义一个变量 $score$ 来保存蛇的得分，初始值为 $0$；定义一个变量 $idx$ 来保存当前食物的索引，初始值为 $0$。

每次移动时，首先判断蛇头是否与边界相撞，如果相撞则游戏结束，返回 $-1$；否则，判断蛇头是否与食物重合，如果重合则蛇的得分加 $1$，同时食物索引 $idx$ 加 $1$；否则，蛇的身体长度不变，需要将蛇尾从队尾弹出，并从集合 $vis$ 中删除对应的坐标。

然后，判断蛇头是否与蛇身相撞，如果相撞则游戏结束，返回 $-1$；否则，将蛇头的坐标加入集合 $vis$ 中，并从队头加入蛇头的坐标。

最后，返回蛇的得分 $score$。

时间复杂度 $O(k)$，空间复杂度 $O(k)$，其中 $k$ 为移动的次数。

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
// Design Snake Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type SnakeGame struct {
	m     int
	n     int
	food  [][]int
	score int
	idx   int
	q     []int
	vis   map[int]bool
}

func Constructor(width int, height int, food [][]int) SnakeGame {
	return SnakeGame{height, width, food, 0, 0, []int{0}, map[int]bool{}}
}

func (this *SnakeGame) Move(direction string) int {
	f := func(i, j int) int {
		return i*this.n + j
	}
	p := this.q[0]
	i, j := p/this.n, p%this.n
	x, y := i, j
	if direction == "U" {
		x--
	} else if direction == "D" {
		x++
	} else if direction == "L" {
		y--
	} else {
		y++
	}
	if x < 0 || x >= this.m || y < 0 || y >= this.n {
		return -1
	}
	if this.idx < len(this.food) && x == this.food[this.idx][0] && y == this.food[this.idx][1] {
		this.score++
		this.idx++
	} else {
		t := this.q[len(this.q)-1]
		this.q = this.q[:len(this.q)-1]
		this.vis[t] = false
	}
	cur := f(x, y)
	if this.vis[cur] {
		return -1
	}
	this.q = append([]int{cur}, this.q...)
	this.vis[cur] = true
	return this.score
}

/**
 * Your SnakeGame object will be instantiated and called as such:
 * obj := Constructor(width, height, food);
 * param_1 := obj.Move(direction);
 */
```

### Java

```java
// Design Snake Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class SnakeGame {
    private int m;
    private int n;
    private int[][] food;
    private int score;
    private int idx;
    private Deque<Integer> q = new ArrayDeque<>();
    private Set<Integer> vis = new HashSet<>();

    public SnakeGame(int width, int height, int[][] food) {
        m = height;
        n = width;
        this.food = food;
        q.offer(0);
        vis.add(0);
    }

    public int move(String direction) {
        int p = q.peekFirst();
        int i = p / n, j = p % n;
        int x = i, y = j;
        if ("U".equals(direction)) {
            --x;
        } else if ("D".equals(direction)) {
            ++x;
        } else if ("L".equals(direction)) {
            --y;
        } else {
            ++y;
        }
        if (x < 0 || x >= m || y < 0 || y >= n) {
            return -1;
        }
        if (idx < food.length && x == food[idx][0] && y == food[idx][1]) {
            ++score;
            ++idx;
        } else {
            int t = q.pollLast();
            vis.remove(t);
        }
        int cur = f(x, y);
        if (vis.contains(cur)) {
            return -1;
        }
        q.offerFirst(cur);
        vis.add(cur);
        return score;
    }

    private int f(int i, int j) {
        return i * n + j;
    }
}

/**
 * Your SnakeGame object will be instantiated and called as such:
 * SnakeGame obj = new SnakeGame(width, height, food);
 * int param_1 = obj.move(direction);
 */
```

### Python

```python
# Design Snake Game：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class SnakeGame:
    def __init__(self, width: int, height: int, food: List[List[int]]):
        self.m = height
        self.n = width
        self.food = food
        self.score = 0
        self.idx = 0
        self.q = deque([(0, 0)])
        self.vis = {(0, 0)}

    def move(self, direction: str) -> int:
        i, j = self.q[0]
        x, y = i, j
        match direction:
            case "U":
                x -= 1
            case "D":
                x += 1
            case "L":
                y -= 1
            case "R":
                y += 1
        if x < 0 or x >= self.m or y < 0 or y >= self.n:
            return -1
        if (
            self.idx < len(self.food)
            and x == self.food[self.idx][0]
            and y == self.food[self.idx][1]
        ):
            self.score += 1
            self.idx += 1
        else:
            self.vis.remove(self.q.pop())
        if (x, y) in self.vis:
            return -1
        self.q.appendleft((x, y))
        self.vis.add((x, y))
        return self.score


# Your SnakeGame object will be instantiated and called as such:
# obj = SnakeGame(width, height, food)
# param_1 = obj.move(direction)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

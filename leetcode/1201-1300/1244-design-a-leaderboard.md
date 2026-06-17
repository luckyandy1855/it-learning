# 1244. Design A Leaderboard

---
编号: 1244
题目: Design A Leaderboard
难度: 中等
标签: [设计, 哈希表, 排序]
来源链接: https://leetcode.com/problems/design-a-leaderboard/
---

## 题目描述

新一轮的「力扣杯」编程大赛即将启动，为了动态显示参赛者的得分数据，需要设计一个排行榜 Leaderboard。

请你帮忙来设计这个 `Leaderboard` 类，使得它有如下 3 个函数：

- `addScore(playerId, score)`：

    	- 假如参赛者已经在排行榜上，就给他的当前得分增加 `score` 点分值并更新排行。

    	- 假如该参赛者不在排行榜上，就把他添加到榜单上，并且将分数设置为 `score`。

    - `top(K)`：返回前 `K` 名参赛者的 **得分总和**。

    - `reset(playerId)`：将指定参赛者的成绩清零（换句话说，将其从排行榜中删除）。题目保证在调用此函数前，该参赛者已有成绩，并且在榜单上。

请注意，在初始状态下，排行榜是空的。

**示例 1：**

```text
输入：
["Leaderboard","addScore","addScore","addScore","addScore","addScore","top","reset","reset","addScore","top"]
[[],[1,73],[2,56],[3,39],[4,51],[5,4],[1],[1],[2],[2,51],[3]]
输出：
[null,null,null,null,null,null,73,null,null,null,141]

解释：
Leaderboard leaderboard = new Leaderboard ();
leaderboard.addScore(1,73);   // leaderboard = [[1,73]];
leaderboard.addScore(2,56);   // leaderboard = [[1,73],[2,56]];
leaderboard.addScore(3,39);   // leaderboard = [[1,73],[2,56],[3,39]];
leaderboard.addScore(4,51);   // leaderboard = [[1,73],[2,56],[3,39],[4,51]];
leaderboard.addScore(5,4);    // leaderboard = [[1,73],[2,56],[3,39],[4,51],[5,4]];
leaderboard.top(1);           // returns 73;
leaderboard.reset(1);         // leaderboard = [[2,56],[3,39],[4,51],[5,4]];
leaderboard.reset(2);         // leaderboard = [[3,39],[4,51],[5,4]];
leaderboard.addScore(2,51);   // leaderboard = [[2,51],[3,39],[4,51],[5,4]];
leaderboard.top(3);           // returns 141 = 51 + 51 + 39;
```

**提示：**

- `1 <= playerId, K <= 10000`

- 题目保证 `K` 小于或等于当前参赛者的数量

- `1 <= score <= 100`

- 最多进行 `1000` 次函数调用

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 $d$ 记录每个参赛者的分数，用有序列表 $rank$ 记录所有参赛者的分数。

当调用 `addScore` 函数时，我们先判断参赛者是否在哈希表 $d$ 中，如果不在，我们将其分数加入有序列表 $rank$ 中，否则我们先将其分数从有序列表 $rank$ 中删除，再将其分数加入有序列表 $rank$ 中，最后更新哈希表 $d$ 中的分数。时间复杂度 $O(\log n)$。

当调用 `top` 函数时，我们直接返回有序列表 $rank$ 中前 $K$ 个元素的和。时间复杂度 $O(K \times \log n)$。

当调用 `reset` 函数时，我们先移除哈希表 $d$ 中的参赛者，再将其分数从有序列表 $rank$ 中移除。时间复杂度 $O(\log n)$。

空间复杂度 $O(n)$。其中 $n$ 为参赛者的数量。

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

### Java

```java
// Design A Leaderboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Leaderboard {
    private Map<Integer, Integer> d = new HashMap<>();
    private TreeMap<Integer, Integer> rank = new TreeMap<>((a, b) -> b - a);

    public Leaderboard() {
    }

    public void addScore(int playerId, int score) {
        d.merge(playerId, score, Integer::sum);
        int newScore = d.get(playerId);
        if (newScore != score) {
            rank.merge(newScore - score, -1, Integer::sum);
        }
        rank.merge(newScore, 1, Integer::sum);
    }

    public int top(int K) {
        int ans = 0;
        for (var e : rank.entrySet()) {
            int score = e.getKey(), cnt = e.getValue();
            cnt = Math.min(cnt, K);
            ans += score * cnt;
            K -= cnt;
            if (K == 0) {
                break;
            }
        }
        return ans;
    }

    public void reset(int playerId) {
        int score = d.remove(playerId);
        if (rank.merge(score, -1, Integer::sum) == 0) {
            rank.remove(score);
        }
    }
}

/**
 * Your Leaderboard object will be instantiated and called as such:
 * Leaderboard obj = new Leaderboard();
 * obj.addScore(playerId,score);
 * int param_2 = obj.top(K);
 * obj.reset(playerId);
 */
```

### Python

```python
# Design A Leaderboard：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Leaderboard:
    def __init__(self):
        self.d = defaultdict(int)
        self.rank = SortedList()

    def addScore(self, playerId: int, score: int) -> None:
        if playerId not in self.d:
            self.d[playerId] = score
            self.rank.add(score)
        else:
            self.rank.remove(self.d[playerId])
            self.d[playerId] += score
            self.rank.add(self.d[playerId])

    def top(self, K: int) -> int:
        return sum(self.rank[-K:])

    def reset(self, playerId: int) -> None:
        self.rank.remove(self.d.pop(playerId))


# Your Leaderboard object will be instantiated and called as such:
# obj = Leaderboard()
# obj.addScore(playerId,score)
# param_2 = obj.top(K)
# obj.reset(playerId)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

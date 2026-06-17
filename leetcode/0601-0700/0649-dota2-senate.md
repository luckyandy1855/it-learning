# 0649. Dota2 Senate

---
编号: 649
题目: Dota2 Senate
难度: 中等
标签: [贪心, 队列, 字符串]
来源链接: https://leetcode.com/problems/dota2-senate/
---

## 题目描述

Dota2 的世界里有两个阵营：`Radiant`（天辉）和 `Dire`（夜魇）

Dota2 参议院由来自两派的参议员组成。现在参议院希望对一个 Dota2 游戏里的改变作出决定。他们以一个基于轮为过程的投票进行。在每一轮中，每一位参议员都可以行使两项权利中的 **一 **项：

- **剥夺一名参议员的权利**：一名参议员可以使另一名参议员在本轮及所有后续轮次中失去所有权利。

- **宣布胜利**：如果参议员发现有权利投票的参议员都是 **同一个阵营的** ，他可以宣布胜利并决定在游戏中的有关变化。

给你一个字符串 `senate` 代表每个参议员的阵营。字母 `'R'` 和 `'D'`分别代表了 `Radiant`（天辉）和 `Dire`（夜魇）。然后，如果有 `n` 个参议员，给定字符串的大小将是 `n`。

以轮为基础的过程从给定顺序的第一个参议员开始到最后一个参议员结束。这一过程将持续到投票结束。所有失去权利的参议员将在过程中被跳过。

假设每一位参议员都足够聪明，会为自己的政党做出最好的策略，你需要预测哪一方最终会宣布胜利并在 Dota2 游戏中决定改变。输出应该是 `"Radiant"` 或 `"Dire"` 。

示例 1：

```text
输入：senate = "RD"
输出："Radiant"
解释：
第 1 轮时，第一个参议员来自 Radiant 阵营，他可以使用第一项权利让第二个参议员失去所有权利。
这一轮中，第二个参议员将会被跳过，因为他的权利被禁止了。
第 2 轮时，第一个参议员可以宣布胜利，因为他是唯一一个有投票权的人。
```

示例 2：

```text
输入：senate = "RDD"
输出："Dire"
解释：
第 1 轮时，第一个来自 Radiant 阵营的参议员可以使用第一项权利禁止第二个参议员的权利。
这一轮中，第二个来自 Dire 阵营的参议员会将被跳过，因为他的权利被禁止了。
这一轮中，第三个来自 Dire 阵营的参议员可以使用他的第一项权利禁止第一个参议员的权利。
因此在第二轮只剩下第三个参议员拥有投票的权利,于是他可以宣布胜利
```

**提示：**

- `n == senate.length`

- `1 <= n <= 10^4`

- `senate[i]` 为 `'R'` 或 `'D'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 队列, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们创建两个队列 $qr$ 和 $qd$，分别记录天辉和夜魇阵营的参议员的下标。然后我们开始进行模拟，每一轮各从队首取出一位参议员，然后根据他的阵营进行不同的操作：

- 如果天辉阵营的参议员编号小于夜魇阵营的参议员编号，那么该天辉阵营的参议员就可以将夜魇阵营的参议员票权永久取消，我们将天辉阵营的参议员的下标加 $n$ 后重新放回队尾，表示该参议员会参与下一轮的投票。
- 如果夜魇阵营的参议员编号小于天辉阵营的参议员编号，那么该夜魇阵营的参议员就可以将天辉阵营的参议员票权永久取消，我们将夜魇阵营的参议员的下标加 $n$ 后重新放回队尾，表示该参议员会参与下一轮的投票。

最后当队列中只剩一种阵营的参议员时，该阵营的参议员获胜。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为参议员的数量。

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
// Dota2 Senate：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func predictPartyVictory(senate string) string {
	n := len(senate)
	qr := []int{}
	qd := []int{}
	for i, c := range senate {
		if c == 'R' {
			qr = append(qr, i)
		} else {
			qd = append(qd, i)
		}
	}
	for len(qr) > 0 && len(qd) > 0 {
		r, d := qr[0], qd[0]
		qr, qd = qr[1:], qd[1:]
		if r < d {
			qr = append(qr, r+n)
		} else {
			qd = append(qd, d+n)
		}
	}
	if len(qr) > 0 {
		return "Radiant"
	}
	return "Dire"
}
```

### Java

```java
// Dota2 Senate：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String predictPartyVictory(String senate) {
        int n = senate.length();
        Deque<Integer> qr = new ArrayDeque<>();
        Deque<Integer> qd = new ArrayDeque<>();
        for (int i = 0; i < n; ++i) {
            if (senate.charAt(i) == 'R') {
                qr.offer(i);
            } else {
                qd.offer(i);
            }
        }
        while (!qr.isEmpty() && !qd.isEmpty()) {
            if (qr.peek() < qd.peek()) {
                qr.offer(qr.peek() + n);
            } else {
                qd.offer(qd.peek() + n);
            }
            qr.poll();
            qd.poll();
        }
        return qr.isEmpty() ? "Dire" : "Radiant";
    }
}
```

### Python

```python
# Dota2 Senate：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def predictPartyVictory(self, senate: str) -> str:
        qr = deque()
        qd = deque()
        for i, c in enumerate(senate):
            if c == "R":
                qr.append(i)
            else:
                qd.append(i)
        n = len(senate)
        while qr and qd:
            if qr[0] < qd[0]:
                qr.append(qr[0] + n)
            else:
                qd.append(qd[0] + n)
            qr.popleft()
            qd.popleft()
        return "Radiant" if qr else "Dire"
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

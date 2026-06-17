# 0735. Asteroid Collision

---
编号: 735
题目: Asteroid Collision
难度: 中等
标签: [栈, 数组, 模拟]
来源链接: https://leetcode.com/problems/asteroid-collision/
---

## 题目描述

给定一个整数数组 `asteroids`，表示在同一行的小行星。数组中小行星的索引表示它们在空间中的相对位置。

对于数组中的每一个元素，其绝对值表示小行星的大小，正负表示小行星的移动方向（正表示向右移动，负表示向左移动）。每一颗小行星以相同的速度移动。

找出碰撞后剩下的所有小行星。碰撞规则：两个小行星相互碰撞，较小的小行星会爆炸。如果两颗小行星大小相同，则两颗小行星都会爆炸。两颗移动方向相同的小行星，永远不会发生碰撞。

示例 1：

```text
输入：asteroids = [5,10,-5]
输出：[5,10]
解释：10 和 -5 碰撞后只剩下 10 。 5 和 10 永远不会发生碰撞。
```

示例 2：

```text
输入：asteroids = [8,-8]
输出：[]
解释：8 和 -8 碰撞后，两者都发生爆炸。
```

示例 3：

```text
输入：asteroids = [10,2,-5]
输出：[10]
解释：2 和 -5 发生碰撞后剩下 -5 。10 和 -5 发生碰撞后剩下 10 。
```

示例 4：

```text
输入：asteroids = [3,5,-6,2,-1,4]
输出：[-6,2,4]
解释：小行星 -6 使小行星 3 和 5 爆炸，然后继续向左移动。在另一边，小行星 2 使小行星 -1 爆炸，然后继续向右移动，没有碰撞小行星 4。
```

**提示：**

- `2 <= asteroids.length <= 10^4`

- `-1000 <= asteroids[i] <= 1000`

- `asteroids[i] != 0`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们从左到右遍历每个小行星 $x$，由于每个小行星可能与之前的多个小行星发生碰撞，考虑用栈来存储。

- 对于当前小行星，如果 $x \gt 0$，那么它一定不会跟前面的小行星发生碰撞，我们可以直接将 $x$ 入栈。
- 否则，如果栈不为空并且栈顶元素大于 $0$，且栈顶元素小于 $-x$，那么栈顶元素对应的小行星会发生爆炸，我们循环将栈顶元素出栈，直到不满足条件。此时如果栈顶元素等于 $-x$，那么两个小行星会发生爆炸，只需要将栈顶元素出栈即可；如果栈为空，或者栈顶元素小于 $0$，那么当前小行星不会发生碰撞，我们将 $x$ 入栈。

最后我们返回栈中的元素即为答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是数组 $asteroids$ 的长度。

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
// Asteroid Collision：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func asteroidCollision(asteroids []int) (stk []int) {
	for _, x := range asteroids {
		if x > 0 {
			stk = append(stk, x)
		} else {
			for len(stk) > 0 && stk[len(stk)-1] > 0 && stk[len(stk)-1] < -x {
				stk = stk[:len(stk)-1]
			}
			if len(stk) > 0 && stk[len(stk)-1] == -x {
				stk = stk[:len(stk)-1]
			} else if len(stk) == 0 || stk[len(stk)-1] < 0 {
				stk = append(stk, x)
			}
		}
	}
	return
}
```

### Java

```java
// Asteroid Collision：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stk = new ArrayDeque<>();
        for (int x : asteroids) {
            if (x > 0) {
                stk.offerLast(x);
            } else {
                while (!stk.isEmpty() && stk.peekLast() > 0 && stk.peekLast() < -x) {
                    stk.pollLast();
                }
                if (!stk.isEmpty() && stk.peekLast() == -x) {
                    stk.pollLast();
                } else if (stk.isEmpty() || stk.peekLast() < 0) {
                    stk.offerLast(x);
                }
            }
        }
        return stk.stream().mapToInt(Integer::valueOf).toArray();
    }
}
```

### Python

```python
# Asteroid Collision：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stk = []
        for x in asteroids:
            if x > 0:
                stk.append(x)
            else:
                while stk and stk[-1] > 0 and stk[-1] < -x:
                    stk.pop()
                if stk and stk[-1] == -x:
                    stk.pop()
                elif not stk or stk[-1] < 0:
                    stk.append(x)
        return stk
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

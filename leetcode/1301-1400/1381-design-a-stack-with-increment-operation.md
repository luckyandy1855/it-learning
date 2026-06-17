# 1381. Design a Stack With Increment Operation

---
编号: 1381
题目: Design a Stack With Increment Operation
难度: 中等
标签: [栈, 设计, 数组]
来源链接: https://leetcode.com/problems/design-a-stack-with-increment-operation/
---

## 题目描述

请你设计一个支持对其元素进行增量操作的栈。

实现自定义栈类 `CustomStack` ：

- `CustomStack(int maxSize)`：用 `maxSize` 初始化对象，`maxSize` 是栈中最多能容纳的元素数量。

- `void push(int x)`：如果栈还未增长到 `maxSize` ，就将 `x` 添加到栈顶。

- `int pop()`：弹出栈顶元素，并返回栈顶的值，或栈为空时返回 **-1** 。

- `void inc(int k, int val)`：栈底的 `k` 个元素的值都增加 `val` 。如果栈中元素总数小于 `k` ，则栈中的所有元素都增加 `val` 。

**示例：**

```text
输入：
["CustomStack","push","push","pop","push","push","push","increment","increment","pop","pop","pop","pop"]
[[3],[1],[2],[],[2],[3],[4],[5,100],[2,100],[],[],[],[]]
输出：
[null,null,null,2,null,null,null,null,null,103,202,201,-1]
解释：
CustomStack stk = new CustomStack(3); // 栈是空的 []
stk.push(1);                          // 栈变为 [1]
stk.push(2);                          // 栈变为 [1, 2]
stk.pop();                            // 返回 2 --> 返回栈顶值 2，栈变为 [1]
stk.push(2);                          // 栈变为 [1, 2]
stk.push(3);                          // 栈变为 [1, 2, 3]
stk.push(4);                          // 栈仍然是 [1, 2, 3]，不能添加其他元素使栈大小变为 4
stk.increment(5, 100);                // 栈变为 [101, 102, 103]
stk.increment(2, 100);                // 栈变为 [201, 202, 103]
stk.pop();                            // 返回 103 --> 返回栈顶值 103，栈变为 [201, 202]
stk.pop();                            // 返回 202 --> 返回栈顶值 202，栈变为 [201]
stk.pop();                            // 返回 201 --> 返回栈顶值 201，栈变为 []
stk.pop();                            // 返回 -1 --> 栈为空，返回 -1
```

**提示：**

- `1 <= maxSize, x, k <= 1000`

- `0 <= val <= 100`

- 每种方法 `increment`，`push` 以及 `pop` 分别最多调用 `1000` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 设计, 数组」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个数组 $stk$ 来模拟栈，用一个整数 $i$ 表示下一个入栈的元素位置。另外，我们还需要一个数组 $add$ 来记录每个位置上的增量累加值。

调用 $push(x)$ 时，如果 $i \lt maxSize$，我们将 $x$ 放入 $stk[i]$ 中，并将 $i$ 加一。

调用 $pop()$ 时，如果 $i \leq 0$，说明栈为空，返回 $-1$。否则我们将 $i$ 减一，答案为 $stk[i] + add[i]$，然后我们将 $add[i - 1]$ 加上 $add[i]$，并将 $add[i]$ 清零。最后返回答案。

调用 $increment(k, val)$ 时，如果 $i \gt 0$，我们将 $add[\min(i, k) - 1]$ 加上 $val$。

时间复杂度 $O(1)$，空间复杂度 $O(n)$。其中 $n$ 是栈的最大容量。

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
// Design a Stack With Increment Operation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type CustomStack struct {
	stk []int
	add []int
	i   int
}

func Constructor(maxSize int) CustomStack {
	return CustomStack{make([]int, maxSize), make([]int, maxSize), 0}
}

func (this *CustomStack) Push(x int) {
	if this.i < len(this.stk) {
		this.stk[this.i] = x
		this.i++
	}
}

func (this *CustomStack) Pop() int {
	if this.i <= 0 {
		return -1
	}
	this.i--
	ans := this.stk[this.i] + this.add[this.i]
	if this.i > 0 {
		this.add[this.i-1] += this.add[this.i]
	}
	this.add[this.i] = 0
	return ans
}

func (this *CustomStack) Increment(k int, val int) {
	if this.i > 0 {
		this.add[min(k, this.i)-1] += val
	}
}

/**
 * Your CustomStack object will be instantiated and called as such:
 * obj := Constructor(maxSize);
 * obj.Push(x);
 * param_2 := obj.Pop();
 * obj.Increment(k,val);
 */
```

### Java

```java
// Design a Stack With Increment Operation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class CustomStack {
    private int[] stk;
    private int[] add;
    private int i;

    public CustomStack(int maxSize) {
        stk = new int[maxSize];
        add = new int[maxSize];
    }

    public void push(int x) {
        if (i < stk.length) {
            stk[i++] = x;
        }
    }

    public int pop() {
        if (i <= 0) {
            return -1;
        }
        int ans = stk[--i] + add[i];
        if (i > 0) {
            add[i - 1] += add[i];
        }
        add[i] = 0;
        return ans;
    }

    public void increment(int k, int val) {
        if (i > 0) {
            add[Math.min(i, k) - 1] += val;
        }
    }
}

/**
 * Your CustomStack object will be instantiated and called as such:
 * CustomStack obj = new CustomStack(maxSize);
 * obj.push(x);
 * int param_2 = obj.pop();
 * obj.increment(k,val);
 */
```

### Python

```python
# Design a Stack With Increment Operation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class CustomStack:
    def __init__(self, maxSize: int):
        self.stk = [0] * maxSize
        self.add = [0] * maxSize
        self.i = 0

    def push(self, x: int) -> None:
        if self.i < len(self.stk):
            self.stk[self.i] = x
            self.i += 1

    def pop(self) -> int:
        if self.i <= 0:
            return -1
        self.i -= 1
        ans = self.stk[self.i] + self.add[self.i]
        if self.i > 0:
            self.add[self.i - 1] += self.add[self.i]
        self.add[self.i] = 0
        return ans

    def increment(self, k: int, val: int) -> None:
        i = min(k, self.i) - 1
        if i >= 0:
            self.add[i] += val


# Your CustomStack object will be instantiated and called as such:
# obj = CustomStack(maxSize)
# obj.push(x)
# param_2 = obj.pop()
# obj.increment(k,val)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

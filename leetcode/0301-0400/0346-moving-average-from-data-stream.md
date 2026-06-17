# 0346. Moving Average from Data Stream

---
编号: 346
题目: Moving Average from Data Stream
难度: 简单
标签: [设计, 队列, 数组, 数据流]
来源链接: https://leetcode.com/problems/moving-average-from-data-stream/
---

## 题目描述

给定一个整数数据流和一个窗口大小，根据该滑动窗口的大小，计算其所有整数的移动平均值。

实现 `MovingAverage` 类：

	- `MovingAverage(int size)` 用窗口大小 `size` 初始化对象。

	- `double next(int val)` 计算并返回数据流中最后 `size` 个值的移动平均值。

**示例：**

```text
输入：
["MovingAverage", "next", "next", "next", "next"]
[[3], [1], [10], [3], [5]]
输出：
[null, 1.0, 5.5, 4.66667, 6.0]

解释：
MovingAverage movingAverage = new MovingAverage(3);
movingAverage.next(1); // 返回 1.0 = 1 / 1
movingAverage.next(10); // 返回 5.5 = (1 + 10) / 2
movingAverage.next(3); // 返回 4.66667 = (1 + 10 + 3) / 3
movingAverage.next(5); // 返回 6.0 = (10 + 3 + 5) / 3
```

**提示：**

	- `1 <= size <= 1000`

	- `-10^5 <= val <= 10^5`

	- 最多调用 `next` 方法 `10^4` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 队列, 数组, 数据流」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个变量 $\textit{s}$，用于计算当前最后 $\textit{size}$ 个元素的和，用一个变量 $\textit{cnt}$ 记录当前元素的总数。另外，我们用一个长度为 $\textit{size}$ 的数组 $\textit{data}$ 记录每个位置的元素对应的值。

调用 $\textit{next}$ 函数时，我们先计算出 $\textit{val}$ 要存放的下标 $i$，然后我们更新元素和 $s$，并且将下标 $i$ 处的值设置为 $\textit{val}$，同时将元素的个数加一。最后，我们返回 $\frac{s}{\min(\textit{cnt}, \textit{size})}$ 的值即可。

时间复杂度 $O(1)$，空间复杂度 $O(n)$，其中 $n$ 是题目给定的整数 $\textit{size}$。

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
// Moving Average from Data Stream：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type MovingAverage struct {
	s    int
	cnt  int
	data []int
}

func Constructor(size int) MovingAverage {
	return MovingAverage{
		data: make([]int, size),
	}
}

func (this *MovingAverage) Next(val int) float64 {
	i := this.cnt % len(this.data)
	this.s += val - this.data[i]
	this.data[i] = val
	this.cnt++
	return float64(this.s) / float64(min(this.cnt, len(this.data)))
}

/**
 * Your MovingAverage object will be instantiated and called as such:
 * obj := Constructor(size);
 * param_1 := obj.Next(val);
 */
```

### Java

```java
// Moving Average from Data Stream：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class MovingAverage {
    private int s;
    private int cnt;
    private int[] data;

    public MovingAverage(int size) {
        data = new int[size];
    }

    public double next(int val) {
        int i = cnt % data.length;
        s += val - data[i];
        data[i] = val;
        ++cnt;
        return s * 1.0 / Math.min(cnt, data.length);
    }
}

/**
 * Your MovingAverage object will be instantiated and called as such:
 * MovingAverage obj = new MovingAverage(size);
 * double param_1 = obj.next(val);
 */
```

### Python

```python
# Moving Average from Data Stream：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class MovingAverage:

    def __init__(self, size: int):
        self.s = 0
        self.data = [0] * size
        self.cnt = 0

    def next(self, val: int) -> float:
        i = self.cnt % len(self.data)
        self.s += val - self.data[i]
        self.data[i] = val
        self.cnt += 1
        return self.s / min(self.cnt, len(self.data))


# Your MovingAverage object will be instantiated and called as such:
# obj = MovingAverage(size)
# param_1 = obj.next(val)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

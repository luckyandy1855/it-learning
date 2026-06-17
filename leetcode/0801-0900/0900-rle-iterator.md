# 0900. RLE Iterator

---
编号: 900
题目: RLE Iterator
难度: 中等
标签: [设计, 数组, 计数, 迭代器]
来源链接: https://leetcode.com/problems/rle-iterator/
---

## 题目描述

我们可以使用游程编码(即 **RLE **)来编码一个整数序列。在偶数长度 `encoding` ( **从 0 开始** )的游程编码数组中，对于所有偶数 `i` ，`encoding[i]` 告诉我们非负整数 `encoding[i + 1]` 在序列中重复的次数。

- 例如，序列 `arr = [8,8,8,5,5]` 可以被编码为 `encoding =[3,8,2,5]` 。`encoding =[3,8,0,9,2,5]` 和 `encoding =[2,8,1,8,2,5]` 也是 `arr` 有效的 **RLE** 。

给定一个游程长度的编码数组，设计一个迭代器来遍历它。

实现 `RLEIterator` 类:

- `RLEIterator(int[] encoded)` 用编码后的数组初始化对象。

- `int next(int n)` 以这种方式耗尽后 `n` 个元素并返回最后一个耗尽的元素。如果没有剩余的元素要耗尽，则返回 `-1` 。

**示例 1：**

```text
输入：
["RLEIterator","next","next","next","next"]
[[[3,8,0,9,2,5]],[2],[1],[1],[2]]
输出：
[null,8,8,5,-1]
解释：
RLEIterator rLEIterator = new RLEIterator([3, 8, 0, 9, 2, 5]); // 这映射到序列 [8,8,8,5,5]。
rLEIterator.next(2); // 耗去序列的 2 个项，返回 8。现在剩下的序列是 [8, 5, 5]。
rLEIterator.next(1); // 耗去序列的 1 个项，返回 8。现在剩下的序列是 [5, 5]。
rLEIterator.next(1); // 耗去序列的 1 个项，返回 5。现在剩下的序列是 [5]。
rLEIterator.next(2); // 耗去序列的 2 个项，返回 -1。 这是由于第一个被耗去的项是 5，
但第二个项并不存在。由于最后一个要耗去的项不存在，我们返回 -1。
```

**提示：**

- `2 <= encoding.length <= 1000`

- `encoding.length` 为偶

- `0 <= encoding[i] <= 10^9`

- `1 <= n <= 10^9`

- 每个测试用例调用`next `不高于 `1000` 次

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 计数, 迭代器」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个指针 $i$ 和 $j$，其中指针 $i$ 指向当前读取的游程编码，指针 $j$ 指向当前读取的游程编码中的第几个字符。初始时 $i = 0$, $j = 0$。

每次调用 `next(n)` 时，我们判断当前游程编码中剩余的字符数 $encoding[i] - j$ 是否小于 $n$，若是，则将 $n$ 减去 $encoding[i] - j$，并将 $i$ 加 $2$，$j$ 置为 $0$，然后继续判断下一个游程编码；若不是，则将 $j$ 加 $n$，并返回 $encoding[i + 1]$。

若 $i$ 超出了游程编码的长度，依然没有返回值，则说明没有剩余的元素要耗尽，返回 $-1$。

时间复杂度 $O(n + q)$，空间复杂度 $O(n)$。其中 $n$ 是游程编码的长度，而 $q$ 是调用 `next(n)` 的次数。

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
// RLE Iterator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type RLEIterator struct {
	encoding []int
	i, j     int
}

func Constructor(encoding []int) RLEIterator {
	return RLEIterator{encoding, 0, 0}
}

func (this *RLEIterator) Next(n int) int {
	for this.i < len(this.encoding) {
		if this.encoding[this.i]-this.j < n {
			n -= (this.encoding[this.i] - this.j)
			this.i += 2
			this.j = 0
		} else {
			this.j += n
			return this.encoding[this.i+1]
		}
	}
	return -1
}

/**
 * Your RLEIterator object will be instantiated and called as such:
 * obj := Constructor(encoding);
 * param_1 := obj.Next(n);
 */
```

### Java

```java
// RLE Iterator：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class RLEIterator {
    private int[] encoding;
    private int i;
    private int j;

    public RLEIterator(int[] encoding) {
        this.encoding = encoding;
    }

    public int next(int n) {
        while (i < encoding.length) {
            if (encoding[i] - j < n) {
                n -= (encoding[i] - j);
                i += 2;
                j = 0;
            } else {
                j += n;
                return encoding[i + 1];
            }
        }
        return -1;
    }
}

/**
 * Your RLEIterator object will be instantiated and called as such:
 * RLEIterator obj = new RLEIterator(encoding);
 * int param_1 = obj.next(n);
 */
```

### Python

```python
# RLE Iterator：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class RLEIterator:
    def __init__(self, encoding: List[int]):
        self.encoding = encoding
        self.i = 0
        self.j = 0

    def next(self, n: int) -> int:
        while self.i < len(self.encoding):
            if self.encoding[self.i] - self.j < n:
                n -= self.encoding[self.i] - self.j
                self.i += 2
                self.j = 0
            else:
                self.j += n
                return self.encoding[self.i + 1]
        return -1


# Your RLEIterator object will be instantiated and called as such:
# obj = RLEIterator(encoding)
# param_1 = obj.next(n)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

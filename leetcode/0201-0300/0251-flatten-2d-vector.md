# 0251. Flatten 2D Vector

---
编号: 251
题目: Flatten 2D Vector
难度: 中等
标签: [设计, 数组, 双指针, 迭代器]
来源链接: https://leetcode.com/problems/flatten-2d-vector/
---

## 题目描述

请设计并实现一个能够展开二维向量的迭代器。该迭代器需要支持 `next` 和 `hasNext` 两种操作。

实现 `Vector2D` 类：

- `Vector2D(int[][] vec)` 使用二维向量 `vec` 初始化对象

- `next()` 从二维向量返回下一个元素并将指针移动到下一个位置。你可以假设对 `next` 的所有调用都是合法的。

- `hasNext()` 当向量中还有元素返回 `true`，否则返回 `false`。

**示例 1：**

```text
输入：
["Vector2D", "next", "next", "next", "hasNext", "hasNext", "next", "hasNext"]
[[[[1, 2], [3], [4]]], [], [], [], [], [], [], []]
输出：
[null, 1, 2, 3, true, true, 4, false]

解释：
Vector2D vector2D = new Vector2D([[1, 2], [3], [4]]);
vector2D.next();    // return 1
vector2D.next();    // return 2
vector2D.next();    // return 3
vector2D.hasNext(); // return True
vector2D.hasNext(); // return True
vector2D.next();    // return 4
vector2D.hasNext(); // return False
```

提示：

- `0 C++ 提供的迭代器 或 Java 提供的迭代器。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 双指针, 迭代器」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义两个指针 $i$ 和 $j$，分别指向当前二维向量的行和列，初始时 $i = 0$，$j = 0$。

接下来，我们设计一个函数 $forward()$，用于将 $i$ 和 $j$ 向后移动，直到指向一个非空的元素。

每次调用 `next` 方法时，我们先调用 $forward()$，然后返回当前指向的元素，最后将 $j$ 向后移动一位。

每次调用 `hasNext` 方法时，我们先调用 $forward()$，然后判断 $i$ 是否小于二维向量的行数，如果是，则返回 `true`，否则返回 `false`。

时间复杂度 $O(1)$，空间复杂度 $O(1)$。

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
// Flatten 2D Vector：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Vector2D struct {
	i, j int
	vec  [][]int
}

func Constructor(vec [][]int) Vector2D {
	return Vector2D{vec: vec}
}

func (this *Vector2D) Next() int {
	this.forward()
	ans := this.vec[this.i][this.j]
	this.j++
	return ans
}

func (this *Vector2D) HasNext() bool {
	this.forward()
	return this.i < len(this.vec)
}

func (this *Vector2D) forward() {
	for this.i < len(this.vec) && this.j >= len(this.vec[this.i]) {
		this.i++
		this.j = 0
	}
}

/**
 * Your Vector2D object will be instantiated and called as such:
 * obj := Constructor(vec);
 * param_1 := obj.Next();
 * param_2 := obj.HasNext();
 */
```

### Java

```java
import java.util.*;
// Flatten 2D Vector：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Vector2D {
    private int i;
    private int j;
    private int[][] vec;

    public Vector2D(int[][] vec) {
        this.vec = vec;
    }

    public int next() {
        forward();
        return vec[i][j++];
    }

    public boolean hasNext() {
        forward();
        return i < vec.length;
    }

    private void forward() {
        while (i < vec.length && j >= vec[i].length) {
            ++i;
            j = 0;
        }
    }
}

/**
 * Your Vector2D object will be instantiated and called as such:
 * Vector2D obj = new Vector2D(vec);
 * int param_1 = obj.next();
 * boolean param_2 = obj.hasNext();
 */
```

### Python

```python
# Flatten 2D Vector：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Vector2D:
    def __init__(self, vec: List[List[int]]):
        self.i = 0
        self.j = 0
        self.vec = vec

    def next(self) -> int:
        self.forward()
        ans = self.vec[self.i][self.j]
        self.j += 1
        return ans

    def hasNext(self) -> bool:
        self.forward()
        return self.i < len(self.vec)

    def forward(self):
        while self.i < len(self.vec) and self.j >= len(self.vec[self.i]):
            self.i += 1
            self.j = 0


# Your Vector2D object will be instantiated and called as such:
# obj = Vector2D(vec)
# param_1 = obj.next()
# param_2 = obj.hasNext()
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

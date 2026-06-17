# 0379. Design Phone Directory

---
编号: 379
题目: Design Phone Directory
难度: 中等
标签: [设计, 队列, 数组, 哈希表, 链表]
来源链接: https://leetcode.com/problems/design-phone-directory/
---

## 题目描述

设计一个电话目录管理系统，一开始有 `maxNumbers` 个位置能够储存号码。系统应该存储号码，检查某个位置是否为空，并清空给定的位置。

实现 `PhoneDirectory` 类：

	- `PhoneDirectory(int maxNumbers)` 电话目录初始有 `maxNumbers` 个可用位置。

	- `int get()` 提供一个未分配给任何人的号码。如果没有可用号码则返回 `-1`。

	- `bool check(int number)` 如果位置 `number` 可用返回 `true` 否则返回 `false`。

	- `void release(int number)` 回收或释放位置 `number`。

示例 1：

```text
输入：
["PhoneDirectory", "get", "get", "check", "get", "check", "release", "check"]
[[3], [], [], [2], [], [2], [2], [2]]
输出：
[null, 0, 1, true, 2, false, null, true]

解释：
PhoneDirectory phoneDirectory = new PhoneDirectory(3);
phoneDirectory.get();      // 它可以返回任意可用的数字。这里我们假设它返回 0。
phoneDirectory.get();      // 假设它返回 1。
phoneDirectory.check(2);   // 数字 2 可用，所以返回 true。
phoneDirectory.get();      // 返回剩下的唯一一个数字 2。
phoneDirectory.check(2);   // 数字 2 不再可用，所以返回 false。
phoneDirectory.release(2); // 将数字 2 释放回号码池。
phoneDirectory.check(2);   // 数字 2 重新可用，返回 true。
```

**提示：**

	- `1 <= maxNumbers <= 10^4`

	- `0 <= number < maxNumbers`

	- `get`，`check` 和 `release` 最多被调用 `2 * 10^4` 次。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 队列, 数组, 哈希表, 链表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用一个哈希集合 `available` 来存储未被分配的电话号码，初始时，哈希表中存储的是 `[0, 1, 2, ..., maxNumbers - 1]`。

调用 `get` 方法时，我们从 `available` 中取出一个未被分配的电话号码，如果 `available` 为空，则返回 `-1`。时间复杂度 $O(1)$。

调用 `check` 方法时，我们只需要判断 `number` 是否在 `available` 中即可。时间复杂度 $O(1)$。

调用 `release` 方法时，我们将 `number` 添加到 `available` 中。时间复杂度 $O(1)$。

空间复杂度 $O(n)$，其中 $n$ 是 `maxNumbers` 的值。

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
// Design Phone Directory：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type PhoneDirectory struct {
	available map[int]bool
}

func Constructor(maxNumbers int) PhoneDirectory {
	available := make(map[int]bool)
	for i := 0; i < maxNumbers; i++ {
		available[i] = true
	}
	return PhoneDirectory{available}
}

func (this *PhoneDirectory) Get() int {
	for k := range this.available {
		delete(this.available, k)
		return k
	}
	return -1
}

func (this *PhoneDirectory) Check(number int) bool {
	_, ok := this.available[number]
	return ok
}

func (this *PhoneDirectory) Release(number int) {
	this.available[number] = true
}

/**
 * Your PhoneDirectory object will be instantiated and called as such:
 * obj := Constructor(maxNumbers);
 * param_1 := obj.Get();
 * param_2 := obj.Check(number);
 * obj.Release(number);
 */
```

### Java

```java
// Design Phone Directory：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class PhoneDirectory {
    private Set<Integer> available = new HashSet<>();

    public PhoneDirectory(int maxNumbers) {
        for (int i = 0; i < maxNumbers; ++i) {
            available.add(i);
        }
    }

    public int get() {
        if (available.isEmpty()) {
            return -1;
        }
        int x = available.iterator().next();
        available.remove(x);
        return x;
    }

    public boolean check(int number) {
        return available.contains(number);
    }

    public void release(int number) {
        available.add(number);
    }
}

/**
 * Your PhoneDirectory object will be instantiated and called as such:
 * PhoneDirectory obj = new PhoneDirectory(maxNumbers);
 * int param_1 = obj.get();
 * boolean param_2 = obj.check(number);
 * obj.release(number);
 */
```

### Python

```python
# Design Phone Directory：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class PhoneDirectory:

    def __init__(self, maxNumbers: int):
        self.available = set(range(maxNumbers))

    def get(self) -> int:
        if not self.available:
            return -1
        return self.available.pop()

    def check(self, number: int) -> bool:
        return number in self.available

    def release(self, number: int) -> None:
        self.available.add(number)


# Your PhoneDirectory object will be instantiated and called as such:
# obj = PhoneDirectory(maxNumbers)
# param_1 = obj.get()
# param_2 = obj.check(number)
# obj.release(number)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

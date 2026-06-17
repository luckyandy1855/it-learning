# 0170. Two Sum III - Data structure design

---
编号: 170
题目: Two Sum III - Data structure design
难度: 简单
标签: [设计, 数组, 哈希表, 双指针, 数据流]
来源链接: https://leetcode.com/problems/two-sum-iii-data-structure-design/
---

## 题目描述

设计一个接收整数流的数据结构，该数据结构支持检查是否存在两数之和等于特定值。

实现 `TwoSum` 类：

	- `TwoSum()` 使用空数组初始化 `TwoSum` 对象

	- `void add(int number)` 向数据结构添加一个数 `number`

	- `boolean find(int value)` 寻找数据结构中是否存在一对整数，使得两数之和与给定的值相等。如果存在，返回 `true` ；否则，返回 `false` 。

**示例：**

```text
输入：
["TwoSum", "add", "add", "add", "find", "find"]
[[], [1], [3], [5], [4], [7]]
输出：
[null, null, null, null, true, false]

解释：
TwoSum twoSum = new TwoSum();
twoSum.add(1);   // [] --> [1]
twoSum.add(3);   // [1] --> [1,3]
twoSum.add(5);   // [1,3] --> [1,3,5]
twoSum.find(4);  // 1 + 3 = 4，返回 true
twoSum.find(7);  // 没有两个整数加起来等于 7 ，返回 false
```

**提示：**

	- `-10^5 <= number <= 10^5`

	- `-2^31 <= value <= 2^31 - 1`

	- 最多调用 `10^4` 次 `add` 和 `find`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表, 双指针, 数据流」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 `cnt` 存储数字出现的次数。

调用 `add` 方法时，将数字 `number` 的出现次数加一。

调用 `find` 方法时，遍历哈希表 `cnt`，对于每个键 `x`，判断 `value - x` 是否也是哈希表 `cnt` 的键，如果是，判断 `x` 是否等于 `value - x`，如果不等，说明找到了一对和为 `value` 的数字，返回 `true`；如果等，判断 `x` 的出现次数是否大于 `1`，如果大于 `1`，说明找到了一对和为 `value` 的数字，返回 `true`；如果小于等于 `1`，说明没有找到一对和为 `value` 的数字，继续遍历哈希表 `cnt`，如果遍历结束都没有找到，返回 `false`。

时间复杂度：

- `add` 方法的时间复杂度为 $O(1)$；
- `find` 方法的时间复杂度为 $O(n)$。

空间复杂度 $O(n)$，其中 $n$ 为哈希表 `cnt` 的大小。

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
// Two Sum III - Data structure design：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type TwoSum struct {
	cnt map[int]int
}

func Constructor() TwoSum {
	return TwoSum{map[int]int{}}
}

func (this *TwoSum) Add(number int) {
	this.cnt[number] += 1
}

func (this *TwoSum) Find(value int) bool {
	for x, v := range this.cnt {
		y := value - x
		if _, ok := this.cnt[y]; ok && (x != y || v > 1) {
			return true
		}
	}
	return false
}

/**
 * Your TwoSum object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Add(number);
 * param_2 := obj.Find(value);
 */
```

### Java

```java
// Two Sum III - Data structure design：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class TwoSum {
    private Map<Integer, Integer> cnt = new HashMap<>();

    public TwoSum() {
    }

    public void add(int number) {
        cnt.merge(number, 1, Integer::sum);
    }

    public boolean find(int value) {
        for (var e : cnt.entrySet()) {
            int x = e.getKey(), v = e.getValue();
            int y = value - x;
            if (cnt.containsKey(y) && (x != y || v > 1)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * Your TwoSum object will be instantiated and called as such:
 * TwoSum obj = new TwoSum();
 * obj.add(number);
 * boolean param_2 = obj.find(value);
 */
```

### Python

```python
# Two Sum III - Data structure design：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class TwoSum:

    def __init__(self):
        self.cnt = defaultdict(int)

    def add(self, number: int) -> None:
        self.cnt[number] += 1

    def find(self, value: int) -> bool:
        for x, v in self.cnt.items():
            y = value - x
            if y in self.cnt and (x != y or v > 1):
                return True
        return False


# Your TwoSum object will be instantiated and called as such:
# obj = TwoSum()
# obj.add(number)
# param_2 = obj.find(value)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

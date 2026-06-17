# 0458. Poor Pigs

---
编号: 458
题目: Poor Pigs
难度: 困难
标签: [数学, 动态规划, 组合数学]
来源链接: https://leetcode.com/problems/poor-pigs/
---

## 题目描述

有` buckets` 桶液体，其中 **正好有一桶** 含有毒药，其余装的都是水。它们从外观看起来都一样。为了弄清楚哪只水桶含有毒药，你可以喂一些猪喝，通过观察猪是否会死进行判断。不幸的是，你只有 `minutesToTest` 分钟时间来确定哪桶液体是有毒的。

喂猪的规则如下：

- 选择若干活猪进行喂养

- 可以允许小猪同时饮用任意数量的桶中的水，并且该过程不需要时间。

- 小猪喝完水后，必须有 `minutesToDie` 分钟的冷却时间。在这段时间里，你只能观察，而不允许继续喂猪。

- 过了 `minutesToDie` 分钟后，所有喝到毒药的猪都会死去，其他所有猪都会活下来。

- 重复这一过程，直到时间用完。

给你桶的数目 `buckets` ，`minutesToDie` 和 `minutesToTest` ，返回 *在规定时间内判断哪个桶有毒所需的 **最小** 猪数* 。

**示例 1：**

```text
输入：buckets = 1000, minutesToDie = 15, minutesToTest = 60
输出：5
```

**示例 2：**

```text
输入：buckets = 4, minutesToDie = 15, minutesToTest = 15
输出：2
```

**示例 3：**

```text
输入：buckets = 4, minutesToDie = 15, minutesToTest = 30
输出：2
```

**提示：**

- `1 <= buckets <= 1000`

- `1 <= minutesToDie <= minutesToTest <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 动态规划, 组合数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Poor Pigs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func poorPigs(buckets int, minutesToDie int, minutesToTest int) int {
	base := minutesToTest/minutesToDie + 1
	res := 0
	for p := 1; p < buckets; p *= base {
		res++
	}
	return res
}
```

### Java

```java
// Poor Pigs：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int poorPigs(int buckets, int minutesToDie, int minutesToTest) {
        int base = minutesToTest / minutesToDie + 1;
        int res = 0;
        for (int p = 1; p < buckets; p *= base) {
            ++res;
        }
        return res;
    }
}
```

### Python

```python
# Poor Pigs：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def poorPigs(self, buckets: int, minutesToDie: int, minutesToTest: int) -> int:
        base = minutesToTest // minutesToDie + 1
        res, p = 0, 1
        while p < buckets:
            p *= base
            res += 1
        return res
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

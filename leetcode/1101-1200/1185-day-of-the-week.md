# 1185. Day of the Week

---
编号: 1185
题目: Day of the Week
难度: 简单
标签: [数学]
来源链接: https://leetcode.com/problems/day-of-the-week/
---

## 题目描述

给你一个日期，请你设计一个算法来判断它是对应一周中的哪一天。

输入为三个整数：`day`、`month` 和 `year`，分别表示日、月、年。

您返回的结果必须是这几个值中的一个 `{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}`。

**注意**：1971 年 1 月 1 日是星期五。

**示例 1：**

```text
输入：day = 31, month = 8, year = 2019
输出："Saturday"
```

**示例 2：**

```text
输入：day = 18, month = 7, year = 1999
输出："Sunday"
```

**示例 3：**

```text
输入：day = 15, month = 8, year = 1993
输出："Sunday"
```

**提示：**

- 给出的日期一定是在 `1971` 到 `2100` 年之间的有效日期。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用蔡勒公式来计算星期几，蔡勒公式如下：


w = (\left \lfloor \frac{c}{4} \right \rfloor - 2c + y + \left \lfloor \frac{y}{4} \right \rfloor + \left \lfloor \frac{13(m+1)}{5} \right \rfloor + d - 1) \bmod 7


其中：

- `w`: 星期（从 Sunday 开始）
- `c`: 年份前两位
- `y`: 年份后两位
- `m`: 月（m 的取值范围是 3 至 14，即在蔡勒公式中，某年的 1、2 月要看作上一年的 13、14 月来计算，比如 2003 年 1 月 1 日要看作 2002 年的 13 月 1 日来计算）
- `d`: 日
- `⌊⌋`: 向下取整
- `mod`: 取余

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
// Day of the Week：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func dayOfTheWeek(d int, m int, y int) string {
	if m < 3 {
		m += 12
		y -= 1
	}
	c := y / 100
	y %= 100
	w := (c/4 - 2*c + y + y/4 + 13*(m+1)/5 + d - 1) % 7
	weeks := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
	return weeks[(w+7)%7]
}
```

### Java

```java
// Day of the Week：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.Calendar;

class Solution {
    private static final String[] WEEK
        = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

    public static String dayOfTheWeek(int day, int month, int year) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month - 1, day);
        return WEEK[calendar.get(Calendar.DAY_OF_WEEK) - 1];
    }
}
```

### Python

```python
# Day of the Week：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def dayOfTheWeek(self, day: int, month: int, year: int) -> str:
        return datetime.date(year, month, day).strftime('%A')
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

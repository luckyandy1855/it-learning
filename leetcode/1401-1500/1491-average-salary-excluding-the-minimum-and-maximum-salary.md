# 1491. Average Salary Excluding the Minimum and Maximum Salary

---
编号: 1491
题目: Average Salary Excluding the Minimum and Maximum Salary
难度: 简单
标签: [数组, 排序]
来源链接: https://leetcode.com/problems/average-salary-excluding-the-minimum-and-maximum-salary/
---

## 题目描述

给你一个整数数组 `salary` ，数组里每个数都是 **唯一** 的，其中 `salary[i]` 是第 `i` 个员工的工资。

请你返回去掉最低工资和最高工资以后，剩下员工工资的平均值。

**示例 1：**

```text
输入：salary = [4000,3000,1000,2000]
输出：2500.00000
解释：最低工资和最高工资分别是 1000 和 4000 。
去掉最低工资和最高工资以后的平均工资是 (2000+3000)/2= 2500
```

**示例 2：**

```text
输入：salary = [1000,2000,3000]
输出：2000.00000
解释：最低工资和最高工资分别是 1000 和 3000 。
去掉最低工资和最高工资以后的平均工资是 (2000)/1= 2000
```

**示例 3：**

```text
输入：salary = [6000,5000,4000,3000,2000,1000]
输出：3500.00000
```

**示例 4：**

```text
输入：salary = [8000,9000,2000,3000,6000,1000]
输出：4750.00000
```

**提示：**

- `3 <= salary.length <= 100`

- `10^3 <= salary[i] <= 10^6`

- `salary[i]` 是唯一的。

- 与真实值误差在 `10^-5` 以内的结果都将视为正确答案。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

按题意模拟即可。

遍历数组，求出最大值和最小值，并且累加和，然后求出去掉最大值和最小值后的平均值。

时间复杂度 $O(n)$。其中 $n$ 为数组 `salary` 的长度。空间复杂度 $O(1)$。

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
// Average Salary Excluding the Minimum and Maximum Salary：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func average(salary []int) float64 {
	s := 0
	mi, mx := 10000000, 0
	for _, v := range salary {
		s += v
		mi = min(mi, v)
		mx = max(mx, v)
	}
	s -= (mi + mx)
	return float64(s) / float64(len(salary)-2)
}
```

### Java

```java
// Average Salary Excluding the Minimum and Maximum Salary：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public double average(int[] salary) {
        int s = 0;
        int mi = 10000000, mx = 0;
        for (int v : salary) {
            mi = Math.min(mi, v);
            mx = Math.max(mx, v);
            s += v;
        }
        s -= (mi + mx);
        return s * 1.0 / (salary.length - 2);
    }
}
```

### Python

```python
# Average Salary Excluding the Minimum and Maximum Salary：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def average(self, salary: List[int]) -> float:
        s = sum(salary) - min(salary) - max(salary)
        return s / (len(salary) - 2)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1179. Reformat Department Table

---
编号: 1179
题目: Reformat Department Table
难度: 简单
标签: [数据库]
来源链接: https://leetcode.com/problems/reformat-department-table/
---

## 题目描述

表 `Department`：

```text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| id            | int     |
| revenue       | int     |
| month         | varchar |
+---------------+---------+
在 SQL 中，(id, month) 是表的联合主键。
这个表格有关于每个部门每月收入的信息。
月份（month）可以取下列值 ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]。
```

重新格式化表格，使得 **每个月 **都有一个部门 id 列和一个收入列。

以 **任意顺序** 返回结果表。

结果格式如以下示例所示。

**示例 1：**

```text
输入：
Department table:
+------+---------+-------+
| id   | revenue | month |
+------+---------+-------+
| 1    | 8000    | Jan   |
| 2    | 9000    | Jan   |
| 3    | 10000   | Feb   |
| 1    | 7000    | Feb   |
| 1    | 6000    | Mar   |
+------+---------+-------+
输出：
+------+-------------+-------------+-------------+-----+-------------+
| id   | Jan_Revenue | Feb_Revenue | Mar_Revenue | ... | Dec_Revenue |
+------+-------------+-------------+-------------+-----+-------------+
| 1    | 8000        | 7000        | 6000        | ... | null        |
| 2    | 9000        | null        | null        | ... | null        |
| 3    | null        | 10000       | null        | ... | null        |
+------+-------------+-------------+-------------+-----+-------------+
解释：四月到十二月的收入为空。
请注意，结果表共有 13 列（1 列用于部门 ID，其余 12 列用于各个月份）。
```

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数据库」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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

### SQL

```sql
-- Reformat Department Table：使用 SQL 完成本题要求。
-- 关键点：先按题意过滤或分组，再输出指定列名。
# Write your MySQL query statement below
SELECT
    id,
    SUM(
        CASE month
            WHEN 'Jan' THEN revenue
        END
    ) AS Jan_Revenue,
    SUM(
        CASE month
            WHEN 'Feb' THEN revenue
        END
    ) AS Feb_Revenue,
    SUM(
        CASE month
            WHEN 'Mar' THEN revenue
        END
    ) AS Mar_Revenue,
    SUM(
        CASE month
            WHEN 'Apr' THEN revenue
        END
    ) AS Apr_Revenue,
    SUM(
        CASE month
            WHEN 'May' THEN revenue
        END
    ) AS May_Revenue,
    SUM(
        CASE month
            WHEN 'Jun' THEN revenue
        END
    ) AS Jun_Revenue,
    SUM(
        CASE month
            WHEN 'Jul' THEN revenue
        END
    ) AS Jul_Revenue,
    SUM(
        CASE month
            WHEN 'Aug' THEN revenue
        END
    ) AS Aug_Revenue,
    SUM(
        CASE month
            WHEN 'Sep' THEN revenue
        END
    ) AS Sep_Revenue,
    SUM(
        CASE month
            WHEN 'Oct' THEN revenue
        END
    ) AS Oct_Revenue,
    SUM(
        CASE month
            WHEN 'Nov' THEN revenue
        END
    ) AS Nov_Revenue,
    SUM(
        CASE month
            WHEN 'Dec' THEN revenue
        END
    ) AS Dec_Revenue
FROM Department
GROUP BY 1;
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

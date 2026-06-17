# 1270. All People Report to the Given Manager

---
编号: 1270
题目: All People Report to the Given Manager
难度: 中等
标签: [数据库]
来源链接: https://leetcode.com/problems/all-people-report-to-the-given-manager/
---

## 题目描述

员工表：`Employees`

```text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| employee_id   | int     |
| employee_name | varchar |
| manager_id    | int     |
+---------------+---------+
employee_id 是这个表具有唯一值的列。
这个表中每一行中，employee_id 表示职工的 ID，employee_name 表示职工的名字，manager_id 表示该职工汇报工作的直线经理。
这个公司 CEO 是 employee_id = 1 的人。
```

编写解决方案，找出所有直接或间接向公司 CEO 汇报工作的职工的 `employee_id` 。

由于公司规模较小，经理之间的间接关系 **不超过 3 个经理** 。

可以以 **任何顺序** 返回无重复项的结果。

返回结果示例如下。

**示例 1：**

```text
输入：
Employees table:
+-------------+---------------+------------+
| employee_id | employee_name | manager_id |
+-------------+---------------+------------+
| 1           | Boss          | 1          |
| 3           | Alice         | 3          |
| 2           | Bob           | 1          |
| 4           | Daniel        | 2          |
| 7           | Luis          | 4          |
| 8           | Jhon          | 3          |
| 9           | Angela        | 8          |
| 77          | Robert        | 1          |
+-------------+---------------+------------+
输出：
+-------------+
| employee_id |
+-------------+
| 2           |
| 77          |
| 4           |
| 7           |
+-------------+
解释：
公司 CEO 的 employee_id 是 1.
employee_id 是 2 和 77 的职员直接汇报给公司 CEO。
employee_id 是 4 的职员间接汇报给公司 CEO 4 --> 2 --> 1 。
employee_id 是 7 的职员间接汇报给公司 CEO 7 --> 4 --> 2 --> 1 。
employee_id 是 3, 8 ，9 的职员不会直接或间接的汇报给公司 CEO。
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

我们可以通过两次连接来找到所有直接或间接向公司 CEO 汇报工作的职工的 `employee_id`。

具体地，我们首先通过一次连接，找到每个 `manager_id` 对应的上级经理的 `manager_id`，然后再通过一次连接，找到更上一级经理的 `manager_id`，最后，如果更上一级的 `manager_id` 为 $1$，且员工的 `employee_id` 不为 $1$，则说明该员工直接或间接向公司 CEO 汇报工作。

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
-- All People Report to the Given Manager：使用 SQL 完成本题要求。
-- 关键点：先按题意过滤或分组，再输出指定列名。
# Write your MySQL query statement below
SELECT e1.employee_id
FROM
    Employees AS e1
    JOIN Employees AS e2 ON e1.manager_id = e2.employee_id
    JOIN Employees AS e3 ON e2.manager_id = e3.employee_id
WHERE e1.employee_id != 1 AND e3.manager_id = 1;
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

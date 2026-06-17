# 0580. Count Student Number in Departments

---
编号: 580
题目: Count Student Number in Departments
难度: 中等
标签: [数据库]
来源链接: https://leetcode.com/problems/count-student-number-in-departments/
---

## 题目描述

表: `Student`

```text
+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| student_id   | int     |
| student_name | varchar |
| gender       | varchar |
| dept_id      | int     |
+--------------+---------+
student_id 是该表的主键（具有唯一值的列）。
dept_id是Department表中dept_id的外键。
该表的每一行都表示学生的姓名、性别和所属系的id。
```

表: `Department`

```text
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| dept_id     | int     |
| dept_name   | varchar |
+-------------+---------+
dept_id是该表的主键（具有唯一值的列）。
该表的每一行包含一个部门的id和名称。
```

编写解决方案，为 `Department` 表中的所有部门(甚至是没有当前学生的部门)报告各自的部门名称和每个部门的学生人数。

按 `student_number` **降序 **返回结果表。如果是平局，则按 `dept_name` 的  **字母顺序 **排序。

结果格式如下所示。

**示例 1:**

```text
输入:
Student 表:
+------------+--------------+--------+---------+
| student_id | student_name | gender | dept_id |
+------------+--------------+--------+---------+
| 1          | Jack         | M      | 1       |
| 2          | Jane         | F      | 1       |
| 3          | Mark         | M      | 2       |
+------------+--------------+--------+---------+
Department 表:
+---------+-------------+
| dept_id | dept_name   |
+---------+-------------+
| 1       | Engineering |
| 2       | Science     |
| 3       | Law         |
+---------+-------------+
输出:
+-------------+----------------+
| dept_name   | student_number |
+-------------+----------------+
| Engineering | 2              |
| Science     | 1              |
| Law         | 0              |
+-------------+----------------+
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

我们可以使用左连接，将 `Department` 表与 `Student` 表按照 `dept_id` 进行连接，然后按照 `dept_id` 分组统计学生人数，最后按照 `student_number` 降序、`dept_name` 升序排序即可。

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
-- Count Student Number in Departments：使用 SQL 完成本题要求。
-- 关键点：先按题意过滤或分组，再输出指定列名。
# Write your MySQL query statement below
SELECT dept_name, COUNT(student_id) AS student_number
FROM
    Department
    LEFT JOIN Student USING (dept_id)
GROUP BY dept_id
ORDER BY 2 DESC, 1;
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

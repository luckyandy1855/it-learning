# 0618. Students Report By Geography

---
编号: 618
题目: Students Report By Geography
难度: 困难
标签: [数据库]
来源链接: https://leetcode.com/problems/students-report-by-geography/
---

## 题目描述

表： `student`

```text
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| name        | varchar |
| continent   | varchar |
+-------------+---------+
该表可能包含重复的行。
该表的每一行表示学生的名字和他们来自的大陆。
```

一所学校有来自亚洲、欧洲和美洲的学生。

编写解决方案实现对大洲（continent）列的 透视表 操作，使得每个`学生`按照姓名的**字母顺序**依次排列在对应的大洲下面。输出的标题应依次为`美洲（America）、亚洲（Asia）和欧洲（Europe）。`

测试用例的生成保证来自美国的学生人数不少于亚洲或欧洲的学生人数。

返回结果格式如下所示。

**示例 1:**

```text
输入:
Student table:
+--------+-----------+
| name   | continent |
+--------+-----------+
| Jane   | America   |
| Pascal | Europe    |
| Xi     | Asia      |
| Jack   | America   |
+--------+-----------+
输出:
+---------+------+--------+
| America | Asia | Europe |
+---------+------+--------+
| Jack    | Xi   | Pascal |
| Jane    | null | null   |
+---------+------+--------+
```

**进阶：**如果不能确定哪个大洲的学生数最多，你可以写出一个查询去生成上述学生报告吗？

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

我们可以使用窗口函数 `row_number()` 来为每个大洲的学生编号，然后使用 `GROUP BY` 来将同一编号的学生聚合到一行中。

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
-- Students Report By Geography：使用 SQL 完成本题要求。
-- 关键点：先按题意过滤或分组，再输出指定列名。
# Write your MySQL query statement below
WITH
    T AS (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY continent
                ORDER BY name
            ) AS rk
        FROM Student
    )
SELECT
    MAX(IF(continent = 'America', name, NULL)) AS 'America',
    MAX(IF(continent = 'Asia', name, NULL)) AS 'Asia',
    MAX(IF(continent = 'Europe', name, NULL)) AS 'Europe'
FROM T
GROUP BY rk;
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

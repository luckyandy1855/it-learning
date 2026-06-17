# 1440. Evaluate Boolean Expression

---
编号: 1440
题目: Evaluate Boolean Expression
难度: 中等
标签: [数据库]
来源链接: https://leetcode.com/problems/evaluate-boolean-expression/
---

## 题目描述

表 `Variables`:

```text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| name          | varchar |
| value         | int     |
+---------------+---------+
在 SQL 中，name 是该表主键.
该表包含了存储的变量及其对应的值.
```

表 `Expressions`:

```text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| left_operand  | varchar |
| operator      | enum    |
| right_operand | varchar |
+---------------+---------+
在 SQL 中，(left_operand, operator, right_operand) 是该表主键.
该表包含了需要计算的布尔表达式.
operator 是枚举类型, 取值于('', '=')
left_operand 和 right_operand 的值保证存在于 Variables 表单中.
```

计算表 `Expressions` 中的布尔表达式。

返回的结果表 **无顺序要求** 。

结果格式如下例所示。

**示例 1：**

```text
输入：
Variables 表:
+------+-------+
| name | value |
+------+-------+
| x    | 66    |
| y    | 77    |
+------+-------+

Expressions 表:
+--------------+----------+---------------+
| left_operand | operator | right_operand |
+--------------+----------+---------------+
| x            | >        | y             |
| x            |         | x             |
| y            |         | y             | false |
| x            |         | x             | true  |
| y            | <        | x             | false |
| x            | =        | x             | true  |
+--------------+----------+---------------+-------+
解释：
如上所示, 你需要通过使用 Variables 表来找到 Expressions 表中的每一个布尔表达式的值.
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

我们可以通过等值连接，将 `Expressions` 表中的每一行与 `Variables` 表中的两行进行关联，关联的条件是 `left_operand = name` 和 `right_operand = name`，然后通过 `CASE` 表达式来判断布尔表达式的值。如果 `operator` 为 `=`，则判断两个值是否相等；如果 `operator` 为 `>`，则判断左值是否大于右值；如果 `operator` 为 `<`，则判断左值是否小于右值。若是，那么布尔表达式的值为 `true`，否则为 `false`。

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
-- Evaluate Boolean Expression：使用 SQL 完成本题要求。
-- 关键点：先按题意过滤或分组，再输出指定列名。
# Write your MySQL query statement below
SELECT
    left_operand,
    operator,
    right_operand,
    CASE
        WHEN (
            (operator = '=' AND v1.value = v2.value)
            OR (operator = '>' AND v1.value > v2.value)
            OR (operator = '<' AND v1.value < v2.value)
        ) THEN 'true'
        ELSE 'false'
    END AS value
FROM
    Expressions AS e
    JOIN Variables AS v1 ON e.left_operand = v1.name
    JOIN Variables AS v2 ON e.right_operand = v2.name;
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

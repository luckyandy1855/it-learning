# 1336. Number of Transactions per Visit

---
编号: 1336
题目: Number of Transactions per Visit
难度: 困难
标签: [数据库]
来源链接: https://leetcode.com/problems/number-of-transactions-per-visit/
---

## 题目描述

表: `Visits`

```text
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| user_id       | int     |
| visit_date    | date    |
+---------------+---------+
(user_id, visit_date) 是该表的主键(具有唯一值的列的组合)
该表的每行表示 user_id 在 visit_date 访问了银行
```

表: `Transactions`

```text
+------------------+---------+
| Column Name      | Type    |
+------------------+---------+
| user_id          | int     |
| transaction_date | date    |
| amount           | int     |
+------------------+---------+
该表可能有重复行
该表的每一行表示 user_id 在 transaction_date 完成了一笔 amount 数额的交易
可以保证用户 (user) 在 transaction_date 访问了银行 (也就是说 Visits 表包含 (user_id, transaction_date) 行)
```

银行想要得到银行客户在一次访问时的交易次数和相应的在一次访问时该交易次数的客户数量的图表

编写解决方案找出多少客户访问了银行但没有进行任何交易，多少客户访问了银行进行了一次交易等等

结果包含两列：

- `transactions_count：` 客户在一次访问中的交易次数

- `visits_count：` 在 `transactions_count` 交易次数下相应的一次访问时的客户数量

`transactions_count` 的值从 `0` 到所有用户一次访问中的 `max(transactions_count)`

结果按 `transactions_count` 排序

下面是返回结果格式的例子：

**示例 1：**

```text
输入：
Visits 表:
+---------+------------+
| user_id | visit_date |
+---------+------------+
| 1       | 2020-01-01 |
| 2       | 2020-01-02 |
| 12      | 2020-01-01 |
| 19      | 2020-01-03 |
| 1       | 2020-01-02 |
| 2       | 2020-01-03 |
| 1       | 2020-01-04 |
| 7       | 2020-01-11 |
| 9       | 2020-01-25 |
| 8       | 2020-01-28 |
+---------+------------+
Transactions 表:
+---------+------------------+--------+
| user_id | transaction_date | amount |
+---------+------------------+--------+
| 1       | 2020-01-02       | 120    |
| 2       | 2020-01-03       | 22     |
| 7       | 2020-01-11       | 232    |
| 1       | 2020-01-04       | 7      |
| 9       | 2020-01-25       | 33     |
| 9       | 2020-01-25       | 66     |
| 8       | 2020-01-28       | 1      |
| 9       | 2020-01-25       | 99     |
+---------+------------------+--------+
输出：
+--------------------+--------------+
| transactions_count | visits_count |
+--------------------+--------------+
| 0                  | 4            |
| 1                  | 5            |
| 2                  | 0            |
| 3                  | 1            |
+--------------------+--------------+
解释：为这个例子绘制的图表如上所示
* 对于 transactions_count = 0, visits 中 (1, "2020-01-01"), (2, "2020-01-02"), (12, "2020-01-01") 和 (19, "2020-01-03") 没有进行交易，所以 visits_count = 4 。
* 对于 transactions_count = 1, visits 中 (2, "2020-01-03"), (7, "2020-01-11"), (8, "2020-01-28"), (1, "2020-01-02") 和 (1, "2020-01-04") 进行了一次交易，所以 visits_count = 5 。
* 对于 transactions_count = 2, 没有客户访问银行进行了两次交易，所以 visits_count = 0 。
* 对于 transactions_count = 3, visits 中 (9, "2020-01-25") 进行了三次交易，所以 visits_count = 1 。
* 对于 transactions_count >= 4, 没有客户访问银行进行了超过3次交易，所以我们停止在 transactions_count = 3 。
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
-- Number of Transactions per Visit：使用 SQL 完成本题要求。
-- 关键点：先按题意过滤或分组，再输出指定列名。
# Write your MySQL query statement below
WITH RECURSIVE
    S AS (
        SELECT 0 AS n
        UNION
        SELECT n + 1
        FROM S
        WHERE
            n < (
                SELECT MAX(cnt)
                FROM
                    (
                        SELECT COUNT(1) AS cnt
                        FROM Transactions
                        GROUP BY user_id, transaction_date
                    ) AS t
            )
    ),
    T AS (
        SELECT v.user_id, visit_date, IFNULL(cnt, 0) AS cnt
        FROM
            Visits AS v
            LEFT JOIN (
                SELECT user_id, transaction_date, COUNT(1) AS cnt
                FROM Transactions
                GROUP BY 1, 2
            ) AS t
                ON v.user_id = t.user_id AND v.visit_date = t.transaction_date
    )
SELECT n AS transactions_count, COUNT(user_id) AS visits_count
FROM
    S AS s
    LEFT JOIN T AS t ON s.n = t.cnt
GROUP BY n
ORDER BY n;
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

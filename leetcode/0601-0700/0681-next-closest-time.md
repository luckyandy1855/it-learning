# 0681. Next Closest Time

---
编号: 681
题目: Next Closest Time
难度: 中等
标签: [哈希表, 字符串, 回溯, 枚举]
来源链接: https://leetcode.com/problems/next-closest-time/
---

## 题目描述

给定一个形如 `"HH:MM"` 表示的时刻 `time` ，利用当前出现过的数字构造下一个距离当前时间最近的时刻。每个出现数字都可以被无限次使用。

你可以认为给定的字符串一定是合法的。例如， `"01:34"` 和  `"12:09"` 是合法的，`“1:34”` 和 `“12:9”` 是不合法的。

**示例 1:**

```text
输入: "19:34"
输出: "19:39"
解释: 利用数字 1, 9, 3, 4 构造出来的最近时刻是 19:39，是 5 分钟之后。
结果不是 19:33 因为这个时刻是 23 小时 59 分钟之后。
```

**示例 2:**

```text
输入: "23:59"
输出: "22:22"
解释: 利用数字 2, 3, 5, 9 构造出来的最近时刻是 22:22。
答案一定是第二天的某一时刻，所以选择可构造的最小时刻。
```

**提示：**

- `time.length == 5`

- `time` 为有效时间，格式为 `"HH:MM"`.

- `0 <= HH < 24`

- `0 <= MM < 60`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串, 回溯, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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

### Java

```java
// Next Closest Time：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int t;
    private int d;
    private String ans;
    private Set<Character> s;

    public String nextClosestTime(String time) {
        t = Integer.parseInt(time.substring(0, 2)) * 60 + Integer.parseInt(time.substring(3));
        d = Integer.MAX_VALUE;
        s = new HashSet<>();
        char mi = 'z';
        for (char c : time.toCharArray()) {
            if (c != ':') {
                s.add(c);
                if (c < mi) {
                    mi = c;
                }
            }
        }
        ans = null;
        dfs("");
        if (ans == null) {
            ans = "" + mi + mi + ":" + mi + mi;
        }
        return ans;
    }

    private void dfs(String curr) {
        if (curr.length() == 4) {
            if (!check(curr)) {
                return;
            }
            int p
                = Integer.parseInt(curr.substring(0, 2)) * 60 + Integer.parseInt(curr.substring(2));
            if (p > t && p - t < d) {
                d = p - t;
                ans = curr.substring(0, 2) + ":" + curr.substring(2);
            }
            return;
        }
        for (char c : s) {
            dfs(curr + c);
        }
    }

    private boolean check(String t) {
        int h = Integer.parseInt(t.substring(0, 2));
        int m = Integer.parseInt(t.substring(2));
        return 0 <= h && h < 24 && 0 <= m && m < 60;
    }
}
```

### Python

```python
# Next Closest Time：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def nextClosestTime(self, time: str) -> str:
        def check(t):
            h, m = int(t[:2]), int(t[2:])
            return 0 <= h < 24 and 0 <= m < 60

        def dfs(curr):
            if len(curr) == 4:
                if not check(curr):
                    return
                nonlocal ans, d
                p = int(curr[:2]) * 60 + int(curr[2:])
                if t < p < t + d:
                    d = p - t
                    ans = curr[:2] + ':' + curr[2:]
                return
            for c in s:
                dfs(curr + c)

        s = {c for c in time if c != ':'}
        t = int(time[:2]) * 60 + int(time[3:])
        d = inf
        ans = None
        dfs('')
        if ans is None:
            mi = min(int(c) for c in s)
            ans = f'{mi}{mi}:{mi}{mi}'
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

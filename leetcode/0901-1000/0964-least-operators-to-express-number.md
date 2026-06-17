# 0964. Least Operators to Express Number

---
编号: 964
题目: Least Operators to Express Number
难度: 困难
标签: [记忆化, 数学, 动态规划]
来源链接: https://leetcode.com/problems/least-operators-to-express-number/
---

## 题目描述

给定一个正整数 `x`，我们将会写出一个形如 `x (op1) x (op2) x (op3) x ...` 的表达式，其中每个运算符 `op1`，`op2`，… 可以是加、减、乘、除（`+`，`-`，`*`，或是 `/`）之一。例如，对于 `x = 3`，我们可以写出表达式 `3 * 3 / 3 + 3 - 3`，该式的值为 3 。

在写这样的表达式时，我们需要遵守下面的惯例：

- 除运算符（`/`）返回有理数。

- 任何地方都没有括号。

- 我们使用通常的操作顺序：乘法和除法发生在加法和减法之前。

- 不允许使用一元否定运算符（`-`）。例如，“`x - x`” 是一个有效的表达式，因为它只使用减法，但是 “`-x + x`” 不是，因为它使用了否定运算符。

我们希望编写一个能使表达式等于给定的目标值 `target` 且运算符最少的表达式。返回所用运算符的最少数量。

**示例 1：**

```text
输入：x = 3, target = 19
输出：5
解释：3 * 3 + 3 * 3 + 3 / 3 。表达式包含 5 个运算符。
```

**示例 2：**

```text
输入：x = 5, target = 501
输出：8
解释：5 * 5 * 5 * 5 - 5 * 5 * 5 + 5 / 5 。表达式包含 8 个运算符。
```

**示例 3：**

```text
输入：x = 100, target = 100000000
输出：3
解释：100 * 100 * 100 * 100 。表达式包含 3 个运算符。
```

**提示：**

- `2 <= x <= 100`

- `1 <= target <= 2 * 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「记忆化, 数学, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个函数 $dfs(v)$，表示用 $x$ 凑成数字 $v$ 所需要的最少运算符数量。那么答案就是 $dfs(target)$。

函数 $dfs(v)$ 的执行逻辑如下：

如果 $x \geq v$，那么此时可以用 $v$ 个 $x / x$ 相加来得到 $v$，运算符数量为 $v \times 2 - 1$；也可以用 $x$ 减去 $(x - v)$ 个 $x / x$ 来得到 $v$，运算符数量为 $(x - v) \times 2$。取两者的最小值。

否则，我们从 $k=2$ 开始枚举 $x^k$，找到第一个 $x^k \geq v$ 的 $k$：

- 如果此时 $x^k - v \geq v$，那么只能先得到 $x^{k-1}$，然后再递归计算 $dfs(v - x^{k-1})$，此时运算符数量为 $k - 1 + dfs(v - x^{k-1})$；
- 如果此时 $x^k - v < v$，那么可以按照上面的方式得到 $v$，此时运算符数量为 $k - 1 + dfs(v - x^{k-1})$；也可以先得到 $x^k$，再递归计算 $dfs(x^k - v)$，此时运算符数量为 $k + dfs(x^k - v)$。取两者的最小值。

为了避免重复计算，我们使用记忆化搜索的方式实现 $dfs$ 函数。

时间复杂度 $O(\log_{x}{target})$，空间复杂度 $O(\log_{x}{target})$。

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
// Least Operators to Express Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func leastOpsExpressTarget(x int, target int) int {
	f := map[int]int{}
	var dfs func(int) int
	dfs = func(v int) int {
		if x > v {
			return min(v*2-1, 2*(x-v))
		}
		if val, ok := f[v]; ok {
			return val
		}
		k := 2
		y := x * x
		for y < v {
			y *= x
			k++
		}
		ans := k - 1 + dfs(v-y/x)
		if y-v < v {
			ans = min(ans, k+dfs(y-v))
		}
		f[v] = ans
		return ans
	}
	return dfs(target)
}
```

### Java

```java
// Least Operators to Express Number：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int x;
    private Map<Integer, Integer> f = new HashMap<>();

    public int leastOpsExpressTarget(int x, int target) {
        this.x = x;
        return dfs(target);
    }

    private int dfs(int v) {
        if (x >= v) {
            return Math.min(v * 2 - 1, 2 * (x - v));
        }
        if (f.containsKey(v)) {
            return f.get(v);
        }
        int k = 2;
        long y = (long) x * x;
        while (y < v) {
            y *= x;
            ++k;
        }
        int ans = k - 1 + dfs(v - (int) (y / x));
        if (y - v < v) {
            ans = Math.min(ans, k + dfs((int) y - v));
        }
        f.put(v, ans);
        return ans;
    }
}
```

### Python

```python
# Least Operators to Express Number：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def leastOpsExpressTarget(self, x: int, target: int) -> int:
        @cache
        def dfs(v: int) -> int:
            if x >= v:
                return min(v * 2 - 1, 2 * (x - v))
            k = 2
            while x**k < v:
                k += 1
            if x**k - v < v:
                return min(k + dfs(x**k - v), k - 1 + dfs(v - x ** (k - 1)))
            return k - 1 + dfs(v - x ** (k - 1))

        return dfs(target)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

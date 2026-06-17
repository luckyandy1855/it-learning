# 0650. 2 Keys Keyboard

---
编号: 650
题目: 2 Keys Keyboard
难度: 中等
标签: [数学, 动态规划]
来源链接: https://leetcode.com/problems/2-keys-keyboard/
---

## 题目描述

最初记事本上只有一个字符 `'A'` 。你每次可以对这个记事本进行两种操作：

- `Copy All`（复制全部）：复制这个记事本中的所有字符（不允许仅复制部分字符）。

- `Paste`（粘贴）：粘贴** 上一次 **复制的字符。

给你一个数字 `n` ，你需要使用最少的操作次数，在记事本上输出 **恰好** `n` 个 `'A'` 。返回能够打印出 `n` 个 `'A'` 的最少操作次数。

**示例 1：**

```text
输入：3
输出：3
解释：
最初, 只有一个字符 'A'。
第 1 步, 使用 Copy All 操作。
第 2 步, 使用 Paste 操作来获得 'AA'。
第 3 步, 使用 Paste 操作来获得 'AAA'。
```

**示例 2：**

```text
输入：n = 1
输出：0
```

**提示：**

- `1 <= n <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

定义 $dfs(i)$ 为输出 $i$ 个字符的最少操作次数。初始化 `dfs(1)=0`。

当 $i\gt 1$ 时，有：


dfs(i)=\min _{j \mid i} (dfs(\frac{i}{j})+j, i), 2\leq j\lt i


时间复杂度 $O(n\sqrt{n})$。

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
// 2 Keys Keyboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minSteps(n int) int {
	f := make([]int, n+1)
	for i := range f {
		f[i] = -1
	}
	var dfs func(int) int
	dfs = func(n int) int {
		if n == 1 {
			return 0
		}
		if f[n] != -1 {
			return f[n]
		}
		ans := n
		for i := 2; i*i <= n; i++ {
			if n%i == 0 {
				ans = min(ans, dfs(n/i)+i)
			}
		}
		return ans
	}
	return dfs(n)
}
```

### Java

```java
// 2 Keys Keyboard：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] f;

    public int minSteps(int n) {
        f = new int[n + 1];
        Arrays.fill(f, -1);
        return dfs(n);
    }

    private int dfs(int n) {
        if (n == 1) {
            return 0;
        }
        if (f[n] != -1) {
            return f[n];
        }
        int ans = n;
        for (int i = 2; i * i <= n; ++i) {
            if (n % i == 0) {
                ans = Math.min(ans, dfs(n / i) + i);
            }
        }
        f[n] = ans;
        return ans;
    }
}
```

### Python

```python
# 2 Keys Keyboard：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minSteps(self, n: int) -> int:
        @cache
        def dfs(n):
            if n == 1:
                return 0
            i, ans = 2, n
            while i * i <= n:
                if n % i == 0:
                    ans = min(ans, dfs(n // i) + i)
                i += 1
            return ans

        return dfs(n)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0204. Count Primes

---
编号: 204
题目: Count Primes
难度: 中等
标签: [数组, 数学, 枚举, 数论]
来源链接: https://leetcode.com/problems/count-primes/
---

## 题目描述

给定整数 `n` ，返回 *所有小于非负整数 `n` 的质数的数量* 。

**示例 1：**

```text
输入：n = 10
输出：4
解释：小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。
```

**示例 2：**

```text
输入：n = 0
输出：0
```

**示例 3：**

```text
输入：n = 1
输出：0
```

**提示：**

- `0 <= n <= 5 * 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学, 枚举, 数论」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

如果 $x$ 是质数，那么大于 $x$ 的 $x$ 的倍数 $2x$,$3x$,… 一定不是质数，因此我们可以从这里入手。

设 $primes[i]$ 表示数 $i$ 是不是质数，如果是质数则为 $true$，否则为 $false$。

我们在 $[2,n]$ 范围内顺序遍历每个数 $i$，如果这个数为质数（$primes[i]==true$），质数个数增 1，然后将其所有的倍数 $j$ 都标记为合数（除了该质数本身），即 $primes[j]=false$，这样在运行结束的时候我们即能知道质数的个数。

时间复杂度 $O(nloglogn)$。

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
// Count Primes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countPrimes(n int) int {
	primes := make([]bool, n)
	for i := range primes {
		primes[i] = true
	}
	ans := 0
	for i := 2; i < n; i++ {
		if primes[i] {
			ans++
			for j := i + i; j < n; j += i {
				primes[j] = false
			}
		}
	}
	return ans
}
```

### Java

```java
import java.util.*;
// Count Primes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int countPrimes(int n) {
        boolean[] primes = new boolean[n];
        Arrays.fill(primes, true);
        int ans = 0;
        for (int i = 2; i < n; ++i) {
            if (primes[i]) {
                ++ans;
                for (int j = i + i; j < n; j += i) {
                    primes[j] = false;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Count Primes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countPrimes(self, n: int) -> int:
        primes = [True] * n
        ans = 0
        for i in range(2, n):
            if primes[i]:
                ans += 1
                for j in range(i + i, n, i):
                    primes[j] = False
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

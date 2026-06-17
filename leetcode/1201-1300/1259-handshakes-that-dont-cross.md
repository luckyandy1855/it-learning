# 1259. Handshakes That Don't Cross

---
编号: 1259
题目: Handshakes That Don't Cross
难度: 困难
标签: [数学, 动态规划]
来源链接: https://leetcode.com/problems/handshakes-that-dont-cross/
---

## 题目描述

**偶数** 个人站成一个圆，总人数为 `num_people` 。每个人与除自己外的一个人握手，所以总共会有 `num_people / 2` 次握手。

将握手的人之间连线，请你返回连线不会相交的握手方案数。

由于结果可能会很大，请你返回答案 **模** **`10^9+7`** 后的结果。

**示例 1：**

```text
输入：num_people = 2
输出：1
```

**示例 2：**

```text
输入：num_people = 4
输出：2
解释：总共有两种方案，第一种方案是 [(1,2),(3,4)] ，第二种方案是 [(2,3),(4,1)] 。
```

**示例 3：**

```text
输入：num_people = 6
输出：5
```

**示例 4：**

```text
输入：num_people = 8
输出：14
```

**提示：**

- `2 <= num_people <= 1000`

- `num_people % 2 == 0`

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

我们设计一个函数 $dfs(i)$，表示 $i$ 个人的握手方案数。答案为 $dfs(n)$。

函数 $dfs(i)$ 的执行逻辑如下：

- 如果 $i \lt 2$，那么只有一种握手方案，即不握手，返回 $1$。
- 否则，我们可以枚举第一个人与谁握手，记剩余的左边的人数为 $l$，右边的人数为 $r=i-l-2$，那么有 $dfs(i)= \sum_{l=0}^{i-1} dfs(l) \times dfs(r)$。

为了避免重复计算，我们使用记忆化搜索的方法。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为 $numPeople$ 的大小。

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
// Handshakes That Don't Cross：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberOfWays(numPeople int) int {
	const mod int = 1e9 + 7
	f := make([]int, numPeople+1)
	var dfs func(int) int
	dfs = func(i int) int {
		if i < 2 {
			return 1
		}
		if f[i] != 0 {
			return f[i]
		}
		for l := 0; l < i; l += 2 {
			r := i - l - 2
			f[i] = (f[i] + dfs(l)*dfs(r)) % mod
		}
		return f[i]
	}
	return dfs(numPeople)
}
```

### Java

```java
// Handshakes That Don't Cross：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] f;
    private final int mod = (int) 1e9 + 7;

    public int numberOfWays(int numPeople) {
        f = new int[numPeople + 1];
        return dfs(numPeople);
    }

    private int dfs(int i) {
        if (i < 2) {
            return 1;
        }
        if (f[i] != 0) {
            return f[i];
        }
        for (int l = 0; l < i; l += 2) {
            int r = i - l - 2;
            f[i] = (int) ((f[i] + (1L * dfs(l) * dfs(r) % mod)) % mod);
        }
        return f[i];
    }
}
```

### Python

```python
# Handshakes That Don't Cross：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberOfWays(self, numPeople: int) -> int:
        @cache
        def dfs(i: int) -> int:
            if i < 2:
                return 1
            ans = 0
            for l in range(0, i, 2):
                r = i - l - 2
                ans += dfs(l) * dfs(r)
                ans %= mod
            return ans

        mod = 10**9 + 7
        return dfs(numPeople)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

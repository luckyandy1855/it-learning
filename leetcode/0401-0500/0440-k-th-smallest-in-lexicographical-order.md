# 0440. K-th Smallest in Lexicographical Order

---
编号: 440
题目: K-th Smallest in Lexicographical Order
难度: 困难
标签: [字典树]
来源链接: https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/
---

## 题目描述

给定整数 `n` 和 `k`，返回  `[1, n]` 中字典序第 `k` 小的数字。

**示例 1:**

```text
输入: n = 13, k = 2
输出: 10
解释: 字典序的排列是 [1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9]，所以第二小的数字是 10。
```

**示例 2:**

```text
输入: n = 1, k = 1
输出: 1
```

**提示:**

- `1 <= k <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字典树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题要求在区间 $[1, n]$ 中，按**字典序**排序后，找到第 $k$ 小的数字。由于 $n$ 的范围非常大（最多可达 $10^9$），我们无法直接枚举所有数字后排序。因此我们采用**贪心 + 字典树模拟**的策略。

我们将 $[1, n]$ 看作一棵 **十叉字典树（Trie）**：

- 每个节点是一个前缀，根节点为空串；
- 节点的子节点是当前前缀拼接上 $0 \sim 9$；
- 例如前缀 $1$ 会有子节点 $10, 11, \ldots, 19$，而 $10$ 会有 $100, 101, \ldots, 109$；
- 这种结构天然符合字典序遍历。

```
根
├── 1
│   ├── 10
│   ├── 11
│   ├── ...
├── 2
├── ...
```

我们使用变量 $\textit{curr}$ 表示当前前缀，初始为 $1$。每次我们尝试向下扩展前缀，直到找到第 $k$ 小的数字。

每次我们计算当前前缀下有多少个合法数字（即以 $\textit{curr}$ 为前缀、且不超过 $n$ 的整数个数），记作 $\textit{count}(\text{curr})$：

- 如果 $k \ge \text{count}(\text{curr})$：说明目标不在这棵子树中，跳过整棵子树，前缀右移：$\textit{curr} \leftarrow \text{curr} + 1$，并更新 $k \leftarrow k - \text{count}(\text{curr})$；
- 否则：说明目标在当前前缀的子树中，进入下一层：$\textit{curr} \leftarrow \text{curr} \times 10$，并消耗一个前缀：$k \leftarrow k - 1$。

每一层我们将当前区间扩大 $10$ 倍，向下延伸到更长的前缀，直到超出 $n$。

时间复杂度 $O(\log^2 n)$，空间复杂度 $O(1)$。

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
// K-th Smallest in Lexicographical Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findKthNumber(n int, k int) int {
	count := func(curr int) int {
		next := curr + 1
		cnt := 0
		for curr <= n {
			cnt += min(n-curr+1, next-curr)
			next *= 10
			curr *= 10
		}
		return cnt
	}
	curr := 1
	k--
	for k > 0 {
		cnt := count(curr)
		if k >= cnt {
			k -= cnt
			curr++
		} else {
			k--
			curr *= 10
		}
	}
	return curr
}
```

### Java

```java
// K-th Smallest in Lexicographical Order：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int n;

    public int findKthNumber(int n, int k) {
        this.n = n;
        long curr = 1;
        --k;
        while (k > 0) {
            int cnt = count(curr);
            if (k >= cnt) {
                k -= cnt;
                ++curr;
            } else {
                --k;
                curr *= 10;
            }
        }
        return (int) curr;
    }

    public int count(long curr) {
        long next = curr + 1;
        long cnt = 0;
        while (curr <= n) {
            cnt += Math.min(n - curr + 1, next - curr);
            next *= 10;
            curr *= 10;
        }
        return (int) cnt;
    }
}
```

### Python

```python
# K-th Smallest in Lexicographical Order：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findKthNumber(self, n: int, k: int) -> int:
        def count(curr):
            next, cnt = curr + 1, 0
            while curr <= n:
                cnt += min(n - curr + 1, next - curr)
                next, curr = next * 10, curr * 10
            return cnt

        curr = 1
        k -= 1
        while k:
            cnt = count(curr)
            if k >= cnt:
                k -= cnt
                curr += 1
            else:
                k -= 1
                curr *= 10
        return curr
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

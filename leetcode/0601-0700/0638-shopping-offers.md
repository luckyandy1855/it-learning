# 0638. Shopping Offers

---
编号: 638
题目: Shopping Offers
难度: 中等
标签: [位运算, 记忆化, 数组, 动态规划, 回溯, 位掩码]
来源链接: https://leetcode.com/problems/shopping-offers/
---

## 题目描述

在 LeetCode 商店中， 有 `n` 件在售的物品。每件物品都有对应的价格。然而，也有一些大礼包，每个大礼包以优惠的价格捆绑销售一组物品。

给你一个整数数组 `price` 表示物品价格，其中 `price[i]` 是第 `i` 件物品的价格。另有一个整数数组 `needs` 表示购物清单，其中 `needs[i]` 是需要购买第 `i` 件物品的数量。

还有一个数组 `special` 表示大礼包，`special[i]` 的长度为 `n + 1` ，其中 `special[i][j]` 表示第 `i` 个大礼包中内含第 `j` 件物品的数量，且 `special[i][n]` （也就是数组中的最后一个整数）为第 `i` 个大礼包的价格。

返回** 确切 **满足购物清单所需花费的最低价格，你可以充分利用大礼包的优惠活动。你不能购买超出购物清单指定数量的物品，即使那样会降低整体价格。任意大礼包可无限次购买。

**示例 1：**

```text
输入：price = [2,5], special = [[3,0,5],[1,2,10]], needs = [3,2]
输出：14
解释：有 A 和 B 两种物品，价格分别为 ¥2 和 ¥5 。
大礼包 1 ，你可以以 ¥5 的价格购买 3A 和 0B 。
大礼包 2 ，你可以以 ¥10 的价格购买 1A 和 2B 。
需要购买 3 个 A 和 2 个 B ， 所以付 ¥10 购买 1A 和 2B（大礼包 2），以及 ¥4 购买 2A 。
```

**示例 2：**

```text
输入：price = [2,3,4], special = [[1,1,0,4],[2,2,1,9]], needs = [1,2,1]
输出：11
解释：A ，B ，C 的价格分别为 ¥2 ，¥3 ，¥4 。
可以用 ¥4 购买 1A 和 1B ，也可以用 ¥9 购买 2A ，2B 和 1C 。
需要买 1A ，2B 和 1C ，所以付 ¥4 买 1A 和 1B（大礼包 1），以及 ¥3 购买 1B ， ¥4 购买 1C 。
不可以购买超出待购清单的物品，尽管购买大礼包 2 更加便宜。
```

**提示：**

- `n == price.length == needs.length`

- `1 <= n <= 6`

- `0 <= price[i], needs[i] <= 10`

- `1 <= special.length <= 100`

- `special[i].length == n + 1`

- `0 <= special[i][j] <= 50`

- 生成的输入对于 `0 <= j <= n - 1` 至少有一个 `special[i][j]` 非零。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 记忆化, 数组, 动态规划, 回溯, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，题目中物品的种类 $n \leq 6$，而每种物品需要购买的数量不超过 $10$，我们可以用 $4$ 个二进制位来表示每种物品需要购买的数量，这样，我们只需要最多 $6 \times 4 = 24$ 个二进制位来表示整个购物清单。

我们首先将购物清单 $\textit{needs}$ 转换为一个整数 $\textit{mask}$，其中第 $i$ 个物品需要购买的数量存储在 $\textit{mask}$ 的第 $i \times 4$ 位到第 $(i + 1) \times 4 - 1$ 位。例如，当 $\textit{needs} = [1, 2, 1]$ 时，有 $\textit{mask} = 0b0001 0010 0001$。

然后，我们设计一个函数 $\textit{dfs}(cur)$，表示当前购物清单的状态为 $\textit{cur}$ 时，我们需要花费的最少金额。那么答案即为 $\textit{dfs}(\textit{mask})$。

函数 $\textit{dfs}(cur)$ 的计算方法如下：

- 我们首先计算当前购物清单 $\textit{cur}$ 不使用大礼包时的花费，记为 $\textit{ans}$。
- 然后，我们遍历每一个大礼包 $\textit{offer}$，如果当前购物清单 $\textit{cur}$ 能够使用大礼包 $\textit{offer}$，即 $\textit{cur}$ 中每种物品的数量都不小于大礼包 $\textit{offer}$ 中的数量，那么我们可以尝试使用这个大礼包。我们将 $\textit{cur}$ 中每种物品的数量减去大礼包 $\textit{offer}$ 中的数量，得到一个新的购物清单 $\textit{nxt}$，然后递归计算 $\textit{nxt}$ 的最少花费，并加上大礼包的价格 $\textit{offer}[n]$，更新 $\textit{ans}$，即 $\textit{ans} = \min(\textit{ans}, \textit{offer}[n] + \textit{dfs}(\textit{nxt}))$。
- 最后，返回 $\textit{ans}$。

为了避免重复计算，我们使用一个哈希表 $\textit{f}$ 记录每一个状态 $\textit{cur}$ 对应的最少花费。

时间复杂度 $O(n \times k \times m^n)$，其中 $n$ 表示物品的种类，而 $k$ 和 $m$ 分别表示大礼包的数量以及每种物品的最大需求量。空间复杂度 $O(n \times m^n)$。

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
// Shopping Offers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shoppingOffers(price []int, special [][]int, needs []int) int {
	const bits = 4
	n := len(needs)
	f := make(map[int]int)
	mask := 0
	for i, need := range needs {
		mask |= need << (i * bits)
	}

	var dfs func(int) int
	dfs = func(cur int) int {
		if v, ok := f[cur]; ok {
			return v
		}
		ans := 0
		for i := 0; i < n; i++ {
			ans += price[i] * ((cur >> (i * bits)) & 0xf)
		}
		for _, offer := range special {
			nxt := cur
			ok := true
			for j := 0; j < n; j++ {
				if ((cur >> (j * bits)) & 0xf) < offer[j] {
					ok = false
					break
				}
				nxt -= offer[j] << (j * bits)
			}
			if ok {
				ans = min(ans, offer[n]+dfs(nxt))
			}
		}
		f[cur] = ans
		return ans
	}

	return dfs(mask)
}
```

### Java

```java
// Shopping Offers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int bits = 4;
    private int n;
    private List<Integer> price;
    private List<List<Integer>> special;
    private Map<Integer, Integer> f = new HashMap<>();

    public int shoppingOffers(
        List<Integer> price, List<List<Integer>> special, List<Integer> needs) {
        n = needs.size();
        this.price = price;
        this.special = special;
        int mask = 0;
        for (int i = 0; i < n; ++i) {
            mask |= needs.get(i) << (i * bits);
        }
        return dfs(mask);
    }

    private int dfs(int cur) {
        if (f.containsKey(cur)) {
            return f.get(cur);
        }
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            ans += price.get(i) * (cur >> (i * bits) & 0xf);
        }
        for (List<Integer> offer : special) {
            int nxt = cur;
            boolean ok = true;
            for (int j = 0; j < n; ++j) {
                if ((cur >> (j * bits) & 0xf) < offer.get(j)) {
                    ok = false;
                    break;
                }
                nxt -= offer.get(j) << (j * bits);
            }
            if (ok) {
                ans = Math.min(ans, offer.get(n) + dfs(nxt));
            }
        }
        f.put(cur, ans);
        return ans;
    }
}
```

### Python

```python
# Shopping Offers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shoppingOffers(
        self, price: List[int], special: List[List[int]], needs: List[int]
    ) -> int:
        @cache
        def dfs(cur: int) -> int:
            ans = sum(p * (cur >> (i * bits) & 0xF) for i, p in enumerate(price))
            for offer in special:
                nxt = cur
                for j in range(len(needs)):
                    if (cur >> (j * bits) & 0xF) < offer[j]:
                        break
                    nxt -= offer[j] << (j * bits)
                else:
                    ans = min(ans, offer[-1] + dfs(nxt))
            return ans

        bits, mask = 4, 0
        for i, need in enumerate(needs):
            mask |= need << i * bits
        return dfs(mask)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

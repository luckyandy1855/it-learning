# 1054. Distant Barcodes

---
编号: 1054
题目: Distant Barcodes
难度: 中等
标签: [贪心, 数组, 哈希表, 计数, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/distant-barcodes/
---

## 题目描述

在一个仓库里，有一排条形码，其中第 `i` 个条形码为 `barcodes[i]`。

请你重新排列这些条形码，使其中任意两个相邻的条形码不能相等。 你可以返回任何满足该要求的答案，此题保证存在答案。

**示例 1：**

```text
输入：barcodes = [1,1,1,2,2,2]
输出：[2,1,2,1,2,1]
```

**示例 2：**

```text
输入：barcodes = [1,1,1,1,2,2,3,3]
输出：[1,3,1,3,2,1,2,1]
```

**提示：**

- `1 <= barcodes.length <= 10000`

- `1 <= barcodes[i] <= 10000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 哈希表, 计数, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先用哈希表或数组 $cnt$ 统计数组 $barcodes$ 中各个数出现的次数，然后将 $barcodes$ 中的数按照它们在 $cnt$ 中出现的次数从大到小排序，如果出现次数相同，那么就按照数的大小从小到大排序（确保相同的数相邻）。

接下来，我们创建一个长度为 $n$ 的答案数组 $ans$，然后遍历排好序的 $barcodes$，将元素依次填入答案数组的 $0, 2, 4, \cdots$ 等偶数下标位置，然后将剩余元素依次填入答案数组的 $1, 3, 5, \cdots$ 等奇数下标位置即可。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(M)$。其中 $n$ 和 $M$ 分别是数组 $barcodes$ 的长度以及数组 $barcodes$ 中的最大值。

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
// Distant Barcodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func rearrangeBarcodes(barcodes []int) []int {
	mx := slices.Max(barcodes)
	cnt := make([]int, mx+1)
	for _, x := range barcodes {
		cnt[x]++
	}
	sort.Slice(barcodes, func(i, j int) bool {
		a, b := barcodes[i], barcodes[j]
		if cnt[a] == cnt[b] {
			return a < b
		}
		return cnt[a] > cnt[b]
	})
	n := len(barcodes)
	ans := make([]int, n)
	for k, j := 0, 0; k < 2; k++ {
		for i := k; i < n; i, j = i+2, j+1 {
			ans[i] = barcodes[j]
		}
	}
	return ans
}
```

### Java

```java
// Distant Barcodes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] rearrangeBarcodes(int[] barcodes) {
        int n = barcodes.length;
        Integer[] t = new Integer[n];
        int mx = 0;
        for (int i = 0; i < n; ++i) {
            t[i] = barcodes[i];
            mx = Math.max(mx, barcodes[i]);
        }
        int[] cnt = new int[mx + 1];
        for (int x : barcodes) {
            ++cnt[x];
        }
        Arrays.sort(t, (a, b) -> cnt[a] == cnt[b] ? a - b : cnt[b] - cnt[a]);
        int[] ans = new int[n];
        for (int k = 0, j = 0; k < 2; ++k) {
            for (int i = k; i < n; i += 2) {
                ans[i] = t[j++];
            }
        }
        return ans;
    }
}
```

### Python

```python
# Distant Barcodes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def rearrangeBarcodes(self, barcodes: List[int]) -> List[int]:
        cnt = Counter(barcodes)
        barcodes.sort(key=lambda x: (-cnt[x], x))
        n = len(barcodes)
        ans = [0] * len(barcodes)
        ans[::2] = barcodes[: (n + 1) // 2]
        ans[1::2] = barcodes[(n + 1) // 2 :]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

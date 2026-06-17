# 0927. Three Equal Parts

---
编号: 927
题目: Three Equal Parts
难度: 困难
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/three-equal-parts/
---

## 题目描述

给定一个由 `0` 和 `1` 组成的数组 `arr` ，将数组分成  **3 个非空的部分** ，使得所有这些部分表示相同的二进制值。

如果可以做到，请返回**任何** `[i, j]`，其中 `i+1

- `3 <= arr.length <= 3 * 10^4`

- `arr[i]` 是 `0` 或 `1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们记数组的长度为 $n$，数组中 $1$ 的数量为 $cnt$。

显然 $cnt$ 必须是 $3$ 的倍数，否则无法将数组三等分，可以提前返回 $[-1, -1]$。如果 $cnt$ 为 $0$，那么意味着数组中所有元素都为 $0$，直接返回 $[0, n - 1]$ 即可。

我们将 $cnt$ 除以 $3$，得到每一份中 $1$ 的数量，然后找到每一份的第一个 $1$ 在数组 `arr` 中的位置（参考以下代码中的 $find(x)$ 函数），分别记为 $i$, $j$, $k$。

```bash
0 1 1 0 0 0 1 1 0 0 0 0 0 1 1 0 0
  ^         ^             ^
  i         j             k
```

接着我们从 $i$, $j$, $k$ 开始往后同时遍历每一部分，判断三部分对应的值是否相等，是则继续遍历，直至 $k$ 到达 $arr$ 末尾。

```bash
0 1 1 0 0 0 1 1 0 0 0 0 0 1 1 0 0
          ^         ^             ^
          i         j             k
```

遍历结束时，若 $k=n$，说明满足三等分，返回此时的 $[i - 1, j]$ 作为答案，否则返回 $[-1, -1]$。

时间复杂度 $O(n)$，其中 $n$ 表示 `arr` 的长度。空间复杂度 $O(1)$。

相似题目：

- [1573. 分割字符串的方案数](https://github.com/doocs/leetcode/blob/main/solution/1500-1599/1573.Number%20of%20Ways%20to%20Split%20a%20String/README.md)

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
// Three Equal Parts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func threeEqualParts(arr []int) []int {
	find := func(x int) int {
		s := 0
		for i, v := range arr {
			s += v
			if s == x {
				return i
			}
		}
		return 0
	}
	n := len(arr)
	cnt := 0
	for _, v := range arr {
		cnt += v
	}
	if cnt%3 != 0 {
		return []int{-1, -1}
	}
	if cnt == 0 {
		return []int{0, n - 1}
	}
	cnt /= 3
	i, j, k := find(1), find(cnt+1), find(cnt*2+1)
	for ; k < n && arr[i] == arr[j] && arr[j] == arr[k]; i, j, k = i+1, j+1, k+1 {
	}
	if k == n {
		return []int{i - 1, j}
	}
	return []int{-1, -1}
}
```

### Java

```java
// Three Equal Parts：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[] arr;

    public int[] threeEqualParts(int[] arr) {
        this.arr = arr;
        int cnt = 0;
        int n = arr.length;
        for (int v : arr) {
            cnt += v;
        }
        if (cnt % 3 != 0) {
            return new int[] {-1, -1};
        }
        if (cnt == 0) {
            return new int[] {0, n - 1};
        }
        cnt /= 3;

        int i = find(1), j = find(cnt + 1), k = find(cnt * 2 + 1);
        for (; k < n && arr[i] == arr[j] && arr[j] == arr[k]; ++i, ++j, ++k) {
        }
        return k == n ? new int[] {i - 1, j} : new int[] {-1, -1};
    }

    private int find(int x) {
        int s = 0;
        for (int i = 0; i < arr.length; ++i) {
            s += arr[i];
            if (s == x) {
                return i;
            }
        }
        return 0;
    }
}
```

### Python

```python
# Three Equal Parts：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def threeEqualParts(self, arr: List[int]) -> List[int]:
        def find(x):
            s = 0
            for i, v in enumerate(arr):
                s += v
                if s == x:
                    return i

        n = len(arr)
        cnt, mod = divmod(sum(arr), 3)
        if mod:
            return [-1, -1]
        if cnt == 0:
            return [0, n - 1]

        i, j, k = find(1), find(cnt + 1), find(cnt * 2 + 1)
        while k < n and arr[i] == arr[j] == arr[k]:
            i, j, k = i + 1, j + 1, k + 1
        return [i - 1, j] if k == n else [-1, -1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

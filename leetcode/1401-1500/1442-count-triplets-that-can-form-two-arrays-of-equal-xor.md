# 1442. Count Triplets That Can Form Two Arrays of Equal XOR

---
编号: 1442
题目: Count Triplets That Can Form Two Arrays of Equal XOR
难度: 中等
标签: [位运算, 数组, 哈希表, 数学, 前缀和]
来源链接: https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/
---

## 题目描述

给你一个整数数组 `arr` 。

现需要从数组中取三个下标 `i`、`j` 和 `k` ，其中 `(0 <= i < j <= k < arr.length)` 。

`a` 和 `b` 定义如下：

- `a = arr[i] ^ arr[i + 1] ^ ... ^ arr[j - 1]`

- `b = arr[j] ^ arr[j + 1] ^ ... ^ arr[k]`

注意：**^** 表示 **按位异或** 操作。

请返回能够令 `a == b` 成立的三元组 (`i`, `j` , `k`) 的数目。

**示例 1：**

```text
输入：arr = [2,3,1,6,7]
输出：4
解释：满足题意的三元组分别是 (0,1,2), (0,2,2), (2,3,4) 以及 (2,4,4)
```

**示例 2：**

```text
输入：arr = [1,1,1,1,1]
输出：10
```

**示例 3：**

```text
输入：arr = [2,3]
输出：0
```

**示例 4：**

```text
输入：arr = [1,3,5,7,9]
输出：3
```

**示例 5：**

```text
输入：arr = [7,11,12,9,5,2,7,17,22]
输出：8
```

**提示：**

- `1 <= arr.length <= 300`

- `1 <= arr[i] <= 10^8`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 哈希表, 数学, 前缀和」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，要找到满足 $a = b$ 的三元组 $(i, j, k)$，即满足 $s = a \oplus b = 0$，我们只需要枚举左端点 $i$，然后计算以 $k$ 为右端点的区间 $[i, k]$ 的前缀异或和 $s$，如果 $s = 0$，那么对于任意 $j \in [i + 1, k]$，都满足 $a = b$，即 $(i, j, k)$ 是一个满足条件的三元组，一共有 $k - i$ 个，我们将其累加到答案中即可。

枚举结束后，返回答案即可。

时间复杂度 $O(n^2)$，其中 $n$ 是数组 $\textit{arr}$ 的长度。空间复杂度 $O(1)$。

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
// Count Triplets That Can Form Two Arrays of Equal XOR：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countTriplets(arr []int) (ans int) {
	for i, x := range arr {
		s := x
		for k := i + 1; k < len(arr); k++ {
			s ^= arr[k]
			if s == 0 {
				ans += k - i
			}
		}
	}
	return
}
```

### Java

```java
// Count Triplets That Can Form Two Arrays of Equal XOR：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int countTriplets(int[] arr) {
        int ans = 0, n = arr.length;
        for (int i = 0; i < n; ++i) {
            int s = arr[i];
            for (int k = i + 1; k < n; ++k) {
                s ^= arr[k];
                if (s == 0) {
                    ans += k - i;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Count Triplets That Can Form Two Arrays of Equal XOR：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countTriplets(self, arr: List[int]) -> int:
        ans, n = 0, len(arr)
        for i, x in enumerate(arr):
            s = x
            for k in range(i + 1, n):
                s ^= arr[k]
                if s == 0:
                    ans += k - i
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

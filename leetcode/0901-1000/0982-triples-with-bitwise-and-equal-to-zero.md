# 0982. Triples with Bitwise AND Equal To Zero

---
编号: 982
题目: Triples with Bitwise AND Equal To Zero
难度: 困难
标签: [位运算, 数组, 哈希表]
来源链接: https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero/
---

## 题目描述

给你一个整数数组 `nums` ，返回其中 **按位与三元组** 的数目。

**按位与三元组** 是由下标 `(i, j, k)` 组成的三元组，并满足下述全部条件：

- `0 <= i < nums.length`

- `0 <= j < nums.length`

- `0 <= k < nums.length`

- `nums[i] & nums[j] & nums[k] == 0` ，其中 `&` 表示按位与运算符。

**示例 1：**

```text
输入：nums = [2,1,3]
输出：12
解释：可以选出如下 i, j, k 三元组：
(i=0, j=0, k=1) : 2 & 2 & 1
(i=0, j=1, k=0) : 2 & 1 & 2
(i=0, j=1, k=1) : 2 & 1 & 1
(i=0, j=1, k=2) : 2 & 1 & 3
(i=0, j=2, k=1) : 2 & 3 & 1
(i=1, j=0, k=0) : 1 & 2 & 2
(i=1, j=0, k=1) : 1 & 2 & 1
(i=1, j=0, k=2) : 1 & 2 & 3
(i=1, j=1, k=0) : 1 & 1 & 2
(i=1, j=2, k=0) : 1 & 3 & 2
(i=2, j=0, k=1) : 3 & 2 & 1
(i=2, j=1, k=0) : 3 & 1 & 2
```

**示例 2：**

```text
输入：nums = [0,0,0]
输出：27
```

**提示：**

- `1 <= nums.length <= 1000`

- `0 <= nums[i] < 2^16`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先枚举任意两个数 $x$ 和 $y$，用哈希表或数组 $cnt$ 统计它们的按位与结果 $x \& y$ 出现的次数。

然后我们枚举 $x$ 和 $y$ 的按位与结果 $xy$，再枚举 $z$，如果 $xy \& z = 0$，则将 $cnt[xy]$ 的值加入答案。

最后返回答案即可。

时间复杂度 $O(n^2 + n \times M)$，空间复杂度 $O(M)$，其中 $n$ 是数组 $nums$ 的长度；而 $M$ 是数组 $nums$ 中的最大值，本题中 $M \leq 2^{16}$。

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
// Triples with Bitwise AND Equal To Zero：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func countTriplets(nums []int) (ans int) {
	mx := slices.Max(nums)
	cnt := make([]int, mx+1)
	for _, x := range nums {
		for _, y := range nums {
			cnt[x&y]++
		}
	}
	for xy := 0; xy <= mx; xy++ {
		for _, z := range nums {
			if xy&z == 0 {
				ans += cnt[xy]
			}
		}
	}
	return
}
```

### Java

```java
// Triples with Bitwise AND Equal To Zero：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int countTriplets(int[] nums) {
        int mx = 0;
        for (int x : nums) {
            mx = Math.max(mx, x);
        }
        int[] cnt = new int[mx + 1];
        for (int x : nums) {
            for (int y : nums) {
                cnt[x & y]++;
            }
        }
        int ans = 0;
        for (int xy = 0; xy <= mx; ++xy) {
            for (int z : nums) {
                if ((xy & z) == 0) {
                    ans += cnt[xy];
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Triples with Bitwise AND Equal To Zero：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def countTriplets(self, nums: List[int]) -> int:
        cnt = Counter(x & y for x in nums for y in nums)
        return sum(v for xy, v in cnt.items() for z in nums if xy & z == 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

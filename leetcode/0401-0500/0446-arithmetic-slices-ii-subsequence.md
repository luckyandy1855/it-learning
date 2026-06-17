# 0446. Arithmetic Slices II - Subsequence

---
编号: 446
题目: Arithmetic Slices II - Subsequence
难度: 困难
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/arithmetic-slices-ii-subsequence/
---

## 题目描述

给你一个整数数组 `nums` ，返回 `nums` 中所有 **等差子序列** 的数目。

如果一个序列中 **至少有三个元素** ，并且任意两个相邻元素之差相同，则称该序列为等差序列。

- 例如，`[1, 3, 5, 7, 9]`、`[7, 7, 7, 7]` 和 `[3, -1, -5, -9]` 都是等差序列。

- 再例如，`[1, 1, 2, 5, 7]` 不是等差序列。

数组中的子序列是从数组中删除一些元素（也可能不删除）得到的一个序列。

- 例如，`[2,5,10]` 是 `[1,2,1,***2***,4,1,***5***,***10***]` 的一个子序列。

题目数据保证答案是一个 **32-bit** 整数。

**示例 1：**

```text
输入：nums = [2,4,6,8,10]
输出：7
解释：所有的等差子序列为：
[2,4,6]
[4,6,8]
[6,8,10]
[2,4,6,8]
[4,6,8,10]
[2,4,6,8,10]
[2,6,10]
```

**示例 2：**

```text
输入：nums = [7,7,7,7,7]
输出：16
解释：数组中的任意子序列都是等差子序列。
```

**提示：**

- `1  <= nums.length <= 1000`

- `-2^31 <= nums[i] <= 2^31 - 1`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][d]$ 表示以 $nums[i]$ 为结尾，公差为 $d$ 的弱等差子序列（最少有两个元素）的个数。由于 $d$ 的范围很大，所以我们使用哈希表来统计。

接下来，我们枚举 $nums$ 中的所有元素对 $(nums[i], nums[j])$，其中 $j \lt i$。我们将其作为等差数列的最后两个元素，由此即可得到公差 $d = nums[i] - nums[j]$。由于公差相同，我们可以将 $nums[i]$ 加到以 $nums[j]$ 为结尾的弱等差子序列的末尾，此时以 $nums[i]$ 为结尾的等差子序列的数量为 $f[j][d]$，我们将其加入答案。然后，我们再将 $nums[i]$ 加到以 $nums[j]$ 为结尾的弱等差子序列的末尾，这对应着状态转移 $f[i][d] += f[j][d]$。同时，$(nums[i], nums[j])$ 这一对元素也可以当作一个弱等差子序列，因此有状态转移 $f[i][d] += f[j][d] + 1$。

枚举结束，返回答案即可。

时间复杂度 $O(n^2)$，空间复杂度 $O(n^2)$。其中 $n$ 是数组 $nums$ 的长度。

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
// Arithmetic Slices II - Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numberOfArithmeticSlices(nums []int) (ans int) {
	f := make([]map[int]int, len(nums))
	for i := range f {
		f[i] = map[int]int{}
	}
	for i, x := range nums {
		for j, y := range nums[:i] {
			d := x - y
			cnt := f[j][d]
			ans += cnt
			f[i][d] += cnt + 1
		}
	}
	return
}
```

### Java

```java
// Arithmetic Slices II - Subsequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numberOfArithmeticSlices(int[] nums) {
        int n = nums.length;
        Map<Long, Integer>[] f = new Map[n];
        Arrays.setAll(f, k -> new HashMap<>());
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                Long d = 1L * nums[i] - nums[j];
                int cnt = f[j].getOrDefault(d, 0);
                ans += cnt;
                f[i].merge(d, cnt + 1, Integer::sum);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Arithmetic Slices II - Subsequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numberOfArithmeticSlices(self, nums: List[int]) -> int:
        f = [defaultdict(int) for _ in nums]
        ans = 0
        for i, x in enumerate(nums):
            for j, y in enumerate(nums[:i]):
                d = x - y
                ans += f[j][d]
                f[i][d] += f[j][d] + 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

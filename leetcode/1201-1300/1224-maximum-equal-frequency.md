# 1224. Maximum Equal Frequency

---
编号: 1224
题目: Maximum Equal Frequency
难度: 困难
标签: [数组, 哈希表]
来源链接: https://leetcode.com/problems/maximum-equal-frequency/
---

## 题目描述

给你一个正整数数组 `nums`，请你帮忙从该数组中找出能满足下面要求的 **最长** 前缀，并返回该前缀的长度：

- 从前缀中 **恰好删除一个** 元素后，剩下每个数字的出现次数都相同。

如果删除这个元素后没有剩余元素存在，仍可认为每个数字都具有相同的出现次数（也就是 0 次）。

**示例 1：**

```text
输入：nums = [2,2,1,1,5,3,3,5]
输出：7
解释：对于长度为 7 的子数组 [2,2,1,1,5,3,3]，如果我们从中删去 nums[4] = 5，就可以得到 [2,2,1,1,3,3]，里面每个数字都出现了两次。
```

**示例 2：**

```text
输入：nums = [1,1,1,2,2,2,3,3,3,4,4,4,5]
输出：13
```

**提示：**

- `2 <= nums.length <= 10^5`

- `1 <= nums[i] <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用 $cnt$ 记录 $nums$ 中每个元素 $v$ 出现的次数，而 $ccnt$ 记录每个次数出现的次数，元素出现的最大次数用 $mx$ 表示。

遍历 $nums$：

- 若最大次数 $mx=1$，说明当前前缀中每个数字均出现 $1$ 次，删除任意一个后，都满足剩余数字次数相同；
- 若所有数字出现的次数均为 $mx$ 和 $mx-1$，并且只有一个数字的出现次数为 $mx$，那么我们删除出现 $mx$ 次数的一个数字，剩余数字次数均为 $mx-1$，满足条件；
- 若除了一个数字，其它所有数字出现次数均为 $mx$ 次，那么我们删除出现一次的数字，剩余数字次数均为 $mx$，满足条件。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 表示 $nums$ 数组的长度。

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
// Maximum Equal Frequency：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func maxEqualFreq(nums []int) int {
	cnt := map[int]int{}
	ccnt := map[int]int{}
	ans, mx := 0, 0
	for i, v := range nums {
		i++
		if cnt[v] > 0 {
			ccnt[cnt[v]]--
		}
		cnt[v]++
		mx = max(mx, cnt[v])
		ccnt[cnt[v]]++
		if mx == 1 {
			ans = i
		} else if ccnt[mx]*mx+ccnt[mx-1]*(mx-1) == i && ccnt[mx] == 1 {
			ans = i
		} else if ccnt[mx]*mx+1 == i && ccnt[1] == 1 {
			ans = i
		}
	}
	return ans
}
```

### Java

```java
// Maximum Equal Frequency：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static int[] cnt = new int[100010];
    private static int[] ccnt = new int[100010];

    public int maxEqualFreq(int[] nums) {
        Arrays.fill(cnt, 0);
        Arrays.fill(ccnt, 0);
        int ans = 0;
        int mx = 0;
        for (int i = 1; i <= nums.length; ++i) {
            int v = nums[i - 1];
            if (cnt[v] > 0) {
                --ccnt[cnt[v]];
            }
            ++cnt[v];
            mx = Math.max(mx, cnt[v]);
            ++ccnt[cnt[v]];
            if (mx == 1) {
                ans = i;
            } else if (ccnt[mx] * mx + ccnt[mx - 1] * (mx - 1) == i && ccnt[mx] == 1) {
                ans = i;
            } else if (ccnt[mx] * mx + 1 == i && ccnt[1] == 1) {
                ans = i;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Maximum Equal Frequency：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def maxEqualFreq(self, nums: List[int]) -> int:
        cnt = Counter()
        ccnt = Counter()
        ans = mx = 0
        for i, v in enumerate(nums, 1):
            if v in cnt:
                ccnt[cnt[v]] -= 1
            cnt[v] += 1
            mx = max(mx, cnt[v])
            ccnt[cnt[v]] += 1
            if mx == 1:
                ans = i
            elif ccnt[mx] * mx + ccnt[mx - 1] * (mx - 1) == i and ccnt[mx] == 1:
                ans = i
            elif ccnt[mx] * mx + 1 == i and ccnt[1] == 1:
                ans = i
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

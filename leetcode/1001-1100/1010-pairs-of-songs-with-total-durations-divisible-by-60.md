# 1010. Pairs of Songs With Total Durations Divisible by 60

---
编号: 1010
题目: Pairs of Songs With Total Durations Divisible by 60
难度: 中等
标签: [数组, 哈希表, 计数]
来源链接: https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/
---

## 题目描述

在歌曲列表中，第 `i` 首歌曲的持续时间为 `time[i]` 秒。

返回其总持续时间（以秒为单位）可被 `60` 整除的歌曲对的数量。形式上，我们希望下标数字 `i` 和 `j` 满足  `i < j` 且有 `(time[i] + time[j]) % 60 == 0`。

**示例 1：**

```text
输入：time = [30,20,150,100,40]
输出：3
解释：这三对的总持续时间可被 60 整除：
(time[0] = 30, time[2] = 150): 总持续时间 180
(time[1] = 20, time[3] = 100): 总持续时间 120
(time[1] = 20, time[4] = 40): 总持续时间 60
```

**示例 2：**

```text
输入：time = [60,60,60]
输出：3
解释：所有三对的总持续时间都是 120，可以被 60 整除。
```

**提示：**

- `1 <= time.length <= 6 * 10^4`

- `1 <= time[i] <= 500`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

如果一个数对 $(a, b)$ 之和能被 $60$ 整除，即 $(a + b) \bmod 60 = 0$，那么 $(a \bmod 60 + b \bmod 60) \bmod 60 = 0$，不妨记 $x=a \bmod 60$, $y = b \bmod 60$，那么有 $(x + y) \bmod 60 = 0$，即 $y=(60 - x) \bmod 60$。

因此，我们可以遍历歌曲列表，用一个长度为 $60$ 的数组 $cnt$ 记录每个余数 $x$ 出现的次数。对于当前的 $x$，如果数组 $cnt$ 中存在余数 $y = (60 - x) \bmod 60$，那么将 $cnt[y]$ 累加进答案中。然后，将 $x$ 在数组 $cnt$ 中的出现次数加 $1$。继续遍历，直到遍历完整个歌曲列表。

遍历结束后，即可得到满足条件的歌曲对数目。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 是歌曲列表的长度；而 $C$ 是余数的可能取值，这里 $C=60$。

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
// Pairs of Songs With Total Durations Divisible by 60：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numPairsDivisibleBy60(time []int) (ans int) {
	cnt := [60]int{}
	for _, x := range time {
		x %= 60
		y := (60 - x) % 60
		ans += cnt[y]
		cnt[x]++
	}
	return
}
```

### Java

```java
// Pairs of Songs With Total Durations Divisible by 60：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numPairsDivisibleBy60(int[] time) {
        int[] cnt = new int[60];
        int ans = 0;
        for (int x : time) {
            x %= 60;
            int y = (60 - x) % 60;
            ans += cnt[y];
            ++cnt[x];
        }
        return ans;
    }
}
```

### Python

```python
# Pairs of Songs With Total Durations Divisible by 60：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numPairsDivisibleBy60(self, time: List[int]) -> int:
        cnt = Counter()
        ans = 0
        for x in time:
            x %= 60
            y = (60 - x) % 60
            ans += cnt[y]
            cnt[x] += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

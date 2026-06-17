# 0825. Friends Of Appropriate Ages

---
编号: 825
题目: Friends Of Appropriate Ages
难度: 中等
标签: [数组, 双指针, 二分查找, 排序]
来源链接: https://leetcode.com/problems/friends-of-appropriate-ages/
---

## 题目描述

在社交媒体网站上有 `n` 个用户。给你一个整数数组 `ages` ，其中 `ages[i]` 是第 `i` 个用户的年龄。

如果下述任意一个条件为真，那么用户 `x` 将不会向用户 `y`（`x != y`）发送好友请求：

- `ages[y]  ages[x]`

- `ages[y] > 100 && ages[x] < 100`

否则，`x` 将会向 `y` 发送一条好友请求。

注意，如果 `x` 向 `y` 发送一条好友请求，`y` 不必也向 `x` 发送一条好友请求。另外，用户不会向自己发送好友请求。

返回在该社交媒体网站上产生的好友请求总数。

**示例 1：**

```text
输入：ages = [16,16]
输出：2
解释：2 人互发好友请求。
```

**示例 2：**

```text
输入：ages = [16,17,18]
输出：2
解释：产生的好友请求为 17 -> 16 ，18 -> 17 。
```

**示例 3：**

```text
输入：ages = [20,30,100,110,120]
输出：3
解释：产生的好友请求为 110 -> 100 ，120 -> 110 ，120 -> 100 。
```

**提示：**

- `n == ages.length`

- `1 <= n <= 2 * 10^4`

- `1 <= ages[i] <= 120`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 双指针, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以用一个长度为 $121$ 的数组 $\textit{cnt}$ 记录每个年龄的人数。

接下来，枚举所有可能的年龄对 $(\textit{ax}, \textit{ay})$，如果 $\textit{ax}$ 和 $\textit{ay}$ 不满足题目中的任意一个条件，这些年龄对 $(\textit{ax}, \textit{ay})$ 就可以互发好友请求。

此时，如果 $\textit{ax} = \textit{ay}$，年龄相同，那么 $\textit{ax}$ 和 $\textit{ay}$ 之间的好友请求数为 $\textit{cnt}[\textit{ax}] \times (\textit{cnt}[\textit{ax}] - 1)$；否则，年龄不同，那么 $\textit{ax}$ 和 $\textit{ay}$ 之间的好友请求数为 $\textit{cnt}[\textit{ax}] \times \textit{cnt}[\textit{ay}]$。我们将这些好友请求数累加到答案中即可。

时间复杂度 $O(n + m^2)$，其中 $n$ 是数组 $\textit{ages}$ 的长度，而 $m$ 是年龄的最大值，本题中 $m = 121$。

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
// Friends Of Appropriate Ages：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numFriendRequests(ages []int) (ans int) {
	cnt := [121]int{}
	for _, x := range ages {
		cnt[x]++
	}
	for ax, x := range cnt {
		for ay, y := range cnt {
			if ay <= ax/2+7 || ay > ax || (ay > 100 && ax < 100) {
				continue
			}
			if ax == ay {
				ans += x * (x - 1)
			} else {
				ans += x * y
			}
		}
	}

	return
}
```

### Java

```java
// Friends Of Appropriate Ages：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int numFriendRequests(int[] ages) {
        final int m = 121;
        int[] cnt = new int[m];
        for (int x : ages) {
            ++cnt[x];
        }
        int ans = 0;
        for (int ax = 1; ax < m; ++ax) {
            for (int ay = 1; ay < m; ++ay) {
                if (!(ay <= 0.5 * ax + 7 || ay > ax || (ay > 100 && ax < 100))) {
                    ans += cnt[ax] * (cnt[ay] - (ax == ay ? 1 : 0));
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Friends Of Appropriate Ages：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numFriendRequests(self, ages: List[int]) -> int:
        cnt = [0] * 121
        for x in ages:
            cnt[x] += 1
        ans = 0
        for ax, x in enumerate(cnt):
            for ay, y in enumerate(cnt):
                if not (ay <= 0.5 * ax + 7 or ay > ax or (ay > 100 and ax < 100)):
                    ans += x * (y - int(ax == ay))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

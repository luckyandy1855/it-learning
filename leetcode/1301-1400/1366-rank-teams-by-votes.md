# 1366. Rank Teams by Votes

---
编号: 1366
题目: Rank Teams by Votes
难度: 中等
标签: [数组, 哈希表, 字符串, 计数, 排序]
来源链接: https://leetcode.com/problems/rank-teams-by-votes/
---

## 题目描述

现在有一个特殊的排名系统，依据参赛团队在投票人心中的次序进行排名，每个投票者都需要按从高到低的顺序对参与排名的所有团队进行排位。

排名规则如下：

- 参赛团队的排名次序依照其所获「排位第一」的票的多少决定。如果存在多个团队并列的情况，将继续考虑其「排位第二」的票的数量。以此类推，直到不再存在并列的情况。

- 如果在考虑完所有投票情况后仍然出现并列现象，则根据团队字母的字母顺序进行排名。

给你一个字符串数组 `votes` 代表全体投票者给出的排位情况，请你根据上述排名规则对所有参赛团队进行排名。

请你返回能表示按排名系统 **排序后** 的所有团队排名的字符串。

示例 1：

```text
输入：votes = ["ABC","ACB","ABC","ACB","ACB"]
输出："ACB"
解释：
A 队获得五票「排位第一」，没有其他队获得「排位第一」，所以 A 队排名第一。
B 队获得两票「排位第二」，三票「排位第三」。
C 队获得三票「排位第二」，两票「排位第三」。
由于 C 队「排位第二」的票数较多，所以 C 队排第二，B 队排第三。
```

示例 2：

```text
输入：votes = ["WXYZ","XYZW"]
输出："XWYZ"
解释：
X 队在并列僵局打破后成为排名第一的团队。X 队和 W 队的「排位第一」票数一样，但是 X 队有一票「排位第二」，而 W 没有获得「排位第二」。
```

示例 3：

```text
输入：votes = ["ZMNAGUEDSJYLBOPHRQICWFXTVK"]
输出："ZMNAGUEDSJYLBOPHRQICWFXTVK"
解释：只有一个投票者，所以排名完全按照他的意愿。
```

**提示：**

- `1 <= votes.length <= 1000`

- `1 <= votes[i].length <= 26`

- `votes[i].length == votes[j].length` for `0 <= i, j < votes.length`

- `votes[i][j]` 是英文 **大写** 字母

- `votes[i]` 中的所有字母都是唯一的

- `votes[0]` 中出现的所有字母 **同样也** 出现在 `votes[j]` 中，其中 `1 <= j < votes.length`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 计数, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于每个候选人，我们可以统计他在每个排位上的票数，然后根据不同的排位依次比较票数，票数相同则比较字母。

时间复杂度 $O(n \times m + m^2 \times \log m)$，空间复杂度 $O(m^2)$。其中 $n$ 是 $\textit{votes}$ 的长度，而 $m$ 是候选人的数量，即 $\textit{votes}[0]$ 的长度。

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
// Rank Teams by Votes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func rankTeams(votes []string) string {
	m := len(votes[0])
	cnt := [26][27]int{}
	for _, vote := range votes {
		for i, ch := range vote {
			cnt[ch-'A'][i]++
		}
	}
	s := []rune(votes[0])
	sort.Slice(s, func(i, j int) bool {
		a, b := s[i]-'A', s[j]-'A'
		for k := 0; k < m; k++ {
			if cnt[a][k] != cnt[b][k] {
				return cnt[a][k] > cnt[b][k]
			}
		}
		return s[i] < s[j]
	})
	return string(s)
}
```

### Java

```java
// Rank Teams by Votes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String rankTeams(String[] votes) {
        int m = votes[0].length();
        int[][] cnt = new int[26][m + 1];
        for (var vote : votes) {
            for (int i = 0; i < m; ++i) {
                ++cnt[vote.charAt(i) - 'A'][i];
            }
        }
        Character[] s = new Character[m];
        for (int i = 0; i < m; ++i) {
            s[i] = votes[0].charAt(i);
        }
        Arrays.sort(s, (a, b) -> {
            int i = a - 'A', j = b - 'A';
            for (int k = 0; k < m; ++k) {
                if (cnt[i][k] != cnt[j][k]) {
                    return cnt[j][k] - cnt[i][k];
                }
            }
            return a - b;
        });
        StringBuilder ans = new StringBuilder();
        for (var c : s) {
            ans.append(c);
        }
        return ans.toString();
    }
}
```

### Python

```python
# Rank Teams by Votes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def rankTeams(self, votes: List[str]) -> str:
        m = len(votes[0])
        cnt = defaultdict(lambda: [0] * m)
        for vote in votes:
            for i, c in enumerate(vote):
                cnt[c][i] += 1
        return "".join(sorted(cnt, key=lambda c: (cnt[c], -ord(c)), reverse=True))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

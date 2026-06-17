# 1125. Smallest Sufficient Team

---
编号: 1125
题目: Smallest Sufficient Team
难度: 困难
标签: [位运算, 数组, 动态规划, 位掩码]
来源链接: https://leetcode.com/problems/smallest-sufficient-team/
---

## 题目描述

作为项目经理，你规划了一份需求的技能清单 `req_skills`，并打算从备选人员名单 `people` 中选出些人组成一个「必要团队」（ 编号为 `i` 的备选人员 `people[i]` 含有一份该备选人员掌握的技能列表）。

所谓「必要团队」，就是在这个团队中，对于所需求的技能列表 `req_skills` 中列出的每项技能，团队中至少有一名成员已经掌握。可以用每个人的编号来表示团队中的成员：

- 例如，团队 `team = [0, 1, 3]` 表示掌握技能分别为 `people[0]`，`people[1]`，和 `people[3]` 的备选人员。

请你返回 **任一** 规模最小的必要团队，团队成员用人员编号表示。你可以按 **任意顺序** 返回答案，题目数据保证答案存在。

**示例 1：**

```text
输入：req_skills = ["java","nodejs","reactjs"], people = [["java"],["nodejs"],["nodejs","reactjs"]]
输出：[0,2]
```

**示例 2：**

```text
输入：req_skills = ["algorithms","math","java","reactjs","csharp","aws"], people = [["algorithms","math","java"],["algorithms","math","reactjs"],["java","csharp","aws"],["reactjs","csharp"],["csharp","math"],["aws","java"]]
输出：[1,2]
```

**提示：**

- `1 <= req_skills.length <= 16`

- `1 <= req_skills[i].length <= 16`

- `req_skills[i]` 由小写英文字母组成

- `req_skills` 中的所有字符串 **互不相同**

- `1 <= people.length <= 60`

- `0 <= people[i].length <= 16`

- `1 <= people[i][j].length <= 16`

- `people[i][j]` 由小写英文字母组成

- `people[i]` 中的所有字符串 **互不相同**

- `people[i]` 中的每个技能是 `req_skills` 中的技能

- 题目数据保证「必要团队」一定存在

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 数组, 动态规划, 位掩码」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，技能清单 `req_skills` 的长度不超过 $16$，因此，我们可以用一个长度不超过 $16$ 的二进制数来表示每一种技能是否被掌握。不妨记数组 `req_skills` 的长度为 $m$，数组 `people` 的长度为 $n$。

我们先将 `req_skills` 中的每个技能映射到一个编号，即 $d[s]$ 表示技能 $s$ 的编号。然后，我们遍历 `people` 中的每个人，将其掌握的技能用二进制数表示，即 $p[i]$ 表示编号为 $i$ 的人掌握的技能。

接下来，我们定义以下三个数组，其中：

- 数组 $f[i]$ 表示掌握技能集合为 $i$ 的最少人数，其中 $i$ 的二进制表示中的每一位为 $1$ 的位置，表示对应的技能被掌握。初始时 $f[0] = 0$，其余位置均为无穷大。
- 数组 $g[i]$ 表示掌握技能集合为 $i$ 的最少人数时，最后一个人的编号。
- 数组 $h[i]$ 表示掌握技能集合为 $i$ 的最少人数时，上一个技能集合状态。

我们在 $[0,..2^m-1]$ 的范围内枚举每个技能集合，对于每个技能集合 $i$：

我们枚举 `people` 中的每个人 $j$，如果 $f[i] + 1 \lt f[i | p[j]]$，说明 $f[i | p[j]]$ 可以通过 $f[i]$ 转移得到，此时，我们更新 $f[i | p[j]]$ 为 $f[i] + 1$，并将 $g[i | p[j]]$ 更新为 $j$，同时将 $h[i | p[j]]$ 更新为 $i$。即当前技能集合状态为 $i | p[j]$ 时，最后一个人的编号为 $j$，上一个技能集合状态为 $i$。这里符号 $|$ 表示按位或运算。

最后，我们从技能集合 $i=2^m-1$ 开始，找到此时最后一个人的编号 $g[i]$，将其加入答案中，然后将 $i$ 更新为 $h[i]$，不断地向前回溯，直到 $i=0$，即可得到最小的必要团队中的人员编号。

时间复杂度 $O(2^m \times n)$，空间复杂度 $O(2^m)$。其中 $m$ 和 $n$ 分别为 `req_skills` 和 `people` 的长度。

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
// Smallest Sufficient Team：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func smallestSufficientTeam(req_skills []string, people [][]string) (ans []int) {
	d := map[string]int{}
	for i, s := range req_skills {
		d[s] = i
	}
	m, n := len(req_skills), len(people)
	p := make([]int, n)
	for i, ss := range people {
		for _, s := range ss {
			p[i] |= 1 << d[s]
		}
	}
	const inf = 1 << 30
	f := make([]int, 1<<m)
	g := make([]int, 1<<m)
	h := make([]int, 1<<m)
	for i := range f {
		f[i] = inf
	}
	f[0] = 0
	for i := range f {
		if f[i] == inf {
			continue
		}
		for j := 0; j < n; j++ {
			if f[i]+1 < f[i|p[j]] {
				f[i|p[j]] = f[i] + 1
				g[i|p[j]] = j
				h[i|p[j]] = i
			}
		}
	}
	for i := 1<<m - 1; i != 0; i = h[i] {
		ans = append(ans, g[i])
	}
	return
}
```

### Java

```java
// Smallest Sufficient Team：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] smallestSufficientTeam(String[] req_skills, List<List<String>> people) {
        Map<String, Integer> d = new HashMap<>();
        int m = req_skills.length;
        int n = people.size();
        for (int i = 0; i < m; ++i) {
            d.put(req_skills[i], i);
        }
        int[] p = new int[n];
        for (int i = 0; i < n; ++i) {
            for (var s : people.get(i)) {
                p[i] |= 1 << d.get(s);
            }
        }
        int[] f = new int[1 << m];
        int[] g = new int[1 << m];
        int[] h = new int[1 << m];
        final int inf = 1 << 30;
        Arrays.fill(f, inf);
        f[0] = 0;
        for (int i = 0; i < 1 << m; ++i) {
            if (f[i] == inf) {
                continue;
            }
            for (int j = 0; j < n; ++j) {
                if (f[i] + 1 < f[i | p[j]]) {
                    f[i | p[j]] = f[i] + 1;
                    g[i | p[j]] = j;
                    h[i | p[j]] = i;
                }
            }
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = (1 << m) - 1; i != 0; i = h[i]) {
            ans.add(g[i]);
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

### Python

```python
# Smallest Sufficient Team：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def smallestSufficientTeam(
        self, req_skills: List[str], people: List[List[str]]
    ) -> List[int]:
        d = {s: i for i, s in enumerate(req_skills)}
        m, n = len(req_skills), len(people)
        p = [0] * n
        for i, ss in enumerate(people):
            for s in ss:
                p[i] |= 1 << d[s]
        f = [inf] * (1 << m)
        g = [0] * (1 << m)
        h = [0] * (1 << m)
        f[0] = 0
        for i in range(1 << m):
            if f[i] == inf:
                continue
            for j in range(n):
                if f[i] + 1 < f[i | p[j]]:
                    f[i | p[j]] = f[i] + 1
                    g[i | p[j]] = j
                    h[i | p[j]] = i
        i = (1 << m) - 1
        ans = []
        while i:
            ans.append(g[i])
            i = h[i]
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

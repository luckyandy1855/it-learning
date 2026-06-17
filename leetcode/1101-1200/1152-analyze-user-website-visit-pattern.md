# 1152. Analyze User Website Visit Pattern

---
编号: 1152
题目: Analyze User Website Visit Pattern
难度: 中等
标签: [数组, 哈希表, 字符串, 排序]
来源链接: https://leetcode.com/problems/analyze-user-website-visit-pattern/
---

## 题目描述

给定两个字符串数组 `username` 和 `website` 和一个整数数组 `timestamp` 。给定的数组长度相同，其中元组 `[username[i], website[i], timestamp[i]]` 表示用户 `username[i]` 在时间 `timestamp[i]` 访问了网站 `website[i]` 。

**访问模式** 是包含三个网站的列表(不一定是完全不同的)。

- 例如，`["home"， "away"， "love"]`， `["leetcode"， "love"， "leetcode"]`，和 `["luffy"， "luffy"， "luffy"]` 都是模式。

一种 **访问****模式** 的 **得分** 是访问该模式中所有网站的用户数量，这些网站在该模式中出现的顺序相同。

- 例如，如果模式是 `[“home”，“away”，“love”] `，那么分数就是用户数量 `x` , `x` 访问了 “`home”` ，然后访问了 `“away”` ，然后访问了 `“love” `。

- 同样，如果模式是 `["leetcode"， "love"， "leetcode"]` ，那么分数就是用户数量 `x` ，使得 `x` 访问了`"leetcode"`，然后访问了 `"love"` ，之后又访问了 `"leetcode"` 。

- 另外，如果模式是 `[“luffy”，“luffy”，“luffy”]` ，那么分数就是用户数量 `x` ，使得 `x` 就可以在不同的时间戳上访问 `“luffy”` 三次。

返回* **得分** 最大的 **访问****模式*** 。如果有多个访问模式具有相同的最大分数，则返回字典序最小的。

请注意，模式中的网站不需要连续访问，只需按照模式中出现的顺序访问即可。

示例 1：

```text
输入：username = ["joe","joe","joe","james","james","james","james","mary","mary","mary"], timestamp = [1,2,3,4,5,6,7,8,9,10], website = ["home","about","career","home","cart","maps","home","home","about","career"]
输出：["home","about","career"]
解释：本例中的元组是:
["joe","home",1],["joe","about",2],["joe","career",3],["james","home",4],["james","cart",5],["james","maps",6],["james","home",7],["mary","home",8],["mary","about",9] 和 ["mary","career",10]。
模式 ("home", "about", "career") 的得分为 2（joe 和 mary）。
模式 ("home", "cart", "maps") 的得分为 1 (james).
模式 ("home", "cart", "home") 的得分为 1 (james).
模式 ("home", "maps", "home") 的得分为 1 (james).
模式 ("cart", "maps", "home") 的得分为 1 (james).
模式 ("home", "home", "home") 的得分为 0(没有用户访问过 home 3次)。
```

示例 2：

```text
输入: username = ["ua","ua","ua","ub","ub","ub"], timestamp = [1,2,3,4,5,6], website = ["a","b","a","a","b","c"]
输出: ["a","b","a"]
```

**提示：**

- `3 <= username.length <= 50`

- `1 <= username[i].length <= 10`

- `timestamp.length == username.length`

- `1 <= timestamp[i] <= 10^9`

- `website.length == username.length`

- `1 <= website[i].length <= 10`

- `username[i]` 和 `website[i]` 都只含小写字符

- 它保证至少有一个用户访问了至少三个网站

- 所有元组 `[username[i]， timestamp[i]， website[i]` 均** 不重复**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先用哈希表 $d$ 记录每个用户访问的网站，然后遍历 $d$，对于每个用户，我们枚举其访问的所有三元组，统计去重三元组的出现次数，最后遍历所有三元组，返回出现次数最多的、字典序最小的三元组。

时间复杂度 $O(n^3)$，空间复杂度 $O(n^3)$。其中 $n$ 是 `username` 的长度。

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
// Analyze User Website Visit Pattern：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func mostVisitedPattern(username []string, timestamp []int, website []string) []string {
	d := map[string][]pair{}
	for i, user := range username {
		ts := timestamp[i]
		site := website[i]
		d[user] = append(d[user], pair{ts, site})
	}
	cnt := map[string]int{}
	for _, sites := range d {
		m := len(sites)
		s := map[string]bool{}
		if m > 2 {
			sort.Slice(sites, func(i, j int) bool { return sites[i].ts < sites[j].ts })
			for i := 0; i < m-2; i++ {
				for j := i + 1; j < m-1; j++ {
					for k := j + 1; k < m; k++ {
						s[sites[i].site+","+sites[j].site+","+sites[k].site] = true
					}
				}
			}
		}
		for t := range s {
			cnt[t]++
		}
	}
	mx, t := 0, ""
	for p, v := range cnt {
		if mx < v || (mx == v && p < t) {
			mx = v
			t = p
		}
	}
	return strings.Split(t, ",")
}

type pair struct {
	ts   int
	site string
}
```

### Java

```java
// Analyze User Website Visit Pattern：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> mostVisitedPattern(String[] username, int[] timestamp, String[] website) {
        Map<String, List<Node>> d = new HashMap<>();
        int n = username.length;
        for (int i = 0; i < n; ++i) {
            String user = username[i];
            int ts = timestamp[i];
            String site = website[i];
            d.computeIfAbsent(user, k -> new ArrayList<>()).add(new Node(user, ts, site));
        }
        Map<String, Integer> cnt = new HashMap<>();
        for (var sites : d.values()) {
            int m = sites.size();
            Set<String> s = new HashSet<>();
            if (m > 2) {
                Collections.sort(sites, (a, b) -> a.ts - b.ts);
                for (int i = 0; i < m - 2; ++i) {
                    for (int j = i + 1; j < m - 1; ++j) {
                        for (int k = j + 1; k < m; ++k) {
                            s.add(sites.get(i).site + "," + sites.get(j).site + ","
                                + sites.get(k).site);
                        }
                    }
                }
            }
            for (String t : s) {
                cnt.put(t, cnt.getOrDefault(t, 0) + 1);
            }
        }
        int mx = 0;
        String t = "";
        for (var e : cnt.entrySet()) {
            if (mx < e.getValue() || (mx == e.getValue() && e.getKey().compareTo(t) < 0)) {
                mx = e.getValue();
                t = e.getKey();
            }
        }
        return Arrays.asList(t.split(","));
    }
}

class Node {
    String user;
    int ts;
    String site;

    Node(String user, int ts, String site) {
        this.user = user;
        this.ts = ts;
        this.site = site;
    }
}
```

### Python

```python
# Analyze User Website Visit Pattern：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def mostVisitedPattern(
        self, username: List[str], timestamp: List[int], website: List[str]
    ) -> List[str]:
        d = defaultdict(list)
        for user, _, site in sorted(
            zip(username, timestamp, website), key=lambda x: x[1]
        ):
            d[user].append(site)

        cnt = Counter()
        for sites in d.values():
            m = len(sites)
            s = set()
            if m > 2:
                for i in range(m - 2):
                    for j in range(i + 1, m - 1):
                        for k in range(j + 1, m):
                            s.add((sites[i], sites[j], sites[k]))
            for t in s:
                cnt[t] += 1
        return sorted(cnt.items(), key=lambda x: (-x[1], x[0]))[0][0]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

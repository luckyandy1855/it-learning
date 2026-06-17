# 1311. Get Watched Videos by Your Friends

---
编号: 1311
题目: Get Watched Videos by Your Friends
难度: 中等
标签: [广度优先搜索, 图, 数组, 哈希表, 排序]
来源链接: https://leetcode.com/problems/get-watched-videos-by-your-friends/
---

## 题目描述

有 `n` 个人，每个人都有一个  `0` 到 `n-1` 的唯一 *id* 。

给你数组 `watchedVideos`  和 `friends` ，其中 `watchedVideos[i]`  和 `friends[i]` 分别表示 `id = i` 的人观看过的视频列表和他的好友列表。

Level **1** 的视频包含所有你好友观看过的视频，level **2** 的视频包含所有你好友的好友观看过的视频，以此类推。一般的，Level 为 **k** 的视频包含所有从你出发，最短距离为 **k** 的好友观看过的视频。

给定你的 `id`  和一个 `level` 值，请你找出所有指定 `level` 的视频，并将它们按观看频率升序返回。如果有频率相同的视频，请将它们按字母顺序从小到大排列。

**示例 1：**

****

```text
输入：watchedVideos = [["A","B"],["C"],["B","C"],["D"]], friends = [[1,2],[0,3],[0,3],[1,2]], id = 0, level = 1
输出：["B","C"]
解释：
你的 id 为 0（绿色），你的朋友包括（黄色）：
id 为 1 -> watchedVideos = ["C"]
id 为 2 -> watchedVideos = ["B","C"]
你朋友观看过视频的频率为：
B -> 1
C -> 2
```

**示例 2：**

****

```text
输入：watchedVideos = [["A","B"],["C"],["B","C"],["D"]], friends = [[1,2],[0,3],[0,3],[1,2]], id = 0, level = 2
输出：["D"]
解释：
你的 id 为 0（绿色），你朋友的朋友只有一个人，他的 id 为 3（黄色）。
```

**提示：**

- `n == watchedVideos.length == friends.length`

- `2 <= n <= 100`

- `1 <= watchedVideos[i].length <= 100`

- `1 <= watchedVideos[i][j].length <= 8`

- `0 <= friends[i].length < n`

- `0 <= friends[i][j] < n`

- `0 <= id < n`

- `1 <= level < n`

- 如果 `friends[i]` 包含 `j` ，那么 `friends[j]` 包含 `i`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 图, 数组, 哈希表, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以使用广度优先搜索的方法，从 $\textit{id}$ 出发，找到所有距离为 $\textit{level}$ 的好友，然后统计这些好友观看的视频。

具体地，我们可以使用一个队列 $\textit{q}$ 来存储当前层的好友，初始时将 $\textit{id}$ 加入队列 $\textit{q}$ 中，用一个哈希表或者布尔数组 $\textit{vis}$ 来记录已经访问过的好友，然后进行 $\textit{level}$ 次循环，每次循环将队列中的所有好友出队，并将他们的好友加入队列，直到找到所有距禒为 $\textit{level}$ 的好友。

然后，我们使用一个哈希表 $\textit{cnt}$ 来统计这些好友观看的视频及其频率，最后将哈希表中的键值对按照频率升序排序，如果频率相同，则按照视频名称升序排序。最后返回排序后的视频名称列表。

时间复杂度 $O(n + m + v \times \log v)$，空间复杂度 $O(n + v)$。其中 $n$ 和 $m$ 分别是数组 $\textit{watchedVideos}$ 和 $\textit{friends}$ 的长度，而 $v$ 是所有好友观看的视频数量。

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
// Get Watched Videos by Your Friends：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func watchedVideosByFriends(watchedVideos [][]string, friends [][]int, id int, level int) []string {
	q := []int{id}
	n := len(friends)
	vis := make([]bool, n)
	vis[id] = true
	for level > 0 {
		level--
		nextQ := []int{}
		for _, i := range q {
			for _, j := range friends[i] {
				if !vis[j] {
					vis[j] = true
					nextQ = append(nextQ, j)
				}
			}
		}
		q = nextQ
	}
	cnt := make(map[string]int)
	for _, i := range q {
		for _, v := range watchedVideos[i] {
			cnt[v]++
		}
	}
	ans := []string{}
	for key := range cnt {
		ans = append(ans, key)
	}
	sort.Slice(ans, func(i, j int) bool {
		if cnt[ans[i]] == cnt[ans[j]] {
			return ans[i] < ans[j]
		}
		return cnt[ans[i]] < cnt[ans[j]]
	})
	return ans
}
```

### Java

```java
// Get Watched Videos by Your Friends：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> watchedVideosByFriends(
        List<List<String>> watchedVideos, int[][] friends, int id, int level) {
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(id);
        int n = friends.length;
        boolean[] vis = new boolean[n];
        vis[id] = true;
        while (level-- > 0) {
            for (int k = q.size(); k > 0; --k) {
                int i = q.poll();
                for (int j : friends[i]) {
                    if (!vis[j]) {
                        vis[j] = true;
                        q.offer(j);
                    }
                }
            }
        }
        Map<String, Integer> cnt = new HashMap<>();
        for (int i : q) {
            for (var v : watchedVideos.get(i)) {
                cnt.merge(v, 1, Integer::sum);
            }
        }
        List<String> ans = new ArrayList<>(cnt.keySet());
        ans.sort((a, b) -> {
            int x = cnt.get(a), y = cnt.get(b);
            return x == y ? a.compareTo(b) : Integer.compare(x, y);
        });
        return ans;
    }
}
```

### Python

```python
# Get Watched Videos by Your Friends：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def watchedVideosByFriends(
        self,
        watchedVideos: List[List[str]],
        friends: List[List[int]],
        id: int,
        level: int,
    ) -> List[str]:
        q = deque([id])
        vis = {id}
        for _ in range(level):
            for _ in range(len(q)):
                i = q.popleft()
                for j in friends[i]:
                    if j not in vis:
                        vis.add(j)
                        q.append(j)
        cnt = Counter()
        for i in q:
            for v in watchedVideos[i]:
                cnt[v] += 1
        return sorted(cnt.keys(), key=lambda k: (cnt[k], k))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

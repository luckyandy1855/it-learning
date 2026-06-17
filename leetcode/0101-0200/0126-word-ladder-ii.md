# 0126. Word Ladder II

---
编号: 126
题目: Word Ladder II
难度: 困难
标签: [广度优先搜索, 哈希表, 字符串, 回溯]
来源链接: https://leetcode.com/problems/word-ladder-ii/
---

## 题目描述

按字典 `wordList` 完成从单词 `beginWord` 到单词 `endWord` 转化，一个表示此过程的 **转换序列** 是形式上像 `beginWord -> s1 -> s2 -> ... -> sk` 这样的单词序列，并满足：

	- 每对相邻的单词之间仅有单个字母不同。

	- 转换过程中的每个单词 `si`（`1 k == endWord`

给你两个单词 `beginWord` 和 `endWord` ，以及一个字典 `wordList` 。请你找出并返回所有从 `beginWord` 到 `endWord` 的 **最短转换序列** ，如果不存在这样的转换序列，返回一个空列表。每个序列都应该以单词列表* *`[beginWord, s1, s2, ..., sk]` 的形式返回。

**示例 1：**

```text
输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
输出：[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
解释：存在 2 种最短的转换序列：
"hit" -> "hot" -> "dot" -> "dog" -> "cog"
"hit" -> "hot" -> "lot" -> "log" -> "cog"
```

**示例 2：**

```text
输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
输出：[]
解释：endWord "cog" 不在字典 wordList 中，所以不存在符合要求的转换序列。
```

**提示：**

	- `1

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「广度优先搜索, 哈希表, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Word Ladder II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findLadders(beginWord string, endWord string, wordList []string) [][]string {
	var ans [][]string
	words := make(map[string]bool)
	for _, word := range wordList {
		words[word] = true
	}
	if !words[endWord] {
		return ans
	}
	words[beginWord] = false
	dist := map[string]int{beginWord: 0}
	prev := map[string]map[string]bool{}
	q := []string{beginWord}
	found := false
	step := 0
	for len(q) > 0 && !found {
		step++
		for i := len(q); i > 0; i-- {
			p := q[0]
			q = q[1:]
			chars := []byte(p)
			for j := 0; j < len(chars); j++ {
				ch := chars[j]
				for k := 'a'; k <= 'z'; k++ {
					chars[j] = byte(k)
					t := string(chars)
					if v, ok := dist[t]; ok {
						if v == step {
							prev[t][p] = true
						}
					}
					if !words[t] {
						continue
					}
					if len(prev[t]) == 0 {
						prev[t] = make(map[string]bool)
					}
					prev[t][p] = true
					words[t] = false
					q = append(q, t)
					dist[t] = step
					if endWord == t {
						found = true
					}
				}
				chars[j] = ch
			}
		}
	}
	var dfs func(path []string, begin, cur string)
	dfs = func(path []string, begin, cur string) {
		if cur == beginWord {
			cp := make([]string, len(path))
			copy(cp, path)
			ans = append(ans, cp)
			return
		}
		for k := range prev[cur] {
			path = append([]string{k}, path...)
			dfs(path, beginWord, k)
			path = path[1:]
		}
	}
	if found {
		path := []string{endWord}
		dfs(path, beginWord, endWord)
	}
	return ans
}
```

### Java

```java
// Word Ladder II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<List<String>> ans;
    private Map<String, Set<String>> prev;

    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        ans = new ArrayList<>();
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) {
            return ans;
        }
        words.remove(beginWord);
        Map<String, Integer> dist = new HashMap<>();
        dist.put(beginWord, 0);
        prev = new HashMap<>();
        Queue<String> q = new ArrayDeque<>();
        q.offer(beginWord);
        boolean found = false;
        int step = 0;
        while (!q.isEmpty() && !found) {
            ++step;
            for (int i = q.size(); i > 0; --i) {
                String p = q.poll();
                char[] chars = p.toCharArray();
                for (int j = 0; j < chars.length; ++j) {
                    char ch = chars[j];
                    for (char k = 'a'; k <= 'z'; ++k) {
                        chars[j] = k;
                        String t = new String(chars);
                        if (dist.getOrDefault(t, 0) == step) {
                            prev.get(t).add(p);
                        }
                        if (!words.contains(t)) {
                            continue;
                        }
                        prev.computeIfAbsent(t, key -> new HashSet<>()).add(p);
                        words.remove(t);
                        q.offer(t);
                        dist.put(t, step);
                        if (endWord.equals(t)) {
                            found = true;
                        }
                    }
                    chars[j] = ch;
                }
            }
        }
        if (found) {
            Deque<String> path = new ArrayDeque<>();
            path.add(endWord);
            dfs(path, beginWord, endWord);
        }
        return ans;
    }

    private void dfs(Deque<String> path, String beginWord, String cur) {
        if (cur.equals(beginWord)) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (String precursor : prev.get(cur)) {
            path.addFirst(precursor);
            dfs(path, beginWord, precursor);
            path.removeFirst();
        }
    }
}
```

### Python

```python
# Word Ladder II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findLadders(
        self, beginWord: str, endWord: str, wordList: List[str]
    ) -> List[List[str]]:
        def dfs(path, cur):
            if cur == beginWord:
                ans.append(path[::-1])
                return
            for precursor in prev[cur]:
                path.append(precursor)
                dfs(path, precursor)
                path.pop()

        ans = []
        words = set(wordList)
        if endWord not in words:
            return ans
        words.discard(beginWord)
        dist = {beginWord: 0}
        prev = defaultdict(set)
        q = deque([beginWord])
        found = False
        step = 0
        while q and not found:
            step += 1
            for i in range(len(q), 0, -1):
                p = q.popleft()
                s = list(p)
                for i in range(len(s)):
                    ch = s[i]
                    for j in range(26):
                        s[i] = chr(ord('a') + j)
                        t = ''.join(s)
                        if dist.get(t, 0) == step:
                            prev[t].add(p)
                        if t not in words:
                            continue
                        prev[t].add(p)
                        words.discard(t)
                        q.append(t)
                        dist[t] = step
                        if endWord == t:
                            found = True
                    s[i] = ch
        if found:
            path = [endWord]
            dfs(path, endWord)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

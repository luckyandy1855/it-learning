# 0244. Shortest Word Distance II

---
编号: 244
题目: Shortest Word Distance II
难度: 中等
标签: [设计, 数组, 哈希表, 双指针, 字符串]
来源链接: https://leetcode.com/problems/shortest-word-distance-ii/
---

## 题目描述

请设计一个类，使该类的构造函数能够接收一个字符串数组。然后再实现一个方法，该方法能够分别接收两个单词*，*并返回列表中这两个单词之间的最短距离。

实现 `WordDistanc` 类:

- `WordDistance(String[] wordsDict)` 用字符串数组 `wordsDict` 初始化对象。

- `int shortest(String word1, String word2)` 返回数组 `worddict` 中 `word1` 和 `word2` 之间的最短距离。

**示例 1:**

```text
输入:
["WordDistance", "shortest", "shortest"]
[[["practice", "makes", "perfect", "coding", "makes"]], ["coding", "practice"], ["makes", "coding"]]
输出:
[null, 3, 1]

解释：
WordDistance wordDistance = new WordDistance(["practice", "makes", "perfect", "coding", "makes"]);
wordDistance.shortest("coding", "practice"); // 返回 3
wordDistance.shortest("makes", "coding");    // 返回 1
```

**注意:**

- `1 <= wordsDict.length <= 3 * 10^4`

- `1 <= wordsDict[i].length <= 10`

- `wordsDict[i]` 由小写英文字母组成

- `word1` 和 `word2` 在数组 `wordsDict` 中

- `word1 != word2`

-  `shortest` 操作次数不大于 `5000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表, 双指针, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们用哈希表 $d$ 存储每个单词在数组中出现的所有下标，然后用双指针 $i$ 和 $j$ 分别指向两个单词在数组中出现的下标列表 $a$ 和 $b$，每次更新下标差值的最小值，然后移动下标较小的指针，直到其中一个指针遍历完下标列表。

初始化的时间复杂度为 $O(n)$，其中 $n$ 为数组的长度。每次调用 `shortest` 方法的时间复杂度为 $O(m + n)$，其中 $m$ 为两个单词在数组中出现的下标列表的长度之和。

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
// Shortest Word Distance II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type WordDistance struct {
	d map[string][]int
}

func Constructor(wordsDict []string) WordDistance {
	d := map[string][]int{}
	for i, w := range wordsDict {
		d[w] = append(d[w], i)
	}
	return WordDistance{d}
}

func (this *WordDistance) Shortest(word1 string, word2 string) int {
	a, b := this.d[word1], this.d[word2]
	ans := 0x3f3f3f3f
	i, j := 0, 0
	for i < len(a) && j < len(b) {
		ans = min(ans, abs(a[i]-b[j]))
		if a[i] <= b[j] {
			i++
		} else {
			j++
		}
	}
	return ans
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

/**
 * Your WordDistance object will be instantiated and called as such:
 * obj := Constructor(wordsDict);
 * param_1 := obj.Shortest(word1,word2);
 */
```

### Java

```java
import java.util.*;
// Shortest Word Distance II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class WordDistance {
    private Map<String, List<Integer>> d = new HashMap<>();

    public WordDistance(String[] wordsDict) {
        for (int i = 0; i < wordsDict.length; ++i) {
            d.computeIfAbsent(wordsDict[i], k -> new ArrayList<>()).add(i);
        }
    }

    public int shortest(String word1, String word2) {
        List<Integer> a = d.get(word1), b = d.get(word2);
        int ans = 0x3f3f3f3f;
        int i = 0, j = 0;
        while (i < a.size() && j < b.size()) {
            ans = Math.min(ans, Math.abs(a.get(i) - b.get(j)));
            if (a.get(i) <= b.get(j)) {
                ++i;
            } else {
                ++j;
            }
        }
        return ans;
    }
}

/**
 * Your WordDistance object will be instantiated and called as such:
 * WordDistance obj = new WordDistance(wordsDict);
 * int param_1 = obj.shortest(word1,word2);
 */
```

### Python

```python
# Shortest Word Distance II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class WordDistance:
    def __init__(self, wordsDict: List[str]):
        self.d = defaultdict(list)
        for i, w in enumerate(wordsDict):
            self.d[w].append(i)

    def shortest(self, word1: str, word2: str) -> int:
        a, b = self.d[word1], self.d[word2]
        ans = inf
        i = j = 0
        while i < len(a) and j < len(b):
            ans = min(ans, abs(a[i] - b[j]))
            if a[i] <= b[j]:
                i += 1
            else:
                j += 1
        return ans


# Your WordDistance object will be instantiated and called as such:
# obj = WordDistance(wordsDict)
# param_1 = obj.shortest(word1,word2)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0245. Shortest Word Distance III

---
编号: 245
题目: Shortest Word Distance III
难度: 中等
标签: [数组, 字符串]
来源链接: https://leetcode.com/problems/shortest-word-distance-iii/
---

## 题目描述

给定一个字符串数组 `wordsDict` 和两个字符串 `word1` 和 `word2` ，返回这两个单词在列表中出现的最短距离。

注意：`word1` 和 `word2` 是有可能相同的，并且它们将分别表示为列表中 **两个独立的单词** 。

示例 1：

```text
输入：wordsDict = ["practice", "makes", "perfect", "coding", "makes"], word1 = "makes", word2 = "coding"
输出：1
```

示例 2：

```text
输入：wordsDict = ["practice", "makes", "perfect", "coding", "makes"], word1 = "makes", word2 = "makes"
输出：3
```

**提示：**

- `1 <= wordsDict.length <= 10^5`

- `1 <= wordsDict[i].length <= 10`

- `wordsDict[i]` 由小写英文字母组成

- `word1` 和 `word2` 都在 `wordsDict` 中

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们首先判断 $\textit{word1}$ 和 $\textit{word2}$ 是否相等：

- 如果相等，遍历数组 $\textit{wordsDict}$，找到两个 $\textit{word1}$ 的下标 $i$ 和 $j$，求 $i-j$ 的最小值。
- 如果不相等，遍历数组 $\textit{wordsDict}$，找到 $\textit{word1}$ 和 $\textit{word2}$ 的下标 $i$ 和 $j$，求 $i-j$ 的最小值。

时间复杂度 $O(n)$，其中 $n$ 为数组 $\textit{wordsDict}$ 的长度。空间复杂度 $O(1)$。

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
// Shortest Word Distance III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func shortestWordDistance(wordsDict []string, word1 string, word2 string) int {
	ans := len(wordsDict)
	if word1 == word2 {
		j := -1
		for i, w := range wordsDict {
			if w == word1 {
				if j != -1 {
					ans = min(ans, i-j)
				}
				j = i
			}
		}
	} else {
		i, j := -1, -1
		for k, w := range wordsDict {
			if w == word1 {
				i = k
			}
			if w == word2 {
				j = k
			}
			if i != -1 && j != -1 {
				ans = min(ans, abs(i-j))
			}
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
```

### Java

```java
import java.util.*;
// Shortest Word Distance III：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public int shortestWordDistance(String[] wordsDict, String word1, String word2) {
        int ans = wordsDict.length;
        if (word1.equals(word2)) {
            for (int i = 0, j = -1; i < wordsDict.length; ++i) {
                if (wordsDict[i].equals(word1)) {
                    if (j != -1) {
                        ans = Math.min(ans, i - j);
                    }
                    j = i;
                }
            }
        } else {
            for (int k = 0, i = -1, j = -1; k < wordsDict.length; ++k) {
                if (wordsDict[k].equals(word1)) {
                    i = k;
                }
                if (wordsDict[k].equals(word2)) {
                    j = k;
                }
                if (i != -1 && j != -1) {
                    ans = Math.min(ans, Math.abs(i - j));
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Shortest Word Distance III：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def shortestWordDistance(self, wordsDict: List[str], word1: str, word2: str) -> int:
        ans = len(wordsDict)
        if word1 == word2:
            j = -1
            for i, w in enumerate(wordsDict):
                if w == word1:
                    if j != -1:
                        ans = min(ans, i - j)
                    j = i
        else:
            i = j = -1
            for k, w in enumerate(wordsDict):
                if w == word1:
                    i = k
                if w == word2:
                    j = k
                if i != -1 and j != -1:
                    ans = min(ans, abs(i - j))
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

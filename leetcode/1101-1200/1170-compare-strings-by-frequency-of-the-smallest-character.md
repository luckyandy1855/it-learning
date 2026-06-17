# 1170. Compare Strings by Frequency of the Smallest Character

---
编号: 1170
题目: Compare Strings by Frequency of the Smallest Character
难度: 中等
标签: [数组, 哈希表, 字符串, 二分查找, 排序]
来源链接: https://leetcode.com/problems/compare-strings-by-frequency-of-the-smallest-character/
---

## 题目描述

定义一个函数 `f(s)`，统计 `s`  中**（按字典序比较）最小字母的出现频次** ，其中 `s` 是一个非空字符串。

例如，若 `s = "dcce"`，那么 `f(s) = 2`，因为字典序最小字母是 `"c"`，它出现了 2 次。

现在，给你两个字符串数组待查表 `queries` 和词汇表 `words` 。对于每次查询 `queries[i]` ，需统计 `words` 中满足 `f(queries[i])` < `f(W)` 的** 词的数目** ，`W` 表示词汇表 `words` 中的每个词。

请你返回一个整数数组 `answer` 作为答案，其中每个 `answer[i]` 是第 `i` 次查询的结果。

**示例 1：**

```text
输入：queries = ["cbd"], words = ["zaaaz"]
输出：[1]
解释：查询 f("cbd") = 1，而 f("zaaaz") = 3 所以 f("cbd") < f("zaaaz")。
```

**示例 2：**

```text
输入：queries = ["bbb","cc"], words = ["a","aa","aaa","aaaa"]
输出：[1,2]
解释：第一个查询 f("bbb")  f("cc")。
```

**提示：**

- `1 <= queries.length <= 2000`

- `1 <= words.length <= 2000`

- `1 <= queries[i].length, words[i].length <= 10`

- `queries[i][j]`、`words[i][j]` 都由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先按照题目描述，实现函数 $f(s)$，函数返回字符串 $s$ 中按字典序比较最小字母的出现频次。

接下来，我们将 $words$ 中的每个字符串 $w$ 都计算出 $f(w)$，并将其排序，存放在数组 $nums$ 中。

然后，我们遍历 $queries$ 中的每个字符串 $q$，在 $nums$ 中二分查找第一个大于 $f(q)$ 的位置 $i$，则 $nums$ 中下标 $i$ 及其后面的元素都满足 $f(q) < f(W)$，那么当前查询的答案就是 $n - i$。

时间复杂度 $O((n + q) \times M)$，空间复杂度 $O(n)$。其中 $n$ 和 $q$ 分别是数组 $words$ 和 $queries$ 的长度，而 $M$ 是字符串的最大长度。

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
// Compare Strings by Frequency of the Smallest Character：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func numSmallerByFrequency(queries []string, words []string) (ans []int) {
	f := func(s string) int {
		cnt := [26]int{}
		for _, c := range s {
			cnt[c-'a']++
		}
		for _, x := range cnt {
			if x > 0 {
				return x
			}
		}
		return 0
	}
	n := len(words)
	nums := make([]int, n)
	for i, w := range words {
		nums[i] = f(w)
	}
	sort.Ints(nums)
	for _, q := range queries {
		x := f(q)
		ans = append(ans, n-sort.SearchInts(nums, x+1))
	}
	return
}
```

### Java

```java
// Compare Strings by Frequency of the Smallest Character：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] numSmallerByFrequency(String[] queries, String[] words) {
        int n = words.length;
        int[] nums = new int[n];
        for (int i = 0; i < n; ++i) {
            nums[i] = f(words[i]);
        }
        Arrays.sort(nums);
        int m = queries.length;
        int[] ans = new int[m];
        for (int i = 0; i < m; ++i) {
            int x = f(queries[i]);
            int l = 0, r = n;
            while (l < r) {
                int mid = (l + r) >> 1;
                if (nums[mid] > x) {
                    r = mid;
                } else {
                    l = mid + 1;
                }
            }
            ans[i] = n - l;
        }
        return ans;
    }

    private int f(String s) {
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); ++i) {
            ++cnt[s.charAt(i) - 'a'];
        }
        for (int x : cnt) {
            if (x > 0) {
                return x;
            }
        }
        return 0;
    }
}
```

### Python

```python
# Compare Strings by Frequency of the Smallest Character：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def numSmallerByFrequency(self, queries: List[str], words: List[str]) -> List[int]:
        def f(s: str) -> int:
            cnt = Counter(s)
            return next(cnt[c] for c in ascii_lowercase if cnt[c])

        n = len(words)
        nums = sorted(f(w) for w in words)
        return [n - bisect_right(nums, f(q)) for q in queries]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

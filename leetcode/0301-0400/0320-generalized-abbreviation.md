# 0320. Generalized Abbreviation

---
编号: 320
题目: Generalized Abbreviation
难度: 中等
标签: [位运算, 字符串, 回溯]
来源链接: https://leetcode.com/problems/generalized-abbreviation/
---

## 题目描述

单词的 **广义缩写词** 可以通过下述步骤构造：先取任意数量的 **不重叠、不相邻** 的子字符串，再用它们各自的长度进行替换。

	- 例如，`"abcde"` 可以缩写为：

    	- `"a3e"`（`"bcd"` 变为 `"3"` ）

    	- `"1bcd1"`（`"a"` 和 `"e"` 都变为 `"1"`）

    	- `"5"` (`"abcde"` 变为 `"5"`)

    	- `"abcde"` (没有子字符串被代替)

    - 然而，这些缩写是 **无效的** ：

    	- `"23"`（`"ab"` 变为 `"2"` ，`"cde"` 变为 `"3"` ）是无效的，因为被选择的字符串是相邻的

    	- `"22de"` (`"ab"` 变为 `"2"` ， `"bc"` 变为 `"2"`)  是无效的，因为被选择的字符串是重叠的

给你一个字符串 `word` ，返回 *一个由* `word` 的*所有可能 **广义缩写词** 组成的列表* 。按 **任意顺序** 返回答案。

**示例 1：**

```text
输入：word = "word"
输出：["4","3d","2r1","2rd","1o2","1o1d","1or1","1ord","w3","w2d","w1r1","w1rd","wo2","wo1d","wor1","word"]
```

**示例 2：**

```text
输入：word = "a"
输出：["1","a"]
```

**提示：**

	- `1 <= word.length <= 15`

	- `word` 仅由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(i)$，表示对于字符串 $word[i:]$，返回其所有可能的缩写。

函数 $dfs(i)$ 的执行逻辑如下：

如果 $i \geq n$，说明已经处理完了字符串 $word$，直接返回一个空字符串组成的列表。

否则，我们可以选择保留 $word[i]$，然后对 $dfs(i + 1)$ 返回的列表中的每个字符串前面添加 $word[i]$，将得到的结果添加到答案中。

我们也可以选择删除 $word[i]$ 及其后面的若干个字符，假设我们删除了 $word[i..j)$，那么第 $j$ 个字符不删除，然后对 $dfs(j + 1)$ 返回的列表中的每个字符串前面添加 $j - i$，将得到的结果添加到答案中。

最后，我们在主函数中调用 $dfs(0)$ 即可。

时间复杂度 $O(n \times 2^n)$，空间复杂度 $O(n)$。其中 $n$ 是字符串 $word$ 的长度。

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
// Generalized Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func generateAbbreviations(word string) []string {
	n := len(word)
	var dfs func(int) []string
	dfs = func(i int) []string {
		if i >= n {
			return []string{""}
		}
		ans := []string{}
		for _, s := range dfs(i + 1) {
			ans = append(ans, word[i:i+1]+s)
		}
		for j := i + 1; j <= n; j++ {
			for _, s := range dfs(j + 1) {
				p := ""
				if j < n {
					p = word[j : j+1]
				}
				ans = append(ans, strconv.Itoa(j-i)+p+s)
			}
		}
		return ans
	}
	return dfs(0)
}
```

### Java

```java
// Generalized Abbreviation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private String word;
    private int n;

    public List<String> generateAbbreviations(String word) {
        this.word = word;
        n = word.length();
        return dfs(0);
    }

    private List<String> dfs(int i) {
        if (i >= n) {
            return List.of("");
        }
        List<String> ans = new ArrayList<>();
        for (String s : dfs(i + 1)) {
            ans.add(String.valueOf(word.charAt(i)) + s);
        }
        for (int j = i + 1; j <= n; ++j) {
            for (String s : dfs(j + 1)) {
                ans.add((j - i) + "" + (j < n ? String.valueOf(word.charAt(j)) : "") + s);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Generalized Abbreviation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def generateAbbreviations(self, word: str) -> List[str]:
        def dfs(i: int) -> List[str]:
            if i >= n:
                return [""]
            ans = [word[i] + s for s in dfs(i + 1)]
            for j in range(i + 1, n + 1):
                for s in dfs(j + 1):
                    ans.append(str(j - i) + (word[j] if j < n else "") + s)
            return ans

        n = len(word)
        return dfs(0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

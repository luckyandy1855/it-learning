# 0422. Valid Word Square

---
编号: 422
题目: Valid Word Square
难度: 简单
标签: [数组, 矩阵]
来源链接: https://leetcode.com/problems/valid-word-square/
---

## 题目描述

给你一个字符串数组 `words`，如果它能形成一个有效的** 单词方块 **，则返回 `true` *。*

有效的单词方块是指此由字符串数组组成的文字方块的 第 `k` 行 和 第 `k` 列所显示的字符串完全相同，其中 `0 示例 1：

```text
输入: words = ["abcd","bnrt","crmy","dtye"]
输出: true
解释:
第 1 行和第 1 列都读作 "abcd"。
第 2 行和第 2 列都读作 "bnrt"。
第 3 行和第 3 列都读作 "crmy"。
第 4 行和第 4 列都读作 "dtye"。
因此，它构成了一个有效的单词方块。
```

示例 2：

```text
输入: words = ["abcd","bnrt","crm","dt"]
输出: true
解释:
第 1 行和第 1 列都读作 "abcd"。
第 2 行和第 2 列都读作 "bnrt"。
第 3 行和第 3 列都读作 "crm"。
第 4 行和第 4 列都读作 "dt"。
因此，它构成了一个有效的单词方块。
```

示例 3：

```text
输入: words = ["ball","area","read","lady"]
输出: false
解释:
第 3 行读作 "read" 而第 3 列读作 "lead"。
因此，它不构成一个有效的单词方块。
```

**提示：**

- `1 <= words.length <= 500`

- `1 <= words[i].length <= 500`

- `words[i]` 仅由小写英文字母组成。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们观察发现，只要不满足 $words[i][j] = words[j][i]$，就可以直接返回 `false`。

因此，我们只需要遍历每一行，然后检查每一行是否满足 $words[i][j] = words[j][i]$ 即可。注意，如果下标越界，也直接返回 `false`。

时间复杂度 $O(n^2)$，其中 $n$ 是 $words$ 的长度。空间复杂度 $O(1)$。

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
// Valid Word Square：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func validWordSquare(words []string) bool {
	m := len(words)
	for i, w := range words {
		for j := range w {
			if j >= m || i >= len(words[j]) || w[j] != words[j][i] {
				return false
			}
		}
	}
	return true
}
```

### Java

```java
// Valid Word Square：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean validWordSquare(List<String> words) {
        int m = words.size();
        for (int i = 0; i < m; ++i) {
            int n = words.get(i).length();
            for (int j = 0; j < n; ++j) {
                if (j >= m || i >= words.get(j).length()) {
                    return false;
                }
                if (words.get(i).charAt(j) != words.get(j).charAt(i)) {
                    return false;
                }
            }
        }
        return true;
    }
}
```

### Python

```python
# Valid Word Square：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def validWordSquare(self, words: List[str]) -> bool:
        m = len(words)
        for i, w in enumerate(words):
            for j, c in enumerate(w):
                if j >= m or i >= len(words[j]) or c != words[j][i]:
                    return False
        return True
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

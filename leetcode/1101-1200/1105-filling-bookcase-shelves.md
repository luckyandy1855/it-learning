# 1105. Filling Bookcase Shelves

---
编号: 1105
题目: Filling Bookcase Shelves
难度: 中等
标签: [数组, 动态规划]
来源链接: https://leetcode.com/problems/filling-bookcase-shelves/
---

## 题目描述

给定一个数组 `books` ，其中 `books[i] = [thicknessi, heighti]` 表示第 `i` 本书的厚度和高度。你也会得到一个整数 `shelfWidth` 。

**按顺序** 将这些书摆放到总宽度为 `shelfWidth` 的书架上。

先选几本书放在书架上（它们的厚度之和小于等于书架的宽度 `shelfWidth` ），然后再建一层书架。重复这个过程，直到把所有的书都放在书架上。

需要注意的是，在上述过程的每个步骤中，**摆放书的顺序与给定图书数组 **`books`** 顺序相同**。

- 例如，如果这里有 5 本书，那么可能的一种摆放情况是：第一和第二本书放在第一层书架上，第三本书放在第二层书架上，第四和第五本书放在最后一层书架上。

每一层所摆放的书的最大高度就是这一层书架的层高，书架整体的高度为各层高之和。

以这种方式布置书架，返回书架整体可能的最小高度。

示例 1：

```text
输入：books = [[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]], shelfWidth = 4
输出：6
解释：
3 层书架的高度和为 1 + 3 + 2 = 6 。
第 2 本书不必放在第一层书架上。
```

示例 2:

```text
输入: books = [[1,3],[2,4],[3,2]], shelfWidth = 6
输出: 4
```

**提示：**

- `1 i i <= 1000`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i]$ 表示前 $i$ 本书摆放的最小高度，初始时 $f[0] = 0$，答案为 $f[n]$。

考虑 $f[i]$，最后一本书为 $books[i - 1]$，其厚度为 $w$，高度为 $h$。

- 如果这本书单独摆放在新的一层，那么有 $f[i] = f[i - 1] + h$；
- 如果这本书可以与前面的最后几本书摆放在同一层，我们从后往前枚举同一层的第一本书 $boos[j-1]$，其中 $j \in [1, i - 1]$，将书的厚度累积到 $w$，如果 $w \gt shelfWidth$，说明此时的 $books[j-1]$ 已经无法与 $books[i-1]$ 摆放在同一层，停止枚举；否则我们更新当前层的最大高度 $h = \max(h, books[j-1][1])$，那么此时有 $f[i] = \min(f[i], f[j - 1] + h)$。

最终的答案即为 $f[n]$。

时间复杂度 $O(n^2)$，空间复杂度 $O(n)$。其中 $n$ 为数组 $books$ 的长度。

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
// Filling Bookcase Shelves：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minHeightShelves(books [][]int, shelfWidth int) int {
	n := len(books)
	f := make([]int, n+1)
	for i := 1; i <= n; i++ {
		w, h := books[i-1][0], books[i-1][1]
		f[i] = f[i-1] + h
		for j := i - 1; j > 0; j-- {
			w += books[j-1][0]
			if w > shelfWidth {
				break
			}
			h = max(h, books[j-1][1])
			f[i] = min(f[i], f[j-1]+h)
		}
	}
	return f[n]
}
```

### Java

```java
// Filling Bookcase Shelves：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minHeightShelves(int[][] books, int shelfWidth) {
        int n = books.length;
        int[] f = new int[n + 1];
        for (int i = 1; i <= n; ++i) {
            int w = books[i - 1][0], h = books[i - 1][1];
            f[i] = f[i - 1] + h;
            for (int j = i - 1; j > 0; --j) {
                w += books[j - 1][0];
                if (w > shelfWidth) {
                    break;
                }
                h = Math.max(h, books[j - 1][1]);
                f[i] = Math.min(f[i], f[j - 1] + h);
            }
        }
        return f[n];
    }
}
```

### Python

```python
# Filling Bookcase Shelves：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minHeightShelves(self, books: List[List[int]], shelfWidth: int) -> int:
        n = len(books)
        f = [0] * (n + 1)
        for i, (w, h) in enumerate(books, 1):
            f[i] = f[i - 1] + h
            for j in range(i - 1, 0, -1):
                w += books[j - 1][0]
                if w > shelfWidth:
                    break
                h = max(h, books[j - 1][1])
                f[i] = min(f[i], f[j - 1] + h)
        return f[n]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

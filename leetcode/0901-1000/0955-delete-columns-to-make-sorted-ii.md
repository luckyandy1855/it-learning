# 0955. Delete Columns to Make Sorted II

---
编号: 955
题目: Delete Columns to Make Sorted II
难度: 中等
标签: [贪心, 数组, 字符串]
来源链接: https://leetcode.com/problems/delete-columns-to-make-sorted-ii/
---

## 题目描述

给定由 `n` 个字符串组成的数组 `strs`，其中每个字符串长度相等。

选取一个删除索引序列，对于 `strs` 中的每个字符串，删除对应每个索引处的字符。

比如，有 `strs = ["abcdef", "uvwxyz"]`，删除索引序列 `{0, 2, 3}`，删除后 `strs` 为`["bef", "vyz"]`。

假设，我们选择了一组删除索引 `answer`，那么在执行删除操作之后，最终得到的数组的元素是按 **字典序**（`strs[0]

**示例 1：**

```text
输入：strs = ["ca","bb","ac"]
输出：1
解释：
删除第一列后，strs = ["a", "b", "c"]。
现在 strs 中元素是按字典排列的 (即，strs[0] <= strs[1] <= strs[2])。
我们至少需要进行 1 次删除，因为最初 strs 不是按字典序排列的，所以答案是 1。
```

**示例 2：**

```text
输入：strs = ["xc","yb","za"]
输出：0
解释：
strs 的列已经是按字典序排列了，所以我们不需要删除任何东西。
注意 strs 的行不需要按字典序排列。
也就是说，strs[0][0] <= strs[0][1] <= ... 不一定成立。
```

**示例 3：**

```text
输入：strs = ["zyx","wvu","tsr"]
输出：3
解释：
我们必须删掉每一列。
```

**提示：**

- `n == strs.length`

- `1 <= n <= 100`

- `1 <= strs[i].length <= 100`

- `strs[i]` 由小写英文字母组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

字符串按字典序比较时，从左到右比较，第一个不相等的字符决定了两个字符串的大小关系。因此我们可以从左到右遍历每一列，判断当前列是否需要删除。

我们维护一个长度为 $n - 1$ 的布尔数组 $\textit{st}$，表示相邻的字符串对是否已经确定了大小关系。如果已经确定了大小关系，那么后续在这两个字符串之间的任何字符比较都不会改变它们的大小关系。

对于每一列 $j$，我们遍历所有相邻的字符串对 $(\textit{strs}[i], \textit{strs}[i + 1])$：

- 如果 $\textit{st}[i]$ 为假且 $\textit{strs}[i][j] > \textit{strs}[i + 1][j]$，说明当前列必须删除，我们将答案加一并跳过该列的处理；
- 否则，如果 $\textit{st}[i]$ 为假且 $\textit{strs}[i][j] < \textit{strs}[i + 1][j]$，说明当前列确定了这两个字符串的大小关系，我们将 $\textit{st}[i]$ 设为真。

遍历完所有列后，答案即为需要删除的列数。

这个贪心策略是最优的，因为字典序由从左到右第一个不同列决定。若当前列不删除且导致某对字符串顺序错误，则无论后续列如何，都无法修正这一错误，因此必须删除当前列。若当前列不删除且不导致任何字符串对顺序错误，则保留当前列不会影响最终的字典序关系。

时间复杂度 $O(n \times m)$，空间复杂度 $O(n)$，其中 $n$ 和 $m$ 分别为字符串数组的长度和每个字符串的长度。

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
// Delete Columns to Make Sorted II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minDeletionSize(strs []string) int {
	n := len(strs)
	m := len(strs[0])
	st := make([]bool, n-1)
	ans := 0
	for j := 0; j < m; j++ {
		mustDel := false
		for i := 0; i < n-1; i++ {
			if !st[i] && strs[i][j] > strs[i+1][j] {
				mustDel = true
				break
			}
		}
		if mustDel {
			ans++
		} else {
			for i := 0; i < n-1; i++ {
				if !st[i] && strs[i][j] < strs[i+1][j] {
					st[i] = true
				}
			}
		}
	}
	return ans
}
```

### Java

```java
// Delete Columns to Make Sorted II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minDeletionSize(String[] strs) {
        int n = strs.length;
        int m = strs[0].length();
        boolean[] st = new boolean[n - 1];
        int ans = 0;
        for (int j = 0; j < m; ++j) {
            boolean mustDel = false;
            for (int i = 0; i < n - 1; ++i) {
                if (!st[i] && strs[i].charAt(j) > strs[i + 1].charAt(j)) {
                    mustDel = true;
                    break;
                }
            }
            if (mustDel) {
                ++ans;
            } else {
                for (int i = 0; i < n - 1; ++i) {
                    if (!st[i] && strs[i].charAt(j) < strs[i + 1].charAt(j)) {
                        st[i] = true;
                    }
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Delete Columns to Make Sorted II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minDeletionSize(self, strs: List[str]) -> int:
        n = len(strs)
        m = len(strs[0])
        st = [False] * (n - 1)
        ans = 0
        for j in range(m):
            must_del = False
            for i in range(n - 1):
                if not st[i] and strs[i][j] > strs[i + 1][j]:
                    must_del = True
                    break
            if must_del:
                ans += 1
            else:
                for i in range(n - 1):
                    if not st[i] and strs[i][j] < strs[i + 1][j]:
                        st[i] = True
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0944. Delete Columns to Make Sorted

---
编号: 944
题目: Delete Columns to Make Sorted
难度: 简单
标签: [数组, 字符串]
来源链接: https://leetcode.com/problems/delete-columns-to-make-sorted/
---

## 题目描述

给你由 `n` 个小写字母字符串组成的数组 `strs`，其中每个字符串长度相等。

这些字符串可以每个一行，排成一个网格。例如，`strs = ["abc", "bce", "cae"]` 可以排列为：

```text
abc
bce
cae
```

你需要找出并删除 **不是按字典序非严格递增排列的** 列。在上面的例子（下标从 0 开始）中，列 0（`'a'`, `'b'`, `'c'`）和列 2（`'c'`, `'e'`, `'e'`）都是按字典序非严格递增排列的，而列 1（`'b'`, `'c'`, `'a'`）不是，所以要删除列 1 。

返回你需要删除的列数。

**示例 1：**

```text
输入：strs = ["cba","daf","ghi"]
输出：1
解释：网格示意如下：
  cba
  daf
  ghi
列 0 和列 2 按升序排列，但列 1 不是，所以只需要删除列 1 。
```

**示例 2：**

```text
输入：strs = ["a","b"]
输出：0
解释：网格示意如下：
  a
  b
只有列 0 这一列，且已经按升序排列，所以不用删除任何列。
```

**示例 3：**

```text
输入：strs = ["zyx","wvu","tsr"]
输出：3
解释：网格示意如下：
  zyx
  wvu
  tsr
所有 3 列都是非升序排列的，所以都要删除。
```

**提示：**

- `n == strs.length`

- `1 <= n <= 100`

- `1 <= strs[i].length <= 1000`

- `strs[i]` 由小写英文字母组成

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

我们记字符串数组 $\textit{strs}$ 的行数为 $n$，列数为 $m$。

遍历每一列，从第二行开始，逐列比较当前行和上一行的字符，如果当前行的字符小于上一行的字符，说明当前列不是按字典序非严格递增排列的，需要删除，结果加一，然后跳出内层循环。

最后返回结果即可。

时间复杂度 $O(L)$，其中 $L$ 为字符串数组 $\textit{strs}$ 的长度。空间复杂度 $O(1)$。

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
// Delete Columns to Make Sorted：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minDeletionSize(strs []string) (ans int) {
	m, n := len(strs[0]), len(strs)
	for j := 0; j < m; j++ {
		for i := 1; i < n; i++ {
			if strs[i][j] < strs[i-1][j] {
				ans++
				break
			}
		}
	}
	return
}
```

### Java

```java
// Delete Columns to Make Sorted：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minDeletionSize(String[] strs) {
        int m = strs[0].length(), n = strs.length;
        int ans = 0;
        for (int j = 0; j < m; ++j) {
            for (int i = 1; i < n; ++i) {
                if (strs[i].charAt(j) < strs[i - 1].charAt(j)) {
                    ++ans;
                    break;
                }
            }
        }
        return ans;
    }
}
```

### Python

```python
# Delete Columns to Make Sorted：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minDeletionSize(self, strs: List[str]) -> int:
        m, n = len(strs[0]), len(strs)
        ans = 0
        for j in range(m):
            for i in range(1, n):
                if strs[i][j] < strs[i - 1][j]:
                    ans += 1
                    break
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

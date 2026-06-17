# 0533. Lonely Pixel II

---
编号: 533
题目: Lonely Pixel II
难度: 中等
标签: [数组, 哈希表, 矩阵]
来源链接: https://leetcode.com/problems/lonely-pixel-ii/
---

## 题目描述

给你一个大小为 `m x n` 的二维字符数组 `picture` ，表示一张黑白图像，数组中的 `'B'` 表示黑色像素，`'W'` 表示白色像素。另给你一个整数 `target` ，请你找出并返回符合规则的 **黑色** 孤独像素的数量。

黑色孤独像素是指位于某一特定位置 `(r, c)` 的字符 `'B'` ，其中：

- 行 `r` 和列 `c` 中的黑色像素恰好有 `target` 个。

- 列 `c` 中所有黑色像素所在的行必须和行 `r` 完全相同。

**示例 1：**

```text
输入：picture = [["W","B","W","B","B","W"],["W","B","W","B","B","W"],["W","B","W","B","B","W"],["W","W","B","W","B","W"]], target = 3
输出：6
解释：所有绿色的 'B' 都是我们所求的像素(第 1 列和第 3 列的所有 'B' )
以行 r = 0 和列 c = 1 的 'B' 为例：
- 规则 1 ，行 r = 0 和列 c = 1 都恰好有 target = 3 个黑色像素
- 规则 2 ，列 c = 1 的黑色像素分别位于行 0，行 1 和行 2。和行 r = 0 完全相同。
```

**示例 2：**

```text
输入：picture = [["W","W","B"],["W","W","B"],["W","W","B"]], target = 1
输出：0
```

**提示：**

- `m == picture.length`

- `n == picture[i].length`

- `1 <= m, n <= 200`

- `picture[i][j]` 为 `'W'` 或 `'B'`

- `1 <= target <= min(m, n)`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 矩阵」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

题目中条件二相当于要求对于每一列中所有包含黑色像素的行，这些行完全相同。

因此，我们可以用一个邻接表 $g$ 来存储每一列中所有包含黑色像素的行，即 $g[j]$ 表示第 $j$ 列中所有包含黑色像素的行的集合。另外，用一个数组 $rows$ 来存储每一行中黑色像素的数量。

接下来，我们遍历每一列，对于每一列，我们找到第一个包含黑色像素的行 $i_1$，如果这一行中黑色像素的数量不等于 $target$，那么这一列不可能包含孤独像素，直接跳过。否则，我们检查这一列中所有包含黑色像素的行是否和第 $i_1$ 行完全相同，如果是，则这一列中所有的黑色像素都是孤独像素，答案加上 $target$。

遍历结束后，返回答案即可。

时间复杂度 $O(m \times n^2)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是矩阵的行数和列数。

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
// Lonely Pixel II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findBlackPixel(picture [][]byte, target int) (ans int) {
	m := len(picture)
	n := len(picture[0])
	g := make([][]int, n)
	rows := make([]int, m)
	for i, row := range picture {
		for j, x := range row {
			if x == 'B' {
				rows[i]++
				g[j] = append(g[j], i)
			}
		}
	}
	for j := 0; j < n; j++ {
		if len(g[j]) == 0 || rows[g[j][0]] != target {
			continue
		}
		i1 := g[j][0]
		ok := 0
		if len(g[j]) == rows[i1] {
			ok = target
			for _, i2 := range g[j] {
				if !bytes.Equal(picture[i1], picture[i2]) {
					ok = 0
					break
				}
			}
		}
		ans += ok
	}
	return
}
```

### Java

```java
// Lonely Pixel II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int findBlackPixel(char[][] picture, int target) {
        int m = picture.length;
        int n = picture[0].length;
        List<Integer>[] g = new List[n];
        Arrays.setAll(g, k -> new ArrayList<>());
        int[] rows = new int[m];
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (picture[i][j] == 'B') {
                    ++rows[i];
                    g[j].add(i);
                }
            }
        }
        int ans = 0;
        for (int j = 0; j < n; ++j) {
            if (g[j].isEmpty() || (rows[g[j].get(0)] != target)) {
                continue;
            }
            int i1 = g[j].get(0);
            int ok = 0;
            if (g[j].size() == rows[i1]) {
                ok = target;
                for (int i2 : g[j]) {
                    if (!Arrays.equals(picture[i1], picture[i2])) {
                        ok = 0;
                        break;
                    }
                }
            }
            ans += ok;
        }
        return ans;
    }
}
```

### Python

```python
# Lonely Pixel II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findBlackPixel(self, picture: List[List[str]], target: int) -> int:
        rows = [0] * len(picture)
        g = defaultdict(list)
        for i, row in enumerate(picture):
            for j, x in enumerate(row):
                if x == "B":
                    rows[i] += 1
                    g[j].append(i)
        ans = 0
        for j in g:
            i1 = g[j][0]
            if rows[i1] != target:
                continue
            if len(g[j]) == rows[i1] and all(picture[i2] == picture[i1] for i2 in g[j]):
                ans += target
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

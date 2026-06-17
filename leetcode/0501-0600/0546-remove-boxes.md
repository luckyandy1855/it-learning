# 0546. Remove Boxes

---
编号: 546
题目: Remove Boxes
难度: 困难
标签: [记忆化, 数组, 动态规划]
来源链接: https://leetcode.com/problems/remove-boxes/
---

## 题目描述

给出一些不同颜色的盒子 `boxes` ，盒子的颜色由不同的正数表示。

你将经过若干轮操作去去掉盒子，直到所有的盒子都去掉为止。每一轮你可以移除具有相同颜色的连续 `k` 个盒子（`k >= 1`），这样一轮之后你将得到 `k * k` 个积分。

返回 *你能获得的最大积分和* 。

**示例 1：**

```text
输入：boxes = [1,3,2,2,2,3,4,3,1]
输出：23
解释：
[1, 3, 2, 2, 2, 3, 4, 3, 1]
----> [1, 3, 3, 4, 3, 1] (3*3=9 分)
----> [1, 3, 3, 3, 1] (1*1=1 分)
----> [1, 1] (3*3=9 分)
----> [] (2*2=4 分)
```

**示例 2：**

```text
输入：boxes = [1,1,1]
输出：9
```

**示例 3：**

```text
输入：boxes = [1]
输出：1
```

**提示：**

- `1 <= boxes.length <= 100`

- `1 <= boxes[i] <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「记忆化, 数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

设计递归函数 `dfs(i, j, k)` 表示当前处理的区间为 `[i, j]`，且该区间的右边有 `k` 个与 `boxes[j]` 相同的元素，返回该区间的最大积分。答案即为 `dfs(0, n - 1, 0)`。

对于 `dfs(i, j, k)`，我们可以直接删除 `boxes[j]` 和其右边的 `k` 个元素，所得积分为 `dfs(i, j - 1, 0) + (k + 1) * (k + 1)`。

我们还可以在区间 `[i, j-1]` 内枚举下标 `h`，找到满足 `boxes[h] == boxes[j]` 的下标，那么我们就将区间 `[i, j - 1]` 分成两部分，即 `[i, h]` 和 `[h + 1, j - 1]`。其中 `[i, h]` 的部分可以与 `boxes[j]` 合并，所以积分为 `dfs(i, h, k + 1) + dfs(h + 1, j - 1, 0)`。求不同 `h` 下的最大值即可。

我们使用记忆化搜索来优化递归函数的时间复杂度。

时间复杂度 $O(n^4)$，空间复杂度 $O(n^3)$。

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
// Remove Boxes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeBoxes(boxes []int) int {
	n := len(boxes)
	f := make([][][]int, n)
	for i := range f {
		f[i] = make([][]int, n)
		for j := range f[i] {
			f[i][j] = make([]int, n)
		}
	}
	var dfs func(i, j, k int) int
	dfs = func(i, j, k int) int {
		if i > j {
			return 0
		}
		for i < j && boxes[j] == boxes[j-1] {
			j, k = j-1, k+1
		}
		if f[i][j][k] > 0 {
			return f[i][j][k]
		}
		ans := dfs(i, j-1, 0) + (k+1)*(k+1)
		for h := i; h < j; h++ {
			if boxes[h] == boxes[j] {
				ans = max(ans, dfs(h+1, j-1, 0)+dfs(i, h, k+1))
			}
		}
		f[i][j][k] = ans
		return ans
	}
	return dfs(0, n-1, 0)
}
```

### Java

```java
// Remove Boxes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private int[][][] f;
    private int[] b;

    public int removeBoxes(int[] boxes) {
        b = boxes;
        int n = b.length;
        f = new int[n][n][n];
        return dfs(0, n - 1, 0);
    }

    private int dfs(int i, int j, int k) {
        if (i > j) {
            return 0;
        }
        while (i < j && b[j] == b[j - 1]) {
            --j;
            ++k;
        }
        if (f[i][j][k] > 0) {
            return f[i][j][k];
        }
        int ans = dfs(i, j - 1, 0) + (k + 1) * (k + 1);
        for (int h = i; h < j; ++h) {
            if (b[h] == b[j]) {
                ans = Math.max(ans, dfs(h + 1, j - 1, 0) + dfs(i, h, k + 1));
            }
        }
        f[i][j][k] = ans;
        return ans;
    }
}
```

### Python

```python
# Remove Boxes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeBoxes(self, boxes: List[int]) -> int:
        @cache
        def dfs(i, j, k):
            if i > j:
                return 0
            while i < j and boxes[j] == boxes[j - 1]:
                j, k = j - 1, k + 1
            ans = dfs(i, j - 1, 0) + (k + 1) * (k + 1)
            for h in range(i, j):
                if boxes[h] == boxes[j]:
                    ans = max(ans, dfs(h + 1, j - 1, 0) + dfs(i, h, k + 1))
            return ans

        n = len(boxes)
        ans = dfs(0, n - 1, 0)
        dfs.cache_clear()
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

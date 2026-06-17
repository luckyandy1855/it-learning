# 0587. Erect the Fence

---
编号: 587
题目: Erect the Fence
难度: 困难
标签: [几何, 数组, 数学]
来源链接: https://leetcode.com/problems/erect-the-fence/
---

## 题目描述

给定一个数组 `trees`，其中 `trees[i] = [xi, yi]` 表示树在花园中的位置。

你被要求用最短长度的绳子把整个花园围起来，因为绳子很贵。只有把 **所有的树都围起来**，花园才围得很好。

返回*恰好位于围栏周边的树木的坐标*。

**示例 1:**

```text
输入: points = [[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]
输出: [[1,1],[2,0],[3,3],[2,4],[4,2]]
```

**示例 2:**

```text
输入: points = [[1,2],[2,2],[4,2]]
输出: [[4,2],[2,2],[1,2]]
```

**注意:**

- `1 i, yi 所有给定的点都是 **唯一 **的。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

原理：

利用夹角，让整个图形保持左转。先将最左边的前两个点加入栈中，每次加入新点时判断是否左拐（叉积大于 0），如果是就将新点直接加入；如果不是，就弹出栈顶，直到左拐，将新点加入栈中。

流程：

1. 将所有点 `(x, y)` 进行排序，以 x 为第一关键字，y 为第二关键字升序排序；
1. 先从左至右维护凸包的下半部分，然后再从右至左维护上半部分；
1. 将第一个点放入栈中，这个点一定时凸包的最左边的点了，是不会清理掉的，然后再将第二个点放入栈中。当栈中元素大于等于 2 的时候，就要判断栈顶元素是否还要保留：
    - 如果新点在栈顶元素和次栈顶元素所组成的直线的逆时针方向上，那么直接将新点加入栈中；
    - 否则，将栈顶元素不断弹出，直至新点的位置出现在栈顶元素与次栈顶元素所在直线的逆时针方向。

这个过程，是从左往右走的，并且得到的凸包是凸壳的下半部分。求上半部分的时候，从右往左遍历。

时间复杂度 O(nlogn)。

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
// Erect the Fence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func outerTrees(trees [][]int) [][]int {
	n := len(trees)
	if n < 4 {
		return trees
	}
	sort.Slice(trees, func(i, j int) bool {
		if trees[i][0] == trees[j][0] {
			return trees[i][1] < trees[j][1]
		}
		return trees[i][0] < trees[j][0]
	})
	cross := func(i, j, k int) int {
		a, b, c := trees[i], trees[j], trees[k]
		return (b[0]-a[0])*(c[1]-b[1]) - (b[1]-a[1])*(c[0]-b[0])
	}
	vis := make([]bool, n)
	stk := []int{0}
	for i := 1; i < n; i++ {
		for len(stk) > 1 && cross(stk[len(stk)-1], stk[len(stk)-2], i) < 0 {
			vis[stk[len(stk)-1]] = false
			stk = stk[:len(stk)-1]
		}
		vis[i] = true
		stk = append(stk, i)
	}
	m := len(stk)
	for i := n - 1; i >= 0; i-- {
		if vis[i] {
			continue
		}
		for len(stk) > m && cross(stk[len(stk)-1], stk[len(stk)-2], i) < 0 {
			stk = stk[:len(stk)-1]
		}
		stk = append(stk, i)
	}
	var ans [][]int
	for i := 0; i < len(stk)-1; i++ {
		ans = append(ans, trees[stk[i]])
	}
	return ans
}
```

### Java

```java
// Erect the Fence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[][] outerTrees(int[][] trees) {
        int n = trees.length;
        if (n < 4) {
            return trees;
        }
        Arrays.sort(trees, (a, b) -> { return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0]; });
        boolean[] vis = new boolean[n];
        int[] stk = new int[n + 10];
        int cnt = 1;
        for (int i = 1; i < n; ++i) {
            while (cnt > 1 && cross(trees[stk[cnt - 1]], trees[stk[cnt - 2]], trees[i]) < 0) {
                vis[stk[--cnt]] = false;
            }
            vis[i] = true;
            stk[cnt++] = i;
        }
        int m = cnt;
        for (int i = n - 1; i >= 0; --i) {
            if (vis[i]) {
                continue;
            }
            while (cnt > m && cross(trees[stk[cnt - 1]], trees[stk[cnt - 2]], trees[i]) < 0) {
                --cnt;
            }
            stk[cnt++] = i;
        }
        int[][] ans = new int[cnt - 1][2];
        for (int i = 0; i < ans.length; ++i) {
            ans[i] = trees[stk[i]];
        }
        return ans;
    }

    private int cross(int[] a, int[] b, int[] c) {
        return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    }
}
```

### Python

```python
# Erect the Fence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        def cross(i, j, k):
            a, b, c = trees[i], trees[j], trees[k]
            return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])

        n = len(trees)
        if n < 4:
            return trees
        trees.sort()
        vis = [False] * n
        stk = [0]
        for i in range(1, n):
            while len(stk) > 1 and cross(stk[-2], stk[-1], i) < 0:
                vis[stk.pop()] = False
            vis[i] = True
            stk.append(i)
        m = len(stk)
        for i in range(n - 2, -1, -1):
            if vis[i]:
                continue
            while len(stk) > m and cross(stk[-2], stk[-1], i) < 0:
                stk.pop()
            stk.append(i)
        stk.pop()
        return [trees[i] for i in stk]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1088. Confusing Number II

---
编号: 1088
题目: Confusing Number II
难度: 困难
标签: [数学, 回溯]
来源链接: https://leetcode.com/problems/confusing-number-ii/
---

## 题目描述

**易混淆数**（Confusing Number）指的是一个数字在整体旋转 `180°` 以后，能够得到一个和原来 **不同 **的数，且 **新数字的每一位都应该是有效的**。

本题我们会将数字旋转 `180°` 来生成一个新的数字。

- 当 `0、1、6、8、9` 旋转 `180°` 以后，我们得到的新数字分别为 0、1、9、8、6。

- 当 `2、3、4、5、7` 旋转 `180°` 后，是 **无法** 得到任何数字的。

请注意，在旋转一个数字之后，我们可以忽略前导零。

- 例如，在旋转 `8000` 之后，我们有 `0008` ，它被认为只是 `8` 。

给出正整数 `n`，请你返回  *`[1, n]` 范围内的 **易混淆数** 的数量 *。

**示例 1：**

```text
输入：n = 20
输出：6
解释：易混淆数为 [6,9,10,16,18,19]。
6 转换为 9
9 转换为 6
10 转换为 01 也就是 1
16 转换为 91
18 转换为 81
19 转换为 61
```

**示例 2：**

```text
输入：n = 100
输出：19
解释：易混淆数为 [6,9,10,16,18,19,60,61,66,68,80,81,86,89,90,91,98,99,100]。
```

**提示：**

- `1 <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先将数字 $n$ 转成字符串 $s$。

接下来，我们定义一个函数 $check(x)$，用来判断 $x$ 在旋转 $180^\circ$ 之后是否变成了一个不同的数。如果 $x$ 在旋转 $180^\circ$ 之后变成了一个不同的数，那么我们就称 $x$ 是一个易混淆数。

然后，我们定义另一个函数 $dfs(pos, limit, x)$，用于搜索从高位到低位的每一位。其中：

- 参数 $pos$ 表示当前搜索到的位置，初始时为 $0$；
- 参数 $limit$ 表示当前搜索的数是否受到上界的限制，初始时为 $true$；
- 参数 $x$ 表示当前搜索的数，初始时为 $0$。

在 $dfs(pos, limit, x)$ 中，如果 $pos \geq len(s)$，那么我们就判断 $x$ 是否是一个易混淆数，如果是则返回 $1$，否则返回 $0$。

否则，我们计算出当前位置上的数字的上界 $up$，然后枚举当前位置上的数字 $i$，如果 $i$ 在旋转 $180^\circ$ 之后不是一个数字，那么我们就直接跳过这个数字。否则，我们将 $x$ 更新为 $x \times 10 + i$，并根据 $limit$ 的值决定下一步搜索的时候是否受到上界的限制，最后将答案返回。

最终的答案即为 $dfs(0, true, 0)$。

时间复杂度 $O(5^{\log_{10}n})$，空间复杂度 $O(\log_{10}n)$。其中 $5^{\log_{10}n}$ 表示 $n$ 的位数。

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
// Confusing Number II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func confusingNumberII(n int) int {
	d := [10]int{0, 1, -1, -1, -1, -1, 9, -1, 8, 6}
	s := strconv.Itoa(n)
	check := func(x int) bool {
		y := 0
		for t := x; t > 0; t /= 10 {
			v := t % 10
			y = y*10 + d[v]
		}
		return x != y
	}
	var dfs func(pos int, limit bool, x int) int
	dfs = func(pos int, limit bool, x int) (ans int) {
		if pos >= len(s) {
			if check(x) {
				return 1
			}
			return 0
		}
		up := 9
		if limit {
			up = int(s[pos] - '0')
		}
		for i := 0; i <= up; i++ {
			if d[i] != -1 {
				ans += dfs(pos+1, limit && i == up, x*10+i)
			}
		}
		return
	}
	return dfs(0, true, 0)
}
```

### Java

```java
// Confusing Number II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int[] d = {0, 1, -1, -1, -1, -1, 9, -1, 8, 6};
    private String s;

    public int confusingNumberII(int n) {
        s = String.valueOf(n);
        return dfs(0, 1, 0);
    }

    private int dfs(int pos, int limit, int x) {
        if (pos >= s.length()) {
            return check(x) ? 1 : 0;
        }
        int up = limit == 1 ? s.charAt(pos) - '0' : 9;
        int ans = 0;
        for (int i = 0; i <= up; ++i) {
            if (d[i] != -1) {
                ans += dfs(pos + 1, limit == 1 && i == up ? 1 : 0, x * 10 + i);
            }
        }
        return ans;
    }

    private boolean check(int x) {
        int y = 0;
        for (int t = x; t > 0; t /= 10) {
            int v = t % 10;
            y = y * 10 + d[v];
        }
        return x != y;
    }
}
```

### Python

```python
# Confusing Number II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def confusingNumberII(self, n: int) -> int:
        def check(x: int) -> bool:
            y, t = 0, x
            while t:
                t, v = divmod(t, 10)
                y = y * 10 + d[v]
            return x != y

        def dfs(pos: int, limit: bool, x: int) -> int:
            if pos >= len(s):
                return int(check(x))
            up = int(s[pos]) if limit else 9
            ans = 0
            for i in range(up + 1):
                if d[i] != -1:
                    ans += dfs(pos + 1, limit and i == up, x * 10 + i)
            return ans

        d = [0, 1, -1, -1, -1, -1, 9, -1, 8, 6]
        s = str(n)
        return dfs(0, True, 0)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

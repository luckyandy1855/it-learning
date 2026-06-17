# 1320. Minimum Distance to Type a Word Using Two Fingers

---
编号: 1320
题目: Minimum Distance to Type a Word Using Two Fingers
难度: 困难
标签: [字符串, 动态规划]
来源链接: https://leetcode.com/problems/minimum-distance-to-type-a-word-using-two-fingers/
---

## 题目描述

二指输入法定制键盘在 **X-Y** 平面上的布局如上图所示，其中每个大写英文字母都位于某个坐标处。

- 例如字母 **A** 位于坐标 **(0,0)**，字母 **B** 位于坐标 **(0,1)**，字母 **P** 位于坐标 **(2,3)** 且字母 **Z** 位于坐标 **(4,1)**。

给你一个待输入字符串 `word`，请你计算并返回在仅使用两根手指的情况下，键入该字符串需要的最小移动总距离。

坐标` **(x1,y1)** `和 `**(x2,y2)**` 之间的 **距离** 是 `**|x1 - x2| + |y1 - y2|**`。

**注意**，两根手指的起始位置是零代价的，不计入移动总距离。你的两根手指的起始位置也不必从首字母或者前两个字母开始。

**示例 1：**

```text
输入：word = "CAKE"
输出：3
解释：
使用两根手指输入 "CAKE" 的最佳方案之一是：
手指 1 在字母 'C' 上 -> 移动距离 = 0
手指 1 在字母 'A' 上 -> 移动距离 = 从字母 'C' 到字母 'A' 的距离 = 2
手指 2 在字母 'K' 上 -> 移动距离 = 0
手指 2 在字母 'E' 上 -> 移动距离 = 从字母 'K' 到字母 'E' 的距离  = 1
总距离 = 3
```

**示例 2：**

```text
输入：word = "HAPPY"
输出：6
解释：
使用两根手指输入 "HAPPY" 的最佳方案之一是：
手指 1 在字母 'H' 上 -> 移动距离 = 0
手指 1 在字母 'A' 上 -> 移动距离 = 从字母 'H' 到字母 'A' 的距离 = 2
手指 2 在字母 'P' 上 -> 移动距离 = 0
手指 2 在字母 'P' 上 -> 移动距离 = 从字母 'P' 到字母 'P' 的距离 = 0
手指 1 在字母 'Y' 上 -> 移动距离 = 从字母 'A' 到字母 'Y' 的距离 = 4
总距离 = 6
```

**提示：**

- `2 <= word.length <= 300`

- 每个 `word[i]` 都是一个大写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j][k]$ 表示输入完 $\textit{word}[i]$，且手指 $1$ 位于位置 $j$，手指 $2$ 位于位置 $k$ 时，最小的移动距离。这里的位置 $j$ 和 $k$ 表示的是字母对应的数字，取值范围为 $[0,..25]$。初始时 $f[i][j][k]=\infty$。

我们实现一个函数 $\textit{dist}(a, b)$，表示位置 $a$ 和位置 $b$ 之间的距离，即 $\textit{dist}(a, b) = |\frac{a}{6} - \frac{b}{6}| + |a \bmod 6 - b \bmod 6|$。

接下来，我们考虑输入 $\textit{word}[0]$，即只有一个字母的的情况，此时有两种选择：

- 手指 $1$ 位于 $\textit{word}[0]$ 所在的位置，手指 $2$ 位于任意位置，此时 $f[0][\textit{word}[0]][k] = 0$，其中 $k \in [0,..25]$。
- 手指 $2$ 位于 $\textit{word}[0]$ 所在的位置，手指 $1$ 位于任意位置，此时 $f[0][k][\textit{word}[0]] = 0$，其中 $k \in [0,..25]$。

然后我们考虑输入 $\textit{word}[1,..n-1]$，我们记上一个字母和当前字母所在的位置分别为 $a$ 和 $b$，接下来我们进行分情况讨论：

如果当前手指 $1$ 位于位置 $b$，我们枚举手指 $2$ 的位置 $j$，假如上一个位置 $a$ 也是手指 $1$ 的位置，那么此时有 $f[i][b][j]=\min(f[i][b][j], f[i-1][a][j]+\textit{dist}(a, b))$。如果手指 $2$ 的位置与上一个位置 $a$ 相同，即 $j=a$，那么我们枚举上一个位置的手指 $1$ 所在的位置 $k$，此时有 $f[i][j][j]=\min(f[i][b][j], f[i-1][k][a]+\textit{dist}(k, b))$。

同理，如果当前手指 $2$ 位于位置 $b$，我们枚举手指 $1$ 的位置 $j$，假如上一个位置 $a$ 也是手指 $2$ 的位置，那么此时有 $f[i][j][b]=\min(f[i][j][b], f[i-1][j][a]+\textit{dist}(a, b))$。如果手指 $1$ 的位置与上一个位置 $a$ 相同，即 $j=a$，那么我们枚举上一个位置的手指 $2$ 所在的位置 $k$，此时有 $f[i][j][b]=\min(f[i][j][b], f[i-1][a][k]+\textit{dist}(k, b))$。

最后，我们枚举最后一个位置的手指 $1$ 和手指 $2$ 所在的位置，取最小值即为答案。

时间复杂度 $O(n \times |\Sigma|^2)$，空间复杂度 $O(n \times |\Sigma|^2)$。其中 $n$ 为字符串 $\textit{word}$ 的长度，而 $|\Sigma|$ 为字母表的大小，本题中 $|\Sigma|=26$。

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
// Minimum Distance to Type a Word Using Two Fingers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minimumDistance(word string) int {
	n := len(word)
	f := make([][26][26]int, n)
	const inf = 1 << 30
	for i := range f {
		for j := range f[i] {
			for k := range f[i][j] {
				f[i][j][k] = inf
			}
		}
	}
	for j := range f[0] {
		f[0][word[0]-'A'][j] = 0
		f[0][j][word[0]-'A'] = 0
	}
	dist := func(a, b int) int {
		x1, y1 := a/6, a%6
		x2, y2 := b/6, b%6
		return abs(x1-x2) + abs(y1-y2)
	}
	for i := 1; i < n; i++ {
		a, b := int(word[i-1]-'A'), int(word[i]-'A')
		d := dist(a, b)
		for j := 0; j < 26; j++ {
			f[i][b][j] = min(f[i][b][j], f[i-1][a][j]+d)
			f[i][j][b] = min(f[i][j][b], f[i-1][j][a]+d)
			if j == a {
				for k := 0; k < 26; k++ {
					t := dist(k, b)
					f[i][b][j] = min(f[i][b][j], f[i-1][k][a]+t)
					f[i][j][b] = min(f[i][j][b], f[i-1][a][k]+t)
				}
			}
		}
	}
	ans := inf
	for j := 0; j < 26; j++ {
		ans = min(ans, f[n-1][word[n-1]-'A'][j])
		ans = min(ans, f[n-1][j][word[n-1]-'A'])
	}
	return ans
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
```

### Java

```java
// Minimum Distance to Type a Word Using Two Fingers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minimumDistance(String word) {
        int n = word.length();
        final int inf = 1 << 30;
        int[][][] f = new int[n][26][26];
        for (int[][] g : f) {
            for (int[] h : g) {
                Arrays.fill(h, inf);
            }
        }
        for (int j = 0; j < 26; ++j) {
            f[0][word.charAt(0) - 'A'][j] = 0;
            f[0][j][word.charAt(0) - 'A'] = 0;
        }
        for (int i = 1; i < n; ++i) {
            int a = word.charAt(i - 1) - 'A';
            int b = word.charAt(i) - 'A';
            int d = dist(a, b);
            for (int j = 0; j < 26; ++j) {
                f[i][b][j] = Math.min(f[i][b][j], f[i - 1][a][j] + d);
                f[i][j][b] = Math.min(f[i][j][b], f[i - 1][j][a] + d);
                if (j == a) {
                    for (int k = 0; k < 26; ++k) {
                        int t = dist(k, b);
                        f[i][b][j] = Math.min(f[i][b][j], f[i - 1][k][a] + t);
                        f[i][j][b] = Math.min(f[i][j][b], f[i - 1][a][k] + t);
                    }
                }
            }
        }
        int ans = inf;
        for (int j = 0; j < 26; ++j) {
            ans = Math.min(ans, f[n - 1][j][word.charAt(n - 1) - 'A']);
            ans = Math.min(ans, f[n - 1][word.charAt(n - 1) - 'A'][j]);
        }
        return ans;
    }

    private int dist(int a, int b) {
        int x1 = a / 6, y1 = a % 6;
        int x2 = b / 6, y2 = b % 6;
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}
```

### Python

```python
# Minimum Distance to Type a Word Using Two Fingers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minimumDistance(self, word: str) -> int:
        def dist(a: int, b: int) -> int:
            x1, y1 = divmod(a, 6)
            x2, y2 = divmod(b, 6)
            return abs(x1 - x2) + abs(y1 - y2)

        n = len(word)
        f = [[[inf] * 26 for _ in range(26)] for _ in range(n)]
        for j in range(26):
            f[0][ord(word[0]) - ord('A')][j] = 0
            f[0][j][ord(word[0]) - ord('A')] = 0
        for i in range(1, n):
            a, b = ord(word[i - 1]) - ord('A'), ord(word[i]) - ord('A')
            d = dist(a, b)
            for j in range(26):
                f[i][b][j] = min(f[i][b][j], f[i - 1][a][j] + d)
                f[i][j][b] = min(f[i][j][b], f[i - 1][j][a] + d)
                if j == a:
                    for k in range(26):
                        t = dist(k, b)
                        f[i][b][j] = min(f[i][b][j], f[i - 1][k][a] + t)
                        f[i][j][b] = min(f[i][j][b], f[i - 1][a][k] + t)
        a = min(f[n - 1][ord(word[-1]) - ord('A')])
        b = min(f[n - 1][j][ord(word[-1]) - ord('A')] for j in range(26))
        return int(min(a, b))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

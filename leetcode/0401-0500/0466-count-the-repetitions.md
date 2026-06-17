# 0466. Count The Repetitions

---
编号: 466
题目: Count The Repetitions
难度: 困难
标签: [双指针, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/count-the-repetitions/
---

## 题目描述

定义 `str = [s, n]` 表示 `str` 由 `n` 个字符串 `s` 连接构成。

- 例如，`str == ["abc", 3] =="abcabcabc"` 。

如果可以从 `s2` 中删除某些字符使其变为 `s1`，则称字符串 `s1` 可以从字符串 `s2` 获得。

- 例如，根据定义，`s1 = "abc"` 可以从 `s2 = "ab***dbe***c"` 获得，仅需要删除加粗且用斜体标识的字符。

现在给你两个字符串 `s1` 和 `s2` 和两个整数 `n1` 和 `n2` 。由此构造得到两个字符串，其中 `str1 = [s1, n1]`、`str2 = [s2, n2]` 。

请你找出一个最大整数 `m` ，以满足 `str = [str2, m]` 可以从 `str1` 获得。

**示例 1：**

```text
输入：s1 = "acb", n1 = 4, s2 = "ab", n2 = 2
输出：2
```

**示例 2：**

```text
输入：s1 = "acb", n1 = 1, s2 = "acb", n2 = 1
输出：1
```

**提示：**

- `1 <= s1.length, s2.length <= 100`

- `s1` 和 `s2` 由小写英文字母组成

- `1 <= n1, n2 <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「双指针, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们预处理出以字符串 $s_2$ 的每个位置 $i$ 开始匹配一个完整的 $s_1$ 后，下一个位置 $j$ 以及经过了多少个 $s_2$，即 $d[i] = (cnt, j)$，其中 $cnt$ 表示匹配了多少个 $s_2$，而 $j$ 表示字符串 $s_2$ 的下一个位置。

接下来，我们初始化 $j=0$，然后循环 $n1$ 次，每一次将 $d[j][0]$ 加到答案中，然后更新 $j=d[j][1]$。

最后得到的答案就是 $n1$ 个 $s_1$ 所能匹配的 $s_2$ 的个数，除以 $n2$ 即可得到答案。

时间复杂度 $O(m \times n + n_1)$，空间复杂度 $O(n)$。其中 $m$ 和 $n$ 分别是 $s_1$ 和 $s_2$ 的长度。

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
// Count The Repetitions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func getMaxRepetitions(s1 string, n1 int, s2 string, n2 int) (ans int) {
	n := len(s2)
	d := make([][2]int, n)
	for i := 0; i < n; i++ {
		j := i
		cnt := 0
		for k := range s1 {
			if s1[k] == s2[j] {
				j++
				if j == n {
					cnt++
					j = 0
				}
			}
		}
		d[i] = [2]int{cnt, j}
	}
	for j := 0; n1 > 0; n1-- {
		ans += d[j][0]
		j = d[j][1]
	}
	ans /= n2
	return
}
```

### Java

```java
// Count The Repetitions：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int getMaxRepetitions(String s1, int n1, String s2, int n2) {
        int m = s1.length(), n = s2.length();
        int[][] d = new int[n][0];
        for (int i = 0; i < n; ++i) {
            int j = i;
            int cnt = 0;
            for (int k = 0; k < m; ++k) {
                if (s1.charAt(k) == s2.charAt(j)) {
                    if (++j == n) {
                        j = 0;
                        ++cnt;
                    }
                }
            }
            d[i] = new int[] {cnt, j};
        }
        int ans = 0;
        for (int j = 0; n1 > 0; --n1) {
            ans += d[j][0];
            j = d[j][1];
        }
        return ans / n2;
    }
}
```

### Python

```python
# Count The Repetitions：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def getMaxRepetitions(self, s1: str, n1: int, s2: str, n2: int) -> int:
        n = len(s2)
        d = {}
        for i in range(n):
            cnt = 0
            j = i
            for c in s1:
                if c == s2[j]:
                    j += 1
                if j == n:
                    cnt += 1
                    j = 0
            d[i] = (cnt, j)

        ans = 0
        j = 0
        for _ in range(n1):
            cnt, j = d[j]
            ans += cnt
        return ans // n2
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

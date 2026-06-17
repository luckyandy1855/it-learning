# 1363. Largest Multiple of Three

---
编号: 1363
题目: Largest Multiple of Three
难度: 困难
标签: [贪心, 数组, 数学, 动态规划, 排序]
来源链接: https://leetcode.com/problems/largest-multiple-of-three/
---

## 题目描述

给你一个整数数组 `digits`，你可以通过按 **任意顺序** 连接其中某些数字来形成 **3** 的倍数，请你返回所能得到的最大的 3 的倍数。

由于答案可能不在整数数据类型范围内，请以字符串形式返回答案。如果无法得到答案，请返回一个空字符串。返回的结果不应包含不必要的前导零。

**示例 1：**

```text
输入：digits = [8,1,9]
输出："981"
```

**示例 2：**

```text
输入：digits = [8,6,7,1,0]
输出："8760"
```

**示例 3：**

```text
输入：digits = [1]
输出：""
```

**示例 4：**

```text
输入：digits = [0,0,0,0,0,0]
输出："0"
```

**提示：**

- `1 <= digits.length <= 10^4`

- `0 <= digits[i] <= 9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 数学, 动态规划, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义 $f[i][j]$ 表示在前 $i$ 个数中选取若干个数，使得选取的数的和模 $3$ 为 $j$ 的最大长度。为了使得选取的数最大，我们需要尽可能选取更多的数，因此我们需要使得 $f[i][j]$ 尽可能大。我们初始化 $f[0][0] = 0$，其余的 $f[0][j] = -\infty$。

考虑 $f[i][j]$ 如何进行状态转移。我们可以不选取第 $i$ 个数，此时 $f[i][j] = f[i - 1][j]$；我们也可以选取第 $i$ 个数，此时 $f[i][j] = f[i - 1][(j - x_i \bmod 3 + 3) \bmod 3] + 1$，其中 $x_i$ 表示第 $i$ 个数的值。因此我们有如下的状态转移方程：


f[i][j] = \max \{ f[i - 1][j], f[i - 1][(j - x_i \bmod 3 + 3) \bmod 3] + 1 \}


如果 $f[n][0] \le 0$，那么我们无法选取任何数，因此答案字符串为空。否则我们可以通过 $f$ 数组进行逆推，找出选取的数。

定义 $i = n$, $j = 0$，从 $f[i][j]$ 开始逆推，记 $k = (j - x_i \bmod 3 + 3) \bmod 3$，如果 $f[i - 1][k] + 1 = f[i][j]$，那么我们选取了第 $i$ 个数，否则我们没有选取第 $i$ 个数。如果我们选取了第 $i$ 个数，那么我们将 $j$ 更新为 $k$，否则我们保持 $j$ 不变。为了使得同等长度的数最大，我们应该优先选取较大的数，因此，我们在前面首先对数组进行排序。

时间复杂度 $O(n \times \log n)$，空间复杂度 $O(n)$。其中 $n$ 为数组的长度。

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
// Largest Multiple of Three：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func largestMultipleOfThree(digits []int) string {
	sort.Ints(digits)
	n := len(digits)
	const inf = 1 << 30
	f := make([][]int, n+1)
	for i := range f {
		f[i] = make([]int, 3)
		for j := range f[i] {
			f[i][j] = -inf
		}
	}
	f[0][0] = 0
	for i := 1; i <= n; i++ {
		for j := 0; j < 3; j++ {
			f[i][j] = max(f[i-1][j], f[i-1][(j-digits[i-1]%3+3)%3]+1)
		}
	}
	if f[n][0] <= 0 {
		return ""
	}
	ans := []byte{}
	for i, j := n, 0; i > 0; i-- {
		k := (j - digits[i-1]%3 + 3) % 3
		if f[i][j] == f[i-1][k]+1 {
			ans = append(ans, byte('0'+digits[i-1]))
			j = k
		}
	}
	i := 0
	for i < len(ans)-1 && ans[i] == '0' {
		i++
	}
	return string(ans[i:])
}
```

### Java

```java
// Largest Multiple of Three：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String largestMultipleOfThree(int[] digits) {
        Arrays.sort(digits);
        int n = digits.length;
        int[][] f = new int[n + 1][3];
        final int inf = 1 << 30;
        for (var g : f) {
            Arrays.fill(g, -inf);
        }
        f[0][0] = 0;
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < 3; ++j) {
                f[i][j] = Math.max(f[i - 1][j], f[i - 1][(j - digits[i - 1] % 3 + 3) % 3] + 1);
            }
        }
        if (f[n][0] <= 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = n, j = 0; i > 0; --i) {
            int k = (j - digits[i - 1] % 3 + 3) % 3;
            if (f[i - 1][k] + 1 == f[i][j]) {
                sb.append(digits[i - 1]);
                j = k;
            }
        }
        int i = 0;
        while (i < sb.length() - 1 && sb.charAt(i) == '0') {
            ++i;
        }
        return sb.substring(i);
    }
}
```

### Python

```python
# Largest Multiple of Three：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def largestMultipleOfThree(self, digits: List[int]) -> str:
        digits.sort()
        n = len(digits)
        f = [[-inf] * 3 for _ in range(n + 1)]
        f[0][0] = 0
        for i, x in enumerate(digits, 1):
            for j in range(3):
                f[i][j] = max(f[i - 1][j], f[i - 1][(j - x % 3 + 3) % 3] + 1)
        if f[n][0] <= 0:
            return ""
        arr = []
        j = 0
        for i in range(n, 0, -1):
            k = (j - digits[i - 1] % 3 + 3) % 3
            if f[i - 1][k] + 1 == f[i][j]:
                arr.append(digits[i - 1])
                j = k
        i = 0
        while i < len(arr) - 1 and arr[i] == 0:
            i += 1
        return "".join(map(str, arr[i:]))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

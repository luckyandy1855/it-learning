# 0247. Strobogrammatic Number II

---
编号: 247
题目: Strobogrammatic Number II
难度: 中等
标签: [递归, 数组, 字符串]
来源链接: https://leetcode.com/problems/strobogrammatic-number-ii/
---

## 题目描述

给定一个整数 `n` ，返回所有长度为 `n` 的 **中心对称数** 。你可以以 **任何顺序** 返回答案。

**中心对称数 **是一个数字在旋转了 `180` 度之后看起来依旧相同的数字（或者上下颠倒地看）。

**示例 1:**

```text
输入：n = 2
输出：["11","69","88","96"]
```

**示例 2:**

```text
输入：n = 1
输出：["0","1","8"]
```

**提示：**

- `1 <= n <= 14`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「递归, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

若长度为 $1$，则中心对称数只有 $0, 1, 8$；若长度为 $2$，则中心对称数只有 $11, 69, 88, 96$。

我们设计递归函数 $dfs(u)$，其返回长度为 $u$ 的中心对称数。答案为 $dfs(n)$。

若 $u$ 为 $0$，返回包含一个空串的列表，即 `[""]`；若 $u$ 为 $1$，返回列表 `["0", "1", "8"]`。

若 $u$ 大于 $1$，我们对长度为 $u - 2$ 的所有中心对称数进行遍历，对于每个中心对称数 $v$，在其左右两侧分别添加 $1, 8, 6, 9$，即可得到长度为 `u` 的中心对称数。

注意，如果 $u\neq n$，我们还可以在中心对称数的左右两侧分别添加 $0$。

最终，我们将所有长度为 $n$ 的中心对称数返回即可。

时间复杂度为 $O(2^{n+2})$。

相似题目：

- [248. 中心对称数 III 🔒](https://github.com/doocs/leetcode/blob/main/solution/0200-0299/0248.Strobogrammatic%20Number%20III/README.md)

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
// Strobogrammatic Number II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findStrobogrammatic(n int) []string {
	var dfs func(int) []string
	dfs = func(u int) []string {
		if u == 0 {
			return []string{""}
		}
		if u == 1 {
			return []string{"0", "1", "8"}
		}
		var ans []string
		pairs := [][]string{{"1", "1"}, {"8", "8"}, {"6", "9"}, {"9", "6"}}
		for _, v := range dfs(u - 2) {
			for _, p := range pairs {
				ans = append(ans, p[0]+v+p[1])
			}
			if u != n {
				ans = append(ans, "0"+v+"0")
			}
		}
		return ans
	}
	return dfs(n)
}
```

### Java

```java
import java.util.*;
// Strobogrammatic Number II：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    private static final int[][] PAIRS = {{1, 1}, {8, 8}, {6, 9}, {9, 6}};
    private int n;

    public List<String> findStrobogrammatic(int n) {
        this.n = n;
        return dfs(n);
    }

    private List<String> dfs(int u) {
        if (u == 0) {
            return Collections.singletonList("");
        }
        if (u == 1) {
            return Arrays.asList("0", "1", "8");
        }
        List<String> ans = new ArrayList<>();
        for (String v : dfs(u - 2)) {
            for (var p : PAIRS) {
                ans.add(p[0] + v + p[1]);
            }
            if (u != n) {
                ans.add(0 + v + 0);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Strobogrammatic Number II：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findStrobogrammatic(self, n: int) -> List[str]:
        def dfs(u):
            if u == 0:
                return ['']
            if u == 1:
                return ['0', '1', '8']
            ans = []
            for v in dfs(u - 2):
                for l, r in ('11', '88', '69', '96'):
                    ans.append(l + v + r)
                if u != n:
                    ans.append('0' + v + '0')
            return ans

        return dfs(n)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

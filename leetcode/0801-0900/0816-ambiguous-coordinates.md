# 0816. Ambiguous Coordinates

---
编号: 816
题目: Ambiguous Coordinates
难度: 中等
标签: [字符串, 回溯, 枚举]
来源链接: https://leetcode.com/problems/ambiguous-coordinates/
---

## 题目描述

我们有一些二维坐标，如 `"(1, 3)"` 或 `"(2, 0.5)"`，然后我们移除所有逗号，小数点和空格，得到一个字符串`S`。返回所有可能的原始字符串到一个列表中。

原始的坐标表示法不会存在多余的零，所以不会出现类似于"00", "0.0", "0.00", "1.0", "001", "00.01"或一些其他更小的数来表示坐标。此外，一个小数点前至少存在一个数，所以也不会出现&ldquo;.1&rdquo;形式的数字。

最后返回的列表可以是任意顺序的。而且注意返回的两个数字中间（逗号之后）都有一个空格。

```text
示例 1:
输入: "(123)"
输出: ["(1, 23)", "(12, 3)", "(1.2, 3)", "(1, 2.3)"]
```

```text
示例 2:
输入: "(00011)"
输出:  ["(0.001, 1)", "(0, 0.011)"]
解释:
0.0, 00, 0001 或 00.01 是不被允许的。
```

```text
示例 3:
输入: "(0123)"
输出: ["(0, 123)", "(0, 12.3)", "(0, 1.23)", "(0.1, 23)", "(0.1, 2.3)", "(0.12, 3)"]
```

```text
示例 4:
输入: "(100)"
输出: [(10, 0)]
解释:
1.0 是不被允许的。
```

**提示：**

- `4 <= S.length <= 12`.

- `S[0]` = "(", `S[S.length - 1]` = ")", 且字符串 `S` 中的其他元素都是数字。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 回溯, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

枚举纵坐标的起始位置，然后分别获取横、纵坐标的所有可能的表示形式，最后将横、纵坐标的所有可能的表示形式组合起来。

我们将一个坐标值 $x$ 或 $y$ 按照小数点的位置分成左右两部分，那么两部分应该满足以下条件：

1. 左半部分不能以 0 开头，除非左半部分只有 0；
2. 右半部分不能以 0 结尾。

时间复杂度 $O(n^3)$，其中 $n$ 为字符串 $S$ 的长度。

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
// Ambiguous Coordinates：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func ambiguousCoordinates(s string) []string {
	f := func(i, j int) []string {
		res := []string{}
		for k := 1; k <= j-i; k++ {
			l, r := s[i:i+k], s[i+k:j]
			ok := (l == "0" || l[0] != '0') && (r == "" || r[len(r)-1] != '0')
			if ok {
				t := ""
				if k < j-i {
					t = "."
				}
				res = append(res, l+t+r)
			}
		}
		return res
	}

	n := len(s)
	ans := []string{}
	for i := 2; i < n-1; i++ {
		for _, x := range f(1, i) {
			for _, y := range f(i, n-1) {
				ans = append(ans, "("+x+", "+y+")")
			}
		}
	}
	return ans
}
```

### Java

```java
// Ambiguous Coordinates：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> ambiguousCoordinates(String s) {
        int n = s.length();
        List<String> ans = new ArrayList<>();
        for (int i = 2; i < n - 1; ++i) {
            for (String x : f(s, 1, i)) {
                for (String y : f(s, i, n - 1)) {
                    ans.add(String.format("(%s, %s)", x, y));
                }
            }
        }
        return ans;
    }

    private List<String> f(String s, int i, int j) {
        List<String> res = new ArrayList<>();
        for (int k = 1; k <= j - i; ++k) {
            String l = s.substring(i, i + k);
            String r = s.substring(i + k, j);
            boolean ok = ("0".equals(l) || !l.startsWith("0")) && !r.endsWith("0");
            if (ok) {
                res.add(l + (k < j - i ? "." : "") + r);
            }
        }
        return res;
    }
}
```

### Python

```python
# Ambiguous Coordinates：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def ambiguousCoordinates(self, s: str) -> List[str]:
        def f(i, j):
            res = []
            for k in range(1, j - i + 1):
                l, r = s[i : i + k], s[i + k : j]
                ok = (l == '0' or not l.startswith('0')) and not r.endswith('0')
                if ok:
                    res.append(l + ('.' if k < j - i else '') + r)
            return res

        n = len(s)
        return [
            f'({x}, {y})' for i in range(2, n - 1) for x in f(1, i) for y in f(i, n - 1)
        ]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

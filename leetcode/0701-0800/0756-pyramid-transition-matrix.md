# 0756. Pyramid Transition Matrix

---
编号: 756
题目: Pyramid Transition Matrix
难度: 中等
标签: [位运算, 哈希表, 字符串, 回溯]
来源链接: https://leetcode.com/problems/pyramid-transition-matrix/
---

## 题目描述

你正在把积木堆成金字塔。每个块都有一个颜色，用一个字母表示。每一行的块比它下面的行 **少一个块** ，并且居中。

为了使金字塔美观，只有特定的 **三角形图案** 是允许的。一个三角形的图案由 **两个块** 和叠在上面的 **单个块** 组成。模式是以三个字母字符串的列表形式 `allowed` 给出的，其中模式的前两个字符分别表示左右底部块，第三个字符表示顶部块。

- 例如，`"ABC"` 表示一个三角形图案，其中一个 `“C”` 块堆叠在一个 `'A'` 块(左)和一个 `'B'` 块(右)之上。请注意，这与 `"BAC"` 不同，`"B"` 在左下角，`"A"` 在右下角。

你从作为单个字符串给出的底部的一排积木 `bottom` 开始，**必须** 将其作为金字塔的底部。

在给定 `bottom` 和 `allowed` 的情况下，如果你能一直构建到金字塔顶部，使金字塔中的 **每个三角形图案** 都是在 `allowed` 中的，则返回 `true` ，否则返回 `false` 。

**示例 1：**

```text
输入：bottom = "BCD", allowed = ["BCC","CDE","CEA","FFF"]
输出：true
解释：允许的三角形图案显示在右边。
从最底层(第 3 层)开始，我们可以在第 2 层构建“CE”，然后在第 1 层构建“A”。
金字塔中有三种三角形图案，分别是 “BCC”、“CDE” 和 “CEA”。都是允许的。
```

**示例 2：**

```text
输入：bottom = "AAAA", allowed = ["AAB","AAC","BCD","BBE","DEF"]
输出：false
解释：允许的三角形图案显示在右边。
从最底层(即第 4 层)开始，创造第 3 层有多种方法，但如果尝试所有可能性，你便会在创造第 1 层前陷入困境。
```

**提示：**

- `2 <= bottom.length <= 6`

- `0 <= allowed.length <= 216`

- `allowed[i].length == 3`

- 所有输入字符串中的字母来自集合 `{'A', 'B', 'C', 'D', 'E', 'F'}`。

-  `allowed` 中所有值都是 **唯一的**

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 哈希表, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个哈希表 $d$ 来存储允许的三角形图案，其中键为两个字符，值为对应的字符列表，表示两个字符可以组成一个三角形图案，三角形图案的顶部为值列表的每一项。

从最底层开始，对于每一层的每两个相邻的字符，如果它们可以组成一个三角形图案，那么就将三角形图案的顶部字符加入到下一层的对应位置的字符列表中，然后对下一层进行递归处理。

当递归到只有一个字符时，说明已经成功构建到金字塔顶部，返回 $\textit{true}$。如果在某一层的某两个相邻字符无法组成三角形图案，则返回 $\textit{false}$。

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
// Pyramid Transition Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func pyramidTransition(bottom string, allowed []string) bool {
	d := make([][]int, 7)
	for i := 0; i < 7; i++ {
		d[i] = make([]int, 7)
	}

	for _, s := range allowed {
		a := int(s[0] - 'A')
		b := int(s[1] - 'A')
		c := int(s[2] - 'A')
		d[a][b] |= 1 << c
	}

	f := make(map[string]bool)

	var dfs func(s string, t []byte) bool
	dfs = func(s string, t []byte) bool {
		if len(s) == 1 {
			return true
		}
		if len(t)+1 == len(s) {
			return dfs(string(t), []byte{})
		}

		key := s + "." + string(t)
		if v, ok := f[key]; ok {
			return v
		}

		i := len(t)
		a := int(s[i] - 'A')
		b := int(s[i+1] - 'A')
		cs := d[a][b]

		for c := 0; c < 7; c++ {
			if (cs>>c)&1 == 1 {
				t = append(t, byte('A'+c))
				if dfs(s, t) {
					f[key] = true
					return true
				}
				t = t[:len(t)-1]
			}
		}

		f[key] = false
		return false
	}

	return dfs(bottom, []byte{})
}
```

### Java

```java
// Pyramid Transition Matrix：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private final int[][] d = new int[7][7];
    private final Map<String, Boolean> f = new HashMap<>();

    public boolean pyramidTransition(String bottom, List<String> allowed) {
        for (String s : allowed) {
            int a = s.charAt(0) - 'A', b = s.charAt(1) - 'A';
            d[a][b] |= 1 << (s.charAt(2) - 'A');
        }
        return dfs(bottom, new StringBuilder());
    }

    private boolean dfs(String s, StringBuilder t) {
        if (s.length() == 1) {
            return true;
        }
        if (t.length() + 1 == s.length()) {
            return dfs(t.toString(), new StringBuilder());
        }
        String k = s + "." + t.toString();
        Boolean res = f.get(k);
        if (res != null) {
            return res;
        }
        int a = s.charAt(t.length()) - 'A', b = s.charAt(t.length() + 1) - 'A';
        int cs = d[a][b];
        for (int i = 0; i < 7; ++i) {
            if (((cs >> i) & 1) == 1) {
                t.append((char) ('A' + i));
                if (dfs(s, t)) {
                    f.put(k, true);
                    return true;
                }
                t.setLength(t.length() - 1);
            }
        }
        f.put(k, false);
        return false;
    }
}
```

### Python

```python
# Pyramid Transition Matrix：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def pyramidTransition(self, bottom: str, allowed: List[str]) -> bool:
        @cache
        def dfs(s: str) -> bool:
            if len(s) == 1:
                return True
            t = []
            for a, b in pairwise(s):
                cs = d[a, b]
                if not cs:
                    return False
                t.append(cs)
            return any(dfs("".join(nxt)) for nxt in product(*t))

        d = defaultdict(list)
        for a, b, c in allowed:
            d[a, b].append(c)
        return dfs(bottom)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

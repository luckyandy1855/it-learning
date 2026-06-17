# 1138. Alphabet Board Path

---
编号: 1138
题目: Alphabet Board Path
难度: 中等
标签: [哈希表, 字符串]
来源链接: https://leetcode.com/problems/alphabet-board-path/
---

## 题目描述

我们从一块字母板上的位置 `(0, 0)` 出发，该坐标对应的字符为 `board[0][0]`。

在本题里，字母板为`board = ["abcde", "fghij", "klmno", "pqrst", "uvwxy", "z"]`，如下所示。

我们可以按下面的指令规则行动：

- 如果方格存在，`'U'` 意味着将我们的位置上移一行；

- 如果方格存在，`'D'` 意味着将我们的位置下移一行；

- 如果方格存在，`'L'` 意味着将我们的位置左移一列；

- 如果方格存在，`'R'` 意味着将我们的位置右移一列；

- `'!'` 会把在我们当前位置 `(r, c)` 的字符 `board[r][c]` 添加到答案中。

（注意，字母板上只存在有字母的位置。）

返回指令序列，用最小的行动次数让答案和目标 `target` 相同。你可以返回任何达成目标的路径。

**示例 1：**

```text
输入：target = "leet"
输出："DDR!UURRR!!DDD!"
```

**示例 2：**

```text
输入：target = "code"
输出："RR!DDRR!UUL!R!"
```

**提示：**

- `1 <= target.length <= 100`

- `target` 仅含有小写英文字母。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

从起点 $(0, 0)$ 出发，模拟每一步的移动，将每一步的移动结果拼接到答案中。注意移动的方向遵循“左、上、右、下”的顺序。

时间复杂度 $O(n)$，其中 $n$ 是字符串 $target$ 的长度，需要遍历字符串 $target$ 中的每一个字符。忽略答案的空间消耗，空间复杂度 $O(1)$。

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
// Alphabet Board Path：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func alphabetBoardPath(target string) string {
	ans := []byte{}
	var i, j int
	for _, c := range target {
		v := int(c - 'a')
		x, y := v/5, v%5
		for j > y {
			j--
			ans = append(ans, 'L')
		}
		for i > x {
			i--
			ans = append(ans, 'U')
		}
		for j < y {
			j++
			ans = append(ans, 'R')
		}
		for i < x {
			i++
			ans = append(ans, 'D')
		}
		ans = append(ans, '!')
	}
	return string(ans)
}
```

### Java

```java
// Alphabet Board Path：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String alphabetBoardPath(String target) {
        StringBuilder ans = new StringBuilder();
        int i = 0, j = 0;
        for (int k = 0; k < target.length(); ++k) {
            int v = target.charAt(k) - 'a';
            int x = v / 5, y = v % 5;
            while (j > y) {
                --j;
                ans.append('L');
            }
            while (i > x) {
                --i;
                ans.append('U');
            }
            while (j < y) {
                ++j;
                ans.append('R');
            }
            while (i < x) {
                ++i;
                ans.append('D');
            }
            ans.append("!");
        }
        return ans.toString();
    }
}
```

### Python

```python
# Alphabet Board Path：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def alphabetBoardPath(self, target: str) -> str:
        i = j = 0
        ans = []
        for c in target:
            v = ord(c) - ord("a")
            x, y = v // 5, v % 5
            while j > y:
                j -= 1
                ans.append("L")
            while i > x:
                i -= 1
                ans.append("U")
            while j < y:
                j += 1
                ans.append("R")
            while i < x:
                i += 1
                ans.append("D")
            ans.append("!")
        return "".join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0293. Flip Game

---
编号: 293
题目: Flip Game
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/flip-game/
---

## 题目描述

你和朋友玩一个叫做「翻转游戏」的游戏。游戏规则如下：

给你一个字符串 `currentState` ，其中只含 `'+'` 和 `'-'` 。你和朋友轮流将 **连续 **的两个 `"++"` 反转成 `"--"` 。当一方无法进行有效的翻转时便意味着游戏结束，则另一方获胜。

计算并返回 **一次有效操作** 后，字符串 `currentState` 所有的可能状态，返回结果可以按 **任意顺序** 排列。如果不存在可能的有效操作，请返回一个空列表 `[]` 。

**示例 1：**

```text
输入：currentState = "++++"
输出：["--++","+--+","++--"]
```

**示例 2：**

```text
输入：currentState = "+"
输出：[]
```

**提示：**

- `1 <= currentState.length <= 500`

- `currentState[i]` 不是 `'+'` 就是 `'-'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们遍历字符串，如果当前字符和下一个字符都是 `+`，那么我们就将这两个字符变成 `-`，然后将结果加入到结果数组中，再将这两个字符变回 `+`。

遍历结束后，返回结果数组即可。

时间复杂度 $O(n^2)$，其中 $n$ 是字符串长度。忽略答案数组的空间复杂度，空间复杂度 $O(n)$ 或 $O(1)$。

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
// Flip Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func generatePossibleNextMoves(currentState string) (ans []string) {
	s := []byte(currentState)
	for i := 0; i < len(s)-1; i++ {
		if s[i] == '+' && s[i+1] == '+' {
			s[i], s[i+1] = '-', '-'
			ans = append(ans, string(s))
			s[i], s[i+1] = '+', '+'
		}
	}
	return
}
```

### Java

```java
import java.util.*;
// Flip Game：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution {
    public List<String> generatePossibleNextMoves(String currentState) {
        List<String> ans = new ArrayList<>();
        char[] s = currentState.toCharArray();
        for (int i = 0; i < s.length - 1; ++i) {
            if (s[i] == '+' && s[i + 1] == '+') {
                s[i] = '-';
                s[i + 1] = '-';
                ans.add(new String(s));
                s[i] = '+';
                s[i + 1] = '+';
            }
        }
        return ans;
    }
}
```

### Python

```python
# Flip Game：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def generatePossibleNextMoves(self, currentState: str) -> List[str]:
        s = list(currentState)
        ans = []
        for i, (a, b) in enumerate(pairwise(s)):
            if a == b == "+":
                s[i] = s[i + 1] = "-"
                ans.append("".join(s))
                s[i] = s[i + 1] = "+"
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

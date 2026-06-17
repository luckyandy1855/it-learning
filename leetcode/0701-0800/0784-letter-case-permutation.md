# 0784. Letter Case Permutation

---
编号: 784
题目: Letter Case Permutation
难度: 中等
标签: [位运算, 字符串, 回溯]
来源链接: https://leetcode.com/problems/letter-case-permutation/
---

## 题目描述

给定一个字符串 `s` ，通过将字符串 `s` 中的每个字母转变大小写，我们可以获得一个新的字符串。

返回 *所有可能得到的字符串集合* 。以 **任意顺序** 返回输出。

**示例 1：**

```text
输入：s = "a1b2"
输出：["a1b2", "a1B2", "A1b2", "A1B2"]
```

**示例 2:**

```text
输入: s = "3z4"
输出: ["3z4","3Z4"]
```

**提示:**

- `1 <= s.length <= 12`

- `s` 由小写英文字母、大写英文字母和数字组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「位运算, 字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于 $s$ 中的每个字母都可以转换为大写或小写，因此可以使用 DFS 深度优先搜索的方法，枚举所有可能的情况。

具体地，从左到右遍历字符串 $s$，对于遍历到的每个字母，可以选择将其转变为大写或小写，然后继续遍历后面的字母。当遍历到字符串的末尾时，得到一个转换方案，将该方案加入答案即可。

转变大小写的方法可以使用位运算实现。对于一个字母，小写形式与大写形式的 ASCII 码之差为 $32$，因此，我们可以通过将该字母的 ASCII 码与 $32$ 进行异或运算来实现大小写转换。

时间复杂度 $O(n \times 2^n)$，其中 $n$ 是字符串 $s$ 的长度。对于每个字母，我们可以选择将其转换为大写或小写，因此一共有 $2^n$ 种转换方案。对于每种转换方案，我们需要 $O(n)$ 的时间生成一个新的字符串。

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
// Letter Case Permutation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func letterCasePermutation(s string) (ans []string) {
	t := []byte(s)
	var dfs func(int)
	dfs = func(i int) {
		if i >= len(t) {
			ans = append(ans, string(t))
			return
		}
		dfs(i + 1)
		if t[i] >= 'A' {
			t[i] ^= 32
			dfs(i + 1)
		}
	}

	dfs(0)
	return ans
}
```

### Java

```java
// Letter Case Permutation：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<String> ans = new ArrayList<>();
    private char[] t;

    public List<String> letterCasePermutation(String s) {
        t = s.toCharArray();
        dfs(0);
        return ans;
    }

    private void dfs(int i) {
        if (i >= t.length) {
            ans.add(new String(t));
            return;
        }
        dfs(i + 1);
        if (Character.isLetter(t[i])) {
            t[i] ^= 32;
            dfs(i + 1);
        }
    }
}
```

### Python

```python
# Letter Case Permutation：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def letterCasePermutation(self, s: str) -> List[str]:
        def dfs(i: int) -> None:
            if i >= len(t):
                ans.append("".join(t))
                return
            dfs(i + 1)
            if t[i].isalpha():
                t[i] = chr(ord(t[i]) ^ 32)
                dfs(i + 1)

        t = list(s)
        ans = []
        dfs(0)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

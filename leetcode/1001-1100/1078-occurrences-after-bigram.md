# 1078. Occurrences After Bigram

---
编号: 1078
题目: Occurrences After Bigram
难度: 简单
标签: [字符串]
来源链接: https://leetcode.com/problems/occurrences-after-bigram/
---

## 题目描述

给出第一个词 `first` 和第二个词 `second`，考虑在某些文本 `text` 中可能以 `"first second third"` 形式出现的情况，其中 `second` 紧随 `first` 出现，`third` 紧随 `second` 出现。

对于每种这样的情况，将第三个词 "`third`" 添加到答案中，并返回答案。

**示例 1：**

```text
输入：text = "alice is a good girl she is a good student", first = "a", second = "good"
输出：["girl","student"]
```

**示例 2：**

```text
输入：text = "we will we will rock you", first = "we", second = "will"
输出：["we","rock"]
```

**提示：**

- `1 <= text.length <= 1000`

- `text` 由小写英文字母和空格组成

- `text` 中的所有单词之间都由 **单个空格字符** 分隔

- `1 <= first.length, second.length <= 10`

- `first` 和 `second` 由小写英文字母组成

- `text` 不包含任何前缀或尾随空格。

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

我们可以将字符串 $text$ 按照空格分割成字符串数组 $words$，然后遍历 $words$，如果 $words[i]$ 和 $words[i+1]$ 分别等于 $first$ 和 $second$，那么就将 $words[i+2]$ 添加到答案中。

遍历结束后，返回答案列表。

时间复杂度 $O(L)$，空间复杂度 $O(L)$，其中 $L$ 是 $text$ 的长度。

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
// Occurrences After Bigram：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findOcurrences(text string, first string, second string) (ans []string) {
	words := strings.Split(text, " ")
	n := len(words)
	for i := 0; i < n-2; i++ {
		if words[i] == first && words[i+1] == second {
			ans = append(ans, words[i+2])
		}
	}
	return
}
```

### Java

```java
// Occurrences After Bigram：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {

    public String[] findOcurrences(String text, String first, String second) {
        String[] words = text.split(" ");
        List<String> ans = new ArrayList<>();
        for (int i = 0; i < words.length - 2; ++i) {
            if (first.equals(words[i]) && second.equals(words[i + 1])) {
                ans.add(words[i + 2]);
            }
        }
        return ans.toArray(new String[0]);
    }
}
```

### Python

```python
# Occurrences After Bigram：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findOcurrences(self, text: str, first: str, second: str) -> List[str]:
        words = text.split()
        ans = []
        for i in range(len(words) - 2):
            a, b, c = words[i : i + 3]
            if a == first and b == second:
                ans.append(c)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

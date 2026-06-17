# 0744. Find Smallest Letter Greater Than Target

---
编号: 744
题目: Find Smallest Letter Greater Than Target
难度: 简单
标签: [数组, 二分查找]
来源链接: https://leetcode.com/problems/find-smallest-letter-greater-than-target/
---

## 题目描述

给你一个字符数组 `letters`，该数组按 **非递减顺序 **排序，以及一个字符 `target`。`letters` 里**至少有两个不同**的字符。

返回 `letters` 中大于 `target` 的最小的字符。如果不存在这样的字符，则返回 `letters` 的第一个字符。

**示例 1：**

```text
输入: letters = ['c', 'f', 'j'], target = 'a'
输出: 'c'
解释：letters 中字典上比 'a' 大的最小字符是 'c'。
```

**示例 2:**

```text
输入: letters = ['c','f','j'], target = 'c'
输出: 'f'
解释：letters 中字典顺序上大于 'c' 的最小字符是 'f'。
```

**示例 3:**

```text
输入: letters = ['x','x','y','y'], target = 'z'
输出: 'x'
解释：letters 中没有一个字符在字典上大于 'z'，所以我们返回 letters[0]。
```

**提示：**

- `2 <= letters.length <= 10^4`

- `letters[i]` 是一个小写字母

- `letters` 按**非递减顺序**排序

- `letters` 最少包含两个不同的字母

- `target` 是一个小写字母

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

由于 $\textit{letters}$ 是按照非递减顺序排序的，所以我们可以使用二分查找来找到大于 $\textit{target}$ 的最小字符。

我们定义二分查找的左边界 $l = 0$，右边界 $r = n$。对于每一次二分查找，我们计算中间位置 $mid = (l + r) / 2$，如果 $letters[mid] > \textit{target}$，则说明我们需要在左半部分继续查找，即 $r = mid$；否则我们需要在右半部分继续查找，即 $l = mid + 1$。

最后我们返回 $letters[l \bmod n]$ 即可。

时间复杂度 $O(\log n)$，其中 $n$ 是 $\textit{letters}$ 的长度。空间复杂度 $O(1)$。

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
// Find Smallest Letter Greater Than Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func nextGreatestLetter(letters []byte, target byte) byte {
	i := sort.Search(len(letters), func(i int) bool { return letters[i] > target })
	return letters[i%len(letters)]
}
```

### Java

```java
// Find Smallest Letter Greater Than Target：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public char nextGreatestLetter(char[] letters, char target) {
        int i = Arrays.binarySearch(letters, (char) (target + 1));
        i = i < 0 ? -i - 1 : i;
        return letters[i % letters.length];
    }
}
```

### Python

```python
# Find Smallest Letter Greater Than Target：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def nextGreatestLetter(self, letters: List[str], target: str) -> str:
        i = bisect_right(letters, ord(target), key=lambda c: ord(c))
        return letters[i % len(letters)]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

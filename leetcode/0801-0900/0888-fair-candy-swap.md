# 0888. Fair Candy Swap

---
编号: 888
题目: Fair Candy Swap
难度: 简单
标签: [数组, 哈希表, 二分查找, 排序]
来源链接: https://leetcode.com/problems/fair-candy-swap/
---

## 题目描述

爱丽丝和鲍勃拥有不同总数量的糖果。给你两个数组 `aliceSizes` 和 `bobSizes` ，`aliceSizes[i]` 是爱丽丝拥有的第 `i` 盒糖果中的糖果数量，`bobSizes[j]` 是鲍勃拥有的第 `j` 盒糖果中的糖果数量。

两人想要互相交换一盒糖果，这样在交换之后，他们就可以拥有相同总数量的糖果。一个人拥有的糖果总数量是他们每盒糖果数量的总和。

返回一个整数数组 `answer`，其中 `answer[0]` 是爱丽丝必须交换的糖果盒中的糖果的数目，`answer[1]` 是鲍勃必须交换的糖果盒中的糖果的数目。如果存在多个答案，你可以返回其中 **任何一个** 。题目测试用例保证存在与输入对应的答案。

**示例 1：**

```text
输入：aliceSizes = [1,1], bobSizes = [2,2]
输出：[1,2]
```

**示例 2：**

```text
输入：aliceSizes = [1,2], bobSizes = [2,3]
输出：[1,2]
```

**示例 3：**

```text
输入：aliceSizes = [2], bobSizes = [1,3]
输出：[2,3]
```

**示例 4：**

```text
输入：aliceSizes = [1,2,5], bobSizes = [2,4]
输出：[5,4]
```

**提示：**

- `1 <= aliceSizes.length, bobSizes.length <= 10^4`

- `1 <= aliceSizes[i], bobSizes[j] <= 10^5`

- 爱丽丝和鲍勃的糖果总数量不同。

- 题目数据保证对于给定的输入至少存在一个有效答案。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 二分查找, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以先计算出爱丽丝和鲍勃的糖果总数之差，除以二得到需要交换的糖果数之差 $\textit{diff}$，用一个哈希表 $\textit{s}$ 存储鲍勃的糖果盒中的糖果数，然后遍历爱丽丝的糖果盒，对于每个糖果数 $\textit{a}$，我们判断 $\textit{a} - \textit{diff}$ 是否在哈希表 $\textit{s}$ 中，如果存在，说明找到了一组答案，返回即可。

时间复杂度 $O(m + n)$，空间复杂度 $O(n)$。其中 $m$ 和 $n$ 分别是爱丽丝和鲍勃的糖果盒的数量。

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
// Fair Candy Swap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func fairCandySwap(aliceSizes []int, bobSizes []int) []int {
	s1, s2 := 0, 0
	s := map[int]bool{}
	for _, a := range aliceSizes {
		s1 += a
	}
	for _, b := range bobSizes {
		s2 += b
		s[b] = true
	}
	diff := (s1 - s2) / 2
	for _, a := range aliceSizes {
		if b := a - diff; s[b] {
			return []int{a, b}
		}
	}
	return nil
}
```

### Java

```java
// Fair Candy Swap：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] fairCandySwap(int[] aliceSizes, int[] bobSizes) {
        int s1 = 0, s2 = 0;
        Set<Integer> s = new HashSet<>();
        for (int a : aliceSizes) {
            s1 += a;
        }
        for (int b : bobSizes) {
            s.add(b);
            s2 += b;
        }
        int diff = (s1 - s2) >> 1;
        for (int a : aliceSizes) {
            int b = a - diff;
            if (s.contains(b)) {
                return new int[] {a, b};
            }
        }
        return null;
    }
}
```

### Python

```python
# Fair Candy Swap：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def fairCandySwap(self, aliceSizes: List[int], bobSizes: List[int]) -> List[int]:
        diff = (sum(aliceSizes) - sum(bobSizes)) >> 1
        s = set(bobSizes)
        for a in aliceSizes:
            if (b := (a - diff)) in s:
                return [a, b]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1291. Sequential Digits

---
编号: 1291
题目: Sequential Digits
难度: 中等
标签: [枚举]
来源链接: https://leetcode.com/problems/sequential-digits/
---

## 题目描述

我们定义「顺次数」为：每一位上的数字都比前一位上的数字大 `1` 的整数。

请你返回由 `[low, high]` 范围内所有顺次数组成的 **有序** 列表（从小到大排序）。

**示例 1：**

```text
输出：low = 100, high = 300
输出：[123,234]
```

**示例 2：**

```text
输出：low = 1000, high = 13000
输出：[1234,2345,3456,4567,5678,6789,12345]
```

**提示：**

- `10 <= low <= high <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以枚举数字的第一位 $i$，然后枚举数字的最后一位 $j$，那么这个数字就是 $i,i+1,\cdots,j$ 这 $j-i+1$ 个数字组成的。我们可以通过不断地将数字乘以 $10$ 并加上下一个数字 $j+1$ 来得到下一个数字，如果数字在 $[low, high]$ 的范围内，我们就将它加入答案中。

枚举结束后，我们将答案数组排序并返回即可。

时间复杂度近似 $O(1)$，空间复杂度 $O(1)$。

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
// Sequential Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func sequentialDigits(low int, high int) (ans []int) {
	for i := 1; i < 9; i++ {
		x := i
		for j := i + 1; j < 10; j++ {
			x = x*10 + j
			if low <= x && x <= high {
				ans = append(ans, x)
			}
		}
	}
	sort.Ints(ans)
	return
}
```

### Java

```java
// Sequential Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> sequentialDigits(int low, int high) {
        List<Integer> ans = new ArrayList<>();
        for (int i = 1; i < 9; ++i) {
            int x = i;
            for (int j = i + 1; j < 10; ++j) {
                x = x * 10 + j;
                if (x >= low && x <= high) {
                    ans.add(x);
                }
            }
        }
        Collections.sort(ans);
        return ans;
    }
}
```

### Python

```python
# Sequential Digits：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def sequentialDigits(self, low: int, high: int) -> List[int]:
        ans = []
        for i in range(1, 9):
            x = i
            for j in range(i + 1, 10):
                x = x * 10 + j
                if low <= x <= high:
                    ans.append(x)
        return sorted(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

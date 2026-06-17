# 0728. Self Dividing Numbers

---
编号: 728
题目: Self Dividing Numbers
难度: 简单
标签: [数学]
来源链接: https://leetcode.com/problems/self-dividing-numbers/
---

## 题目描述

**自除数*** *是指可以被它包含的每一位数整除的数。

- 例如，`128` 是一个 **自除数** ，因为 `128 % 1 == 0`，`128 % 2 == 0`，`128 % 8 == 0`。

**自除数** 不允许包含 0 。

给定两个整数 `left` 和 `right` ，返回一个列表，*列表的元素是范围 `[left, right]`（包括两个端点）内所有的 **自除数*** 。

**示例 1：**

```text
输入：left = 1, right = 22
输出：[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 22]
```

**示例 2:**

```text
输入：left = 47, right = 85
输出：[48,55,66,77]
```

**提示：**

- `1 <= left <= right <= 10^4`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个函数 $\textit{check}(x)$，用来判断 $x$ 是否是自除数。函数的实现思路如下：

我们用 $y$ 来记录 $x$ 的值，然后不断地对 $y$ 除以 $10$，直到 $y$ 为 $0$。在这个过程中，我们判断 $y$ 的末位是否为 $0$，或者 $x$ 是否不能被 $y$ 的末位整除，如果满足这两个条件中的任意一个，那么 $x$ 就不是自除数，返回 $\text{false}$。否则遍历完所有的位数后，返回 $\text{true}$。

最后，我们遍历区间 $[\textit{left}, \textit{right}]$ 中的所有数，对每个数调用 $\textit{check}(x)$，如果返回 $\text{true}$，那么我们就将这个数加入答案数组中。

时间复杂度 $O(n \times \log_{10} M)$，其中 $n$ 是区间 $[\textit{left}, \textit{right}]$ 中的元素个数，而 $M = \textit{right}$，表示区间中的最大值。

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
// Self Dividing Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func selfDividingNumbers(left int, right int) (ans []int) {
	check := func(x int) bool {
		for y := x; y > 0; y /= 10 {
			if y%10 == 0 || x%(y%10) != 0 {
				return false
			}
		}
		return true
	}
	for x := left; x <= right; x++ {
		if check(x) {
			ans = append(ans, x)
		}
	}
	return
}
```

### Java

```java
// Self Dividing Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> selfDividingNumbers(int left, int right) {
        List<Integer> ans = new ArrayList<>();
        for (int x = left; x <= right; ++x) {
            if (check(x)) {
                ans.add(x);
            }
        }
        return ans;
    }

    private boolean check(int x) {
        for (int y = x; y > 0; y /= 10) {
            if (y % 10 == 0 || x % (y % 10) != 0) {
                return false;
            }
        }
        return true;
    }
}
```

### Python

```python
# Self Dividing Numbers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def selfDividingNumbers(self, left: int, right: int) -> List[int]:
        def check(x: int) -> bool:
            y = x
            while y:
                if y % 10 == 0 or x % (y % 10):
                    return False
                y //= 10
            return True

        return [x for x in range(left, right + 1) if check(x)]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

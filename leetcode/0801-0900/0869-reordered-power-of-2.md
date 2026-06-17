# 0869. Reordered Power of 2

---
编号: 869
题目: Reordered Power of 2
难度: 中等
标签: [哈希表, 数学, 计数, 枚举, 排序]
来源链接: https://leetcode.com/problems/reordered-power-of-2/
---

## 题目描述

给定正整数 `n` ，我们按任何顺序（包括原始顺序）将数字重新排序，注意其前导数字不能为零。

如果我们可以通过上述方式得到 2 的幂，返回 `true`；否则，返回 `false`。

**示例 1：**

```text
输入：n = 1
输出：true
```

**示例 2：**

```text
输入：n = 10
输出：false
```

**提示：**

- `1 <= n <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「哈希表, 数学, 计数, 枚举, 排序」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们可以在 $[1, 10^9]$ 的范围内枚举所有的 $2$ 的幂，判断它们的数字组成是否与给定的数字相同。

定义一个函数 $f(x)$，表示数字 $x$ 的数字组成。我们可以将数字 $x$ 转换为一个长度为 $10$ 的数组，或者一个按数字大小排序的字符串。

首先，我们计算给定数字 $n$ 的数字组成 $\text{target} = f(n)$。然后，我们枚举 $i$ 从 1 开始，每次将 $i$ 左移一位（相当于乘以 $2$），直到 $i$ 超过 $10^9$。对于每个 $i$，我们计算它的数字组成，并与 $\text{target}$ 进行比较。如果相同，则返回 $\text{true}$；如果枚举结束仍未找到相同的数字组成，则返回 $\text{false}$。

时间复杂度 $O(\log^2 M)$，空间复杂度 $O(\log M)$。其中 $M$ 是本题的输入范围上限 ${10}^9$。

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
// Reordered Power of 2：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func reorderedPowerOf2(n int) bool {
	target := f(n)
	for i := 1; i <= 1000000000; i <<= 1 {
		if bytes.Equal(target, f(i)) {
			return true
		}
	}
	return false
}

func f(x int) []byte {
	cnt := make([]byte, 10)
	for x > 0 {
		cnt[x%10]++
		x /= 10
	}
	return cnt
}
```

### Java

```java
// Reordered Power of 2：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean reorderedPowerOf2(int n) {
        String target = f(n);
        for (int i = 1; i <= 1000000000; i <<= 1) {
            if (target.equals(f(i))) {
                return true;
            }
        }
        return false;
    }

    private String f(int x) {
        char[] cnt = new char[10];
        for (; x > 0; x /= 10) {
            cnt[x % 10]++;
        }
        return new String(cnt);
    }
}
```

### Python

```python
# Reordered Power of 2：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def reorderedPowerOf2(self, n: int) -> bool:
        def f(x: int) -> List[int]:
            cnt = [0] * 10
            while x:
                x, v = divmod(x, 10)
                cnt[v] += 1
            return cnt

        target = f(n)
        i = 1
        while i <= 10**9:
            if f(i) == target:
                return True
            i <<= 1
        return False
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

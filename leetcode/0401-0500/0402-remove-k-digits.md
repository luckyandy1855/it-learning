# 0402. Remove K Digits

---
编号: 402
题目: Remove K Digits
难度: 中等
标签: [栈, 贪心, 字符串, 单调栈]
来源链接: https://leetcode.com/problems/remove-k-digits/
---

## 题目描述

给你一个以字符串表示的非负整数 `num` 和一个整数 `k` ，移除这个数中的 `k`* *位数字，使得剩下的数字最小。请你以字符串形式返回这个最小的数字。

**示例 1 ：**

```text
输入：num = "1432219", k = 3
输出："1219"
解释：移除掉三个数字 4, 3, 和 2 形成一个新的最小的数字 1219 。
```

**示例 2 ：**

```text
输入：num = "10200", k = 1
输出："200"
解释：移掉首位的 1 剩下的数字为 200. 注意输出不能有任何前导零。
```

**示例 3 ：**

```text
输入：num = "10", k = 2
输出："0"
解释：从原数字移除所有的数字，剩余为空就是 0 。
```

**提示：**

- `1 <= k <= num.length <= 10^5`

- `num` 仅由若干位数字（0 - 9）组成

- 除了 **0** 本身之外，`num` 不含任何前导零

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 贪心, 字符串, 单调栈」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

前置知识：两个相同位数的数字大小关系取决于第一个不同位的数的大小。

基本的思路如下：

- 从左到右遍历数组元素；
- 对于遍历到的当前元素，选择保留；
- 但可以选择性丢弃前面的相邻元素，丢弃与否取决于当前元素和前面相邻元素的大小；
- 根据前置知识可知当当前元素小于前面相邻元素时可以移除前面相邻的元素。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。

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
// Remove K Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeKdigits(num string, k int) string {
	stk, remain := make([]byte, 0), len(num)-k
	for i := 0; i < len(num); i++ {
		n := len(stk)
		for k > 0 && n > 0 && stk[n-1] > num[i] {
			stk = stk[:n-1]
			n, k = n-1, k-1
		}
		stk = append(stk, num[i])
	}

	for i := 0; i < len(stk) && i < remain; i++ {
		if stk[i] != '0' {
			return string(stk[i:remain])
		}
	}
	return "0"
}
```

### Java

```java
// Remove K Digits：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String removeKdigits(String num, int k) {
        StringBuilder stk = new StringBuilder();
        for (char c : num.toCharArray()) {
            while (k > 0 && stk.length() > 0 && stk.charAt(stk.length() - 1) > c) {
                stk.deleteCharAt(stk.length() - 1);
                --k;
            }
            stk.append(c);
        }
        for (; k > 0; --k) {
            stk.deleteCharAt(stk.length() - 1);
        }
        int i = 0;
        for (; i < stk.length() && stk.charAt(i) == '0'; ++i) {
        }
        String ans = stk.substring(i);
        return "".equals(ans) ? "0" : ans;
    }
}
```

### Python

```python
# Remove K Digits：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        stk = []
        remain = len(num) - k
        for c in num:
            while k and stk and stk[-1] > c:
                stk.pop()
                k -= 1
            stk.append(c)
        return ''.join(stk[:remain]).lstrip('0') or '0'
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

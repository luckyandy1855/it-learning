# 0906. Super Palindromes

---
编号: 906
题目: Super Palindromes
难度: 困难
标签: [数学, 字符串, 枚举]
来源链接: https://leetcode.com/problems/super-palindromes/
---

## 题目描述

如果一个正整数自身是回文数，而且它也是一个回文数的平方，那么我们称这个数为 **超级回文数** 。

现在，给你两个以字符串形式表示的正整数 left 和 right  ，统计并返回区间 `[left, right]` 中的 **超级回文数** 的数目。

示例 1：

```text
输入：left = "4", right = "1000"
输出：4
解释：4、9、121 和 484 都是超级回文数。
注意 676 不是超级回文数：26 * 26 = 676 ，但是 26 不是回文数。
```

示例 2：

```text
输入：left = "1", right = "2"
输出：1
```

提示：

- `1 <= left.length, right.length <= 18`

- `left` 和 `right` 仅由数字（0 - 9）组成。

- `left` 和 `right` 不含前导零。

- `left` 和 `right` 表示的整数在区间 `[1, 10^18 - 1]` 内。

- `left` 小于等于 `right` 。

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 字符串, 枚举」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

根据题目描述，我们假设超级回文数 $x = p^2 \in [1, 10^{18})$，其中 $p$ 是回文数，那么 $p \in [1, 10^9)$。我们可以枚举回文数 $p$ 的前半部分，然后将其翻转后拼接，得到所有的回文数，记录在数组 $ps$ 中。

接下来，我们遍历数组 $ps$，对于每个 $p$，我们计算 $p^2$，判断是否在区间 $[L, R]$ 中，同时判断 $p^2$ 是否是回文数，若是，答案加一。

遍历结束后，返回答案即可。

时间复杂度 $O(M^{\frac{1}{4}} \times \log M)$，空间复杂度 $O(M^{\frac{1}{4}})$。其中 $M$ 是 $L$ 和 $R$ 的上界，本题中 $M \leq 10^{18}$。

相似题目：

- [2967. 使数组成为等数数组的最小代价](https://github.com/doocs/leetcode/blob/main/solution/2900-2999/2967.Minimum%20Cost%20to%20Make%20Array%20Equalindromic/README.md)

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
// Super Palindromes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
var ps [2 * 100000]int64

func init() {
	for i := 1; i <= 100000; i++ {
		s := strconv.Itoa(i)
		t1 := reverseString(s)
		t2 := reverseString(s[:len(s)-1])
		ps[2*i-2], _ = strconv.ParseInt(s+t1, 10, 64)
		ps[2*i-1], _ = strconv.ParseInt(s+t2, 10, 64)
	}
}

func reverseString(s string) string {
	cs := []rune(s)
	for i, j := 0, len(cs)-1; i < j; i, j = i+1, j-1 {
		cs[i], cs[j] = cs[j], cs[i]
	}
	return string(cs)
}

func superpalindromesInRange(left string, right string) (ans int) {
	l, _ := strconv.ParseInt(left, 10, 64)
	r, _ := strconv.ParseInt(right, 10, 64)
	isPalindrome := func(x int64) bool {
		var y int64
		for t := x; t > 0; t /= 10 {
			y = y*10 + int64(t%10)
		}
		return x == y
	}
	for _, p := range ps {
		x := p * p
		if x >= l && x <= r && isPalindrome(x) {
			ans++
		}
	}
	return
}
```

### Java

```java
// Super Palindromes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private static long[] ps;

    static {
        ps = new long[2 * (int) 1e5];
        for (int i = 1; i <= 1e5; i++) {
            String s = Integer.toString(i);
            String t1 = new StringBuilder(s).reverse().toString();
            String t2 = new StringBuilder(s.substring(0, s.length() - 1)).reverse().toString();
            ps[2 * i - 2] = Long.parseLong(s + t1);
            ps[2 * i - 1] = Long.parseLong(s + t2);
        }
    }

    public int superpalindromesInRange(String left, String right) {
        long l = Long.parseLong(left);
        long r = Long.parseLong(right);
        int ans = 0;
        for (long p : ps) {
            long x = p * p;
            if (x >= l && x <= r && isPalindrome(x)) {
                ++ans;
            }
        }
        return ans;
    }

    private boolean isPalindrome(long x) {
        long y = 0;
        for (long t = x; t > 0; t /= 10) {
            y = y * 10 + t % 10;
        }
        return x == y;
    }
}
```

### Python

```python
# Super Palindromes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
ps = []
for i in range(1, 10**5 + 1):
    s = str(i)
    t1 = s[::-1]
    t2 = s[:-1][::-1]
    ps.append(int(s + t1))
    ps.append(int(s + t2))


class Solution:
    def superpalindromesInRange(self, left: str, right: str) -> int:
        def is_palindrome(x: int) -> bool:
            y, t = 0, x
            while t:
                y = y * 10 + t % 10
                t //= 10
            return x == y

        l, r = int(left), int(right)
        return sum(l <= x <= r and is_palindrome(x) for x in map(lambda x: x * x, ps))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

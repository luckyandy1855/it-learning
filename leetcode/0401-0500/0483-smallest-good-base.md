# 0483. Smallest Good Base

---
编号: 483
题目: Smallest Good Base
难度: 困难
标签: [数学, 二分查找]
来源链接: https://leetcode.com/problems/smallest-good-base/
---

## 题目描述

以字符串的形式给出 `n` , 以字符串的形式返回* `n` 的最小 **好进制** * 。

如果 `n` 的  `k(k>=2)` 进制数的所有数位全为1，则称 `k(k>=2)` 是 `n` 的一个 **好进制 **。

**示例 1：**

```text
输入：n = "13"
输出："3"
解释：13 的 3 进制是 111。
```

**示例 2：**

```text
输入：n = "4681"
输出："8"
解释：4681 的 8 进制是 11111。
```

**示例 3：**

```text
输入：n = "1000000000000000000"
输出："999999999999999999"
解释：1000000000000000000 的 999999999999999999 进制是 11。
```

**提示：**

- `n` 的取值范围是 `[3, 10^18]`

- `n` 没有前导 0

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数学, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

假设 $n$ 在 $k$ 进制下的所有位数均为 $1$，且位数为 $m+1$，那么有式子 ①：


n=k^0+k^1+k^2+...+k^m


当 $m=0$ 时，上式 $n=1$，而题目 $n$ 取值范围为 $[3, 10^{18}]$，因此 $m>0$。

当 $m=1$ 时，上式 $n=k^0+k^1=1+k$，即 $k=n-1>=2$。

我们来证明一般情况下的两个结论，以帮助解决本题。

**结论一：** $m<\log _{k} n$

注意到式子 ① 是个首项为 $1$，且公比为 $k$ 的等比数列。利用等比数列求和公式，我们可以得出：


n=\frac{1-k^{m+1}}{1-k}


变形得：


k^{m+1}=k \times n-n+1 < k \times n


移项得：


m<\log _{k} n


题目 $n$ 取值范围为 $[3, 10^{18}]$，又因为 $k>=2$，因此 $m<\log _{k} n<\log _{2} 10^{18}<60$。

**结论二：** $k=\left \lfloor \sqrt[m]{n} \right \rfloor $


n=k^0+k^1+k^2+...+k^m>k^m


根据二项式定理：


(a+b)^{n}=\sum_{k=0}^{n}\left(\begin{array}{l}
n \\
k
\end{array}\right) a^{n-k} b^{k}


整合，可得：


(k+1)^{m}=\left(\begin{array}{c}
m \\
0
\end{array}\right) k^{0}+\left(\begin{array}{c}
m \\
1
\end{array}\right) k^{1}+\left(\begin{array}{c}
m \\
2
\end{array}\right) k^{2}+\cdots+\left(\begin{array}{c}
m \\
m
\end{array}\right) k^{m}


当 $m>1$ 时，满足：


\forall i \in[1, m-1],\left(\begin{array}{c}
m \\
i
\end{array}\right)>1


所以有：


\begin{aligned}
(k+1)^{m} &=\left(\begin{array}{c}
m \\
0
\end{array}\right) k^{0}+\left(\begin{array}{c}
m \\
1
\end{array}\right) k^{1}+\left(\begin{array}{c}
m \\
2
\end{array}\right) k^{2}+\cdots+\left(\begin{array}{c}
m \\
m
\end{array}\right) k^{m} \\
&>k^{0}+k^{1}+k^{2}+\cdots+k^{m}=n
\end{aligned}


即：


k < \sqrt[m]{n} < k+1


由于 $k$ 是整数，因此 $k=\left \lfloor \sqrt[m]{n} \right \rfloor $。

综上，依据结论一，我们知道 $m$ 的取值范围为 $[1,log_{k}n)$，且 $m=1$ 时必然有解。随着 $m$ 的增大，进制 $k$ 不断减小。所以我们只需要从大到小检查每一个 $m$ 可能的取值，利用结论二快速算出对应的 $k$ 值，然后校验计算出的 $k$ 值是否有效即可。如果 $k$ 值有效，我们即可返回结果。

时间复杂度 $O(log^{2}n)$。

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

### Java

```java
// Smallest Good Base：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String smallestGoodBase(String n) {
        long num = Long.parseLong(n);
        for (int len = 63; len >= 2; --len) {
            long radix = getRadix(len, num);
            if (radix != -1) {
                return String.valueOf(radix);
            }
        }
        return String.valueOf(num - 1);
    }

    private long getRadix(int len, long num) {
        long l = 2, r = num - 1;
        while (l < r) {
            long mid = l + r >>> 1;
            if (calc(mid, len) >= num)
                r = mid;
            else
                l = mid + 1;
        }
        return calc(r, len) == num ? r : -1;
    }

    private long calc(long radix, int len) {
        long p = 1;
        long sum = 0;
        for (int i = 0; i < len; ++i) {
            if (Long.MAX_VALUE - sum < p) {
                return Long.MAX_VALUE;
            }
            sum += p;
            if (Long.MAX_VALUE / p < radix) {
                p = Long.MAX_VALUE;
            } else {
                p *= radix;
            }
        }
        return sum;
    }
}
```

### Python

```python
# Smallest Good Base：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def smallestGoodBase(self, n: str) -> str:
        def cal(k, m):
            p = s = 1
            for i in range(m):
                p *= k
                s += p
            return s

        num = int(n)
        for m in range(63, 1, -1):
            l, r = 2, num - 1
            while l < r:
                mid = (l + r) >> 1
                if cal(mid, m) >= num:
                    r = mid
                else:
                    l = mid + 1
            if cal(l, m) == num:
                return str(l)
        return str(num - 1)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

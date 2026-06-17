# 0842. Split Array into Fibonacci Sequence

---
编号: 842
题目: Split Array into Fibonacci Sequence
难度: 中等
标签: [字符串, 回溯]
来源链接: https://leetcode.com/problems/split-array-into-fibonacci-sequence/
---

## 题目描述

给定一个数字字符串 `num`，比如 `"123456579"`，我们可以将它分成「斐波那契式」的序列 `[123, 456, 579]`。

形式上，**斐波那契式 **序列是一个非负整数列表 `f`，且满足：

- `0 = 3`

- 对于所有的`0 <= i < f.length - 2`，都有 `f[i] + f[i + 1] = f[i + 2]`

另外，请注意，将字符串拆分成小块时，每个块的数字一定不要以零开头，除非这个块是数字 `0` 本身。

返回从 `num` 拆分出来的任意一组斐波那契式的序列块，如果不能拆分则返回 `[]`。

**示例 1：**

```text
输入：num = "1101111"
输出：[11,0,11,11]
解释：输出 [110,1,111] 也可以。
```

**示例 2：**

```text
输入: num = "112358130"
输出: []
解释: 无法拆分。
```

**示例 3：**

```text
输入："0123"
输出：[]
解释：每个块的数字不能以零开头，因此 "01"，"2"，"3" 不是有效答案。
```

**提示：**

- `1 <= num.length <= 200`

- `num` 中只含有数字

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 回溯」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们设计一个函数 $dfs(i)$，表示从字符串 $num$ 的第 $i$ 个字符开始拆分，拆分出的斐波那契式序列是否满足题目要求。如果满足，我们就返回 $true$，否则返回 $false$。

函数 $dfs(i)$ 的具体实现如下：

如果 $i$ 等于字符串 $num$ 的长度，说明我们已经拆分完整个字符串，此时我们只需要判断拆分出的序列的长度是否大于 $2$ 即可。如果大于 $2$，说明我们找到了一组满足题目要求的斐波那契式序列，返回 $true$；否则返回 $false$。

如果 $i$ 小于字符串 $num$ 的长度，我们需要枚举拆分出的第一个数 $x$，如果 $x$ 的长度大于 $1$，且以 $0$ 开头，说明 $x$ 不是一个合法的数，我们直接返回 $false$。否则我们将 $x$ 转换成十进制数，如果 $x$ 大于 $2^{31} - 1$，或者 $x$ 大于 $ans$ 的最后两个数之和，直接返回 $false$。如果 $ans$ 的长度小于 $2$，或者 $x$ 等于 $ans$ 的最后两个数之和，我们将 $x$ 加入到 $ans$ 中，然后继续拆分字符串 $num$ 的后面的部分，如果返回 $true$，说明我们找到了一组满足题目要求的斐波那契式序列，返回 $true$；否则我们将 $x$ 从 $ans$ 中移除，然后继续枚举拆分出的第一个数 $x$。

时间复杂度 $O(n \times \log^2 M)$，空间复杂度 $O(n)$。其中 $n$ 和 $M$ 分别是字符串 $num$ 的长度和整型数的最大值。

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
// Split Array into Fibonacci Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func splitIntoFibonacci(num string) []int {
	n := len(num)
	ans := []int{}
	var dfs func(int) bool
	dfs = func(i int) bool {
		if i == n {
			return len(ans) > 2
		}
		x := 0
		for j := i; j < n; j++ {
			if j > i && num[i] == '0' {
				break
			}
			x = x*10 + int(num[j]-'0')
			if x > math.MaxInt32 || (len(ans) > 1 && x > ans[len(ans)-1]+ans[len(ans)-2]) {
				break
			}
			if len(ans) < 2 || x == ans[len(ans)-1]+ans[len(ans)-2] {
				ans = append(ans, x)
				if dfs(j + 1) {
					return true
				}
				ans = ans[:len(ans)-1]
			}
		}
		return false
	}
	dfs(0)
	return ans
}
```

### Java

```java
// Split Array into Fibonacci Sequence：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    private List<Integer> ans = new ArrayList<>();
    private String num;

    public List<Integer> splitIntoFibonacci(String num) {
        this.num = num;
        dfs(0);
        return ans;
    }

    private boolean dfs(int i) {
        if (i == num.length()) {
            return ans.size() >= 3;
        }
        long x = 0;
        for (int j = i; j < num.length(); ++j) {
            if (j > i && num.charAt(i) == '0') {
                break;
            }
            x = x * 10 + num.charAt(j) - '0';
            if (x > Integer.MAX_VALUE
                || (ans.size() >= 2 && x > ans.get(ans.size() - 1) + ans.get(ans.size() - 2))) {
                break;
            }
            if (ans.size() < 2 || x == ans.get(ans.size() - 1) + ans.get(ans.size() - 2)) {
                ans.add((int) x);
                if (dfs(j + 1)) {
                    return true;
                }
                ans.remove(ans.size() - 1);
            }
        }
        return false;
    }
}
```

### Python

```python
# Split Array into Fibonacci Sequence：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def splitIntoFibonacci(self, num: str) -> List[int]:
        def dfs(i):
            if i == n:
                return len(ans) > 2
            x = 0
            for j in range(i, n):
                if j > i and num[i] == '0':
                    break
                x = x * 10 + int(num[j])
                if x > 2**31 - 1 or (len(ans) > 2 and x > ans[-2] + ans[-1]):
                    break
                if len(ans) < 2 or ans[-2] + ans[-1] == x:
                    ans.append(x)
                    if dfs(j + 1):
                        return True
                    ans.pop()
            return False

        n = len(num)
        ans = []
        dfs(0)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

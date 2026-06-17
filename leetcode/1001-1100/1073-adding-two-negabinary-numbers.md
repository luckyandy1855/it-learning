# 1073. Adding Two Negabinary Numbers

---
编号: 1073
题目: Adding Two Negabinary Numbers
难度: 中等
标签: [数组, 数学]
来源链接: https://leetcode.com/problems/adding-two-negabinary-numbers/
---

## 题目描述

给出基数为 **-2** 的两个数 `arr1` 和 `arr2`，返回两数相加的结果。

数字以 *数组形式*** **给出：数组由若干 0 和 1 组成，按最高有效位到最低有效位的顺序排列。例如，`arr = [1,1,0,1]` 表示数字 `(-2)^3 + (-2)^2 + (-2)^0 = -3`。*数组形式* 中的数字 `arr` 也同样不含前导零：即 `arr == [0]` 或 `arr[0] == 1`。

返回相同表示形式的 `arr1` 和 `arr2` 相加的结果。两数的表示形式为：不含前导零、由若干 0 和 1 组成的数组。

**示例 1：**

```text
输入：arr1 = [1,1,1,1,1], arr2 = [1,0,1]
输出：[1,0,0,0,0]
解释：arr1 表示 11，arr2 表示 5，输出表示 16 。
```

**示例 2：**

```text
输入：arr1 = [0], arr2 = [0]
输出：[0]
```

**示例 3：**

```text
输入：arr1 = [0], arr2 = [1]
输出：[1]
```

**提示：**

- `1 <= arr1.length, arr2.length <= 1000`

- `arr1[i]` 和 `arr2[i]` 都是 `0` 或 `1`

- `arr1` 和 `arr2` 都没有前导0

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 数学」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们遍历两个数组，从最低位开始，记两个数组当前位的数字为 $a$ 和 $b$，进位为 $c$，三个数相加的结果为 $x$。

- 先将进位 $c$ 置为 $0$。
- 如果 $x \geq 2$，由于 $(-2)^{i} + (-2)^{i} = -(-2)^{i+1}$，所以我们可以将 $x$ 减去 $2$，并向高位进位 $-1$。
- 如果 $x = -1$，由于 $-(-2)^{i} = (-2)^{i} + (-2)^{i+1}$，所以我们可以将 $x$ 置为 $1$，并向高位进位 $1$。

然后，我们将 $x$ 加入到答案数组中，然后继续处理下一位。

遍历结束后，去除答案数组中末尾的 $0$，并将数组反转，即可得到最终的答案。

时间复杂度 $O(\max(n, m))$，其中 $n$ 和 $m$ 分别是两个数组的长度。忽略答案的空间消耗，空间复杂度 $O(1)$。

相似题目：

- [1017. 负二进制转换](https://github.com/doocs/leetcode/blob/main/solution/1000-1099/1017.Convert%20to%20Base%20-2/README.md)

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
// Adding Two Negabinary Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func addNegabinary(arr1 []int, arr2 []int) (ans []int) {
	i, j := len(arr1)-1, len(arr2)-1
	for c := 0; i >= 0 || j >= 0 || c != 0; i, j = i-1, j-1 {
		x := c
		if i >= 0 {
			x += arr1[i]
		}
		if j >= 0 {
			x += arr2[j]
		}
		c = 0
		if x >= 2 {
			x -= 2
			c -= 1
		} else if x == -1 {
			x = 1
			c += 1
		}
		ans = append(ans, x)
	}
	for len(ans) > 1 && ans[len(ans)-1] == 0 {
		ans = ans[:len(ans)-1]
	}
	for i, j = 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
	return ans
}
```

### Java

```java
// Adding Two Negabinary Numbers：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int[] addNegabinary(int[] arr1, int[] arr2) {
        int i = arr1.length - 1, j = arr2.length - 1;
        List<Integer> ans = new ArrayList<>();
        for (int c = 0; i >= 0 || j >= 0 || c != 0; --i, --j) {
            int a = i < 0 ? 0 : arr1[i];
            int b = j < 0 ? 0 : arr2[j];
            int x = a + b + c;
            c = 0;
            if (x >= 2) {
                x -= 2;
                c -= 1;
            } else if (x == -1) {
                x = 1;
                c += 1;
            }
            ans.add(x);
        }
        while (ans.size() > 1 && ans.get(ans.size() - 1) == 0) {
            ans.remove(ans.size() - 1);
        }
        Collections.reverse(ans);
        return ans.stream().mapToInt(x -> x).toArray();
    }
}
```

### Python

```python
# Adding Two Negabinary Numbers：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def addNegabinary(self, arr1: List[int], arr2: List[int]) -> List[int]:
        i, j = len(arr1) - 1, len(arr2) - 1
        c = 0
        ans = []
        while i >= 0 or j >= 0 or c:
            a = 0 if i < 0 else arr1[i]
            b = 0 if j < 0 else arr2[j]
            x = a + b + c
            c = 0
            if x >= 2:
                x -= 2
                c -= 1
            elif x == -1:
                x = 1
                c += 1
            ans.append(x)
            i, j = i - 1, j - 1
        while len(ans) > 1 and ans[-1] == 0:
            ans.pop()
        return ans[::-1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

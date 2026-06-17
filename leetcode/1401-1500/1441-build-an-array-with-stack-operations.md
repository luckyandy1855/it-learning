# 1441. Build an Array With Stack Operations

---
编号: 1441
题目: Build an Array With Stack Operations
难度: 中等
标签: [栈, 数组, 模拟]
来源链接: https://leetcode.com/problems/build-an-array-with-stack-operations/
---

## 题目描述

给你一个数组 `target` 和一个整数 `n`。

给你一个空栈和两种操作：

- `"Push"`：将一个整数加到栈顶。

- `"Pop"`：从栈顶删除一个整数。

同时给定一个范围 `[1, n]` 中的整数流。

使用两个栈操作使栈中的数字（从底部到顶部）等于 `target`。你应该遵循以下规则：

- 如果整数流不为空，从流中选取下一个整数并将其推送到栈顶。

- 如果栈不为空，弹出栈顶的整数。

- 如果，在任何时刻，栈中的元素（从底部到顶部）等于 `target`，则不要从流中读取新的整数，也不要对栈进行更多操作。

请返回遵循上述规则构建 `target` 所用的操作序列。如果存在多个合法答案，返回 **任一** 即可。

**示例 1：**

```text
输入：target = [1,3], n = 3
输出：["Push","Push","Pop","Push"]
解释：一开始栈为空。最后一个元素是栈顶。
从流中读取 1 并推入数组。s = [1]。
从流中读取 2 并推入数组。s = [1,2]。
从栈顶删除整数。s = [1]。
从流中读取 3 并推入数组。s = [1,3]。
```

**示例 2：**

```text
输入：target = [1,2,3], n = 3
输出：["Push","Push","Push"]
解释：一开始栈为空。最后一个元素是栈顶。
从流中读取 1 并推入数组。s = [1]。
从流中读取 2 并推入数组。s = [1,2]。
从流中读取 3 并推入数组。s = [1,2,3]。
```

**示例 3：**

```text
输入：target = [1,2], n = 4
输出：["Push","Push"]
解释：一开始栈为空。最后一个元素是栈顶。
从流中读取 1 并推入数组。s = [1]。
从流中读取 2 并推入数组。s = [1,2]。
由于栈（从底部到顶部）等于 target，我们停止栈操作。
从流中读取整数 3 的答案不被接受。
```

**提示：**

- `1 <= target.length <= 100`

- `1 <= n <= 100`

- `1 <= target[i] <= n`

- `target` 严格递增

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 数组, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们定义一个变量 $\textit{cur}$ 表示当前待读取的数字，初始时 $\textit{cur} = 1$，用一个数组 $\textit{ans}$ 存储答案。

接下来，我们遍历数组 $\textit{target}$ 中的每个数字 $x$：

- 如果 $\textit{cur} < x$，我们将 $\textit{Push}$ 和 $\textit{Pop}$ 依次加入答案，直到 $\textit{cur} = x$；
- 然后我们将 $\textit{Push}$ 加入答案，表示读取数字 $x$；
- 接着，我们将 $\textit{cur}$ 加一，继续处理下一个数字。

遍历结束后，返回答案数组即可。

时间复杂度 $O(n)$，其中 $n$ 是数组 $\textit{target}$ 的长度。忽略答案数组的空间消耗，空间复杂度 $O(1)$。

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
// Build an Array With Stack Operations：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func buildArray(target []int, n int) (ans []string) {
	cur := 1
	for _, x := range target {
		for ; cur < x; cur++ {
			ans = append(ans, "Push", "Pop")
		}
		ans = append(ans, "Push")
		cur++
	}
	return
}
```

### Java

```java
// Build an Array With Stack Operations：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> buildArray(int[] target, int n) {
        List<String> ans = new ArrayList<>();
        int cur = 1;
        for (int x : target) {
            while (cur < x) {
                ans.addAll(List.of("Push", "Pop"));
                ++cur;
            }
            ans.add("Push");
            ++cur;
        }
        return ans;
    }
}
```

### Python

```python
# Build an Array With Stack Operations：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def buildArray(self, target: List[int], n: int) -> List[str]:
        ans = []
        cur = 1
        for x in target:
            while cur < x:
                ans.extend(["Push", "Pop"])
                cur += 1
            ans.append("Push")
            cur += 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

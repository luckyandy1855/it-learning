# 1104. Path In Zigzag Labelled Binary Tree

---
编号: 1104
题目: Path In Zigzag Labelled Binary Tree
难度: 中等
标签: [树, 数学, 二叉树]
来源链接: https://leetcode.com/problems/path-in-zigzag-labelled-binary-tree/
---

## 题目描述

在一棵无限的二叉树上，每个节点都有两个子节点，树中的节点 **逐行** 依次按 &ldquo;之&rdquo; 字形进行标记。

如下图所示，在奇数行（即，第一行、第三行、第五行&hellip;&hellip;）中，按从左到右的顺序进行标记；

而偶数行（即，第二行、第四行、第六行&hellip;&hellip;）中，按从右到左的顺序进行标记。

给你树上某一个节点的标号 `label`，请你返回从根节点到该标号为 `label` 节点的路径，该路径是由途经的节点标号所组成的。

**示例 1：**

```text
输入：label = 14
输出：[1,3,4,14]
```

**示例 2：**

```text
输入：label = 26
输出：[1,2,6,10,26]
```

**提示：**

- `1 <= label <= 10^6`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树, 数学, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

对于一棵完全二叉树，第 $i$ 行的节点个数为 $2^{i-1}$，第 $i$ 行的节点编号范围为 $[2^{i-1}, 2^i - 1]$。而题目中对于奇数行，按从左到右的顺序进行标记，对于偶数行，按从右到左的顺序进行标记。所以对于第 $i$ 行的节点 $label$，它的互补节点编号为 $2^{i-1} + 2^i - 1 - label$。所以节点 $label$ 的实际父节点编号为 $(2^{i-1} + 2^i - 1 - label) / 2$。我们可以通过不断地求互补节点编号和父节点编号，直到到达根节点，即可得到从根节点到节点 $label$ 的路径。

最后，我们需要将路径反转，因为题目要求路径是从根节点到节点 $label$ 的路径。

时间复杂度 $O(\log n)$，其中 $n$ 为节点 $label$ 的编号。忽略答案的空间消耗，空间复杂度 $O(1)$。

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
// Path In Zigzag Labelled Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func pathInZigZagTree(label int) (ans []int) {
	x, i := 1, 1
	for x<<1 <= label {
		x <<= 1
		i++
	}
	for ; i > 0; i-- {
		ans = append(ans, label)
		label = ((1 << (i - 1)) + (1 << i) - 1 - label) >> 1
	}
	for i, j := 0, len(ans)-1; i < j; i, j = i+1, j-1 {
		ans[i], ans[j] = ans[j], ans[i]
	}
	return
}
```

### Java

```java
// Path In Zigzag Labelled Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<Integer> pathInZigZagTree(int label) {
        int x = 1, i = 1;
        while ((x << 1) <= label) {
            x <<= 1;
            ++i;
        }
        List<Integer> ans = new ArrayList<>();
        for (; i > 0; --i) {
            ans.add(label);
            label = ((1 << (i - 1)) + (1 << i) - 1 - label) >> 1;
        }
        Collections.reverse(ans);
        return ans;
    }
}
```

### Python

```python
# Path In Zigzag Labelled Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def pathInZigZagTree(self, label: int) -> List[int]:
        x = i = 1
        while (x << 1) <= label:
            x <<= 1
            i += 1
        ans = [0] * i
        while i:
            ans[i - 1] = label
            label = ((1 << (i - 1)) + (1 << i) - 1 - label) >> 1
            i -= 1
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

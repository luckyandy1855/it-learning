# 0331. Verify Preorder Serialization of a Binary Tree

---
编号: 331
题目: Verify Preorder Serialization of a Binary Tree
难度: 中等
标签: [栈, 树, 字符串, 二叉树]
来源链接: https://leetcode.com/problems/verify-preorder-serialization-of-a-binary-tree/
---

## 题目描述

序列化二叉树的一种方法是使用 **前序遍历 **。当我们遇到一个非空节点时，我们可以记录下这个节点的值。如果它是一个空节点，我们可以使用一个标记值记录，例如 `#`。

例如，上面的二叉树可以被序列化为字符串 `"9,3,4,#,#,1,#,#,2,#,6,#,#"`，其中 `#` 代表一个空节点。

给定一串以逗号分隔的序列，验证它是否是正确的二叉树的前序序列化。编写一个在不重构树的条件下的可行算法。

**保证** 每个以逗号分隔的字符或为一个整数或为一个表示 `null` 指针的 `'#'` 。

你可以认为输入格式总是有效的

	- 例如它永远不会包含两个连续的逗号，比如 `"1,,3"` 。

**注意：**不允许重建树。

**示例 1:**

```text
输入: preorder = "9,3,4,#,#,1,#,#,2,#,6,#,#"
输出: true
```

**示例 2:**

```text
输入: preorder = "1,#"
输出: false
```

**示例 3:**

```text
输入: preorder = "9,#,#,1"
输出: false
```

**提示:**

	- `1 <= preorder.length <= 10^4`

	- `preorder` 由以逗号 `“，”` 分隔的 `[0,100]` 范围内的整数和 `“#”` 组成

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「栈, 树, 字符串, 二叉树」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们将字符串 `preorder` 按逗号分割成数组，然后遍历数组，如果遇到了连续两个 `'#'`，并且第三个元素不是 `'#'`，那么就将这三个元素替换成一个 `'#'`，这个过程一直持续到数组遍历结束。

最后，判断数组长度是否为 $1$，且数组唯一的元素是否为 `'#'` 即可。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 `preorder` 的长度。

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
// Verify Preorder Serialization of a Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func isValidSerialization(preorder string) bool {
	stk := []string{}
	for _, s := range strings.Split(preorder, ",") {
		stk = append(stk, s)
		for len(stk) >= 3 && stk[len(stk)-1] == "#" && stk[len(stk)-2] == "#" && stk[len(stk)-3] != "#" {
			stk = stk[:len(stk)-3]
			stk = append(stk, "#")
		}
	}
	return len(stk) == 1 && stk[0] == "#"
}
```

### Java

```java
// Verify Preorder Serialization of a Binary Tree：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isValidSerialization(String preorder) {
        List<String> stk = new ArrayList<>();
        for (String s : preorder.split(",")) {
            stk.add(s);
            while (stk.size() >= 3 && stk.get(stk.size() - 1).equals("#")
                && stk.get(stk.size() - 2).equals("#") && !stk.get(stk.size() - 3).equals("#")) {
                stk.remove(stk.size() - 1);
                stk.remove(stk.size() - 1);
                stk.remove(stk.size() - 1);
                stk.add("#");
            }
        }
        return stk.size() == 1 && stk.get(0).equals("#");
    }
}
```

### Python

```python
# Verify Preorder Serialization of a Binary Tree：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isValidSerialization(self, preorder: str) -> bool:
        stk = []
        for c in preorder.split(","):
            stk.append(c)
            while len(stk) > 2 and stk[-1] == stk[-2] == "#" and stk[-3] != "#":
                stk = stk[:-3]
                stk.append("#")
        return len(stk) == 1 and stk[0] == "#"
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 1233. Remove Sub-Folders from the Filesystem

---
编号: 1233
题目: Remove Sub-Folders from the Filesystem
难度: 中等
标签: [深度优先搜索, 字典树, 数组, 字符串]
来源链接: https://leetcode.com/problems/remove-sub-folders-from-the-filesystem/
---

## 题目描述

你是一位系统管理员，手里有一份文件夹列表 `folder`，你的任务是要删除该列表中的所有 **子文件夹**，并以 **任意顺序** 返回剩下的文件夹。

如果文件夹 `folder[i]` 位于另一个文件夹 `folder[j]` 下，那么 `folder[i]` 就是 `folder[j]` 的 **子文件夹** 。`folder[j]` 的子文件夹必须以 `folder[j]` 开头，后跟一个 `"/"`。例如，`"/a/b"` 是 `"/a"` 的一个子文件夹，但 `"/b"` 不是 `"/a/b/c"` 的一个子文件夹。

文件夹的「路径」是由一个或多个按以下格式串联形成的字符串：'/' 后跟一个或者多个小写英文字母。

- 例如，`"/leetcode"` 和 `"/leetcode/problems"` 都是有效的路径，而空字符串和 `"/"` 不是。

**示例 1：**

```text
输入：folder = ["/a","/a/b","/c/d","/c/d/e","/c/f"]
输出：["/a","/c/d","/c/f"]
解释："/a/b" 是 "/a" 的子文件夹，而 "/c/d/e" 是 "/c/d" 的子文件夹。
```

**示例 2：**

```text
输入：folder = ["/a","/a/b/c","/a/b/d"]
输出：["/a"]
解释：文件夹 "/a/b/c" 和 "/a/b/d" 都会被删除，因为它们都是 "/a" 的子文件夹。
```

**示例 3：**

```text
输入: folder = ["/a/b/c","/a/b/ca","/a/b/d"]
输出: ["/a/b/c","/a/b/ca","/a/b/d"]
```

**提示：**

- `1 <= folder.length <= 4 * 10^4`

- `2 <= folder[i].length <= 100`

- `folder[i]` 只包含小写字母和 `'/'`

- `folder[i]` 总是以字符 `'/'` 起始

- `folder` 每个元素都是 **唯一** 的

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「深度优先搜索, 字典树, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们先将数组 `folder` 按照字典序排序，然后遍历数组，对于当前遍历到的文件夹 $f$，如果它的长度大于等于答案数组中最后一个文件夹的长度，并且它的前缀包含答案数组的最后一个文件夹再加上一个 `/`，则说明 $f$ 是答案数组中最后一个文件夹的子文件夹，我们不需要将其加入答案数组中。否则，我们将 $f$ 加入答案数组中。

遍历结束后，答案数组中的文件夹即为题目要求的答案。

时间复杂度 $O(n \times \log n \times m)$，空间复杂度 $O(m)$。其中 $n$ 和 $m$ 分别为数组 `folder` 的长度和数组 `folder` 中字符串的最大长度。

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
// Remove Sub-Folders from the Filesystem：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func removeSubfolders(folder []string) []string {
	sort.Strings(folder)
	ans := []string{folder[0]}
	for _, f := range folder[1:] {
		m, n := len(ans[len(ans)-1]), len(f)
		if m >= n || !(ans[len(ans)-1] == f[:m] && f[m] == '/') {
			ans = append(ans, f)
		}
	}
	return ans
}
```

### Java

```java
// Remove Sub-Folders from the Filesystem：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<String> removeSubfolders(String[] folder) {
        Arrays.sort(folder);
        List<String> ans = new ArrayList<>();
        ans.add(folder[0]);
        for (int i = 1; i < folder.length; ++i) {
            int m = ans.get(ans.size() - 1).length();
            int n = folder[i].length();
            if (m >= n
                || !(ans.get(ans.size() - 1).equals(folder[i].substring(0, m))
                    && folder[i].charAt(m) == '/')) {
                ans.add(folder[i]);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Remove Sub-Folders from the Filesystem：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def removeSubfolders(self, folder: List[str]) -> List[str]:
        folder.sort()
        ans = [folder[0]]
        for f in folder[1:]:
            m, n = len(ans[-1]), len(f)
            if m >= n or not (ans[-1] == f[:m] and f[m] == '/'):
                ans.append(f)
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# 0609. Find Duplicate File in System

---
编号: 609
题目: Find Duplicate File in System
难度: 中等
标签: [数组, 哈希表, 字符串]
来源链接: https://leetcode.com/problems/find-duplicate-file-in-system/
---

## 题目描述

给你一个目录信息列表 `paths` ，包括目录路径，以及该目录中的所有文件及其内容，请你按路径返回文件系统中的所有重复文件。答案可按 **任意顺序** 返回。

一组重复的文件至少包括 **两个 **具有完全相同内容的文件。

**输入 **列表中的单个目录信息字符串的格式如下：

- `"root/d1/d2/.../dm f1.txt(f1_content) f2.txt(f2_content) ... fn.txt(fn_content)"`

这意味着，在目录 `root/d1/d2/.../dm` 下，有 `n` 个文件 ( `f1.txt`, `f2.txt` ... `fn.txt` ) 的内容分别是 ( `f1_content`, `f2_content` ... `fn_content` ) 。注意：`n >= 1` 且 `m >= 0` 。如果 `m = 0` ，则表示该目录是根目录。

**输出 **是由 **重复文件路径组** 构成的列表。其中每个组由所有具有相同内容文件的文件路径组成。文件路径是具有下列格式的字符串：

- `"directory_path/file_name.txt"`

**示例 1：**

```text
输入：paths = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)","root 4.txt(efgh)"]
输出：[["root/a/2.txt","root/c/d/4.txt","root/4.txt"],["root/a/1.txt","root/c/3.txt"]]
```

**示例 2：**

```text
输入：paths = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)"]
输出：[["root/a/2.txt","root/c/d/4.txt"],["root/a/1.txt","root/c/3.txt"]]
```

**提示：**

- `1 <= paths.length <= 2 * 10^4`

- `1 <= paths[i].length <= 3000`

- `1 <= sum(paths[i].length) <= 5 * 10^5`

- `paths[i]` 由英文字母、数字、字符 `'/'`、`'.'`、`'('`、`')'` 和 `' '` 组成

- 你可以假设在同一目录中没有任何文件或目录共享相同的名称。

- 你可以假设每个给定的目录信息代表一个唯一的目录。目录路径和文件信息用单个空格分隔。

**进阶：**

- 假设您有一个真正的文件系统，您将如何搜索文件？广度搜索还是宽度搜索？

- 如果文件内容非常大（GB级别），您将如何修改您的解决方案？

- 如果每次只能读取 1 kb 的文件，您将如何修改解决方案？

- 修改后的解决方案的时间复杂度是多少？其中最耗时的部分和消耗内存的部分是什么？如何优化？

- 如何确保您发现的重复文件不是误报？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 哈希表, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们创建一个哈希表 $d$，其中键是文件内容，值是具有相同内容的文件路径列表。

接下来，我们遍历 $\textit{paths}$，对于每个路径，我们将其分割成目录路径和文件信息。对于每个文件信息，我们提取出文件名和文件内容，并将文件路径添加到哈希表 $d$ 中对应文件内容的列表中。

最后，我们返回哈希表 $d$ 中所有具有多个文件路径的值。

时间复杂度为 $O(n)$，空间复杂度为 $O(n)$，其中 $n$ 是 $\textit{paths}$ 的长度。

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
// Find Duplicate File in System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func findDuplicate(paths []string) [][]string {
	d := map[string][]string{}
	for _, p := range paths {
		ps := strings.Split(p, " ")
		for i := 1; i < len(ps); i++ {
			j := strings.IndexByte(ps[i], '(')
			content := ps[i][j+1 : len(ps[i])-1]
			name := ps[0] + "/" + ps[i][:j]
			d[content] = append(d[content], name)
		}
	}
	ans := [][]string{}
	for _, e := range d {
		if len(e) > 1 {
			ans = append(ans, e)
		}
	}
	return ans
}
```

### Java

```java
// Find Duplicate File in System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public List<List<String>> findDuplicate(String[] paths) {
        Map<String, List<String>> d = new HashMap<>();
        for (String p : paths) {
            String[] ps = p.split(" ");
            for (int i = 1; i < ps.length; ++i) {
                int j = ps[i].indexOf('(');
                String content = ps[i].substring(j + 1, ps[i].length() - 1);
                String name = ps[0] + '/' + ps[i].substring(0, j);
                d.computeIfAbsent(content, k -> new ArrayList<>()).add(name);
            }
        }
        List<List<String>> ans = new ArrayList<>();
        for (var e : d.values()) {
            if (e.size() > 1) {
                ans.add(e);
            }
        }
        return ans;
    }
}
```

### Python

```python
# Find Duplicate File in System：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def findDuplicate(self, paths: List[str]) -> List[List[str]]:
        d = defaultdict(list)
        for p in paths:
            ps = p.split()
            for f in ps[1:]:
                i = f.find('(')
                name, content = f[:i], f[i + 1 : -1]
                d[content].append(ps[0] + '/' + name)
        return [v for v in d.values() if len(v) > 1]
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

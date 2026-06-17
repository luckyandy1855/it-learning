# 0071. Simplify Path

---
编号: 71
题目: Simplify Path
难度: 中等
标签: [栈, 字符串]
来源链接: https://leetcode.com/problems/simplify-path/
---

## 题目描述

给定一个 Unix 风格的绝对路径 `path`，将其转换为规范路径（Canonical Path）。

规范路径规则：
- 以单个斜杠 `/` 开头。
- 路径中的目录名之间只有一个斜杠 `/`。
- 路径不以 `/` 结尾（根目录除外）。
- `.` 表示当前目录，`..` 表示父目录（向上一级）。

### Example 1

```text
Input: path = "/home/"
Output: "/home"
```

### Example 2

```text
Input: path = "/../"
Output: "/"
```

### Example 3

```text
Input: path = "/home//foo/"
Output: "/home/foo"
```

### 约束条件

- `1 <= path.length <= 3000`
- `path` 由英文字母、数字、`'.'`、`'/'` 或 `'_'` 组成
- `path` 是一个有效的 Unix 绝对路径

## 思路分析

### 突破口

用栈维护有效目录：按 `/` 分割路径，逐段处理——忽略空串和 `.`，遇 `..` 弹栈，其他压栈。

### 思路拆解

1. **按 `/` 分割**：得到各目录段（可能含空串）。

2. **逐段处理**：
   - 空串或 `"."` → 忽略
   - `".."` → 若栈非空则弹栈
   - 其他 → 压栈

3. **构造结果**：`"/" + 栈元素用 `"/"` 连接`；若栈为空返回 `"/"`。

### 示意图

```text
path = "/a/./b/../../c/"
分割: ["", "a", ".", "b", "..", "..", "c", ""]
处理:
  "a"  → stack=[a]
  "."  → 忽略
  "b"  → stack=[a,b]
  ".." → stack=[a]
  ".." → stack=[]
  "c"  → stack=[c]

结果: "/c"
```

## 复杂度分析

| 解法 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 栈 | O(n) | O(n) |

## 代码实现

### Go

```go
import "strings"

// simplifyPath 将 Unix 绝对路径转换为规范路径
func simplifyPath(path string) string {
    parts := strings.Split(path, "/")
    stack := []string{}

    for _, part := range parts {
        if part == "" || part == "." {
            continue
        }
        if part == ".." {
            if len(stack) > 0 {
                stack = stack[:len(stack)-1]
            }
        } else {
            stack = append(stack, part)
        }
    }

    return "/" + strings.Join(stack, "/")
}
```

### Java

```java
import java.util.*;

class Solution {
    /**
     * 将 Unix 绝对路径转换为规范路径。
     */
    public String simplifyPath(String path) {
        String[] parts = path.split("/");
        Deque<String> stack = new ArrayDeque<>();

        for (String part : parts) {
            if (part.isEmpty() || part.equals(".")) continue;
            if (part.equals("..")) {
                if (!stack.isEmpty()) stack.pop();
            } else {
                stack.push(part);
            }
        }

        StringBuilder sb = new StringBuilder();
        // stack 是逆序的（push 在头部），转为列表再拼接
        List<String> list = new ArrayList<>(stack);
        Collections.reverse(list);
        for (String s : list) sb.append('/').append(s);
        return sb.length() == 0 ? "/" : sb.toString();
    }
}
```

### Python

```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        """
        将 Unix 绝对路径转换为规范路径。
        """
        stack = []
        for part in path.split('/'):
            if part in ('', '.'):
                continue
            if part == '..':
                if stack:
                    stack.pop()
            else:
                stack.append(part)

        return '/' + '/'.join(stack)
```

## 踩坑记录

- **`/../` 的处理**：在根目录时 `..` 应忽略（不能再向上），用 `if len(stack) > 0` 保护弹栈操作。
- **Java `Deque` 方向**：用 `push`（头部插入）和 `pop`（头部弹出）作为栈操作时，栈顶是头部，最终需要 `reverse` 再构造路径；或改用 `ArrayDeque` 的尾部操作（`addLast/pollLast`）保持顺序。
- **结果不含末尾 `/`**：Go 的 `strings.Join` 和 Python 的 `'/'.join` 都不会在末尾加 `/`，若栈为空直接返回 `"/"`。

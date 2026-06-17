# 0158. Read N Characters Given read4 II - Call Multiple Times

---
编号: 158
题目: Read N Characters Given read4 II - Call Multiple Times
难度: 困难
标签: [数组, 交互, 模拟]
来源链接: https://leetcode.com/problems/read-n-characters-given-read4-ii-call-multiple-times/
---

## 题目描述

给你一个文件 `file` ，并且该文件只能通过给定的 `read4` 方法来读取，请实现一个方法使其能够使 `read` 读取 `n` 个字符。**注意：你的** **`read` 方法可能会被调用多次。**

**read4 的定义：**

`read4` API 从文件中读取** 4 个连续的字符**，然后将这些字符写入缓冲区数组 `buf4` 。

返回值是读取的实际字符数。

请注意，`read4()` 有其自己的文件指针，类似于 C 中的 `FILE * fp` 。

```text
参数类型: char[] buf4
    返回类型: int

注意: buf4[] 是目标缓存区不是源缓存区，read4 的返回结果将会复制到 buf4[] 当中。
```

下列是一些使用 `read4` 的例子：

```text
File file("abcde"); // 文件名为 "abcde"， 初始文件指针 (fp) 指向 'a'
char[] buf4 = new char[4]; // 创建一个缓存区使其能容纳足够的字符
read4(buf4); // read4 返回 4。现在 buf4 = "abcd"，fp 指向 'e'
read4(buf4); // read4 返回 1。现在 buf4 = "e"，fp 指向文件末尾
read4(buf4); // read4 返回 0。现在 buf4 = ""，fp 指向文件末尾
```

**read 方法：**

通过使用 `read4` 方法，实现 `read` 方法。该方法可以从文件中读取 `n` 个字符并将其存储到缓存数组 `buf` 中。您 **不能 **直接操作 `file` 。

返回值为实际读取的字符。

**read 的定义：**

```text
参数类型:  char[] buf, int n
    返回类型:  int

注意: buf[] 是目标缓存区不是源缓存区，你需要将结果写入 buf[] 中。
```

**注意：**

	- 你 **不能** 直接操作该文件，文件只能通过 `read4` 获取而 **不能** 通过 `read`。

	- `read`  函数可以被调用 **多次**。

	- 请记得 **重置 **在 Solution 中声明的类变量（静态变量），因为类变量会 **在多个测试用例中保持不变**，影响判题准确。请 查阅 这里。

	- 你可以假定目标缓存数组 `buf` 保证有足够的空间存下 n 个字符。

	- 保证在一个给定测试用例中，`read` 函数使用的是同一个 `buf`。

**示例 1：**

```text
输入： file = "abc"， queries = [1,2,1]
输出：[1,2,0]
解释：测试用例表示以下场景:
File file("abc");
Solution sol;
sol.read (buf, 1); // 调用 read 方法后，buf 应该包含 “a”。我们从文件中总共读取了 1 个字符，所以返回 1。
sol.read (buf, 2); // 现在 buf 应该包含 "bc"。我们从文件中总共读取了 2 个字符，所以返回 2。
sol.read (buf, 1); // 我们已经到达文件的末尾，不能读取更多的字符。所以返回 0。
假设已经分配了 buf ，并保证有足够的空间存储文件中的所有字符。
```

**示例 2：**

```text
输入：file = "abc"， queries = [4,1]
输出：[3,0]
解释：测试用例表示以下场景:
File file("abc");
Solution sol;
sol.read (buf, 4); // 调用 read 方法后，buf 应该包含 “abc”。我们从文件中总共读取了 3 个字符，所以返回 3。
sol.read (buf, 1); // 我们已经到达文件的末尾，不能读取更多的字符。所以返回 0。
```

**提示：**

	- `1 <= file.length <= 500`

	- `file` 由英语字母和数字组成

	- `1 <= queries.length <= 10`

	- `1 <= queries[i] <= 500`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「数组, 交互, 模拟」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

本题先明确输入、输出和约束，再选择与数据规模匹配的数据结构或状态转移。实现时重点维护清晰的不变量，避免边界输入破坏主流程。

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
// Read N Characters Given read4 II - Call Multiple Times：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
/**
 * The read4 API is already defined for you.
 *
 *     read4 := func(buf4 []byte) int
 *
 * // Below is an example of how the read4 API can be called.
 * file := File("abcdefghijk") // File is "abcdefghijk", initially file pointer (fp) points to 'a'
 * buf4 := make([]byte, 4) // Create buffer with enough space to store characters
 * read4(buf4) // read4 returns 4. Now buf = ['a','b','c','d'], fp points to 'e'
 * read4(buf4) // read4 returns 4. Now buf = ['e','f','g','h'], fp points to 'i'
 * read4(buf4) // read4 returns 3. Now buf = ['i','j','k',...], fp points to end of file
 */

var solution = func(read4 func([]byte) int) func([]byte, int) int {
	buf4 := make([]byte, 4)
	i, size := 0, 0
	// implement read below.
	return func(buf []byte, n int) int {
		j := 0
		for j < n {
			if i == size {
				size = read4(buf4)
				i = 0
				if size == 0 {
					break
				}
			}
			for j < n && i < size {
				buf[j] = buf4[i]
				i, j = i+1, j+1
			}
		}
		return j
	}
}
```

### Java

```java
// Read N Characters Given read4 II - Call Multiple Times：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * The read4 API is defined in the parent class Reader4.
 *     int read4(char[] buf4);
 */

public class Solution extends Reader4 {
    private char[] buf4 = new char[4];
    private int i;
    private int size;

    /**
     * @param buf Destination buffer
     * @param n   Number of characters to read
     * @return    The number of actual characters read
     */
    public int read(char[] buf, int n) {
        int j = 0;
        while (j < n) {
            if (i == size) {
                size = read4(buf4);
                i = 0;
                if (size == 0) {
                    break;
                }
            }
            while (j < n && i < size) {
                buf[j++] = buf4[i++];
            }
        }
        return j;
    }
}
```

### Python

```python
# Read N Characters Given read4 II - Call Multiple Times：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
# The read4 API is already defined for you.
# def read4(buf4: List[str]) -> int:


class Solution:
    def __init__(self):
        self.buf4 = [None] * 4
        self.i = self.size = 0

    def read(self, buf: List[str], n: int) -> int:
        j = 0
        while j < n:
            if self.i == self.size:
                self.size = read4(self.buf4)
                self.i = 0
                if self.size == 0:
                    break
            while j < n and self.i < self.size:
                buf[j] = self.buf4[self.i]
                self.i += 1
                j += 1
        return j
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

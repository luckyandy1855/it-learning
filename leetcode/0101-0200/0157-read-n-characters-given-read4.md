# 0157. Read N Characters Given Read4

---
编号: 157
题目: Read N Characters Given Read4
难度: 简单
标签: [数组, 交互, 模拟]
来源链接: https://leetcode.com/problems/read-n-characters-given-read4/
---

## 题目描述

给你一个文件，并且该文件只能通过给定的 `read4` 方法来读取，请实现一个方法使其能够读取 n 个字符。

**read4 方法：**

API `read4` 可以从文件中读取 4 个连续的字符，并且将它们写入缓存数组 `buf` 中。

返回值为实际读取的字符个数。

注意 `read4()` 自身拥有文件指针，很类似于 C 语言中的 `FILE *fp` 。

**read4 的定义：**

```text
参数类型: char[] buf4
返回类型: int

注意: buf4[] 是目标缓存区不是源缓存区，read4 的返回结果将会复制到 buf4[] 当中。
```

下列是一些使用 `read4` 的例子：

```text
File file("abcde"); // 文件名为 "abcde"， 初始文件指针 (fp) 指向 &#39;a&#39;
char[] buf4 = new char[4]; // 创建一个缓存区使其能容纳足够的字符
read4(buf4); // read4 返回 4。现在 buf4 = "abcd"，fp 指向 &#39;e&#39;
read4(buf4); // read4 返回 1。现在 buf4 = "e"，fp 指向文件末尾
read4(buf4); // read4 返回 0。现在 buf = ""，fp 指向文件末尾
```

**read 方法：**

通过使用 `read4` 方法，实现 `read` 方法。该方法可以从文件中读取 n 个字符并将其存储到缓存数组 `buf` 中。您 **不能 **直接操作文件。

返回值为实际读取的字符。

**read 的定义：**

```text
参数类型:   char[] buf, int n
返回类型:   int

注意: buf[] 是目标缓存区不是源缓存区，你需要将结果写入 buf[] 中。
```

**示例 1：**

```text
输入： file = "abc", n = 4
输出： 3
解释： 当执行你的 read 方法后，buf 需要包含 "abc"。 文件一共 3 个字符，因此返回 3。 注意 "abc" 是文件的内容，不是 buf 的内容，buf 是你需要写入结果的目标缓存区。
```

**示例 2：**

```text
输入： file = "abcde", n = 5
输出： 5
解释： 当执行你的 read 方法后，buf 需要包含 "abcde"。文件共 5 个字符，因此返回 5。
```

**示例 3:**

```text
输入： file = "abcdABCD1234", n = 12
输出： 12
解释： 当执行你的 read 方法后，buf 需要包含 "abcdABCD1234"。文件一共 12 个字符，因此返回 12。
```

**示例 4:**

```text
输入： file = "leetcode", n = 5
输出： 5
解释： 当执行你的 read 方法后，buf 需要包含 "leetc"。文件中一共 5 个字符，因此返回 5。
```

**提示：**

	- 你 **不能** 直接操作该文件，文件只能通过 `read4` 获取而 **不能** 通过 `read`。

	- `read`  函数只在每个测试用例调用一次。

	- 你可以假定目标缓存数组 `buf` 保证有足够的空间存下 n 个字符。

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

直接模拟读取文件的过程，每次读取 4 个字符，然后将读取的字符存入缓存数组中，直到读取的字符数目达到 n 或者文件读取完毕。

时间复杂度 $O(n)$。其中 $n$ 为要读取的字符数目。

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
// Read N Characters Given Read4：按照上方思路实现主解法。
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
	// implement read below.
	return func(buf []byte, n int) int {
		buf4 := make([]byte, 4)
		i, v := 0, 5
		for v >= 4 {
			v = read4(buf4)
			for j := 0; j < v; j++ {
				buf[i] = buf4[j]
				i++
				if i >= n {
					return n
				}
			}
		}
		return i
	}
}
```

### Java

```java
// Read N Characters Given Read4：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
/**
 * The read4 API is defined in the parent class Reader4.
 *     int read4(char[] buf4);
 */

public class Solution extends Reader4 {
    /**
     * @param buf Destination buffer
     * @param n   Number of characters to read
     * @return    The number of actual characters read
     */
    public int read(char[] buf, int n) {
        char[] buf4 = new char[4];
        int i = 0, v = 5;
        while (v >= 4) {
            v = read4(buf4);
            for (int j = 0; j < v; ++j) {
                buf[i++] = buf4[j];
                if (i >= n) {
                    return n;
                }
            }
        }
        return i;
    }
}
```

### Python

```python
# Read N Characters Given Read4：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
"""
The read4 API is already defined for you.

    @param buf4, a list of characters
    @return an integer
    def read4(buf4):

# Below is an example of how the read4 API can be called.
file = File("abcdefghijk") # File is "abcdefghijk", initially file pointer (fp) points to 'a'
buf4 = [' '] * 4 # Create buffer with enough space to store characters
read4(buf4) # read4 returns 4. Now buf = ['a','b','c','d'], fp points to 'e'
read4(buf4) # read4 returns 4. Now buf = ['e','f','g','h'], fp points to 'i'
read4(buf4) # read4 returns 3. Now buf = ['i','j','k',...], fp points to end of file
"""


class Solution:
    def read(self, buf, n):
        """
        :type buf: Destination buffer (List[str])
        :type n: Number of characters to read (int)
        :rtype: The number of actual characters read (int)
        """
        i = 0
        buf4 = [0] * 4
        v = 5
        while v >= 4:
            v = read4(buf4)
            for j in range(v):
                buf[i] = buf4[j]
                i += 1
                if i >= n:
                    return n
        return i
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

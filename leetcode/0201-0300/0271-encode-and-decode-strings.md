# 0271. Encode and Decode Strings

---
编号: 271
题目: Encode and Decode Strings
难度: 中等
标签: [设计, 数组, 字符串]
来源链接: https://leetcode.com/problems/encode-and-decode-strings/
---

## 题目描述

请你设计一个算法，可以将一个 **字符串列表 **编码成为一个 **字符串**。这个编码后的字符串是可以通过网络进行高效传送的，并且可以在接收端被解码回原来的字符串列表。

1 号机（发送方）有如下函数：

```text
string encode(vector strs) {
  // ... your code
  return encoded_string;
}
```

2 号机（接收方）有如下函数：

```text
vector decode(string s) {
  //... your code
  return strs;
}
```

1 号机（发送方）执行：

```text
string encoded_string = encode(strs);
```

2 号机（接收方）执行：

```text
vector strs2 = decode(encoded_string);
```

此时，2 号机（接收方）的 `strs2` 需要和 1 号机（发送方）的 `strs` 相同。

请你来实现这个 `encode` 和 `decode` 方法。

不允许使用任何序列化方法解决这个问题（例如 `eval`）。

示例 1：

```text
输入：dummy_input = ["Hello","World"]
输出：["Hello","World"]
解释：
1 号机：
Codec encoder = new Codec();
String msg = encoder.encode(strs);
Machine 1 ---msg---> Machine 2

2 号机：
Codec decoder = new Codec();
String[] strs = decoder.decode(msg);
```

示例 2：

```text
输入：dummy_input = [""]
输出：[""]
```

**提示：**

- `1 <= strs.length <= 200`

- `0 <= strs[i].length <= 200`

- `strs[i]` 包含 256 个有效 ASCII 字符中的任何可能字符。

**进阶：**你能编写一个通用算法来处理任何可能的字符集吗？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 字符串」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

编码时，将字符串的长度转成固定 $4$ 位的字符串，加上字符串本身，依次拼接到结果字符串。

解码时，先取前四位字符串，得到长度，再通过长度截取后面的字符串。依次截取，最终得到字符串列表。

时间复杂度 $O(n)$。

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
// Encode and Decode Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Codec struct {
}

// Encodes a list of strings to a single string.
func (codec *Codec) Encode(strs []string) string {
	ans := &bytes.Buffer{}
	for _, s := range strs {
		t := fmt.Sprintf("%04d", len(s))
		ans.WriteString(t)
		ans.WriteString(s)
	}
	return ans.String()
}

// Decodes a single string to a list of strings.
func (codec *Codec) Decode(strs string) []string {
	ans := []string{}
	i, n := 0, len(strs)
	for i < n {
		t := strs[i : i+4]
		i += 4
		size, _ := strconv.Atoi(t)
		ans = append(ans, strs[i:i+size])
		i += size
	}
	return ans
}

// Your Codec object will be instantiated and called as such:
// var codec Codec
// codec.Decode(codec.Encode(strs));
```

### Java

```java
import java.util.*;
// Encode and Decode Strings：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
public class Codec {

    // Encodes a list of strings to a single string.
    public String encode(List<String> strs) {
        StringBuilder ans = new StringBuilder();
        for (String s : strs) {
            ans.append((char) s.length()).append(s);
        }
        return ans.toString();
    }

    // Decodes a single string to a list of strings.
    public List<String> decode(String s) {
        List<String> ans = new ArrayList<>();
        int i = 0, n = s.length();
        while (i < n) {
            int size = s.charAt(i++);
            ans.add(s.substring(i, i + size));
            i += size;
        }
        return ans;
    }
}

// Your Codec object will be instantiated and called as such:
// Codec codec = new Codec();
// codec.decode(codec.encode(strs));
```

### Python

```python
# Encode and Decode Strings：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Codec:
    def encode(self, strs: List[str]) -> str:
        """Encodes a list of strings to a single string."""
        ans = []
        for s in strs:
            ans.append('{:4}'.format(len(s)) + s)
        return ''.join(ans)

    def decode(self, s: str) -> List[str]:
        """Decodes a single string to a list of strings."""
        ans = []
        i, n = 0, len(s)
        while i < n:
            size = int(s[i : i + 4])
            i += 4
            ans.append(s[i : i + size])
            i += size
        return ans


# Your Codec object will be instantiated and called as such:
# codec = Codec()
# codec.decode(codec.encode(strs))
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

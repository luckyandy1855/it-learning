# 1419. Minimum Number of Frogs Croaking

---
编号: 1419
题目: Minimum Number of Frogs Croaking
难度: 中等
标签: [字符串, 计数]
来源链接: https://leetcode.com/problems/minimum-number-of-frogs-croaking/
---

## 题目描述

给你一个字符串 `croakOfFrogs`，它表示不同青蛙发出的蛙鸣声（字符串 `"croak"` ）的组合。由于同一时间可以有多只青蛙呱呱作响，所以 `croakOfFrogs` 中会混合多个 `“croak”` *。*

请你返回模拟字符串中所有蛙鸣所需不同青蛙的最少数目。

要想发出蛙鸣 "croak"，青蛙必须 **依序** 输出 `‘c’, ’r’, ’o’, ’a’, ’k’` 这 5 个字母。如果没有输出全部五个字母，那么它就不会发出声音。如果字符串 `croakOfFrogs` 不是由若干有效的 "croak" 字符混合而成，请返回 `-1` 。

**示例 1：**

```text
输入：croakOfFrogs = "croakcroak"
输出：1
解释：一只青蛙 “呱呱” 两次
```

**示例 2：**

```text
输入：croakOfFrogs = "crcoakroak"
输出：2
解释：最少需要两只青蛙，“呱呱” 声用黑体标注
第一只青蛙 "crcoakroak"
第二只青蛙 "crcoakroak"
```

**示例 3：**

```text
输入：croakOfFrogs = "croakcrook"
输出：-1
解释：给出的字符串不是 "croak" 的有效组合。
```

**提示：**

- `1 <= croakOfFrogs.length <= 10^5`

- 字符串中的字符只有 `'c'`, `'r'`, `'o'`, `'a'` 或者 `'k'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「字符串, 计数」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们注意到，如果字符串 `croakOfFrogs` 是由若干有效的 `"croak"` 字符混合而成，那么它的长度一定是 $5$ 的倍数。因此，如果字符串的长度不是 $5$ 的倍数，可以直接返回 $-1$。

接下来，我们将 `'c'`, `'r'`, `'o'`, `'a'`, `'k'` 这 $5$ 个字母分别对应下标 $0$ 到 $4$，用一个长度为 $5$ 的数组 $cnt$ 记录字符串 `croakOfFrogs` 中每个字母出现的次数，其中 $cnt[i]$ 表示当前下标为 $i$ 的字母出现的次数。另外，我们定义一个整数变量 $x$ 表示当前未完成蛙鸣的青蛙的数目，需要的青蛙的最少数目 $ans$ 即为 $x$ 的最大值。

我们遍历字符串 `croakOfFrogs` 中的每个字母 $c$，找到 $c$ 对应的下标 $i$，然后将 $cnt[i]$ 加 $1$。接下来，根据 $i$ 值的不同，我们分别进行如下操作：

- 如果 $i=0$，那么当前有一个新的青蛙开始蛙鸣，因此令 $x$ 的值加 $1$，然后我们更新 $ans = \max(ans, x)$；
- 否则，如果 $cnt[i-1]=0$，那么表示当前没有青蛙可以发出字母 $c$，无法完成蛙鸣，返回 $-1$，否则我们令 $cnt[i-1]$ 减 $1$。如果 $i=4$，那么表示青蛙已经完成了一个蛙鸣，因此令 $x$ 的值减 $1$。

遍历结束后，如果 $x=0$，那么说明青蛙已经完成了所有的蛙鸣，返回 $ans$，否则返回 $-1$。

时间复杂度 $O(n)$，空间复杂度 $O(C)$。其中 $n$ 是字符串 `croakOfFrogs` 的长度；而 $C$ 是字符集的大小，本题中 $C=26$。

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
// Minimum Number of Frogs Croaking：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func minNumberOfFrogs(croakOfFrogs string) int {
	n := len(croakOfFrogs)
	if n%5 != 0 {
		return -1
	}
	idx := [26]int{}
	for i, c := range "croak" {
		idx[c-'a'] = i
	}
	cnt := [5]int{}
	ans, x := 0, 0
	for _, c := range croakOfFrogs {
		i := idx[c-'a']
		cnt[i]++
		if i == 0 {
			x++
			ans = max(ans, x)
		} else {
			cnt[i-1]--
			if cnt[i-1] < 0 {
				return -1
			}
			if i == 4 {
				x--
			}
		}
	}
	if x > 0 {
		return -1
	}
	return ans
}
```

### Java

```java
// Minimum Number of Frogs Croaking：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int minNumberOfFrogs(String croakOfFrogs) {
        int n = croakOfFrogs.length();
        if (n % 5 != 0) {
            return -1;
        }
        int[] idx = new int[26];
        String s = "croak";
        for (int i = 0; i < 5; ++i) {
            idx[s.charAt(i) - 'a'] = i;
        }
        int[] cnt = new int[5];
        int ans = 0, x = 0;
        for (int k = 0; k < n; ++k) {
            int i = idx[croakOfFrogs.charAt(k) - 'a'];
            ++cnt[i];
            if (i == 0) {
                ans = Math.max(ans, ++x);
            } else {
                if (--cnt[i - 1] < 0) {
                    return -1;
                }
                if (i == 4) {
                    --x;
                }
            }
        }
        return x > 0 ? -1 : ans;
    }
}
```

### Python

```python
# Minimum Number of Frogs Croaking：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def minNumberOfFrogs(self, croakOfFrogs: str) -> int:
        if len(croakOfFrogs) % 5 != 0:
            return -1
        idx = {c: i for i, c in enumerate('croak')}
        cnt = [0] * 5
        ans = x = 0
        for i in map(idx.get, croakOfFrogs):
            cnt[i] += 1
            if i == 0:
                x += 1
                ans = max(ans, x)
            else:
                if cnt[i - 1] == 0:
                    return -1
                cnt[i - 1] -= 1
                if i == 4:
                    x -= 1
        return -1 if x else ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

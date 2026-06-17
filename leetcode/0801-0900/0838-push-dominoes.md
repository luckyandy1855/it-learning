# 0838. Push Dominoes

---
编号: 838
题目: Push Dominoes
难度: 中等
标签: [双指针, 字符串, 动态规划]
来源链接: https://leetcode.com/problems/push-dominoes/
---

## 题目描述

`n` 张多米诺骨牌排成一行，将每张多米诺骨牌垂直竖立。在开始时，同时把一些多米诺骨牌向左或向右推。

每过一秒，倒向左边的多米诺骨牌会推动其左侧相邻的多米诺骨牌。同样地，倒向右边的多米诺骨牌也会推动竖立在其右侧的相邻多米诺骨牌。

如果一张垂直竖立的多米诺骨牌的两侧同时有多米诺骨牌倒下时，由于受力平衡， 该骨牌仍然保持不变。

就这个问题而言，我们会认为一张正在倒下的多米诺骨牌不会对其它正在倒下或已经倒下的多米诺骨牌施加额外的力。

给你一个字符串 `dominoes` 表示这一行多米诺骨牌的初始状态，其中：

- `dominoes[i] = 'L'`，表示第 `i` 张多米诺骨牌被推向左侧，

- `dominoes[i] = 'R'`，表示第 `i` 张多米诺骨牌被推向右侧，

- `dominoes[i] = '.'`，表示没有推动第 `i` 张多米诺骨牌。

返回表示最终状态的字符串。

**示例 1：**

```text
输入：dominoes = "RR.L"
输出："RR.L"
解释：第一张多米诺骨牌没有给第二张施加额外的力。
```

**示例 2：**

```text
输入：dominoes = ".L.R...LR..L.."
输出："LL.RR.LLRRLL.."
```

**提示：**

- `n == dominoes.length`

- `1 <= n <= 10^5`

- `dominoes[i]` 为 `'L'`、`'R'` 或 `'.'`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「双指针, 字符串, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

把所有初始受到推力的骨牌（`L`  或  `R`）视作 **源点**，它们会同时向外扩散各自的力。用队列按时间层级（0, 1, 2 …）进行  BFS：

我们定义 $\text{time[i]}$  记录第  *i*  张骨牌第一次受力的时刻，`-1`  表示尚未受力，定义 $\text{force[i]}$  是一个长度可变的列表，存放该骨牌在同一时刻收到的方向（`'L'`、`'R'`）。初始时把所有  `L/R`  的下标压入队列，并将它们的时间置  0。

当弹出下标  *i* 时，若  $\text{force[i]}$  只有一个方向，骨牌就会倒向该方向  $f$。设下一张骨牌下标为


j =
\begin{cases}
i - 1, & f = L,\\
i + 1, & f = R.
\end{cases}


若  $0 \leq j < n$：

- 若 $\text{time[j]}=-1$，说明  *j*  从未受力，记录 $\text{time[j]}=\text{time[i]}+1$ 并入队，同时把  $f$ 写入  $\text{force[j]}$。
- 若 $\text{time[j]}=\text{time[i]}+1$，说明它在同一“下一刻”已受过另一股力，此时只把  $f$ 追加到  $\text{force[j]}$，形成对冲；后续因  `len(force[j])==2`，它将保持竖直。

队列清空后，所有  $\text{force[i]}$  长度为  1  的位置倒向对应方向；长度为  2  的位置保持  `.`。最终将字符数组拼接为答案。

时间复杂度 $O(n)$，空间复杂度 $O(n)$。其中 $n$ 是骨牌的数量。

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
// Push Dominoes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func pushDominoes(dominoes string) string {
	n := len(dominoes)
	q := []int{}
	time := make([]int, n)
	for i := range time {
		time[i] = -1
	}
	force := make([][]byte, n)
	for i, c := range dominoes {
		if c != '.' {
			q = append(q, i)
			time[i] = 0
			force[i] = append(force[i], byte(c))
		}
	}

	ans := bytes.Repeat([]byte{'.'}, n)
	for len(q) > 0 {
		i := q[0]
		q = q[1:]
		if len(force[i]) > 1 {
			continue
		}
		f := force[i][0]
		ans[i] = f
		j := i - 1
		if f == 'R' {
			j = i + 1
		}
		if 0 <= j && j < n {
			t := time[i]
			if time[j] == -1 {
				q = append(q, j)
				time[j] = t + 1
				force[j] = append(force[j], f)
			} else if time[j] == t+1 {
				force[j] = append(force[j], f)
			}
		}
	}
	return string(ans)
}
```

### Java

```java
// Push Dominoes：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public String pushDominoes(String dominoes) {
        int n = dominoes.length();
        Deque<Integer> q = new ArrayDeque<>();
        int[] time = new int[n];
        Arrays.fill(time, -1);
        List<Character>[] force = new List[n];
        for (int i = 0; i < n; ++i) {
            force[i] = new ArrayList<>();
        }
        for (int i = 0; i < n; ++i) {
            char f = dominoes.charAt(i);
            if (f != '.') {
                q.offer(i);
                time[i] = 0;
                force[i].add(f);
            }
        }
        char[] ans = new char[n];
        Arrays.fill(ans, '.');
        while (!q.isEmpty()) {
            int i = q.poll();
            if (force[i].size() == 1) {
                ans[i] = force[i].get(0);
                char f = ans[i];
                int j = f == 'L' ? i - 1 : i + 1;
                if (j >= 0 && j < n) {
                    int t = time[i];
                    if (time[j] == -1) {
                        q.offer(j);
                        time[j] = t + 1;
                        force[j].add(f);
                    } else if (time[j] == t + 1) {
                        force[j].add(f);
                    }
                }
            }
        }
        return new String(ans);
    }
}
```

### Python

```python
# Push Dominoes：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def pushDominoes(self, dominoes: str) -> str:
        n = len(dominoes)
        q = deque()
        time = [-1] * n
        force = defaultdict(list)
        for i, f in enumerate(dominoes):
            if f != '.':
                q.append(i)
                time[i] = 0
                force[i].append(f)
        ans = ['.'] * n
        while q:
            i = q.popleft()
            if len(force[i]) == 1:
                ans[i] = f = force[i][0]
                j = i - 1 if f == 'L' else i + 1
                if 0 <= j < n:
                    t = time[i]
                    if time[j] == -1:
                        q.append(j)
                        time[j] = t + 1
                        force[j].append(f)
                    elif time[j] == t + 1:
                        force[j].append(f)
        return ''.join(ans)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

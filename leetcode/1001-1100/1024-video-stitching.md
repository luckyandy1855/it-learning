# 1024. Video Stitching

---
编号: 1024
题目: Video Stitching
难度: 中等
标签: [贪心, 数组, 动态规划]
来源链接: https://leetcode.com/problems/video-stitching/
---

## 题目描述

你将会获得一系列视频片段，这些片段来自于一项持续时长为 `time` 秒的体育赛事。这些片段可能有所重叠，也可能长度不一。

使用数组 `clips` 描述所有的视频片段，其中 `clips[i] = [starti, endi]` 表示：某个视频片段开始于 `starti` 并于 `endi` 结束。

甚至可以对这些片段自由地再剪辑：

- 例如，片段 `[0, 7]` 可以剪切成 `[0, 1] + [1, 3] + [3, 7]` 三部分。

我们需要将这些片段进行再剪辑，并将剪辑后的内容拼接成覆盖整个运动过程的片段（`[0, time]`）。返回所需片段的最小数目，如果无法完成该任务，则返回 `-1` 。

**示例 1：**

```text
输入：clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10
输出：3
解释：
选中 [0,2], [8,10], [1,9] 这三个片段。
然后，按下面的方案重制比赛片段：
将 [1,9] 再剪辑为 [1,2] + [2,8] + [8,9] 。
现在手上的片段为 [0,2] + [2,8] + [8,10]，而这些覆盖了整场比赛 [0, 10]。
```

**示例 2：**

```text
输入：clips = [[0,1],[1,2]], time = 5
输出：-1
解释：
无法只用 [0,1] 和 [1,2] 覆盖 [0,5] 的整个过程。
```

**示例 3：**

```text
输入：clips = [[0,1],[6,8],[0,2],[5,6],[0,4],[0,3],[6,7],[1,3],[4,7],[1,4],[2,5],[2,6],[3,4],[4,5],[5,7],[6,9]], time = 9
输出：3
解释：
选取片段 [0,4], [4,7] 和 [6,9] 。
```

**提示：**

- `1 i i <= 100`

- `1 <= time <= 100`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「贪心, 数组, 动态规划」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

注意到，如果相同起点的子区间有多个，那么选择右端点最大的那个子区间是最优的。

因此，我们可以预处理所有子区间，对于每一个位置 $i$，算出所有以 $i$ 为起点的子区间中，右端点最大的那个位置，记录在数组 $last[i]$ 中。

我们定义变量 `mx` 表示当前能够到达的最远位置，变量 `ans` 表示当前需要的最少子区间数，变量 `pre` 表示上一个被使用的子区间的右端点。

接下来，我们从 $0$ 开始枚举所有位置 $i$，用 $last[i]$ 来更新 `mx`。如果更新后 $mx = i$，说明无法覆盖下一个位置，因此无法完成任务，返回 $-1$。

同时我们记录上一个被使用的子区间的右端点 `pre`，如果 $pre = i$，说明需要使用一个新的子区间，因此我们将 `ans` 加 $1$，并将 `pre` 更新为 `mx`。

遍历结束后，返回 `ans` 即可。

时间复杂度 $O(n+m)$，空间复杂度 $O(m)$。其中 $n$ 和 $m$ 分别是数组 `clips` 的长度和 `time` 的值。

相似题目：

- [45. 跳跃游戏 II](https://github.com/doocs/leetcode/blob/main/solution/0000-0099/0045.Jump%20Game%20II/README.md)
- [55. 跳跃游戏](https://github.com/doocs/leetcode/blob/main/solution/0000-0099/0055.Jump%20Game/README.md)
- [1326. 灌溉花园的最少水龙头数目](https://github.com/doocs/leetcode/blob/main/solution/1300-1399/1326.Minimum%20Number%20of%20Taps%20to%20Open%20to%20Water%20a%20Garden/README.md)

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
// Video Stitching：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
func videoStitching(clips [][]int, time int) int {
	last := make([]int, time)
	for _, v := range clips {
		a, b := v[0], v[1]
		if a < time {
			last[a] = max(last[a], b)
		}
	}
	ans, mx, pre := 0, 0, 0
	for i, v := range last {
		mx = max(mx, v)
		if mx <= i {
			return -1
		}
		if pre == i {
			ans++
			pre = mx
		}
	}
	return ans
}
```

### Java

```java
// Video Stitching：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public int videoStitching(int[][] clips, int time) {
        int[] last = new int[time];
        for (var e : clips) {
            int a = e[0], b = e[1];
            if (a < time) {
                last[a] = Math.max(last[a], b);
            }
        }
        int ans = 0, mx = 0, pre = 0;
        for (int i = 0; i < time; ++i) {
            mx = Math.max(mx, last[i]);
            if (mx <= i) {
                return -1;
            }
            if (pre == i) {
                ++ans;
                pre = mx;
            }
        }
        return ans;
    }
}
```

### Python

```python
# Video Stitching：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def videoStitching(self, clips: List[List[int]], time: int) -> int:
        last = [0] * time
        for a, b in clips:
            if a < time:
                last[a] = max(last[a], b)
        ans = mx = pre = 0
        for i, v in enumerate(last):
            mx = max(mx, v)
            if mx <= i:
                return -1
            if pre == i:
                ans += 1
                pre = mx
        return ans
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

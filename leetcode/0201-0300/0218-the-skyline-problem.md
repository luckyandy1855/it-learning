# 0218. The Skyline Problem

---
编号: 218
题目: The Skyline Problem
难度: 困难
标签: [树状数组, 线段树, 数组, 分治, 有序集合, 排序, 扫描线, 堆（优先队列）]
来源链接: https://leetcode.com/problems/the-skyline-problem/
---

## 题目描述

城市的 **天际线** 是从远处观看该城市中所有建筑物形成的轮廓的外部轮廓。给你所有建筑物的位置和高度，请返回 *由这些建筑物形成的** 天际线*** 。

每个建筑物的几何信息由数组 `buildings` 表示，其中三元组 `buildings[i] = [lefti, righti, heighti]` 表示：

- `lefti` 是第 `i` 座建筑物左边缘的 `x` 坐标。

- `righti` 是第 `i` 座建筑物右边缘的 `x` 坐标。

- `heighti` 是第 `i` 座建筑物的高度。

你可以假设所有的建筑都是完美的长方形，在高度为 `0` 的绝对平坦的表面上。

**天际线** 应该表示为由 “关键点” 组成的列表，格式 `[[x1,y1],[x2,y2],...]` ，并按 **x 坐标 **进行 **排序** 。**关键点是水平线段的左端点**。列表中最后一个点是最右侧建筑物的终点，`y` 坐标始终为 `0` ，仅用于标记天际线的终点。此外，任何两个相邻建筑物之间的地面都应被视为天际线轮廓的一部分。

**注意：**输出天际线中不得有连续的相同高度的水平线。例如 `[...[2 3], [4 5], [7 5], [11 5], [12 7]...]` 是不正确的答案；三条高度为 5 的线应该在最终输出中合并为一个：`[...[2 3], [4 5], [12 7], ...]`

**示例 1：**

```text
输入：buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
输出：[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
解释：
图 A 显示输入的所有建筑物的位置和高度，
图 B 显示由这些建筑物形成的天际线。图 B 中的红点表示输出列表中的关键点。
```

**示例 2：**

```text
输入：buildings = [[0,2,3],[2,5,3]]
输出：[[0,3],[5,0]]
```

**提示：**

- `1 i i i i` 非递减排序

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「树状数组, 线段树, 数组, 分治, 有序集合, 排序, 扫描线, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

记录下所有建筑物的左右边界线，升序排序之后得到序列 lines。对于每一个边界线 lines[i]，找出所有包含 lines[i] 的建筑物，并确保建筑物的左边界小于等于 lines[i]，右边界大于 lines[i]，则这些建筑物中高度最高的建筑物的高度就是该线轮廓点的高度。可以使用建筑物的高度构建优先队列（大根堆），同时需要注意高度相同的轮廓点需要合并为一个。

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
// The Skyline Problem：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type Matrix struct{ left, right, height int }
type Queue []Matrix

func (q Queue) Len() int           { return len(q) }
func (q Queue) Top() Matrix        { return q[0] }
func (q Queue) Swap(i, j int)      { q[i], q[j] = q[j], q[i] }
func (q Queue) Less(i, j int) bool { return q[i].height > q[j].height }
func (q *Queue) Push(x any)        { *q = append(*q, x.(Matrix)) }
func (q *Queue) Pop() any {
	old, x := *q, (*q)[len(*q)-1]
	*q = old[:len(old)-1]
	return x
}

func getSkyline(buildings [][]int) [][]int {
	skys, lines, pq := make([][]int, 0), make([]int, 0), &Queue{}
	heap.Init(pq)
	for _, v := range buildings {
		lines = append(lines, v[0], v[1])
	}
	sort.Ints(lines)
	city, n := 0, len(buildings)
	for _, line := range lines {
		// 将所有符合条件的矩形加入队列
		for ; city < n && buildings[city][0] <= line && buildings[city][1] > line; city++ {
			v := Matrix{left: buildings[city][0], right: buildings[city][1], height: buildings[city][2]}
			heap.Push(pq, v)
		}
		// 从队列移除不符合条件的矩形
		for pq.Len() > 0 && pq.Top().right <= line {
			heap.Pop(pq)
		}
		high := 0
		// 队列为空说明是最右侧建筑物的终点，其轮廓点为 (line, 0)
		if pq.Len() != 0 {
			high = pq.Top().height
		}
		// 如果该点高度和前一个轮廓点一样的话，直接忽略
		if len(skys) > 0 && skys[len(skys)-1][1] == high {
			continue
		}
		skys = append(skys, []int{line, high})
	}
	return skys
}
```

### Java

```java
import java.util.*;

// The Skyline Problem：扫描所有左右边界，用最大堆维护当前仍覆盖扫描线的建筑。
// 关键点：堆顶过期建筑要及时弹出，高度变化时才追加关键点。
class Solution {
    public List<List<Integer>> getSkyline(int[][] buildings) {
        List<Integer> lines = new ArrayList<>();
        for (int[] building : buildings) {
            lines.add(building[0]);
            lines.add(building[1]);
        }
        Collections.sort(lines);

        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[2] - a[2]);
        List<List<Integer>> ans = new ArrayList<>();
        int i = 0;

        for (int x : lines) {
            while (i < buildings.length && buildings[i][0] <= x) {
                if (buildings[i][1] > x) {
                    heap.offer(buildings[i]);
                }
                i++;
            }
            while (!heap.isEmpty() && heap.peek()[1] <= x) {
                heap.poll();
            }

            int height = heap.isEmpty() ? 0 : heap.peek()[2];
            if (ans.isEmpty() || ans.get(ans.size() - 1).get(1) != height) {
                ans.add(Arrays.asList(x, height));
            }
        }
        return ans;
    }
}
```

### Python

```python
# The Skyline Problem：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
from queue import PriorityQueue


class Solution:
    def getSkyline(self, buildings: List[List[int]]) -> List[List[int]]:
        skys, lines, pq = [], [], PriorityQueue()
        for build in buildings:
            lines.extend([build[0], build[1]])
        lines.sort()
        city, n = 0, len(buildings)
        for line in lines:
            while city < n and buildings[city][0] <= line:
                pq.put([-buildings[city][2], buildings[city][0], buildings[city][1]])
                city += 1
            while not pq.empty() and pq.queue[0][2] <= line:
                pq.get()
            high = 0
            if not pq.empty():
                high = -pq.queue[0][0]
            if len(skys) > 0 and skys[-1][1] == high:
                continue
            skys.append([line, high])
        return skys
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

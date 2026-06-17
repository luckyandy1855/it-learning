# 0391. Perfect Rectangle

---
编号: 391
题目: Perfect Rectangle
难度: 困难
标签: [几何, 数组, 哈希表, 数学, 扫描线]
来源链接: https://leetcode.com/problems/perfect-rectangle/
---

## 题目描述

给你一个数组 `rectangles` ，其中 `rectangles[i] = [xi, yi, ai, bi]` 表示一个坐标轴平行的矩形。这个矩形的左下顶点是 `(xi, yi)` ，右上顶点是 `(ai, bi)` 。

如果所有矩形一起精确覆盖了某个矩形区域，则返回 `true` ；否则，返回 `false` 。

**示例 1：**

```text
输入：rectangles = [[1,1,3,3],[3,1,4,2],[3,2,4,4],[1,3,2,4],[2,3,3,4]]
输出：true
解释：5 个矩形一起可以精确地覆盖一个矩形区域。
```

**示例 2：**

```text
输入：rectangles = [[1,1,2,3],[1,3,2,4],[3,1,4,2],[3,2,4,4]]
输出：false
解释：两个矩形之间有间隔，无法覆盖成一个矩形。
```

**示例 3：**

```text
输入：rectangles = [[1,1,3,3],[3,1,4,2],[1,3,2,4],[2,2,4,4]]
输出：false
解释：因为中间有相交区域，虽然形成了矩形，但不是精确覆盖。
```

**提示：**

	- `1 i i i i <= 10^5`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「几何, 数组, 哈希表, 数学, 扫描线」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
// Perfect Rectangle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type pair struct {
	first  int
	second int
}

func isRectangleCover(rectangles [][]int) bool {
	area := 0
	minX, minY := rectangles[0][0], rectangles[0][1]
	maxX, maxY := rectangles[0][2], rectangles[0][3]

	cnt := make(map[pair]int)
	for _, r := range rectangles {
		area += (r[2] - r[0]) * (r[3] - r[1])

		minX = min(minX, r[0])
		minY = min(minY, r[1])
		maxX = max(maxX, r[2])
		maxY = max(maxY, r[3])

		cnt[pair{r[0], r[1]}]++
		cnt[pair{r[0], r[3]}]++
		cnt[pair{r[2], r[3]}]++
		cnt[pair{r[2], r[1]}]++
	}

	if area != (maxX-minX)*(maxY-minY) ||
		cnt[pair{minX, minY}] != 1 ||
		cnt[pair{minX, maxY}] != 1 ||
		cnt[pair{maxX, maxY}] != 1 ||
		cnt[pair{maxX, minY}] != 1 {
		return false
	}

	delete(cnt, pair{minX, minY})
	delete(cnt, pair{minX, maxY})
	delete(cnt, pair{maxX, maxY})
	delete(cnt, pair{maxX, minY})

	for _, c := range cnt {
		if c != 2 && c != 4 {
			return false
		}
	}
	return true
}
```

### Java

```java
// Perfect Rectangle：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Solution {
    public boolean isRectangleCover(int[][] rectangles) {
        long area = 0;
        int minX = rectangles[0][0], minY = rectangles[0][1];
        int maxX = rectangles[0][2], maxY = rectangles[0][3];
        Map<Pair, Integer> cnt = new HashMap<>();

        for (int[] r : rectangles) {
            area += (r[2] - r[0]) * (r[3] - r[1]);

            minX = Math.min(minX, r[0]);
            minY = Math.min(minY, r[1]);
            maxX = Math.max(maxX, r[2]);
            maxY = Math.max(maxY, r[3]);

            cnt.merge(new Pair(r[0], r[1]), 1, Integer::sum);
            cnt.merge(new Pair(r[0], r[3]), 1, Integer::sum);
            cnt.merge(new Pair(r[2], r[3]), 1, Integer::sum);
            cnt.merge(new Pair(r[2], r[1]), 1, Integer::sum);
        }

        if (area != (long) (maxX - minX) * (maxY - minY)
            || cnt.getOrDefault(new Pair(minX, minY), 0) != 1
            || cnt.getOrDefault(new Pair(minX, maxY), 0) != 1
            || cnt.getOrDefault(new Pair(maxX, maxY), 0) != 1
            || cnt.getOrDefault(new Pair(maxX, minY), 0) != 1) {
            return false;
        }

        cnt.remove(new Pair(minX, minY));
        cnt.remove(new Pair(minX, maxY));
        cnt.remove(new Pair(maxX, maxY));
        cnt.remove(new Pair(maxX, minY));

        return cnt.values().stream().allMatch(c -> c == 2 || c == 4);
    }

    private static class Pair {
        final int first;
        final int second;

        Pair(int first, int second) {
            this.first = first;
            this.second = second;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            Pair pair = (Pair) o;
            return first == pair.first && second == pair.second;
        }

        @Override
        public int hashCode() {
            return Objects.hash(first, second);
        }
    }
}
```

### Python

```python
# Perfect Rectangle：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Solution:
    def isRectangleCover(self, rectangles: List[List[int]]) -> bool:
        area = 0
        minX, minY = rectangles[0][0], rectangles[0][1]
        maxX, maxY = rectangles[0][2], rectangles[0][3]
        cnt = defaultdict(int)

        for r in rectangles:
            area += (r[2] - r[0]) * (r[3] - r[1])

            minX = min(minX, r[0])
            minY = min(minY, r[1])
            maxX = max(maxX, r[2])
            maxY = max(maxY, r[3])

            cnt[(r[0], r[1])] += 1
            cnt[(r[0], r[3])] += 1
            cnt[(r[2], r[3])] += 1
            cnt[(r[2], r[1])] += 1

        if (
            area != (maxX - minX) * (maxY - minY)
            or cnt[(minX, minY)] != 1
            or cnt[(minX, maxY)] != 1
            or cnt[(maxX, maxY)] != 1
            or cnt[(maxX, minY)] != 1
        ):
            return False

        del cnt[(minX, minY)], cnt[(minX, maxY)], cnt[(maxX, maxY)], cnt[(maxX, minY)]

        return all(c == 2 or c == 4 for c in cnt.values())
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

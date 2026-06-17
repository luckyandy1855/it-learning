# 1146. Snapshot Array

---
编号: 1146
题目: Snapshot Array
难度: 中等
标签: [设计, 数组, 哈希表, 二分查找]
来源链接: https://leetcode.com/problems/snapshot-array/
---

## 题目描述

实现支持下列接口的「快照数组」- SnapshotArray：

- `SnapshotArray(int length)` - 初始化一个与指定长度相等的 类数组 的数据结构。**初始时，每个元素都等于**** 0**。

- `void set(index, val)` - 会将指定索引 `index` 处的元素设置为 `val`。

- `int snap()` - 获取该数组的快照，并返回快照的编号 `snap_id`（快照号是调用 `snap()` 的总次数减去 `1`）。

- `int get(index, snap_id)` - 根据指定的 `snap_id` 选择快照，并返回该快照指定索引 `index` 的值。

**示例：**

```text
输入：["SnapshotArray","set","snap","set","get"]
     [[3],[0,5],[],[0,6],[0,0]]
输出：[null,null,0,null,5]
解释：
SnapshotArray snapshotArr = new SnapshotArray(3); // 初始化一个长度为 3 的快照数组
snapshotArr.set(0,5);  // 令 array[0] = 5
snapshotArr.snap();  // 获取快照，返回 snap_id = 0
snapshotArr.set(0,6);
snapshotArr.get(0,0);  // 获取 snap_id = 0 的快照中 array[0] 的值，返回 5
```

**提示：**

- `1 <= length <= 50000`

- 题目最多进行`50000` 次`set`，`snap`，和 `get`的调用 。

- `0 <= index < length`

- `0 <= snap_id < `我们调用 `snap()` 的总次数

- `0 <= val <= 10^9`

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 数组, 哈希表, 二分查找」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
3. **维护不变量**：遍历或递归过程中，每一步都要保证当前状态含义不变，例如窗口合法、前缀已处理、堆顶最优或 DP 状态已完成。
4. **收尾边界**：循环结束后检查是否还有未结算的区间、路径、进位、缓存状态或最后一个候选答案。

### 参考解法要点

我们维护一个长度为 $\textit{length}$ 的数组，数组中的每个元素是一个列表，用来存储每次设置的值以及对应的快照 ID。

调用 `set` 方法时，将值和快照 ID 添加到对应索引的列表中。时间复杂度 $O(1)$。

调用 `snap` 方法时，我们先将快照 ID 加一，然后返回快照 ID 减一。时间复杂度 $O(1)$。

调用 `get` 方法时，我们使用二分查找找到对应位置的第一个快照 ID 大于 `snap_id` 的值，然后返回前一个的值。如果找不到，则返回 0。时间复杂度 $O(\log n)$。

空间复杂度 $O(n)$。

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
// Snapshot Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
type SnapshotArray struct {
	arr [][][2]int
	i   int
}

func Constructor(length int) SnapshotArray {
	return SnapshotArray{make([][][2]int, length), 0}
}

func (this *SnapshotArray) Set(index int, val int) {
	this.arr[index] = append(this.arr[index], [2]int{this.i, val})
}

func (this *SnapshotArray) Snap() int {
	this.i++
	return this.i - 1
}

func (this *SnapshotArray) Get(index int, snap_id int) int {
	i := sort.Search(len(this.arr[index]), func(i int) bool { return this.arr[index][i][0] > snap_id }) - 1
	if i < 0 {
		return 0
	}
	return this.arr[index][i][1]
}

/**
 * Your SnapshotArray object will be instantiated and called as such:
 * obj := Constructor(length);
 * obj.Set(index,val);
 * param_2 := obj.Snap();
 * param_3 := obj.Get(index,snap_id);
 */
```

### Java

```java
// Snapshot Array：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class SnapshotArray {
    private List<int[]>[] arr;
    private int idx;

    public SnapshotArray(int length) {
        arr = new List[length];
        Arrays.setAll(arr, k -> new ArrayList<>());
    }

    public void set(int index, int val) {
        arr[index].add(new int[] {idx, val});
    }

    public int snap() {
        return idx++;
    }

    public int get(int index, int snap_id) {
        int l = 0, r = arr[index].size();
        while (l < r) {
            int mid = (l + r) >> 1;
            if (arr[index].get(mid)[0] > snap_id) {
                r = mid;
            } else {
                l = mid + 1;
            }
        }
        --l;
        return l < 0 ? 0 : arr[index].get(l)[1];
    }
}

/**
 * Your SnapshotArray object will be instantiated and called as such:
 * SnapshotArray obj = new SnapshotArray(length);
 * obj.set(index,val);
 * int param_2 = obj.snap();
 * int param_3 = obj.get(index,snap_id);
 */
```

### Python

```python
# Snapshot Array：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class SnapshotArray:

    def __init__(self, length: int):
        self.arr = [[] for _ in range(length)]
        self.i = 0

    def set(self, index: int, val: int) -> None:
        self.arr[index].append((self.i, val))

    def snap(self) -> int:
        self.i += 1
        return self.i - 1

    def get(self, index: int, snap_id: int) -> int:
        i = bisect_left(self.arr[index], (snap_id, inf)) - 1
        return 0 if i < 0 else self.arr[index][i][1]


# Your SnapshotArray object will be instantiated and called as such:
# obj = SnapshotArray(length)
# obj.set(index,val)
# param_2 = obj.snap()
# param_3 = obj.get(index,snap_id)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

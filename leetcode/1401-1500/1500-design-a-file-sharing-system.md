# 1500. Design a File Sharing System

---
编号: 1500
题目: Design a File Sharing System
难度: 中等
标签: [设计, 哈希表, 数据流, 排序, 堆（优先队列）]
来源链接: https://leetcode.com/problems/design-a-file-sharing-system/
---

## 题目描述

我们需要使用一套文件分享系统来分享一个非常大的文件，该文件由 `m` 个从 `1` 到 `m` 编号的 **文件块** 组成。

当用户加入系统时，系统应为其注册 **一个独有 **的 ID。这个独有的 ID 应当被相应的用户使用 **一次**，但是当用户离开系统时，其 ID 应可以被（后续新注册的用户）**再次使用**。

用户可以请求文件中的某个指定的文件块，系统应当返回拥有这个文件块的所有用户的 ID。如果用户收到 ID 的非空列表，就表示成功接收到请求的文件块。

实现 `FileSharing` 类：

- `FileSharing(int m)` 初始化该对象，文件有 `m` 个文件块。

- `int join(int[] ownedChunks)`：一个新用户加入系统，并拥有文件的一些文件块。系统应当为该用户注册一个 ID，该 ID 应是未被其他用户占用的**最小正整数**。返回注册的 ID。

- `void leave(int userID)`：ID 为 `userID` 的用户将离开系统，你不能再从该用户提取文件块了。

- `int[] request(int userID, int chunkID)`：ID 为 `userID` 的用户请求编号为 `chunkID` 的文件块。返回拥有这个文件块的所有用户的 ID 所构成的列表或数组，按升序排列。

**示例:**

```text
输入:
["FileSharing","join","join","join","request","request","leave","request","leave","join"]
[[4],[[1,2]],[[2,3]],[[4]],[1,3],[2,2],[1],[2,1],[2],[[]]]
输出:
[null,1,2,3,[2],[1,2],null,[],null,1]
解释:
FileSharing fileSharing = new FileSharing(4); // 我们用该系统分享由 4 个文件块组成的文件。

fileSharing.join([1, 2]);    // 一个拥有文件块 [1,2] 的用户加入系统，为其注册 id = 1 并返回 1。

fileSharing.join([2, 3]);    // 一个拥有文件块 [2,3] 的用户加入系统，为其注册 id = 2 并返回 2。

fileSharing.join([4]);       // 一个拥有文件块 [4] 的用户加入系统，为其注册 id = 3 并返回 3。

fileSharing.request(1, 3);   // id = 1 的用户请求第 3 个文件块，只有 id = 2 的用户拥有文件块，返回 [2] 。注意，现在用户 1 现拥有文件块 [1,2,3]。

fileSharing.request(2, 2);   // id = 2 的用户请求第 2 个文件块，id 为 [1,2] 的用户拥有该文件块，所以我们返回 [1,2] 。

fileSharing.leave(1);        // id = 1 的用户离开系统，其所拥有的所有文件块不再对其他用户可用。

fileSharing.request(2, 1);   // id = 2 的用户请求第 1 个文件块，系统中没有用户拥有该文件块，所以我们返回空列表 [] 。

fileSharing.leave(2);        // id = 2 的用户离开系统。

fileSharing.join([]);        // 一个不拥有任何文件块的用户加入系统，为其注册 id = 1 并返回 1 。注意，id 1 和 2 空闲，可以重新使用。
```

**提示:**

- `1 <= m <= 10^5`

- `0 <= ownedChunks.length <= min(100, m)`

- `1 <= ownedChunks[i] <= m`

- `ownedChunks` 的值是互不相同的。

- `1 <= chunkID <= m`

- 当你**正确地注册**用户 ID 时，题目保证 `userID` 是系统中的一个已注册用户。

- `join`、 `leave` 和 `request` 最多被调用 `10^4` 次。

- 每次对 `leave` 的调用都有对应的对 `join` 的调用。

**进阶：**

- 当系统以用户的 IP 地址而不是独有 ID 来识别用户，且用户断开连接后以相同 IP 重新连接系统时，会发生什么？

- 当用户频繁加入并退出系统，且该用户不请求任何文件块时，你的解决方案仍然保持高效吗？

- 当所有用户同时加入系统，请求所有文件并离开时，你的解决方案仍然保持高效吗？

- 如果系统用于分享 `n` 个文件，其中第  `i` 个文件由 `m[i]` 组成，你需要如何修改？

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 数据流, 排序, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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

### Java

```java
// Design a File Sharing System：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class FileSharing {
    private int chunks;
    private int cur;
    private TreeSet<Integer> reused;
    private TreeMap<Integer, Set<Integer>> userChunks;

    public FileSharing(int m) {
        cur = 0;
        chunks = m;
        reused = new TreeSet<>();
        userChunks = new TreeMap<>();
    }

    public int join(List<Integer> ownedChunks) {
        int userID;
        if (reused.isEmpty()) {
            ++cur;
            userID = cur;
        } else {
            userID = reused.pollFirst();
        }
        userChunks.put(userID, new HashSet<>(ownedChunks));
        return userID;
    }

    public void leave(int userID) {
        reused.add(userID);
        userChunks.remove(userID);
    }

    public List<Integer> request(int userID, int chunkID) {
        if (chunkID < 1 || chunkID > chunks) {
            return Collections.emptyList();
        }
        List<Integer> res = new ArrayList<>();
        for (Map.Entry<Integer, Set<Integer>> entry : userChunks.entrySet()) {
            if (entry.getValue().contains(chunkID)) {
                res.add(entry.getKey());
            }
        }
        if (!res.isEmpty()) {
            userChunks.computeIfAbsent(userID, k -> new HashSet<>()).add(chunkID);
        }
        return res;
    }
}

/**
 * Your FileSharing object will be instantiated and called as such:
 * FileSharing obj = new FileSharing(m);
 * int param_1 = obj.join(ownedChunks);
 * obj.leave(userID);
 * List<Integer> param_3 = obj.request(userID,chunkID);
 */
```

### Python

```python
# Design a File Sharing System：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class FileSharing:
    def __init__(self, m: int):
        self.cur = 0
        self.chunks = m
        self.reused = []
        self.user_chunks = defaultdict(set)

    def join(self, ownedChunks: List[int]) -> int:
        if self.reused:
            userID = heappop(self.reused)
        else:
            self.cur += 1
            userID = self.cur
        self.user_chunks[userID] = set(ownedChunks)
        return userID

    def leave(self, userID: int) -> None:
        heappush(self.reused, userID)
        self.user_chunks.pop(userID)

    def request(self, userID: int, chunkID: int) -> List[int]:
        if chunkID < 1 or chunkID > self.chunks:
            return []
        res = []
        for k, v in self.user_chunks.items():
            if chunkID in v:
                res.append(k)
        if res:
            self.user_chunks[userID].add(chunkID)
        return sorted(res)


# Your FileSharing object will be instantiated and called as such:
# obj = FileSharing(m)
# param_1 = obj.join(ownedChunks)
# obj.leave(userID)
# param_3 = obj.request(userID,chunkID)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

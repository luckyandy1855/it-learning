# 0355. Design Twitter

---
编号: 355
题目: Design Twitter
难度: 中等
标签: [设计, 哈希表, 链表, 堆（优先队列）]
来源链接: https://leetcode.com/problems/design-twitter/
---

## 题目描述

设计一个简化版的推特(Twitter)，可以让用户实现发送推文，关注/取消关注其他用户，能够看见关注人（包括自己）的最近 `10` 条推文。

实现 `Twitter` 类：

	- `Twitter()` 初始化简易版推特对象

	- `void postTweet(int userId, int tweetId)` 根据给定的 `tweetId` 和 `userId` 创建一条新推文。每次调用此函数都会使用一个不同的 `tweetId` 。

	- `List getNewsFeed(int userId)` 检索当前用户新闻推送中最近  `10` 条推文的 ID 。新闻推送中的每一项都必须是由用户关注的人或者是用户自己发布的推文。推文必须 **按照时间顺序由最近到最远排序** 。

	- `void follow(int followerId, int followeeId)` ID 为 `followerId` 的用户开始关注 ID 为 `followeeId` 的用户。

	- `void unfollow(int followerId, int followeeId)` ID 为 `followerId` 的用户不再关注 ID 为 `followeeId` 的用户。

**示例：**

```text
输入
["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]
[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]
输出
[null, null, [5], null, null, [6, 5], null, [5]]

解释
Twitter twitter = new Twitter();
twitter.postTweet(1, 5); // 用户 1 发送了一条新推文 (用户 id = 1, 推文 id = 5)
twitter.getNewsFeed(1);  // 用户 1 的获取推文应当返回一个列表，其中包含一个 id 为 5 的推文
twitter.follow(1, 2);    // 用户 1 关注了用户 2
twitter.postTweet(2, 6); // 用户 2 发送了一个新推文 (推文 id = 6)
twitter.getNewsFeed(1);  // 用户 1 的获取推文应当返回一个列表，其中包含两个推文，id 分别为 -> [6, 5] 。推文 id 6 应当在推文 id 5 之前，因为它是在 5 之后发送的
twitter.unfollow(1, 2);  // 用户 1 取消关注了用户 2
twitter.getNewsFeed(1);  // 用户 1 获取推文应当返回一个列表，其中包含一个 id 为 5 的推文。因为用户 1 已经不再关注用户 2
```

**提示：**

	- `1 <= userId, followerId, followeeId <= 500`

	- `0 <= tweetId <= 10^4`

	- 所有推特的 ID 都互不相同

	- `postTweet`、`getNewsFeed`、`follow` 和 `unfollow` 方法最多调用 `3 * 10^4` 次

	- 用户不能关注自己

---

## 思路分析

### 突破口

先把题目抽象成稳定的状态或数据结构操作：输入规模决定不能只靠暴力枚举，必须利用题目本身的顺序、结构、数学性质或可复用状态。

### 思路拆解

1. **读清输入输出**：确认要返回的是数值、下标、结构本身，还是一个布尔判断，并把空输入、单元素、边界值单独想清楚。
2. **选择主结构**：根据标签「设计, 哈希表, 链表, 堆（优先队列）」和题目约束，优先考虑哈希表、双指针、栈/队列、树遍历、动态规划或数学化简。
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
import "sort"

// Design Twitter：保存每条 tweet 的时间戳，并按时间倒序选出最近 10 条。
// 关键点：用户默认关注自己；取动态时只扫描自己和关注者的推文。
type Twitter struct {
	time      int
	tweets    map[int][]int
	tweetTime map[int]int
	following map[int]map[int]bool
}

func Constructor() Twitter {
	return Twitter{
		tweets:    map[int][]int{},
		tweetTime: map[int]int{},
		following: map[int]map[int]bool{},
	}
}

func (this *Twitter) PostTweet(userId int, tweetId int) {
	this.time++
	this.tweets[userId] = append(this.tweets[userId], tweetId)
	this.tweetTime[tweetId] = this.time
}

func (this *Twitter) GetNewsFeed(userId int) []int {
	users := map[int]bool{userId: true}
	for followee := range this.following[userId] {
		users[followee] = true
	}

	all := []int{}
	for user := range users {
		all = append(all, this.tweets[user]...)
	}
	sort.Slice(all, func(i, j int) bool {
		return this.tweetTime[all[i]] > this.tweetTime[all[j]]
	})
	if len(all) > 10 {
		all = all[:10]
	}
	return all
}

func (this *Twitter) Follow(followerId int, followeeId int) {
	if followerId == followeeId {
		return
	}
	if this.following[followerId] == nil {
		this.following[followerId] = map[int]bool{}
	}
	this.following[followerId][followeeId] = true
}

func (this *Twitter) Unfollow(followerId int, followeeId int) {
	if this.following[followerId] != nil {
		delete(this.following[followerId], followeeId)
	}
}
```

### Java

```java
// Design Twitter：按照上方思路实现主解法。
// 关键点：保持状态含义清晰，并单独处理边界输入。
import java.util.*;
class Twitter {
    private Map<Integer, List<Integer>> userTweets;
    private Map<Integer, Set<Integer>> userFollowing;
    private Map<Integer, Integer> tweets;
    private int time;

    /** Initialize your data structure here. */
    public Twitter() {
        userTweets = new HashMap<>();
        userFollowing = new HashMap<>();
        tweets = new HashMap<>();
        time = 0;
    }

    /** Compose a new tweet. */
    public void postTweet(int userId, int tweetId) {
        userTweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(tweetId);
        tweets.put(tweetId, ++time);
    }

    /**
     * Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed
     * must be posted by users who the user followed or by the user herself. Tweets must be ordered
     * from most recent to least recent.
     */
    public List<Integer> getNewsFeed(int userId) {
        Set<Integer> following = userFollowing.getOrDefault(userId, new HashSet<>());
        Set<Integer> users = new HashSet<>(following);
        users.add(userId);
        PriorityQueue<Integer> pq
            = new PriorityQueue<>(10, (a, b) -> (tweets.get(b) - tweets.get(a)));
        for (Integer u : users) {
            List<Integer> userTweet = userTweets.get(u);
            if (userTweet != null && !userTweet.isEmpty()) {
                for (int i = userTweet.size() - 1, k = 10; i >= 0 && k > 0; --i, --k) {
                    pq.offer(userTweet.get(i));
                }
            }
        }
        List<Integer> res = new ArrayList<>();
        while (!pq.isEmpty() && res.size() < 10) {
            res.add(pq.poll());
        }
        return res;
    }

    /** Follower follows a followee. If the operation is invalid, it should be a no-op. */
    public void follow(int followerId, int followeeId) {
        userFollowing.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    /** Follower unfollows a followee. If the operation is invalid, it should be a no-op. */
    public void unfollow(int followerId, int followeeId) {
        userFollowing.computeIfAbsent(followerId, k -> new HashSet<>()).remove(followeeId);
    }
}

/**
 * Your Twitter object will be instantiated and called as such:
 * Twitter obj = new Twitter();
 * obj.postTweet(userId,tweetId);
 * List<Integer> param_2 = obj.getNewsFeed(userId);
 * obj.follow(followerId,followeeId);
 * obj.unfollow(followerId,followeeId);
 */
```

### Python

```python
# Design Twitter：按照上方思路实现主解法。
# 关键点：保持状态含义清晰，并单独处理边界输入。
class Twitter:
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.user_tweets = defaultdict(list)
        self.user_following = defaultdict(set)
        self.tweets = defaultdict()
        self.time = 0

    def postTweet(self, userId: int, tweetId: int) -> None:
        """
        Compose a new tweet.
        """
        self.time += 1
        self.user_tweets[userId].append(tweetId)
        self.tweets[tweetId] = self.time

    def getNewsFeed(self, userId: int) -> List[int]:
        """
        Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user herself. Tweets must be ordered from most recent to least recent.
        """
        following = self.user_following[userId]
        users = set(following)
        users.add(userId)
        tweets = [self.user_tweets[u][::-1][:10] for u in users]
        tweets = sum(tweets, [])
        return nlargest(10, tweets, key=lambda tweet: self.tweets[tweet])

    def follow(self, followerId: int, followeeId: int) -> None:
        """
        Follower follows a followee. If the operation is invalid, it should be a no-op.
        """
        self.user_following[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        """
        Follower unfollows a followee. If the operation is invalid, it should be a no-op.
        """
        following = self.user_following[followerId]
        if followeeId in following:
            following.remove(followeeId)


# Your Twitter object will be instantiated and called as such:
# obj = Twitter()
# obj.postTweet(userId,tweetId)
# param_2 = obj.getNewsFeed(userId)
# obj.follow(followerId,followeeId)
# obj.unfollow(followerId,followeeId)
```

---

## 踩坑记录

- **边界输入不能省略**：空结构、单元素、最小值/最大值经常会让主循环少跑或多跑一步，需要在实现前先写清楚。
- **状态含义要稳定**：哈希表、窗口、队列、递归返回值或 DP 数组的含义一旦混乱，后续更新就会出现 off-by-one 或漏统计。
- **返回值和中间状态不同**：有些题最终返回的是答案变量，有些返回修改后的结构或最后状态，不能把调试过程中的中间值直接返回。

# LeetCode 解题文档系统执行计划

**来源设计稿**：`docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md`

**目标**：按设计稿落地一套 LeetCode 解题文档系统，形成稳定模板、索引、目录说明和批量题解生成流程。单篇题解需包含完整中文题目转述、清晰思路分析、按题型匹配的代码实现（含完备注释）、复杂度分析和踩坑记录。

**实施原则**：

- 以 `leetcode/0001-two-sum.md` 作为当前样例基准。
- 不在单篇正文中加入验证表、提交记录、状态字段或 Mermaid 图。
- 题目描述要能让读者离开官方页面也看懂要求，使用中文完整转述，保留示例和关键约束。
- 难度、标签、题目链接以 LeetCode 官方页面为准，AI 不凭记忆硬填；未经核对的字段标注 `待校准`。
- 代码实现按题型选择语言：普通算法题默认 Go / Java / Python；数据库题用 SQL；Shell 题用 Bash；交互、系统设计或平台特定题按 LeetCode 实际提交形态处理，不强行套三语言模板。
- **每批 50 题**，每批完成后在本计划对应批次标记 `✅ Done`，方便断点续传。
- Notion 同步由用户手动操作，执行计划不涉及任何 MCP/Notion 调用。

---

## File Structure

- `docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md`：设计稿，执行前必须阅读。
- `leetcode/_template.md`：单篇题解标准模板。
- `leetcode/README.md`：题解总索引（跨所有子目录）。
- `leetcode/0001-0100/0001-two-sum.md`：当前样例题解。
- `leetcode/{起始}-{结束}/{4位题号}-{题名-kebab-case}.md`：题解文件路径格式。
- `docs/项目目录结构.md`：仓库目录说明，需要补充 `leetcode/` 目录定位。
- `README.md`：项目总览，必要时补充算法知识库入口。

---

## Task 1: 校准模板与样例

**Files:**

- Read: `docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md`
- Read: `leetcode/0001-0100/0001-two-sum.md`
- Modify: `leetcode/_template.md`

- [ ] **Step 1: 读取设计稿和样例**

Run:

```bash
sed -n '1,260p' docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md
sed -n '1,260p' leetcode/0001-0100/0001-two-sum.md
```

Expected: 设计稿和样例都使用轻量元数据；正文包含 `题目描述`、`思路分析`、`复杂度分析`、`代码实现`、`踩坑记录`；没有 `验证记录`、`提交记录`、`状态`、Mermaid 图。

- [ ] **Step 2: 对齐模板章节**

检查 `leetcode/_template.md` 是否包含以下结构：

```markdown
# {编号4位}. {题目名}

---
编号:
题目:
难度:
标签:
来源链接:
---

## 题目描述
## 思路分析
## 复杂度分析
## 代码实现
## 踩坑记录
```

Expected: 模板结构与 `0001-0100/0001-two-sum.md` 一致；示意图使用 ASCII 或 `text` 代码块；Java 模板提示补全 import。

- [ ] **Step 3: 检查旧字段残留**

Run:

```bash
rg -n "Mermaid|验证记录|提交记录|题目链接|待验证|已验证|标签来源:|状态:" leetcode/_template.md leetcode/0001-0100/0001-two-sum.md
```

Expected: 无命中；如命中，删除或改写为当前模板结构。

---

## Task 2: 建立 LeetCode 总索引

**Files:**

- Create/Modify: `leetcode/README.md`
- Read: `leetcode/*.md`

- [ ] **Step 1: 创建索引文件**

若 `leetcode/README.md` 不存在，创建：

```markdown
# LeetCode 题解索引

| 题号 | 题目 | 难度 | 标签 |
|------|------|------|------|
| 0001 | [Two Sum](0001-two-sum.md) | 简单 | 数组、哈希表 |
```

Expected: 索引不包含状态列；链接指向同目录下题解文件。

- [ ] **Step 2: 验证索引链接与文件同步**

Run:

```bash
# 列出索引中所有链接目标文件名
grep -oE '\([0-9]{4}-[^)]+\.md\)' leetcode/README.md | tr -d '()'

# 列出实际存在的题解文件
ls leetcode/[0-9][0-9][0-9][0-9]-*.md
```

对比两份列表，确保索引中每个链接目标文件都实际存在；不存在的条目须删除或补生成。

- [ ] **Step 3: 保持索引字段简洁**

Run:

```bash
rg -n "状态|待验证|已验证|提交|Accepted" leetcode/README.md
```

Expected: 初版索引不包含状态或提交记录；后续如要管理刷题进度，单独扩展，不混入单篇正文。

---

## Task 3: 同步仓库目录说明

**Files:**

- Modify: `docs/项目目录结构.md`
- Modify: `README.md`

- [ ] **Step 1: 更新目录结构说明**

在 `docs/项目目录结构.md` 的目录总览中加入：

```text
├── leetcode/                        # 个人算法题解知识库
```

并在"各目录怎么用"中增加 `leetcode/` 小节：

```markdown
### `leetcode/`

放个人算法学习题解。

每道题一个 Markdown 文件，文件名使用 `{4位题号补零}-{题名-kebab-case}.md`。单篇题解包含题目转述、思路分析、复杂度、按题型匹配的代码实现和踩坑记录。普通算法题默认 Go / Java / Python；数据库题使用 SQL；Shell 题使用 Bash；其他特殊题按 LeetCode 实际提交形态处理。这个目录独立于内容选题和运营数据，不进入 `content/` 或 `data/`。
```

- [ ] **Step 2: 更新项目总览**

在 `README.md` 的目录总览和使用方式中补充 `leetcode/`，说明它是个人算法题解知识库。

- [ ] **Step 3: 验证目录说明一致**

Run:

```bash
rg -n "leetcode|算法题解|题解知识库" README.md docs/项目目录结构.md
```

Expected: 两个文件都能找到 `leetcode/` 的定位说明，且没有把它描述成内容选题目录。

---

## Task 4: 批量生成题解

**Files:**

- Read: `leetcode/_template.md`
- Create: 每批 50 题的 `.md` 文件，放入对应子目录（如 `leetcode/0001-0100/`）
- Modify: `leetcode/README.md`

### 元数据获取规则（执行前必读）

难度、标签、题目名称、slug 不得凭 AI 记忆填写，需通过以下方式之一核对：

- **用户提供**：截图、CSV 导出、或明确口头告知每题的难度和标签
- **用户授权联网**：用户明确说"可以联网查"时，逐题核对官方页面
- **默认标注**：上述两种方式都不具备时，难度和标签填写 `待校准`，不伪装成官方数据

生成时元数据示例（未核对时）：

```yaml
---
编号: 2
题目: Add Two Numbers
难度: 待校准
标签: [待校准]
来源链接: https://leetcode.com/problems/add-two-numbers/
---
```

### 批次进度追踪

每批完成后在下方对应行末尾追加 `✅ Done`：

| 批次 | 范围 | 状态 |
|------|------|------|
| Batch 1 | 0001-0050 | ✅ Done |
| Batch 2 | 0051-0100 | ✅ Done |
| Batch 3 | 0101-0150 | ✅ Done |
| Batch 4 | 0151-0200 | ✅ Done |
| Batch 5 | 0201-0250 | ✅ Done |
| Batch 6 | 0251-0300 | ✅ Done |
| Batch 7 | 0301-0350 | ✅ Done |
| Batch 8 | 0351-0400 | ✅ Done |
| Batch 9 | 0401-0450 | ✅ Done |
| Batch 10 | 0451-0500 | ✅ Done |
| Batch 11 | 0501-0550 | ✅ Done |
| Batch 12 | 0551-0600 | ✅ Done |
| Batch 13 | 0601-0650 | ✅ Done |
| Batch 14 | 0651-0700 | ✅ Done |
| Batch 15 | 0701-0750 | ✅ Done |
| Batch 16 | 0751-0800 | ✅ Done |
| Batch 17 | 0801-0850 | ✅ Done |
| Batch 18 | 0851-0900 | ✅ Done |
| Batch 19 | 0901-0950 | ✅ Done |
| Batch 20 | 0951-1000 | ✅ Done |
| Batch 21 | 1001-1050 | ✅ Done |
| Batch 22 | 1051-1100 | ✅ Done |
| Batch 23 | 1101-1150 | ✅ Done |
| Batch 24 | 1151-1200 | ✅ Done |
| Batch 25 | 1201-1250 | ✅ Done |
| Batch 26 | 1251-1300 | ✅ Done |
| Batch 27 | 1301-1350 | ✅ Done |
| Batch 28 | 1351-1400 | ✅ Done |
| Batch 29 | 1401-1450 | ✅ Done |
| Batch 30 | 1451-1500 | ✅ Done |

续传时从第一个未标 `✅ Done` 的批次继续。

- [ ] **Step 1: 确认本批范围**

执行前确认本批题号范围，例如：

```text
0002-0050
```

Expected: 范围明确；每批不超过 50 题。

- [ ] **Step 2: 逐题生成 Markdown**

每题按模板生成一个文件，必须满足：

- 路径：`leetcode/{起始}-{结束}/{4位题号补零}-{题名-kebab-case}.md`（子目录按题号段自动确定，如题号 0002-0050 放入 `0001-0100/`）
- 标题：`# {4位题号}. {题目名}`
- 元数据：只包含 `编号`、`题目`、`难度`、`标签`、`来源链接`；未核对字段填 `待校准`
- 题目描述：中文完整转述题意、示例和约束，保证读者不需要打开原题也能看懂
- 思路分析：包含 `突破口`、`思路拆解`（1-4步分点）、`示意图`（ASCII）
- 代码实现：按题型匹配语言，含完备注释（函数头 + 关键逻辑行内 + 边界注释）
  - 普通算法题：默认提供 Go、Java、Python 三种语言。
  - 数据库题：提供 `SQL` / `MySQL` 主解法，不生成 Go、Java、Python 空壳或 TODO 占位。
  - Shell 题：提供 `Bash` / `Shell` 主解法，不生成 Go、Java、Python 空壳或 TODO 占位。
  - 交互题、系统设计题或平台特定 API 题：按 LeetCode 提供的函数签名和主流提交语言选择实现；没有合理签名的语言可以省略。
  - 源数据缺少某语言实现时：优先补一个可读、可解释、与题意一致的实现；无法可靠补全时，省略该语言并说明原因，不保留 `TODO`。
- 踩坑记录：至少 2-3 个真实易错点

- [ ] **Step 3: 同步 README 索引**

每生成一题，在 `leetcode/README.md` 追加一行：

```markdown
| 0002 | [Add Two Numbers](0002-add-two-numbers.md) | 中等 | 链表 |
```

Expected: 题号升序排列；标签使用中文；链接可点击；难度未核对时填 `待校准`。

- [ ] **Step 4: 检查文件命名与路径**

Run:

```bash
rg --files leetcode | sort
```

Expected: 除 `_template.md` 和 `README.md` 外，题解文件均位于对应题号段子目录下，文件名符合 `{4位题号}-{kebab-case}.md`；不存在直接放在 `leetcode/` 根目录下的题解文件。

- [ ] **Step 5: 批次完成，更新进度表**

本批全部生成并通过 Task 5 质量检查后，在本计划的批次进度表对应行末尾追加 `✅ Done`。

---

## Task 5: 质量检查

**Files:**

- Verify: `leetcode/*.md`

- [ ] **Step 1: 检查必备章节**

Run:

```bash
for f in leetcode/[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/[0-9][0-9][0-9][0-9]-*.md; do
  printf "%s\n" "$f"
  rg -c "^## 题目描述|^## 思路分析|^## 复杂度分析|^## 代码实现|^## 踩坑记录" "$f"
done
```

Expected: 每个题解的命中数为 5（对应 5 个核心二级标题）。

- [ ] **Step 2: 检查不应出现的旧结构**

Run:

```bash
rg -rn "## 题目链接|## 验证记录|LeetCode 提交记录|\`\`\`mermaid|状态:|标签来源:|日期:" leetcode
```

Expected: 无命中；如命中，删除或改写为当前模板结构。

- [ ] **Step 3: 检查 Java import**

Run:

```bash
rg -n "Map<|HashMap|List<|ArrayList|Queue<|Deque<|PriorityQueue" leetcode
```

逐一检查命中行所在的 Java 代码块，确认同一代码块顶部已有对应的 `import` 声明。此步骤需人工核对，rg 只能定位候选位置。

Expected: 每个使用标准集合类的 Java 代码块，在代码块内部顶部已补全 import。

- [ ] **Step 3.5: 检查特殊题型语言选择**

Run:

```bash
rg -n "^标签: \\[(数据库|Shell)\\]" leetcode
rg -n "TODO|待补充|补充 .* 解法" leetcode
```

人工核对命中的数据库 / Shell 题：

- 数据库题 `## 代码实现` 应使用 `### SQL` 或 `### MySQL`，不应出现 Go / Java / Python 空壳。
- Shell 题 `## 代码实现` 应使用 `### Bash` 或 `### Shell`，不应出现 Go / Java / Python 空壳。
- 普通算法题不应保留 `TODO` 或“补充某语言解法”的占位；缺少某语言时，要么补齐可解释实现，要么省略该语言并说明原因。

Expected: 无 `TODO` / `待补充` 残留；特殊题型的代码语言与题目真实提交形态一致。

- [ ] **Step 4: 检查题目描述完整性**

人工抽查每篇 `## 题目描述`，确认包含：

- 输入是什么
- 要返回什么
- 至少一个 Example
- 关键约束条件
- 影响解法的保证条件或限制

- [ ] **Step 5: 验证索引与文件同步**

Run:

```bash
grep -oE '\([0-9]{4}-[^)]+\.md\)' leetcode/README.md | tr -d '()' | sort > /tmp/idx.txt
ls leetcode/[0-9][0-9][0-9][0-9]-*.md | xargs -I{} basename {} | sort > /tmp/files.txt
diff /tmp/idx.txt /tmp/files.txt
```

Expected: diff 无输出，索引条目与实际文件一一对应。

---

## Task 6: 最终验收

**Files:**

- Verify: `leetcode/`
- Verify: `README.md`
- Verify: `docs/项目目录结构.md`
- Verify: `docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md`

- [ ] **Step 1: 查看变更范围**

Run:

```bash
git status --short
git diff --stat
```

Expected: 变更集中在 `leetcode/`、目录说明、设计稿或计划文件；没有混入本地编辑器状态、临时文件或无关内容。

- [ ] **Step 2: 检查 LeetCode 目录完整性**

Run:

```bash
rg --files leetcode | sort
```

Expected: 至少包含 `_template.md`、`README.md`、`0001-two-sum.md` 和本批新生成题解。

- [ ] **Step 3: 检查设计稿与模板一致**

Run:

```bash
rg -n "题目描述|思路分析|复杂度分析|代码实现|踩坑记录|ASCII" docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md leetcode/_template.md
```

Expected: 设计稿和模板对核心结构和 ASCII 示意图的要求一致。

- [ ] **Step 4: 人工抽查**

抽查至少 3 篇题解：

- 题目描述是否足够完整，不用打开原题就能看懂
- 思路是否从暴力到优化讲清楚
- 代码注释是否覆盖函数头、关键逻辑、边界处理
- 复杂度是否对应实际解法
- 踩坑是否具体，不是空泛提醒

- [ ] **Step 5: 提交前确认**

如需要提交，先运行：

```bash
git diff -- leetcode docs/项目目录结构.md README.md docs/superpowers/specs/2026-06-17-leetcode-solution-docs-design.md docs/superpowers/plans/2026-06-17-leetcode-solution-docs.md
```

Expected: diff 只包含本次 LeetCode 文档系统相关内容。

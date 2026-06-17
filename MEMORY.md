# MEMORY.md

## 仓库身份

- 仓库名：`it-learning`
- 远程仓库：`git@github.com:luckyandy1855/it-learning.git`
- 主分支：`main`
- 仓库定位：个人学习仓库，内容覆盖 LeetCode、前端学习、AI 应用开发学习资料

## 当前结构认知

- `leetcode/`：按题号区间组织的题解内容
- `前端从入门到AI应用开发/`：课程式学习笔记
- `docs/`：计划、规格、过程说明
- `templates/`：共享模板目录

## 当前长期约定

1. `AGENTS.md` 与 `MEMORY.md` 后续统一使用中文维护。
2. 仓库中的学习型文档默认优先使用中文。
3. 目录重组应显式进行，并尽量保持可审查、可回溯。

## 近期结构决策

除非用户后续明确改变方向，否则默认以下事实成立：

1. `leetcode/README.md` 已被有意删除。
2. 四个辅助脚本已从 `leetcode/scripts/` 移动到 `leetcode/` 根目录：
   - `build_leetcode_indexes.js`
   - `calibrate_leetcode_metadata.js`
   - `generate_leetcode_batch.js`
   - `repair_leetcode_special_topics.js`
3. 原 `leetcode/_template.md` 已移动并重命名为：
   - `templates/leetcode-problem-template.md`
4. 现有部分文档仍可能引用旧路径，后续需要逐步清理。

## 已知后续事项

- 更新仍然引用以下旧路径的文档：
  - `leetcode/_template.md`
  - `leetcode/scripts/...`
- 如果用户希望让 Git 历史更整洁，可以在后续提交中把这些移动整理为更清晰的 rename 记录。
- `leetcode/scripts/` 当前已经为空，如用户希望进一步收尾，可删除该空目录。

## 工作假设

- 本仓库以 Markdown 知识内容为主，而不是典型应用工程代码仓库。
- 结构一致性通常比重自动化更重要。
- 中文内容应尽量保持中文，不随意改成英文。
- 跨目录的大范围整理应保持显式、克制、可复查。

## 当前变更上下文

在本文件创建与更新时，工作区已经包含以下待提交结构变更：

- 删除：`leetcode/README.md`
- 实际迁移：`leetcode/scripts/` 下的脚本移动到 `leetcode/`
- 实际迁移：`leetcode/_template.md` 移动到 `templates/leetcode-problem-template.md`

后续代理在继续做结构整理前，应先查看 `git status`，避免把不相关变更混在一起。

---
name: qinghua-course-authoring
description: "为基础薄弱考生编写或修改英语、政治、353完整教学单元时使用。"
---

# qinghua-course-authoring

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
学习者基础、已核对的知识点、先修课程、可靠来源和课程数据。

## 执行
1. 按现有课程结构编写：可测学习目标、必要前置、通俗解释、定义、适用条件、例题、误区、闭卷回忆、基础/应用/延迟题及详细解析。先讲术语再使用；公式注明单位与条件。
2. 新单元在课程JSON中维护，不把内容写死在UI。先修关系不能循环；目标必须能通过实际回答检验。参考已有样板但不复制改写凑数量。
3. 运行 authoring，随后组合题库验证与内容审核技能。编写完成仅是草稿；将缺失目标或来源明确留作缺口。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs authoring`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
完整草稿、先修依据、学习目标和审核包。 机器报告位于 `audit-2028/skills-authoring-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
缺少解释、闭卷、分层题或来源时不得接入正式课程；禁止自动标记专家审定。

## 权威入口
- [product-2028-draft/representative-courses.json](../../../product-2028-draft/representative-courses.json)
- [product-2028-draft/content/catalog.json](../../../product-2028-draft/content/catalog.json)
- [product-2028-draft/content/assemble-catalog.cjs](../../../product-2028-draft/content/assemble-catalog.cjs)
- [product-2028-draft/build-mobile-pilot.cjs](../../../product-2028-draft/build-mobile-pilot.cjs)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

---
name: qinghua-question-validation
description: "新增或修改题干、选项、答案、解析、主观题评分要点或去重题库时使用。"
---

# qinghua-question-validation

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
当前课程目录、题目及来源；计算题附完整计算过程。

## 执行
1. 运行 questions 获取实际正确答案文字、结构错误、重复题和相似候选。索引必须与选项文字一致。
2. 人工逐题核对唯一正确性、干扰项、难度、知识点与前置；计算需独立重算并检查量纲，专业结论送专家。相似候选只能提示，不自动删题。
3. 主观题提供答案边界、评分要点和遗漏反馈；没有可信评分时保留待核对，不制造总分。修改后重新运行对应批次测试与内容审核。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs questions`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
逐题答案文字清单、错误/重复候选、人工复核结论。 机器报告位于 `audit-2028/skills-questions-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
结构通过不等于专业正确；歧义、多解、缺少解析或评分依据的题不得正式发布。

## 权威入口
- [product-2028-draft/course-engine.cjs](../../../product-2028-draft/course-engine.cjs)
- [audit-2028/course-batch1-test.cjs](../../../audit-2028/course-batch1-test.cjs)
- [audit-2028/batch2-content-test.cjs](../../../audit-2028/batch2-content-test.cjs)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

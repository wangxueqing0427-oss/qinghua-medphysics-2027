---
name: qinghua-exam-analysis
description: "设计章节/阶段/模拟考试、评分规则或分析成绩差距时使用。"
---

# qinghua-exam-analysis

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
考试蓝图：范围、年度依据、时间、题目ID、每题分值、总分和评分方式。

## 执行
1. 区分官方已确认规则与自编训练。先验证所有题目存在、无重复、正分值及总分相符；运行 exam <蓝图JSON路径>。
2. 客观题复用课程判分；主观题未人工核对前只展示要点和待核对，不汇总成完整考试成绩。逐模块列实际答题数量、失分原因与后续训练。
3. 小样本训练不外推350分或录取概率；只有可比的完整模拟与可靠评分才讨论差距，注明模拟而非真实考试。当前蓝图校验不是APP全真考试实现。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs exam`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
训练蓝图校验、评分边界、缺口与下一学习任务。 机器报告位于 `audit-2028/skills-exam-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
缺少官方分值依据不能标官方模拟；主观待核对或覆盖不足不能给可信总分预测。

## 权威入口
- [product-2028-draft/course-engine.cjs](../../../product-2028-draft/course-engine.cjs)
- [product-2028-draft/content/catalog.json](../../../product-2028-draft/content/catalog.json)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

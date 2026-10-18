---
name: qinghua-syllabus-mapping
description: "核验官方招生年度、专业和考纲；映射知识树、课程或题目时使用。"
---

# qinghua-syllabus-mapping

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
官方原始页面、目标年度与专业方向、现有知识树。

## 执行
1. 先打开官方原文核对学校、招生年度、方向、学习方式与科目；逐项记录发布日期、核验日期及未确认字段。不能仅从标题推断。2027大纲用于2028时保留暂定标记。
2. 对照知识树逐节点记录直接依据、教学补充、推断或缺口；候选相似关系不能升级为覆盖。
3. 运行 mapping 工作流生成当前节点清单；政策有变化时记录旧值、新值及受影响课程，先人工核对再修改。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs mapping`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
来源核验记录、节点映射差异与未覆盖清单。 机器报告位于 `audit-2028/skills-mapping-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
官方原文不可访问或专业/年度不一致时保留待核实；不得确定2028最终范围。

## 权威入口
- [product-2028-draft/content/knowledge-graph.json](../../../product-2028-draft/content/knowledge-graph.json)
- [audit-2028/build-knowledge-graph.cjs](../../../audit-2028/build-knowledge-graph.cjs)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

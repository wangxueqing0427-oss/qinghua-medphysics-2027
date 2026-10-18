---
name: qinghua-content-audit
description: "审核课程知识、公式、适用范围或处理专家意见、课程变更后的复核时使用。"
---

# qinghua-content-audit

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
具体课程版本、来源、历史审核记录和审核人资格证据。

## 执行
1. 逐条核对定义、推导、单位、适用条件、例题、矛盾与超纲内容；AI检查只记内部筛查，需专业判断的项目进入独立审核包。
2. 运行 audit，使用现有台账 contentHash 与 appendDecision；不得直接改写 decisions.json。真实审核人身份和资格须外部核实，结构校验不证明身份。
3. 修改课程后比较版本与内容哈希；旧审核保留为历史，不沿用为新内容批准。导出包中保留旧人工意见；冲突、锁定或未归档意见先停止写入。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs audit`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
带版本/哈希/审核人/日期的追加意见、待专家审核包与复核缺口。 机器报告位于 `audit-2028/skills-audit-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
没有独立专业审核证据不得批准；禁止生成虚构审核人或自动升级发布状态。

## 权威入口
- [product-2028-draft/content/review-ledger.cjs](../../../product-2028-draft/content/review-ledger.cjs)
- [product-2028-draft/expert-review/courses-and-answers.json](../../../product-2028-draft/expert-review/courses-and-answers.json)
- [audit-2028/audit-course-catalog.cjs](../../../audit-2028/audit-course-catalog.cjs)
- [audit-2028/review-ledger-test.cjs](../../../audit-2028/review-ledger-test.cjs)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

---
name: qinghua-learning-loop
description: "修改每日任务、判分、错题、复习调度、断点续学或本机档案时使用。"
---

# qinghua-learning-loop

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
真实课程、状态转换、存储版本与可复现的异常场景。

## 执行
1. 沿用控制器与仓储：实际闭卷答案、客观判分、主观待核对、错因、到期延迟题共同构成证据；完成按钮不等于掌握。
2. 检查四种状态、15分钟保底、正常学习和断学恢复；优先到期复习，不累计任务债。先修可开始不等于持续掌握。
3. 运行 learning，再运行完整回归；覆盖失败重试、重复提交、旧草稿、刷新、离线、恢复克隆和内容版本变化。所有测试使用合成档案，禁止清空用户库。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs learning`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
状态变更说明、异常测试结果及证据链。 机器报告位于 `audit-2028/skills-learning-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
答案可能丢失/串档/重复计数时停止候选发布；本机档案不等于在线账户隔离。

## 权威入口
- [product-2028-draft/learning-controller.cjs](../../../product-2028-draft/learning-controller.cjs)
- [product-2028-draft/profile-repository.cjs](../../../product-2028-draft/profile-repository.cjs)
- [audit-2028/round4-reliability-test.cjs](../../../audit-2028/round4-reliability-test.cjs)
- [audit-2028/learning-integration-test.cjs](../../../audit-2028/learning-integration-test.cjs)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

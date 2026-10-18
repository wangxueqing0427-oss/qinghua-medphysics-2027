---
name: qinghua-release-safety
description: "修改程序、执行回归、准备候选构建或发布验收版本时使用。"
---

# qinghua-release-safety

仅用于本仓库工程工作，不是考生页面功能。先读相关现有代码，不重复实现判分、审核或存储。

## 输入
目标分支/提交、改动文件、部署来源及测试范围。

## 执行
1. 先确认工程分支和目标提交；本地无.git时不得虚构提交。记录正式V59与独立候选的来源、存储和SW隔离；不运行历史一次性补丁。
2. 运行 release 执行完整本地门槛；再按CI工作流运行真实Chromium/WebKit。历史浏览器报告不算本轮重跑，VM与浏览器和真实iPhone分开。检查报告时间、提交及构建哈希。
3. 发布前核对备份恢复、异常保存、离线/PWA和隐私版权；仅提供达到门槛的集中候选方案。正式发布须用户验收和明确授权；本技能没有部署命令。线上冒烟必须针对实际部署提交，不能拿R5目录校验旧R4。

从仓库根目录运行（使用当前可用的Node，仓库备有 import-tools/node.exe）：
`node audit-2028/skill-workflow.cjs release`
exam 模式必须追加蓝图路径；其他模式不接受额外参数。脚本错误返回非零，先定位并修复，不忽略失败。

## 输出与质量门槛
提交/哈希/测试类型分列的门槛报告、剩余阻碍和部署方案。 机器报告位于 `audit-2028/skills-release-results.json`。机器报告仅反映所执行检查；人工知识判断单独追加记录。

## 停止条件
缺少授权、测试失败、个人资料混入、构建不一致时停止部署；通过本地门槛不表示iPhone验收通过。

## 权威入口
- [audit-2028/run-internal-gate.cjs](../../../audit-2028/run-internal-gate.cjs)
- [product-2028-ci/workflow.yml](../../../product-2028-ci/workflow.yml)
- [product-2028-ci/playwright.config.cjs](../../../product-2028-ci/playwright.config.cjs)
- [product-2028-draft/开发与验收规范.md](../../../product-2028-draft/开发与验收规范.md)
- [工作流入口](../../../audit-2028/skill-workflow.cjs)

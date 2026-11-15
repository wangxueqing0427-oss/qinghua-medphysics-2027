# Issue4：接续V15的PH03独立草稿

基线为`2cbeee7961f3682ce5ab2bb593f1dec77f9ecc94`。V15固定预览`https://60ec933c.qh2028-core47-preview.pages.dev/`已核验HTTP200、17文件SHA256及实际Edge手机视口闭卷保存/关闭恢复，回执见`v15-preview-evidence.json`。这不是真实iPhone验收。

新增一门PH03基础草稿、4个目标、12道原创题。57课644题只是候选内容量，前56课632题原文与答案逐项保留，哈希清单见`v15-course-lock.json`。不宣称PH03或2028考纲完整覆盖。教材和政策证据边界、访问失败、现行版本限制与仍缺主题见`source-review.json`；真人专业审定0。

`build.cjs`只生成独立`.build`，沿用现有引擎、仓储和UI。新数据库、日志、edition和ServiceWorker缓存与V15不同；不自动迁移，跨版本入口暂时禁用，同候选备份可恢复。仅修复新候选UI提交主观题裁剪空白问题，不修改V15。材料题按参考要点核对，不自动评分。

测试由Codex执行：`node --test product-2028-ph03-candidate/test.cjs`；`node product-2028-ph03-candidate/browser.cjs`。`PH03_PLAYWRIGHT`、`PH03_FAKE_IDB`仅用于本地复用已有测试依赖；LinuxCI使用原项目固定依赖。仅重建依赖资产，不重跑历史测试套件。

候选分支只允许`candidate/2026-11-15-ph03-health-system`。既有Pages入口脚本增加一个精确分支守卫，原V15分支处理保持原样。Cloudflare构建用已存在门禁逻辑等候**同一SHA**的`Verify PH03 candidate`成功；失败不输出新候选。CI后续单独验证Pages实际部署SHA、17文件HTTPS哈希、Chromium/WebKit学习流程。不得合并main或发布生产。

首次浏览器失败均保留：第一次是点击完成后的导航等待/目录查找时序；第二次发现继承UI裁剪主观原文，已仅在新候选修复；第三次是测试在下一题渲染前检查单位，改为等候实际题目ID和练习状态，不删断言。PNG/trace按次编号保留，CI产物保留7天。本地历史在Issue4隔离目录，不上传真实资料或源码压缩包。

未通过候选HTTPS检查前不请用户验收。通过后用户仅进行一次真实iPhone集中验收；自动化移动WebKit不是手机实测。固定V15部署是回退入口，原V15、V14、main与真实学习数据保持不变。

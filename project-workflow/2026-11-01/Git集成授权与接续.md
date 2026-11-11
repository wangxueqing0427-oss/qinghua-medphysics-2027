# GitHub与Cloudflare通道：只读核验及待授权方案

本轮未创建项目、分支、PR、Token、付费资源或部署；未推送或改main。远端只读，配置方案仅本地保存。

核实R2分支fix/2026-10-30-svo-readiness-r2，HEAD14a9b007ca556600613ba761a5223a439073b690的父提交为dc7fab52d635de5dcabb203ee3425c1e4ece7a9d。历史CI40996457034确为该工程SHA成功。两提交中R2输入/输出Git blob一致；本地构建脚本、health.js、manifest和10资产也逐项与被测远端Git blob一致。

10文件：index.html、app.css、icon.svg、manifest.json、course-engine.js、profile-repository.js、learning-controller.js、pilot-ui.js、representative-courses.json、sw.js。源码依赖已提交的R1/.build与R1清单及R2/health.js，不能只拉取R2目录运行。拟从仓库根目录使用Node22执行node product-2028-svo-offline-r2/build.cjs，Pages输出product-2028-svo-offline-r2/.build；不需要前端npm依赖。现构建脚本检查输入hash，但不清除已有输出多余文件，也不独立比对输出与已审manifest，因此接通前还须小型只读白名单/固定manifest构建门槛，不能把脚本成功直接当安全发布。

拟新项目qh2028-svo-git-preview（未查重/未创建），连接现仓库，预览仅纳入R2精确分支；其他分支不自动公开。默认生产分支不设main，使用另行授权建立的专用占位分支，并关闭自动生产部署。创建连接项目可能触发首次构建，必须先获得明确创建和初次测试部署授权，不在本次只读任务执行。旧Direct Upload不能原地转换，保留qh2028-svo-c1-test和所有回退部署，不更改其域名、路由或数据。

本地AGENTS.md新增2026-11-01规范，远端仍是旧文本，确需在授权的独立配置分支同步AGENTS、开发与验收规范及其引用的新规范文件，避免断链。本轮不修改远端AGENTS。更换配置分支时现CI只匹配精确R2分支，需同时调整对应push/PR触发范围，不可假定新分支已有CI。PR以独立集成分支为目标，不向main合并。

授权最小方案：用户批准后由Codex准备全部代码/PR配置；仅在实际Cloudflare连接流程要求时，用户在GitHub确认Cloudflare Workers & Pages App的Only select repositories，只选qinghua-medphysics-2027，不选All repositories，不提供Token、密钥或命令行。已有App若已覆盖仓库可能不需新授权；当前未查看账户安装状态，不能保证一定仅一次点击。Cloudflare会话登录/敏感同意若出现需集中交接；项目创建与配置不由一次GitHub安装自动完成。目前工具无已确认可用的Cloudflare管理接口或浏览器会话控制，不能声称授权后Codex已能完全自动完成首次配置，也不要求用户手工上传。

后续路径：分支提交→定向CI→已连接项目生成Preview并在PR展示→从GitHub Checks取得实际部署URL/SHA→Codex HTTPS下载10文件比hash、执行实际浏览器线上冒烟→只在通过后交付。Git推送和PR关联可触发/展示预览，PR不是把未接通项目自动创建出来。GitHub API可读取远端检查，自动化串联脚本尚待实施验证，不宣称已经接通。

新项目来源与旧站不同，Safari本地记录不会自动共享；新测试来源只用合成/新测试档案，不要求重建旧站档案，不读取迁移真实记录。原站是保留的旧环境，不是不同origin之间的学习数据自动回退。

依据已实际阅读的Cloudflare官方文档：GitHub集成的分支/PR预览与GitHub App限定仓库权限；Branch deployment controls的生产自动开关、Custom branches；Direct Upload的不可切换说明。链接和核验哈希见同目录JSON。正式部署、费用、main及真实数据均继续受保护。下一步等待对新项目及初次测试部署的明确授权；本轮不要求用户命令行操作。

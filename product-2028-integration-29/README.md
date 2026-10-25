# 29课隔离集成验证

课程输入固定自现有`course-development-2026-10-25/load-batch.cjs`，29课307题；不制作课程，不修改原目录/答案/审核状态。所有档案是合成测试记录，独立专业审定仍0。

## 隔离边界

- `build.cjs`仅向本目录`.build/`写入预览。复用原界面、引擎与仓储，未运行R5构建器。
- 仅对生成副本更改脚本后缀、测试标识、数据库名、草稿前缀及PWA缓存名。原程序和课程用保护哈希复核。
- 本机/CI服务只绑定`127.0.0.1:5289`，静态文件白名单拒绝源码/数据/调试路径。没有公开站点或生产链接。
- 数据库`qh2028_isolated_set29_v1`、草稿`qh2028_set29_pending_v1:`、缓存`qh2028-isolated-set29-*`均独立。不是在线账户认证。
- `.build`、浏览器运行时、合成备份下载不提交；CI不上传任何学习档案或教材缓存。

## 执行入口

从仓库根目录：

1. `node product-2028-integration-29/build.cjs`
2. `node product-2028-integration-29/local-test.cjs`
3. 在`product-2028-ci`使用原package.json固定依赖安装；`npx playwright install --with-deps chromium webkit`。
4. 同目录`npx playwright test --config=../product-2028-integration-29/playwright.config.cjs`。
5. 根目录`node product-2028-integration-29/summarize.cjs`将实际结果写CI作业日志，未生成结果时明确notRun。

Windows本机没有已安装Playwright依赖，历史沙箱启动失败不反复尝试；本轮真实浏览器入口为新增Linux工作流。一次Node语法检查遇EPERM，获准沙箱外只解析脚本后通过，不称为浏览器通过。

## 证据含义

本地`local-results.json`是29课同一合成档案的307次答题及fake IndexedDB模拟，不是浏览器。CI再次执行并另记提交。

浏览器预期每项目37项：29课各自真实点击、讲解隐藏、闭卷输入/刷新、初测、批改、错因、到期延迟题；另含菜单/作用域、三科草稿切换、失败重试、离线重载/恢复联网、备份下载恢复、同名档案、版本冲突及PWA更新。先修课程通过实际UI回答解锁，未伪造完成标记。

每门课在独立浏览器上下文验证，不把浏览器中每课独立档案误说为一档案全部29课（后者由本地/CI合成仓储测试验证）。离线、故障及缓存升级使用代表性课程；缓存包包含全29课，未声称307题逐题在所有网络条件下实测。

Chromium、Linux移动视口WebKit、模拟IndexedDB和真实iPhone严格分开。无真实iPhone验收、公开部署或正式发布许可。主观题参考评分，不给虚构自动分数；答案变更仅在内存负向夹具测试中发生，原题哈希保持。

本轮结束后停止，下一批课程另行执行。实际CI提交、通过/失败数量、缺陷与重跑记录见后续追加的evidence文件，不把预期测试数写成已通过。

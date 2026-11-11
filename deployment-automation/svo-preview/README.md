# SVO R2无Token自动预览通道

状态：GitHub代码、配置与测试正在本轮独立分支实施。Cloudflare项目未连接，config.cloudflareConnected=false。此标志只控制真实线上验证任务是否具备外部环境，不能关闭白名单、保护或浏览器测试。配置更改为true必须以实际连接证据为依据。

## 实际构建与阻断顺序

1. GitHub push / PR执行`.github/workflows/svo-preview-gate.yml`的`Verify SVO candidate`，固定10文件、缺陷阻断单测、原代码保护及Chromium/WebKit回归均成功后，job才成功。
2. Pages Git原生构建可能与Actions并行，不能仅使用job.needs宣称已阻止Pages部署。Pages必须配置命令`node deployment-automation/svo-preview/pages-build.cjs`；此脚本读取CF_PAGES_COMMIT_SHA及CF_PAGES_BRANCH，通过GitHub公开只读API确认同一提交、同一候选分支、同仓库、指定工作流的验证job成功。失败立即拒绝，缺少结果最多等待8分钟，API403/超时关闭放行。不会创建或索取Token。
3. 门槛通过后，在系统临时目录复用原R2生成脚本；原R1/R2/C1及47课不覆盖。固定清单独立保存在pinned-assets.json，对照原已测SHA256，校验根目录仅10个普通文件，无嵌套目录/软链接/多余文件。输出不存在时才写入public，陈旧输出直接拒绝，不递归删除任何原件。
4. public里只有10个静态文件；代码、流水线、审核资料、测试截图、备份及私有资料不会进入部署输出。失败无可部署输出。
5. 连接实际完成后，配置标志为true；CI的线上job等待Cloudflare同一SHA的成功check，提取限定项目的版本化HTTPS地址，逐文件比对SHA256，并在真实Chromium/WebKit用独立合成档案检查缓存就绪及闭卷保存恢复。抓不到URL时失败，不猜测网址、不把CI成功当线上部署成功。

## Cloudflare一次性配置（Codex负责，不要求用户手工上传）

新项目`qh2028-svo-git-preview`，Pages而非Workers；免费，不买域名、不绑定D1/KV/R2或其他存储、不设密钥。GitHub App只选择`wangxueqing0427-oss/qinghua-medphysics-2027`，不选全部仓库。

仓库根目录为空（repository root）；Node22；构建命令见上；输出`deployment-automation/svo-preview/public`。生产分支`integration/svo-preview-base`，关闭自动production部署。该隔离占位分支当前没有构建入口，创建项目时若系统尝试初始production build会失败关闭，不应切到main补救。候选分支只纳入`automation/2026-11-01-svo-preview`及`preview/svo-*`。排除main、engineering/*、audit/*、courses/*。根域名仅是新的测试项目根域名，不替换原站或正式产品。新项目名可用性尚待Cloudflare实际确认。

PR从候选分支指向`integration/svo-preview-base`，不指向main，不合并任何受保护分支。PR和分支触发测试/关联Preview，GitHub App不是创建Pages项目的替代品。Pages设置实际保存后才把连接状态标为true。

## 当前阻碍及集中授权

2026-11-01实际尝试Computer Use读取现有Edge/Cloudflare窗口时，工具因无法可靠识别网址停止。未输入、未修改设置、未创建项目；不重试点击、不绕过限制、不搜索浏览器会话凭据。当前无可用Cloudflare管理连接器，不能声称GitHub侧完成就等于Cloudflare侧完成。

唯一GitHub授权入口：https://github.com/apps/cloudflare-workers-and-pages 。用户仅需在官方授权界面选择Only select repositories及本仓库，完成Install/Authorize或Configure；不发送截图、Token、密码或命令行。授权是敏感访问步骤，由用户本人完成。现有安装可能已经覆盖仓库，未实查，不编造必须重新安装。

由于Cloudflare控制工具仍受限，单次GitHub授权并不保证首次项目配置也已完成。项目配置仍由Codex承担；恢复受支持的浏览器控制或可用Cloudflare管理连接器后继续，不把用户手动部署作为兜底。若实际登录验证或GitHub授权必须人工，集中一次交接，后续不需要用户每次上传。

## 保护与证据

原站qh2028-svo-c1-test及其69376b42、b21ad0dd部署不操作。main/V59/R5/原C1/原证据分支与真实学习记录不操作；新项目不同来源不共享原Safari档案，不进行迁移。原47课不扩容、不变更答案，独立专业审定0。

原R2验证脚本原样复用，SOURCE_SHA指定实际checkout的PR head。GitHub事件merge SHA与实际被测head分列；Cloudflare仅接受被测head的job证据。`protect.cjs`以14a9b00为基线限制差异为规范文档和新增自动化文件，同时复核47课及固定R2资产。自动化故障注入、真实浏览器、线上测试、真实iPhone必须分别报告。

本地命令仅供工程追溯，用户不执行：`node --test deployment-automation/svo-preview/automation.test.cjs`。正式候选门槛在LinuxCI运行保护和复用的R2浏览器测试。线上任务在未连接时明确不运行，报告为“环境未接通”，不是测试通过。

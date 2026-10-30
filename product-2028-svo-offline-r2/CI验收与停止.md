# R2定向CI验收及停止记录

被测工程：dc7fab52d635de5dcabb203ee3425c1e4ece7a9d。分支fix/2026-10-30-svo-readiness-r2。

实际CI：https://github.com/wangxueqing0427-oss/qinghua-medphysics-2027/actions/runs/40996457034 ，job123870612789成功。实际命令：node product-2028-svo-offline-r2/protect.cjs；node product-2028-svo-offline-r2/regress.cjs。Linux Playwright1.64.0，Chromium和iPhone13视口WebKit各8场景（2旧产品缺陷观察、6修复验证），合计16/16，失败0。不能将旧故障观察成功计作旧产品通过。修复阶段场景为12/12，不是16个新增产品功能。

本地Windows Edge Chromium同一8场景通过；首次两个测试操作错误及修复保留在local-first-failure/results.json，截图/trace的本地保存哈希见first-failure-integrity.json。CI首次运行成功，未发生CI失败后删除断言或跳过场景。CI附件12950739389包含实际旧故障截图、所有trace及请求记录，SHA256 96f53b8e38213ce0ff019a52aaf63e479060e556a0a4d36b981f15168db68c89，7天保留。长期机器回执final-ci-receipt.json保留全部场景和保护结果。

保护：原Git跟踪文件全部无改动、原R1十资产原哈希一致、47课哈希一致，候选仅HTML、UI离线启动段及Worker三文件变化；课程、评分、存储及数据格式原样。main、原课程、原C1、原证据、R1分支头只读核对不变，详见回执。未读写用户真实数据、未部署、未访问Cloudflare写入口、未产生付费或对外联系。

工程与证据提交分别记录，不将本回执提交当作实际被测工程。部署方案见故障与接续.md：若获下一次授权，核对dc7fab5的10文件和SHA256，保留现69376b42及b21ad0dd回退，仅更新同一独立项目。当前公网仍为R1，手机验收继续暂停，不要求用户测试未上线R2。用户iOS的具体故障阶段尚无法唯一确定，真实Safari/PWA生命周期仍需获部署授权后再集中复验。独立专业审定0。完成本轮后停止。

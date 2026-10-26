# SET47隔离增量浏览器验证

基线2cb1bb8dcd4c9f359cdf463b57dbdce02ef6c41c，仅课程分支；复用SET38构建与Playwright流程，新目录不改变旧38验证原件。课程加载器直接使用第四批47课523题，无题目或答案转换。

端口5307，仅绑定127.0.0.1；数据库qh2028_isolated_set47_v1，临时日志qh2028_set47_pending_v1:，独立SW缓存qh2028-isolated-set47-。不是部署地址，不提供手机交付链接。

浏览器范围：新增9课完整初学和到期延迟闭环，加SVO、实践检验和变量类型三科旧课代表；旧38课程响应→47课程响应进度兼容；三科草稿、同名本机档案隔离；离线缓存提交、保存失败重试、下载备份恢复、答案变化负例及PWA更新。特殊检查包括真实英文生产原文、阅读题证据句、史纲时间锚点和复制品范围、数值非数字拒绝与单位反馈。数值单位当前由题目固定显示/保存，不存在用户切换单位控件，不能声称测试了手填错误单位。

本地运行`node product-2028-integration-47/build.cjs`及`node product-2028-integration-47/candidate-check.cjs`。Windows Node入口lstat权限限制可用--preserve-symlinks --preserve-symlinks-main运行普通脚本；若继续失败停止重试。本机无Playwright依赖，不重复尝试Windows浏览器初始化。

真实浏览器由新增course-set-47-incremental工作流在Linux运行固定Playwright1.64.0、Chromium和iPhone13视口WebKit。无自动重试、无跳过；保存首次失败JSON，失败时上传合成测试截图/trace（7天）。不是物理iPhone或Safari正式验收。summarize输出实际GITHUB_SHA与构建哈希，CI链接及结论在evidence追加归档。

保护：本地387个SHA256（包括7份私有图谱及原R5缓存差异），CI380个实际远端Git blob，二者不混算。所有旧远端blob在提交树比较中保持原值。不运行会覆盖历史证据的全量一次性脚本，不合并、不部署、不碰真实学习数据。

专业审核只增量引用第四批待审记录，旧47道优先题不变。程序通过不等于专业批准、真实iPhone验收或350分预测。完成本轮即停止，不制作第五批。

首次运行40206948372因系统依赖下载119MB耗时33分3秒而耗尽35分钟预算，仅日志确认10项Chromium通过，非整套通过；完整记录见evidence/first-ci-40206948372.json。后续采用官方固定镜像mcr.microsoft.com/playwright:v1.64.0-noble预装浏览器/系统依赖，并显式检查Chromium与WebKit可执行文件；npm仍使用原固定测试依赖。测试用例和断言不变。无完整JSON报告时标记reportUnavailable，不再将部分执行误写成notRun。

# Issue8 批次C

继承批次B的65课728题，课程对象保持不变。本轮唯一代码行为修复是诊断主观答案保留首尾空白；校验及评分边界不降低。

执行：`node build-upstream.cjs` → `node build.cjs` → `node coverage.cjs` → `node --test test.cjs` → `node browser-all.cjs`。复用已有Playwright与fake IndexedDB，不安装新框架。browser.cjs以临时合成持久浏览器上下文测试三科及进程重启；结果仅存results，不包含真实数据。

预览必须通过exact-SHA CI门禁及17文件HTTPS哈希与双浏览器冒烟，失败时不发布。历史B、A、PH05和固定预览保留。独立专业审核0；参见学习可用性与缺口.md与coverage.json。

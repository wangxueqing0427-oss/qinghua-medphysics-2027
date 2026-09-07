# 清华医学物理 2027｜第一版手机备考 PWA

这是一个无需数据库、无需服务器后端的第一版备考控制台：
- 今日任务与打卡
- 正常/忙碌/出差/饭局后模式
- 倒计时
- AI抽背提示词
- 临时任务
- 手机端可安装为网页 App
- 数据保存在浏览器本地

## 最快使用方式：GitHub Pages
1. 登录 GitHub，新建一个公开仓库，例如 `qinghua-medphysics-2027`。
2. 把本文件夹内的全部文件上传到仓库根目录。
3. 进入仓库 Settings → Pages。
4. Source 选择 `Deploy from a branch`，Branch 选择 `main` 和 `/ (root)`，保存。
5. 等待发布后打开 GitHub 给出的 Pages 地址。
6. iPhone Safari 打开该地址 → 分享 → 添加到主屏幕 → 选择“作为网页 App 打开”。

GitHub Pages 会直接发布静态 HTML/CSS/JS 文件；公开仓库在 GitHub Free 下可使用。不要把身份证、银行卡、未公开个人信息等敏感资料上传到公开仓库。

## 本地电脑预览
如果电脑装了 Python，可以在此文件夹打开终端运行：
`python -m http.server 8000`
然后电脑浏览器访问：
`http://localhost:8000`

注意：iPhone 无法直接访问你电脑的 localhost；要在手机上长期使用，请部署到 GitHub Pages 或其他 HTTPS 静态托管。

## 下一版规划
1. 353 真题导入
2. 真题→章节→知识点自动关联
3. 错题库
4. 间隔复习算法
5. 每日自动任务
6. 英语真题记录
7. 政治进度
8. PDF/Markdown资料索引
9. 学习时长统计
10. AI教练接口

这版先不要放受版权保护的整本教材/真题文件到公开仓库。

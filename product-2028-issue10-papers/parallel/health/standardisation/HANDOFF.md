# 直接年龄标准化接续（2026-11-19）

已核当前81课包的353课表。`353-cohort-risk-smr-followup`只有间接SMR例；`353-health-indicators-ethics`讲生命表量与群体评价；`353-bias-control-foundation`讲候选混杂与分层控制，但没有共同权重直接法完整课。因此本次补真实缺口，不重写SMR。

`353-direct-age-standardisation-foundation.json`包含4可测目标、8段从零讲解、两层分步计算、4闭卷提示及基础/应用/延迟各4原创题。先修率/比例、人时与现成cohort/SMR。主要数据的分母明确为同年年龄层累计观察人年；跨年龄时拆分时间，死亡按发生年龄归层。甲粗2.8、乙6.5，层率甲1/10、乙0.5/8（均每1000人年）；共同半半标准下甲5.5、乙4.25。假想事件数55与42.5用来复核，不当作观察死者数。改标准、交叉层率和未知层率边界均有解释或练习。

本轮实际打开并读到：DHSC/PHE《Directly standardised rates》HTML59–78（公式、人群或人年分母、标准权重）；CDC WONDER/NCHS帮助118–135、1193–1202（粗率、直接法、假想比较指数、标准依赖与年龄范围）。URL、读取范围与未采用事项在单元sourceEvidence。没有用搜索摘要充当正文依据；不移用美国默认标准、显示舍入或英国发布门槛作为中国现行规定。2027大纲仍仅为2028暂定参考；mapping STAT02为教学补充，非最终范围确认。

`test.cjs`复用既有CourseEngine/O.validateObjectives。`test-receipt.json`首轮10项通过：真实先修、四目标映射、12题唯一性、全部选项与数值单位、独立从事件/人年重算两地粗率与共同结构反转、加权平均/假想事件数等价、延迟新数据、权重缩放不变及零分母拒绝、原始回答序列化。测试没有改保护包哈希，不生成专业自动评分。

执行命令：`C:/Users/王学庆/Desktop/清华大学/import-tools/node.exe --preserve-symlinks --preserve-symlinks-main product-2028-issue10-papers/parallel/health/standardisation/test.cjs`。build-draft.cjs只生成本目录单元，不是共享包补丁。

仅本子目录新增文件，尚未接入共享构建。根代理集成后才可计为82课932题、353为42课480题（以集成时实际基线再核）。本次不是部署验收：浏览器、离线、移动/真实iPhone均未验证；独立专业审定0。还缺直接率区间、稀疏资料实务、完整混杂与因果课程。本轮定向测试不能替代共同工作流、章级覆盖或专家审定；候选副本仍无audit-2028/skill-workflow.cjs，不能声称四模式已执行。

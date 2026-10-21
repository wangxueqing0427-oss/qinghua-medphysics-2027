# 四项知识缺口：外部原始资料交叉核查 v7

- 核查日期：2026-10-21
- 基线证据提交：`a3a6a31cce210f5608a08764cc8489a9a72d89c1`
- 本记录所在分支：`audit/2026-10-21-four-gaps-v7`
- 范围：仅追加证据交叉核查与修订建议；不改原始知识点、v6a汇总、课程草稿、V59、R5或真实学习数据。
- 审核边界：公开原始资料已读取的内容可支持有限范围内的事实核查；不等于独立医学物理专家审定。专家审定数仍为0。

## 1. 阵列采样与空间分辨率（mp-03-point-7）

### 已读取的原始资料

1. Stedem A-K, Tutty M, Chofor N, et al. “Systematic evaluation of spatial resolution and gamma criteria for quality assurance with detector arrays in stereotactic radiosurgery.” *Journal of Applied Clinical Medical Physics*, 2024. DOI: [10.1002/acm2.14274](https://doi.org/10.1002/acm2.14274). 已读取全文HTML中的摘要、引言、方法、结果与结论；重点定位为§1、§2.2、§4、§5。
2. Miften M, Olch A, Mihailidis D, et al. “Tolerance limits and methodologies for IMRT measurement-based verification QA: Recommendations of AAPM Task Group No. 218.” *Medical Physics*, 2018. DOI: [10.1002/mp.12810](https://doi.org/10.1002/mp.12810). 已读取摘要与空间分辨率相关正文。

### 直接支持的范围

- 阵列的空间采样受探测元件尺寸、元件间距和单个元件的横向响应共同影响。
- 剂量分布的空间分辨率会影响γ分析；粗采样、插值方式、剂量梯度和DTA设置都可能影响比较结果。
- 2024年研究以两种SRS计划和指定设备为对象，计算得到所研究剂量分布所需探测间距约1.9–5 mm；研究还发现提高阵列密度并不必然提高错误检出能力，因为非关键区域中更多通过点可能抬高整体通过率。
- 该研究的设备、计划与SRS情景不能推广成所有患者QA阵列的通用间距标准。

### 当前判断与缺口

**有限支持，不关闭原主张。** 直接证据支持“采样间距/响应会影响空间信息重建与QA敏感性”；但若原主张涉及统一分辨率阈值、所有阵列或患者QA普适结论，当前证据不足。下一步须将原句逐字映射到证据，并核实其所指是测量阵列、TPS剂量网格还是γ计算网格，不能混为一谈。

## 2. 电子射程与能量经验关系（mp-05-point-4）

### 原始资料与直接矛盾

1. IAEA, *Radiation Oncology Physics: A Handbook for Teachers and Students*, STI/PUB/1196 (2005), §8.2.1, 印刷第281页/PDF第319页，式(8.5)。官方PDF：[IAEA原文](https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf)。原书正文及页面图像均已核对：该式写作
   `E_{p,0} = 0.22 + 1.09 R_p + 0.0025 R_p^2`
   并定义 `E_{p,0}` 为水模体表面的最可几能量（MeV），`R_p` 为水中的实用射程（cm）。
2. Mackie TR et al. “Mean energy, energy-range relationships and depth-scaling factors for clinical electron beams.” 1996. PubMed PMID: [8815379](https://pubmed.ncbi.nlm.nih.gov/8815379/)。已读取论文摘要。该原始研究给出的同类关系为
   `E_{o,p} = 0.22 + 1.98 R_p + 0.0025 R_p^2`
   并报告其适用于5–50 MeV临床电子束，关系精度约3%。
3. IAEA, *Absorbed Dose Determination in External Beam Radiotherapy*, TRS-398 (2000), §7.2及附录II.4.3，官方PDF：[IAEA TRS-398](https://www-pub.iaea.org/mtcd/publications/pdf/trs398_scr.pdf)。该文件另给出 `E_0=2.33R_{50}` 以及 `R_p=1.271R_{50}-0.23`（深度以g/cm²表示），但这些是涉及不同能量/深度参数的关系，不能单独用于裁定式(8.5)的系数。

### 当前判断

这里已发现**可明确定位的来源间公式冲突**：IAEA 2005教材印刷为1.09，而Mackie等人的原始研究给出1.98；能量定义、射程符号及二次项形式表面上对应同类经验关系。1.98是有原始研究支持的修订候选，1.09高度疑似印刷错误。

但本记录不宣称取得了IAEA正式勘误，也不覆盖原书证据。**教学处理建议：**在独立专业审核前，不把印刷版1.09用于计算；不静默改写教材。将“原书1.09与原始研究1.98的冲突”作为明确审核问题，要求审核者确认公式适用能区、符号定义及推荐教学版本。

这项新发现应在后续派生状态中记录为“来源间公式冲突待专业裁定”，不能继续把该问题仅描述成“原书已印证、科学性未有任何第二来源”的旧状态；v6a历史台账本身保持不变。

## 3. CT转换与质子射程不确定性（mp-10-point-3）

### 已读取的原始资料

1. AAPM Task Group 202, *Physical Uncertainties in the Planning and Delivery of Light Ion Beam Treatments*, Report 202 (2020). [官方完整PDF](https://www.aapm.org/pubs/reports/RPT_202.pdf)。已读取摘要，以及§5（X-ray CT number不确定性）、§6（绝对/相对线性阻止本领）、§7（CT number至RLSTP转换）和§10.6（数学稳健优化）相关正文。
2. Farr JB et al. “Clinical commissioning of intensity-modulated proton therapy systems: Report of AAPM Task Group 185.” *Medical Physics*, 2021. DOI: [10.1002/mp.14546](https://doi.org/10.1002/mp.14546)。已读取§5.B “CTN to RLSP conversion for proton beams”。
3. Peters N et al. “Consensus guide on CT-based prediction of stopping-power ratio using a Hounsfield look-up table for proton therapy.” *Radiotherapy and Oncology*, 2023;184:109675. DOI: [10.1016/j.radonc.2023.109675](https://doi.org/10.1016/j.radonc.2023.109675)。已读取可访问正文的摘要、引言、验证步骤与讨论相关内容。

### 直接支持的范围

- CT数值不能直接等同于质子相对阻止本领（SPR/RLSP）；临床需要经标定/转换函数或HLUT将CT数值转换为质子剂量计算所需的材料属性。
- AAPM TG-202明确区分CT数值本身的不确定性与转换函数不确定性；两者共同影响相对阻止本领和计算射程。束流递送、摆位/对准、固定装置、组织异质性和分次间/分次内解剖变化也是相关不确定性来源。
- TG-185指出转换曲线取决于CT协议参数；单能CT校准下，近水软组织的准确度目标不能直接推广到肺、骨、高原子序数材料或固定装置。
- 2023年共识指南建议按模体设置、CT采集、CT数值提取、SPR确定、HLUT制定和HLUT验证的完整流程执行；不同扫描器/协议的曲线不可未经验证直接互换。

### 当前判断与缺口

**核心机制已获得直接支持，但不关闭原主张。** 现有资料支持CT→阻止本领转换及其对射程误差的作用；还不能证明原主张中若包含的任何统一百分比、特定骨/气界面误差、个别算法或特定患者场景均正确。下一步必须逐字检查原句，限定是“CT标定误差”“材料转换误差”“计算射程不确定性”还是包含运动/解剖变化的总不确定性，避免把不同来源简单相加或重复计入。

## 4. 稳健情景评价（mp-10-point-4）

### 已读取的原始资料

1. AAPM TG-202 Report 202 (2020)，§10.6 “Mathematical Robust Optimization Techniques”及§10.6.1–10.6.2，见[官方完整PDF](https://www.aapm.org/pubs/reports/RPT_202.pdf)。
2. Unkelbach J, Bortfeld T, Martin BC, Soukup M. “Reducing the sensitivity of IMPT treatment plans to setup errors and range uncertainties via probabilistic treatment planning.” *Medical Physics*, 2009. DOI: [10.1118/1.3021139](https://doi.org/10.1118/1.3021139)。已读取原始论文摘要。

### 直接支持的范围

- TG-202将不确定性场景建模为若干离散场景，每个场景对应剂量分布；列举概率方法（按场景概率优化目标函数期望值）和minimax最坏情形方法（最小化最差场景目标值）等路线。
- 稳健优化目标是让计划在不确定性下保持可接受表现；对准误差和射程/穿透误差的影响不同，不能只用统一几何边界或单一名义剂量分布概括所有风险。
- Unkelbach等人的原始研究支持将射程与摆位不确定性纳入IMPT计划优化，并展示了与忽略不确定性的传统计划不同的优化结果。

### 当前判断与缺口

**方法概念有直接依据，但不关闭原主张。** 当前资料不足以批准任何未在原句中明确指定的“现代稳健评价”细节，例如固定情景数、情景组合、概率赋值、评价指标或通用判定阈值。需先映射原始主张，确认其指情景重算/比较、概率稳健优化、minimax，还是临床计划审核流程；这些概念不可互换。

## 5. 对条件性支持条目的处理

本轮证据不自动升级其余条件性支持主张。后续逐条处理时，每个条目都必须列明：
- 原始知识点全文及原始版本哈希；
- 当前来源实际支持的最小命题；
- 未被来源支持的句子、数字、公式或适用条件；
- 是否存在跨来源定义不一致；
- 可采纳的最小修订建议；
- 是否仍需要独立专家裁定。

优先复核与本批相邻的质子Bragg峰/SOBP、LET/RBE、小野体积平均、CT标定与组织异质性等条目；不得因为章节相关就自动关闭缺口。

## 6. 状态与保护边界

- v6a的46条合并状态（12支持、30条件性支持、4待核）是历史快照，不在本文件中静默覆盖。
- 本轮新发现一个需要单独登记的来源间公式冲突：IAEA 2005教材式(8.5)系数1.09 vs. Mackie等人1996原始研究系数1.98。该冲突的正式专业裁定仍待完成，不能把“高度疑似印刷错误”记为已获勘误。
- 其余三个缺口已有直接原始资料支持部分机制，但仍需原句级映射后再决定是否调整分类。
- 教师6条、专家61条和113条完整审阅稿仍是待交接材料；未联系、未发送任何外部人员。
- 独立专业审定：0。
- 本文件仅为证据研究记录；未修改课程、正式APP、V59、R5、真实学习数据或发布状态。
- 本轮没有运行软件测试：本次变更仅是独立证据备忘录，不将软件测试作为科学正确性的替代证明。

## Sources read

- [IAEA Pub1196 (2005), official PDF](https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf)
- [Mackie et al. (1996), PubMed PMID 8815379](https://pubmed.ncbi.nlm.nih.gov/8815379/)
- [IAEA TRS-398 (2000), official PDF](https://www-pub.iaea.org/mtcd/publications/pdf/trs398_scr.pdf)
- [AAPM TG-218 (2018), official report page](https://www.aapm.org/pubs/reports/detail.asp?docid=173)
- [Stedem et al. (2024), open-access original article](https://doi.org/10.1002/acm2.14274)
- [AAPM TG-202 (2020), official full PDF](https://www.aapm.org/pubs/reports/RPT_202.pdf)
- [AAPM TG-185 (2021), full article](https://doi.org/10.1002/mp.14546)
- [Peters et al. (2023), CT-to-SPR consensus guide](https://doi.org/10.1016/j.radonc.2023.109675)
- [Unkelbach et al. (2009), original research](https://doi.org/10.1118/1.3021139)

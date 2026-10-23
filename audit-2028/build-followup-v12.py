"""Append-only v12 evidence assembly; never downloads or changes teaching data."""
import json, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'product-2028-draft/mp-evidence-2026-10-23-v12'
if OUT.exists():
    raise SystemExit('Refuse to overwrite existing v12 evidence directory')
old = json.loads((ROOT/'product-2028-draft/mp-evidence-2026-10-23-v11/conditional-followup-v11.json').read_text(encoding='utf-8'))
baseline = json.loads((ROOT/'audit-2028/evidence/2026-10-23-v12/baseline.json').read_text(encoding='utf-8'))
sources = []
def source(id, authors, title, date, version, url, read, status, limits, printed=None, pdf=None):
    sources.append(dict(id=id, authors=authors, title=title, publishedAt=date, version=version, url=url,
        accessedAt='2026-10-23', actuallyRead=read, accessStatus=status, printedPages=printed,
        pdfPages=pdf, pageNumberBase=1, limits=limits, independentExpertApproval=False))
source('NIST-PSTAR', ['NIST'], 'PSTAR text input form and Table 2 material list', 'undated web pages', 'online form / material list; not a numerical data version',
    'https://physics.nist.gov/PhysRefData/Star/Text/PSTAR-t.html',
    ['Web form description: energy input 0.001–10000 MeV (software input range, NOT a claim that every approximation is valid throughout)', 'https://physics.nist.gov/PhysRefData/Star/Text/table2.html: Water, Liquid and Water Vapor are distinct entries'],
    'form-and-material-list-only', 'No water numerical stopping-power table obtained. Approved local request 403; exploratory CGI GET inaccessible; no validated material selector, POST response or numerical table. Prior v11 methods evidence retained, not a new table read.')
source('MPPG11A', ['Ping Xia','Benjamin J. Sintay','Valdir C. Colussi','Cynthia Chuang','Yeh-Chi Lo','Deborah Schofield','Michelle Wells','Sumin Zhou'],
    'Medical Physics Practice Guideline (MPPG) 11.a: Plan and chart review in external beam radiotherapy and brachytherapy', '2021-08-02 (epub); 2021-09 issue', 'JACMP 22(9):4–19; DOI 10.1002/acm2.13366',
    'https://aapm.onlinelibrary.wiley.com/doi/pdfdirect/10.1002/acm2.13366',
    ['PDF title p1 / printed4', 'Sections 3.1.3–3.1.4 printed10–11 / PDF7–8: transfer, initial review before first fraction, emergency exceptions', 'Sections 3.1.5–3.1.6 printed12 / PDF9: first weekly check verifies IMRT QA already completed prior to first fraction; dose-affecting changes reviewed as new plans', 'Tables 8–9 selected entries printed13–14 / PDF10–11; sections5.1–5.2 printed18 / PDF15 scope'],
    'selected-primary-pdf-text-read', 'Selected sections only, not all report tables or a Chinese regulation. Emergency on-call/oncologist review then QMP next business day or before next treatment that day; no universal approval sequence or universal tolerance.', [4,10,11,12,13,14,18], [1,7,8,9,10,11,15])
source('MPPG2B', ['Steven P. McCullough','Hassaan Alkhatib','Kyle J. Antes','Sarah Castillo','Jonas D. Fontenot','Andrew R. Jensen','Jason Matney','Arthur J. Olch'],
    'AAPM Medical Physics Practice Guideline 2.b.: Commissioning and quality assurance of X-ray-based image-guided radiotherapy systems', '2021-07-16', 'JACMP 22(9):73–81; DOI 10.1002/acm2.13346',
    'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.13346',
    ['HTML sections1–1.2,4.4,4.4.1–4.4.7 and Table1'], 'selected-primary-html-body-read',
    'X-ray positioning/localization system commissioning/QA; not dose calculation using IGRT images, not a comprehensive patient motion protocol. Article range73–81 only; per-section print/PDF pages not verified. Table1 values are equipment QA tolerances, not patient correction action levels.')
source('AAPM-ACTIVE', ['AAPM'], 'Medical Physics Practice Guidelines: active reports directory', 'undated; checked 2026-10-23', 'active directory snapshot',
    'https://www.aapm.org/pubs/mppg/?s=guideline', ['HTML explicitly lists active reports; 11.a (2021), 2.b (2021)'],
    'official-current-catalog-read', 'Directory status as of access; does not establish Chinese legal force or certify every local clinical workflow.')
source('TG275', ['Eric Ford','Lesley Conroy','Lei Dong','et al.'], 'Strategies for Effective Physics Plan and Chart Review in Radiation Therapy: Report of AAPM Task Group 275',
    '2020-06', 'Medical Physics47:e236–e272; DOI10.1002/mp.14030', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9012523/',
    ['HTML introduction/II.A and V.E: terms, automated data-transfer checks, early checks in workflow'], 'selected-primary-html-body-read',
    'Professional recommendations, not regulations. Article pagination only; paragraph-specific PDF pages not verified. Historical report, not a claimed new 2026 standard.')
source('NAGAI2017', ['Aiko Nagai','Yuta Shibamoto','Masanori Yoshida','Koji Inoda','Yuzo Kikuchi'],
    'Intensity-modulated radiotherapy using two static ports of tomotherapy for breast cancer after conservative surgery: dosimetric comparison with other treatment methods and 3-year clinical results',
    '2017-02-23 online; 2017-07 issue', 'J Radiat Res58(4):529–536; DOI10.1093/jrr/rrw132', 'https://academic.oup.com/jrr/article/58/4/529/3045802',
    ['Full HTML selected Methods: CT simulation, treatment planning/comparison, verification/evaluation; Results Table3; publisher redirect to https://oup.silverchair-cdn.com/article-minimal/3045802'],
    'selected-primary-html-body-and-table-read', 'Paired dosimetry n20 left-sided cases, NOT n152 clinical cohort. Different planning platforms and prescription normalization confound technique-only inference. Article pagination only, not verified individual PDF pages. Not an all-IMRT rule or comparative clinical outcome proof.')
source('TRS461', ['IAEA','ICRU'], 'Relative Biological Effectiveness in Ion Beam Therapy', '2008-02', 'Technical Reports Series461',
    'https://www-pub.iaea.org/MTCD/Publications/PDF/trs461_web.pdf',
    ['Web PDF text section1.1.3 and Figure1.1 caption printed3/PDF14; Figure1.2 caption printed4/PDF15'], 'selected-primary-pdf-text-and-captions-read',
    'Figure metadata, not numerical dose arrays, not v12 image digitization. Carbon medium and field geometry not established from read caption. Figure1.2 weighted/isoeffective dose is not identical to absorbed dose. No matched-condition cross-particle numerical comparison.', [3,4], [14,15])
source('IAEA1196', ['E. B. Podgorsak (technical editor)','IAEA'], 'Radiation Oncology Physics: A Handbook for Teachers and Students', '2005', 'STI/PUB/1196',
    'https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf', ['Cached PDF312 / printed274 Figure8.1 text and image actually viewed again in v12'],
    'selected-primary-text-and-image-read', 'Figure conditions, no dose array or tail/peak digitization. Does not provide same-energy/same-range cross-particle comparison.', [274], [312])
source('FEIGLEY2008', ['Charles E. Feigley','Jamil Khan','James A. Hussey','Emily Lee'], 'Investigating Principles of Workroom Exposure: Final Progress Report',
    '2008-03-26', 'University of South Carolina; NIOSH grant1R01OH07626; CDC archived report', 'https://stacks.cdc.gov/view/cdc/218585/cdc_218585_DS1.pdf',
    ['PDF1 title/author/date/grant identification', 'Section2.4.1 printed15/PDF18 Eq2.1: text and rendered image actually read; C=G/Q'],
    'selected-primary-text-and-formula-image-read', 'Original Eq2.1 uses C, clean dilution air, uniform steady concentration. Background-increment equation is this audit’s separate mass-balance derivation, NOT quoted Eq2.1.', [15], [1,18])
source('CDC-VENT', ['CDC','NIOSH'], 'Ventilation FAQ', '2024-10-04 page date', 'official guidance web page checked2026-10-23',
    'https://www.cdc.gov/niosh/ventilation/faq/', ['HTML header date, FAQ2 directional airflow, FAQ9 HEPA and portable air cleaning; barrier caveat retained from v11 FAQ5'],
    'selected-official-guidance-body-read', 'HEPA filter rating is not whole-room effectiveness or gaseous pollutant removal. Infection-aerosol guidance not a universal all-pollutant standard or elimination guarantee.')
source('EPA-HOME', ['US EPA'], 'Guide to Air Cleaners in the Home', '2018-08', '2nd edition; distinct from technical summary3rd edition',
    'https://www.epa.gov/indoor-air-quality-iaq/guide-air-cleaners-home',
    ['HTML portable air cleaners/tips, CADR table and ceiling note; edition metadata cross-checked at https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home'],
    'selected-official-guidance-body-and-table-read', 'Residential sizing example for8ft ceiling; particle CADR, not a gas rating or a clinical building requirement. Activated carbon addresses some gases, with no widely used portable gas-performance rating in this guidance.')
source('ASHRAE241-CATALOG', ['ASHRAE'], 'Standards Addenda catalog: Standard241-2023 Control of Infectious Aerosols', '2023 standard; Addendum a listed2024-10-21',
    '241-2023 / listed addendum a; consolidated full text not verified', 'https://www.ashrae.org/technical-resources/standards-and-guidelines/standards-addenda',
    ['Official catalog entry title, standard year and Addendum a date only'], 'metadata-only-not-standard-body',
    'No consolidated clauses or numeric design requirements read. Not a full current-standard audit and not Chinese mandatory requirements.')

quant = dict(nist=dict(material='Water, Liquid', selectedPoints=[], tableObtained=False, unitsExpected='MeV cm²/g for mass stopping power',
    electronicNuclearTotal='Expected columns require actual table verification; no invented numerical trend', clinicalDoseEquivalent=False),
    pairedIMRT=dict(sourceId='NAGAI2017', pairedPatients=20, clinicalCohortNotPairedN=152, site='left-sided breast', prescription='50 Gy /25 fractions',
        beams='6 MV, two tangential beams', CT='3mm shallow breathing',
        TD=dict(system='TomoTherapy5.0.5.18', algorithm='convolution/superposition', grid='1.96mm ×1.96mm ×slice thickness', width_cm=2.51, pitch=0.251, modulation=[1.15,1.85], normalization='50Gy to50%PTV'),
        CRT=dict(system='Pinnacle3 / Varian Clinac2100C/D', algorithm='collapsed cone convolution/superposition', normalization='50Gy to PTV isocenter'),
        locator='HTML Results Table3; print article529–536, exact PDF page not verified', volumeUnit='percent organ volume',
        rows=[dict(organ='left lung', threshold_Gy=5, TDIMRT=[12.8,3.2], TD3DCRT=[14.8,2.8], CRT3D=[20.9,6.1], meanDifferencePercentagePoints=-8.1),
              dict(organ='bilateral lung', threshold_Gy=5, TDIMRT=[5.8,1.3], TD3DCRT=[6.6,1.4], CRT3D=[9.3,2.7], meanDifferencePercentagePoints=-3.5)],
        values='mean ±SD', confounds=['platform','prescription normalization'], universalLowDoseIncrease=False, comparativeClinicalOutcomeProven=False),
    equipmentQA=dict(sourceId='MPPG2B', locator='HTML Table1', type='equipment-QA-not-patient-action-threshold',
        rows=[dict(test='SRS imaging-treatment isocenter +table composite', tolerance_mm=1, condition='SRS only, day of special procedure'),
              dict(test='imaging-treatment isocenter with lasers as treatment reference', tolerance_mm=2, condition='daily/day of special procedure'),
              dict(test='table positioning/repositioning', tolerance_mm=2, condition='daily/day of special procedure')], patientActionThreshold_mm=None),
    particleFigures=[dict(sourceId='TRS461', figure='1.1', printedPage=3,pdfPage=14,particle='proton',energy=152,energyUnit='MeV',medium='water',geometry='not fully specified in read caption',quantity='normalized absorbed depth-dose',rawDosePoints=[],tailPercent=None),
        dict(sourceId='TRS461',figure='1.2',printedPage=4,pdfPage=15,particle='carbon',energy=290,energyUnit='MeV/amu',medium=None,geometry='PTV100–160mm; field/SSD not established',quantity='weighted/isoeffective vs absorbed curves, not interchangeable',rawDosePoints=[],tailPercent=None),
        dict(sourceId='IAEA1196',figure='8.1',printedPage=274,pdfPage=312,particle='electron',energy=[6,9,12,18],energyUnit='MeV',medium='water',geometry='10×10cm²; SSD100cm',quantity='percentage depth dose',rawDosePoints=[],tailPercent=None)],
    massBalance=dict(sourceId='FEIGLEY2008', sourceFormula='C = G/Q', sourceFormulaVisuallyVerified=True, sourcePrintedPage=15,sourcePdfPage=18,
        derivedBalance='G + Q*Cin - Q*C = 0',derivedResult='DeltaC = C - Cin = G/Q', derivedNotQuoted=True,
        assumptions=['steady state','well mixed','constant background','constant volume and balanced inflow/outflow','no other removal or reaction','G and Q constant with Q>0'],
        units=dict(G='mg/h',Q='m³/h',DeltaC='mg/m³'), example=dict(G=120,Q=60,Cin=0.3,DeltaC=2,C=2.3),
        concentrationNotPersonalDoseOrInfectionProbability=True,
        localPdfSha256='5cc51d35637e854503255293d65e829101b86979e0142de0381fb13c6f67a84e',
        localImageSha256=hashlib.sha256((ROOT/'tmp/pdfs/v12-feigley-p18.png').read_bytes()).hexdigest(),cacheUploaded=False),
    airCleaning=dict(HEPA=dict(sourceId='CDC-VENT', efficiencyPercentAtLeast=99.97,particleDiameter_um=0.3,ratingNotRoomRisk=True),
        CADRExample=dict(sourceId='EPA-HOME', roomArea_ft2=100,minCADR_cfm=65,ceiling_ft=8,scope='residential particle cleaning example, not gas or clinical mandate'), gasCADRNotClaimed=True))
standards = dict(asOf='2026-10-23', currentVerifiedActiveAAPM=['MPPG11A','MPPG2B'], activeStatusSource='AAPM-ACTIVE',
    clinicalReview=dict(sourceId='MPPG11A', initialReview='QMP or supervised physicist before first fraction',
        emergencyException='On-call remote/in-person review; if unavailable oncologist initial review followed by QMP next business day or before next treatment that day',
        QA='First weekly review checks IMRT QA and documentation were completed prior to first fraction; not permission to defer QA',
        changes='Dose-affecting changes handled as new plan review; fraction-only changes require differentiated documented handling',
        universalApprovalSequence=False, universalTolerance=False),
    IGRT=dict(sourceId='MPPG2B', scope='X-ray equipment commissioning and QA', onlineOffline='v11 IAEA historical definitions retained: online current fraction vs offline subsequent-fraction strategy; not every IGRT assessment triggers immediate couch shift',
        allMotionEliminated=False, patientActionThresholdVerified=False),
    historicalNotCurrentCompleteNorm=['TRS461','IAEA1196','FEIGLEY2008','TG275'],
    guidanceNotLaw=['CDC-VENT','EPA-HOME'], metadataOnly=['ASHRAE241-CATALOG'],
    ASHRAEConsolidatedTextRead=False, ChineseCurrentLegalStatusVerified=False, verifiedFinal2028Syllabus=False)
notes = {
 'mp-01-point-8': (['线性阻止本领与质量阻止本领须分别标MeV/cm、MeV·cm²/g；总量与分量区分沿用v11方法正文。','TRS461 Figure1.1给出152MeV质子水中曲线条件；多能量叠加覆盖靶区厚度的SOBP解释受这些条件限制。'], ['NIST水数值表仍未取得，不能验证材料特异趋势或所有速度范围单调性。','单粒子能量损失不等于介质局部沉积，更不等于临床宏观深度剂量。'], 'NIST无新增数值；新增可复核图条件：152MeV、水、印刷3/PDF14。', '限定为特定介质和治疗能区的质子/离子射程末端特征；删除所有速度均越慢阻止本领越大的通则。', ['NIST-PSTAR','TRS461']),
 'mp-07-point-4': (['现行AAPM活动目录列11.a；正文支持首次分次前初始计划/病历复核、数据传输核查、既往IMRT QA文档核对。','紧急流程有明确例外；影响剂量的改动应作为新计划复核。'], ['专业建议不是中国法规或各机构统一审批顺序；本地职责、审批和QA方法仍待机构/专业人员确认。'], 'MPPG11.a2021版正文定位印刷10–14/PDF7–11，活动目录截至2026-10-23。', '将线性箭头改为可迭代教学流程；首次治疗前核查按适用专业建议和机构规程执行，保留紧急例外。', ['MPPG11A','AAPM-ACTIVE','TG275']),
 'mp-07-point-6': (['Nagai同研究20名左乳病例配对计划的肺V5可复核；本例TDIMRT低于3DCRT，反对所有IMRT必增加低剂量体积。'], ['不能由不同平台、归一化的比较分离技术因果；不能推广部位、算法或临床结局。','几何误差敏感性沿用v11特定研究边界；本轮没有新增统一定量敏感系数。'], '左肺V5：12.8±3.2% vs20.9±6.1%；双肺V5：5.8±1.3% vs9.3±2.7%；20例，50Gy/25次、6MV，Table3。', '可能改变或增加部分正常组织低剂量体积，方向取决于部位、束角、优化及评价指标；不得写统一增加百分比。', ['NAGAI2017']),
 'mp-08-point-1': (['MPPG2.b活动版本适用于X线IGRT设备调试与QA；Table1设备容差1/2mm有明确项目条件。','在线/离线定义沿用v11已读IAEA段落，不将离线策略改成当前分次立即床移。'], ['本轮未验证具体部位患者动作阈值、全部运动管理协议或中国强制规程；配准、系统/随机误差、运动不能合并。'], 'SRS等中心+床复合1mm；激光参考等中心及床定位2mm，均为设备QA而非患者纠正阈值。', 'IGRT依协议评估当前或后续分次的几何偏差并按需纠正，不能消除全部不确定性；设备QA容差另列。', ['MPPG2B','AAPM-ACTIVE']),
 'mp-10-point-1': (['TRS461质子152MeV、水；碳290MeV/amu、PTV100–160mm图条件可定位。','IAEA电子6/9/12/18MeV、水、10×10cm²、SSD100cm图像已读；电子不是同样尖锐的Bragg峰。'], ['未取得匹配条件的原始剂量数组；碳图已读说明未确定介质，不能拼接通用定量对比。','重离子碎裂尾与电子轫致辐射背景须分别评价；无通用峰后百分比，不能宣称剂量为零。'], '仅能交付能量、介质及图条件元数据；峰深和尾部数值未提取。', '改称质子/离子具有相应射程末端特征；重离子碎裂可有尾部；电子深度剂量另述，峰后下降不等于严格零剂量。', ['TRS461','IAEA1196']),
 'mp-15-point-1': (['本轮实际取得Feigley原PDF并读图：印刷15/PDF18 Eq2.1是C=G/Q，非ΔC。','另行质量守恒推导稳态背景增量ΔC=G/Q，量纲及120/60=2算术可复核。'], ['推导只对充分混合、稳态、恒定背景和平衡稀释、无其他反应去除成立；不能推广近场非稳态。','浓度增量不是个人吸入剂量或感染概率。'], '原公式图像本轮核验；G120mg/h、Q60m³/h、Cin0.3mg/m³，ΔC2mg/m³、C2.3mg/m³（本轮教学算例非实测数据）。', '明确原文C=G/Q的清洁入口条件；带背景的ΔC关系标为本轮质量守恒推导并完整列假设和单位。', ['FEIGLEY2008']),
 'mp-15-point-3': (['CDC HEPA过滤额定效率至少99.97%@0.3μm；EPA住宅CADR示例100ft²/65cfm/8ft层高。','颗粒CADR与气体吸附不同；布局/隔板可能改变气流，须按污染物与路径评估。'], ['ASHRAE只核实241-2023与增补a目录日期，未读合并完整条款，不提供其设计数值。','住宅和感染性气溶胶建议不能变成所有污染物或中国强制标准；缺场景实测暴露和设计验证。'], 'CDC页面2024-10-04；EPA2018第二版；ASHRAE增补目录2024-10-21，读取层级分别记录。', '分别讲源控制、稀释通风、颗粒过滤、气体去除和路径；不承诺隔板、单个ACH或过滤器在所有场景消除风险。', ['CDC-VENT','EPA-HOME','ASHRAE241-CATALOG'])
}
updates=[]
for o in old['updates']:
    direct,gaps,new,revision,refs=notes[o['id']]
    updates.append(dict(id=o['id'], originalText=o['originalText'], originalSource=o['originalSource'],originalVersion=o['originalVersion'],pointHash=o['pointHash'],
        priorConclusion=o['conclusion'],priorEvidenceFile='product-2028-draft/mp-evidence-2026-10-23-v11/conditional-followup-v11.json',
        directSupport=direct, conditionalOrUnresolved=gaps, newQuantitativeOrVersionEvidence=new,sourceIds=refs,
        minimumRevision=revision, conclusion='条件性支持',requiresIndependentExpert=True,appliedToOriginal=False))
failures=[]
for name in ['v12-cache-sandbox.json','v12-cache-network-retry.json']:
    for r in json.loads((ROOT/'tmp/pdfs'/name).read_text(encoding='utf-8')):
        if r['status']=='failed': failures.append(dict(attempt=name,**r))
failures += [dict(attempt='web',url=u,error=e) for u,e in [
 ('NIST exploratory CGI GET','not accessible; selector276 exploratory and unverified; no table read'),
 ('CUA browser creation','transport closed before response; no interactive form result'),
 ('https://pmc.ncbi.nlm.nih.gov/articles/PMC5514227/','reCAPTCHA; no full body read'),
 ('https://pmc.ncbi.nlm.nih.gov/articles/PMC8425907/','reCAPTCHA; later publisher PDF read independently'),
 ('https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.13366','not accessible; PDFdirect later succeeded'),
 ('https://doi.org/10.1002/acm2.13346','redirect inaccessible once; direct publisher HTML later succeeded'),
 ('web orchestration cell117','terminated prolonged batch; no result credited'),
 ('web orchestration cell123','fatal connection failure; subsequent explicit calls provide credited reads'),
 ('local PDF rendering','Poppler font/nameToUnicode warnings; exit0 and actual viewed Eq2.1 image legible')]]
v=dict(revision='v12-2026-10-23', branch=baseline['branch'],baseCommit=baseline['base'],ids=[r['id'] for r in updates],updates=updates,
    sources=sources,quantitativeFile='quantitative-matrix-v12.json',standardsFile='standards-matrix-v12.json',
    protectedHashes=baseline['protectedHashes'], retrievalFailures=failures,independentExpertApproved=0,
    formalContentChanged=False,deployed=False,liveLearningDataTouched=False,externalContact=False,paidServiceCreated=False,final2028RequirementsVerified=False,
    note='7条既有记录的v12子主张跟进，全部仍条件性支持；原文/人工意见不修改；HDR和九条既往队列不变。')
OUT.mkdir()
for name,data in [('conditional-followup-v12.json',v),('quantitative-matrix-v12.json',quant),('standards-matrix-v12.json',standards),('failures-v12.json',failures)]:
    (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report=['# v12：七条定量证据与现行规范核验','', '日期：2026-10-23。内部证据复核，不是独立专业审定；7条均保持条件性支持，独立专业审定0。',
 '基线：`'+baseline['base']+'`；隔离分支`'+baseline['branch']+'`。无可信本地.git，不初始化；选择性Git Data提交并核对远端头。',
 'v8–v11、正式课程和生产数据不修改；PDF缓存/图像/私有图谱不上传。','',
 '## 如何复核','机器记录：conditional-followup-v12.json；数值和单位：quantitative-matrix-v12.json；现行性与条款边界：standards-matrix-v12.json；失败：failures-v12.json。',
 'NIST没有取得水数值表。粒子曲线仅核对已读图条件，不是原始数值数组；不得写尾部通用百分比。ASHRAE只读官方版本目录，不是完整标准正文。','']
for r in updates:
    report += ['## '+r['id'],'','原始主张：'+r['originalText'],'','直接支持：']+['- '+x for x in r['directSupport']]+['','条件性支持/缺口：']+['- '+x for x in r['conditionalOrUnresolved']]+['','本轮新增：'+r['newQuantitativeOrVersionEvidence'],'','最小修订建议（不应用原件）：'+r['minimumRevision'],'','状态：条件性支持；仍需独立专业确认。来源：'+', '.join(r['sourceIds']),'']
report+=['## 来源及实际读取范围','']
for s in sources:
    report += ['### '+s['id'], ', '.join(s['authors'])+'；'+s['title']+'；'+s['publishedAt']+'；'+s['version'], s['url'], '读取状态：'+s['accessStatus'], *['- '+x for x in s['actuallyRead']], '支持边界：'+s['limits'],'']
report += ['## 下一断点','1. NIST水表仍需真实表响应及具体点值；不绕过403或编造数据。','2. 粒子定量比较需有可解释匹配条件的原始数组/曲线及数值提取方法。','3. 取得ASHRAE完整适用条款前不援引设计数值；中国规范有效状态未核验。','4. IMRT/IGRT流程及患者阈值仍需专业人员和场景化协议确认。','5. 独立专业审定保持0；本轮不更新正式课程或发布APP。','', '测试与提交证据追加于 audit-2028/evidence/2026-10-23-v12/，本地回归、远端隔离引擎、真实浏览器分开记录。']
(OUT/'七条定量证据与现行规范-v12.md').write_text('\n'.join(report)+'\n',encoding='utf-8')
print(json.dumps(dict(directory=str(OUT.relative_to(ROOT)),claims=len(updates),sources=len(sources),independentExpertApproved=0),ensure_ascii=False))

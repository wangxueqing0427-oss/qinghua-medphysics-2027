"""One-off immutable v9 record builder; do not rerun historical patch scripts."""
import json,hashlib,pathlib
P=pathlib.Path
root=P('product-2028-draft/mp-evidence-2026-10-23')
root.mkdir(exist_ok=True)
def read(p): return json.loads(P(p).read_text(encoding='utf-8-sig'))
def sha(p): return hashlib.sha256(P(p).read_bytes()).hexdigest()
v8path='product-2028-draft/mp-evidence-2026-10-22/conditional-followup-v8.json'
q=read(v8path); old=read('audit-2028/evidence/2026-10-21-waves/current-claims-v6a.json')
by={r['id']:r for r in old['rows']}
remaining=[r for r in q['rows'] if not r['newEvidence']]
sources=[
dict(id='TC-LABEL',authors=['Lantheus Medical Imaging (product label); NLM DailyMed host'],title='TECHNELITE technetium Tc99m generator label',url='https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3ae14c6b-3daf-4dd1-bbdb-e990fe8100e4',publishedAt='2024-11-01 (DailyMed Updated)',version='setid 3ae14c6b-3daf-4dd1-bbdb-e990fe8100e4; observed update',locator='Physical Characteristics, tables 1 and 4; INDICATIONS AND USAGE',readStatus='selected-original-label-html-body-read',pdfPages=None,support='Tc-99m同质异能跃迁、约6小时物理半衰期、140.5 keV光子及特定制剂成像用途。',limits='药品标签不是最新核数据评价；不采用给药剂量、屏蔽或哺乳操作规定作为课程处方，不外推所有Tc标记药物。'),
dict(id='F18-LABEL',authors=['Mayo Clinic (packager); NLM DailyMed host'],title='FLUDEOXYGLUCOSE F18 label',url='https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=153b650d-7b69-4880-a72a-a5f13059d248',publishedAt='2025-12-26 (host update); label Revised 7/2014',version='setid 153b650d-7b69-4880-a72a-a5f13059d248',locator='Full prescribing information §1, §11.2 table 2 and table 4',readStatus='selected-original-label-html-body-read',pdfPages=None,support='F-18到O-18、109.7 min物理半衰期、正电子及511 keV湮没光子；FDG用于PET。',limits='网页更新不等于标签知识全部更新；保留原子核分支与光子来源差别，不将正电子分支近似为100%，不从同核素推导同药代或患者给药方案。'),
dict(id='BIPM-TC2010',authors=['C. Michotte','S. Courte','G. Ratel','M. Moune','L. Johansson','J. Keightley'],title='Update of BIPM.RI(II)-K1.Tc-99m comparison',url='https://www.bipm.org/documents/20126/48150609/BIPM.RI%28II%29-K1.Tc-99m_LNHB2007_NPL2008.pdf/cf8df193-0d37-4b82-b93f-3dd84924e7d4',publishedAt='2010-11-18',version='Metrologia 47 (2010) Technical Supplement 06026',locator='§1–3; table 2',readStatus='selected-original-pdf-body-text-read',pdfPages=[1,2,3,4],support='活度计量比对与可追溯性；表2在特定测量中采用6.0067(10) h。',limits='不是本轮新测半衰期，也非最新DDEP评价；不将标签6.02 h与表2差异无依据裁为勘误，不混合精度计算。'),
dict(id='IAEA05-ELECTRON',authors=['E. B. Podgorsak (technical editor); IAEA'],title='Radiation Oncology Physics: A Handbook for Teachers and Students',url='https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf',publishedAt='2005-07',version='STI/PUB/1196',locator='§8.3.2–4 printed287–289/PDF325–327; §8.3.5–7 printed291–293/PDF329–331; §10.4.2.4 printed383–384/PDF421–422; additional §1.3.3 printed24–25/PDF62–63',readStatus='selected-original-pdf-text-and-page-image-read',pdfPages=[62,63,64,321,325,326,327,329,330,331,421,422],pageImagesViewed=[329],localFile='tmp/pdfs/iaea-1196.pdf',sha256=sha('tmp/pdfs/iaea-1196.pdf'),support='限光、场大小、SSD/空气隙、介质非均匀性可影响分布；有效SSD和空气隙修正应区分；CET只是简化近似。',limits='历史教材不是现行机型协议；不沿用通用数值容差、CET常数或无条件外推；原页部分绝对措辞不作为全机型结论。电子能量系数冲突未解决。'),
dict(id='MPPG13A',authors=['Susan L. Richardson et al.'],title='AAPM MPPG 13.a: HDR brachytherapy, part A',url='https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.13829',publishedAt='2023-02-20',version='JACMP 24(3), e13829; DOI10.1002/acm2.13829',locator='§1; §2–2.3; §7.1; §8.2.1–4; §8.3.1–5',readStatus='selected-original-html-body-read',pdfPages=None,support='HDR定义、远程后装减少人员照射；驻留时间优化、重建与传输检验。',limits='限Ir-192后装HDR；非LDR/电子近距离/Co-60的完整规范，不照搬美国法规或把可选二次计算写成全部机构强制。'),
dict(id='MPPG13B',authors=['Susan L. Richardson et al.'],title='AAPM MPPG 13.a: HDR brachytherapy, part B',url='https://aapm.onlinelibrary.wiley.com/doi/10.1002/acm2.70118',publishedAt='2025-06-29',version='JACMP26(7), e70118; DOI10.1002/acm2.70118',locator='Scope; §4.3; §6.2–6.4',readStatus='selected-original-html-body-read',pdfPages=None,support='源路径、首驻留位置、通道方向/映射、驻留时间、处方和衰变缩放需核对。',limits='限Ir-192 HDR，机构风险流程与培训人员判断不可由APP替代；本轮没有验证临床实施。'),
dict(id='OTTO2008',authors=['Karl Otto'],title='Volumetric modulated arc therapy: IMRT in a single gantry arc',url='https://aapm.onlinelibrary.wiley.com/doi/10.1118/1.2818738',publishedAt='2007-12-26 online; 2008 issue',version='Medical Physics35(1),310–317; DOI10.1118/1.2818738',locator='§I; §II.A–C; HTML body, not PDF pagination',readStatus='selected-original-html-body-read',pdfPages=None,support='叶片与MU/角度受可交付性约束，剂量率与机架运动存在耦合。',limits='公式在HTML呈图片占位，未核清上下标，不录其公式；研究单弧及指定机器，不证明所有现代VMAT每个控制量必须持续变化或普遍优于IMRT。'),
dict(id='TG307',authors=['Nesrin Dogan et al.'],title='AAPM Task Group Report307: Use of EPIDs for Patient-Specific IMRT and VMAT QA',url='https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/mp.16536',publishedAt='2023-06-29',version='Medical Physics50,e865–e903; DOI10.1002/mp.16536',locator='§3.3 limitations paragraphs on integrated VMAT images; §4.1–4.2.1',readStatus='selected-original-html-body-read',pdfPages=None,support='整弧积分图像丢失时间/角度信息；检出能力应按注入误差、系统与分析方法验证。',limits='EPID专项，不是所有QA技术统一结论；文中软件可用性为2023历史，不当2026最新信息；不把gamma通过或单项QA视为全计划批准。')]
for s in sources: s.update(accessedAt='2026-10-23',expertApproval=False)
updates=[]
def add(i,checks,revision,gaps,ids,scope='first-batch-of-21'):
 r=by[i];updates.append(dict(id=i,scope=scope,originalText=r['originalText'],originalSource=r['originalSource'],originalVersion=r.get('originalVersion'),historicalStatus='条件性支持',conclusion='条件性支持',sourceIds=ids,subclaimChecks=[dict(claim=c,support=x,locator=l) for c,x,l in checks],minimumRevision=revision,remaining=gaps,appliedToOriginal=False,expertApproved=False))
add('mp-01-point-4',[
 ('Tc-99m作为成像例子','直接支持同质异能跃迁及特定药物成像用途；约6 h和140.5 keV是标签值','TC-LABEL Physical Characteristics/table1/INDICATIONS'),
 ('F-18作为边界对照','直接支持正电子产生后与电子湮没形成511 keV光子，不能称其为直接核γ跃迁','F18-LABEL §11.2/table2'),
 ('数值精度','BIPM表2引用6.0067(10) h，标签为6.02 h，来源版本与精度分别保留，不自行改数','BIPM-TC2010 table2 pp3–4')],
 '将核素、放射性药物和成像光子产生过程分开；Tc-99m举核跃迁例，F-18举湮没例；仅在题给值与物理衰变条件明确时计算。',
 ['未核全部核医学核素或最新DDEP核数据；不将两份不同用途资料当成精密核数据一致性审定','患者清除、生物半衰期和发生器母子增长不能只用单核素物理半衰期代替','近距离源部分沿用历史依据，本轮未新读所有源目录'],['TC-LABEL','F18-LABEL','BIPM-TC2010'])
add('mp-05-point-7',[
 ('限光与场大小','直接支持常见散射箔电子束的限光筒/附加挡块及小场PDD变化；不支持所有设计必须如此','IAEA05-ELECTRON §8.3.2–4 pp287–289'),
 ('SSD和输出','直接支持有效SSD与空气隙修正，不能不加修正套光子反平方；半影可随空气隙增宽','IAEA05-ELECTRON pp291,383–384'),
 ('介质及射程','直接支持bolus、肺骨非均匀性改变分布；CET只作简化水等效深度，不是所有界面完整输运','IAEA05-ELECTRON §8.3.6–7 pp291–293')],
 '改为常见电子束需按机型限光系统及能量、场、SSD和介质验证分布；区分几何扩散、散射、能量损失及水中射程定义。',
 ['未取得各现代机型和全部介质测量结果，不给统一SSD输出系数或剂量容差','不将射程、半影、PDD和输出混为一量；不批准E/2、1.09或其他待裁公式'],['IAEA05-ELECTRON'])
add('mp-06-point-3',[
 ('HDR剂量率定义','直接支持该指南所用HDR>12 Gy/h，引用ICRU38而非本轮已读ICRU原件','MPPG13A §1/§2'),
 ('放置/剂量率分类不同','现代指南区分腔内、组织间等临床情景，但未取得全部LDR/MDR边界原页','MPPG13B table1 and §4.3')],
 '分别讲放置几何与剂量率分类；HDR阈值标明所用定义，LDR/MDR数值和边界待补原始规范，不写2028必考数字。',
 ['LDR、MDR、PDR的完整数字边界与时间平均约定仍待原始标准','2028考试范围未确认，阈值不可当作所有局部组织实际剂量率'],['MPPG13A','MPPG13B'])
add('mp-06-point-4',[
 ('远程后装流程','直接支持本文Ir-192 HDR范围的施源器/通道重建、连接、计划传输和驻留时间/衰变核对','MPPG13B §4.3,§6.2–6.4'),
 ('后装概念范围','直接支持远程后装降低人员受照；历史手工后装与现有范围限制不支持后装必等于高活度HDR','MPPG13A §2.3/§2 scope')],
 '标题限定远程HDR后装示例，不把后装概念等同全部高活度设备；减少照射不写消除暴露。',
 ['手工、LDR及其他核素后装并非本指南范围；不能以Ir-192范例替代全分类','设备特定源路径及应急协议仍需专业判断'],['MPPG13A','MPPG13B'])
add('mp-07-point-3',[
 ('现代VMAT原始方法','直接支持旋转中叶片和角度相关输出的协调；最大剂量率与机架速度是交付约束','OTTO2008 §II.A–C'),
 ('同时变化的边界','不支持每时刻叶片、剂量率和速度三者全部变化或单弧定义涵盖所有现代实现','OTTO2008 §II.B'),
 ('患者特异QA适用条件','直接支持整弧EPID积分不等于角度分辨评价，检出要针对系统和误差验证','TG307 §3.3/§4.1–4.2.1')],
 '写为旋转中协调调制孔径及角度相关输出，剂量率和/或机架速度按设备与计划可变化；避免三项必须同时变化。',
 ['step-and-shoot和dynamic MLC部分沿用既有来源，本轮未重新全读','原论文公式图片未核清，不生成机械约束计算题；不迁移特定机型参数','EPID检验不代替独立计划核对或临床批准，也不推导普遍疗效优势'],['OTTO2008','TG307'])
add('mp-06-point-5',[
 ('驻留时间与优化','直接支持手调驻留时间/权重、图形、几何及逆向优化，并要求逐方法验证','MPPG13A §8.3.1'),
 ('位置/时间错误','直接支持源路径和首驻留点误差导致剂量错误，计划检查位置/通道/时间','MPPG13B §4.3/§6.2')],
 '保留位置和时间共同塑形的定性表述；固定几何和源强下才讨论时间缩放，不生成无条件定量误差保证。',
 ['具体驻留剂量核函数及总剂量线性叠加公式的原页尚未读取；不得伪称已完成TG43公式核验','未核任意长度治疗的衰变/过渡剂量模型或各设备误差幅度'],['MPPG13A','MPPG13B'],'supplement-to-v8-not-counted-again')
add('mp-06-point-6',[
 ('现代重建及核对','直接支持重建源路径、勾画/约束复查、数据传输与临床前全流程dry run','MPPG13A §8.3.2–5; MPPG13B §4.3,§6.2–6.4'),
 ('二次剂量计算与独立核对','指南区分可选二次剂量计算和独立训练人员计划核对，不能替换彼此','MPPG13A §8.3.4; MPPG13B §6.2')],
 '流程教学保留，说明源模型和算法/机构范围；不写二次计算能检出所有规划错误或是所有机构同一强制步骤。',
 ['未审核各治疗部位的完整处方、勾画与剂量限制，也未验证某机构临床流程','本轮只读HTML分节，无PDF页码，不将美国指南称为中国法规'],['MPPG13A','MPPG13B'],'supplement-to-v8-not-counted-again')
selected={r['id'] for r in updates if r['scope']=='first-batch-of-21'}
prior=[r['id'] for r in q['rows'] if r['newEvidence']]
priority=[]
for r in remaining:
 i=r['id']; tier=1 if i in selected else 2 if i.startswith(('mp-13','mp-03','mp-07')) else 3
 priority.append(dict(id=i,tier=tier,rationale='本轮可获得直接原文且涉及核素/SSD/分类或交付边界' if tier==1 else '后续按剂量/成像概念风险及直接来源可获得性推进',originalGap=r['historicalGap'],priorEvidenceReferences=r['priorEvidenceReferences'],status='本轮补读，仍条件性支持' if i in selected else '本轮未补读，保留旧证据和缺口'))
protected=[v8path,'product-2028-draft/mp-evidence-2026-10-22/四项原始证据与接续-v8.md','audit-2028/evidence/2026-10-21-waves/current-claims-v6a.json','audit-2028/evidence/2026-10-21-waves/primary-pages-v6a.json','product-2028-draft/mp-evidence-2026-10-21/教师6条交接.md','product-2028-draft/mp-evidence-2026-10-21/医学物理计量61条交接.md','expert-review-bundles/医学物理113条完整审阅稿-cf432b1e2f4e.md','product-2028-draft/content/decisions.json']
protected=[p for p in protected if P(p).exists()]
data=dict(revision='conditional-followup-v9-2026-10-23',branch='audit/2026-10-21-four-gaps-v7',baseCommit='062a6d049bdfe58bec1c805f38558f6629c6c63a',previousCi=39636185511,previouslyFollowedUp=prior,inheritedUnfollowedIds=[r['id'] for r in remaining],newlyFollowedUpIds=[r['id'] for r in updates if r['scope']=='first-batch-of-21'],remainingUnfollowedIds=[r['id'] for r in remaining if r['id'] not in selected],priorityQueue=priority,updates=updates,sources=sources,protectedHashes={p:sha(p) for p in protected},expertQueue=dict(teacher=6,medicalPhysicsMetrology=61,fullReview=113,changed=False,expertApproved=0,externalContact=False),expertApproved=0,formalContentChanged=False,deployed=False,liveLearningDataTouched=False,final2028RequirementsVerified=False,formulaAuthorization=False,sourceFieldAbsenceIsNotAbsenceOfEvidence=True,
 calculationChecks=dict(scope='数学/单位反例；非新题库、不构成临床计算协议',physicalDecay='A(t)=A0*2^(-t/T), T,t同单位；孤立单核素且无生成、无生物清除',f18Example=dict(A0_MBq=100,T_min=109.7,t_min=219.4,remaining_MBq=25),restrictions=['发生器母子增长不满足单核素无生成假设','物理半衰期不等于有效或生物半衰期','计数还受光子产额、效率、几何及衰减等影响；Bq不是计数率','HDR固定核函数的线性时间叠加仅作数学演示，TG43原页未核实，不授权课程公式','电子束非标准SSD不能只套无修正的反平方律']),
 retrievalFailures=[dict(url='https://aapm.onlinelibrary.wiley.com/doi/full/10.1118/1.2818738',result='403; later DOI landing URL returned selected original body, success recorded separately'),dict(url='https://onlinelibrary.wiley.com/doi/pdfdirect/10.1118/1.2818738',result='redirect destination inaccessible; PDF/formula images not read'),dict(url='https://pubmed.ncbi.nlm.nih.gov/18293586/',result='only footer returned; no abstract/body credited'),dict(url='https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1617web-1294055.pdf',result='web extractor rejected >20MB; local download initially denied by socket restriction, approved retry slow/incomplete at recording; no nuclear handbook page credited'),dict(url='https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/acm2.70118',result='timeout; DOI landing URL later returned selected body'),dict(url='https://www.nucleide.org/DDEP_WG/Nuclides/Tc-99m_tables.pdf',result='inaccessible; not read'),dict(url='https://www.aapm.org/pubs/reports/RPT_218.pdf',result='inaccessible; no body credited'),dict(url='https://www.aapm.org/pubs/reports/RPT_307.pdf',result='inaccessible; primary HTML later read')])
out=root/'conditional-followup-v9.json'
next(s for s in sources if s['id']=='TG307')['locator']='§3.3 Limitations, applications, and challenges; §4.1–4.2.1'
decay_source=next(s for s in sources if s['id']=='IAEA05-ELECTRON')
decay_source['locator']+='; §1.2.7 printed16–18/PDF54–56 (eq1.31/1.33 PDF55 text/image read)'
decay_source['pdfPages'] += [55]
decay_source['pageImagesViewed'] += [55]
data['calculationChecks']['sourceLocator']='IAEA05-ELECTRON §1.2.7 eq1.31/1.33, printed17/PDF55 image actually viewed'
data['retrievalFailures'][3]['result']+='; slow partial local download cancelled explicitly, incomplete PDF not read'
if out.exists(): raise SystemExit('Immutable output already exists: add a new revision instead')
out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
lines=['# v9 第一批高风险条件性主张补读','日期2026-10-23；独立专业审定0。原v8与历史证据保持；软件测试结果另存真实回执。','## 核对与范围','21条ID已逐一对照v8/v6a。原22条、教师6条、专家61条和113审阅稿仍为历史输入，不重新生成报告。缺字段不表示无证据。','本轮从21条中补读5条，余16条；另对v8中2条HDR记录补充现代正文，不重复计数。全部仍条件性支持，直接支持只针对子句，不升级整条或专家状态。','## 本轮原文、证据及最小修订']
for r in updates:
 lines+=['### '+r['id']+'｜'+r['conclusion']+'（'+r['scope']+'）','原文：'+r['originalText'],'原点哈希：'+r['originalSource']['pointHash']]
 for c in r['subclaimChecks']: lines+=['- '+c['claim']+'：'+c['support']+'；定位 '+c['locator']]
 lines+=['最小修订建议（未应用）：'+r['minimumRevision'],'未解决：'+'；'.join(r['remaining'])]
lines+=['## 来源与读取边界']
for s in sources: lines+=['- '+s['id']+' ['+s['title']+']('+s['url']+')；'+s['publishedAt']+'；'+s['version']+'；'+s['locator']+'。读取：'+s['readStatus']+'。限制：'+s['limits']]
lines+=['## 计算边界','F-18例：题给100 MBq，物理半衰期109.7 min，无母核生成及生物清除，219.4 min后为25 MBq。这是数学核对，不是患者活度、给药或计数率预测。标签的110/220 min表格为取整；不强行将取整和精确代入视为矛盾。BIPM和标签Tc半衰期版本分别记录。','IAEA电子页291/PDF329图像实际查看，式8.10的SSD_eff、g、z均为长度，OF为无量纲修正；本轮只核对其边界，不将该历史经验式加入课程或题库。1.09系数争议仍待裁定。','## 未补读16条']
lines += ['- '+i for i in data['remainingUnfollowedIds']]
lines+=['## 来源失败及待专业判断','失败详情见同名JSON，不将搜索或摘要当全文。Otto正文已得，但公式图片没有读清；2027大纲沿用暂定，本轮未重新确认2028正式要求。','核医学教师需确认药物/核素/光子来源、衰变条件与数值精度；电子束专家需确认模型及机型适用边界；HDR专家需确认分类、驻留核函数与机构流程；VMAT专家需确认交付约束和QA检出范围。沿用原6/61队列，未外联、未发送、未付费。','## 下一断点','余16条先处理PET/SPECT物理和小野探测器；现代HDR TG43核函数原页及完整LDR/MDR边界继续待核。不得以本轮补读5条宣称关闭这些专业问题。V59不变、R5不部署，真实学习数据未读写。']
(root/'第一批原始依据与接续-v9.md').write_text('\n\n'.join(lines)+'\n',encoding='utf-8')
print(json.dumps(dict(new=len(selected),remaining=len(data['remainingUnfollowedIds']),supplementary=2,sources=len(sources)),ensure_ascii=False))

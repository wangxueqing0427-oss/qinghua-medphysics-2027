"""One-time append-only v11 evidence assembly. Never run historical builders."""
import json,hashlib
from pathlib import Path
OUT=Path('product-2028-draft/mp-evidence-2026-10-23-v11')
if (OUT/'conditional-followup-v11.json').exists():raise RuntimeError('v11 already exists; preserve and append a new revision')
def read(p):return json.loads(Path(p).read_text('utf8'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
v10path='product-2028-draft/mp-evidence-2026-10-23-v10/conditional-followup-v10.json'
v10=read(v10path);original=read('audit-2028/evidence/2026-10-21-waves/current-claims-v6a.json')
v9=read('product-2028-draft/mp-evidence-2026-10-23/conditional-followup-v9.json')
ids=v10['remainingUnfollowedIds']
assert ids==['mp-01-point-8','mp-07-point-4','mp-07-point-6','mp-08-point-1','mp-10-point-1','mp-15-point-1','mp-15-point-3']
def source(id,title,authors,year,version,url,locators,pdfpages,limits):
 return dict(id=id,title=title,authors=authors,publishedAt=year,version=version,url=url,accessedAt='2026-10-23',accessStatus='selected-primary-body-read',readLocators=locators,readPdfPages=pdfpages,pageNumberBase=1 if pdfpages else None,limits=limits,independentExpertApproval=False)
sources=[
source('NIST-STAR','PSTAR and ASTAR Databases for Protons and Helium Ions',['NIST Physical Measurement Laboratory'],'undated live methods page; references ICRU49 (1993), not a new publication date','Web methods §3.2 and §3.5.1–3.5.4','https://physics.nist.gov/PhysRefData/Star/Text/programs.html',['HTML §3.2 output units, §3.5 methods including low-energy fitting, shell/density corrections and CSDA integration; no print/PDF pagination'],[], '只读方法正文，未取得任何具体材料数值表；典型拟合分界不能当作普适物理阈值，不证明全能区单调关系。'),
source('TRS461-v11','Relative Biological Effectiveness in Ion Beam Therapy',['IAEA','ICRU'],'2008-02','Technical Reports Series461, STI/DOC/010/461','https://www-pub.iaea.org/MTCD/Publications/PDF/trs461_web.pdf',['版权PDF5；§1.1.3印刷3–5/PDF14–16（既有概念重读，非首次发现）；新增§4.3(1)印刷46/PDF57碎裂尾段落'],[5,14,15,16,57],'历史报告；本轮不采用其疗效推断或RBE常数，不外推所有带电粒子。PDF图像请求未在工具中显示，不计视觉读取。'),
source('IAEA1196-v11','Radiation Oncology Physics: A Handbook for Teachers and Students',['E. B. Podgorsak (technical editor)','IAEA'],'2005','STI/PUB/1196, cached 696-page edition','https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf',['§2.6印刷49–52/PDF87–90文本；§8.1.1 Fig8.1印刷274/PDF312图像及文本；§8.1.5–6印刷279/PDF317文本；§15.7.6、15.7.8–9印刷534、537/PDF572、575（历史上下文重读）'],[87,88,89,90,312,317,572,575],'仅作历史教学依据；式2.11 OCR结构不可靠，未重建或授权公式；不采用历史设备容差/频次作现行标准。图8.1限其水、10×10cm²、SSD100cm示例。'),
source('AAPM82','Guidance document on delivery, treatment planning, and clinical implementation of IMRT',['Gary A. Ezzell','James M. Galvin','Daniel Low','Jatinder R. Palta','et al.'],'2003-07-24 (online); journal 2003-08','AAPM Report82; Medical Physics30(8),2089–2115; DOI10.1118/1.1591194','https://aapm.org/pubs/protected_files/reports/rpt_82.pdf',['题名PDF1；§III.C.5–8印刷2101–2103/PDF13–15选段；§III.F.3与§IV.A印刷2106/PDF18选段；§IV.D.1–8印刷2107–2109/PDF19–21；§IV.E印刷2110/PDF22选段'],[1,2,13,14,15,18,19,20,21,22],'2003历史指导且正文自述非处方性；旧技术、时间和阈值不当现行临床标准；全身剂量问题不等于已量化低剂量体积或二次癌风险。'),
source('BALLIVY06','Impact of geometric uncertainties on dose distribution during intensity modulated radiotherapy of head-and-neck cancer: the need for a planning target volume and a planning organ-at-risk volume',['O. Ballivy','W. Parker','T. Vuong','G. Shenouda','H. Patrocinio'],'2006-06','Current Oncology13(3):108–115; DOI10.3390/curroncol13030010','https://pmc.ncbi.nlm.nih.gov/articles/PMC1891177/',['HTML完整可访问；实际读§1、§2.1–2.5、§3.1.2、§3.2表II及相关段落、§4开头；108–115仅整篇印刷范围，未确认逐段印刷页/PDF页，不能伪造'],[], '8名头颈患者、26次重复CT、特定旧优化器及7–9束6MV；研究剂量学而非临床结局，不证明所有IMRT比所有3DCRT更敏感，不提供通用边界或百分数。'),
source('IGRT19-v11','Introduction of Image Guided Radiotherapy into Clinical Practice',['IAEA'],'2019-02','Human Health Reports16, STI/PUB/1827','https://www-pub.iaea.org/MTCD/Publications/PDF/P1827_web.pdf',['§1.1–1.3印刷1/PDF11；新增§4.1.9及4.1.9.1–2印刷9–11/PDF19–21（在线/离线）；§4.2.2.3印刷14/PDF24选段'],[11,19,20,21,24], 'X射线外照射实施报告；协议按部位与资源，非所有技术/近距离治疗通用定义；示例频次、容差不直接搬作现行临床规则。'),
source('FEIGLEY08-v11','Investigating Principles of Workroom Exposure, Final Progress Report',['Charles E. Feigley','Jamil Khan','James A. Hussey','Emily Lee'],'2008-03-26','University of South Carolina, NIOSH grant1R01OH07626, 100 PDF pages','https://stacks.cdc.gov/view/cdc/218585/cdc_218585_DS1.pdf',['题名PDF1；新增§2.3印刷12–14/PDF15–17工作间因素；§2.4及2.4.1印刷14–16/PDF17–19，Eq2.1印刷15/PDF18及近/远场模型边界'],[1,15,16,17,18,19], 'NIOSH资助原始研究报告，不是CDC强制标准；未视觉核验Eq2.1原页；背景增量是本轮显式守恒推导，不冒充该报告原式。'),
source('NIOSH-FAQ-v11','Ventilation FAQs Frequently Asked Questions',['CDC NIOSH'],'2024-10-04 (page date)','Live official FAQ accessed2026-10-23','https://www.cdc.gov/niosh/ventilation/faq/',['HTML FAQ5屏障气流；FAQ9源附近HEPA/颗粒物及CADR；无印刷或PDF页码'],[], '感染性气溶胶防护语境；过滤颗粒结论不授权所有气体污染物；不提供统一通风参数或风险消除保证。')]

def check(claim,status,refs,locator,conditions):return dict(claim=claim,status=status,sourceIds=refs,locator=locator,conditions=conditions)
spec={
'mp-01-point-8':dict(group='粒子能损与深度剂量',checks=[
 check('治疗语境的质子深度剂量峰与多能量展宽','direct-bounded-support',['TRS461-v11'],'§1.1.3 印刷3–5/PDF14–16','能量、介质和束流展宽共同影响；不是临床获益证明'),
 check('阻止本领单位及不同能区的模型处理','direct-bounded-support',['NIST-STAR','IAEA1196-v11'],'NIST §3.2、3.5；教材§2.6印刷49–52/PDF87–90','线性MeV/cm与质量MeV·cm²/g不得混淆；低能区需经验拟合/修正'),
 check('所有速度越低能损必越大或直接等同局部吸收剂量','unresolved-or-conditional',['NIST-STAR'],'§3.5.1–3.5.4','未读材料数值表，不宣称已证明低能区单调反例；单粒子能损不等同宏观深度剂量')],
 minimum='写为治疗质子束在介质中的能损和输运可形成射程末端附近的Bragg峰，多能量束叠加展宽覆盖靶深度；删去不加条件的全速度单调表述。',remaining=['缺具体材料低能区数值表及定量适用范围','能损、局部能量沉积与临床深度剂量的教学边界待专家确认']),
'mp-07-point-4':dict(group='计划实施与几何验证',checks=[
 check('影像、结构、目标/约束、优化评价、医师批准与治疗参数传输','direct-bounded-support',['AAPM82'],'§IV.D.1–6 印刷2107–2108/PDF19–20','教学概览，临床目标在早期即参与，并非严格单向CT后才有处方'),
 check('首次治疗前验证MU/剂量、MLC或通量、剂量分布及碰撞风险','direct-bounded-support',['AAPM82'],'§IV.D.7–8 印刷2109/PDF21；§III.F.3印刷2106/PDF18','验证方法按机构/技术制定；验证不只等同一次体模测量'),
 check('唯一审批顺序、全部岗位法定责任、现行QA时序','unresolved-or-conditional',['AAPM82'],'§IV.D.1及IV.D.7','原报告承认机构差异；不替代当地法规、现行协议和临床审批')],
 minimum='将原箭头标成可迭代的教学示例，补充早期临床目标、数据传输核查和首次治疗前验证；批准与验证责任依机构协议，不写成通用强制线性流程。',remaining=['现行本地审批责任及异常重计划流程未逐项核对','需教师/临床物理专家确认教学简化不会误导QA责任']),
'mp-07-point-6':dict(group='计划实施与几何验证',checks=[
 check('适形、器官保护潜力伴随优化/交付/QA复杂性','direct-bounded-support',['AAPM82'],'§I.A、IV.D.5、IV.E；印刷2090、2108、2110/PDF2、20、22','并非每个病人IMRT必优于3DCRT'),
 check('高梯度、运动或特定解剖变化会放大交付偏差风险','direct-bounded-support',['AAPM82','BALLIVY06'],'AAPM §III.C.5–8印刷2101–2102/PDF13–14；Ballivy HTML§2–3','研究范围为8名头颈患者与特定束流/算法；不可作统一几何误差换算'),
 check('所有IMRT计划低剂量体积增加以及统一敏感度','unresolved-or-conditional',['AAPM82','BALLIVY06'],'AAPM §III.C.8及III.D(f)印刷2102–2103/PDF14–15','全身剂量警示不等于低剂量体积已被普遍量化；需相同轮廓、目标、阈值和计划比较')],
 minimum='收益写成可实现的计划目标；几何风险限定高梯度、运动及具体方案。低剂量体积写成需按指定阈值比较的可能代价，不给通用增幅。',remaining=['缺同条件计划比较的低剂量体积直接数据','不把研究边界数值用于临床建议或所有IMRT与3DCRT优劣结论']),
'mp-08-point-1':dict(group='计划实施与几何验证',checks=[
 check('依据治疗位置影像及配准信息采取行动','direct-bounded-support',['IGRT19-v11'],'§1.1–1.3印刷1/PDF11','外照射报告语境；影像和床移不是同义词'),
 check('离线分析既往分次以修正后续分次，在线纠正在本次交付前执行','direct-bounded-support',['IGRT19-v11'],'§4.1.9、4.1.9.1–2印刷9–11/PDF19–21','离线更针对系统偏差；在线处理当次偏移，协议取决部位/资源'),
 check('全部IGRT都能实时完全消除运动或必须统一校正阈值','unresolved-or-conditional',['IGRT19-v11'],'§1.3及4.1.9','不授权具体动作阈值/频次；不能保证消除全部几何不确定性')],
 minimum='保留原定义，补充在线/离线评估及后续分次纠正均属影像引导工作流；具体配准、动作与复核按部位和机构协议。',remaining=['当代各设备/非X射线技术细节及校正容差未核','需专家确认基础课程对系统/随机偏差的教学深度']),
'mp-10-point-1':dict(group='粒子能损与深度剂量',checks=[
 check('治疗质子/离子可表现末端Bragg峰','direct-bounded-support',['TRS461-v11'],'§1.1.3印刷3–5/PDF14–16','不同粒子、能量、介质和束流条件有别'),
 check('离子碎裂会在峰后产生能量沉积，临床电子PDD不是相同尖峰','direct-bounded-support',['TRS461-v11','IAEA1196-v11'],'TRS §4.3(1)印刷46/PDF57；教材图8.1印刷274/PDF312、§8.1.5–6印刷279/PDF317','图像实际查看PDF312，仅此页计视觉证据；不读取数值推导通用曲线'),
 check('将所有带电粒子均归为同一Bragg深度剂量或峰后严格为零','unsupported-extension',['IAEA1196-v11','TRS461-v11'],'同上','原句范围过宽；不是认定原文声称了峰后零剂量；零尾部只是禁止扩展的误解')],
 minimum='将带电粒子明确限定为治疗质子/离子束，补充重离子碎裂尾部和电子束分布不同；峰后快速下降不等于严格为零。',remaining=['未建立各种粒子和能量的量化尾部比较','需医学物理专家确认能损与深度剂量区别及考试表述']),
'mp-15-point-1':dict(group='环境暴露与通风模型',checks=[
 check('充分混合、稳态、清洁稀释送风时C=G/Q','direct-bounded-support',['FEIGLEY08-v11'],'§2.4.1 Eq2.1印刷15/PDF18','G为污染物质量/时间，Q为稀释通风体积/时间；无额外去除/反应，非任意再循环风量'),
 check('有背景时增量ΔC=C−Cin=G/Q','derived-under-assumptions',['FEIGLEY08-v11'],'依据§2.4.1质量守恒的内部推导；不是原文引用','稳态G+Q·Cin−Q·C=0，恒体积、同流量、背景恒定；单位mg/h÷m³/h=mg/m³'),
 check('近场个人暴露、非稳态或感染概率由该式给出','unsupported-extension',['FEIGLEY08-v11'],'§2.3及2.4.1印刷12–16/PDF15–19','源位置、气流、人员活动和非均匀性另需评价；不能把平均浓度直接当感染风险')],
 minimum='先定义ΔC为相对送风背景增量，说明G、Q及充分混合稳态、无其他去除条件；标示守恒推导和质量单位，结果不是个人吸入剂量或感染概率。',remaining=['具体考试题给条件与单位仍需逐题核对','真实场景额外过滤/沉积/反应及非稳态需另建验证模型']),
'mp-15-point-3':dict(group='环境暴露与通风模型',checks=[
 check('布局、源与气流路径共同影响暴露','direct-bounded-support',['FEIGLEY08-v11'],'§2.3印刷12–14/PDF15–17','包含进排风、家具/源位置、热因素和人员行为；不是单一参数通用处方'),
 check('隔板可能改善也可能阻碍气流，源附近过滤需结合实际布局','direct-bounded-support',['NIOSH-FAQ-v11'],'FAQ5、FAQ9 HTML正文','感染性气溶胶语境；HEPA/CADR针对颗粒物，不是所有气态污染物'),
 check('任意隔板、统一换气参数可保证所有污染物风险消除','unsupported-extension',['NIOSH-FAQ-v11'],'FAQ5、FAQ9','需现场气流与暴露评价；无气体净化率或通用风险数字依据')],
 minimum='保留结合暴露路径原则；明确隔板效果取决布置，源控制和通风措施应针对污染物性质、气流及人员位置评价，不作统一参数保证。',remaining=['无具体空间现场数据，不能给出设计验收/健康风险消除结论','需职业卫生/通风专家确认课程示例边界'])}
rows=[]
for id in ids:
 old=next(r for r in original['rows'] if r['id']==id);s=spec[id];q=next(r for r in v9['priorityQueue'] if r['id']==id)
 rows.append(dict(id=id,originalText=old['originalText'],originalSource=old['originalSource'],originalVersion=old['originalVersion'],pointHash=old.get('pointHash',old['originalSource']['pointHash']),priorConclusion=old['conclusion'],priorSourceIds=old['sourceIds'],priorLocator=old['locator'],priorGap=q['originalGap'],group=s['group'],subclaimChecks=s['checks'],sourceIds=list(dict.fromkeys(i for c in s['checks'] for i in c['sourceIds'])),conclusion='条件性支持',bodyFollowupPerformed=True,minimumRevision=s['minimum'],remaining=s['remaining'],nextStep='按明确缺口补证并交独立学科专家；不自动修改原件或正式教学',appliedToOriginal=False,expertApproved=False))
protected=dict(v10['protectedHashes'])
localonly={k:h for k,h in read('audit-2028/evidence/2026-10-23-v11/local-start-hashes.json')['protectedHashes'].items() if k not in protected and k!=v10path}
for folder in ['product-2028-draft/mp-evidence-2026-10-22','product-2028-draft/mp-evidence-2026-10-23','product-2028-draft/mp-evidence-2026-10-23-v10','audit-2028/evidence/2026-10-23-v10']:
 for p in Path(folder).rglob('*'):
  if p.is_file():protected[p.as_posix()]=sha(p)
failures=[]
for name in ['v11-access.json','v11-access-escalated.json']:
 for r in read('tmp/pdfs/'+name):
  if r['status']=='failed':failures.append(dict(method='local-urllib-'+name,**r))
failures += [dict(method='web',url='https://pdg.lbl.gov/2024/reviews/rpp2024-rev-passage-particles-matter.pdf',error='400 Timeout fetching',readStatus='not-read'),dict(method='web',url='https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1603_web.pdf',error='not accessible via web tool; exploratory URL, no verified source identity',readStatus='not-read'),dict(method='python-local-extraction',error="ModuleNotFoundError: No module named fitz; pypdf used successfully for cached IAEA1196",readStatus='fallback-recorded'),dict(method='web-screenshot',error='Screenshot tool returned reference only; no page pixels actually available to inspect. No visual credit for TRS461/Feigley',readStatus='not-visually-read'),dict(method='pdftoppm',error='nameToUnicode path warnings for Bulgarian/Greek/Thai; exit0, PNG generated and inspected',readStatus='IAEA1196 PDF312 actually viewed'),dict(method='github-connector',error='Initial branch/main/commit fetches intermittently failed transport; isolated head and commit metadata later read. No clean local Git checkout',readStatus='intermittent')]
OUT.mkdir(parents=True,exist_ok=True)
v=dict(revision='conditional-followup-v11-2026-10-23',branch='audit/2026-10-21-four-gaps-v7',baseCommit='1cc1b4f65e35f53fbd4079c9e61e16a28a592976',previousTestedCommit='aa5a19953232b1e32a2586a4af78a278e7978c30',previousCi=39897733247,inheritedUnfollowedIds=ids,newlyFollowedUpIds=ids,remainingUnfollowedIds=[],queueMeaning='新增正文跟进7，不表示7条科学充分或审定；所有7条保留条件性状态和子主张缺口',updates=rows,sources=sources,protectedHashes=protected,localProtectedHashes=localonly,retrievalFailures=failures,imageReadEvidence=[dict(sourceId='IAEA1196-v11',pdfPage=312,printedPage=274,path='tmp/pdfs/v11-electron-p312.png',actuallyViewed=True,sha256=sha('tmp/pdfs/v11-electron-p312.png'))],localSourceCache=dict(path='tmp/pdfs/iaea-1196.pdf',sha256=sha('tmp/pdfs/iaea-1196.pdf'),bytes=Path('tmp/pdfs/iaea-1196.pdf').stat().st_size),supplementary=[],hdrQueueChanged=False,independentExpertApproved=0,formalContentChanged=False,deployed=False,liveLearningDataTouched=False,externalContact=False,paidServiceCreated=False,final2028RequirementsVerified=False,calculationChecks=dict(kind='internal algebra and units, not clinical validation',formula='G+Q*Cin-Q*C=0',derived='DeltaC=G/Q; C=Cin+G/Q',assumptions=['steady-state','well-mixed','constant-volume','constant-inlet-background','balanced-dilution-flow','no-other-sink-or-reaction'],example=dict(G_mg_per_h=120,Q_m3_per_h=60,Cin_mg_per_m3=0.3,DeltaC_mg_per_m3=2,C_mg_per_m3=2.3),sourceFormulaVisuallyVerified=False))
(OUT/'conditional-followup-v11.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
report=['# v11 剩余7条原始证据核查','\n日期2026-10-23。AI内部证据复核，独立专业审定0。仅在原隔离分支追加记录，不修改课程或真实学习数据。','\n## 基线与统计','\nv10回执1cc1b4f、工程aa5a199；7条完整原文来自v6a不可变视图并逐项回溯v8/v9缺口。9条PET/SPECT/小野不重复计数，HDR不计入。7条均进行了正文跟进，仍全部条件性支持；未补读队列为空不代表知识缺口清零。','\n## 来源及实际读取']
for s in sources:report += ['\n### '+s['id'],s['title']+'；'+s['publishedAt']+'；'+s['version'],s['url'],'实际读取：'+'；'.join(s['readLocators']),'限制：'+s['limits']]
report+=['\n## 七条逐项复核']
for r in rows:
 report+=['\n### '+r['id']+'｜'+r['group'],'原文：'+r['originalText'],'原文哈希：`'+r['pointHash']+'`','历史缺口：'+r['priorGap']]
 for c in r['subclaimChecks']:report+=['- '+c['status']+'：'+c['claim']+'；依据'+','.join(c['sourceIds'])+'，'+c['locator']+'；条件：'+c['conditions']]
 report+=['最小修订建议（未应用）：'+r['minimumRevision'],'仍待核：'+'；'.join(r['remaining']),'结论：条件性支持，待独立审核。']
report+=['\n## 失败、限制与下一断点','\n受限网络WinError10013，批准后的公开PDF下载仍遇TLS超时/403；网页工具能读所列正式正文，二者分别记录。PDG超时与探索性Pub1603地址不作为证据。未取得新PDF不冒充视觉核验，只有既有IAEA1196 PDF312新渲染并实际查看。Ballivy使用HTML正文，不虚构逐段PDF页。','\n完整原文、来源/页码、子主张、单位推导、历史哈希与失败见JSON。七条科学缺口保持逐项列表；下一步优先材料特异低能阻止本领数值、同条件IMRT低剂量阈值比较、当代QA/IGRT协议及真实空间模型验证。HDR继续沿v10单独队列，不在本轮声称完成。','\n## 工程验证','\n测试记录追加保存于audit-2028/evidence/2026-10-23-v11/；完整本地回归、远端隔离126项与浏览器56项分别记录实际结果。历史CI不替代本轮执行。正式V59不变，R5不部署；没有外联专家或新增付费。']
(OUT/'七条原始证据与接续-v11.md').write_text('\n\n'.join(report)+'\n',encoding='utf8')
Path('audit-2028/evidence/2026-10-23-v11/failure-and-boundaries.json').write_text(json.dumps(dict(failures=failures,noExpertApproval=True,noPublication=True),ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps(dict(followedUp=len(rows),scientificallyFullyConfirmed=0,conditional=len(rows),remainingUnfollowed=0,expertApproved=0,protectedFiles=len(protected))))

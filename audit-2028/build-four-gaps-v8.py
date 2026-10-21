"""Append this research batch only; not an approval or deployment utility."""
import json, hashlib
from pathlib import Path
R=Path(__file__).resolve().parent.parent
O=R/'product-2028-draft/mp-evidence-2026-10-22'
O.mkdir(exist_ok=True)
base=R/'audit-2028/evidence/2026-10-21-waves'
view=json.loads((base/'current-claims-v6a.json').read_text(encoding='utf-8'))
byid={r['id']:r for r in view['rows']}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(name,obj):
    text=json.dumps(obj,ensure_ascii=False,indent=2)+'\n' if not isinstance(obj,str) else obj
    p=O/name
    if p.exists() and p.read_text(encoding='utf-8')!=text: raise RuntimeError('Existing version differs: '+str(p))
    p.write_text(text,encoding='utf-8')
sources=[
 {'id':'DING1996-ABSTRACT','title':'Mean energy, energy-range relationships and depth-scaling factors for clinical electron beams','authors':['G X Ding','D W Rogers'],'publishedAt':'1996-03','doi':'10.1118/1.597788','url':'https://pubmed.ncbi.nlm.nih.gov/8815379/','locator':'正式PubMed页面作者栏及Abstract第1–3段；卷23(3)361–376为文章书目页段，不是本轮已读PDF页','accessStatus':'original-abstract-page-read','fullTextRead':False,'pdfPage':None,'printedPageRead':None,'supported':'摘要明确区分平均与最可几表面能量，报告Rp关系候选系数1.98、5–50 MeV与约3%研究准确度。','limitations':'全文未取得；摘要未逐项给出场尺寸、全部射程测量条件和系数单位。本轮不是全文原页验证或IAEA勘误。'},
 {'id':'AAPM202-2020','title':'Physical Uncertainties in the Planning and Delivery of Light Ion Beam Treatments, AAPM Report 202','publishedAt':'2020-03','url':'https://www.aapm.org/pubs/reports/RPT_202.pdf','accessStatus':'official-pdf-selected-body-and-two-page-images-read','pages':107,'bytes':5474881,'sha256':'22e5f53a9949b70aeebd3fd5d1b3be76a65b18a553999a97ddc0d80ce3c5c49a','locators':['§3.6 印刷/PDF17–18','§4.5–4.6 印刷/PDF28–31','§5.1 印刷/PDF31–32','§7.1 印刷/PDF52–53','§7.6–7.7 印刷/PDF55–56','§9.1–9.2 印刷/PDF72–73','§10.6 印刷/PDF84–85','§11.1–11.4 印刷/PDF88–92'],'pageImagesViewed':[84,89],'limitations':'2020报告含截至2015/2016的历史现状描述，不能当2026最新部署状况；不迁移历史临床数值或通用阈值。'},
 {'id':'STEDEM2024','title':'Systematic evaluation of spatial resolution and gamma criteria for quality assurance with detector arrays in stereotactic radiosurgery','authors':['Ann-Kathrin Stedem','Mark Tutty','Ndimofor Chofor','Marco Langhans','Christoph Kleefeld','Andreas A Schönfeld'],'publishedAt':'2024-01-24','doi':'10.1002/acm2.14274','url':'https://pmc.ncbi.nlm.nih.gov/articles/PMC10860444/','accessStatus':'original-html-body-read','locators':['§1','§2.1–2.2及表1','§3.2–3.3','§4相关讨论'],'pdfPage':None,'printedPageRead':None,'limitations':'HTML正文有节定位但未读PDF，不能编造页码；两个SRS计划、指定设备和算法。§1/§2.2将间距与最高频率直接比较的文字有量纲疑点，不按原句生成公式。'},
 {'id':'IAEA1196-v8-read','title':'Radiation Oncology Physics: A Handbook for Teachers and Students, STI/PUB/1196','publishedAt':'2005-07','url':'https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf','accessStatus':'local-original-pdf-selected-body-read','sha256':'da4e3b5af19ed9506a812fea6704ff15cf55991902684a17759dbc7cbba05da0','locators':['§13.7.1–13.7.4 印刷479–480/PDF517–518','§13.8.3 印刷480/PDF518','§13.9.3、13.9.5 印刷482–483/PDF520–521'],'limitations':'历史教学资料，不采用其中泄漏、释放、定位容差、频次等数值作为现行标准。电子原页图像的读取沿用v6a回执，不谎称本轮重读所有图像。'}]
for s in sources:s.update(accessedAt='2026-10-22',expertApproval=False)
def row(id,conclusion,sourceIds,checks,remaining,revision):
    r=byid[id]
    return dict(id=id,originalText=r['originalText'],originalSource=r['originalSource'],originalVersion=r['originalVersion'],historicalStatus=r['conclusion'],conclusion=conclusion,sourceIds=sourceIds,subclaimChecks=checks,remaining=remaining,minimumRevision=revision,expertStatus='pending-independent-professional-review',appliedToOriginal=False)
four=[
 row('mp-05-point-4','来源间公式冲突待裁定',['DING1996-ABSTRACT'],[
   {'subclaim':'水中Rp≈E/2中的E可不加区分地使用','finding':'不支持。原始摘要区分表面平均能量与最可几能量；不能用标称能量替代定义明确的表面能量。'},
   {'subclaim':'1.09与1.98','finding':'v6a已查看官方教材原页1.09；本轮读取Ding/Rogers正式摘要，候选关系为1.98，保留来源间差异，不静默改书。'},
   {'subclaim':'能区及精度','finding':'5–50 MeV及约3%是该研究摘要所报告范围/准确度，不是Rp≈E/2的误差保证，不外推所有临床机器。'},
   {'subclaim':'单位与全文条件','finding':'教材约定MeV/cm已在v6a取得；1996全文及公式原页未取得，不能把教材单位直接冒充已从论文全文核验。'}],
   ['未取得正式IAEA勘误','未取得1996论文全文原页、完整测量条件与公式单位段','需要电子束剂量学专家裁定课程是否及如何采用'],
   '保留原文为历史；停止无条件用E/2解题。若保留量级说明，必须注明水、射程/能量定义及近似性质。候选1.98不进入正式课程或计算题。'),
 row('mp-10-point-3','条件性支持',['AAPM202-2020'],[
   {'subclaim':'CT值到阻止本领转换影响射程','locator':'§5.1 pp31–32；§7.1 pp52–53','finding':'直接支持。模型可查表插值，也可先赋材料再赋阻止本领；CT数值不直接等于相对阻止本领。'},
   {'subclaim':'标定与模型','locator':'§7.1、7.7 pp52–53、55–56','finding':'转换函数需按扫描协议建立并验证；骨、装置及植入物残差不能借软组织误差代替。'},
   {'subclaim':'气腔/骨、摆位及解剖变化','locator':'§7.6 p55；§9.1–9.2 pp72–73；§11.1 p89','finding':'气体/组织路径变化可改变穿透深度；异质性下摆位变化不只是剂量分布刚性平移，骨/软组织/肺实例有正文。'},
   {'subclaim':'所有界面具有统一误差','finding':'原句没有该数字或绝对命题，不额外要求通用百分比才认可定性主张；也不从该材料生成统一界面误差。'}],
   ['界面效应涉及能量损失、散射与算法，不能全归因HU标定','本轮未验证某一患者或特定TPS的误差，未批准任何临床修正参数'],
   '明确是可能影响射程或剂量，不是每种气骨界面都产生同方向/同幅度位移；区分CT数据、转换函数、异质性运输与解剖变化。'),
 row('mp-03-point-7','条件性支持',['STEDEM2024'],[
   {'subclaim':'阵列多点获取并用于PSQA','locator':'§1、§2.2表1、§3.3','finding':'原始正文和测量方法直接支持平面、圆柱阵列在患者特异QA中的应用及实时读出。'},
   {'subclaim':'尺寸、间距与空间分辨能力','locator':'§1、§2.2、§3.2','finding':'元件尺寸、采样间距及响应函数共同影响重建信息；尺寸、间距、TPS网格、插值网格不是同一个量。'},
   {'subclaim':'更密一定更能检错','locator':'§3.3、§4','finding':'不支持。设备、gamma算法、阈值、误差类型及通过点分布影响检出表现；插值不能创造丢失的信息。'}],
   ['两个SRS计划不支持所有患者、全类别阵列或统一间距阈值','圆柱布点不等于直接测得完整三维体积剂量；重建依赖模型','论文Nyquist文字表述有量纲疑点，需确认标准信号定义后才能用作课程公式'],
   '将效率高改为可同时读出多个测量点；空间分辨能力由元件响应、几何采样及重建共同决定，不写间距=分辨率。'),
 row('mp-10-point-4','已找到支持依据',['AAPM202-2020'],[
   {'subclaim':'扰动下仍可接受的鲁棒性评价','locator':'§11.1.1 pp89–90、§11.4 p92','finding':'直接支持按系统摆位、过穿透和欠穿透情景重算剂量与DVH；原句为定性评价，不要求固定通用情景数。'},
   {'subclaim':'评价与优化的区别','locator':'§10.6 pp84–85；§11.1 pp89–90','finding':'情景评价是在给定计划上重新计算；稳健优化把情景纳入求解目标；传统外扩不能一般保证高调制质子CTV内剂量鲁棒性。'},
   {'subclaim':'概率、minimax、逐体素最坏剂量','locator':'§10.6.1 pp84–85','finding':'概率加权期望、场景目标最大值、逐体素极值包络是不同构造；包络不一定是物理可交付的单一场景。'}],
   ['情景集合、幅度及可接受阈值依赖机构和病例','静态情景不能自动覆盖呼吸/解剖变化','不声称APP已实现临床稳健优化或专家认可'],
   '保留原定性目标，补需明确扰动假设及评价指标；区分重算评价、稳健求解和传统边界，不照搬报告中的临床示例数值。')]
additional=[
 ('mp-01-point-9','AAPM202-2020','§4.6 pp30–31','RBE依赖组织、终点、分割与LET；不支持无条件的碳/质子固定排序。','改为条件性比较；不能以固定RBE推断个体疗效。'),
 ('mp-10-point-7','AAPM202-2020','§4.6 pp30–31','吸收剂量与RBE加权剂量应透明一致报告；生物参数并非统一实测常数。','并列物理剂量和模型，保留模型/终点及单位说明；不跨模型直接换算。'),
 ('mp-10-point-2','AAPM202-2020','§3.6 pp17–18；§4.5 pp28–30','不同能量叠加与扫描点位置/权重有直接正文，不等于所有扫描都是同一时序。','区分能层深度与横向点位；不将临床示例间距、MU或能量误差作通用考试常数。'),
 ('mp-08-point-5','AAPM202-2020','§9.2–9.3 p73；§11.2–11.3 pp91–92','不同分次的解剖变化与同分次呼吸运动分开处理；fraction不等于一段beam-on。','用同一治疗分次内/不同分次之间描述，不将时间边界缩窄为单次出束。'),
 ('mp-08-point-8','AAPM202-2020','§9.2 p73；§11.2 p91','新影像上重算并评价原约束是适应性重计划依据，几何校正不能代替全部解剖剂量评价。','保留可能需重评；变化大小、频率和重计划决定仍须专业协议，不自动触发。'),
 ('mp-09-point-1','AAPM202-2020','§11.3 pp91–92','呼吸相位评估和运动/束扫描相互作用不能仅靠单一平均CT或固定体位解决。','只补充必要运动评估，不教个人屏气或门控处方；本轮未声称完整固定技术审核。'),
 ('mp-06-point-5','IAEA1196-v8-read','§13.7.1、13.7.3 p479/PDF517；§13.9.3 p482/PDF520','几何重建、时间缩放和程序化源位置核对有正文；不把同活度线性时间关系推广到全程衰变积分。','讲清位置和时间均影响剂量；仍缺现代HDR驻留优化原始专节及误差定量。'),
 ('mp-06-point-6','IAEA1196-v8-read','§13.7.1–4 pp479–480/PDF517–518；§13.9.5 pp482–483/PDF520–521','重建、单位、手算对照、衰变及书面质量管理补齐部分已知缺口。','原流程可作教学框架，现代勾画、施源器/接口和完整HDR临床QA仍须现行专项原文。'),
 ('mp-06-point-7','IAEA1196-v8-read','§13.7.4、13.8.3 pp479–480/PDF517–518','衰变修正和可追溯标定有直接正文。','卡源/回源失败的机构应急流程仍待核；不提供临床操作指令或采用旧泄漏阈值。')]
follow=[row(id,'条件性支持',[sid],[{'locator':loc,'subclaim':'前轮明确未核实部分的追加核对','finding':finding}],[limit],limit) for id,sid,loc,finding,limit in additional]
history=['current-claims-v6a.json','electron-coefficient-discrepancy-v7.json','external-source-crosscheck-v7.md','conditional-claims-triage-v7.md']
result={'revision':'four-gaps-v8-2026-10-22','baselineCommit':'ca82fab9cb9797b076c54b60df17255b0af72d44','actor':'AI内部原文核查，非独立专业审定','sources':sources,'fourGapUpdates':four,'conditionalUpdates':follow,'historicalInputHashes':{f:sha(base/f) for f in history},'citationCorrection':{'preserves':'electron-coefficient-discrepancy-v7.json','priorAuthors':'Mackie TR et al.','correctAuthors':['G X Ding','D W Rogers'],'identifier':'PMID8815379','basis':'已读正式PubMed作者栏；是本工程书目纠正，不冒称原书勘误'},'retrievalFailures':[{'url':'https://pmc.ncbi.nlm.nih.gov/articles/PMC3281975/','result':'reCAPTCHA；未以搜索正文片段冒充全文读取'},{'url':'https://doi.org/10.1118/1.597788','result':'web fetch Cache miss；未取得全文'},{'url':'https://nrc-publications.canada.ca/eng/search/?q=Mean+energy+energy-range+relationships','result':'不可访问；未取得全文'}],'expertApproved':0,'appliedToOriginal':False,'teachingFormulaAuthorized':False,'realLearningDataTouched':False,'deployed':False,'scope2028':'2027仅作暂定依据，本轮未确认2028正式考纲'}
save('four-gaps-followup-v8.json',result)
conditional=[r for r in view['rows'] if r['conclusion']=='条件性支持']
queue=[]
for r in conditional:
    reviewed=next((u for u in follow if u['id']==r['id']),None)
    queue.append({'id':r['id'],'pointHash':r['originalSource']['pointHash'],'historicalGap':r['unsupported'],'priorEvidenceReferences':r.get('sourceIds') or r.get('sourceChecks',[]),'thisBatchStatus':'已追加子句核查，仍条件性支持' if reviewed else '本轮未补读，保留原缺口','newEvidence':reviewed})
save('conditional-followup-v8.json',{'revision':'conditional-queue-v8','basis':'30条原条件性支持逐条保留，不重复前轮22条报告','total':30,'actuallyFollowedUp':len(follow),'remainingNotFollowedUp':30-len(follow),'schemaCorrection':'v7队列把15条缺少sourceChecks字段误表述成无逐条来源。v6已有sourceIds及独立来源目录；字段缺失不等于来源未读。此记录不声称本轮重新核验所有旧来源。','rows':queue,'expertApproved':0})
md='# 四项证据核查与条件性支持接续 v8\n\n日期2026-10-22；分支audit/2026-10-21-four-gaps-v7；远程基线ca82fab。沿用v6a/v7，不重做前轮22条。独立专业审定0，课程/APP/真实数据未改。\n\n'
for r in four+follow:
    md+=f"## {r['id']}｜{r['conclusion']}\n\n原文：{r['originalText']}\n\n原要点哈希：{r['originalSource']['pointHash']}\n\n"
    for c in r['subclaimChecks']:md+=f"- {c.get('subclaim','')}：{c['finding']} 定位：{c.get('locator','见来源目录与电子v6a/v7回执')}\n"
    md+='\n最小修订：'+r['minimumRevision']+'\n\n剩余：'+'；'.join(r['remaining'])+'\n\n'
md+='## 原始依据与实际读取\n\n'
for s in sources:md+=f"- [{s['title']}]({s['url']})；{s['publishedAt']}；{s['accessStatus']}。{'；'.join(s.get('locators',[])) or s.get('locator','')}。限制：{s['limitations']}\n"
md+='\n## 历史纠正与接续\n\n电子原始论文作者应为Ding与Rogers，而非旧v7误写Mackie；追加纠正，保留旧文件。旧队列15条没有sourceChecks不等于没有来源，sourceIds与来源目录仍可追溯。\n\n本轮实际追查原30条中的9条，全部继续条件性支持；21条本轮未补读，逐条留在conditional-followup-v8.json。不得把此队列或软件测试当作专家审定。电子仍待全文/正式勘误与专业裁定；阵列/CT保留具体适用限制；稳健性原句的定性概念已直接支持。没有关闭剩余专业审核事项。\n\n测试与CI将在实际执行后另存回执，不预填通过。下一批优先核医学具体核素、电子束SSD及介质、现代HDR与VMAT直接原文；不自动安排外联或费用。\n'
save('四项原始证据与接续-v8.md',md)
print(json.dumps({'fourItems':4,'conditionalActuallyFollowedUp':len(follow),'conditionalNotFollowedUp':30-len(follow),'expertApproved':0},ensure_ascii=False))

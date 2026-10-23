"""Append isolated evidence records; never edit source lessons or review decisions."""
import json,hashlib
from pathlib import Path
root=Path('.'); out=root/'product-2028-draft/mp-evidence-2026-10-23-v10'; out.mkdir(exist_ok=True)
if (out/'conditional-followup-v10.json').exists():
 raise RuntimeError('Version already exists. Preserve it; create a new evidence revision instead of rerunning this historical builder.')
def read(p):return json.loads(Path(p).read_text(encoding='utf8'))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
v9path='product-2028-draft/mp-evidence-2026-10-23/conditional-followup-v9.json'
v9=read(v9path); old=read('audit-2028/evidence/2026-10-21-waves/current-claims-v6a.json')
ids=['mp-13-point-1','mp-13-point-2','mp-13-point-4','mp-13-point-6','mp-13-point-7','mp-03-point-4','mp-03-point-5','mp-03-point-6','mp-03-point-9']
def source(id,name,authors,year,url,version,locator,pages,limits):
 return dict(id=id,name=name,authors=authors,publishedAt=year,url=url,version=version,accessedAt='2026-10-23',readStatus='selected-primary-pdf-body-paragraphs-read',locator=locator,readPdfPages=pages,pageNumberBase=1,limits=limits,expertApproval=False)
sources=[
source('SPECT-QA','Quality Assurance for SPECT Systems',['IAEA'],'2009 (official catalogue year)','https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1394_web.pdf','Human Health Series No.6, STI/PUB/1394','§2.1.1、能量窗段落、空间分辨率段落与术语smoothing；印刷12、16、32–33、244 / PDF24、28、44–45、256',[24,28,44,45,256],'传统Anger相机描述，不覆盖全部现代设备；未声称全书读取。2009年份非本轮版权页视觉核验。'),
source('ESTEVES09','Novel solid-state-detector dedicated cardiac camera for fast myocardial perfusion imaging: multicenter comparison with standard dual detector cameras',['Fabio P. Esteves','Paolo Raggi','Russell D. Folks','et al.'],'2009','https://link.springer.com/content/pdf/10.1007/s12350-009-9137-2.pdf','J Nucl Cardiol 16:927–934; DOI10.1007/s12350-009-9137-2','Methods: Ultra-Fast Solid-State Cardiac Camera，印刷928–929 / PDF2–3',[2,3],'特定DNM心肌灌注、Tc-99m tetrofosmin研究；不证明全部CZT架构或绝对定量性能。'),
source('MOSES11','Fundamental Limits of Spatial Resolution in PET',['William W. Moses'],'2011-08-21','https://psec.uchicago.edu/library/applications/PET/Bill_moses_fundamental_limits.pdf','Author manuscript printout; DOI10.1016/j.nima.2010.11.092','§2.6–2.8，网页打印本PDF5–9；原刊S236–S240，无已核逐页对应',[5,6,7,8,9],'正文经web读取；本地另有PDF缓存。未把打印本页码冒充原刊页码；未视觉复核公式，不授权公式教学。'),
source('EANM15','FDG PET/CT: EANM procedure guidelines for tumour imaging: version 2.0',['Ronald Boellaard','Roberto Delgado-Bolton','et al.'],'2014-12-02 online; 2015 journal','https://link.springer.com/content/pdf/10.1007/s00259-014-2961-x.pdf','Eur J Nucl Med Mol Imaging42:328–354; DOI10.1007/s00259-014-2961-x','CT pitfalls及PET image reconstruction；印刷341–342 / PDF14–15',[14,15],'成人肿瘤18F-FDG历史v2.0指南；不认定为2026最新规范或其他核素通则，不宣称读完全部散射算法。'),
source('TRS483','Dosimetry of Small Static Fields Used in External Beam Radiotherapy',['IAEA','AAPM'],'2017-11','https://www-pub.iaea.org/MTCD/Publications/PDF/D483_web.pdf','Technical Reports Series No.483, STI/DOC/010/483','§1.3印刷7/PDF19；§2.1.1部分印刷9–10/PDF21–22；§4.2.1选段印刷66–71/PDF78–83',[19,21,22,78,79,80,81,82,83],'限≤10MV小静态外照射光子野；不含电子、质子、正电压束。未视觉逐页核公式或读取全部校正因子表。'),
source('TG43U1','Update of AAPM Task Group No.43 Report: A revised AAPM protocol for brachytherapy dose calculations',['Mark J. Rivard','Bert M. Coursey','et al.'],'2004-02-27','https://www.aapm.org/meetings/04AM/pdf/14-2226-27835.pdf','Med Phys31(3):633–674; DOI10.1118/1.1646040','§III.A Eq1–3印刷637–638/PDF5–6；§III.A.4–5 Eq6、8印刷639/PDF7',[5,6,7],'正文文本已读；公式上下标和μ单位尚未视觉确认。2004配套共识数据主要是低能种子，不自动作为Ir-192 HDR数据；已发现勘误链接但未读其正文。'),
source('HEBD12','Dose Calculation for Photon-Emitting Brachytherapy Sources with Average Energy Higher than 50 keV: Full Report of the AAPM and ESTRO',['Jose Perez-Calatayud','Facundo Ballester','et al.'],'2012-08; bundled corrections through2016-01','https://www.aapm.org/pubs/reports/RPT_229_full.pdf','AAPM Report229, 153 PDF pages, current downloaded-web edition includes corrigenda','Corrigenda PDF3；§III–III.A印刷7–9/PDF23–25；符号表部分印刷44/PDF60',[3,23,24,25,60],'2016勘误页已读；仅部分正文，不宣称已核所有表格/全部驻留优化算法或临床QA。')]
facts={
'SPECT-QA':'传统NaI(Tl)闪烁光经PMT读出；能量窗不能完全拒绝患者散射；平滑的降噪与分辨损失不是本征指标。',
'ESTEVES09':'特定心脏系统以19个固定CZT模块和多针孔采集；定位可转动，正式采集时探头/准直器不动。',
'MOSES11':'§2.8区分高计数点源模型与有限计数下重建噪声/平滑；不提供一条普适计数—分辨率换算。',
'EANM15':'列出归一化、死时间、随机、散射和衰减校正；CT截断、金属和体位不一致限制定量。',
'TRS483':'探测器须按任务及结构表征，体积平均与响应扰动须分开考虑；胶片扫描须匹配标定的照后间隔。',
'TG43U1':'Eq1含源强、剂量率常数、几何比、径向函数及各向异性；常数依核素和源型号，g与F定义分开。',
'HEBD12':'TG43水介质叠加和散射假设有限；介质边界、屏蔽不由一般水中核函数自动解决。'}
for s in sources:s['directSupport']=facts[s['id']]
spec={
'mp-13-point-1':(['SPECT-QA','ESTEVES09'],['传统NaI/PMT链路','固定CZT为可核实例'],['尚未本轮覆盖SiPM耦合闪烁PET等全部现代结构'],'限定传统链路；现代实现另列具体结构，不将CZT与闪烁光读出混同。'),
'mp-13-point-2':(['SPECT-QA'],['能量选择与残余散射'],['核素/窗宽/算法对计数、分辨和绝对定量的量化收益未确认'],'写减少部分散射；不保证窗越窄所有指标越好。'),
'mp-13-point-4':(['ESTEVES09'],['固定探头多角投影的具体反例'],['不覆盖所有固定/旋转系统及采样充分性'],'共同原理写多角投影；机械绕行仅传统实现。'),
'mp-13-point-6':(['MOSES11','SPECT-QA'],['物理限制与重建/噪声/平滑概念须分开'],['未授权本轮公式；SPECT本征定义不可直接套PET指标'],'分开描述物理响应、系统及重建图像；统计不直接等同本征几何分辨率。'),
'mp-13-point-7':(['EANM15'],['PET定量校正清单及CT限制'],['未核每种散射算法；运动补偿方法及其他示踪剂仍待核'],'保留共同概念；按示踪剂、配准与重建说明边界，不承诺校正后绝对准确。'),
'mp-03-point-4':(['TRS483'],['小野电离室局限与结构相关条件'],['常规电子束/平行板表面测量仍沿用旧教材有限证据，非TRS483批准'],'分开常规束与小静态光子野；选型依协议和束质。'),
'mp-03-point-5':(['TRS483'],['硅二极管型号与响应限制'],['全类别空间分辨率、统一响应时间/温度系数未核'],'只描述具体探测器，不作所有半导体性能保证。'),
'mp-03-point-6':(['TRS483'],['标定、扫描响应及匹配照后间隔'],['批次特异性仍缺本轮直接证据；不批准统一24h等待'],'规定匹配标定条件，批次/型号需独立依据和验证。'),
'mp-03-point-9':(['TRS483'],['小静态光子野范围与探测器相关因素'],['未核全部机型/野尺寸校正因子；不外推动态/其他粒子束'],'不设通用小野尺寸，探测器经表征与适用校正后使用。')}
updates=[]
for id in ids:
 orig=next(r for r in old['rows'] if r['id']==id); src,direct,pending,revision=spec[id]
 updates.append(dict(id=id,originalText=orig['originalText'],originalSource=orig['originalSource'],originalVersion=orig['originalVersion'],scope='new-followup-from-v9-16',sourceIds=src,subclaimChecks=[dict(claim=x,status='direct-bounded-support',sourceIds=src) for x in direct]+[dict(claim=x,status='unresolved-or-conditional',sourceIds=src) for x in pending],remaining=pending,minimumRevision=revision,conclusion='条件性支持',appliedToOriginal=False,expertApproved=False,nextStep='独立学科审核及补足列明缺口；不自动发布'))
hdr=next(r for r in old['rows'] if r['id']=='mp-06-point-5')
supp=dict(id=hdr['id'],originalText=hdr['originalText'],originalSource=hdr['originalSource'],scope='supplement-not-in-v9-16',countedInQueue=False,sourceIds=['TG43U1','HEBD12'],conclusion='条件性支持',appliedToOriginal=False,formulaTextRead=True,formulaVisuallyVerified=False,teachingFormulaAuthorized=False,calculationModel='TG43二维单源水中剂量率核；非优化算法',optimization='驻留位置与时间优化须独立方法学依据，本轮未新增确认',qualityAssurance='源定位、时间、重建QA沿用v9已核资料，不由TG43公式替代',remaining=['原页公式图像及微单位视觉确认','TG43U1正式勘误正文及其影响','多驻留叠加的具体时间处理和优化算法','临床异质性/屏蔽与源型号数据的独立审核'],nextStep='保留原主张，补充参考核函数定义；不可作为临床或正式题库计算器')
protected=list(v9['protectedHashes'])+[v9path,'product-2028-draft/mp-evidence-2026-10-23/locator-correction-v9a.json','audit-2028/evidence/2026-10-23-v9/ci-final-v9.json','audit-2028/evidence/2026-10-23-v9/failure-and-boundaries.json','product-2028-draft/2026-10-23条件性证据接续-v9.md']
access=read('tmp/pdfs/v10-access.json')
failures=[dict(method='local-urllib',**r) for r in access if r['status']=='failed']+[
dict(method='web',url='https://pmc.ncbi.nlm.nih.gov/articles/PMC2776146/',error='reCAPTCHA only; publisher PDF used instead'),
dict(method='web',url='https://pmc.ncbi.nlm.nih.gov/articles/PMC4315529/',error='reCAPTCHA only; publisher PDF used instead'),
dict(method='web',url='https://pmc.ncbi.nlm.nih.gov/articles/PMC3144741/',error='reCAPTCHA only; university-hosted author manuscript used instead'),
dict(method='web',url='https://www.aapm.org/pubs/reports/RPT_84.pdf',error='redirect DOI retrieval failed500; AAPM archived original found later'),
dict(method='github',error='one branch GET transport send failure; later git/ref GET succeeded at bdf6c860'),
dict(method='PowerShell',error='ConvertFrom-Json case-insensitive T_min/t_min key collision; read with -AsHashtable/Python instead'),
dict(method='PowerShell',error='Win32_Process CIM access denied; downloader later completed normally'),
dict(method='web-screenshot',error='screenshot result did not expose image bytes to view; not counted as visual read')]
doc=dict(revision='conditional-followup-v10-2026-10-23',branch=v9['branch'],baseCommit='bdf6c860799f3da6aea7b53fd5b5246613ea19b7',previousTestedCommit='45ad7d23d00a52052202aa256b2b390bfd8f6815',previousCi=39890040652,inheritedUnfollowedIds=v9['remainingUnfollowedIds'],newlyFollowedUpIds=ids,remainingUnfollowedIds=[id for id in v9['remainingUnfollowedIds'] if id not in ids],queueMeaning='补读正文进度，不是科学确认率；旧证据缺字段不等于无证据',sources=sources,updates=updates,supplementary=[supp],protectedHashes={p:sha(p) for p in dict.fromkeys(protected)},retrievalFailures=failures,localCacheMetadata=[r for r in access if r['status']!='failed'],imageReadEvidence=[dict(sourceId='EANM15',pdfPage=14,printedPage=341,path='tmp/pdfs/v10-pet-eanm-p14.png',actuallyViewed=True)],independentExpertApproved=0,teacherQueue=6,expertQueue=61,externalContact=False,final2028RequirementsVerified=False,formalContentChanged=False,deployed=False,liveLearningDataTouched=False)
(out/'conditional-followup-v10.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
md=['# v10 PET/SPECT、小野探测器与HDR补充核查','', '日期：2026-10-23。显式执行内容审核与安全回归Skills。仅追加内部证据；独立专业审定0。', '', '## 队列与边界', '', 'v9唯一16条队列，本轮9条新增正文补读，剩余7条；9条仍为条件性支持，不能解释为整条科学确认。HDR mp-06-point-5不计队列。旧原文、哈希和人工意见不变。', '', '## 逐项结论','']
for r in updates:
 md+=['### '+r['id'],'','原文：'+r['originalText'],'','来源：'+', '.join(r['sourceIds'])+'（完整版本、定位、逐子主张见JSON）。','', '最小修订建议：'+r['minimumRevision'],'','仍待核：'+'；'.join(r['remaining'])+'。','']
md+=['## 来源与真实读取','']
for s in sources:md+=['- ['+s['id']+']('+s['url']+')：'+s['version']+'；'+s['publishedAt']+'；'+s['locator']+'。限制：'+s['limits']]
md+=['','## HDR补充','','已读取TG43U1 Eq1–3、6、8的正文文本和HEBD水中模型限制；公式图像与微单位未视觉确认，正式勘误未读，不授权教学计算。模型、驻留优化与临床QA分别记录；所有后装不等于HDR。','','## 失败与不可升级事项','','本地IAEA下载403、两次下载超时，web正文仍可读；PMC三页仅验证码。详细失败保留JSON。PET原PDF14页已实际看图，其他来源不冒称视觉核验。未重复下载核医学大教材。','','## 下一断点','','队列剩余：'+', '.join(doc['remainingUnfollowedIds'])+'。此外继续补胶片批次、现代探测结构、PET运动补偿、TG43图像与勘误；这些不能因完成补读自动消失。','','工程测试和CI另存证据回执；不将旧CI当本轮。正式V59不变，R5不部署，真实学习数据不读写。']
(out/'PET-SPECT小野与HDR接续-v10.md').write_text('\n'.join(md)+'\n',encoding='utf8')
print(json.dumps(dict(newReads=len(ids),remaining=len(doc['remainingUnfollowedIds']),expertApproved=0)))

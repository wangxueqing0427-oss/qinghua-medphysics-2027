// Versioned engineering overlay. Never rewrites legacy graph, courses or review decisions.
const fs=require('fs'),crypto=require('crypto');
const root='product-2028-draft/syllabus-353-v2',design=require('../'+root+'/source-and-design.json'),old=require('../product-2028-draft/课程知识点与大纲映射.json'),legacyTree=require('../product-2028-draft/353知识树-R4.json');
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const specialId=s=>'s27v2-mp-'+s,sections=new Map(design.sections.map(s=>[s[0],{number:s[0],part:s[1],title:s[2],officialText:s[3],textSha256:hash(s[3])}]));
const existing=old.syllabusNodes.filter(n=>n.id.startsWith('s27-')&&!n.id.startsWith('s27-22-'));
const rows=existing.map(n=>({id:n.id,name:n.name,subject:n.subject,legacyIds:[n.id],sectionNumber:Number(n.id.split('-')[1]),basisType:n.id==='s27-17-2'?'teaching-expansion-under-section':'official-section-decomposition',depth:'以本行原文动词为上限；逐个概念解释、条件与材料应用，不推断官方分值',priority:n.id.startsWith('s27-18-')||n.id==='s27-8-1'?'P0':'P1',prerequisites:[]}));
for(const [oldId,slug,name,anchor,depth,priority,pres]of design.specialtyRefinement)rows.push({id:specialId(slug),name,subject:'mp',legacyIds:[oldId],sectionNumber:22,officialAnchor:anchor,basisType:['core-quantity','core-energy','core-waves','protection-quantity','protection-principle','protection-scenario','ai-data','ai-validation','ai-governance'].includes(slug)?'teaching-decomposition-of-broad-official-requirement':'official-phrase-decomposition',depth,priority,prerequisites:pres.map(specialId)});
for(const [oldId,slug,name,anchor]of design.supplementalSplits)rows.push({id:'s27v2-detail-'+slug,name,subject:old.syllabusNodes.find(n=>n.id===oldId).subject,legacyIds:[oldId],sectionNumber:Number(oldId.split('-')[1]),officialAnchor:anchor,basisType:'explicit-phrase-separated-for-traceability',depth:'依原文动词教学，比较、解释并完成适用的材料题；不设官方题量权重',priority:'P1',prerequisites:[oldId]});
// Pedagogical dependencies, not official examination prerequisites. Medical physics branch is separate.
for(const r of rows.filter(r=>r.sectionNumber<21&&!r.id.startsWith('s27v2-detail'))){const s=r.sectionNumber;r.prerequisites=s===1||s===7||s===18?[]:s<=6?['s27-1-2']:s<=17?(s===8?['s27-7-1','s27-18-1']:['s27-7-1','s27-8-1']):s===19?['s27-18-1','s27-18-2']:['s27-19-3','s27-19-6'];}
const crosswalk=old.syllabusNodes.map(n=>({legacyId:n.id,name:n.name,subject:n.subject,newIds:rows.filter(r=>r.legacyIds.includes(n.id)).map(r=>r.id),disposition:['en','pol'].includes(n.subject)?'outside-353-scope-preserved':n.id.startsWith('s27-22-')?'split-no-runtime-migration':'retained-with-source-or-detail-split',expertApproved:false}));
const mpChapter={1:['core-waves','therapy-energy'],2:['protection-quantity','therapy-energy'],3:['measure-definition','measure-uncertainty'],4:['therapy-energy','measure-comparison'],5:['therapy-energy'],6:['therapy-energy','therapy-evaluation'],7:['therapy-evaluation'],8:['therapy-evaluation','measure-uncertainty'],9:['therapy-evaluation','integration-model'],10:['therapy-energy','therapy-evaluation'],11:['measure-comparison','therapy-evaluation'],12:['protection-principle','protection-scenario'],13:['nuclear-chain','nuclear-pet-spect','nuclear-evaluation'],14:['ai-data','ai-validation','ai-governance'],15:['environment-space','environment-air','environment-ventilation']};
const pointComparisons=old.existingKnowledgePoints.map(p=>{const inScope=!['en','pol'].includes(p.subject);let targets=inScope?[...new Set(p.syllabusNodeIds.flatMap(id=>crosswalk.find(c=>c.legacyId===id)?.newIds||[]))]:[];let reason='保留旧章节级关联；不是逐概念语义审核，不构成内容覆盖。';if(p.subject==='mp'){targets=(mpChapter[Number(p.chapterId.split('-')[1])]||[]).map(specialId);reason='已读取此章实际要点，按章主题缩窄到专项分支；本条仍须专家核对概念、公式、条件和深度。';}return {id:p.id,chapterId:p.chapterId,subject:p.subject,text:p.text,legacyNodeIds:p.syllabusNodeIds,candidateNodeIds:targets,comparisonStatus:inScope?'candidate-not-coverage':'outside-353-scope',reason,semanticApproval:false,expertApproved:false};});
// Four legacy answer-framework bullets had no original mappings. Explicitly add narrow candidates, preserving empty old arrays.
for(const [id,targets]of Object.entries({'ph-08-point-1':['s27-2-2','s27-16-2'],'ph-08-point-2':['s27-3-7','s27-5-4'],'ph-08-point-3':['s27-4-2','s27-15-4'],'ph-08-point-4':['s27-6-3','s27-6-4']})){const p=pointComparisons.find(p=>p.id===id);p.candidateNodeIds=targets;p.reason='逐条读取旧综合答题框架后补充的教学关联候选；框架不是知识讲解或官方评分标准，仍需语义复核。';}
// Explicit per-bullet editorial candidates after reading actual text; never accepted coverage.
// Each inner string lists section-subnode suffixes. No keyword matching or automatic semantic approval.
const narrow={
 'epi-01':['7-1','7-1','7-2','7-2','7-3'],
 'epi-02':['8-1','8-2','8-2','8-3','8-4 8-5'],
 'epi-03':['9-2','9-2 10-3','9-2','9-3 10-3'],
 'epi-04':['10-1','10-1 10-5','10-1','10-2','10-2','10-4'],
 'epi-05':['11-1','11-3','11-3','11-3','11-5'],
 'epi-06':['12-1','12-1','12-4','12-4','12-4','12-4','12-3'],
 'epi-07':['13-1','13-1','13-1 13-4','13-2 13-3','13-1'],
 'epi-08':['14-2','14-2','14-4','14-2 14-4','14-5','14-2'],
 'epi-09':['15-1 15-2','15-2','15-4','15-4'],
 'epi-10':['16-1','16-1','16-3 16-4','16-2'],
 'epi-11':['17-1','17-2','17-3','17-3','17-2 17-3'],
 'st-01':['18-4','19-4','18-1','18-1','20-1'],
 'st-02':['18-2','18-2','18-2','18-2','18-2'],
 'st-03':['19-1','19-2','19-2','19-2','19-2'],
 'st-04':['18-5','18-5','18-5 18-6','19-3','19-3'],
 'st-05':['19-4 19-5','19-5','19-5','19-5 19-6','19-5'],
 'st-06':['19-6','19-6','19-6','19-6 18-6','19-6'],
 'st-07':['20-1','20-1','20-1','20-1','20-1'],
 'st-08':['20-4','20-4','20-4','20-4','20-4'],
 'st-09':['20-2','20-2','20-2','20-2','20-2 20-3'],
 'st-10':['18-3','18-3','18-3','18-3','18-3'],
 'st-11':['20-5','20-7','20-6','20-5 20-6 20-7','20-7 9-2'],
 'st-12':['20-1 20-2','20-4','18-3','20-5 20-6','20-1','19-5 19-6'],
 'ph-01':['1-2','1-2','1-2','1-2'],
 'ph-02':['1-3 8-3','1-3 8-2','1-3','5-2'],
 'ph-03':['2-2','2-2','2-2','2-2 14-1'],
 'ph-04':['3-1','3-1','3-7','3-2','3-2 5-4'],
 'ph-05':['3-6','3-7','3-7','3-7 5-4'],
 'ph-06':['4-2','4-2 4-4','4-2','4-3 4-4','4-2'],
 'ph-07':['5-1','4-4','6-3'],
 'ph-09':['21-1','21-2','21-6','21-1 21-5'],
 'ph-10':['5-2','5-2','5-3','5-4']
};
for(const [chapter,links]of Object.entries(narrow)){const points=pointComparisons.filter(p=>p.chapterId===chapter);if(points.length!==links.length)throw Error('Editorial mapping length mismatch '+chapter);for(let i=0;i<links.length;i++){const p=points.find(p=>p.id===chapter+'-point-'+(i+1));if(!p)throw Error('Missing point');p.candidateNodeIds=links[i].split(' ').map(s=>'s27-'+s);p.reason='逐条读取文本后的内部概念对应候选；旧宽泛关联保留。正确性、遗漏、深度及来源仍待独立复核，不构成覆盖或专业批准。';}}
const units=require('../product-2028-draft/course-drafts/load-drafts.cjs').withExisting().units,oldRoots={'353-incidence-risk':['s27-8-2']},newRoots={'353-quantity-measurement':[specialId('core-quantity'),specialId('measure-definition'),specialId('measure-uncertainty')]};
for(const r of rows){const s=sections.get(r.sectionNumber);Object.assign(r,{part:s.part,sectionTitle:s.title,officialText:s.officialText,sourceTextHash:s.textSha256,sourceUrl:design.url,sourceYear:2027,targetYear:2028,status:'provisional_previous_year',mappingReview:'internal-source-comparison-pending-independent-review',prerequisiteBasis:'internal-pedagogical-order-not-official-weight',verifiedCoverage:false,expertApproved:false});r.legacyTeachingPointIds=pointComparisons.filter(p=>p.candidateNodeIds.includes(r.id)).map(p=>p.id);r.courseSupport=units.filter(u=>(newRoots[u.id]||u.mapping||oldRoots[u.id]||[]).includes(r.id)).map(u=>({id:u.id,version:u.version,title:u.title,status:u.reviewStatus,contentHash:require('../product-2028-draft/content/review-ledger.cjs').contentHash(u),questionIds:[...u.basicQuestions,...u.applicationQuestions,...u.delayedQuestions||[]].map(q=>q.id),support:'partial-internal-teaching-only',expertApproved:false}));r.legacyQuestionCandidates=[...new Set(r.legacyIds.flatMap(id=>legacyTree.nodes.find(n=>n.id===id)?.questionIds||[]))];r.gap=r.courseSupport.length?'有部分可运行教学与练习；目标深度、完整性及专业准确性未审定':'尚无完整引擎课程；旧要点/候选题不能代替完整教学、闭卷、分层题及延迟测试';}
const summary={legacyPlanningNodes:old.syllabusNodes.length,legacy353Nodes:old.syllabusNodes.filter(n=>n.id.startsWith('s27-')).length,allLegacyPoints:old.existingKnowledgePoints.length,points353:pointComparisons.filter(p=>p.comparisonStatus!=='outside-353-scope').length,revised353Nodes:rows.length,specialtyNodes:rows.filter(r=>r.sectionNumber===22).length,parts:Object.fromEntries([...new Set(rows.map(r=>r.part))].map(p=>[p,rows.filter(r=>r.part===p).length])),nodesWithPartialCourse:rows.filter(r=>r.courseSupport.length).length,verifiedCoveredNodes:0,verifiedCoverageRatio:0,expertApprovedCourses:0,semanticallyApprovedLegacyPoints:0};
const matrix={schemaVersion:2,revision:design.revision,source:{...design,sections:undefined,specialtyRefinement:undefined,supplementalSplits:undefined},oldInputSha256:hash(old),sections:[...sections.values()],summary,rows,crosswalk,pointComparisons};
fs.writeFileSync(root+'/matrix.json',JSON.stringify(matrix,null,2)+'\n');
const safe=s=>String(s).replace(/\|/g,'／').replace(/\n/g,'<br>');
fs.writeFileSync(root+'/353全范围映射矩阵.md','# 353全范围考纲矩阵 V2（工程待审）\n\n2027原文用于2028暂定参考；节点分解、先修与P0/P1/P2均为教学安排，不是官方权重。原130节点和476要点未改写。机器可读matrix.json包含逐节点完整原文及全部476条对照。\n\n'+JSON.stringify(summary,null,2)+'\n\n|节点|部分／知识点|深度／先修|课程与题目|缺口|\n|---|---|---|---|---|\n'+rows.map(r=>`|${r.id}|${r.part}／${r.name}|${safe(r.depth)}；${r.prerequisites.join(',')||'无硬性节点先修'}|${r.courseSupport.map(c=>c.id+'（'+c.questionIds.length+'题，部分待审）').join('；')||'无完整课'}|${r.gap}|`).join('\n')+'\n\n## 官方原文分段\n\n'+[...sections.values()].map(s=>'### '+s.number+' '+s.part+'／'+s.title+'\n\n'+s.officialText).join('\n\n')+'\n');
fs.writeFileSync(root+'/476要点逐条对照.tsv','要点ID\t科目\t原文\t旧节点\tV2候选节点\t状态\t判定边界\n'+pointComparisons.map(p=>[p.id,p.subject,p.text,p.legacyNodeIds.join(','),p.candidateNodeIds.join(','),p.comparisonStatus,p.reason].join('\t')).join('\n')+'\n');
console.log(JSON.stringify(summary));
module.exports=matrix;

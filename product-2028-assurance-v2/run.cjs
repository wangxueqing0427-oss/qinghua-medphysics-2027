'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const pack=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const {audit}=require('./recompute.cjs');
const sourceRegister=require('./numeric-cases.json');
const prior=require('../product-2028-assurance-v1/evidence-register.json');
const report=audit(pack);
const subjectUnits=pack.units.filter(u=>u.subject==='353');
const numerics=new Set(report.rows.map(x=>x.id));
const other=subjectUnits.flatMap(u=>
 ['basicQuestions','applicationQuestions','delayedQuestions'].flatMap(group=>
  (u[group]||[]).filter(q=>q.type!=='number').map(q=>({
   id:q.id,unitId:u.id,title:u.title,type:q.type,group,
   status:'awaiting-independent-fact-and-source-audit',
   expertApproved:false,automaticScoreAllowed:q.type!=='subjective',
   contentAccuracyVerified:false
  }))));
assert.equal(subjectUnits.length,18);
assert.equal(other.length,165);
assert.equal(report.rows.length,39);
assert.equal(numerics.size,39);
assert.equal(other.filter(x=>x.type==='subjective').length+report.rows.filter(x=>x.type==='subjective').length,
 other.filter(x=>x.type==='subjective').length);
assert(prior.references.some(x=>x.id==='tsinghua-2027-353-syllabus'&&x.year===2027));
const unitBreakdown=subjectUnits.map(u=>({
 id:u.id,title:u.title,questionCount:[...u.basicQuestions,...u.applicationQuestions,...u.delayedQuestions].length,
 numericVerified:report.rows.filter(x=>x.unitId===u.id&&x.independentlyRecomputed).length,
 qualitativePending:other.filter(x=>x.unitId===u.id).length,
 prioritizedRisk:/(波|能量|不确定度|测量|核|放疗|剂量|辐射|医学物理)/.test(u.title)?'physics-cross-disciplinary':'epidemiology-and-statistics',
 declaredReferences:u.sources||[],
 sourceExcerptsManuallyCompared:false,subjectSpecialistApproved:false
}));
const summary={
 schemaVersion:1,kind:'2028-personal-study-independent-arithmetic-recheck',
 scope:'18 provisional 353 units, 204 existing questions',
 courseCount:subjectUnits.length,totalQuestions:204,numericRecomputed:report.verified,
 numericFailed:report.numericTotal-report.verified,nonnumericQuestionsPending:other.length,
 official2027Syllabus:'https://vsph.tsinghua.edu.cn/info/1025/2775.htm',
 official2028SyllabusVerified:false,knowledgeAccuracyFullyApproved:false,expertApproved:0,
 priorStructuralGateMustRemainEnabled:true,recomputationPassed:report.passed,
 sourceRefs:sourceRegister.sourceDefinitions,numericResults:report,
 unitBreakdown,qualitativeReviewQueue:other
};
const out=path.join(__dirname,'results');fs.mkdirSync(out,{recursive:true});
const json=path.join(out,'353-numeric-recheck.json'),
 md=path.join(out,'353-quality-next-queue.md');
fs.writeFileSync(json,JSON.stringify(summary,null,2));
const lines=[
'# 353卫生综合：数值题独立复算与余下内容待查（个人备考内部稿）',
'',
'> 这不是独立专业教师签字、完整考试范围认证或对外正式课程审定。',
'',
'- 清华2027年353依据：https://vsph.tsinghua.edu.cn/info/1025/2775.htm （2028年待确认）',
'- 当前353：18课、204题',
'- 本轮逐题独立复算的数值题：'+report.verified+'/39',
'- 尚需知识事实与来源逐条审查的非数值题：'+other.length,
'- 公式题审计异常：'+report.errors.length,
'- 独立专业审核人数：0；2028年度大纲已核准：否',
'',
'## 计算依据（支持公式类型，不等于核对了题目每句教材表述）',
...Object.entries(sourceRegister.sourceDefinitions).map(([id,s])=>'- '+id+'：'+s.name+'；'+s.url+'；限制：'+s.boundary),
'',
'## 数值题逐项复算',
'',
'| 题号 | 复算类型 | 独立计算 | 草稿答案 | 单位 | 结果 |',
'|---|---|---:|---:|---|---|',
...report.rows.map(r=>'| '+r.id+' | '+r.kind+' | '+r.independentCalculatedValue+' | '+r.authorAnswer+' | '+r.unit+' | '+(r.independentlyRecomputed?'一致':'不一致')+' |'),
'',
'## 18门课程后续逐项核查',
'',
'| 课程ID | 本轮复算数值题 | 非数值题待核 | 风险优先级 |',
'|---|---:|---:|---|',
...unitBreakdown.map(u=>'| '+u.id+' | '+u.numericVerified+' | '+u.qualitativePending+' | '+u.prioritizedRisk+' |'),
'',
'## 下一轮执行规范',
'',
'1. 先复查医学物理物理量测量、辐射防护与核医学影像/放疗物理相关术语、适用边界；本次复算不证明这些知识正确。',
'2. 对165道非数值题，按每个问题的教材原始段落、定义、干扰项和解析逐项核对，发现不一致先标记为待修订，不直接改旧教材和进度。',
'3. 主观题保持参考评分点和待核对状态；不自动计算正式得分。',
'4. 2028年大纲发布后重新对照范围，不从内部规划节点换算覆盖率。',
'5. 对外推广或正式发行前，另行处理版权、内容来源完整性与可信专业判断；任何自动化通过均不冒充真实专家批准。'
];
fs.writeFileSync(md,lines.join('\n')+'\n');
if(!report.passed||report.verified!==39)throw Error('Independent arithmetic audit failed: '+report.errors.join('; '));
console.log(JSON.stringify({
 passed:true,courses:18,questions:204,recomputed:39,
 pendingNonNumeric:165,errors:report.errors.length,independentExpertApprovals:0,
 full2028Syllabus:false,outputs:[json,md]
}));

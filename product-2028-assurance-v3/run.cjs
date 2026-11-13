'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const pack=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const {audit}=require('./qualitative.cjs');
const spots=require('./source-spotchecks.json');
const numbers=require('../product-2028-assurance-v2/numeric-cases.json');
const report=audit(pack,spots);
assert.equal(report.coveredNonnumericQuestionCount,165);
assert.equal(report.pinnedNumericQuestionsManagedSeparately,numbers.numericQuestions.length);
assert.equal(report.blockers.length,0,JSON.stringify(report.blockers));
assert.equal(report.independentExpertApprovals,0);
assert.equal(report.fullQuestionContentApproved,false);
const dir=path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});
const output={schemaVersion:1,generatedFrom:'Frozen candidate 47 courses/524 questions',qualityStatus:'personal-study-unapproved-draft',
 current353:{courses:18,questions:204,numericRecomputed:39,nonnumericTriaged:165},
 noProfessionalApproval:true,official2028OutlineVerified:false,fullFactCheckingFinished:false,
 sourceChecks:spots,qualitative:report};
fs.writeFileSync(path.join(dir,'353-qualitative-triage.json'),JSON.stringify(output,null,2));
const order={'P0-physics':0,'P1-written-answer':1,'P2-epidemiology-or-public-health':2};
const rows=[...report.rows].sort((a,b)=>order[a.priority]-order[b.priority]||a.unitId.localeCompare(b.unitId)||a.id.localeCompare(b.id));
const counts=Object.fromEntries(Object.keys(order).map(k=>[k,rows.filter(x=>x.priority===k).length]));
const sourceLines=spots.checks.map(x=>'- '+x.id+'：'+x.questionIds.join('、')+'；'+x.source+'。仅核对特定主张，**不表示整题正确**。');
const lines=[
 '# 353非数值题逐题质量审查队列（165题）','',
 '> 仅供2028个人备考APP内部内容修订。不能作为专业老师签字、对外正式审核、考试覆盖率和备考得分证明。',
 '',
 '- 353当前18课204题：39道数值题已单独复算；本报告涉及其余165道非数值题。',
 '- 非数值题结构性阻塞：'+report.blockers.length,
 '- 主观题：'+report.subjectiveQuestionCount+'；不自动给分',
 '- 具体知识点经NIST交叉比对所关联题目：'+report.specificConceptSpotcheckQuestionCount+'（并非整题审核）',
 '- 医学物理及测量物理优先核对：'+counts['P0-physics']+'题',
 '- 主观参考评分待核：'+counts['P1-written-answer']+'题',
 '- 其余流行病学、统计、公卫等候核：'+counts['P2-epidemiology-or-public-health']+'题',
 '- 2028正式考纲逐条覆盖：未核实；独立专业审核：0；对外正式发布：不通过',
 '',
 '## 第一轮有限权威来源交叉比对','',...sourceLines,'',
 '## 全部165道待审题目（按优先级排序）','',
 '| 类别 | 课程 | 题号 | 类型 | 状态 |',
 '|---|---|---|---|---|',
 ...rows.map(x=>'| '+x.priority+' | '+x.unitId+' | '+x.id+' | '+x.kind+' | '+x.status+' |'),
 '',
 '## 必须执行的第二轮真实内容核验','',
 '1. 为每个高风险题目建立：原始题干、所有选项、原参考答案、解析、权威来源原文定位与适用边界，再判断哪项正确。',
 '2. 特别区分：计算得到结果正确、公式适用条件正确、医学专业含义正确，这三个层次不可互相替代。',
 '3. 主观题逐项比较评分要点与课程原文，单独处理有歧义的合理答案；不生成机器主观评分。',
 '4. 对官方353大纲未覆盖的领域不编造题量比例，2028年度考纲发布后重新检查。',
 '5. 错误及存疑题先进入待修订清单，版本隔离修订后全量回归；旧课程和学员数据不作覆盖。',
 ''
];
fs.writeFileSync(path.join(dir,'353-qualitative-165-review.md'),lines.join('\n'));
console.log(JSON.stringify({passed:true,courses:18,questions:204,numericPreviouslyRecomputed:39,qualitativeTriaged:165,
 subjective:report.subjectiveQuestionCount,objective:report.objectiveQuestionCount,spotcheckedSpecificClaimQuestionCount:report.specificConceptSpotcheckQuestionCount,
 p0Physics:counts['P0-physics'],issues:report.blockers.length,fullFactChecked:false,expertApproved:0,formalRelease:false}));

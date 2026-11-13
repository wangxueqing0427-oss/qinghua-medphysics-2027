'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {audit}=require('./assurance.cjs');
const dir=__dirname;
const pack=JSON.parse(fs.readFileSync(path.join(dir,'../product-2028-diagnostic-v5/.build/representative-courses.json'),'utf8'));
const evidence=require('./evidence-register.json');
const report=audit(pack,evidence);
assert.equal(report.totals.courses,47,'Must dynamically inspect current 47-course pack');
assert.equal(report.totals.all,524,'Must include every current question including the new SVO subjective');
assert.equal(report.subjects.en.units,15);
assert.equal(report.subjects.pol.units,14);
assert.equal(report.subjects['353'].units,18);
assert.equal(report.subjects.en.questions,164);
assert.equal(report.subjects.pol.questions,156);
assert.equal(report.subjects['353'].questions,204);
assert.equal(report.totals.objective+report.totals.subjective,524);
assert.equal(report.fatal.length,0,'Structural/scope contract failed: '+report.fatal.join(', '));
assert.equal(report.safePersonalStudyPilot,true);
assert.equal(report.formalReleaseApproved,false);
assert.equal(report.expertApprovals,0);
const out=path.join(dir,'results');
fs.mkdirSync(out,{recursive:true});
const json=path.join(out,'machine-audit.json'),md=path.join(out,'review-queue.md');
const lines=[
'# 清华2028个人备考版：机器检查与资料核验队列',
'',
'> 这份文件是自动生成的审计记录，不是独立学科专家签字、2028正式考纲覆盖证明或正式考试模拟成绩。',
'',
'- 对象：'+report.totals.courses+'课／'+report.totals.all+'题',
'- 英语：'+report.subjects.en.units+'课／'+report.subjects.en.questions+'题',
'- 政治：'+report.subjects.pol.units+'课／'+report.subjects.pol.questions+'题',
'- 353：'+report.subjects['353'].units+'课／'+report.subjects['353'].questions+'题',
'- 主观参考评分题：'+report.totals.subjective+'题；没有自动给分',
'- 数值题：'+report.totals.numeric+'题；这里只核查答案类型与评分调用，**不称为独立公式重算**',
'- 结构检查错误：'+report.fatal.length+'；完全重复题干：'+report.exactDuplicateStems.length,
'- 2028官方完整考纲核验：未完成；专家签字：0；正式发布审核：未通过',
'- 个人草稿学习可运行：'+(report.safePersonalStudyPilot?'是（须清晰标注未经审核）':'否'),
'',
'## 官方依据登记（不能把2027当成2028）',
...evidence.references.map(r=>'- '+r.id+'：'+r.evidenceLevel+(r.url?'；'+r.url:'')+(r.isbn?'；ISBN '+r.isbn:'')),
'',
'## 无需找老师时的替代质量路线',
'',
'1. 官方考纲先限定范围；不把内部规划节点当真实考试覆盖率。',
'2. 客观题做数据结构、答案索引、评分边界与重复题检查；数值题需单独建立可复算公式与参数来源。',
'3. 解释、教材来源、公式常数、适用条件逐项对照原始权威材料，截图或页码存证；AI交叉复核仅标记风险。',
'4. 353高风险专业知识优先双来源比对；未经核实的陈述标记待核，不向用户暗示已专家审核。',
'5. 每次改题触发全量524题测试和版本哈希检查，保留历史回执。',
'',
'## 优先核对的课程（按当前内部草稿分科排序，不是命题概率排名）',
''
];
const ordered=[...report.units].sort((a,b)=>{
 const risk={high:0,medium:1,'source-check-needed':2};
 return risk[a.riskLevel]-risk[b.riskLevel]||a.id.localeCompare(b.id);
});
for(const u of ordered){
 lines.push('- **'+u.id+'**（'+u.subject+'，'+u.questionCount+'题）：'+u.reviewFocus.join(' / ')+(u.reviewFocus.length?'；':'')+u.nextAction+'；待人工或可信资料逐条核对');
}
lines.push('','## 不可替代的判断','',
 '此审计没有检验每个知识结论与来源是否一致，不能声明内容全部正确。发布任何对外推广的课程时，须另做版权、事实及当年度范围的正式核验。');
fs.writeFileSync(json,JSON.stringify(report,null,2));
fs.writeFileSync(md,lines.join('\n')+'\n');
console.log(JSON.stringify({
  passed:report.passedAutomaticContracts,courses:report.totals.courses,questions:report.totals.all,
  subjects:report.subjects,questionTypes:{objective:report.totals.objective,subjective:report.totals.subjective,numeric:report.totals.numeric},
  duplicateStems:report.exactDuplicateStems.length,expertApprovals:0,full2028SyllabusVerified:false,
  machineCorrectnessCertified:false,releaseApproved:false,files:[json,md]
}));

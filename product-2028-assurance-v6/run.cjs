'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-v13-additive/.build/representative-courses.json');
const report=audit(pack);
assert(report.passed,report.errors.join(','));
assert.equal(report.currentCourseCount,54);
assert.equal(report.currentQuestionCount,608);
assert.equal(report.coarse2027InternalTeachingThemes,27);
assert.equal(report.themesWithSomeDraftAssociation,16);
assert.equal(report.themesWithoutDirectDraftAssociation,11);
assert.equal(report.verifiedOfficial2028Percent,null);
assert.equal(report.independentExpertApprovals,0);
const dir=path.join(__dirname,'results');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'v13-current-353-gap.json'),JSON.stringify(report,null,2));
const rows=[
'# 清华353备考 V13：2027官方大纲方向关联与尚缺教学主题',
'',
'> 仅作为2028备考的内部暂定教学规划，**不是2028官方完整大纲、覆盖率、题目权重或专家审定证明**。',
'',
'2027官方大纲：'+report.sourceUrl,
'',
'## 系统现状',
'',
'- 54门候选课、608道练习；英语15课、政治14课、353有25课及288题。',
'- 353中67道数字题曾有逐题公式复算或内部质量测试；不代表专业专家独立评审。',
'- 27个内部粗分教学主题：16个具有**至少一门相关草稿课的部分关联**，11个没有直接草稿课。',
'- 确认完整2028官方考纲覆盖的主题：0；独立专家签字：0；真实iPhone验收：未完成。',
'- 旧53门课程保持不变，新增加 EPI09 暴发调查与短期罹患比例的基础草稿。',
'',
'## 优先需要补充的主题（P0表示开发优先，不是考试分数权重）',
'',
'| 编号 | 2027官方大纲归纳的内部规划主题 | 当前课程关联 | 状态 |',
'| --- | --- | --- | --- |',
 ...report.topics.filter(t=>t.internalPriority==='P0').sort((a,b)=>
  (a.draftAssociatedCourseIds.length?1:0)-(b.draftAssociatedCourseIds.length?1:0)||a.id.localeCompare(b.id))
  .map(t=>'| '+t.id+' | '+t.title+' | '+(t.draftAssociatedCourseIds.length?t.draftAssociatedCourseIds.length+'门关联草稿课':'暂无直接课程')+' | '+t.associationStatus+' |'),
'',
'## 接下来真正需要完成的工作',
'',
'1. 先补 STAT03：方差分析、分类变量检验、线性/逻辑回归的原理与适用条件。',
'2. 补 EPI11：循证医学、系统评价和Meta分析的基本理念。',
'3. 补 PH03/PH04：卫生体系、医保筹资支付、应急和法律治理。',
'4. 增强跨学科情境：数据解释、AI与工程测量应用；不能只靠选择题。',
'5. 继续真实来源逐知识点核对、案例推理和闭卷主观题评分策略；禁止假装“专家已通过”。',
'6. 2028正式大纲公布后，按官方全文重新核验，不能用关联数量直接推断得分率。',
'',
'## 最新增量课提示',
'',
'- EPI09目前只是暴发调查入门课；传染源、传播途径、易感人群、传播过程与监测预警仍不完整。',
'- 新课中的全部病例数字均为虚构，只供研究方法学习，不指导真实疫情响应。',
''
];
fs.writeFileSync(path.join(dir,'v13-next-learning-priorities.md'),rows.join('\n'));
console.log(JSON.stringify({passed:report.passed,courses:54,questions:608,healthLessons:25,
 healthQuestions:288,numericModels:67,internalTopics:27,partialAssociations:16,
 noDirectCourse:11,complete2028Coverage:0,expertApproved:0,formalRelease:false}));

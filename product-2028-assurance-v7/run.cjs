'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-v14-additive/.build/representative-courses.json');
const r=audit(pack);
assert(r.passed,r.errors.join(','));
assert.equal(r.currentCourseCount,55);assert.equal(r.currentQuestionCount,620);
assert.equal(r.themesWithSomeDraftAssociation,17);
assert.equal(r.themesWithoutDirectDraftAssociation,10);
assert.equal(r.verifiedOfficial2028Percent,null);
const dir=path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'v14-current-353-gap.json'),JSON.stringify(r,null,2));
const lines=[
'# 清华2028备考 V14：353教学主题缺口和下轮内容优先级',
'',
'> 下文用2027年清华353官方大纲归纳的27个**内部**教学主题进行规划，绝非2028考试真实覆盖百分比。',
'',
'2027年官方大纲：'+r.sourceUrl,
'',
'- 当前55门内部候选课、620道题；英语15课、政治14课、353为26课300题。',
'- 353当前数值题71道；已纳入独立模型算术和规则测试，未经过独立专业教师逐题审定。',
'- 27组内部规划主题中17组与部分草稿课程有关联，10组尚无直接关联；关联不意味着教全或会考。',
'- 2028完整正式考纲逐条核验：未完成。完整专家审定：0。真实iPhone验收：未完成。',
'- 新增 STAT03《方差分析、列联表与线性/Logistic回归》为基础课，不代表该主题已经完整覆盖。',
'',
'## 优先补齐的主题（P0为内部开发优先，不是考试权重）',
'',
'| 编号 | 2027考纲对应的内部主题 | 关联候选课程 | 核查结论 |',
'|---|---|---|---|',
...r.topics.filter(x=>x.internalPriority==='P0')
 .sort((a,b)=>(a.draftAssociatedCourseIds.length?1:0)-(b.draftAssociatedCourseIds.length?1:0)||a.id.localeCompare(b.id))
 .map(x=>'| '+x.id+' | '+x.title+' | '+(x.draftAssociatedCourseIds.length?x.draftAssociatedCourseIds.length+'门草稿':'暂无')+' | '+x.associationStatus+' |'),
'',
'## 内容方向',
'',
'1. 优先新增EPI11循证医学、系统评价和Meta分析基础课。',
'2. 补PH03医疗卫生体系和筹资支付、PH04公共卫生应急法律框架。',
'3. 深化STAT03：方差分析设计差异、回归诊断、模型报告、选择偏倚及多重检验。',
'4. 增加不依赖选择题的综合病例/公卫情境推理、书面回答与证据检验。',
'5. 继续建立课本/官方来源逐知识点对照、错题原因标注与不确定项公开说明。',
'6. 2028正式大纲发布后必须重新核实课程范围及权重，绝不按17/27计算考纲覆盖率。',
'',
'所有医学示例均应视为虚构教学，不直接用于临床决策。',
''
];
fs.writeFileSync(path.join(dir,'v14-next-course-priorities.md'),lines.join('\n'));
console.log(JSON.stringify({passed:r.passed,courses:55,questions:620,subject353Courses:26,
 subject353Questions:300,subject353Numerical:71,internalTopics:27,partialTopics:17,
 noDirectCandidate:10,official2028CoverageVerified:false,expertApproved:0,releaseApproved:false}));

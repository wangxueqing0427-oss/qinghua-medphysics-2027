'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-v15-additive/.build/representative-courses.json');
const r=audit(pack);
assert(r.passed,r.errors.join(','));
assert.equal(r.currentCourseCount,56);assert.equal(r.currentQuestionCount,632);
assert.equal(r.themesWithSomeDraftAssociation,18);
assert.equal(r.themesWithoutDirectDraftAssociation,9);
assert.equal(r.verifiedOfficial2028Percent,null);
const dir=path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'v15-current-353-gap.json'),JSON.stringify(r,null,2));
const lines=[
'# 清华2028备考 V15：353教学主题缺口、证据核查和下一批开发方向',
'',
'> 以下27个主题只是根据2027年353正式大纲归纳的内部课程规划分组，不能计算正式考纲覆盖率、真实提分率或专业审批通过率。',
'',
'来源：'+r.sourceUrl,
'',
'- 当前56门内部课程候选、632道原创练习；英语15课、政治14课、353有27课312题。',
'- 353数值题75道，经模型算术测试；未被独立专业老师逐题审核。',
'- 27组内部教学主题：18组存在某些草稿课关联，9组没有直接关联；所有关联均为部分，不能称全面覆盖。',
'- 2028正式大纲完整性核查：未完成。独立专业审核：0。真实iPhone验收：未进行。',
'- EPI11补充《循证医学、系统评价、Meta分析》入门，固定效应逆方差与I²纯虚构模型，不等于专业系统评价训练已完成。',
'',
'## 仍需补充的高优先级内部主题',
'',
'| 主题 | 2027考纲内部规划项 | 关联草稿课数 | 当前状态 |',
'|---|---|---:|---|',
...r.topics.filter(x=>x.internalPriority==='P0')
 .sort((a,b)=>(a.draftAssociatedCourseIds.length?1:0)-(b.draftAssociatedCourseIds.length?1:0)||a.id.localeCompare(b.id))
 .map(x=>'| '+x.id+' | '+x.title+' | '+x.draftAssociatedCourseIds.length+' | '+x.associationStatus+' |'),
'',
'## 下一阶段具体任务',
'',
'1. PH03医疗卫生体系、医保筹资与支付、成本效益政策基础课；严守中国现行政策核实要求。',
'2. PH04公共卫生应急治理、法制与国际卫生条例基础课；法律引用必须注明日期和适用边界。',
'3. 深化EPI11原始研究偏倚、临床异质性、森林图与证据确定性，但避免伪造专家审核。',
'4. 强化跨学科综合推理、从材料写出答案、真实有条件评分的模拟考，而不是只增加选择题。',
'5. 继续保障旧课程逐字节不变、错题与闭卷记录在用户确认的跨版本迁移中受到保护。',
'6. 等2028正式考纲公布后重新核验，不把18/27当作考试覆盖率。',
'',
'所有医学数据均为虚构，仅供方法学习，不能直接指导临床或公共卫生行动。',
''
];
fs.writeFileSync(path.join(dir,'v15-next-course-priorities.md'),lines.join('\n'));
console.log(JSON.stringify({passed:true,courses:56,questions:632,medical353Lessons:27,
 medical353Questions:312,numericProblems:75,internalTopicGroups:27,partialRelated:18,
 noDirectCandidate:9,verified2028Coverage:null,expertApprovals:0,formalRelease:false}));

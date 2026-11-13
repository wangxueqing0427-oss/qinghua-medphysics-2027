'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const pack=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const outline=require('./2027-353-topic-map.json');
const {map}=require('./map.cjs');
const report=map(pack,outline);
assert(report.passed,JSON.stringify(report.problems));
assert.equal(report.finalVerifiedTopicGroups,0);
assert.equal(report.actual2028SyllabusCoveragePercent,null);
const dir=path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'2027-outline-map.json'),JSON.stringify(report,null,2));
const rows=report.suggestedPriority;
const lines=[
 '# 清华2028备考：依据2027年353大纲的教学内容补齐优先级',
 '',
 '> 2027年官方考试大纲是暂行依据；分组为内部课程规划，不是2028年考试占比，也不是课程覆盖率。',
 '',
 '- 官方来源：https://vsph.tsinghua.edu.cn/info/1025/2775.htm（2026-09-30发布）',
 '- 人工规划主题组：'+report.teachingTopicGroups+'（粗粒度，第三部分按能力领域拆分）',
 '- 有现有草稿课候选关联的组：'+report.groupsWithOnlyUnverifiedCandidateCourseLinks+'；不等于已经完整教会',
 '- 当前未关联直接草稿课的组：'+report.groupsWithoutDirectCandidateCourseLinks+'；仍需核查是否可复用旧内容',
 '- 2028官方完整范围核实：未完成；独立专业审核：0；正式上架：不通过',
 '',
 '## 待开发与复核顺序',
 '',
 '| 优先 | 内容组 | 主题 | 现有相关基础草稿 | 当前关联状态 |',
 '|---|---|---|---|---|',
 ...rows.map(x=>'| '+x.priority+' | '+x.id+' | '+x.title+' | '+(x.courseIds.join('、')||'无')+' | '+x.mappingStatus+' |'),
 '',
 '## 制作规则',
 '1. 优先补P0明确缺口：筛检诊断、统计推断、卫生体系与应急、辐射防护、核医学影像、放疗物理等；P0为内部开发优先级，不是试卷预测权重。',
 '2. 新课必须按“概念与边界→具体案例→闭卷检索→客观题→迁移练习→延迟复习→来源与反例”闭环制作，不直接铺一整套未经核实的大纲教材。',
 '3. 每个具体的物理/统计计算单独复核题设、公式、量纲、答案及精度。',
 '4. 主观题提供可核对参考点和反例，未核实前不得机器打分，也不能声称完全权威。',
 '5. 全过程维持独立版本隔离；先通过结构、浏览器、学习进度与数据回归测试，再给手机集中验收。',
 ''
];
fs.writeFileSync(path.join(dir,'2027-outline-development-plan.md'),lines.join('\n'));
console.log(JSON.stringify({pass:true,courseGroups:report.teachingTopicGroups,
 candidateLinkedGroups:report.groupsWithOnlyUnverifiedCandidateCourseLinks,noDirectCourseGroups:report.groupsWithoutDirectCandidateCourseLinks,
 official2028CoveragePercent:null,professionalApproval:0,releaseApproved:false}));

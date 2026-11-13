'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-radiotherapy-51/.build/representative-courses.json');
const report=audit(pack);
assert(report.passed,JSON.stringify(report.problems));
assert.equal(report.official2028CoveragePercent,null);
assert.equal(report.verifiedCompleteGroups,0);
assert.equal(report.currentCourses,51);
assert.equal(report.current353Questions,252);
const dir=path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'v9-current-2027-outline-map.json'),JSON.stringify(report,null,2));
const lines=[
'# 51课572题 · 353卫生综合教学缺口更新（2027大纲仅作2028暂定依据）',
'',
'> 这不是清华2028考试覆盖率、官方教材完整性证明或专家批准记录。',
'',
'- 现有手机内部草稿：51课、572题，其中353为22课252题。',
'- 353数值题累计55题：旧39题曾独立复算，新16题分别在V6–V9的模型测试中重算。',
'- 2027年大纲内部规划主题：27组。其中14组有**部分草稿课候选关联**，仍有13组尚无直接候选关联。',
'- 获得完整2028官方大纲验证的主题：0。完整知识正确性审核：尚未完成。独立专家审批：0。',
'- 本次确认新增粗分组对应关系：MP02辐射防护；MP03核医学影像；MP04放疗物理。',
'- 2027大纲来源：'+report.source,
'',
'## 按现有内容继续补课的优先任务（P0是内部开发优先级，不是考试权重）',
'',
'| 标记 | 规划领域 | 主题 | 关联候选课 | 当前状态 |',
'|---|---|---|---|---|',
 ...report.items.filter(x=>x.priority==='P0').sort((a,b)=>
   (a.courseIds.length?1:0)-(b.courseIds.length?1:0)||a.id.localeCompare(b.id))
   .map(t=>'| '+t.id+' | '+t.area+' | '+t.title+' | '+(t.courseIds.join('、')||'暂无')+' | '+t.mappingStatus+' |'),
'',
'## 审核边界',
'',
'1. 课程链接只表示主题可能涉及，并不意味着主题完全覆盖或学生已经掌握。',
'2. 下一批优先建设统计推断、筛检进阶、流行病学完整研究方法及公共卫生政策/应急。',
'3. 继续使用单课原创例题、独立计算复核、先修门禁、手机浏览器测试以及版本隔离。',
'4. 医学物理高风险知识尚需逐项来源核查，未获审定内容不得标注专家通过。',
'5. 2028年正式考试大纲公布后，必须重新比对，不使用27组计算所谓覆盖百分比。',
''
];
fs.writeFileSync(path.join(dir,'v9-next-course-priorities.md'),lines.join('\n'));
console.log(JSON.stringify({passed:true,courses:51,questions:572,medical353Courses:22,
 numerical353:55,partialLinkedTeachingGroups:14,unlinkedTeachingGroups:13,
 officialCoverageVerified:null,expertApproved:0,releaseApproved:false}));

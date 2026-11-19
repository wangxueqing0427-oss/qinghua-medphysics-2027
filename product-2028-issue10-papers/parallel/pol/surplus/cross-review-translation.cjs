'use strict';
const fs=require('node:fs'),p=require('node:path'),crypto=require('node:crypto'),D=__dirname,file=p.resolve(D,'../../en/translation/en-translation-clause-scope-foundation.json'),bytes=fs.readFileSync(file),u=JSON.parse(bytes),H=b=>crypto.createHash('sha256').update(b).digest('hex');
const observations={
b1:'主句The guide checked the map正确；who关系从句修饰guide，两个错误选项确有主客错换。',
b2:'B保持not all范围；没有由not all推出清楚的具体数目或至少若干清楚。教学也保留all...not歧义边界。',
b3:'C保持让步与到达事实；A增加必然因果，B改变关系及极性，干扰项可排。',
b4:'属于方法回忆题，非实际翻译题；四步和两项回查标准可理解，不能仅此证明实际翻译能力。',
a1:'who修饰visitor、游客读note的主干和蓝色修饰均正确；标准译文“背着”比carried指定了携带方式，接受示例“带着”更忠实，建议收窄标准措辞。',
a2:'参考“不全空着/没有一个空着”及free题定义正确；解释接受“所有座位都有人”把被占用进一步限定为有人，可能忽略行李等占用，应改成“都被占用了”。',
a3:'because因果方向、walkers主体、longer比较均保持；接受示例“改走”比chose额外暗示曾有既定路线，建议统一成“选择了”。未编摔倒封路。',
a4:'who修饰visitor，although让步和not all范围均正确；未增加门数或早到原因。参考“很早”稍强化early但不改变主要命题，可简为“早到”。',
d1:'worker left a note主干正确；修钟从句放回worker，字条/便条同义接受合理。',
d2:'A正确保留did not动作否定和主客关系；B主客倒置，C漏否定并加坏钟。',
d3:'it回指note正确；中文用“字条/里面”自然保留指代，because因果方向未倒置。',
d4:'checked clocks修饰worker，stayed late译待到很晚而非来得晚，were repaired被动与not all范围均正确；拒绝全没修好和全修好，拆句仍需关系标记。'
};
const suggestions=[{priority:'P2',question:'a1',location:'answer',finding:'carried不限定背负方式；“背着”给出原文没有明确的携带方式。',minimalChange:'标准译文改为“带着蓝色包的游客读了这份说明”，保留现有接受示例。'},{priority:'P2',question:'a2',location:'explanation',finding:'none free且free明确定义为未被占用，只能推出都被占用，不能严格推出每座都有人。',minimalChange:'将接受示例“所有座位都有人”改为“所有座位都被占用了”。'},{priority:'P2',question:'a3',location:'explanation',finding:'“改走”暗示原有路线的改变；原句仅明确选择了较长路线。',minimalChange:'接受示例用“行人选择了更长的路线”。'}];
const report={date:'2026-11-19',kind:'cross-agent-internal-AI-semantic-review',reviewedFile:'product-2028-issue10-papers/parallel/en/translation/en-translation-clause-scope-foundation.json',courseId:u.id,version:u.version,courseSHA256:H(bytes),scope:'只读12题题干/实际答案/主观接受边界，重点否定、关系从句、增漏事实；未重复课程测试，未重新核外部来源。',p0:0,p1:0,p2:suggestions.length,conclusion:'未见P0/P1；否定与从句主线正确。3处标准或接受示例有轻微擅增信息，建议改词后再锁定候选。',rows:['basicQuestions','applicationQuestions','delayedQuestions'].flatMap(k=>u[k]).map(q=>({id:q.id,questionSHA256:H(JSON.stringify(q)),finding:observations[q.id.split('-').at(-1)],answerIndex:q.type==='single'?q.answer:null,actualAnswer:q.type==='single'?q.options[q.answer]:q.answer})),suggestions,modifiedTarget:false,testsRerun:false,independentProfessionalApproved:false,professionalApprovals:0};
fs.writeFileSync(p.join(D,'cross-review-translation.json'),JSON.stringify(report,null,2)+'\n');console.log('Saved read-only cross review: P0=0 P1=0 P2=3; target untouched');

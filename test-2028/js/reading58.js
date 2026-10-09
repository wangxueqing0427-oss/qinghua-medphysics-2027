// Original introductory exercises, not past examination papers.
(() => {
  // Older banks contain sparse array slots; normalize before saved-ID lookups.
  window.ENGLISH_PASSAGES = window.ENGLISH_PASSAGES.filter(Boolean);
  const rows = [
    {id:'starter58-social',topic:'社会',title:'社区图书馆的变化',sentences:[
      ['A local library once measured its success only by the number of books people borrowed.','一家社区图书馆曾经只用借书数量衡量自己的成效。'],
      ['Yet many visitors came to use a quiet desk, ask for help with an online form, or meet other people.','然而，许多访客是来使用安静的书桌、寻求在线表格填写帮助，或与他人见面的。'],
      ['When the library counted only loans, these useful services became almost invisible.','当图书馆只统计借阅量时，这些有用的服务几乎就被忽略了。'],
      ['It therefore began collecting comments as well as numbers, while still protecting visitors’ privacy.','因此，它开始在收集数字的同时收集意见，并继续保护访客隐私。'],
      ['The change suggests that a convenient measure can reveal part of an institution’s value without capturing all of it.','这一变化表明，一个方便的指标能揭示机构的部分价值，却未必涵盖其全部价值。']
    ],qs:[{q:'Why did the library change its evaluation?',opts:['Borrowing figures missed some valuable services.','Visitors no longer wanted any books.','Privacy had become unimportant.'],a:0,explain:'第2—3句列举借书以外的服务，说明单一指标遗漏价值。'},{q:'What is the author’s main point?',opts:['Numbers should never be used.','One measure may give an incomplete picture.','Libraries should stop lending books.'],a:1,explain:'末句 without capturing all of it 表明指标只能反映部分价值；不是反对所有数字。'}],main:'借书量只是部分价值。',tip:'看到 only、yet、without，检查选项是否把“部分”夸大成“全部”。'},
    {id:'starter58-economy',topic:'经济',title:'低价订阅真的便宜吗',sentences:[
      ['A company offers an online service for a small monthly fee.','一家公司以较低的月费提供在线服务。'],
      ['The price seems attractive, but customers must spend time finding out how to cancel it.','价格看似诱人，但顾客必须花时间弄清如何取消订阅。'],
      ['Some people continue paying not because they enjoy the service, but because leaving it is inconvenient.','有些人持续付费，并非因为喜欢服务，而是因为退出很麻烦。'],
      ['A rule requiring a clear cancellation button would reduce this difficulty without preventing the company from charging for its work.','要求设置清晰取消按钮的规则可以减少这种困难，同时不妨碍公司收取服务费。'],
      ['To compare offers fairly, consumers need to consider the cost of leaving as well as the price of joining.','为了公平比较不同服务，消费者需要同时考虑退出成本和加入价格。']
    ],qs:[{q:'Why do some customers keep paying?',opts:['The service is always free.','Cancelling takes too much effort.','They cannot compare monthly prices.'],a:1,explain:'第3句指出原因是 leaving it is inconvenient，而不是喜欢产品。'},{q:'The proposed rule would mainly make it easier to:',opts:['avoid paying for any work','hide the monthly price','end a subscription'],a:2,explain:'第4句明确是降低取消订阅的困难，without 后排除了不付费的解释。'}],main:'便宜的加入价格，不代表低退出成本。',tip:'not because… but because… 后半句给出真正原因。'},
    {id:'starter58-education',topic:'教育',title:'看懂答案与独立作答',sentences:[
      ['After reading a worked example, a student feels that the method is easy.','读完一道例题后，一名学生觉得方法很简单。'],
      ['The next day, however, she struggles with a similar problem when the solution is hidden.','然而，第二天当解答被遮住时，她却难以完成一道类似的题。'],
      ['Her teacher asks her to write down the first step before looking at any explanation.','老师让她在查看任何解释之前，先写出第一步。'],
      ['This attempt reveals which part she can produce independently and which part still needs practice.','这次尝试揭示了哪些部分她能独立完成，哪些部分仍需练习。'],
      ['Feeling familiar with an answer is therefore different from being able to construct one.','因此，觉得答案熟悉与能够自己组织答案是两回事。']
    ],qs:[{q:'What did the student’s difficulty reveal?',opts:['Familiarity did not ensure independent performance.','All worked examples are useless.','The teacher had changed the subject.'],a:0,explain:'第1句熟悉与第2句不会做形成对照，末句给出结论。'},{q:'Why did the teacher ask for the first step?',opts:['To eliminate all explanations.','To see what the student could do without help.','To make the problem longer.'],a:1,explain:'第4句 independently 是依据；没有说永远不能看解释。'}],main:'看懂 ≠ 能独立做。',tip:'先用中文概括例子证明的观点，再选择主旨。'},
    {id:'starter58-technology',topic:'科技',title:'推荐系统与选择',sentences:[
      ['A video platform recommends clips similar to those a user has watched before.','一个视频平台推荐与用户过去看过的内容相似的短片。'],
      ['This saves time, but it may also make unfamiliar ideas less likely to appear.','这样可以节省时间，但也可能降低陌生观点出现的机会。'],
      ['A viewer who sees only the recommended list might mistake it for a complete picture of what is available.','只看到推荐列表的观众，可能误以为它全面代表了所有可选内容。'],
      ['Giving users a clear way to explore different topics would preserve convenience while widening their choices.','为用户提供清晰的不同主题探索入口，可以在保留便利的同时拓宽选择。'],
      ['The issue is not whether recommendations exist, but how much control users have over them.','问题不在于推荐是否存在，而在于用户能在多大程度上控制推荐。']
    ],qs:[{q:'What possible limitation does the author identify?',opts:['Every recommendation is incorrect.','Videos can no longer be found.','Users may encounter fewer unfamiliar ideas.'],a:2,explain:'第2句 may、less likely 表示可能减少接触，不是所有推荐都错。'},{q:'The author would most likely support:',opts:['an option to explore other topics','removing every convenient feature','hiding the recommendation process further'],a:0,explain:'第4句提出探索不同主题的入口，是建议的直接依据。'}],main:'推荐有便利，也要保留探索和控制。',tip:'作者兼顾两面时，警惕完全支持或完全反对的极端选项。'},
    {id:'starter58-culture',topic:'文化',title:'博物馆中的日常物品',sentences:[
      ['A museum displays an ordinary kitchen tool beside a painting from the same period.','一家博物馆将普通厨具与同一时期的一幅画并列展出。'],
      ['At first, a visitor wonders why such a common object deserves attention.','起初，一位访客不明白如此普通的物品为何值得关注。'],
      ['The label explains how people used it and what their daily work involved.','展签解释了人们如何使用它，以及日常劳动包含哪些内容。'],
      ['Seen in this context, the tool helps visitors understand lives that grand portraits rarely describe.','放在这个背景下，这件工具帮助访客理解宏大肖像画很少描述的生活。'],
      ['An object’s historical importance need not depend on its beauty or its price.','一件物品的历史重要性不一定取决于其美感或价格。']
    ],qs:[{q:'What makes the kitchen tool informative?',opts:['Its unusually high market price.','Its connection with everyday life.','Its similarity to every painting.'],a:1,explain:'第3—4句说明日常劳动和生活背景带来信息价值。'},{q:'Which statement best expresses the conclusion?',opts:['Only beautiful objects belong in museums.','Portraits never contain historical information.','Common objects can have historical value.'],a:2,explain:'末句 need not 排除价格和美感是必要条件；普通物品也能有历史价值。'}],main:'普通物件 + 生活背景 = 历史价值。',tip:'need not 是“不一定需要”，不能误读成“绝对没有”。'},
    {id:'starter58-environment',topic:'环境',title:'修理还是更换',sentences:[
      ['A household replaces a broken appliance because repairing it seems expensive.','一个家庭因为维修看起来昂贵而更换了坏掉的家电。'],
      ['Yet the price of a new product does not show every resource used to make and transport it.','然而，新产品的价格并未体现制造和运输它所用的每一种资源。'],
      ['A repair service may extend the life of the old machine, especially when spare parts are available.','维修服务可能延长旧机器的寿命，尤其是在可以买到零件时。'],
      ['This does not mean repairing is always the best choice, since an old device may also consume much more electricity.','这并不意味着维修总是最佳选择，因为旧设备也可能消耗更多电力。'],
      ['A reasonable decision compares several costs instead of treating either repair or replacement as an automatic answer.','合理的决定会比较多种成本，而不会自动认定维修或更换中的某一个必然正确。']
    ],qs:[{q:'Why does the author mention electricity use?',opts:['To show a possible disadvantage of keeping an old device.','To prove new products use no resources.','To reject every repair service.'],a:0,explain:'第4句是对维修优势的限制，指出旧机耗电可能更大。'},{q:'The author’s recommendation is to:',opts:['always choose the cheapest new product','compare relevant costs before deciding','repair every appliance regardless of condition'],a:1,explain:'末句明确 compare several costs；always、every 是过度概括。'}],main:'比较多个成本，拒绝“一律”。',tip:'让步句后的限制常是考点；把优势和条件一起记。'}
  ];
  rows.forEach(r => {
    window.ENGLISH_PASSAGES.push({id:r.id,title:r.title,text:r.sentences.map(s=>s[0]).join(' '),topic58:r.topic,qs:r.qs});
    window.ENGLISH_PASSAGE_HELP[r.id]={cn:r.sentences.map(s=>s[1]).join(''),sentences:r.sentences,main:r.main,tip:r.tip};
  });
})();

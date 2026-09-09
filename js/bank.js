window.QUESTIONS = [
  { id: "q-e01", subject: "epi", chapterId: "epi-01", type: "single", stem: "流行病学最核心的研究对象是：", options: ["单个疑难病例", "实验室动物", "人群", "一台诊疗设备"], answer: 2, explain: "流行病学看群体中的分布、因素与干预。" },
  { id: "q-e02", subject: "epi", chapterId: "epi-01", type: "single", stem: "研究者主动给一部分人服药、另一部分人安慰剂，这属于：", options: ["现况研究", "病例对照", "队列研究", "实验性研究"], answer: 3, explain: "是否主动分配干预是观察与实验的分界。" },
  { id: "q-e03", subject: "epi", chapterId: "epi-02", type: "single", stem: "强调“一定期间新发病例”的指标是：", options: ["患病率", "发病率", "病死率", "构成比"], answer: 1, explain: "发病率看新发，患病率看现患。" },
  { id: "q-e04", subject: "epi", chapterId: "epi-02", type: "tf", stem: "病程越长，在其他条件相近时患病率通常越高。", options: ["对", "错"], answer: 0, explain: "患病率受发病和病程共同影响。" },
  { id: "q-e05", subject: "epi", chapterId: "epi-02", type: "noun", stem: "三间分布", answer: "疾病在地区、时间、人群三个维度上的分布。", explain: "描述流行病学的基本框架。" },
  { id: "q-e06", subject: "epi", chapterId: "epi-03", type: "tf", stem: "两个变量存在统计学关联，就可以认定因果关系。", options: ["对", "错"], answer: 1, explain: "关联可能来自混杂、偏倚或反向因果。" },
  { id: "q-e07", subject: "epi", chapterId: "epi-04", type: "single", stem: "现况研究最主要的局限是：", options: ["完全不能描述分布", "暴露与结局的时间先后常难判断", "一定比队列更贵", "不能发现任何线索"], answer: 1, explain: "像拍照，难判谁先谁后。" },
  { id: "q-e08", subject: "epi", chapterId: "epi-04", type: "single", stem: "调查目标人群的全部对象，称为：", options: ["系统抽样", "分层抽样", "普查", "整群抽样"], answer: 2, explain: "普查覆盖全部对象。" },
  { id: "q-e09", subject: "epi", chapterId: "epi-05", type: "calc", stem: "四格表：病例暴露20、病例非暴露10、对照暴露15、对照非暴露30。OR约为：", options: ["0.25", "1.0", "4.0", "2.0"], answer: 2, explain: "OR=ad/bc=20×30/(10×15)=4。" },
  { id: "q-e10", subject: "epi", chapterId: "epi-05", type: "single", stem: "OR=0.6 且 95%CI 为 0.4–0.9，较合理的说法是：", options: ["暴露肯定有害", "暴露可能具有保护作用", "完全没有关联", "可以证明因果"], answer: 1, explain: "OR<1且CI不跨1，提示保护性关联，仍不等于因果证明。" },
  { id: "q-e11", subject: "epi", chapterId: "epi-05", type: "single", stem: "病例对照研究的时间方向通常是：", options: ["先暴露再等结局", "先按结局分组再回顾暴露", "同时随机分配干预", "只描述三间分布"], answer: 1, explain: "先病后暴露，核心指标OR。" },
  { id: "q-e12", subject: "epi", chapterId: "epi-06", type: "calc", stem: "暴露组发病率20%，非暴露组10%。RR是：", options: ["0.5", "2.0", "10%", "30%"], answer: 1, explain: "RR=0.20/0.10=2。" },
  { id: "q-e13", subject: "epi", chapterId: "epi-06", type: "calc", stem: "上题的AR是：", options: ["2", "0.5", "10%", "30%"], answer: 2, explain: "AR=20%−10%=10%。" },
  { id: "q-e14", subject: "epi", chapterId: "epi-06", type: "single", stem: "反映“总人群中可归因于某暴露的发病比例”的是：", options: ["RR", "OR", "ARP", "PARP"], answer: 3, explain: "PARP看人群层面，ARP看暴露组内部。" },
  { id: "q-e15", subject: "epi", chapterId: "epi-07", type: "single", stem: "随机化的主要目的是：", options: ["让结果变得随机", "使组间基线更可比", "一定能双盲", "代替对照"], answer: 1, explain: "随机是为了分组公平，控制混杂。" },
  { id: "q-e16", subject: "epi", chapterId: "epi-08", type: "calc", stem: "金标准有病100人中检出90人，无病200人中误报20人。灵敏度是：", options: ["90%", "80%", "81.8%", "10%"], answer: 0, explain: "灵敏度=90/100=90%。" },
  { id: "q-e17", subject: "epi", chapterId: "epi-08", type: "calc", stem: "上题特异度是：", options: ["90%", "10%", "80%", "95%"], answer: 0, explain: "无病200人，误报20人，TN=180，特异度=180/200=90%。" },
  { id: "q-e18", subject: "epi", chapterId: "epi-08", type: "single", stem: "患病率明显下降时，通常变化更大的是：", options: ["灵敏度", "特异度", "阳性预测值", "试验的物理原理"], answer: 2, explain: "预测值受患病率影响大。" },
  { id: "q-e19", subject: "epi", chapterId: "epi-09", type: "single", stem: "传染病流行过程的三环节是：", options: ["一级、二级、三级预防", "传染源、传播途径、易感人群", "率、比、比例", "随机、对照、盲法"], answer: 1, explain: "控制措施也按这三环写。" },
  { id: "q-e20", subject: "epi", chapterId: "epi-11", type: "tf", stem: "系统评价是方法框架，Meta分析是其中可能采用的定量综合工具。", options: ["对", "错"], answer: 0, explain: "二者不是同义词。" },

  { id: "q-s01", subject: "stats", chapterId: "st-01", type: "single", stem: "由样本计算、用来推断总体的量称为：", options: ["参数", "总体", "统计量", "变量类型"], answer: 2, explain: "参数描述总体，统计量来自样本。" },
  { id: "q-s02", subject: "stats", chapterId: "st-02", type: "single", stem: "明显偏态且有极端值的定量资料，描述集中趋势优先用：", options: ["均数", "中位数", "方差", "标准误"], answer: 1, explain: "中位数更稳健。" },
  { id: "q-s03", subject: "stats", chapterId: "st-04", type: "single", stem: "描述样本均数抽样波动大小的是：", options: ["极差", "标准差", "标准误", "众数"], answer: 2, explain: "标准差看个体离散，标准误看统计量波动。" },
  { id: "q-s04", subject: "stats", chapterId: "st-05", type: "tf", stem: "OR的95%CI跨过1，通常仍可坚定结论为“肯定有关联”。", options: ["对", "错"], answer: 1, explain: "跨过1时证据通常不足以拒绝无关联。" },
  { id: "q-s05", subject: "stats", chapterId: "st-06", type: "tf", stem: "P>0.05 等于证明两组完全没有差异。", options: ["对", "错"], answer: 1, explain: "只说明现有证据不足以拒绝H0。" },
  { id: "q-s06", subject: "stats", chapterId: "st-07", type: "single", stem: "同一批患者治疗前后血压比较，优先考虑：", options: ["两独立样本t检验", "配对t检验", "卡方检验", "Logistic回归"], answer: 1, explain: "同一对象前后属于配对。" },
  { id: "q-s07", subject: "stats", chapterId: "st-08", type: "single", stem: "比较两组患者的治愈率，资料为分类，首先想到：", options: ["t检验", "方差分析", "卡方检验", "Pearson相关"], answer: 2, explain: "率的比较常用卡方。" },
  { id: "q-s08", subject: "stats", chapterId: "st-09", type: "single", stem: "四个治疗组比较平均住院日，不宜首先反复做：", options: ["方差分析", "多次两两t检验", "先看变量类型", "看是否近似正态"], answer: 1, explain: "反复t会抬高I类错误。" },
  { id: "q-s09", subject: "stats", chapterId: "st-10", type: "tf", stem: "相关系数很大，就可以直接写成因果关系。", options: ["对", "错"], answer: 1, explain: "相关不等于因果。" },
  { id: "q-s10", subject: "stats", chapterId: "st-11", type: "single", stem: "结局是是否发生术后感染，并要调整多个混杂因素，优先：", options: ["线性回归", "配对t检验", "Logistic回归", "只做均数比较"], answer: 2, explain: "二分类结局用Logistic。" },
  { id: "q-s11", subject: "stats", chapterId: "st-12", type: "single", stem: "考场选择统计方法的第一问通常是：", options: ["作者是谁", "结局是定量还是分类", "P值是否小于0.01", "样本从哪所医院来"], answer: 1, explain: "先看变量类型。" },
  { id: "q-s12", subject: "stats", chapterId: "st-03", type: "noun", stem: "Z分数", answer: "把原始值转换为离均数多少个标准差的标准化值，Z=(X−μ)/σ。", explain: "用于去掉量纲后比较位置。" },

  { id: "q-v16-s01-1", subject: "stats", chapterId: "st-01", type: "single", stem: "某研究记录患者的疼痛程度为轻、中、重，该变量属于：", options: ["连续定量", "离散定量", "有序分类", "无序分类"], answer: 2, explain: "轻、中、重有明确等级顺序，属于有序分类资料。" },
  { id: "q-v16-s01-2", subject: "stats", chapterId: "st-01", type: "single", stem: "研究者想了解北京市全部成年人平均收缩压，但实际抽取1000人测量。‘北京市全部成年人平均收缩压’属于：", options: ["样本统计量", "总体参数", "个体变量", "抽样误差"], answer: 1, explain: "目标总体的真实平均值是总体参数。" },
  { id: "q-v16-s02-1", subject: "stats", chapterId: "st-02", type: "calc", stem: "5名患者住院日为2、3、3、4、18天，中位数是：", options: ["3", "4", "6", "18"], answer: 0, explain: "排序后中间第3个数为3。" },
  { id: "q-v16-s02-2", subject: "stats", chapterId: "st-02", type: "single", stem: "A指标均数100、SD=10；B指标均数20、SD=4。比较相对变异更适合看：", options: ["仅比较SD", "变异系数CV", "仅比较均数", "P值"], answer: 1, explain: "两指标均数水平不同，CV用于比较相对离散。A约10%，B约20%。" },
  { id: "q-v16-s03-1", subject: "stats", chapterId: "st-03", type: "calc", stem: "总体均数100、标准差15，某人测量值130，其Z分数为：", options: ["1", "2", "15", "30"], answer: 1, explain: "Z=(130−100)/15=2。" },
  { id: "q-v16-s03-2", subject: "stats", chapterId: "st-03", type: "single", stem: "下列最符合二项分布基本场景的是：", options: ["记录100人的身高", "10次独立检测中记录阳性次数，且每次阳性概率稳定", "记录一台设备连续温度曲线", "比较三个城市平均年龄"], answer: 1, explain: "固定次数、二分类结果、概率稳定、试验独立。" },
  { id: "q-v16-s04-1", subject: "stats", chapterId: "st-04", type: "calc", stem: "其他条件不变，样本量从100增加到400，均数标准误大约变为原来的：", options: ["4倍", "2倍", "1/2", "1/4"], answer: 2, explain: "SE∝1/√n，样本量扩大4倍，SE约减半。" },
  { id: "q-v16-s04-2", subject: "stats", chapterId: "st-04", type: "tf", stem: "只要样本量足够大，就一定能消除选择偏倚。", options: ["对", "错"], answer: 1, explain: "大样本可减小随机误差，但系统性选择偏倚不会因样本大而自动消失。" },
  { id: "q-v16-s05-1", subject: "stats", chapterId: "st-05", type: "single", stem: "某均数差95%CI为−0.8到2.1。就‘差异=0’这一无效应值而言：", options: ["区间未跨0", "区间跨0", "一定有临床意义", "可以证明两组完全相同"], answer: 1, explain: "差值类指标无效应值为0，该CI跨0。" },
  { id: "q-v16-s05-2", subject: "stats", chapterId: "st-05", type: "single", stem: "在其他条件相同下，把置信水平从95%提高到99%，置信区间通常会：", options: ["更窄", "更宽", "完全不变", "一定跨0"], answer: 1, explain: "置信水平越高，需要覆盖更宽的范围。" },
  { id: "q-v16-s06-1", subject: "stats", chapterId: "st-06", type: "single", stem: "P=0.03最规范的解释是：", options: ["H0为真的概率是3%", "在H0和模型条件成立时，得到当前或更极端数据的概率约为3%", "研究结论有97%概率正确", "效应一定很大"], answer: 1, explain: "P值是以H0成立为前提的数据极端程度，不是H0为真的概率。" },
  { id: "q-v16-s06-2", subject: "stats", chapterId: "st-06", type: "single", stem: "检验效能power等于：", options: ["α", "β", "1−α", "1−β"], answer: 3, explain: "power=1−β，表示存在真实效应时发现它的能力。" },
  { id: "q-v16-s07-1", subject: "stats", chapterId: "st-07", type: "single", stem: "同一20名患者服药前后胆固醇比较，最核心的分析对象是：", options: ["治疗前20个值和治疗后20个值作为完全独立两组", "每位患者的前后差值", "只比较两个中位数而不看配对", "只看总样本量40"], answer: 1, explain: "配对t检验先计算每一对的差值，再检验差值总体均数。" },
  { id: "q-v16-s07-2", subject: "stats", chapterId: "st-07", type: "single", stem: "比较四个互相独立治疗组的平均血压，经典思路首先考虑：", options: ["配对t检验", "反复做6次两两t检验", "单因素方差分析", "卡方检验"], answer: 2, explain: "三组及以上独立均数比较先考虑ANOVA，避免反复t导致总体I类错误膨胀。" },
  { id: "q-v16-s08-1", subject: "stats", chapterId: "st-08", type: "calc", stem: "2×2表中某行合计40、某列合计30、总数100。在独立性假设下该格理论频数E为：", options: ["12", "30", "40", "70"], answer: 0, explain: "E=40×30/100=12。" },
  { id: "q-v16-s08-2", subject: "stats", chapterId: "st-08", type: "tf", stem: "卡方检验显著就足以证明一个分类变量导致另一个变量。", options: ["对", "错"], answer: 1, explain: "卡方可提示统计关联，不能单靠它建立因果。" },
  { id: "q-v16-s09-1", subject: "stats", chapterId: "st-09", type: "single", stem: "单因素ANOVA总体F检验P<0.05，最准确的结论是：", options: ["每两组都不同", "至少有两个总体均数不同", "第一组一定最高", "所有组都相同"], answer: 1, explain: "总体F显著只说明不是所有均数都相等，需要进一步比较定位差异。" },
  { id: "q-v16-s09-2", subject: "stats", chapterId: "st-09", type: "single", stem: "F统计量的基本思想是比较：", options: ["组间变异与组内变异", "两个分类变量频数", "阳性预测值和阴性预测值", "病例和对照的暴露优势"], answer: 0, explain: "F=组间均方/组内均方。" },
  { id: "q-v16-s10-1", subject: "stats", chapterId: "st-10", type: "single", stem: "Pearson r=−0.75，较合理的描述是：", options: ["较强负线性相关", "较强正线性相关", "无任何关系", "X必然导致Y下降"], answer: 0, explain: "负号表示反向，绝对值0.75提示较强线性关联，但不代表因果。" },
  { id: "q-v16-s10-2", subject: "stats", chapterId: "st-10", type: "tf", stem: "r接近0时，两个变量之间一定不存在任何形式的关系。", options: ["对", "错"], answer: 1, explain: "r主要反映线性关系，仍可能存在非线性关联。" },
  { id: "q-v16-s11-1", subject: "stats", chapterId: "st-11", type: "single", stem: "线性回归中β1=2.5，若模型条件合理，通常解释为：", options: ["X每增加1单位，Y平均增加2.5单位", "Y每增加1单位，X一定增加2.5单位", "OR=2.5", "风险增加250%"], answer: 0, explain: "在线性回归中，斜率β1表示X每增加1单位时Y的平均改变。" },
  { id: "q-v16-s11-2", subject: "stats", chapterId: "st-11", type: "calc", stem: "Logistic回归某暴露系数β≈0.693，则exp(β)约为：", options: ["0.5", "1", "2", "6.93"], answer: 2, explain: "e^0.693≈2，因此调整OR约为2。" },
  { id: "q-v16-s12-1", subject: "stats", chapterId: "st-12", type: "single", stem: "研究三个独立饮食组的平均BMI差异，结局BMI为连续变量，首选经典方法是：", options: ["卡方检验", "单因素方差分析", "Logistic回归", "配对t检验"], answer: 1, explain: "≥3个独立组比较连续均数，首先考虑ANOVA。" },
  { id: "q-v16-s12-2", subject: "stats", chapterId: "st-12", type: "single", stem: "研究是否发生并发症（二分类结局），并同时调整年龄、性别、吸烟等因素，首选：", options: ["Pearson相关", "配对t检验", "Logistic回归", "单因素方差分析"], answer: 2, explain: "二分类结局的多因素模型通常用Logistic回归。" },

  { id: "q-p01", subject: "ph", chapterId: "ph-01", type: "single", stem: "公共卫生最核心的对象是：", options: ["一台加速器", "单个住院患者", "人群", "一份合同"], answer: 2, explain: "公卫以人群健康为核心。" },
  { id: "q-p02", subject: "ph", chapterId: "ph-03", type: "single", stem: "接种疫苗属于：", options: ["一级预防", "二级预防", "三级预防", "筛查"], answer: 0, explain: "发病前针对危险因素。" },
  { id: "q-p03", subject: "ph", chapterId: "ph-03", type: "single", stem: "对无症状高危人群做乳腺筛查，属于：", options: ["一级预防", "二级预防", "三级预防", "康复治疗"], answer: 1, explain: "筛查是二级预防。" },
  { id: "q-p04", subject: "ph", chapterId: "ph-03", type: "single", stem: "脑卒中后的康复训练主要属于：", options: ["一级预防", "二级预防", "三级预防", "病因预防"], answer: 2, explain: "减少残疾和促进功能恢复。" },
  { id: "q-p05", subject: "ph", chapterId: "ph-06", type: "single", stem: "突发公共卫生事件处置，首先通常应：", options: ["先写总结报告", "核实并评估是否构成事件、启动监测预警", "只做健康宣教", "先采购大型设备"], answer: 1, explain: "先确认、预警，再调查控制。" },
  { id: "q-p06", subject: "ph", chapterId: "ph-07", type: "tf", stem: "健康促进只等于发宣传单。", options: ["对", "错"], answer: 1, explain: "还包括环境、政策和社会支持。" },
  { id: "q-p07", subject: "ph", chapterId: "ph-04", type: "tf", stem: "效率高就等于公平好。", options: ["对", "错"], answer: 1, explain: "效率和公平需要权衡。" },
  { id: "q-p08", subject: "ph", chapterId: "ph-08", type: "short", stem: "写出“设计防控方案”的六步。", answer: "明确人群与问题→描述负担→找危险因素→一级/二/三级预防→资源与组织→监测评价。", explain: "综合题骨架。" },
  { id: "q-p09", subject: "ph", chapterId: "ph-05", type: "noun", stem: "健康公平", answer: "不同地区、收入、年龄等人群获得健康机会和卫生服务的公正性。", explain: "政策评价必写的一面。" },
  { id: "q-p10", subject: "ph", chapterId: "ph-02", type: "single", stem: "比较年龄结构差异很大的两个地区死亡水平，更合适的是：", options: ["只报粗死亡率", "用标化率或期望寿命等综合指标", "只报病死率", "只报发病人数"], answer: 1, explain: "粗率受年龄结构干扰。" },

  { id: "q-m01", subject: "mp", chapterId: "mp-01", type: "single", stem: "X射线与γ射线最本质的差别在于：", options: ["一个是粒子一个是波", "产生来源不同", "一个有质量一个没有", "完全不是电磁辐射"], answer: 1, explain: "二者都是光子，来源不同。" },
  { id: "q-m02", subject: "mp", chapterId: "mp-02", type: "single", stem: "吸收剂量的单位是：", options: ["Sv", "Bq", "Gy", "eV"], answer: 2, explain: "Gy=J/kg。" },
  { id: "q-m03", subject: "mp", chapterId: "mp-02", type: "single", stem: "辐射防护中更常用的剂量单位是：", options: ["Gy", "Sv", "kg", "Hz"], answer: 1, explain: "Sv用于当量/有效剂量。" },
  { id: "q-m04", subject: "mp", chapterId: "mp-03", type: "single", stem: "临床参考剂量学中最常作为稳定标准工具的是：", options: ["电离室", "普通数码相机", "体温计", "血压计"], answer: 0, explain: "电离室稳定、可追溯。" },
  { id: "q-m05", subject: "mp", chapterId: "mp-04", type: "noun", stem: "建成区", answer: "高能光子入射后，次级电子逐渐建立电子平衡，表面剂量较低、至dmax才达最大的深度区间。", explain: "深度剂量的核心概念。" },
  { id: "q-m02a", subject: "mp", chapterId: "mp-02", type: "single", stem: "1 Gy 等于：", options: ["1 J/kg", "1次衰变/秒", "1 C/kg", "1 Sv/kg"], answer: 0, explain: "吸收剂量的SI单位：1 Gy=1 J/kg。" },
  { id: "q-m02b", subject: "mp", chapterId: "mp-02", type: "single", stem: "下列最能描述放射性核素每秒衰变次数的是：", options: ["Gy", "Sv", "Bq", "Gy/min"], answer: 2, explain: "Bq是活度单位，1 Bq=1 s⁻¹。" },
  { id: "q-m02c", subject: "mp", chapterId: "mp-02", type: "calc", stem: "处方30 Gy，等分10次，每次剂量为：", options: ["0.3 Gy", "3 Gy", "10 Gy", "300 Gy"], answer: 1, explain: "等分次时每次剂量=30/10=3 Gy。" },
  { id: "q-m03a", subject: "mp", chapterId: "mp-03", type: "single", stem: "气体电离室读数常需温压修正，主要因为：", options: ["温压改变气体密度", "温压改变患者姓名", "温压改变光子静止质量", "温压只影响胶片"], answer: 0, explain: "气体密度改变会影响产生和收集的离子对数量。" },
  { id: "q-m03b", subject: "mp", chapterId: "mp-03", type: "single", stem: "若要测量高梯度小野的二维分布，下列更强调高空间分辨率的是：", options: ["大体积电离室", "放射变色胶片", "血压计", "温度计"], answer: 1, explain: "胶片具有很高的二维空间分辨率，但需标定和规范分析。" },
  { id: "q-m03c", subject: "mp", chapterId: "mp-03", type: "tf", stem: "探测器原始读数可以不经校准和修正直接当作患者吸收剂量。", options: ["对", "错"], answer: 1, explain: "原始响应需经过校准与必要修正才能形成可靠剂量学量。" },
  { id: "q-m04a", subject: "mp", chapterId: "mp-04", type: "single", stem: "PDD主要描述：", options: ["中心轴剂量随深度的相对变化", "放射源每秒衰变次数", "患者体重", "横向半影宽度本身"], answer: 0, explain: "PDD是中心轴相对深度剂量概念。" },
  { id: "q-m04b", subject: "mp", chapterId: "mp-04", type: "tf", stem: "兆伏光子束的表面剂量通常严格等于0。", options: ["对", "错"], answer: 1, explain: "存在建成效应，但表面剂量并非零。" },
  { id: "q-m04c", subject: "mp", chapterId: "mp-04", type: "single", stem: "在其他条件相近时，光子能量升高通常使：", options: ["dmax变浅且穿透变差", "dmax变深且穿透增强", "半影一定为零", "表面剂量一定为100%"], answer: 1, explain: "高能光子通常dmax更深，深部相对剂量更高。" },
  { id: "q-m06", subject: "mp", chapterId: "mp-05", type: "single", stem: "电子束适合浅表病变，主要因为：", options: ["完全没有剂量", "有限射程，一定深度后剂量快速下降", "一定比光子能量高", "不需要QA"], answer: 1, explain: "看深度剂量特征，不是“更强”。" },
  { id: "q-m07", subject: "mp", chapterId: "mp-07", type: "single", stem: "IMRT的“调强”指的是：", options: ["把总剂量无限制加大", "调节不同射束/子野的强度分布", "只调节机房空调", "取消危及器官限制"], answer: 1, explain: "调的是空间强度，不是蛮力加量。" },
  { id: "q-m08", subject: "mp", chapterId: "mp-08", type: "single", stem: "IGRT主要解决的问题是：", options: ["如何优化剂量分布", "患者/靶区在哪里", "如何产生X射线", "如何收费"], answer: 1, explain: "图像引导做位置确认和校正。" },
  { id: "q-m09", subject: "mp", chapterId: "mp-07", type: "tf", stem: "IMRT和IGRT是同一个意思。", options: ["对", "错"], answer: 1, explain: "一个管剂量塑形，一个管位置。" },
  { id: "q-m10", subject: "mp", chapterId: "mp-09", type: "tf", stem: "TPS算出来的计划很漂亮，就可以不做验证和QA。", options: ["对", "错"], answer: 1, explain: "计算漂亮不等于实施正确。" },
  { id: "q-m11", subject: "mp", chapterId: "mp-10", type: "noun", stem: "Bragg峰", answer: "带电粒子在射程末端附近能量沉积明显增加的深度剂量特征。", explain: "质子/碳离子的核心物理图像。" },
  { id: "q-m12", subject: "mp", chapterId: "mp-10", type: "tf", stem: "质子治疗在任何情况下都一定优于光子治疗。", options: ["对", "错"], answer: 1, explain: "取决于适应证、射程不确定性和资源。" },
  { id: "q-m13", subject: "mp", chapterId: "mp-11", type: "single", stem: "放疗安全链应同时包括：", options: ["只要机器能开机", "计划正确、机器正确、摆位正确、执行正确", "只看DVH好看", "只看患者签字"], answer: 1, explain: "四环缺一不可。" },
  { id: "q-m14", subject: "mp", chapterId: "mp-12", type: "single", stem: "ALARA的含义更接近：", options: ["剂量越大越好", "在达到目的前提下使不必要照射尽可能低", "完全禁止一切照射", "只保护机器不保护人"], answer: 1, explain: "优化原则。" },
  { id: "q-m15", subject: "mp", chapterId: "mp-13", type: "single", stem: "PET成像直接探测的是：", options: ["正电子本身", "湮灭产生的成对约511 keV光子", "超声波", "可见光"], answer: 1, explain: "符合探测的是光子对。" },
  { id: "q-m16", subject: "mp", chapterId: "mp-13", type: "single", stem: "SPECT相对γ相机，关键增加的是：", options: ["多角度采集和断层重建", "改成超声波", "取消准直器且不再探测光子", "变成外照射治疗"], answer: 0, explain: "SPECT是断层版的单光子成像。" },
  { id: "q-m17", subject: "mp", chapterId: "mp-06", type: "short", stem: "用一句话说明近距离治疗为何强调源的位置。", answer: "剂量随距离变化很明显，源的位置和停留时间会直接改变局部剂量。", explain: "距离效应。" },
  { id: "q-m18", subject: "mp", chapterId: "mp-12", type: "short", stem: "默写操作防护三要素。", answer: "时间尽量短、距离尽量远、屏蔽合理。", explain: "和正当性、ALARA、限值一起记。" },

  { id: "q-v18-e10-1", subject: "epi", chapterId: "epi-10", type: "single", stem: "疾病监测区别于一次性现况调查的关键特征是：", options: ["只调查患者", "持续系统收集分析并反馈用于行动", "一定使用随机试验", "只在暴发后开始"], answer: 1, explain: "监测强调持续、系统、反馈和行动。" },
  { id: "q-v18-ph06-1", subject: "ph", chapterId: "ph-06", type: "single", stem: "IHR（2005）框架下，国家公共卫生核心能力最接近：", options: ["只建设更多病床", "监测、发现、评估、通报和响应能力", "取消跨境信息共享", "只依靠个人自报"], answer: 1, explain: "IHR核心是及时发现、评估、通报与响应公共卫生风险。" },
  { id: "q-v18-ph06-2", subject: "ph", chapterId: "ph-06", type: "short", stem: "公共卫生应急措施为什么还要考虑比例原则？", answer: "措施应与风险严重程度和证据相称，在实现公共利益的同时尽量减少对个人权利和社会运行的不必要限制。", explain: "应急不是无限权力，需兼顾有效性、必要性和权利保护。" },
  { id: "q-v18-ph07-1", subject: "ph", chapterId: "ph-07", type: "single", stem: "卫生援助被称为可能具有‘双刃剑’效应，最合理的原因是：", options: ["援助永远无效", "既可补资源建能力，也可能造成依赖或与本地优先级错配", "援助只涉及药品", "援助不需要评价"], answer: 1, explain: "要同时看短期收益、能力建设、本地需求和可持续性。" },
  { id: "q-v18-ph09-1", subject: "ph", chapterId: "ph-09", type: "single", stem: "用AI模型预测某病高风险人群时，下列哪项最不应该被忽略？", options: ["训练数据代表性与算法偏倚", "只要AUC高就无需外部验证", "隐私与数据安全", "不同人群中的公平性"], answer: 1, explain: "性能高不代表能泛化，必须外部验证并检查偏倚、公平与隐私。" },
  { id: "q-v18-ph09-2", subject: "ph", chapterId: "ph-09", type: "short", stem: "陌生跨学科材料题的六步答题框架是什么？", answer: "问题→证据→机制/解释→干预或研究方案→评价→风险、伦理与公平。", explain: "先搭逻辑骨架，再填学科细节。" },
  { id: "q-v18-mix-1", subject: "stats", chapterId: "st-12", type: "single", stem: "某社区比较干预前后同一批居民是否吸烟（二分类配对资料），最重要的第一步是：", options: ["直接套独立样本t检验", "先识别结局为二分类且资料为配对，再选择匹配的分类资料方法", "只比较两个均数", "忽略配对结构"], answer: 1, explain: "353更重视先识别资料结构再选方法；不要机械套公式。" },
  { id: "q-v18-mix-2", subject: "epi", chapterId: "epi-08", type: "calc", stem: "筛检1000人，患病率10%。灵敏度90%，特异度80%。预计真阳性人数约为：", options: ["90", "100", "180", "720"], answer: 0, explain: "患病100人，灵敏度90%，TP=90。" },
  { id: "q-v18-mix-3", subject: "epi", chapterId: "epi-08", type: "calc", stem: "承接上题，预计假阳性人数约为：", options: ["20", "90", "180", "200"], answer: 2, explain: "无病900人，假阳性率=1−特异度=20%，FP=180。" },
  { id: "q-v18-mix-4", subject: "mp", chapterId: "mp-11", type: "short", stem: "为什么新放疗技术即使剂量分布更漂亮，也必须做QA和实施验证？", answer: "计划计算、机器输出、MLC/影像/摆位和数据传输都可能引入误差；QA用于确认计划能够被设备和流程准确、安全地实现。", explain: "把TPS、设备、患者与执行链连起来。" },

  { id: "q-pol1", subject: "pol", chapterId: "pol-01", type: "single", stem: "马克思主义哲学认为认识的基础是：", options: ["灵感", "书本", "实践", "传闻"], answer: 2, explain: "实践是认识的基础。" },
  { id: "q-pol2", subject: "pol", chapterId: "pol-02", type: "single", stem: "新时代我国社会主要矛盾是：", options: ["阶级矛盾", "美好生活需要与不平衡不充分发展之间的矛盾", "城乡绝对对立", "只存在于经济领域的供需矛盾"], answer: 1, explain: "准确表述必须记住。" },
  { id: "q-pol3", subject: "pol", chapterId: "pol-02", type: "single", stem: "新发展理念不包括：", options: ["创新", "协调", "封闭", "共享"], answer: 2, explain: "创新、协调、绿色、开放、共享。" },
  { id: "q-pol4", subject: "pol", chapterId: "pol-03", type: "single", stem: "近代中国社会性质是：", options: ["完全的封建社会", "半殖民地半封建社会", "发达资本主义社会", "信息社会"], answer: 1, explain: "史纲起点判断。" },
  { id: "q-pol5", subject: "pol", chapterId: "pol-04", type: "tf", stem: "法治思维只要求服从，不谈权利和程序。", options: ["对", "错"], answer: 1, explain: "法治包含权利义务、程序和权力制约。" },
  { id: "q-pol6", subject: "pol", chapterId: "pol-05", type: "single", stem: "按本计划，9月政治应：", options: ["成为每天最主要科目", "只建立框架，把时间留给353和英语", "完全不看", "直接开始默肖四"], answer: 1, explain: "政治后期提升更快。" },

  { id: "q-en1", subject: "en", chapterId: "en-01", type: "single", stem: "The incidence of a disease refers mainly to:", options: ["all existing cases", "new cases in a period", "only deaths", "only hospital beds"], answer: 1, explain: "incidence = 新发。" },
  { id: "q-en2", subject: "en", chapterId: "en-01", type: "single", stem: "“Prevalence” is closest in meaning to:", options: ["how many new cases appear", "how many cases exist at a time", "how deadly a disease is", "how far a beam travels"], answer: 1, explain: "prevalence = 现患。" },
  { id: "q-en3", subject: "en", chapterId: "en-02", type: "single", stem: "In reading, the first useful move is usually to:", options: ["translate every word", "read the questions and locate", "memorize the author's name", "skip the passage"], answer: 1, explain: "题干定位。" },
  { id: "q-en4", subject: "en", chapterId: "en-02", type: "single", stem: "An option with words like “always / never / completely” is often:", options: ["safer", "too absolute", "always correct", "a main-idea sentence"], answer: 1, explain: "绝对化是常见干扰。" },
  { id: "q-en5", subject: "en", chapterId: "en-01", type: "tf", stem: "背完100个单词但第二天全忘，仍然算有效备考。", options: ["对", "错"], answer: 1, explain: "必须进句子复现，并且不断档。" },
  { id: "q-en6", subject: "en", chapterId: "en-01", type: "single", stem: "“Bias” in epidemiology is closest to:", options: ["偏倚", "剂量", "靶区", "屏蔽"], answer: 0, explain: "bias = 偏倚。" },
  { id: "q-en7", subject: "en", chapterId: "en-01", type: "single", stem: "A cohort study usually follows people from:", options: ["outcome back to exposure", "exposure forward to outcome", "only one hospital bill", "a single CT slice"], answer: 1, explain: "队列从暴露跟到结局。" },
  { id: "q-en8", subject: "en", chapterId: "en-02", type: "single", stem: "Main-idea questions are best answered from:", options: ["one rare example only", "opening, ending and topic sentences", "your extra medical knowledge"], answer: 1, explain: "主旨看结构，不靠背景知识。" },
  { id: "q-en9", subject: "en", chapterId: "en-01", type: "single", stem: "“Surveillance” most nearly means:", options: ["一次体检", "持续监测", "只做手术"], answer: 1, explain: "surveillance = 监测。" },
  { id: "q-en10", subject: "en", chapterId: "en-01", type: "single", stem: "ALARA is a principle of:", options: ["radiation protection", "English grammar only", "hospital food"], answer: 0, explain: "防护优化原则。" },
  { id: "q-en11", subject: "en", chapterId: "en-02", type: "tf", stem: "细节题可以只凭印象选，不必回到原文。", options: ["对", "错"], answer: 1, explain: "必须能指回原文一句。" },
  { id: "q-en12", subject: "en", chapterId: "en-01", type: "single", stem: "Relative risk compares:", options: ["two incidence rates", "two hospital names", "two fonts"], answer: 0, explain: "RR比较两组发病率。" },

  { id: "q-pol7", subject: "pol", chapterId: "pol-01", type: "single", stem: "唯物辩证法认为事物发展的根本规律是：", options: ["能量守恒", "对立统一", "供需平衡", "随机抽样"], answer: 1, explain: "对立统一即矛盾规律。" },
  { id: "q-pol8", subject: "pol", chapterId: "pol-01", type: "tf", stem: "意识对物质没有任何能动作用。", options: ["对", "错"], answer: 1, explain: "物质决定意识，意识有能动作用。" },
  { id: "q-pol9", subject: "pol", chapterId: "pol-02", type: "single", stem: "改革开放被定位为：", options: ["可有可无的试验", "决定当代中国命运的关键一招", "只与外贸有关", "只属于史纲年表"], answer: 1, explain: "阶段定位要记准。" },
  { id: "q-pol10", subject: "pol", chapterId: "pol-03", type: "single", stem: "近代中国两大历史任务之一是：", options: ["普及直线加速器", "民族独立和人民解放", "取消一切公共卫生"], answer: 1, explain: "另一项是国家富强和人民富裕。" },
  { id: "q-pol11", subject: "pol", chapterId: "pol-04", type: "single", stem: "法治思维强调的不包括：", options: ["程序", "权利义务", "权力制约", "只讲服从不问依据"], answer: 3, explain: "法治不是单纯听话。" },
  { id: "q-pol12", subject: "pol", chapterId: "pol-05", type: "tf", stem: "因为焦虑，9月就应把政治当成每天第一科目。", options: ["对", "错"], answer: 1, explain: "当前第一是353，第二是英语。" },
  { id: 'q-pol-v33-01', subject: 'pol', chapterId: 'pol-01', type: 'single', stem: '哲学基本问题首先涉及思维和存在的关系，其中唯物主义坚持：', options: ['意识第一性','物质第一性','二者彼此无关','语言第一性'], answer: 1, explain: '唯物主义坚持物质第一性。' },
  { id: 'q-pol-v33-02', subject: 'pol', chapterId: 'pol-01', type: 'single', stem: '正确理解意识能动作用的是：', options: ['意识可以脱离实践直接改变物质','物质由意识创造','意识通过实践对客观世界产生能动作用','客观规律可以被意志取消'], answer: 2, explain: '意识作用必须通过实践，并受客观规律制约。' },
  { id: 'q-pol-v33-03', subject: 'pol', chapterId: 'pol-02', type: 'single', stem: '“把生态、产业、就业放在同一政策中统筹”更直接体现：', options: ['孤立观点','联系观点','否定一切差异','只看局部'], answer: 1, explain: '系统统筹体现联系观点。' },
  { id: 'q-pol-v33-04', subject: 'pol', chapterId: 'pol-02', type: 'single', stem: '下列关于发展的说法较准确的是：', options: ['任何变化都是发展','发展是前进上升的运动','发展没有曲折','发展只发生在经济领域'], answer: 1, explain: '发展强调前进、上升，新事物成长可能曲折。' },
  { id: 'q-pol-v33-05', subject: 'pol', chapterId: 'pol-03', type: 'single', stem: '多个矛盾同时存在时，对事物发展起支配作用的矛盾称为：', options: ['矛盾主要方面','主要矛盾','次要方面','外部矛盾'], answer: 1, explain: '主要矛盾是在多个矛盾中居支配地位。' },
  { id: 'q-pol-v33-06', subject: 'pol', chapterId: 'pol-03', type: 'single', stem: '“具体问题具体分析”主要依据矛盾的：', options: ['普遍性','同一性','特殊性','斗争性'], answer: 2, explain: '具体问题具体分析强调矛盾特殊性。' },
  { id: 'q-pol-v33-07', subject: 'pol', chapterId: 'pol-04', type: 'single', stem: '辩证否定的实质可概括为：', options: ['全盘抛弃','简单重复','扬弃','停止发展'], answer: 2, explain: '辩证否定既克服又保留，是扬弃。' },
  { id: 'q-pol-v33-08', subject: 'pol', chapterId: 'pol-04', type: 'single', stem: '量变和质变关系中正确的是：', options: ['量变与质变互不相关','量变是质变的必要准备','质变永远是坏事','质变后不再有量变'], answer: 1, explain: '量变积累为质变准备条件。' },
  { id: 'q-pol-v33-09', subject: 'pol', chapterId: 'pol-05', type: 'single', stem: '检验认识真理性的唯一标准是：', options: ['权威意见','实践','多数投票','书本知识'], answer: 1, explain: '实践是检验真理的唯一标准。' },
  { id: 'q-pol-v33-10', subject: 'pol', chapterId: 'pol-05', type: 'single', stem: '认识发展的正确基本路径是：', options: ['认识一次完成','实践—认识—再实践','先有纯理论再创造现实','只依赖感性经验'], answer: 1, explain: '认识在实践与认识的反复中深化。' },
  { id: 'q-pol-v33-11', subject: 'pol', chapterId: 'pol-06', type: 'single', stem: '唯物史观认为历史的创造者是：', options: ['少数英雄','人民群众','抽象观念','技术本身'], answer: 1, explain: '人民群众是历史的创造者。' },
  { id: 'q-pol-v33-12', subject: 'pol', chapterId: 'pol-06', type: 'single', stem: '生产力与生产关系的关系中，基础性作用首先来自：', options: ['生产关系决定生产力','生产力决定生产关系','二者毫无关系','上层建筑决定一切'], answer: 1, explain: '生产力决定生产关系，生产关系反作用于生产力。' },
  { id: 'q-pol-v33-13', subject: 'pol', chapterId: 'pol-07', type: 'single', stem: '商品价值量主要由什么决定？', options: ['个别劳动时间','社会必要劳动时间','商品使用寿命','市场广告投入'], answer: 1, explain: '价值量由社会必要劳动时间决定。' },
  { id: 'q-pol-v33-14', subject: 'pol', chapterId: 'pol-07', type: 'single', stem: '资本主义剩余价值形成的关键前提之一是：', options: ['劳动力成为商品','货币消失','商品没有价值','劳动生产率恒定'], answer: 0, explain: '劳动力成为商品是货币转化为资本的重要条件。' },
  { id: 'q-pol-v33-15', subject: 'pol', chapterId: 'pol-08', type: 'single', stem: '资本主义基本矛盾可概括为：', options: ['生产社会化与生产资料私人占有之间的矛盾','消费与储蓄之间的矛盾','城市与农村之间的唯一矛盾','技术与文化之间的矛盾'], answer: 0, explain: '这是资本主义基本矛盾的规范概括。' },
  { id: 'q-pol-v33-16', subject: 'pol', chapterId: 'pol-09', type: 'single', stem: '中国革命道路形成强调把马克思主义基本原理同什么结合？', options: ['抽象公式','中国具体实际','外国经验原样复制','个人意志'], answer: 1, explain: '核心是同中国具体实际相结合。' },
  { id: 'q-pol-v33-17', subject: 'pol', chapterId: 'pol-09', type: 'single', stem: '中国革命的重要法宝不包括：', options: ['统一战线','武装斗争','党的建设','闭关锁国'], answer: 3, explain: '统一战线、武装斗争、党的建设是重要法宝。' },
  { id: 'q-pol-v33-18', subject: 'pol', chapterId: 'pol-10', type: 'single', stem: '社会主义改造完成的重要历史意义之一是：', options: ['社会主义基本制度确立','所有发展问题彻底解决','改革开放立即开始','商品经济完全消失'], answer: 0, explain: '改造完成标志社会主义基本制度确立。' },
  { id: 'q-pol-v33-19', subject: 'pol', chapterId: 'pol-11', type: 'single', stem: '理解改革开放以来理论创新，较好的方法是：', options: ['脱离时代背景背句子','把实践问题与理论回答对应','认为各阶段完全无联系','只记人名'], answer: 1, explain: '理论创新要放回时代问题和实践探索。' },
  { id: 'q-pol-v33-20', subject: 'pol', chapterId: 'pol-12', type: 'single', stem: '新时代我国社会主要矛盾强调：', options: ['人民美好生活需要与不平衡不充分发展之间的矛盾','社会主义初级阶段已经结束','只剩经济总量不足','不存在发展问题'], answer: 0, explain: '这是新时代社会主要矛盾的规范表述。' },
  { id: 'q-pol-v33-21', subject: 'pol', chapterId: 'pol-12', type: 'single', stem: '社会主要矛盾发生变化意味着：', options: ['我国基本国情全部改变','社会主义初级阶段判断立即改变','发展任务和着力点需要相应调整','可以忽视发展质量'], answer: 2, explain: '要区分主要矛盾变化与基本国情判断。' },
  { id: 'q-pol-v33-22', subject: 'pol', chapterId: 'pol-13', type: 'single', stem: '新发展理念中强调解决发展动力问题的是：', options: ['创新','协调','绿色','共享'], answer: 0, explain: '创新注重解决发展动力问题。' },
  { id: 'q-pol-v33-23', subject: 'pol', chapterId: 'pol-13', type: 'single', stem: '“国内大循环为主体”正确理解是：', options: ['停止对外开放','国内国际双循环相互促进','拒绝国际合作','只发展消费'], answer: 1, explain: '新发展格局不是封闭循环。' },
  { id: 'q-pol-v33-24', subject: 'pol', chapterId: 'pol-14', type: 'single', stem: '把成熟改革经验转化为稳定规则，主要体现：', options: ['制度建设','否定改革','放弃治理','只靠个人经验'], answer: 0, explain: '制度建设能巩固改革成果并提升治理效能。' },
  { id: 'q-pol-v33-25', subject: 'pol', chapterId: 'pol-15', type: 'single', stem: '共同富裕更准确的理解是：', options: ['所有人收入完全相同','全体人民共同富裕且是长期过程','少数人先富后与他人无关','平均主义'], answer: 1, explain: '共同富裕不是整齐划一或平均主义。' },
  { id: 'q-pol-v33-26', subject: 'pol', chapterId: 'pol-15', type: 'single', stem: '以人民为中心的发展思想强调：', options: ['发展只看总量','发展为了人民、依靠人民、成果由人民共享','群众只是被动接受者','民生与发展无关'], answer: 1, explain: '人民既是主体也是成果享有者。' },
  { id: 'q-pol-v33-27', subject: 'pol', chapterId: 'pol-16', type: 'single', stem: '绿色发展更准确的是：', options: ['停止一切生产','转变发展方式并统筹发展和保护','只做末端污染治理','发展与保护必然冲突'], answer: 1, explain: '绿色发展要求发展方式转型和系统治理。' },
  { id: 'q-pol-v33-28', subject: 'pol', chapterId: 'pol-17', type: 'single', stem: '处理发展和安全关系较准确的是：', options: ['只要发展不要安全','只要安全停止发展','统筹发展和安全','风险必须降为零才能发展'], answer: 2, explain: '发展与安全相互支撑，需要统筹。' },
  { id: 'q-pol-v33-29', subject: 'pol', chapterId: 'pol-18', type: 'single', stem: '近代中国的重要历史任务可概括为：', options: ['民族独立人民解放与国家富强人民幸福','只发展工业','只学习西方制度','只解决文化问题'], answer: 0, explain: '两大历史任务贯穿近代中国历史。' },
  { id: 'q-pol-v33-30', subject: 'pol', chapterId: 'pol-19', type: 'single', stem: '评价辛亥革命较准确的是：', options: ['毫无意义','完成全部反帝反封建任务','推翻封建君主专制制度但未完成历史任务','建立社会主义制度'], answer: 2, explain: '既要看到历史意义，也要看到局限。' },
  { id: 'q-pol-v33-31', subject: 'pol', chapterId: 'pol-20', type: 'single', stem: '五四运动的重要影响包括：', options: ['阻止马克思主义传播','推动马克思主义传播并促进其同工人运动结合','结束所有革命任务','恢复君主制度'], answer: 1, explain: '五四运动为新的思想和组织条件发展提供推动。' },
  { id: 'q-pol-v33-32', subject: 'pol', chapterId: 'pol-21', type: 'single', stem: '分析抗战时期政策变化，首先应关注：', options: ['主要矛盾和中心任务变化','个人喜好','孤立年份','与历史条件无关'], answer: 0, explain: '史纲阶段题先定主要矛盾和中心任务。' },
  { id: 'q-pol-v33-33', subject: 'pol', chapterId: 'pol-22', type: 'single', stem: '对改革开放前后两个历史时期的正确态度是：', options: ['彼此割裂相互否定','放在具体历史条件中联系理解','只肯定一个时期','无需分析实践条件'], answer: 1, explain: '历史评价要坚持具体历史分析。' },
  { id: 'q-pol-v33-34', subject: 'pol', chapterId: 'pol-23', type: 'single', stem: '人生观中回答“人为什么活着”的核心内容更接近：', options: ['人生目的','人生态度','消费水平','职业名称'], answer: 0, explain: '人生目的回答人生实践的根本指向。' },
  { id: 'q-pol-v33-35', subject: 'pol', chapterId: 'pol-24', type: 'single', stem: '医生在诊疗中遵守职业规范，首先属于：', options: ['社会公德','职业道德','家庭美德','网络道德'], answer: 1, explain: '具体职业活动首先对应职业道德。' },
  { id: 'q-pol-v33-36', subject: 'pol', chapterId: 'pol-25', type: 'single', stem: '法治思维强调的不包括：', options: ['程序','权利义务','权力制约','任何命令都无条件服从'], answer: 3, explain: '法治强调依据、程序、权利义务与权力约束。' },
  { id: 'q-pol-v33-37', subject: 'pol', chapterId: 'pol-25', type: 'single', stem: '关于权利和义务，正确的是：', options: ['只有权利没有义务','权利义务相统一','义务没有法律依据','权利没有边界'], answer: 1, explain: '权利与义务相统一。' },
  { id: 'q-pol-v33-38', subject: 'pol', chapterId: 'pol-26', type: 'single', stem: '多选题更稳妥的做法是：', options: ['凭整体感觉一次勾完','逐项判断并给每个入选项找依据','看到熟悉表述就全选','只看选项不看题干'], answer: 1, explain: '多选要逐项证据式判断。' },
  { id: 'q-pol-v33-39', subject: 'pol', chapterId: 'pol-26', type: 'single', stem: '一个选项表述本身正确，但与题干所问无关，应当：', options: ['选上','不选','随机决定','多选时一定选'], answer: 1, explain: '政治选择题要回答题干，而非挑正确句子。' },
  { id: 'q-pol-v33-40', subject: 'pol', chapterId: 'pol-27', type: 'single', stem: '分析题较完整的一点通常应包含：', options: ['只抄材料','只写原理名词','原理+材料分析+结论/意义','只写个人感想'], answer: 2, explain: '分析题要把规范理论与材料结合。' },
  { id: 'q-pol-v33-41', subject: 'pol', chapterId: 'pol-28', type: 'single', stem: '关于2027时政复习，当前最合理的是：', options: ['提前编造全年必考事件','完全不更新','先抓教材主线，后续按权威年度信息更新','每天追所有新闻'], answer: 2, explain: '时政是动态模块，必须后续校准。' },
  { id: 'q-pol-v33-42', subject: 'pol', chapterId: 'pol-29', type: 'single', stem: '政治60+训练准备度最不应该只看：', options: ['章节掌握','选择题表现','分析题输出','背了多少页材料'], answer: 3, explain: '背诵页数不能替代客观题、输出和真题验证。' },
// V34 政治多选专项（原创训练题，不标称历年真题）
  { id: 'q-pol-v34-01', subject: 'pol', chapterId: 'pol-01', type: 'multi', stem: '关于物质和意识关系，正确的有：', options: ['物质决定意识', '意识具有能动作用', '意识可脱离物质独立存在', '意识能动作用要通过实践实现'], answer: [0, 1, 3], explain: '物质第一性；意识有能动作用，但不能脱离物质和实践。' },
  { id: 'q-pol-v34-02', subject: 'pol', chapterId: 'pol-02', type: 'multi', stem: '唯物辩证法关于联系的观点包括：', options: ['联系具有客观性', '联系具有普遍性', '任何两个事物都存在直接联系', '要从事物固有联系把握事物'], answer: [0, 1, 3], explain: '联系普遍且客观，但不能把普遍联系曲解为任意直接联系。' },
  { id: 'q-pol-v34-03', subject: 'pol', chapterId: 'pol-03', type: 'multi', stem: '关于矛盾普遍性和特殊性，正确的有：', options: ['二者相互联结', '普遍性寓于特殊性之中', '特殊性中包含普遍性', '二者在任何条件下都固定不变'], answer: [0, 1, 2], explain: '共性寓于个性并通过个性表现；二者关系可随条件转化。' },
  { id: 'q-pol-v34-04', subject: 'pol', chapterId: 'pol-03', type: 'multi', stem: '处理复杂问题时，关于主要矛盾和矛盾主要方面，正确的有：', options: ['多个矛盾中要抓主要矛盾', '一个矛盾内部要抓主要方面', '二者是同一个概念', '坚持两点论与重点论统一'], answer: [0, 1, 3], explain: '先分清“多个矛盾”与“一个矛盾内部两方面”。' },
  { id: 'q-pol-v34-05', subject: 'pol', chapterId: 'pol-04', type: 'multi', stem: '关于量变和质变，正确的有：', options: ['量变是质变的必要准备', '质变是量变的必然结果', '质变为新的量变开辟道路', '任何量变都会立即引起质变'], answer: [0, 1, 2], explain: '量变积累达到一定程度才发生质变。' },
  { id: 'q-pol-v34-06', subject: 'pol', chapterId: 'pol-05', type: 'multi', stem: '实践在认识中的作用包括：', options: ['认识的来源', '认识发展的动力', '检验真理的标准', '认识的目的'], answer: [0, 1, 2, 3], explain: '实践是认识的基础，贯穿来源、动力、检验和目的。' },
  { id: 'q-pol-v34-07', subject: 'pol', chapterId: 'pol-05', type: 'multi', stem: '关于真理，正确的有：', options: ['真理具有客观性', '真理既有绝对性又有相对性', '真理和谬误在一定条件下可以相互转化', '真理是否成立取决于多数人赞成'], answer: [0, 1, 2], explain: '真理内容客观，不以人数表决决定。' },
  { id: 'q-pol-v34-08', subject: 'pol', chapterId: 'pol-06', type: 'multi', stem: '人民群众是历史创造者，主要体现在：', options: ['社会物质财富的创造者', '社会精神财富的创造者', '社会变革的决定力量', '每个个人都能任意决定历史方向'], answer: [0, 1, 2], explain: '群众创造历史不等于个人意志可以任意决定历史。' },
  { id: 'q-pol-v34-09', subject: 'pol', chapterId: 'pol-07', type: 'multi', stem: '商品二因素与劳动二重性的关系，正确的有：', options: ['使用价值和价值构成商品二因素', '具体劳动创造使用价值', '抽象劳动形成价值', '私人劳动直接等于社会劳动'], answer: [0, 1, 2], explain: '商品经济中私人劳动要经交换实现其社会性。' },
  { id: 'q-pol-v34-10', subject: 'pol', chapterId: 'pol-07', type: 'multi', stem: '关于剩余价值，正确的有：', options: ['由雇佣工人的剩余劳动创造', '体现资本主义生产关系', '劳动力成为商品是货币转化为资本的重要条件', '由机器独立创造'], answer: [0, 1, 2], explain: '机器转移价值，不独立创造剩余价值。' },
  { id: 'q-pol-v34-11', subject: 'pol', chapterId: 'pol-08', type: 'multi', stem: '科学社会主义基本立场中，正确的有：', options: ['资本主义基本矛盾推动其历史发展', '社会主义代替资本主义是长期历史过程', '社会形态更替不取决于个人愿望', '历史趋势意味着过程没有曲折'], answer: [0, 1, 2], explain: '历史趋势具有客观性，但实现过程可能长期曲折。' },
  { id: 'q-pol-v34-12', subject: 'pol', chapterId: 'pol-09', type: 'multi', stem: '新民主主义革命的重要法宝包括：', options: ['统一战线', '武装斗争', '党的建设', '闭关锁国'], answer: [0, 1, 2], explain: '三大法宝：统一战线、武装斗争、党的建设。' },
  { id: 'q-pol-v34-13', subject: 'pol', chapterId: 'pol-09', type: 'multi', stem: '理解中国革命道路需要把握：', options: ['中国具体国情', '主要矛盾和革命任务', '马克思主义基本原理同中国具体实际结合', '照搬外国革命模式'], answer: [0, 1, 2], explain: '关键是基本原理与中国具体实际结合。' },
  { id: 'q-pol-v34-14', subject: 'pol', chapterId: 'pol-10', type: 'multi', stem: '社会主义改造完成后，正确认识包括：', options: ['社会主义基本制度确立', '进入社会主义初级阶段', '仍需探索适合中国国情的建设道路', '所有社会矛盾从此消失'], answer: [0, 1, 2], explain: '制度确立不意味着发展问题和社会矛盾消失。' },
  { id: 'q-pol-v34-15', subject: 'pol', chapterId: 'pol-11', type: 'multi', stem: '中国特色社会主义理论发展应当：', options: ['联系改革开放实践理解', '把理论回答与时代问题对应', '看到理论创新的连续发展', '把各阶段理论完全割裂'], answer: [0, 1, 2], explain: '理论创新既有阶段重点，也有一脉相承和与时俱进。' },
  { id: 'q-pol-v34-16', subject: 'pol', chapterId: 'pol-12', type: 'multi', stem: '新时代社会主要矛盾变化说明：', options: ['人民需要呈现更广泛内容', '发展不平衡不充分成为突出制约', '我国仍处于社会主义初级阶段', '我国基本国情已经根本改变'], answer: [0, 1, 2], explain: '主要矛盾变化不改变社会主义初级阶段这一基本国情判断。' },
  { id: 'q-pol-v34-17', subject: 'pol', chapterId: 'pol-13', type: 'multi', stem: '新发展理念包括：', options: ['创新', '协调', '绿色', '开放', '共享'], answer: [0, 1, 2, 3, 4], explain: '五大发展理念要整体把握。' },
  { id: 'q-pol-v34-18', subject: 'pol', chapterId: 'pol-13', type: 'multi', stem: '高质量发展强调：', options: ['发展质量和效益', '创新驱动', '结构优化', '只追求速度和总量'], answer: [0, 1, 2], explain: '高质量发展不是单纯速度竞赛。' },
  { id: 'q-pol-v34-19', subject: 'pol', chapterId: 'pol-14', type: 'multi', stem: '全面深化改革与制度建设的关系，正确的有：', options: ['改革推动制度完善', '制度建设可以巩固改革成果', '治理效能与制度执行相关', '改革就是取消所有既有制度'], answer: [0, 1, 2], explain: '改革是完善和发展制度，不是无原则取消制度。' },
  { id: 'q-pol-v34-20', subject: 'pol', chapterId: 'pol-15', type: 'multi', stem: '以人民为中心的发展思想体现：', options: ['发展为了人民', '发展依靠人民', '发展成果由人民共享', '只看少数群体收益'], answer: [0, 1, 2], explain: '人民是发展主体也是成果享有者。' },
  { id: 'q-pol-v34-21', subject: 'pol', chapterId: 'pol-15', type: 'multi', stem: '关于共同富裕，正确的有：', options: ['面向全体人民', '是长期历史过程', '不是平均主义', '要求所有人同一时间达到完全相同收入'], answer: [0, 1, 2], explain: '共同富裕不等于同步、同等或平均主义。' },
  { id: 'q-pol-v34-22', subject: 'pol', chapterId: 'pol-16', type: 'multi', stem: '生态文明建设强调：', options: ['尊重自然', '顺应自然', '保护自然', '以牺牲生态换取任何速度的发展'], answer: [0, 1, 2], explain: '发展和保护要统筹，不能以破坏生态为代价。' },
  { id: 'q-pol-v34-23', subject: 'pol', chapterId: 'pol-17', type: 'multi', stem: '统筹发展和安全意味着：', options: ['发展是安全的基础和目的之一', '安全是发展的条件和保障', '增强风险意识和底线思维', '为了绝对安全停止一切发展'], answer: [0, 1, 2], explain: '发展和安全要动态平衡，不追求脱离现实的“零风险”。' },
  { id: 'q-pol-v34-24', subject: 'pol', chapterId: 'pol-18', type: 'multi', stem: '近代中国面临的两大历史任务包括：', options: ['争取民族独立和人民解放', '实现国家富强和人民幸福', '恢复封建君主专制', '拒绝现代化'], answer: [0, 1], explain: '两大任务要成对记忆。' },
  { id: 'q-pol-v34-25', subject: 'pol', chapterId: 'pol-19', type: 'multi', stem: '评价近代早期救国探索应注意：', options: ['放在具体历史条件中评价', '既看进步意义也看历史局限', '分析失败的社会和阶级原因', '只用今天条件简单苛责前人'], answer: [0, 1, 2], explain: '史纲评价题强调历史条件、贡献和局限。' },
  { id: 'q-pol-v34-26', subject: 'pol', chapterId: 'pol-20', type: 'multi', stem: '五四运动的重要意义包括：', options: ['促进马克思主义传播', '促进马克思主义同中国工人运动结合', '为中国共产党成立作思想和干部准备', '完成了中国所有革命任务'], answer: [0, 1, 2], explain: '五四运动具有重要转折意义，但没有完成全部革命任务。' },
  { id: 'q-pol-v34-27', subject: 'pol', chapterId: 'pol-21', type: 'multi', stem: '分析抗日战争时期政策，需要关注：', options: ['民族矛盾上升', '抗日民族统一战线', '不同阶段主要任务', '把所有时期政策机械等同'], answer: [0, 1, 2], explain: '史纲阶段题先判断主要矛盾、任务和统一战线。' },
  { id: 'q-pol-v34-28', subject: 'pol', chapterId: 'pol-22', type: 'multi', stem: '理解新中国成立后的历史发展，正确方法有：', options: ['区分不同历史阶段', '联系主要任务变化', '既看成就也分析曲折', '把改革开放前后完全割裂'], answer: [0, 1, 2], explain: '坚持具体历史分析和前后历史时期相互联系。' },
  { id: 'q-pol-v34-29', subject: 'pol', chapterId: 'pol-23', type: 'multi', stem: '关于理想信念和人生价值，正确的有：', options: ['理想具有实践指向', '个人价值与社会价值相联系', '人生目的影响人生道路选择', '理想只是一种与现实无关的幻想'], answer: [0, 1, 2], explain: '理想来源于现实又超越现实，并需通过实践实现。' },
  { id: 'q-pol-v34-30', subject: 'pol', chapterId: 'pol-24', type: 'multi', stem: '社会主义道德建设中，正确的有：', options: ['社会公德规范公共生活', '职业道德规范职业活动', '家庭美德规范家庭生活', '网络空间不需要道德规范'], answer: [0, 1, 2], explain: '不同生活领域有相应道德要求，网络空间也不例外。' },
  { id: 'q-pol-v34-31', subject: 'pol', chapterId: 'pol-25', type: 'multi', stem: '法治思维通常强调：', options: ['法律至上', '权力制约', '公平正义', '权利保障', '正当程序'], answer: [0, 1, 2, 3, 4], explain: '法治思维要从依据、权力、权利、公平和程序整体把握。' },
  { id: 'q-pol-v34-32', subject: 'pol', chapterId: 'pol-25', type: 'multi', stem: '关于权利与义务，正确的有：', options: ['相互依存', '相互促进', '具有一致性', '权利可以完全脱离义务'], answer: [0, 1, 2], explain: '权利与义务统一，不能只讲一面。' },
  { id: 'q-pol-v34-33', subject: 'pol', chapterId: 'pol-26', type: 'multi', stem: '政治多选题逐项判断时，应警惕：', options: ['绝对化词语', '偷换概念', '范围扩大或缩小', '题干问原因却选择结果'], answer: [0, 1, 2, 3], explain: '这些都是高频干扰项机制。' },
  { id: 'q-pol-v34-34', subject: 'pol', chapterId: 'pol-26', type: 'multi', stem: '做多选题更稳妥的步骤包括：', options: ['圈题干限定词', '确定考点', '逐项找依据', '因为选项眼熟就直接勾选'], answer: [0, 1, 2], explain: '多选题要证据式入选，眼熟不能代替判断。' },
  { id: 'q-pol-v34-35', subject: 'pol', chapterId: 'pol-26', type: 'multi', stem: '遇到“正确但不相关”的选项时，应当：', options: ['回到题干所问', '检查范围和对象是否一致', '不因表述本身正确就入选', '多选题尽量多选'], answer: [0, 1, 2], explain: '选项必须同时满足“本身正确”和“回答题干”。' },
  { id: 'q-pol-v34-36', subject: 'pol', chapterId: 'pol-26', type: 'multi', stem: '下列属于多选题高危信号的有：', options: ['唯一、完全、任何条件下等绝对词', '把必要条件说成充分条件', '把阶段性结论扩大到所有时期', '把相关关系直接说成因果'], answer: [0, 1, 2, 3], explain: '绝对化、条件偷换、阶段错位和因果过推都是常见陷阱。' },
  { id: 'q-pol-v34-37', subject: 'pol', chapterId: 'pol-27', type: 'multi', stem: '政治分析题一个完整得分点通常需要：', options: ['明确原理或规范表述', '结合材料关键词分析', '回答题目要求的结论或意义', '只抄材料不解释'], answer: [0, 1, 2], explain: '原理、材料和结论要形成闭环。' },
  { id: 'q-pol-v34-38', subject: 'pol', chapterId: 'pol-27', type: 'multi', stem: '分析题审题时应先识别：', options: ['题目限定学科/原理范围', '材料中的核心矛盾或关键词', '问的是原因、意义还是措施', '背过哪个模板最长'], answer: [0, 1, 2], explain: '先识别任务，再调取知识，不以模板长度决定答案。' },
  { id: 'q-pol-v34-39', subject: 'pol', chapterId: 'pol-28', type: 'multi', stem: '年度时政复习更合理的做法包括：', options: ['以后按权威信息更新', '把事件放回教材主线理解', '关注重大会议和重要政策表述', '现在提前编造2027全年必考事件'], answer: [0, 1, 2], explain: '时政必须动态校准，不能预测式造题。' },
  { id: 'q-pol-v34-40', subject: 'pol', chapterId: 'pol-29', type: 'multi', stem: '政治60+训练体系应同时包含：', options: ['基础知识框架', '选择题尤其多选', '分析题输出', '年度时政与真题校准'], answer: [0, 1, 2, 3], explain: '60+不是只背材料，四个部分缺一不可。' },

];

window.ENGLISH_WORDS = [
  ["incidence", "发病率；发生", "The incidence of the disease rose last year."],
  ["prevalence", "患病率；流行程度", "Prevalence depends on both incidence and duration."],
  ["mortality", "死亡率", "Mortality declined after the new policy."],
  ["morbidity", "发病率/患病情况", "The report compared morbidity across cities."],
  ["exposure", "暴露", "They compared exposure history between groups."],
  ["outcome", "结局", "The primary outcome was 30-day survival."],
  ["cohort", "队列", "The cohort was followed for ten years."],
  ["bias", "偏倚", "Selection bias can distort the association."],
  ["confounder", "混杂因素", "Age may be a confounder in this study."],
  ["randomize", "随机化", "Patients were randomized to two arms."],
  ["placebo", "安慰剂", "The control group received a placebo."],
  ["blind", "盲法的", "The trial was double-blind."],
  ["sensitivity", "灵敏度", "High sensitivity means fewer missed cases."],
  ["specificity", "特异度", "High specificity means fewer false positives."],
  ["screening", "筛查", "Screening aims to find disease earlier."],
  ["prevention", "预防", "Primary prevention happens before disease starts."],
  ["outbreak", "暴发", "An outbreak investigation started immediately."],
  ["surveillance", "监测", "Surveillance data triggered the warning."],
  ["intervention", "干预", "The intervention reduced smoking rates."],
  ["evidence", "证据", "Decisions should be based on the best evidence."],
  ["estimate", "估计", "The study estimated the relative risk."],
  ["significant", "显著的", "The difference was statistically significant."],
  ["interval", "区间", "The 95% confidence interval excluded one."],
  ["variable", "变量", "Outcome variables must be defined first."],
  ["sample", "样本", "A larger sample often gives a narrower interval."],
  ["population", "总体；人群", "Findings should be generalized to the target population carefully."],
  ["dose", "剂量", "The prescribed dose was 60 Gy."],
  ["beam", "射束", "The treatment used several beams."],
  ["target", "靶区", "The high-dose region should cover the target."],
  ["organ", "器官", "Organs at risk need dose constraints."],
  ["image", "影像；成像", "Image guidance confirmed the position."],
  ["accuracy", "准确性", "Setup accuracy affects dose delivery."],
  ["shield", "屏蔽", "Shielding reduces unnecessary exposure."],
  ["radiation", "辐射", "Radiation protection follows ALARA."],
  ["proton", "质子", "Proton therapy uses the Bragg peak."],
  ["isotope", "同位素", "The tracer is a radioactive isotope."],
  ["detect", "探测；发现", "PET detects pairs of photons."],
  ["calibrate", "校准", "The chamber must be calibrated."],
  ["quality", "质量", "Quality assurance is done every day."],
  ["deliver", "实施；给予", "The machine delivered the planned dose."],
  ["associate", "关联", "Smoking is associated with higher risk."],
  ["causal", "因果的", "Association is not necessarily causal."],
  ["risk", "风险", "Relative risk compares two incidence rates."],
  ["ratio", "比", "Odds ratio is common in case-control studies."],
  ["control", "对照；控制", "A proper control group is essential."],
  ["trial", "试验", "A randomized trial can test an intervention."],
  ["ethics", "伦理", "Human trials require ethics approval."],
  ["policy", "政策", "Health policy should consider equity."],
  ["equity", "公平", "Equity is not the same as equality."],
  ["promote", "促进", "The campaign promotes healthy behavior."],
  ["behavior", "行为", "Behavior change needs a supportive environment."],
  ["burden", "负担", "Disease burden includes death and disability."],
  ["chronic", "慢性的", "Chronic diseases need long-term management."],
  ["acute", "急性的", "Acute exposure may cause different effects."],
  ["therapy", "治疗", "Radiation therapy requires precise planning."],
  ["plan", "计划", "The treatment plan was reviewed by a physicist."],
  ["verify", "验证", "Physicists verify the plan before treatment."],
  ["position", "体位；位置", "Daily imaging checks patient position."],
  ["error", "误差；错误", "A small geometric error can matter in IMRT."],
  ["peak", "峰", "The Bragg peak is a key physical feature."],
];

window.ENGLISH_PASSAGES = [
  {
    id: "pass-1",
    title: "短文1｜发病与患病",
    text: "Incidence counts new cases over a period. Prevalence counts existing cases at a time. A disease that lasts many years can have a high prevalence even if its incidence is not very high.",
    qs: [
      { q: "Incidence mainly counts:", opts: ["new cases", "old hospitals", "only deaths"], a: 0 },
      { q: "A long duration may raise:", opts: ["only beam energy", "prevalence", "the Bragg peak"], a: 1 },
    ],
  },
  {
    id: "pass-2",
    title: "短文2｜相关不是因果",
    text: "Two variables may move together. That association can come from a real cause, from chance, or from a confounder. Researchers therefore ask whether changing the exposure would change the outcome.",
    qs: [
      { q: "Moving together always means cause?", opts: ["Yes", "No"], a: 1 },
      { q: "A third factor that distorts the link is a:", opts: ["confounder", "proton", "placebo only"], a: 0 },
    ],
  },
  {
    id: "pass-3",
    title: "短文3｜筛查",
    text: "A sensitive test finds most people who truly have the disease. A specific test correctly clears most people who do not. Predictive values, however, also depend on how common the disease is in the tested group.",
    qs: [
      { q: "Sensitivity is about people who:", opts: ["are truly diseased", "are machines"], a: 0 },
      { q: "Predictive values also depend on:", opts: ["how common the disease is", "only the hospital name"], a: 0 },
    ],
  },
  {
    id: "pass-4",
    title: "短文4｜IMRT与IGRT",
    text: "IMRT shapes the dose. IGRT checks where the patient and the target are. When the dose falls steeply, a small setup error can miss the target or over-dose a normal organ. That is why the two methods are often used together.",
    qs: [
      { q: "IMRT mainly shapes the:", opts: ["dose", "waiting room"], a: 0 },
      { q: "IGRT mainly checks:", opts: ["price", "position"], a: 1 },
    ],
  },
  {
    id: "pass-5",
    title: "短文5｜质子",
    text: "Protons can deposit much of their energy near the end of their range, forming a Bragg peak. This may spare some normal tissue beyond the target. Still, range uncertainty means proton therapy is not automatically better in every case.",
    qs: [
      { q: "The Bragg peak appears near the:", opts: ["end of the range", "hospital gate"], a: 0 },
      { q: "Proton therapy is always better?", opts: ["Yes", "No"], a: 1 },
    ],
  },
  {
    id: "pass-6",
    title: "短文6｜应急",
    text: "An outbreak response starts with confirmation and case definitions. Investigators then describe time, place and person, test hypotheses, and act on the three links: source, route and susceptible people. Communication must tell the public what to do.",
    qs: [
      { q: "The first step is usually to:", opts: ["confirm the outbreak", "buy a linac"], a: 0 },
      { q: "Control follows:", opts: ["source, route, susceptible people", "only slogans"], a: 0 },
    ],
  },
  {
    id: "pass-7",
    title: "短文7｜随机对照",
    text: "In a randomized trial, researchers assign the intervention. Randomization makes groups more comparable. Blinding can reduce biased measurement. The aim is not to make results random, but to make the comparison fair.",
    qs: [
      { q: "Randomization makes groups more:", opts: ["comparable", "wealthy"], a: 0 },
      { q: "The aim of randomization is to make results random.", opts: ["True", "False"], a: 1 },
    ],
  },
  {
    id: "pass-8",
    title: "短文8｜QA",
    text: "A treatment plan can look perfect on the screen. Quality assurance still asks whether the machine, the geometry and the delivery match the plan. Safe radiotherapy needs a correct plan, a correct machine, a correct setup and a correct delivery.",
    qs: [
      { q: "A pretty plan is enough?", opts: ["Yes", "No"], a: 1 },
      { q: "QA checks whether delivery matches the:", opts: ["plan", "advertisement"], a: 0 },
    ],
  },

  { id: "q-v13-m05-1", subject: "mp", chapterId: "mp-05", type: "single", stem: "关于高能电子束深度剂量特征，正确的是：", options: ["超过有效射程后剂量必为0", "通常具有有限治疗深度并在远端快速下降", "能量越高射程越短", "与兆伏X射线完全相同"], answer: 1, explain: "电子束具有有限有效治疗深度，远端快速下降，但仍可有少量污染尾。" },
  { id: "q-v13-m05-2", subject: "mp", chapterId: "mp-05", type: "single", stem: "若只作量级估算，12 MeV电子束在水中的实用射程Rp大约是：", options: ["0.6 cm", "2 cm", "6 cm", "24 cm"], answer: 2, explain: "经验近似Rp(cm)≈E(MeV)/2，因此约6 cm。" },
  { id: "q-v13-m05-3", subject: "mp", chapterId: "mp-05", type: "short", stem: "为什么不能只凭电子束能量和一个射程公式决定临床覆盖？", answer: "电子存在明显侧向散射，射野大小、斜入射、体表轮廓、空气间隙和组织不均匀都会改变实际剂量分布；临床还需结合计划和测量/计算。", explain: "考察从经验公式到真实剂量分布的区别。" },
  { id: "q-v13-m06-1", subject: "mp", chapterId: "mp-06", type: "single", stem: "理想点源近似下，其他条件不变，距离从1 cm增加到2 cm，几何强度约变为：", options: ["2倍", "1/2", "1/4", "1/8"], answer: 2, explain: "平方反比：I∝1/r²。" },
  { id: "q-v13-m06-2", subject: "mp", chapterId: "mp-06", type: "single", stem: "后装治疗最准确的描述是：", options: ["先把活性源手工长期留在病人体内", "先放施源器，再由设备按计划控制源的驻留位置和时间", "只用于外照射", "不需要影像和计划"], answer: 1, explain: "现代后装把施源器放置与活性源递送分开。" },
  { id: "q-v13-m06-3", subject: "mp", chapterId: "mp-06", type: "short", stem: "为什么近距离治疗对源位置误差特别敏感？", answer: "源附近剂量梯度很陡，剂量随距离快速变化，因此较小的源位置或施源器重建偏差也可能造成局部明显剂量偏差。", explain: "核心是距离敏感性。" },
  { id: "q-v13-m07-1", subject: "mp", chapterId: "mp-07", type: "single", stem: "IMRT逆向计划的核心思路是：", options: ["先设定靶区目标和OAR约束，再优化可实施参数", "先治疗再计算剂量", "取消所有危及器官约束", "只改变总MU不改变空间分布"], answer: 0, explain: "逆向计划从临床目标/约束出发进行优化。" },
  { id: "q-v13-m07-2", subject: "mp", chapterId: "mp-07", type: "tf", stem: "IMRT计划在TPS优化完成后即可直接治疗，不再需要任何验证。", options: ["对", "错"], answer: 1, explain: "复杂调强计划通常需要相应计划检查和患者特异QA。" },
  { id: "q-v13-m07-3", subject: "mp", chapterId: "mp-07", type: "short", stem: "用一句话分别说明IMRT、IGRT、VMAT。", answer: "IMRT通过空间强度调制塑造剂量；IGRT用治疗前/中影像确认并校正几何位置；VMAT是在机架旋转过程中进行动态调制的一类调强递送技术。", explain: "三者不要混淆。" },
  { id: "q-v13-m08-1", subject: "mp", chapterId: "mp-08", type: "single", stem: "下列最符合IGRT完整流程的是：", options: ["拍片→结束", "摆位→影像→配准→判断→校正→必要时复核→治疗", "优化→MLC运动→治疗", "只做计划CT"], answer: 1, explain: "影像必须进入位置判断与校正闭环。" },
  { id: "q-v13-m08-2", subject: "mp", chapterId: "mp-08", type: "single", stem: "患者呼吸导致一次照射过程中肿瘤移动，属于：", options: ["分次间变化", "分次内变化", "源衰变", "剂量校准"], answer: 1, explain: "同一次治疗过程中的变化属于intrafraction。" },
  { id: "q-v13-m08-3", subject: "mp", chapterId: "mp-08", type: "short", stem: "为什么IGRT不能简单理解为‘拍一张CBCT’？", answer: "IGRT要求将影像与参考影像配准，判断偏差，并将结果用于校正或治疗决策；只有获取影像而不处理偏差并未形成图像引导闭环。", explain: "核心在影像参与决策。" },

  { id: "q-p11", subject: "ph", chapterId: "ph-02", type: "single", stem: "某病患者100人中死亡5人，这个5%首先表示：", options: ["该病发病率", "该病病死率", "人群死亡率", "患病率"], answer: 1, explain: "分母是该病患者，因此是病死率。" },
  { id: "q-p12", subject: "ph", chapterId: "ph-02", type: "short", stem: "为什么年龄结构不同的两个地区不宜只比较粗死亡率？", answer: "年龄是死亡的重要影响因素，年龄结构差异会造成混杂；应采用年龄别率、标化率或其他合适指标提高可比性。", explain: "核心词：年龄结构、混杂、标化。" },
  { id: "q-p13", subject: "ph", chapterId: "ph-03", type: "single", stem: "高血压患者规范治疗以预防脑卒中并发症，更接近：", options: ["一级预防", "二级预防", "三级预防", "筛查"], answer: 2, explain: "疾病已经存在，目标是减少并发症和损害。" },
  { id: "q-p14", subject: "ph", chapterId: "ph-03", type: "short", stem: "以宫颈癌为例，各写一项一级、二级、三级预防措施。", answer: "一级如HPV疫苗/危险因素控制；二级如适龄筛查并对异常结果进一步诊断；三级如对确诊患者规范治疗、康复和并发症管理。", explain: "按疾病时间线组织答案。" },
  { id: "q-p15", subject: "ph", chapterId: "ph-04", type: "single", stem: "评价一项基层筛查政策，只发现单次检查成本较低，最合理的结论是：", options: ["政策一定值得推广", "还需结合健康效果、覆盖可及性、公平和实施成本评价", "成本低就代表公平", "无需评价假阳性"], answer: 1, explain: "卫生政策和经济评价不能只看单项成本。" },
  { id: "q-p16", subject: "ph", chapterId: "ph-05", type: "short", stem: "某社区肥胖率持续上升，请用六步框架写出干预思路。", answer: "明确目标人群与肥胖问题→分析饮食、运动和环境等危险因素→制定个体/社区/政策干预→配置人员与资源→实施→用体重、行为、覆盖率等指标监测评价并迭代。", explain: "人群—危险因素—干预—资源—实施—评价。" },
  { id: "q-p17", subject: "ph", chapterId: "ph-06", type: "single", stem: "发现学校聚集性呕吐病例后，最不恰当的做法是：", options: ["核实病例并报告", "开展流行病学调查", "根据风险采取控制措施", "在原因未明前对外宣称已确定唯一病因"], answer: 3, explain: "风险沟通要准确透明，也要说明不确定性。" },
  { id: "q-p18", subject: "ph", chapterId: "ph-06", type: "short", stem: "突发传染病事件现场处置可从哪三个传播环节组织措施？", answer: "控制传染源、切断传播途径、保护易感人群；同时配合监测、流调、检测和风险沟通。", explain: "三环节是经典防控框架，但不要漏掉应急管理闭环。" },
  { id: "q-p19", subject: "ph", chapterId: "ph-07", type: "single", stem: "下列最能体现“健康促进”而不仅是健康教育的是：", options: ["发一篇控烟科普", "讲一次吸烟危害课程", "科普同时建设无烟环境并实施控烟政策", "让居民背吸烟危害"], answer: 2, explain: "健康促进还改变环境、政策和社会支持条件。" },
  { id: "q-p20", subject: "ph", chapterId: "ph-08", type: "short", stem: "评价一项公共卫生政策，至少写出五个评价维度。", answer: "目标达成、覆盖/可及性、健康效果、成本/效率、公平、实施可行性、潜在副作用等，任写五个并结合情境解释。", explain: "先框架后展开。" },

,
  // V19｜353第二阶段：跨章节综合与计算训练
  { id: "q-v19-mix-01", subject: "epi", chapterId: "epi-05", type: "single", stem: "某病例对照研究发现暴露与疾病OR=2.4，但暴露组年龄明显更大。下一步最需要考虑：", options: ["年龄可能是混杂因素，应分层或多变量调整", "OR大于1即可证明因果", "把病例改成队列即可自动消除偏倚", "只增加样本量即可"], answer: 0, explain: "先识别混杂：年龄同时与暴露和结局相关时，应控制后再判断关联。" },
  { id: "q-v19-mix-02", subject: "epi", chapterId: "epi-06", type: "calc", stem: "队列研究中暴露组200人发生40例，非暴露组300人发生30例。RR约为：", options: ["0.5", "1.0", "2.0", "4.0"], answer: 2, explain: "Ie=40/200=0.20，I0=30/300=0.10，RR=2.0。" },
  { id: "q-v19-mix-03", subject: "epi", chapterId: "epi-06", type: "calc", stem: "承接上题，暴露组归因危险度AR为：", options: ["5%", "10%", "20%", "30%"], answer: 1, explain: "AR=Ie−I0=20%−10%=10%。" },
  { id: "q-v19-mix-04", subject: "epi", chapterId: "epi-08", type: "calc", stem: "筛检1000人，患病率10%，灵敏度90%，特异度80%。阳性预测值PPV约为：", options: ["33.3%", "50%", "80%", "90%"], answer: 0, explain: "患病100：TP=90；无病900：FP=180；PPV=90/(90+180)=33.3%。" },
  { id: "q-v19-mix-05", subject: "stats", chapterId: "st-05", type: "single", stem: "某干预使平均收缩压下降4 mmHg，95%CI为−7到−1 mmHg。最规范的解释是：", options: ["区间不跨0，提示平均差异有统计学证据；临床意义还需结合情境", "有95%的人血压下降1到7 mmHg", "H0为真的概率小于5%", "已经证明干预对所有人有效"], answer: 0, explain: "差值类CI看是否跨0；统计学证据不等于对每个人有效或必有临床意义。" },
  { id: "q-v19-mix-06", subject: "stats", chapterId: "st-11", type: "single", stem: "结局为是否发生并发症，需要同时调整年龄、性别和治疗方式，最合适的常用模型是：", options: ["Logistic回归", "单样本t检验", "Pearson相关", "只做卡方后停止"], answer: 0, explain: "二分类结局且需要多变量调整，优先考虑Logistic回归。" },
  { id: "q-v19-mix-07", subject: "ph", chapterId: "ph-03", type: "single", stem: "某地区拟开展肺癌防控。下列最符合一级预防的是：", options: ["控烟和职业致癌暴露控制", "低剂量CT筛查", "确诊后规范治疗", "康复和姑息治疗"], answer: 0, explain: "一级预防发生在疾病发生前，控制病因和危险因素。" },
  { id: "q-v19-mix-08", subject: "ph", chapterId: "ph-08", type: "single", stem: "评价一项基层筛查政策时，只报告检出率上升仍不充分，最应继续评价：", options: ["健康结局、成本、可及性、公平及潜在伤害", "宣传海报颜色", "医院建筑面积", "研究者个人偏好"], answer: 0, explain: "公共卫生政策评价要同时看效果、效率、公平、可行性与潜在伤害。" },
  { id: "q-v19-mix-09", subject: "mp", chapterId: "mp-04", type: "single", stem: "兆伏X射线治疗中，皮肤表面剂量通常低于dmax附近剂量，主要体现：", options: ["建成效应", "平方反比失效", "放射性衰变", "PET符合探测"], answer: 0, explain: "次级带电粒子逐步建立导致剂量在一定深度达到最大，形成皮肤保护效应。" },
  { id: "q-v19-mix-10", subject: "mp", chapterId: "mp-10", type: "single", stem: "质子治疗计划中特别需要关注射程不确定性，是因为：", options: ["远端剂量下降陡，射程偏差可能使高剂量区偏离靶区", "质子没有任何深度剂量变化", "质子不受组织密度影响", "Bragg峰只存在于空气中"], answer: 0, explain: "Bragg峰带来优势，也让射程对组织密度、成像和模型误差更敏感。" },
  { id: "q-v19-mix-11", subject: "mp", chapterId: "mp-11", type: "single", stem: "患者特异IMRT QA的核心目的更接近：", options: ["验证复杂计划能否被治疗系统按预期准确实现", "替代所有设备日常QA", "证明TPS永远不会出错", "只检查患者姓名"], answer: 0, explain: "患者特异QA关注具体复杂计划的可实施性和递送准确性，但不能替代设备常规QA。" },
  { id: "q-v19-mix-12", subject: "epi", chapterId: "epi-09", type: "single", stem: "学校出现聚集性胃肠炎。合理的现场思路是：", options: ["先核实暴发并建立病例定义，再描述三间分布、提出假设、调查验证并同步控制", "先等病因完全确定后再采取措施", "只计算P值", "只调查最重的一名患者"], answer: 0, explain: "暴发调查与控制通常并行，按核实—定义—描述—假设—验证—控制—沟通推进。" },
  { id: "q-v19-mix-13", subject: "stats", chapterId: "st-12", type: "single", stem: "比较三种治疗方案的平均住院日，三组互相独立且近似正态。第一选择通常是：", options: ["单因素方差分析", "配对t检验", "McNemar检验", "Logistic回归"], answer: 0, explain: "三组独立定量结局比较均数，经典入口是单因素ANOVA。" },
  { id: "q-v19-mix-14", subject: "epi", chapterId: "epi-05", type: "single", stem: "研究罕见病与既往职业暴露的关系，在资源有限时优先考虑：", options: ["病例对照研究", "大规模前瞻队列", "单纯生态学描述", "无对照病例报告"], answer: 0, explain: "病例对照研究对罕见病通常更高效，可从结局出发回顾暴露。" },
  { id: "q-v19-mix-15", subject: "ph", chapterId: "ph-09", type: "single", stem: "面对AI辅助筛查的新技术，最完整的公共卫生评价框架应同时考虑：", options: ["准确性、泛化、成本、可及性、公平、隐私伦理与实施效果", "只看模型AUC", "只看开发公司规模", "只看是否使用深度学习"], answer: 0, explain: "交叉学科题要从证据、实施、经济、公平、伦理等多维度评价。" },
  { id: "q-v19-mix-16", subject: "mp", chapterId: "mp-12", type: "single", stem: "职业人员减少不必要受照时间、增加与源距离并使用合适屏蔽，体现的是：", options: ["时间—距离—屏蔽三原则", "只体现正当性", "只体现诊断试验真实性", "与辐射防护无关"], answer: 0, explain: "时间、距离、屏蔽是外照射防护的经典基本手段。" },
  { id: "q-v19-mix-17", subject: "stats", chapterId: "st-06", type: "single", stem: "样本量很小且研究效应真实存在，但P>0.05。合理解释是：", options: ["证据不足，可能与检验效能不足有关", "证明效应不存在", "证明H0为真", "样本越小效能越高"], answer: 0, explain: "不显著不等于无效应；小样本可能导致标准误较大、效能不足。" },
  { id: "q-v19-mix-18", subject: "epi", chapterId: "epi-07", type: "single", stem: "随机对照试验中随机化最主要帮助控制的是：", options: ["已知和未知混杂在组间的系统差异", "所有失访", "所有测量误差", "所有外部真实性问题"], answer: 0, explain: "随机化主要改善组间可比性，并不能自动消除失访、测量误差等问题。" },
  { id: "q-v19-mix-19", subject: "mp", chapterId: "mp-13", type: "single", stem: "PET中常见的511 keV光子来源于：", options: ["正电子与电子湮没后产生的一对光子", "X线管制动辐射", "电子束直接变成质子", "超声换能器"], answer: 0, explain: "正电子湮没产生近反向的两个511 keV光子，PET利用符合探测定位。" },
  { id: "q-v19-mix-20", subject: "ph", chapterId: "ph-06", type: "single", stem: "突发公共卫生事件风险沟通最不恰当的是：", options: ["说明已知事实和不确定性", "及时更新信息", "在证据不足时宣称唯一病因已经确定", "给出可执行的防护建议"], answer: 2, explain: "风险沟通要及时、透明、准确，同时承认不确定性。" }
];


// V22｜英语一训练量扩充：核心词汇、长难句与阅读材料均为原创训练内容。
window.ENGLISH_WORDS.push(
  ["approach","方法；接近","A practical approach can improve efficiency."],
  ["assess","评估","Researchers assessed the quality of the evidence."],
  ["assume","假设；认为","We should not assume that association proves causation."],
  ["available","可获得的","Reliable data are not always available."],
  ["benefit","益处；受益","The policy may benefit vulnerable groups."],
  ["challenge","挑战","Population ageing creates new challenges."],
  ["claim","声称；主张","The authors did not claim that the effect was universal."],
  ["conduct","实施；开展","The survey was conducted in five communities."],
  ["consistent","一致的","The findings were consistent across age groups."],
  ["consider","考虑","Cost and equity should both be considered."],
  ["context","语境；背景","A result must be interpreted in context."],
  ["contribute","促成；贡献","Several factors contribute to the problem."],
  ["decline","下降","Mortality continued to decline."],
  ["define","定义","Researchers must define the outcome clearly."],
  ["demonstrate","证明；显示","The experiment demonstrated a measurable effect."],
  ["determine","决定；确定","Many factors determine treatment choice."],
  ["effective","有效的","An effective intervention must work in practice."],
  ["efficient","高效的","The new process is more efficient."],
  ["emerge","出现","New risks may emerge as technology changes."],
  ["enable","使能够","Digital tools enable faster data collection."],
  ["evaluate","评价","The team evaluated both benefits and harms."],
  ["factor","因素","Age is an important risk factor."],
  ["feature","特征","One feature of the design is random allocation."],
  ["indicate","表明","The results indicate a possible association."],
  ["individual","个体；个人","Individual choices are shaped by social conditions."],
  ["influence","影响","Income can influence access to care."],
  ["interpret","解释","P values should be interpreted carefully."],
  ["maintain","维持","The program aims to maintain long-term adherence."],
  ["measure","测量；指标","The study used a validated measure."],
  ["method","方法","The method should match the research question."],
  ["occur","发生","Errors can occur at several stages."],
  ["potential","潜在的","The intervention has potential benefits and harms."],
  ["predict","预测","The model predicts the probability of disease."],
  ["provide","提供","The study provides useful evidence."],
  ["reduce","降低","Vaccination can reduce disease burden."],
  ["require","需要","Accurate estimation requires reliable data."],
  ["response","反应；应对","A rapid response can limit an outbreak."],
  ["role","作用","Environment plays an important role in health."],
  ["significant","显著的；重要的","A statistically significant result may still be small."],
  ["similar","相似的","The two groups had similar baseline characteristics."],
  ["source","来源","The source of the data should be reported."],
  ["strategy","策略","A prevention strategy may combine several measures."],
  ["suggest","提示；建议","The findings suggest that further study is needed."],
  ["support","支持","The evidence does not fully support the claim."],
  ["tend","倾向于","Older adults tend to use more health services."],
  ["vary","变化；不同","Risk may vary across populations."],
  ["achieve","实现","The program failed to achieve its main goal."],
  ["adequate","充分的","An adequate sample size improves precision."],
  ["alternative","替代的；另一种","Researchers considered an alternative explanation."],
  ["apparent","表面的；明显的","The apparent effect disappeared after adjustment."],
  ["apply","应用","The rule may not apply to every population."],
  ["appropriate","合适的","Choose an appropriate statistical test."],
  ["capacity","能力；容量","Hospitals expanded testing capacity."],
  ["consequence","后果","The unintended consequence was higher cost."],
  ["constraint","限制；约束","Time is a major constraint in emergency response."],
  ["consume","消耗","The procedure consumes substantial resources."],
  ["contrast","对比","In contrast, the control group showed little change."],
  ["controversial","有争议的","The policy remains controversial."],
  ["conventional","传统的","The new method outperformed the conventional approach."],
  ["crucial","关键的","Accurate positioning is crucial in radiotherapy."],
  ["derive","获得；推导","The estimate was derived from national data."],
  ["detect","发现；检测","Screening can detect disease before symptoms appear."],
  ["distinguish","区分","Students must distinguish risk from odds."],
  ["distribution","分布","The age distribution differed between groups."],
  ["dominate","占主导","One explanation dominated the early debate."],
  ["eliminate","消除","Randomization cannot eliminate every source of error."],
  ["emphasize","强调","The report emphasizes prevention."],
  ["ensure","确保","Quality checks help ensure safe delivery."],
  ["establish","建立；确立","One study alone rarely establishes causality."],
  ["exceed","超过","Demand may exceed available resources."],
  ["exclude","排除","The confidence interval excluded the null value."],
  ["expand","扩大","The program expanded to rural areas."],
  ["explain","解释","Confounding may explain part of the association."],
  ["focus","关注","The analysis focused on long-term outcomes."],
  ["generate","产生","The model can generate useful predictions."],
  ["identify","识别","The first task is to identify the main source of bias."],
  ["imply","意味着；暗示","Correlation does not imply causation."],
  ["improve","改善","Training improved measurement accuracy."],
  ["include","包括","The analysis included age and sex."],
  ["increase","增加","Risk increased with exposure duration."],
  ["inevitable","不可避免的","Uncertainty is inevitable in measurement."],
  ["limit","限制","Small samples limit the precision of estimates."],
  ["majority","大多数","The majority of participants completed follow-up."],
  ["obtain","获得","Consent was obtained before enrollment."],
  ["overall","总体的","Overall mortality fell during the decade."],
  ["participate","参与","More than 500 adults participated in the study."],
  ["perspective","视角","The issue should be viewed from a public-health perspective."],
  ["principle","原则","The principle of equity guided the policy."],
  ["proportion","比例","A large proportion of cases were preventable."],
  ["range","范围","The values ranged from 10 to 40."],
  ["relevant","相关的","Only relevant evidence should guide the conclusion."],
  ["reliable","可靠的","Reliable measurement is essential."],
  ["represent","代表","The sample may not represent the whole population."],
  ["restrict","限制","Strict criteria can restrict generalizability."],
  ["retain","保留","The model retained three predictors."],
  ["shift","转变","The focus shifted from treatment to prevention."],
  ["sufficient","充分的","The evidence is not sufficient for a firm conclusion."],
  ["underlying","潜在的；根本的","Researchers examined the underlying mechanism."],
  ["valid","有效的；有依据的","A valid comparison requires comparable groups."],
  ["whereas","然而；而","Incidence measures new cases, whereas prevalence measures existing cases."],
  ["despite","尽管","Despite higher costs, the program improved access."],
  ["therefore","因此","The evidence was weak; therefore, the conclusion remained cautious."],
  ["nevertheless","尽管如此","The sample was small; nevertheless, the pattern was consistent."],
  ["rather","而是；相当","The goal is prevention rather than punishment."],
  ["likely","可能的","The effect is likely to differ across settings."],
  ["merely","仅仅","A significant P value does not merely settle every question."],
  ["primarily","主要地","The intervention primarily targeted high-risk adults."],
  ["substantial","大量的；实质性的","The change produced substantial savings."],
  ["specific","具体的；特异的","The recommendation should be specific and actionable."],
  ["general","一般的；总体的","A general rule may have important exceptions."],
  ["complex","复杂的","Health behavior is shaped by complex influences."],
  ["critical","关键的；批判性的","Critical reading asks what the evidence really supports."],
  ["primary","主要的；一级的","The primary outcome was all-cause mortality."],
  ["secondary","次要的；二级的","Secondary outcomes included quality of life."],
  ["previous","先前的","Previous studies reported mixed results."],
  ["current","当前的","Current evidence remains incomplete."],
  ["former","前者","The former method was faster but less precise."],
  ["latter","后者","The latter approach required more resources."],
  ["account","解释；占比","Age may account for part of the difference."],
  ["address","处理；应对","The policy attempts to address unequal access."],
  ["adopt","采用","Several hospitals adopted the new protocol."],
  ["affect","影响","Measurement error can affect the estimate."],
  ["argue","论证；主张","The authors argue that prevention deserves more investment."],
  ["compare","比较","The study compared two treatment strategies."],
  ["depend","取决于","Predictive value depends on disease prevalence."],
  ["examine","检查；研究","Researchers examined long-term outcomes."],
  ["involve","涉及","The program involves patients, clinicians and communities."],
  ["observe","观察","The same pattern was observed in both groups."],
  ["prevent","预防","Early action may prevent further spread."],
  ["remain","仍然","Several questions remain unanswered."],
  ["reflect","反映","The indicator may reflect both access and quality."],
  ["relate","相关","Income is related to several health outcomes."],
  ["replace","替代","Technology should not automatically replace clinical judgment."],
  ["result","导致；结果","Poor follow-up can result in biased estimates."],
  ["reveal","揭示","The analysis revealed an important subgroup difference."],
  ["select","选择","Participants were selected from community clinics."],
  ["treat","治疗；对待","Missing data should be treated carefully."],
  ["trend","趋势","The long-term trend was downward."],
  ["evidence-based","循证的","Evidence-based decisions combine research with context."],
  ["inequality","不平等","Health inequality may reflect social conditions."],
  ["access","可及性；获得","Rural residents had less access to specialist care."],
  ["adherence","依从性","Poor adherence reduced the observed benefit."],
  ["adverse","不利的","No serious adverse events were reported."],
  ["baseline","基线","Baseline characteristics were similar."],
  ["criterion","标准","Eligibility criteria were defined in advance."],
  ["data","数据","Data quality determines what conclusions are possible."],
  ["device","设备","The device was tested before clinical use."],
  ["diagnosis","诊断","Early diagnosis can improve treatment options."],
  ["disability","伤残","Disease burden includes premature death and disability."],
  ["environment","环境","The environment influences health behavior."],
  ["follow-up","随访","Long follow-up can reveal delayed outcomes."],
  ["framework","框架","A clear framework helps organize an essay answer."],
  ["guideline","指南","The guideline recommends regular monitoring."],
  ["harm","伤害","Screening can produce both benefits and harms."],
  ["hypothesis","假设","The study tested a prespecified hypothesis."],
  ["mechanism","机制","The biological mechanism remains uncertain."],
  ["outweigh","超过；胜过","Benefits should outweigh potential harms."],
  ["precision","精确度","A larger sample usually improves precision."],
  ["random","随机的","Random error decreases as sample size grows."],
  ["recommend","建议","The authors recommend further evaluation."],
  ["regulate","监管；调节","Governments regulate some health-related products."],
  ["resource","资源","Limited resources require priority setting."],
  ["robust","稳健的","The conclusion remained robust after adjustment."],
  ["threshold","阈值","Changing the threshold alters sensitivity and specificity."],
  ["uncertainty","不确定性","Every estimate contains uncertainty."],
  ["vulnerable","脆弱的；易受影响的","Vulnerable groups may need additional support."]
);

window.ENGLISH_PASSAGES.push(
 {id:'v22-pass-01',title:'训练阅读｜证据与政策',text:'A policy can be popular without being effective. Researchers therefore ask whether observed improvements would have occurred even without the policy. A fair evaluation needs a comparison, a clear outcome and enough time for the effect to appear.',qs:[{q:'A fair evaluation especially needs:',opts:['a comparison and clear outcome','public popularity only','a longer title'],a:0},{q:'The passage warns that popularity:',opts:['proves effectiveness','does not prove effectiveness'],a:1}]},
 {id:'v22-pass-02',title:'训练阅读｜技术与判断',text:'New technology often promises greater speed and accuracy. Yet a tool that performs well in one hospital may fail elsewhere if patients, workflows or data quality differ. Adoption should therefore depend on external validation as well as technical performance.',qs:[{q:'Good performance in one hospital:',opts:['guarantees success everywhere','may not generalize elsewhere'],a:1},{q:'Adoption should also consider:',opts:['external validation','logo design only'],a:0}]},
 {id:'v22-pass-03',title:'训练阅读｜统计显著性',text:'Statistical significance answers a limited question. It does not tell us whether an effect is large enough to matter to patients, whether the study was unbiased, or whether the result will apply to another population.',qs:[{q:'Statistical significance alone tells us clinical importance.',opts:['True','False'],a:1},{q:'The passage mainly argues for:',opts:['broader interpretation of results','ignoring statistics'],a:0}]},
 {id:'v22-pass-04',title:'训练阅读｜健康行为',text:'Information is necessary for many health decisions, but it is rarely sufficient. People may understand the benefits of exercise and still lack safe places, time or social support. Effective programs therefore change environments as well as knowledge.',qs:[{q:'Knowledge alone is usually:',opts:['sufficient','not sufficient'],a:1},{q:'Effective programs may also change:',opts:['environments','only vocabulary'],a:0}]},
 {id:'v22-pass-05',title:'训练阅读｜筛查的代价',text:'Earlier detection sounds desirable, but screening can also identify abnormalities that would never have caused symptoms. Such overdiagnosis may lead to anxiety and unnecessary treatment. The value of screening therefore depends on the balance of benefits and harms.',qs:[{q:'The author is:',opts:['unconditionally supportive','balanced and cautious'],a:1},{q:'Overdiagnosis may cause:',opts:['unnecessary treatment','perfect specificity'],a:0}]},
 {id:'v22-pass-06',title:'训练阅读｜样本量',text:'A very large sample can make a tiny difference statistically significant. Conversely, a small study may fail to detect an important effect. Sample size changes precision and power, so a P value should never be interpreted without considering the study design and effect size.',qs:[{q:'A large sample can make a tiny difference:',opts:['statistically significant','impossible to detect'],a:0},{q:'P values should be interpreted with:',opts:['design and effect size','word count only'],a:0}]},
 {id:'v22-pass-07',title:'训练阅读｜医疗公平',text:'Equal treatment is not always equitable treatment. If two communities receive the same number of clinics but one is much larger and poorer, their ability to obtain care may remain unequal. Equity focuses on need and barriers, not merely identical inputs.',qs:[{q:'Equity focuses on:',opts:['need and barriers','identical inputs only'],a:0},{q:'Equal inputs always create equal access.',opts:['True','False'],a:1}]},
 {id:'v22-pass-08',title:'训练阅读｜因果推断',text:'When an exposure is associated with disease, several explanations remain possible. The exposure may truly affect risk, the association may reflect bias or confounding, or chance may be responsible. Strong causal reasoning tries to rule out these alternatives rather than relying on one number.',qs:[{q:'An association has:',opts:['only one possible explanation','several possible explanations'],a:1},{q:'Strong causal reasoning tries to:',opts:['rule out alternatives','rely on one number'],a:0}]},
 {id:'v22-pass-09',title:'训练阅读｜AI辅助',text:'Artificial intelligence may help clinicians process images more quickly, but speed is not the only outcome that matters. False alarms, missed cases, workflow disruption and unequal performance across patient groups can all change the real-world value of a system.',qs:[{q:'The author says speed is:',opts:['the only outcome','one of several outcomes'],a:1},{q:'Real-world value can be affected by:',opts:['unequal performance','only screen size'],a:0}]},
 {id:'v22-pass-10',title:'训练阅读｜预防投资',text:'Prevention often produces benefits years after the initial investment. This delay can make prevention politically difficult because costs are visible now while some gains appear later. Short budget cycles may therefore favor treatment even when prevention is efficient in the long run.',qs:[{q:'Prevention may be politically difficult because:',opts:['benefits can be delayed','it never works'],a:0},{q:'Short budget cycles may favor:',opts:['treatment','long-term prevention only'],a:0}]},
 {id:'v22-pass-11',title:'训练阅读｜测量误差',text:'Measurement error does not always push an estimate in the same direction. Its effect depends on how the error occurs and whether it differs between comparison groups. Researchers should therefore describe measurement procedures rather than simply claiming that error was small.',qs:[{q:'Measurement error always biases results in one direction.',opts:['True','False'],a:1},{q:'Researchers should report:',opts:['measurement procedures','only the final P value'],a:0}]},
 {id:'v22-pass-12',title:'训练阅读｜证据更新',text:'Scientific conclusions are provisional rather than permanent. New studies may strengthen, weaken or refine earlier claims. Changing a recommendation after better evidence appears is therefore not necessarily a failure; it can be a sign that the evidence system is working.',qs:[{q:'Changing a recommendation can indicate:',opts:['evidence is being updated','science has no value'],a:0},{q:'Scientific conclusions are described as:',opts:['provisional','permanent'],a:0}]}
);

window.TYPE_LABEL = {
  single: "单选",
  tf: "判断",
  calc: "计算",
  noun: "名词解释",
  short: "简答",
  case: "案例",
  multi: "多选",
};

// V21 英语一基础训练题（原创训练题，不标称历年真题）
(() => {
const A=[
['en-03','The results of the study, which was conducted in three cities, ___ consistent.',['was','were','being','to be'],1,'主语results为复数；which从句先括起来。'],
['en-03','In “The policy introduced last year reduced costs”, the main verb is:',['introduced','reduced','last','costs'],1,'introduced last year修饰policy；主句谓语是reduced。'],
['en-04','Although the test is sensitive, it may produce false positives. The relation is:',['cause','contrast/concession','example only','time'],1,'although表示让步。'],
['en-04','A clause beginning with “because” most often expresses:',['cause/reason','contrast','definition only','comparison'],0,'because常引导原因状语。'],
['en-05','If a question asks why costs fell, the best evidence is usually:',['a sentence explaining the fall','the article title only','your own experience','an unrelated example'],0,'细节题回到直接证据。'],
['en-05','A correct reading option is most likely to:',['paraphrase the evidence','use the same words but reverse meaning','add an unsupported cause','be the longest'],0,'正确项常为同义改写。'],
['en-06','An inference should be:',['a minimal step beyond evidence','a new story invented by the reader','always absolute','unrelated to the text'],0,'推断只能多走半步。'],
['en-06','Which word usually signals a cautious attitude?',['may','must always','never','completely'],0,'may通常表达谨慎可能性。'],
['en-07','“The treatment was costly; ___, it produced little benefit.”',['however','therefore','because','for example'],0,'前后为转折。'],
['en-07','Before choosing a cloze option, first check:',['part of speech and logic','the author’s birthday','word length only','alphabetical order'],0,'先词性再逻辑。'],
['en-08','“This finding” at the start of a paragraph usually points to:',['something stated just before','the final paragraph only','a dictionary','nothing'],0,'指代是衔接线索。'],
['en-08','“For example” most strongly signals:',['an illustration of a prior point','a total reversal','the conclusion only','a question'],0,'for example引出例证。'],
['en-09','When translating a long sentence, the safest first step is:',['find the main clause','translate word by word','omit unknown clauses','rewrite the author’s opinion'],0,'先找主干。'],
['en-09','A pronoun such as “they” should be translated after:',['identifying its referent','guessing randomly','deleting it','changing it to we'],0,'先找指代。'],
['en-10','A small application letter should first make clear:',['purpose and required information','ten advanced idioms','a memorized unrelated story','the examiner’s name'],0,'任务完成度优先。'],
['en-10','For a basic writer, the safest strategy is:',['accurate controllable sentences','maximum sentence length','rare words at any cost','one memorized essay for all topics'],0,'准确优先。'],
['en-11','After a wrong reading answer, the most useful record is:',['evidence location and error type','only the score','only the date','nothing'],0,'复盘要定位错因。'],
['en-11','If the same error appears twice, you should:',['do targeted practice','ignore it','only memorize the option letter','stop reading'],0,'重复错误进入专项。'],
['en-12','On a very busy day, the English plan should be:',['minimum task without breaking the chain','zero English','two hours at midnight','wait until weekend'],0,'不断档优先。'],
['en-12','Before full timed papers, a foundation learner should first stabilize:',['vocabulary, sentence parsing and reading location','essay handwriting only','political current affairs','medical physics formulas only'],0,'先把英语底层能力接起来。']
];
A.forEach((x,i)=>QUESTIONS.push({id:'q-en-v21-'+(i+1),subject:'en',chapterId:x[0],type:'single',stem:x[1],options:x[2],answer:x[3],explain:x[4]}));
})();


// V23｜英语弱项闭环：原创长难句专项（不冒充历年真题）
window.ENGLISH_SENTENCES = [
 {id:'sen-01',text:'Although the policy was introduced to reduce inequality, researchers found that people with limited access to primary care benefited less from it.',main:'researchers found ...',cn:'尽管该政策旨在减少不平等，研究者发现，基层医疗可及性有限的人从中获益较少。',focus:'although让步；that引导宾语从句；with短语修饰people。'},
 {id:'sen-02',text:'The fact that a result is statistically significant does not necessarily mean that the effect is large enough to matter in clinical practice.',main:'The fact does not necessarily mean ...',cn:'结果具有统计学显著性这一事实，并不必然意味着效应大到足以具有临床意义。',focus:'两个that从句；not necessarily是高频逻辑限定。'},
 {id:'sen-03',text:'Patients who receive clear information about both benefits and risks are more likely to make decisions that reflect their own preferences.',main:'Patients are more likely to make decisions.',cn:'同时获得关于获益和风险清晰信息的患者，更可能做出反映自身偏好的决定。',focus:'who和that两个定语从句。'},
 {id:'sen-04',text:'Because screening can identify disease before symptoms appear, it may improve outcomes, but only when effective follow-up and treatment are available.',main:'it may improve outcomes',cn:'由于筛查能在症状出现前发现疾病，它可能改善结局，但前提是有效的随访和治疗可获得。',focus:'because原因；but only when构成条件限制。'},
 {id:'sen-05',text:'What matters most is not whether a model performs well on the data used to build it, but whether it remains accurate in populations it has never seen.',main:'What matters most is not A but B.',cn:'最重要的不是模型在建模数据上表现是否良好，而是它在从未见过的人群中能否保持准确。',focus:'what主语从句；not A but B；省略关系词的populations从句。'},
 {id:'sen-06',text:'Evidence from observational studies, while useful for generating hypotheses, may be misleading if important confounders are not measured or controlled.',main:'Evidence may be misleading.',cn:'观察性研究证据虽然有助于提出假设，但如果重要混杂因素未被测量或控制，也可能产生误导。',focus:'while插入让步；if条件。'},
 {id:'sen-07',text:'A treatment that is effective under ideal experimental conditions may produce smaller benefits when it is delivered in routine clinical settings.',main:'A treatment may produce smaller benefits.',cn:'在理想实验条件下有效的治疗，在常规临床环境中实施时可能产生较小获益。',focus:'that定语从句；when时间/情境从句。'},
 {id:'sen-08',text:'Rather than asking only whether an intervention works, public health researchers also ask for whom it works, at what cost, and under what conditions.',main:'researchers also ask ...',cn:'公共卫生研究者不会只问干预是否有效，还会问它对谁有效、成本多大以及在什么条件下有效。',focus:'rather than对比；三个并列宾语。'},
 {id:'sen-09',text:'The more precisely an exposure is measured, the easier it becomes to distinguish a true association from one created by measurement error.',main:'The more ..., the easier ...',cn:'暴露测量得越精确，就越容易区分真实关联与由测量误差造成的关联。',focus:'the more..., the more...比较结构。'},
 {id:'sen-10',text:'Even if two groups have the same average outcome, the distributions around those averages may differ in ways that are important for decision-making.',main:'the distributions may differ',cn:'即使两组具有相同平均结局，均值周围的分布仍可能以对决策重要的方式不同。',focus:'even if让步；that定语从句。'},
 {id:'sen-11',text:'When resources are limited, choosing the intervention with the largest effect is not always the same as choosing the one that produces the greatest health gain per unit of cost.',main:'choosing A is not always the same as choosing B',cn:'资源有限时，选择效应最大的干预并不总等于选择单位成本健康收益最大的干预。',focus:'动名词作主语；not the same as；that定语从句。'},
 {id:'sen-12',text:'Researchers should be cautious about conclusions based on a single study, especially when its sample is small and its findings have not been replicated.',main:'Researchers should be cautious.',cn:'研究者应谨慎对待基于单项研究的结论，尤其当样本较小且结果尚未重复验证时。',focus:'based on过去分词修饰；when从句。'},
 {id:'sen-13',text:'By comparing people who were exposed with otherwise similar people who were not, investigators try to estimate what would have happened without the exposure.',main:'investigators try to estimate ...',cn:'通过比较暴露者与其他方面相似的未暴露者，研究者试图估计没有该暴露时会发生什么。',focus:'by doing方式；两个who定语从句；what宾语从句。'},
 {id:'sen-14',text:'Technologies that make diagnosis faster can still increase total spending if they lead to more testing, more follow-up, or treatment of conditions that would never have caused harm.',main:'Technologies can still increase total spending.',cn:'使诊断更快的技术仍可能增加总支出，如果它们导致更多检查、随访，或治疗本来永远不会造成伤害的情况。',focus:'that定语；if条件；would never have caused反事实意味。'},
 {id:'sen-15',text:'It is only after an apparent association survives careful adjustment for alternative explanations that confidence in a causal interpretation should increase.',main:'confidence ... should increase',cn:'只有当一个表面关联在对其他解释进行仔细调整后仍然存在，我们对因果解释的信心才应增加。',focus:'It is only after...that...强调结构。'},
 {id:'sen-16',text:'Policies designed without considering how people actually behave may fail even when the scientific evidence supporting their goals is strong.',main:'Policies may fail.',cn:'如果政策设计没有考虑人们实际如何行为，即使支持其目标的科学证据很强，也可能失败。',focus:'designed过去分词；how宾语从句；even when让步。'},
 {id:'sen-17',text:'Whether a small change is worth implementing depends not only on its average effect but also on its cost, feasibility, fairness, and potential unintended consequences.',main:'Whether ... depends not only on A but also on B.',cn:'一个小变化是否值得实施，不仅取决于平均效应，也取决于成本、可行性、公平性和潜在非预期后果。',focus:'whether主语从句；not only...but also。'},
 {id:'sen-18',text:'People often interpret uncertainty as a weakness, whereas in science openly describing what is not yet known is part of responsible communication.',main:'People interpret A, whereas describing B is C.',cn:'人们常把不确定性理解为弱点，而在科学中，公开说明尚未知晓的内容恰是负责任沟通的一部分。',focus:'whereas对比；what宾语从句；动名词作主语。'},
 {id:'sen-19',text:'If an algorithm is trained mainly on patients from large urban hospitals, its accuracy may fall when it is used in communities whose populations differ substantially.',main:'its accuracy may fall',cn:'如果算法主要用大型城市医院患者训练，当用于人群差异很大的社区时，其准确性可能下降。',focus:'if条件；when从句；whose定语从句。'},
 {id:'sen-20',text:'No matter how sophisticated a statistical model becomes, it cannot correct a question that was poorly defined or data that were collected systematically incorrectly.',main:'it cannot correct a question or data.',cn:'无论统计模型多复杂，它都无法修正定义不清的问题或系统性错误收集的数据。',focus:'no matter how让步；两个that定语从句。'}
];

// V24｜英语核心词汇扩充（原创整理；不等同于官方词表）
window.ENGLISH_WORDS.push(
...`ability|能力;absence|缺乏；缺席;absolute|绝对的;abstract|抽象的；摘要;academic|学术的;access|获得；进入;accompany|伴随;accomplish|完成;account|解释；账户;accumulate|积累;achieve|实现;acknowledge|承认;acquire|获得;adapt|适应；改编;adequate|足够的;adjust|调整;administration|管理；实施;adopt|采用；收养;advance|推进；进展;advantage|优势;adverse|不利的;advocate|提倡；支持者;affect|影响;aggregate|总计；聚合;allocate|分配;alter|改变;alternative|替代的；替代方案;ambiguous|模糊的;analysis|分析;annual|年度的;anticipate|预期;apparent|表面的；明显的;appeal|吸引；呼吁;approach|方法；接近;appropriate|合适的;approximate|近似的;arise|出现；产生;assess|评估;assume|假设;attribute|归因于；属性;available|可获得的;aware|意识到的;benefit|获益;capacity|能力；容量;category|类别;challenge|挑战;characteristic|特征;clarify|澄清;coherent|连贯的;collapse|崩溃;combine|结合;comment|评论;commit|承诺；投入;common|常见的;communicate|沟通;community|社区;compare|比较;compensate|补偿;compete|竞争;complex|复杂的;component|组成部分;comprehensive|全面的;comprise|包含;concentrate|集中;concept|概念;concern|关注；担忧;conclude|得出结论;conduct|实施；行为;confirm|确认;conflict|冲突;consequence|后果;consider|考虑;consistent|一致的;constitute|构成;constraint|限制;consume|消耗；消费;context|语境；背景;contrast|对比;contribute|贡献；促成;controversial|有争议的;conventional|传统的;convert|转化;convince|说服;core|核心;correspond|对应；通信;crucial|关键的;decline|下降；拒绝;define|定义;demonstrate|证明；展示;derive|获得；源自;detect|发现;determine|决定；测定;device|设备;dimension|维度;discriminate|区分；歧视;distribute|分布；分配;diverse|多样的;domestic|国内的；家庭的;dominant|占主导的;duration|持续时间;economy|经济;efficient|高效的;eliminate|消除;emerge|出现;emphasize|强调;enable|使能够;encounter|遇到;enhance|增强;ensure|确保;environment|环境;equivalent|等同的;establish|建立；证实;evaluate|评价;evident|明显的;evolve|演变;exceed|超过;exclude|排除;expand|扩大;explicit|明确的;exploit|利用;factor|因素;feature|特征;feasible|可行的;federal|联邦的;flexible|灵活的;focus|聚焦;framework|框架;fundamental|根本的;generate|产生;global|全球的;grant|授予；资助;guarantee|保证;guideline|指南;highlight|突出;identify|识别;illustrate|说明;impact|影响;implement|实施;imply|暗示;improve|改善;incentive|激励;include|包括;indicate|表明;individual|个体的;inevitable|不可避免的;infer|推断;influence|影响;initial|初始的;innovative|创新的;inspect|检查;integrate|整合;interpret|解释;involve|涉及;issue|问题；发布;justify|证明合理;maintain|维持;major|主要的;mechanism|机制;measure|测量；措施;method|方法;modify|修改;monitor|监测;negative|负面的；阴性的;objective|目标；客观的;obtain|获得;occur|发生;overall|总体的;participate|参与;perceive|感知；认为;period|时期;persist|持续;perspective|视角;potential|潜在的;predict|预测;preliminary|初步的;preserve|保存;primary|主要的；初级的;principle|原则;prior|先前的；优先的;procedure|程序;process|过程;proportion|比例;prospective|前瞻性的;provide|提供;publish|发表;range|范围;react|反应;recover|恢复;reduce|减少;refer|指；参考;reflect|反映;regulate|调节；监管;reject|拒绝;relevant|相关的;reliable|可靠的;require|需要;resource|资源;respond|回应;restrict|限制;retain|保留;reveal|揭示;role|作用;shift|转变;similar|相似的;source|来源;specific|具体的;stable|稳定的;strategy|策略;structure|结构;subsequent|随后的;substantial|大量的；实质的;sufficient|足够的;suggest|表明；建议;sustain|维持;temporary|暂时的;theory|理论;transfer|转移;trend|趋势;underlie|构成基础;unique|独特的;valid|有效的;vary|变化;version|版本;welfare|福利;whereas|然而；而;widespread|广泛的;withdraw|撤回;yield|产生；产量;assumption|假设;criterion|标准;data|数据;distribution|分布;empirical|实证的;external|外部的;internal|内部的;logic|逻辑;parameter|参数;random|随机的;represent|代表;response|反应；回答;statistic|统计量;validity|效度;association|关联;causality|因果性;diagnosis|诊断;disability|残疾；失能;epidemic|流行；流行病;frequency|频率;hazard|危害；风险;immune|免疫的;infection|感染;infectious|传染性的;medical|医学的;medicine|医学；药物;patient|患者;prognosis|预后;public|公共的;rate|率；速度;relative|相对的;research|研究;resistance|抵抗；耐药;symptom|症状;treatment|治疗;vaccine|疫苗;clinical|临床的;diagnostic|诊断的;effective|有效的;efficacy|效力;ethical|伦理的;follow-up|随访;healthcare|医疗保健;inequality|不平等;informed|知情的;preference|偏好;provider|提供者;recommend|推荐;routine|常规的;urban|城市的;rural|农村的;cost|成本;finance|资金；金融;income|收入;insurance|保险;market|市场;price|价格;productivity|生产率;reform|改革;spending|支出;value|价值;authority|权威；当局;legal|法律的;legislation|立法;regulation|法规；监管;responsibility|责任;rights|权利;standard|标准;transparent|透明的;uncertainty|不确定性;algorithm|算法;artificial|人工的;database|数据库;digital|数字的;model|模型;privacy|隐私;technology|技术;automate|自动化;performance|表现;precision|精确性;replicate|重复验证;robust|稳健的;threshold|阈值;accuracy|准确性;reproducible|可重复的;generalize|推广；泛化;heterogeneous|异质的;biases|偏倚（复数）;adjustment|调整;comparison|比较;confidence|信心；置信;significance|显著性;probability|概率;estimate|估计;sampling|抽样;variance|方差;average|平均的；平均值;median|中位数;correlation|相关;regression|回归;odds|优势比中的优势；可能性;randomized|随机化的;baseline|基线;endpoint|终点;protocol|方案;compliance|依从性;participant|参与者;eligibility|资格；纳入条件`.split(';').map((x,i)=>{const [w,m]=x.split('|');return [w,m,`This word is useful in academic reading: ${w}.`]}));

window.ENGLISH_SENTENCES.push(
 {id:'sen-21',text:'The extent to which a finding can be generalized depends on how closely the study population resembles the population to which the conclusion will be applied.',main:'The extent depends on ...',cn:'一项发现能够推广到何种程度，取决于研究人群与结论拟应用人群的相似程度。',focus:'to which定语从句；how宾语从句；to which再次修饰population。'},
 {id:'sen-22',text:'Although larger samples usually improve precision, they cannot remove systematic errors that arise from poor measurement or biased selection.',main:'larger samples cannot remove systematic errors',cn:'尽管更大的样本通常能提高精确性，但无法消除由测量不佳或选择偏倚产生的系统误差。',focus:'although让步；that定语从句。'},
 {id:'sen-23',text:'What appears to be a simple difference between two groups may disappear once age, income, and other relevant factors are taken into account.',main:'What appears ... may disappear.',cn:'两组之间看似简单的差异，在把年龄、收入及其他相关因素考虑进去后可能消失。',focus:'what主语从句；once时间/条件。'},
 {id:'sen-24',text:'A policy may be scientifically reasonable yet politically difficult to implement if its costs are immediate while its benefits will not be visible for years.',main:'A policy may be reasonable yet difficult to implement.',cn:'如果一项政策成本立即出现而收益多年后才可见，它可能在科学上合理却在政治上难以实施。',focus:'yet转折；if条件；while对比。'},
 {id:'sen-25',text:'The question is not simply whether technology can replace part of human judgment, but which decisions should remain under meaningful human control.',main:'The question is not A but B.',cn:'问题不只是技术能否替代部分人的判断，而是哪些决策应继续处于有意义的人类控制之下。',focus:'whether与which两个名词性从句；not...but...。'},
 {id:'sen-26',text:'Only when researchers report negative as well as positive results can readers judge the evidence without an exaggerated impression of benefit.',main:'can readers judge the evidence',cn:'只有研究者同时报告阴性和阳性结果，读者才能在不过度夸大获益的情况下判断证据。',focus:'Only when置首引起主句部分倒装。'},
 {id:'sen-27',text:'People are more likely to accept uncertainty when experts explain not only what is known but also why some questions remain unanswered.',main:'People are more likely to accept uncertainty.',cn:'当专家不仅解释已知内容，还解释为什么有些问题仍未得到回答时，人们更可能接受不确定性。',focus:'when；not only...but also；what/why从句。'},
 {id:'sen-28',text:'If the outcome chosen for a study does not reflect what matters to patients, even a technically successful trial may have limited practical value.',main:'a trial may have limited practical value',cn:'如果研究选择的结局不能反映患者真正关心的内容，即便技术上成功的试验，其实际价值也可能有限。',focus:'if条件；what宾语从句；even让步意味。'},
 {id:'sen-29',text:'The assumption that more information always leads to better decisions overlooks the fact that people have limited time and attention.',main:'The assumption overlooks the fact.',cn:'“信息越多决策越好”的假设忽视了人们时间和注意力有限这一事实。',focus:'两个that同位语从句。'},
 {id:'sen-30',text:'Whether an association is statistically significant tells us less than many readers assume about whether it is important in the real world.',main:'Whether ... tells us less ...',cn:'一个关联是否具有统计学显著性，对其现实重要性的说明往往比许多读者以为的更少。',focus:'whether主语从句；than比较；第二个whether介词宾语。'},
 {id:'sen-31',text:'As healthcare systems adopt new technologies, the challenge is to identify which improvements justify their additional costs.',main:'the challenge is to identify ...',cn:'随着医疗系统采用新技术，挑战在于识别哪些改进足以证明额外成本是合理的。',focus:'as时间；which宾语从句。'},
 {id:'sen-32',text:'A measure that is reliable can still be invalid if it consistently measures the wrong thing.',main:'A measure can still be invalid.',cn:'一个可靠的测量仍可能无效，如果它一直测量的是错误的东西。',focus:'that定语；if条件。'},
 {id:'sen-33',text:'Because the same relative risk can correspond to very different absolute risks, treatment decisions should consider both.',main:'treatment decisions should consider both',cn:'由于相同的相对风险可能对应非常不同的绝对风险，治疗决策应同时考虑两者。',focus:'because原因；same...different形成概念对比。'},
 {id:'sen-34',text:'Researchers who fail to specify their main outcome before examining the data may be tempted to emphasize whichever result happens to look most impressive.',main:'Researchers may be tempted to emphasize ...',cn:'未在查看数据前明确主要结局的研究者，可能会倾向于强调碰巧看起来最显眼的结果。',focus:'who定语；before；whichever宾语。'},
 {id:'sen-35',text:'It is possible for an intervention to improve average health while at the same time widening the gap between advantaged and disadvantaged groups.',main:'It is possible for an intervention to improve ...',cn:'一种干预可能在改善平均健康水平的同时扩大优势群体与弱势群体之间的差距。',focus:'形式主语it；while同时对比。'},
 {id:'sen-36',text:'The value of a diagnostic test depends partly on the population in which it is used, because disease prevalence affects predictive values.',main:'The value depends partly on the population.',cn:'诊断试验的价值部分取决于其应用人群，因为疾病患病率会影响预测值。',focus:'in which定语；because原因。'},
 {id:'sen-37',text:'Even well-designed studies cannot answer questions that their data were never collected to address.',main:'studies cannot answer questions',cn:'即使设计良好的研究，也无法回答其数据从未被收集来解决的问题。',focus:'that定语；were collected to address目的。'},
 {id:'sen-38',text:'The more uncertain the evidence is, the more important it becomes to distinguish what is known from what is merely assumed.',main:'The more..., the more important it becomes...',cn:'证据越不确定，就越有必要区分已知事实与仅仅假设的内容。',focus:'the more...the more；两个what从句。'},
 {id:'sen-39',text:'While efficiency matters, a system that maximizes total benefit may still be judged unacceptable if the benefits are distributed unfairly.',main:'a system may still be judged unacceptable',cn:'效率固然重要，但一个最大化总收益的系统，如果收益分配不公平，仍可能被认为不可接受。',focus:'while让步；that定语；if条件。'},
 {id:'sen-40',text:'No single indicator can capture every dimension of health, which is why policy decisions often require several measures to be considered together.',main:'No single indicator can capture every dimension of health.',cn:'没有单一指标能够涵盖健康的所有维度，这就是为什么政策决策通常需要综合考虑多个指标。',focus:'which承接前句；why表语从句。'}
);
// V24去重：同一词只保留首条，避免进度统计虚高。
window.ENGLISH_WORDS = window.ENGLISH_WORDS.filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i);

// V25 第一层训练词库扩充（通用学术/阅读高价值词，不标称官方词频表）
window.ENGLISH_WORDS.push(...`
achieve|实现；达到
adapt|适应；改编
adequate|足够的；适当的
administration|管理；行政
admit|承认；准许进入
adopt|采用；收养
advance|推进；进展
advantage|优势
advice|建议
agenda|议程；事项
agree|同意
allow|允许
amount|数量
announce|宣布
annual|每年的
anxiety|焦虑；担忧
apply|应用；申请
argue|论证；争论
argument|论点；争论
arrange|安排
aspect|方面
assist|帮助
attach|附加；重视
attempt|尝试
attitude|态度
avoid|避免
balance|平衡
barrier|障碍
basis|基础；依据
belief|信念；看法
belong|属于
beyond|超出；在……之外
brief|简短的；摘要
broad|广泛的
calculate|计算
campaign|活动；运动
capable|有能力的
career|职业
case|情况；案例
cause|原因；导致
certain|确定的；某些
change|改变
choice|选择
circumstance|情况；环境
claim|声称；主张
clear|清楚的
closely|密切地
code|代码；规范
collect|收集
combination|结合；组合
commercial|商业的
commitment|承诺；投入
communication|沟通
compared|相比的
competitive|竞争性的
complete|完成；完整的
condition|条件；状况
connection|联系
conservative|保守的；谨慎的
constant|持续的；常数
consumer|消费者
contact|联系；接触
contain|包含；控制
contemporary|当代的
continue|继续
contract|合同；收缩
control|控制；对照
create|创造
credit|信用；认可
critical|关键的；批判性的
culture|文化
current|当前的；流动的
decade|十年
decide|决定
decision|决定
decrease|减少
demand|需求；要求
dependent|依赖的
describe|描述
design|设计
despite|尽管
detail|细节
develop|发展；开发
development|发展
difference|差异
difficult|困难的
direct|直接的；指导
discuss|讨论
disease|疾病
display|显示；展示
distance|距离
distinct|不同的；明显的
document|文件；记录
due|到期的；由于
early|早期的
effect|影响；效应
effort|努力
element|要素
elsewhere|在别处
emotional|情绪的
encourage|鼓励
end|结束；目的
energy|能量
engage|参与；吸引
entire|整个的
entry|进入；条目
equal|相等的；平等的
essential|必需的；本质的
event|事件
exact|精确的
examine|检查；研究
example|例子
exist|存在
experience|经验；经历
expert|专家
explain|解释
failure|失败
fair|公平的
familiar|熟悉的
final|最终的
finding|发现；研究结果
force|力量；迫使
form|形式；形成
formal|正式的
frequent|频繁的
function|功能；函数
general|一般的；总体的
goal|目标
growth|增长
habit|习惯
handle|处理
helpful|有帮助的
historical|历史的
human|人的
idea|想法
immediate|立即的
important|重要的
increase|增加
independent|独立的
industry|行业
information|信息
instead|代替；反而
intention|意图
interest|兴趣；利益
international|国际的
introduce|介绍；引入
invest|投资
investigate|调查研究
knowledge|知识
lack|缺乏
language|语言
large|大的
latest|最新的
limit|限制
likely|可能的
link|联系
local|本地的
long-term|长期的
loss|损失
manage|管理
management|管理
material|材料；资料
meaning|意义
mental|精神的；心理的
mention|提及
minimal|最小的
minor|较小的；次要的
modern|现代的
necessary|必要的
normal|正常的
notice|注意；通知
number|数量；数字
obvious|明显的
offer|提供；提议
option|选项
order|顺序；命令
ordinary|普通的
organization|组织
original|最初的；原创的
particular|特定的
pattern|模式
personal|个人的
physical|身体的；物理的
point|观点；点
poor|差的；贫困的
positive|积极的；阳性的
possible|可能的
practice|练习；实践
prefer|更喜欢
prepare|准备
present|当前的；呈现
pressure|压力
prevent|预防
problem|问题
professional|专业的
progress|进步
project|项目
protect|保护
prove|证明
purpose|目的
question|问题
rapid|快速的
reason|原因；推理
recognize|识别；承认
record|记录
relation|关系
remain|保持；仍然
remove|去除
result|结果
review|复习；审查
safe|安全的
scale|规模；尺度
section|部分；章节
serious|严重的
service|服务
simple|简单的
single|单一的
skill|技能
social|社会的
solution|解决方案
study|研究；学习
success|成功
support|支持
system|系统
task|任务
term|术语；期限
test|测试；检验
time|时间
topic|主题
training|训练
understand|理解
useful|有用的
usual|通常的
work|工作
academic|学术的
access|获得；访问
account|说明；账户
accurate|准确的
acknowledge|承认；确认
acquire|获得；习得
actual|实际的
additional|额外的
adjust|调整
administrative|行政的
adult|成年人
adverse|不利的
advocate|提倡；支持者
afford|负担得起
agency|机构；代理
agreement|协议；一致
alternative|替代方案；替代的
ambition|抱负
ambiguous|模糊的
analysis|分析
analyze|分析
anticipate|预期
apparent|明显的；表面的
appeal|吸引；呼吁
application|应用；申请
appropriate|合适的
approximately|大约
arise|出现；产生
assessment|评估
assign|分配；指派
association|关联
assumption|假设
attention|注意力
available|可获得的
average|平均的；平均值
background|背景
basic|基础的
beneficial|有益的
benefit|获益
boundary|边界
capacity|能力；容量
category|类别
challenge|挑战
characteristic|特征
clarity|清晰度
classify|分类
coherent|连贯的
collapse|崩溃
combine|结合
comment|评论
common|常见的
community|社区
compare|比较
compensate|补偿
compete|竞争
complex|复杂的
component|组成部分
comprehensive|全面的
comprise|包含
concentrate|集中
concept|概念
concern|关注；担忧
conclusion|结论
conduct|实施；开展
confidence|信心；置信
confirm|确认
conflict|冲突
consequence|后果
consider|考虑
consistent|一致的
constitute|构成
constraint|限制
consume|消耗；消费
context|语境；背景
contrast|对比
contribute|贡献；促成
controversy|争议
conventional|传统的
convert|转化
convince|说服
core|核心
correspond|对应；通信
crucial|关键的
data|数据
debate|争论；讨论
decline|下降；拒绝
define|定义
demonstrate|证明；展示
derive|获得；源自
detect|发现；探测
determine|决定；测定
device|设备
dimension|维度
discriminate|区分；歧视
distribute|分布；分配
diverse|多样的
domestic|国内的；家庭的
dominant|占主导的
duration|持续时间
economy|经济
efficient|高效的
eliminate|消除
emerge|出现
emphasis|强调
emphasize|强调
enable|使能够
encounter|遇到
enhance|增强
ensure|确保
environment|环境
equivalent|等同的
establish|建立；证实
evaluate|评价
evident|明显的
evolve|演变
exceed|超过
exclude|排除
expand|扩大
explicit|明确的
exploit|利用
factor|因素
feature|特征
feasible|可行的
federal|联邦的
flexible|灵活的
focus|聚焦
framework|框架
fundamental|根本的
generate|产生
global|全球的
grant|授予；资助
guarantee|保证
guideline|指南
highlight|突出
identify|识别
illustrate|说明
impact|影响
implement|实施
imply|暗示
improve|改善
incentive|激励
include|包括
indicate|表明
individual|个体的
inevitable|不可避免的
infer|推断
influence|影响
initial|初始的
innovative|创新的
inspect|检查
integrate|整合
interpret|解释
involve|涉及
issue|问题；发布
justify|证明合理
maintain|维持
major|主要的
mechanism|机制
measure|测量；措施
method|方法
modify|修改
monitor|监测
negative|负面的；阴性的
objective|目标；客观的
obtain|获得
occur|发生
overall|总体的
participate|参与
perceive|感知；认为
period|时期
persist|持续
perspective|视角
potential|潜在的
predict|预测
preliminary|初步的
preserve|保存
primary|主要的；初级的
principle|原则
prior|先前的；优先的
procedure|程序
process|过程
proportion|比例
prospective|前瞻性的
provide|提供
publish|发表
range|范围
react|反应
recover|恢复
reduce|减少
refer|指；参考
reflect|反映
regulate|调节；监管
reject|拒绝
relevant|相关的
reliable|可靠的
require|需要
resource|资源
respond|回应
restrict|限制
retain|保留
reveal|揭示
role|作用
shift|转变
similar|相似的
source|来源
specific|具体的
stable|稳定的
strategy|策略
structure|结构
subsequent|随后的
substantial|大量的；实质的
sufficient|足够的
suggest|表明；建议
sustain|维持
temporary|暂时的
theory|理论
transfer|转移
trend|趋势
underlie|构成基础
unique|独特的
valid|有效的
vary|变化
version|版本
welfare|福利
whereas|然而；而
widespread|广泛的
withdraw|撤回
yield|产生；产量
criterion|标准
distribution|分布
empirical|实证的
external|外部的
internal|内部的
logic|逻辑
parameter|参数
random|随机的
represent|代表
response|反应；回答
statistic|统计量
validity|效度
causality|因果性
diagnosis|诊断
disability|残疾；失能
epidemic|流行；流行病
frequency|频率
hazard|危害；风险
immune|免疫的
infection|感染
infectious|传染性的
medical|医学的
medicine|医学；药物
patient|患者
prognosis|预后
public|公共的
rate|率；速度
relative|相对的
research|研究
resistance|抵抗；耐药
symptom|症状
treatment|治疗
vaccine|疫苗
clinical|临床的
diagnostic|诊断的
effective|有效的
efficacy|效力
ethical|伦理的
follow-up|随访
healthcare|医疗保健
inequality|不平等
informed|知情的
preference|偏好
provider|提供者
recommend|推荐
routine|常规的
urban|城市的
rural|农村的
cost|成本
finance|资金；金融
income|收入
insurance|保险
market|市场
price|价格
productivity|生产率
reform|改革
spending|支出
value|价值
authority|权威；当局
legal|法律的
legislation|立法
regulation|法规；监管
responsibility|责任
rights|权利
standard|标准
transparent|透明的
uncertainty|不确定性
algorithm|算法
artificial|人工的
database|数据库
digital|数字的
model|模型
privacy|隐私
technology|技术
automate|自动化
performance|表现
precision|精确性
replicate|重复验证
robust|稳健的
threshold|阈值
reproducible|可重复的
generalize|推广；泛化
heterogeneous|异质的
adjustment|调整
comparison|比较
significance|显著性
probability|概率
sampling|抽样
variance|方差
median|中位数
correlation|相关
regression|回归
odds|优势比中的优势；可能性
randomized|随机化的
baseline|基线
endpoint|终点
protocol|方案
compliance|依从性
participant|参与者
eligibility|资格；纳入条件
abandon|放弃
abstract|抽象的；摘要
accelerate|加速
accept|接受
accompany|伴随
accomplish|完成
accumulate|积累
adaptation|适应
address|处理；地址
adequacy|充分性
adjacent|相邻的
adjustment|调整
administer|管理；给予（药物）
admission|进入；录取
advancement|进步
advocate|主张；提倡
allocate|分配
alter|改变
analogy|类比
annual|年度的
anticipation|预期
appealing|有吸引力的
arbitrary|任意的；武断的
architecture|结构；体系
arise|产生
articulate|清楚表达
assemble|集合；装配
assert|断言
asset|资产；优势
attain|达到
attribute|归因于；属性
automatic|自动的
available|可用的
awareness|意识
behalf|代表；利益
bias|偏倚；偏见
boost|提升
broaden|拓宽
capability|能力
capture|捕捉；体现
cease|停止
cite|引用
coincide|同时发生；一致
collaborate|合作
collective|集体的
compatible|兼容的；一致的
compel|迫使
complication|并发症；复杂情况
comply|遵守
conceal|隐藏
concede|承认；让步
conceive|构想；理解
concentrated|集中的
concurrent|同时发生的
confer|授予；商议
confine|限制
confront|面对
consensus|共识
consecutive|连续的
considerable|相当大的
consist|由……组成
constant|恒定的
consult|咨询
contaminate|污染
contemplate|考虑
contradict|反驳；矛盾
contrary|相反的
coordinate|协调
credible|可信的
cumulative|累积的
decisive|决定性的
deduce|推断
deficiency|缺乏；不足
deliberate|故意的；深思熟虑的
depict|描述；描绘
deprive|剥夺
detectable|可检测的
devote|投入；奉献
diminish|减少
disclose|披露
discrete|离散的；分开的
displace|取代；移位
disrupt|扰乱
distinguish|区分
diverge|分歧；偏离
dynamic|动态的
elaborate|详细说明；复杂的
embed|嵌入
emission|排放；发射
endure|持续；忍受
enforce|执行；强制
engagement|参与
enormous|巨大的
equity|公平
exaggerate|夸大
exception|例外
excess|过量；超过
exert|施加
exposure|暴露
facilitate|促进
fluctuate|波动
formulate|制定；表述
foster|促进；培养
fragment|碎片；分割
fulfill|履行；实现
hinder|妨碍
implicit|含蓄的；隐含的
incorporate|纳入；合并
indispensable|不可缺少的
inherent|内在的
inhibit|抑制
insight|洞见
intense|强烈的
interact|相互作用
intermediate|中间的
intervene|干预
intrinsic|内在的
isolate|隔离；分离
legitimate|合法的；合理的
mediate|调解；介导
negligible|可忽略的
notion|概念；看法
obscure|模糊的；使难理解
occupy|占据
offset|抵消
ongoing|持续进行的
orient|使适应；定位
outweigh|超过；胜过
precede|先于
predominant|占主导的
profound|深刻的
prohibit|禁止
prominent|突出的
prompt|促使；提示
pursue|追求
quantify|量化
radical|根本的；激进的
reinforce|加强
reluctant|不情愿的
resolve|解决；决心
respective|各自的
restore|恢复
rigorous|严格的
scarce|稀缺的
scope|范围
sequence|顺序
simultaneous|同时的
skeptical|怀疑的
sophisticated|复杂精密的
specify|明确说明
stimulate|刺激；促进
straightforward|直接的；容易理解的
substitute|替代
suppress|抑制
surpass|超过
tackle|处理；应对
tentative|暂定的；试探性的
trigger|触发
ultimately|最终
undermine|削弱
uniform|一致的；统一的
unprecedented|前所未有的
verify|验证
viable|可行的
vulnerable|易受伤害的
warrant|证明……有必要；保证
willing|愿意的
`.trim().split('\n').map((line)=>{const [w,m]=line.split('|');return [w,m,`In academic reading, ${w} often carries this meaning: ${m}.`]}));
window.ENGLISH_WORDS = window.ENGLISH_WORDS.filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i);

window.ENGLISH_WORDS.push(...`
abolish|废除
absorb|吸收；理解
abundant|丰富的
abuse|滥用
accelerator|加速器
accessible|可获得的；易接近的
accident|事故
accommodate|容纳；适应
accord|一致；协议
accountable|负有责任的
accurately|准确地
adaptable|适应性强的
adequately|充分地
adjacent|相邻的
adolescent|青少年的；青少年
advisory|咨询的
aggregate|汇总；总计
alleviate|缓解
amend|修改
analogous|类似的
anomaly|异常
applicable|适用的
appraisal|评价
approximation|近似
artificially|人为地
ascribe|归因于
assemble|集合；装配
attainable|可达到的
availability|可用性
balanced|平衡的
benchmark|基准
biological|生物学的
bottleneck|瓶颈
breakthrough|突破
calculate|计算
candidate|候选者；候选的
capability|能力
casualty|伤亡人员
certainty|确定性
chronic|慢性的
clarification|澄清
classical|经典的
coexist|共存
cohort|队列
coincidence|巧合；同时发生
collaboration|合作
commence|开始
comparable|可比较的
compatibility|兼容性
competence|能力；胜任
complement|补充；补足
complexity|复杂性
compulsory|强制的
conceivable|可想象的
conception|概念；构想
conditional|有条件的
configuration|配置；结构
conform|符合
conservation|保护；守恒
consideration|考虑因素
consistency|一致性
constitutive|构成的
consultation|咨询
contingent|取决于……的；临时的
continuity|连续性
contradiction|矛盾
contributor|贡献者；促成因素
controversial|有争议的
converge|趋同
coordination|协调
corresponding|相应的
credible|可信的
criterion|标准
cumulative|累积的
defect|缺陷
definitive|明确的；最终的
delivery|交付；实施
density|密度
dependency|依赖
deteriorate|恶化
deviation|偏差
diffuse|扩散；分散
dilemma|困境
disadvantage|劣势
distributional|分配上的
diversity|多样性
documented|有记录的
durable|持久的
dynamic|动态的
economic|经济的
elementary|基础的
emergency|紧急情况
empirical|实证的
enforcement|执行；强制
engaged|参与的
ethical|伦理的
excessive|过度的
experimental|实验性的
explanatory|解释性的
feasibility|可行性
finite|有限的
flexibility|灵活性
formulation|表述；制定
functional|功能性的
gradual|逐渐的
heterogeneity|异质性
hierarchy|层级
hypothesis|假设
identifiable|可识别的
imprecision|不精确
incidental|附带的；偶然的
indicator|指标
inequality|不平等
infrastructure|基础设施
innovation|创新
institution|机构；制度
institutional|机构的；制度的
integrity|完整性；诚信
intensity|强度
interaction|相互作用
interdisciplinary|跨学科的
interpretation|解释
intervention|干预
intuitive|直观的
irrelevant|不相关的
magnitude|大小；程度
mandatory|强制的
marginal|边缘的；微小的
measurable|可测量的
methodology|方法学
misleading|误导性的
monitoring|监测
multidisciplinary|多学科的
necessity|必要性
neutral|中立的
observable|可观察的
operational|操作性的
optimization|优化
outcome|结局
parallel|平行的；同时的
persistent|持续的
plausible|合理的；似乎可信的
policy|政策
practical|实际的
precaution|预防措施
predictive|预测性的
priority|优先事项
probable|很可能的
professionalism|专业精神
projection|预测；投影
protocol|方案
qualitative|定性的
quantitative|定量的
randomization|随机化
rationale|理由；原理
realistic|现实的
reassessment|重新评估
recall|回忆；召回
recipient|接受者
reduction|减少
reference|参考；基准
relevance|相关性
reliability|可靠性
replacement|替代
representative|有代表性的
requirement|要求
resilience|恢复力；韧性
restriction|限制
retrospective|回顾性的
safeguard|保护措施
scenario|情景
selective|选择性的
sensitivity|灵敏度
specificity|特异度
stability|稳定性
statistical|统计学的
subgroup|亚组
supervision|监督
surveillance|监测
sustainable|可持续的
systematic|系统的
tolerance|耐受；容忍
trace|追踪；痕迹
transparency|透明度
uncertain|不确定的
underestimate|低估
utilize|利用
validity|效度
variation|变异
verification|验证
voluntary|自愿的
welfare|福利
workload|工作量
workforce|劳动力
acceptance|接受；认可
accountability|问责；责任
adaptation|适应
allocation|分配
applicability|适用性
approximate|近似的
assessable|可评估的
attribution|归因
beneficiary|受益者
calibration|校准
categorical|分类的
causal|因果的
coherence|连贯性
compliance|依从性
confounding|混杂
connectivity|连接性
consumption|消耗；消费
contextual|语境的；情境的
correlation|相关
diagnostic|诊断的
discrimination|区分能力；歧视
effectiveness|有效性
endpoint|终点
equitable|公平的
estimation|估计
evaluation|评价
extrapolate|外推
framework|框架
generalization|推广；泛化
implementation|实施
incidence|发病率
inference|推断
interpreter|解释者
measurement|测量
mortality|死亡率
prevalence|患病率
randomized|随机化的
screening|筛查
significant|显著的
standardization|标准化
variability|变异性
`.trim().split('\n').map((line)=>{const [w,m]=line.split('|');return [w,m,`In academic reading, ${w} often carries this meaning: ${m}.`]}));
window.ENGLISH_WORDS = window.ENGLISH_WORDS.filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i);

// V26｜英语一阅读能力建设：原创中长阅读（非历年真题）
window.ENGLISH_LONG_READINGS = [
{
 id:'lr-01', title:'中长阅读01｜医疗AI与外部验证',
 text:`Hospitals are increasingly interested in artificial intelligence systems that can identify abnormalities in medical images. A system may appear impressive when tested on data from the hospital where it was developed, yet that success does not guarantee equal performance elsewhere. Patient populations differ, scanners are configured differently, and clinical workflows vary. Even the way a disease is recorded in a database can change from one institution to another.\n\nFor this reason, researchers distinguish internal performance from external validity. Internal testing asks whether a model works on data similar to those used during development. External validation asks a harder question: does the model still work when the setting changes? A decline in performance outside the original hospital does not necessarily mean that the technology is useless. It may instead reveal that the model learned local patterns that were mistaken for general ones.\n\nThe practical lesson is not that hospitals should reject artificial intelligence until every uncertainty disappears. No medical technology enters practice with perfect knowledge. Rather, adoption should be accompanied by monitoring. Hospitals need to know whether errors are concentrated in particular patient groups, whether clinicians respond appropriately to warnings, and whether the system improves outcomes that matter rather than merely producing technically attractive scores. A useful tool is therefore not simply one that performs well in a laboratory. It is one whose benefits remain meaningful when the tool meets the complexity of real clinical care.`,
 qs:[
  {q:'Why may a model perform worse at another hospital?',opts:['Because all AI systems become slower over time','Because populations, equipment and workflows may differ','Because external validation removes useful data','Because medical images cannot be compared'],a:1,reason:'定位',explain:'第一段直接列出 patient populations、scanners、workflows 等差异。'},
  {q:'The phrase “a harder question” refers to whether the model:',opts:['can be made more expensive','works when the setting changes','uses enough computer memory','was developed by clinicians'],a:1,reason:'指代',explain:'冒号后的问句就是 harder question 的具体内容。'},
  {q:'The author’s view of AI adoption is best described as:',opts:['complete rejection','unconditional enthusiasm','cautious adoption with monitoring','indifference to clinical outcomes'],a:2,reason:'态度',explain:'第三段明确说不是拒绝，而是 adoption should be accompanied by monitoring。'},
  {q:'Which is the best title?',opts:['Why Every Hospital Needs the Same Scanner','From Laboratory Performance to Clinical Value','The End of Medical Imaging','How to Eliminate All Uncertainty'],a:1,reason:'主旨',explain:'全文核心是从内部表现、外部验证走向真实临床价值。'}
 ]
},
{
 id:'lr-02', title:'中长阅读02｜筛查并非越早越好',
 text:`The appeal of screening is easy to understand. If disease can be found before symptoms appear, treatment may begin earlier and outcomes may improve. This logic is powerful, but incomplete. Earlier diagnosis is beneficial only when finding disease sooner changes what can be done for the patient.\n\nOne difficulty is overdiagnosis. Some abnormalities detected by screening would never have caused symptoms or shortened a person's life. Once discovered, however, they may lead to additional tests, anxiety, and treatment. These consequences are real even when the original abnormality was harmless. Screening can therefore increase the number of diagnoses without producing an equal increase in meaningful health benefits.\n\nAnother difficulty is that survival time after diagnosis can appear longer simply because the disease was detected earlier. Imagine two patients whose disease begins and ends at the same biological times. If one is diagnosed two years earlier through screening, measured survival from diagnosis increases by two years even if the date of death is unchanged. This phenomenon is one reason researchers prefer outcomes such as disease-specific mortality when evaluating screening programs.\n\nNone of this means that screening is generally ineffective. Many screening programs can save lives. The point is that the value of a program must be judged by a balance of benefits and harms, not by the number of abnormalities discovered or by the apparent length of survival after diagnosis.`,
 qs:[
  {q:'According to the passage, earlier diagnosis is beneficial when it:',opts:['always increases the number of diagnoses','changes what can be done for the patient','makes every abnormality dangerous','guarantees longer measured survival'],a:1,reason:'定位',explain:'第一段末句给出限定条件。'},
  {q:'Overdiagnosis refers to detecting abnormalities that:',opts:['would never have caused meaningful harm','are always fatal','cannot be seen by screening','occur only after treatment'],a:0,reason:'词义',explain:'第二段第一、二句定义了 overdiagnosis。'},
  {q:'The two-patient example is used to show that:',opts:['screening always prevents death','earlier diagnosis can lengthen measured survival without changing death time','disease-specific mortality is useless','all patients have identical disease'],a:1,reason:'例证',explain:'例子说明诊断时间提前会造成表面生存期延长。'},
  {q:'The main argument is that screening should be evaluated by:',opts:['the number of abnormalities found','how early diagnosis occurs','a balance of meaningful benefits and harms','patient anxiety alone'],a:2,reason:'主旨',explain:'最后一段总结全文。'}
 ]
},
{
 id:'lr-03', title:'中长阅读03｜统计显著与实际意义',
 text:`A statistically significant result often receives more attention than a non-significant one. The distinction is useful, but it can become misleading when significance is treated as a synonym for importance. A P value is influenced not only by the size of an effect but also by the amount and variability of the data. With a sufficiently large sample, a very small difference may become statistically significant.\n\nConsider a treatment that reduces the average duration of a minor symptom by several minutes. In a study involving hundreds of thousands of participants, that difference might produce a very small P value. The calculation would not be wrong. The more important question would be whether patients consider the improvement worth the treatment's cost, inconvenience, or adverse effects.\n\nThe opposite problem also occurs. A small study may observe a potentially important difference but fail to reach conventional statistical significance because its estimate is imprecise. Treating such a result as proof that there is “no effect” would go beyond what the data show. Confidence intervals can help because they display a range of values compatible with the observations and therefore make uncertainty more visible.\n\nGood interpretation consequently requires several questions at once: How large is the estimated effect? How precise is it? Is the study design credible? Does the outcome matter? Statistical significance can contribute to these judgments, but it cannot replace them.`,
 qs:[
  {q:'Why can a tiny effect become statistically significant?',opts:['A sufficiently large sample can make estimates precise','Tiny effects are always important','P values measure patient preference','Large samples remove all bias'],a:0,reason:'因果',explain:'第一段说明 P 值同时受效应大小、数据量和变异影响。'},
  {q:'The symptom-duration example mainly shows that:',opts:['a small P value may accompany a practically trivial effect','minor symptoms should never be treated','large studies are scientifically invalid','cost is part of the P value'],a:0,reason:'例证',explain:'例子用来区分统计显著与实际/临床意义。'},
  {q:'A non-significant result in a small study:',opts:['proves there is no effect','may still be compatible with an important effect','must be caused by fraud','cannot have a confidence interval'],a:1,reason:'推断',explain:'第三段明确指出小研究可能因不精确而未显著。'},
  {q:'The author recommends interpreting significance together with:',opts:['effect size, precision, design and outcome importance','sample size only','the title of the journal','whether the result is positive'],a:0,reason:'主旨',explain:'末段列出四个并行问题。'}
 ]
},
{
 id:'lr-04', title:'中长阅读04｜健康信息为什么不等于健康行为',
 text:`Public health campaigns often begin with a reasonable assumption: people need information in order to make informed choices. Yet information alone frequently produces less behavior change than planners expect. A person may know that regular exercise reduces disease risk and still be unable to exercise safely near home. Another may understand nutritional advice but face prices, work schedules, or family responsibilities that make the recommended diet difficult to follow.\n\nThis does not make education pointless. Information can correct false beliefs, make risks visible, and help people recognize opportunities for change. The problem arises when failure to change is interpreted simply as a failure to understand. Such an interpretation places the entire responsibility on individuals and hides the conditions that shape their choices.\n\nEffective programs therefore often combine education with changes in the environment. A city may provide safe walking routes; an employer may alter working arrangements; a school may change the food it offers. These interventions do not remove individual choice. Instead, they change the set of choices that are realistically available.\n\nThe broader lesson is that behavior is produced by both persons and contexts. Policies that focus only on knowledge risk blaming individuals for constraints they cannot easily control, while policies that ignore knowledge may leave people unable to use new opportunities. The challenge is not to choose between education and environment, but to design them so that each supports the other.`,
 qs:[
  {q:'Why may informed people fail to follow health advice?',opts:['They always reject scientific evidence','Environmental and practical constraints may limit choices','Information has no value','Healthy behavior requires no time or money'],a:1,reason:'定位',explain:'第一段列举安全环境、价格、工作安排、家庭责任。'},
  {q:'The author says education is:',opts:['pointless','useful but insufficient by itself','harmful in most cases','a replacement for environmental change'],a:1,reason:'态度',explain:'第二段明确 This does not make education pointless。'},
  {q:'Changing walking routes or school food mainly aims to:',opts:['remove all individual choice','change realistically available choices','test vocabulary knowledge','reduce the need for public policy'],a:1,reason:'定位',explain:'第三段直接说明 change the set of choices realistically available。'},
  {q:'The final paragraph argues for:',opts:['education instead of environment','environment instead of education','combining knowledge and supportive contexts','placing responsibility only on individuals'],a:2,reason:'主旨',explain:'最后一句是全文结论。'}
 ]
},
{
 id:'lr-05', title:'中长阅读05｜科研中的阴性结果',
 text:`Scientific journals have traditionally found positive findings easier to publish than negative ones. A study reporting a striking difference may seem more interesting than one concluding that two approaches performed similarly. Yet this preference can distort the evidence available to researchers, clinicians, and policy makers.\n\nSuppose ten careful studies test the same treatment. By chance alone, one may produce an unusually favorable result while the others show little difference. If the favorable study is published and most of the others remain unseen, readers receive a misleading picture. The problem is not that the published study must be fraudulent; its result may be entirely genuine as an observation. The distortion arises because the visible evidence is not representative of all the evidence produced.\n\nSeveral responses have been proposed. Trial registration can create a public record before results are known. Journals can evaluate studies partly on the importance of the question and the quality of the methods rather than on whether the findings are exciting. Researchers can also report prespecified outcomes instead of selecting only the most favorable analyses after seeing the data.\n\nThese practices cannot guarantee perfect objectivity. They can, however, make selective visibility harder. In science, an unexciting result may still be highly informative, especially when it prevents future decisions from being based on an exaggerated estimate of benefit.`,
 qs:[
  {q:'What problem can preference for positive findings create?',opts:['It can make visible evidence unrepresentative','It makes every positive study fraudulent','It prevents all trials from being registered','It eliminates random variation'],a:0,reason:'主旨',explain:'全文围绕 publication/selective visibility 造成证据偏斜。'},
  {q:'In the ten-study example, the favorable study:',opts:['must be fraudulent','may be genuine but misleading when seen alone','proves the treatment works','should never be published'],a:1,reason:'例证',explain:'第二段明确说不一定造假，问题是可见证据不代表全部证据。'},
  {q:'Trial registration helps mainly by:',opts:['creating a record before results are known','guaranteeing significant results','increasing treatment effects','removing the need for journals'],a:0,reason:'定位',explain:'第三段第一项措施。'},
  {q:'The author regards negative results as:',opts:['scientifically useless','potentially informative','evidence of poor methods','less ethical than positive results'],a:1,reason:'态度',explain:'末句明确 unexciting result may still be highly informative。'}
 ]
},
{
 id:'lr-06', title:'中长阅读06｜公平与效率的政策取舍',
 text:`Health systems have limited resources, so policy makers often ask how to produce the greatest health benefit from the money available. This concern with efficiency is unavoidable. A system that wastes resources may leave fewer services for everyone. But efficiency is not the only value involved in public decisions.\n\nImagine that a new program produces a large total health gain because it mainly benefits people who already have good access to care. Another program produces a somewhat smaller total gain but reaches communities with severe unmet needs. If policy makers look only at the total number of health units gained, the first program may appear superior. If they also care about reducing unfair differences, the second may deserve greater weight.\n\nThere is no simple formula that automatically resolves such choices. Measures of cost-effectiveness can make trade-offs clearer, but the final decision also depends on judgments about fairness, priority, and responsibility. These judgments should not be hidden inside technical calculations as if they were purely mathematical facts.\n\nTransparency is therefore important. A defensible policy should explain not only what outcome is expected but also whose outcomes are counted, how benefits and burdens are distributed, and why one trade-off was accepted rather than another. Efficiency helps answer what can be achieved with limited resources; equity asks how those achievements are shared.`,
 qs:[
  {q:'Why is efficiency important according to paragraph 1?',opts:['Resources are limited and waste can reduce services','Efficiency guarantees fairness','Public decisions involve no other values','It removes the need for priorities'],a:0,reason:'定位',explain:'第一段从资源有限解释效率的重要性。'},
  {q:'The two-program example shows that:',opts:['the largest total gain is always best','efficiency and equity can point toward different choices','unmet need cannot be measured','cost-effectiveness is useless'],a:1,reason:'例证',explain:'例子故意设置总收益与公平目标的张力。'},
  {q:'The author says judgments about fairness should be:',opts:['hidden in calculations','made explicit rather than disguised as pure mathematics','left entirely to computers','ignored when resources are limited'],a:1,reason:'态度',explain:'第三段最后一句直接表达作者立场。'},
  {q:'The final sentence contrasts efficiency with equity by asking:',opts:['how much can be achieved vs how achievements are shared','science vs politics','hospitals vs communities','cost vs time only'],a:0,reason:'主旨',explain:'末句直接定义两者关注点。'}
 ]
},
{
 id:'lr-07', title:'中长阅读07｜专家为何要表达不确定性',
 text:`People sometimes expect experts to speak with certainty, especially during emergencies. Clear guidance is indeed valuable when decisions must be made quickly. But certainty can be misleading when the evidence is incomplete or changing. If experts present an early estimate as unquestionable fact and later revise it, the public may interpret the revision as incompetence or dishonesty.\n\nAn alternative is to communicate uncertainty from the beginning. This does not mean listing every imaginable possibility or refusing to recommend action. It means explaining what is known, what remains uncertain, and what new information could change the recommendation. Such communication can be difficult because probabilities and ranges are less memorable than simple claims.\n\nThere is also a danger in the opposite direction. Constantly emphasizing uncertainty can make useful evidence sound worthless. A recommendation may be reasonable even when it is not certain. The relevant question is whether the available evidence is strong enough for the decision that must be made, not whether all doubt has disappeared.\n\nTrust therefore depends partly on calibration: confidence should match the strength of evidence. Experts who acknowledge meaningful uncertainty while still explaining the basis for action may appear less dramatic, but they give the public a more accurate picture of how knowledge develops.`,
 qs:[
  {q:'Why can excessive certainty damage trust?',opts:['Later revisions may look like incompetence or dishonesty','People dislike all clear guidance','Evidence never changes','Experts should avoid recommendations'],a:0,reason:'因果',explain:'第一段末句给出因果链。'},
  {q:'Communicating uncertainty means:',opts:['refusing to act','explaining knowns, unknowns and what could change advice','listing every imaginable event','using only numerical probabilities'],a:1,reason:'定位',explain:'第二段明确给出定义。'},
  {q:'What is the danger of emphasizing uncertainty too much?',opts:['Useful evidence may sound worthless','All recommendations become certain','People will remember ranges better','Evidence becomes stronger'],a:0,reason:'定位',explain:'第三段第一、二句。'},
  {q:'“Calibration” most nearly means that:',opts:['confidence should fit evidence strength','experts should always sound confident','recommendations should never change','uncertainty should be hidden'],a:0,reason:'词义',explain:'冒号后直接解释 calibration。'}
 ]
},
{
 id:'lr-08', title:'中长阅读08｜技术替代还是重新分工',
 text:`Predictions that technology will “replace” professionals often treat work as if it were a single task. In reality, most occupations contain many activities: collecting information, recognizing patterns, explaining choices, coordinating with others, and taking responsibility when outcomes are uncertain. A technology may automate some of these activities while increasing the importance of others.\n\nConsider a diagnostic system that rapidly identifies suspicious images. If it reduces the time clinicians spend on routine screening, clinicians may devote more attention to difficult cases or to conversations with patients. But the technology may also create new work: checking unusual outputs, resolving disagreements between human and machine judgments, and monitoring whether performance changes over time.\n\nThe effect on employment therefore depends not only on what machines can do but also on how organizations redesign work around them. If a hospital simply adds a new system without changing responsibilities, workload may even increase. If tasks are deliberately reorganized, the same system might reduce repetitive work while preserving meaningful human oversight.\n\nThe more useful question is consequently not whether technology replaces a profession in the abstract. It is which tasks can be automated safely, which tasks still require human judgment, and how responsibility should be assigned when decisions are shared between people and machines.`,
 qs:[
  {q:'The author criticizes replacement predictions because they:',opts:['treat work as a single task','assume technology is expensive','focus too much on patients','ignore routine screening only'],a:0,reason:'主旨',explain:'第一句直接提出批评。'},
  {q:'A diagnostic system may create new work such as:',opts:['monitoring unusual outputs and disagreements','eliminating all responsibility','preventing performance changes','removing patient communication'],a:0,reason:'定位',explain:'第二段后半列出新增任务。'},
  {q:'Employment effects depend partly on:',opts:['how organizations redesign work','whether images are colorful','the age of the hospital building','whether all tasks are automated'],a:0,reason:'定位',explain:'第三段首句。'},
  {q:'The author prefers asking:',opts:['whether an entire profession disappears','which tasks can be automated safely and how responsibility is shared','whether machines are intelligent','how to avoid all technology'],a:1,reason:'主旨',explain:'最后一段给出替代问题。'}
 ]
},
{
 id:'lr-09', title:'中长阅读09｜为什么更多数据不一定更好',
 text:`Large data sets are often treated as a cure for uncertainty. With enough observations, researchers can estimate small differences with impressive precision. Yet precision is not the same as validity. A very large sample can produce a narrow confidence interval around an estimate that is systematically wrong.\n\nOne source of trouble is selection. Data collected from people who use a particular app, visit a certain hospital, or agree to participate may not represent the population about which researchers wish to make claims. Increasing the number of such participants reduces random error but does not automatically repair the selection process.\n\nMeasurement creates a similar problem. If an inexpensive sensor records the same quantity incorrectly in thousands of people, the resulting database may be internally consistent and still misleading. More observations cannot compensate for a badly defined outcome or a biased instrument.\n\nThe practical lesson is not that large data sets are unhelpful. They can reveal patterns that smaller studies would miss. But researchers should ask how the data were generated before asking how many records they contain. Sample size answers a question about quantity; study design and measurement determine whether the quantity deserves confidence.`,
 qs:[
  {q:'The main distinction in paragraph 1 is between:',opts:['precision and validity','cost and speed','samples and populations','apps and hospitals'],a:0,reason:'主旨',explain:'首段明确指出 precision is not the same as validity。'},
  {q:'Increasing a selected sample mainly reduces:',opts:['selection bias automatically','random error','measurement bias completely','the need for study design'],a:1,reason:'定位',explain:'第二段指出增加样本量可降低随机误差，但不会自动修复选择过程。'},
  {q:'The sensor example is used to show that:',opts:['large databases are always reliable','measurement bias can remain despite many observations','cheap sensors should never be used','internal consistency proves validity'],a:1,reason:'例证',explain:'第三段用传感器说明大量观测不能补偿有偏测量。'},
  {q:'The author would most likely advise researchers to:',opts:['count records before examining design','examine how data were generated','avoid all large data sets','prefer narrow intervals regardless of bias'],a:1,reason:'态度',explain:'末段直接提出先问数据如何产生。'}
 ]
},
{
 id:'lr-10', title:'中长阅读10｜默认选项如何改变行为',
 text:`People often assume that a choice reflects a stable preference. Behavioral research, however, shows that the way options are presented can influence what people select. One powerful example is the default: the option that takes effect when a person does nothing.\n\nDefaults matter partly because changing them requires effort, even when that effort is small. They may also be interpreted as a recommendation from the institution that designed the choice. In retirement plans, organ-donation systems, and digital privacy settings, default rules have sometimes produced large differences in participation.\n\nThis influence creates an ethical question. A default can help people reach outcomes they already say they want, such as saving more for the future. But it can also steer them toward an outcome that mainly benefits the organization. The fact that a design changes behavior does not by itself tell us whether the design is justified.\n\nA useful standard is therefore transparency combined with easy exit. People should be able to understand the default, change it without unreasonable difficulty, and know whose interests the design serves. Choice architecture is unavoidable; the challenge is to design it without pretending that influence and manipulation are the same thing.`,
 qs:[
  {q:'A default is defined as:',opts:['the most popular option','the option applied when no action is taken','an illegal form of influence','a stable preference'],a:1,reason:'定位',explain:'第一段冒号后给出定义。'},
  {q:'Defaults may work because people:',opts:['always understand them fully','face some effort in changing them and may see them as recommendations','have no preferences','cannot leave digital systems'],a:1,reason:'因果',explain:'第二段给出两个机制。'},
  {q:'The ethical problem arises because defaults can:',opts:['only help users','serve either users or organizations','never change behavior','eliminate choice architecture'],a:1,reason:'推断',explain:'第三段对比帮助用户与主要利于机构。'},
  {q:'The author favors defaults that are:',opts:['hidden and difficult to change','transparent and easy to exit','identical in every setting','free from all influence'],a:1,reason:'态度',explain:'末段首句明确标准。'}
 ]
},
{
 id:'lr-11', title:'中长阅读11｜相关性为什么容易被误读',
 text:`When two variables move together, it is tempting to tell a causal story. People who exercise more may report better health; neighborhoods with more trees may have lower summer temperatures. Such associations are useful clues, but they do not identify a cause by themselves.\n\nOne reason is confounding. A third factor may influence both the supposed cause and the outcome. People with higher incomes, for example, may have more opportunities to exercise and better access to health care. If income is not considered, part of the observed relationship between exercise and health may be attributed to the wrong mechanism.\n\nReverse causation is another possibility. Better health may enable people to exercise more, rather than exercise being the only reason they are healthier. In many observational studies, both directions may operate at the same time.\n\nResearchers use design and analysis to strengthen causal claims, but no statistical adjustment can rescue every weak design. The key habit is to separate the observation—two variables are associated—from the explanation of why. Causal conclusions require additional assumptions and evidence, not simply a smaller P value.`,
 qs:[
  {q:'The passage mainly warns against:',opts:['using observational data at all','turning association directly into causation','studying exercise','reporting P values'],a:1,reason:'主旨',explain:'全文围绕“相关不等于因果”。'},
  {q:'Income is introduced as an example of:',opts:['reverse causation','confounding','randomization','measurement error'],a:1,reason:'例证',explain:'第二段明确说明第三因素同时影响暴露和结局。'},
  {q:'Reverse causation in the example means:',opts:['exercise prevents income','better health may lead to more exercise','income causes all disease','trees increase temperature'],a:1,reason:'定位',explain:'第三段直接解释。'},
  {q:'A smaller P value alone:',opts:['proves a causal mechanism','does not establish causation','removes confounding','reverses the exposure'],a:1,reason:'推断',explain:'末句明确因果需要额外假设和证据。'}
 ]
},
{
 id:'lr-12', title:'中长阅读12｜为什么反馈要及时但不能太多',
 text:`Feedback is essential for learning because learners need information about the gap between their current performance and the desired standard. Yet simply increasing the amount of feedback does not guarantee faster improvement. When comments arrive on every small action, learners may begin to depend on external correction instead of monitoring their own work.\n\nTiming also matters. Immediate feedback is useful when a learner is acquiring a new procedure and needs to prevent repeated errors. For more complex tasks, however, a short delay can encourage the learner to retrieve the rule, inspect the result, and attempt self-correction before seeing the answer.\n\nThe content of feedback is equally important. Saying only “wrong” identifies failure but not its cause. Effective feedback points to the process: perhaps the learner misunderstood the question, selected the wrong formula, or failed to check an assumption. This makes the next attempt different from the previous one.\n\nGood feedback therefore supports independence rather than replacing it. Its purpose is not to make every practice attempt painless. It should help learners develop an internal standard so that, over time, they can detect and correct more of their own errors.`,
 qs:[
  {q:'Too much feedback may cause learners to:',opts:['become dependent on external correction','forget the desired standard entirely','avoid all procedures','learn faster automatically'],a:0,reason:'因果',explain:'第一段末句。'},
  {q:'A short feedback delay can be useful because it encourages:',opts:['guessing','self-correction and retrieval','more external help','ignoring errors'],a:1,reason:'定位',explain:'第二段后半。'},
  {q:'Effective feedback should identify:',opts:['only whether an answer is wrong','the process that produced the error','the learner’s personality','the easiest future question'],a:1,reason:'定位',explain:'第三段强调错误过程。'},
  {q:'The passage views the ultimate purpose of feedback as:',opts:['making practice painless','building independent error detection','providing constant correction','removing difficult tasks'],a:1,reason:'主旨',explain:'末段总结为支持独立性。'}
 ]
},
{
 id:'lr-13', title:'中长阅读13｜公共风险中的相对数与绝对数',
 text:`Risk information can sound very different depending on how it is expressed. Suppose an event occurs in one person out of 10,000 without an exposure and in two people out of 10,000 with it. One description says the risk has doubled. Another says the absolute increase is one additional case per 10,000 people. Both statements are mathematically correct.\n\nProblems arise when only one form is presented. A large relative increase may create alarm when the baseline risk is tiny. Conversely, a small relative change can still matter greatly when an outcome is common or severe. Good communication therefore requires attention to both the baseline and the change.\n\nThe same principle applies to benefits. Saying that a treatment reduces risk by 50 percent is difficult to interpret without knowing whether the untreated risk is 20 percent or 0.2 percent. Absolute numbers help people understand the scale of the expected benefit, while relative measures can make comparisons across groups easier.\n\nNeither format should automatically replace the other. The goal is to prevent a mathematically valid statement from producing a misleading impression. Presenting compatible absolute and relative measures gives readers more of the information needed to judge importance for themselves.`,
 qs:[
  {q:'In the opening example, the absolute increase is:',opts:['100 percent','one additional case per 10,000','two additional cases per 10,000','10,000 cases'],a:1,reason:'计算理解',explain:'2/10000减1/10000=1/10000。'},
  {q:'A large relative increase can be misleading when:',opts:['baseline risk is very small','the outcome is severe','absolute numbers are also shown','two measures agree'],a:0,reason:'定位',explain:'第二段明确指出。'},
  {q:'Why does the author mention a 50 percent treatment effect?',opts:['To show relative benefit needs baseline context','To prove all treatments work','To reject absolute measures','To compare hospitals'],a:0,reason:'例证',explain:'第三段用例子说明缺少基线无法判断实际幅度。'},
  {q:'The author recommends:',opts:['using relative measures only','using absolute measures only','presenting both when useful','avoiding numerical risk communication'],a:2,reason:'态度',explain:'末段主张兼容呈现两类指标。'}
 ]
},
{
 id:'lr-14', title:'中长阅读14｜模型为什么需要外部验证',
 text:`A prediction model can perform impressively on the data used to develop it and still fail elsewhere. During development, researchers repeatedly choose variables, thresholds, and model forms that fit the available sample. Some of those choices capture real structure; others capture accidental features of that particular data set.\n\nTesting the model on new data helps distinguish the two. If performance remains strong in a different hospital, time period, or patient group, confidence in generalizability increases. If performance falls sharply, the model may have been overfitted or may depend on conditions that do not exist in the new setting.\n\nExternal validation is not a ceremonial final step. It can reveal changes in disease prevalence, measurement practice, patient characteristics, or clinical workflow. A model may also remain good at ranking patients while becoming poorly calibrated, meaning that its predicted probabilities no longer match observed frequencies.\n\nFor this reason, deployment should be treated as the beginning of continued evaluation rather than the end of research. Models operate inside changing systems. Their usefulness depends not only on how well they once performed but also on whether they continue to perform for the people and decisions they currently serve.`,
 qs:[
  {q:'Why can development performance be misleading?',opts:['Some fitted patterns may be accidental','New data are always smaller','Hospitals prohibit prediction','Thresholds cannot be chosen'],a:0,reason:'因果',explain:'第一段末句区分真实结构与偶然特征。'},
  {q:'External validation tests whether performance:',opts:['is preserved in new settings','was statistically significant once','uses more variables','requires no calibration'],a:0,reason:'定位',explain:'第二段首句与后文。'},
  {q:'Poor calibration means:',opts:['ranking is impossible','predicted probabilities do not match observed frequencies','the sample is too large','the model has no variables'],a:1,reason:'词义',explain:'第三段直接定义。'},
  {q:'The final paragraph argues that deployment should:',opts:['end evaluation','begin continued evaluation','freeze the model permanently','replace external validation'],a:1,reason:'主旨',explain:'末段首句即核心观点。'}
 ]
},
{
 id:'lr-15', title:'中长阅读15｜为何“没有显著差异”不等于“完全相同”',
 text:`Researchers sometimes report that two groups showed “no significant difference” and readers conclude that the treatments are equivalent. That conclusion may be unjustified. A non-significant test means that the study did not obtain sufficiently strong evidence against the null hypothesis under its chosen threshold. It does not prove that the true difference is exactly zero.\n\nSample size is one reason. A small study may be unable to distinguish a clinically important difference from random variation. In that case, a wide confidence interval may include both meaningful benefit and meaningful harm. The result is uncertainty, not evidence of equality.\n\nQuestions of equivalence require a different framework. Researchers must define in advance how large a difference would still be considered practically unimportant and design the study to test that margin. This forces the scientific question to be stated more precisely.\n\nCareful interpretation therefore looks beyond the label “significant” or “not significant.” Effect estimates, confidence intervals, sample size, and the purpose of the study all matter. Statistical testing is a tool for reasoning under uncertainty, not a machine that converts every P value above 0.05 into proof that nothing happened.`,
 qs:[
  {q:'A non-significant result proves that the true difference is:',opts:['exactly zero','not necessarily zero','clinically important','always harmful'],a:1,reason:'主旨',explain:'第一段最后一句直接否定“等于零”。'},
  {q:'A small study may produce:',opts:['a wide confidence interval','automatic equivalence','perfect power','no random variation'],a:0,reason:'定位',explain:'第二段。'},
  {q:'Equivalence studies require researchers to define:',opts:['a practically unimportant margin','P=0','the largest possible sample','no outcome'],a:0,reason:'定位',explain:'第三段明确提出 margin。'},
  {q:'The author criticizes interpreting P>0.05 as:',opts:['proof that nothing happened','evidence worth examining','a reason to inspect intervals','a statistical threshold'],a:0,reason:'态度',explain:'末句明确批评。'}
 ]
},
{
 id:'lr-16', title:'中长阅读16｜为什么复习要主动提取',
 text:`Rereading creates a strong feeling of familiarity. After seeing the same page several times, sentences become easier to process and learners may conclude that the material has been mastered. The difficulty is that recognition during reading is not the same as retrieval without the page in front of you.\n\nPractice testing exposes this difference. When learners try to produce an answer before checking the notes, failure is uncomfortable but informative. It identifies what cannot yet be retrieved and makes the later review more focused. Successful retrieval also strengthens access to the information in the future.\n\nSpacing adds another advantage. Retrieving an idea after some forgetting has occurred is usually harder than repeating it immediately, but that difficulty can make practice more durable. The appropriate interval depends on the material and the learner; the principle is to return before the memory disappears completely but after recall has stopped being effortless.\n\nThis is why efficient study can feel less fluent than passive review. A method that produces temporary struggle may create stronger long-term memory than one that produces smooth recognition. The useful question is not “Did this page feel familiar?” but “Could I reconstruct the idea when the page was closed?”`,
 qs:[
  {q:'The main problem with rereading is that:',opts:['familiarity can be mistaken for retrievable mastery','it always takes more time than testing','sentences become harder','recognition and retrieval are identical'],a:0,reason:'主旨',explain:'第一段区分熟悉感与闭卷提取。'},
  {q:'Failure during practice testing is useful because it:',opts:['shows what cannot yet be retrieved','proves the learner should stop','eliminates later review','makes all memories permanent'],a:0,reason:'因果',explain:'第二段解释失败的诊断价值。'},
  {q:'Spacing works partly by making retrieval:',opts:['somewhat effortful after forgetting','immediate and effortless','unnecessary','dependent on rereading'],a:0,reason:'推断',explain:'第三段强调适度遗忘后的提取困难。'},
  {q:'The final question recommends judging learning by:',opts:['how familiar a page feels','whether the idea can be reconstructed with the page closed','how many times it was reread','how quickly notes were highlighted'],a:1,reason:'主旨',explain:'末句给出判断标准。'}
 ]
}

];

// V29: 英语一其余计分模块（原创训练材料，不冒充真题）
window.ENGLISH_CLOZE = [
 {id:'cz-01',title:'完形01｜学习习惯',text:'Effective study depends less on long hours than on repeated, focused practice. A learner who reviews material at spaced intervals is more likely to ___1___ it than one who reads the same page many times in a single evening. Retrieval is useful because it forces the brain to ___2___ information rather than merely recognize it. When an answer is wrong, the error should be treated as ___3___ about what needs more work. Over time, this cycle can make learning both more efficient and more ___4___.',blanks:[['retain','remove','avoid','divide'],['produce','hide','replace','borrow'],['evidence','silence','permission','distance'],['durable','accidental','temporary','narrow']],a:[0,0,0,0]},
 {id:'cz-02',title:'完形02｜科学证据',text:'Scientific conclusions rarely rest on a single study. Researchers compare findings across populations and methods because every design has ___1___. A randomized trial may control confounding well but still involve a highly selected group. An observational study may represent everyday practice better, ___2___ causal interpretation can be harder. Strong evidence therefore comes from asking whether different sources point in a ___3___ direction and whether alternative explanations have been adequately ___4___.',blanks:[['limitations','certainties','rewards','definitions'],['although','because','unless','therefore'],['consistent','private','random','silent'],['examined','invented','ignored','celebrated']],a:[0,0,0,0]},
 {id:'cz-03',title:'完形03｜健康沟通',text:'Health messages are most useful when they help people understand both benefit and uncertainty. Simply presenting a percentage can be ___1___ if the baseline risk is missing. A relative reduction may sound dramatic while the absolute change is small. Communicators should therefore provide enough context for readers to ___2___ the size of an effect. They should also distinguish what is known from what remains ___3___. Trust is more likely to grow when uncertainty is explained clearly rather than ___4___.',blanks:[['misleading','complete','neutral','necessary'],['judge','erase','prevent','repeat'],['uncertain','visible','equal','simple'],['hidden','measured','shared','tested']],a:[0,0,0,0]},
 {id:'cz-04',title:'完形04｜技术与判断',text:'New technology can improve decisions, but only when users understand what the system can and cannot do. An algorithm may identify patterns that humans miss, yet its output still depends on the data used to ___1___ it. If those data poorly represent future users, performance may ___2___ after deployment. Human oversight is therefore not a sign that the technology has failed; it is part of using the tool ___3___. The best systems support professional judgment rather than trying to ___4___ it blindly.',blanks:[['train','forget','publish','reduce'],['decline','double','freeze','disappear'],['responsibly','secretly','rarely','automatically'],['replace','measure','describe','record']],a:[0,0,0,0]},
 {id:'cz-05',title:'完形05｜公共政策',text:'A policy can be effective on average and still distribute benefits unevenly. People with more time, money, or information may find it easier to ___1___ a new service. If evaluation reports only the overall average, important gaps can remain ___2___. Equity analysis asks who benefits, who is left behind, and what barriers explain the ___3___. This does not mean every group must have identical outcomes, but differences should be examined before they are ___4___ as unavoidable.',blanks:[['access','refuse','cancel','measure'],['hidden','certain','equal','temporary'],['pattern','machine','sample','headline'],['accepted','translated','randomized','published']],a:[0,0,0,0]},
 {id:'cz-06',title:'完形06｜时间管理',text:'Busy learners often wait for a large block of free time before beginning. The problem is that such blocks may rarely ___1___. A more reliable strategy is to define a minimum task that can be completed even on a difficult day. Small sessions do not replace deeper study, ___2___ they protect continuity. Once the learner starts, additional work may become easier. The aim is not to make every day identical but to prevent temporary pressure from becoming a permanent ___3___. Consistency is built by making the next useful action ___4___.',blanks:[['appear','argue','measure','translate'],['but','unless','because','while'],['interruption','advantage','method','result'],['obvious','expensive','distant','formal']],a:[0,0,0,0]}
];
window.ENGLISH_NEWTYPE = [
 {id:'nt-01',title:'新题型01｜段落排序',prompt:'把四句按逻辑排成一段。',items:['A. Only after the question is clear should a method be selected.','B. Statistical analysis begins before any calculation is performed.','C. The researcher must first define the population, variables and comparison.','D. Otherwise, a technically correct test may answer the wrong question.'],answer:'B → C → A → D',tip:'总起B → first定义C → only after承接A → otherwise反面结果D。'},
 {id:'nt-02',title:'新题型02｜段落排序',prompt:'把四句按逻辑排成一段。',items:['A. This second attempt is often harder, but it strengthens retrieval.','B. Spaced practice deliberately allows some forgetting.','C. The learner then returns to the material after an interval.','D. Immediate repetition, by contrast, can create an illusion of mastery.'],answer:'B → C → A → D',tip:'B提出spacing → C then → A this second attempt → D by contrast。'},
 {id:'nt-03',title:'新题型03｜标题匹配',prompt:'选择最合适标题：A More Data Are Not Always Better / B Why Exercise Is Impossible / C The End of Statistics',items:['A database can contain millions of records and still give a biased answer if the people included differ systematically from the target population. Larger numbers reduce random error, but they do not automatically correct poor selection or measurement.'],answer:'A More Data Are Not Always Better',tip:'抓反复概念：large/millions/larger 与 biased/poor selection，核心是“量大≠质量高”。'},
 {id:'nt-04',title:'新题型04｜标题匹配',prompt:'选择最合适标题：A The Value of Uncertainty / B How to Eliminate All Error / C Why Confidence Intervals Are Useless',items:['A confidence interval does more than mark whether a result is statistically significant. Its width shows how precise an estimate is and its range helps readers judge which effect sizes remain compatible with the data.'],answer:'A The Value of Uncertainty',tip:'CI用于表达precision和compatible effect sizes，本质是把不确定性说清。'},
 {id:'nt-05',title:'新题型05｜句子插入',prompt:'句子“Yet convenience can create a new problem.”最适合放在哪里？',items:['① Digital tools make it easy to collect health data continuously.','② Users may assume that more frequent measurement must produce better decisions.','③ Repeated measurements can amplify noise or anxiety when their meaning is unclear.','④ Good design therefore considers not only what can be measured, but what should be measured.'],answer:'①与②之间',tip:'Yet承接①的便利，problem再由②③展开。'},
 {id:'nt-06',title:'新题型06｜句子插入',prompt:'句子“This distinction matters for interpretation.”最适合放在哪里？',items:['① Statistical significance concerns evidence against a null hypothesis.','② Clinical importance concerns the size and practical meaning of an effect.','③ A tiny effect can be statistically significant in a very large sample.','④ Researchers should report estimates and intervals rather than relying on a label alone.'],answer:'②与③之间',tip:'This distinction回指①②的统计显著性 vs 临床重要性，③开始说明后果。'}
];
window.ENGLISH_TRANSLATION = [
 ['Although technology can reduce repetitive work, it does not remove the need for human judgment when evidence is incomplete.','尽管技术可以减少重复性工作，但当证据不完整时，它并不能消除对人工判断的需要。','Although让步；主干technology does not remove the need；when引导时间/条件语境。'],
 ['What appears to be a simple association may reflect differences between groups that existed before the study began.','看似简单的关联，可能反映的是研究开始之前各组之间就已存在的差异。','What从句作主语；that existed...修饰differences。'],
 ['The fact that a result is statistically significant does not necessarily mean that it is large enough to matter in practice.','一个结果具有统计学显著性这一事实，并不一定意味着它大到足以在实践中具有重要意义。','The fact that...同位语从句；mean后that宾语从句；enough to。'],
 ['Researchers who focus only on average effects may overlook groups for whom an intervention works poorly or not at all.','只关注平均效应的研究者，可能忽视那些干预效果很差甚至完全无效的人群。','who修饰researchers；for whom修饰groups。'],
 ['Because memory becomes less accessible with time, retrieving information after an interval can strengthen later recall.','由于记忆会随时间变得不易提取，间隔一段时间后主动提取信息能够增强之后的回忆。','Because原因；动名词retrieving作主语。'],
 ['A model that performs well in one hospital should not be assumed to work equally well in another without further testing.','一个在某家医院表现良好的模型，在未经进一步检验时，不应被假定在另一家医院也同样有效。','that定语从句；should not be assumed被动；without条件。'],
 ['When people are given only relative risk, they may form a very different impression from the one produced by absolute numbers.','当人们只得到相对风险信息时，他们形成的印象可能与绝对数所产生的印象大不相同。','When状语；the one代替impression；produced过去分词修饰one。'],
 ['The more familiar a page becomes through rereading, the easier it is to mistake recognition for genuine mastery.','一页内容通过反复阅读变得越熟悉，人就越容易把“认得”误认为真正掌握。','the more..., the easier... 越…越…。'],
 ['Policies designed for the average user can unintentionally create barriers for people whose circumstances differ from that average.','为“平均用户”设计的政策，可能无意中给实际情况不同于这一平均水平的人制造障碍。','designed过去分词；whose定语从句。'],
 ['Rather than asking whether uncertainty can be eliminated, decision makers should ask whether it has been described clearly enough to support action.','决策者与其问能否消除不确定性，不如问是否已经把不确定性描述得足够清楚，以支持行动。','Rather than A, should B；whether宾语从句；enough to。'],
 ['Evidence becomes more convincing when similar conclusions emerge from studies that differ in population, method, and setting.','当不同人群、方法和场景的研究得出相似结论时，证据会更有说服力。','when状语；that differ...修饰studies。'],
 ['People often prefer a confident answer, even when the available data justify only a cautious conclusion.','人们往往偏爱确定的答案，即使现有数据只能支持谨慎的结论。','even when让步；justify意为“为…提供充分依据”。'],
 ['If a measurement tool is systematically biased, collecting more observations with the same tool will not solve the underlying problem.','如果测量工具存在系统性偏倚，用同一工具收集更多观察值并不能解决根本问题。','If条件；collecting动名词作主语。'],
 ['The purpose of feedback is not merely to tell learners that they are wrong but to help them identify why the error occurred.','反馈的目的不仅是告诉学习者答错了，更是帮助他们识别错误为什么发生。','not merely...but...；why从句作identify宾语。'],
 ['A treatment may be effective on average while offering little benefit to a subgroup with different baseline risks.','一种治疗总体上可能有效，但对于基线风险不同的某个亚组却可能获益很小。','while表转折对比；with短语修饰subgroup。'],
 ['By the time a guideline is published, some of the evidence on which it is based may already have changed.','到一项指南发布时，它所依据的部分证据可能已经发生变化。','By the time；on which定语从句修饰evidence。'],
 ['Readers should distinguish between what a study directly observed and what the authors infer from those observations.','读者应区分研究直接观察到的内容与作者根据这些观察所作的推断。','distinguish between A and B；两个what名词性从句。'],
 ['Not until an idea can be recalled without looking at the notes should a learner treat it as available for use.','只有当一个观点无需查看笔记就能被回忆出来时，学习者才应把它视为真正可以调用的知识。','Not until置前引起部分倒装：should a learner...。'],
 ['The question is not whether artificial intelligence will influence medicine, but how institutions can use it without weakening accountability.','问题不在于人工智能是否会影响医学，而在于机构如何在不削弱责任机制的情况下使用它。','not whether...but how...平行结构。'],
 ['Even a well-designed study cannot answer a question that its data were never collected to address.','即使设计良好的研究，也无法回答一个其数据从未被收集来解决的问题。','that修饰question；were collected to address表目的。']
];
window.ENGLISH_WRITING = [
 {id:'wr-01',kind:'小作文',title:'建议信',task:'假设你的同学备考效率低。用约100词写一封邮件，给出两条提高学习效率的建议。',frame:['Dear ...,','I am writing to offer two suggestions concerning ...','First, ... because ...','Second, ... so that ...','I hope these suggestions will be useful.','Yours sincerely,'],memory:'目的1句 → 建议2点 → 理由各1句 → 结尾1句。'},
 {id:'wr-02',kind:'小作文',title:'邀请信',task:'邀请一位老师参加学生组织的健康科普活动，并说明时间、主题和希望其参与的原因。',frame:['Dear Professor ...,','On behalf of ..., I would like to invite you to ...','The event will be held ... and will focus on ...','We would be honored if you could ...','I look forward to your reply.','Yours sincerely,'],memory:'谁邀请 → 什么事 → 时间主题 → 为什么请他 → 等回复。'},
 {id:'wr-03',kind:'小作文',title:'感谢信',task:'写信感谢一位在学习/项目中帮助过你的老师，说明具体帮助及其影响。',frame:['Dear ...,','I am writing to express my sincere gratitude for ...','Your help with ... enabled me to ...','More importantly, ...','Thank you again for your time and support.','Yours sincerely,'],memory:'谢什么 → 具体帮助 → 结果影响 → 再谢。'},
 {id:'wr-04',kind:'小作文',title:'通知',task:'写一则约100词通知：周六举行公共健康讲座，包含地点、时间、主题、报名方式。',frame:['NOTICE','A lecture on ... will be held at ... on ...','The event will cover ...','Those who are interested are welcome to ...','Please register by ...','Student Union'],memory:'标题 → 何时何地 → 干什么 → 谁参加 → 怎么报名。'},
 {id:'wr-05',kind:'小作文',title:'道歉/改期',task:'因临时工作冲突不能参加原定会面，写邮件道歉并提出两个可替代时间。',frame:['Dear ...,','I am sorry that I will be unable to ... as planned because ...','Could we reschedule it to ... or ...?','I apologize for the inconvenience and appreciate your understanding.','Yours sincerely,'],memory:'先道歉 → 简述原因 → 给替代方案 → 再致歉。'},
 {id:'wr-06',kind:'大作文',title:'坚持与长期积累',task:'围绕“长期积累比短期冲刺更可靠”写一篇160–200词议论文。',frame:['Paragraph 1: describe the phenomenon and state your view.','Paragraph 2: reason 1 + example; reason 2 + explanation.','Paragraph 3: conclusion + practical action.'],memory:'现象+观点 → 两个理由+例子 → 回扣观点+行动。'},
 {id:'wr-07',kind:'大作文',title:'技术与人的判断',task:'围绕“AI提高效率，但不能替代人的责任判断”写一篇160–200词议论文。',frame:['P1: technology brings efficiency, but judgment remains necessary.','P2: explain benefits; then risks/limits; give an example.','P3: advocate responsible human-AI cooperation.'],memory:'先承认好处 → 再写边界 → 最后平衡方案。'},
 {id:'wr-08',kind:'大作文',title:'健康生活方式',task:'围绕个人健康行为与长期健康结果的关系写160–200词。',frame:['P1: introduce the importance of daily behavior.','P2: exercise/sleep/diet + mechanisms or examples.','P3: realistic, sustainable action rather than extreme change.'],memory:'日常行为 → 两三个证据点 → 可持续行动。'},
 {id:'wr-09',kind:'大作文',title:'终身学习',task:'围绕快速变化社会中终身学习的重要性写160–200词。',frame:['P1: change makes one-time education insufficient.','P2: learning updates skills and improves judgment; example.','P3: build a regular learning habit.'],memory:'变化快 → 为什么要学 → 怎么持续学。'},
 {id:'wr-10',kind:'大作文',title:'合作与个人责任',task:'围绕团队合作中“合作不等于推卸个人责任”写160–200词。',frame:['P1: teamwork is essential but responsibility remains individual.','P2: division of labor + communication + accountability; example.','P3: combine cooperation with clear ownership.'],memory:'合作价值 → 责任边界 → 二者结合。'}
];


// V38 政治审计补强：26道稳定理论原创选择题；用于训练，不冒充真题。
window.QUESTIONS.push(
  {id:'q-pol-v38-01',subject:'pol',chapterId:'pol-02',type:'single',stem:'关于意识能动作用，较准确的是：',options:['意识可以脱离客观条件直接改变世界','正确意识通过实践能促进客观事物发展','意识决定物质发展的方向','只要主观愿望强烈就能成功'],answer:1,explain:'意识的能动作用要通过实践发挥，并受客观规律和条件制约。'},
  {id:'q-pol-v38-02',subject:'pol',chapterId:'pol-03',type:'multi',stem:'矛盾同一性和斗争性的关系包括：',options:['二者相互联结','同一性是有条件的相对的','斗争性是无条件的绝对的','二者在任何情况下都可以相互替代'],answer:[0,1,2],explain:'同一性与斗争性相互联结，但不能相互替代。'},
  {id:'q-pol-v38-03',subject:'pol',chapterId:'pol-04',type:'single',stem:'区分量变和质变的根本标志是：',options:['变化速度快慢','变化是否显著','变化是否超出度的范围','变化时间长短'],answer:2,explain:'是否超出度的范围、是否发生质态变化，是区分量变质变的根本标志。'},
  {id:'q-pol-v38-04',subject:'pol',chapterId:'pol-05',type:'multi',stem:'关于真理的表述，正确的有：',options:['真理具有客观性','真理既有绝对性又有相对性','真理与谬误在一定条件下可以相互转化','真理是否成立取决于多数人赞成'],answer:[0,1,2],explain:'真理的客观性不由投票决定；真理与谬误的界限有条件。'},
  {id:'q-pol-v38-05',subject:'pol',chapterId:'pol-06',type:'single',stem:'社会存在与社会意识关系中，正确的是：',options:['社会意识总与社会存在同步变化','社会意识决定社会存在','社会存在决定社会意识，社会意识具有相对独立性','社会意识对社会存在没有反作用'],answer:2,explain:'决定作用与相对独立性、反作用要同时把握。'},
  {id:'q-pol-v38-06',subject:'pol',chapterId:'pol-07',type:'multi',stem:'商品价值量与劳动生产率关系中，正确的有：',options:['单位商品价值量与生产该商品的社会劳动生产率成反比','商品价值量由社会必要劳动时间决定','个别劳动时间直接决定社会价值量','劳动生产率变化会影响单位商品价值量'],answer:[0,1,3],explain:'价值量由社会必要劳动时间决定，不由个别劳动时间直接决定。'},
  {id:'q-pol-v38-07',subject:'pol',chapterId:'pol-08',type:'single',stem:'资本主义基本矛盾是：',options:['使用价值和价值的矛盾','具体劳动和抽象劳动的矛盾','生产社会化和生产资料资本主义私人占有之间的矛盾','个别劳动和社会劳动的矛盾'],answer:2,explain:'这是资本主义社会各种矛盾和冲突的总根源。'},
  {id:'q-pol-v38-08',subject:'pol',chapterId:'pol-09',type:'multi',stem:'推进马克思主义中国化时代化要求：',options:['坚持马克思主义基本原理','同中国具体实际相结合','同中华优秀传统文化相结合','把经典结论机械套用于所有时代'],answer:[0,1,2],explain:'关键是结合实际推进理论创新，而非教条化。'},
  {id:'q-pol-v38-09',subject:'pol',chapterId:'pol-10',type:'single',stem:'新民主主义革命的首要对象是：',options:['帝国主义','民族资产阶级','小资产阶级','农民阶级'],answer:0,explain:'近代中国民族矛盾突出，帝国主义是中国人民的第一个和最凶恶的敌人。'},
  {id:'q-pol-v38-10',subject:'pol',chapterId:'pol-11',type:'multi',stem:'社会主义改造完成的重大意义包括：',options:['社会主义基本制度在中国确立','中国进入社会主义初级阶段','为社会主义建设奠定制度基础','意味着社会主义建设所有问题都已解决'],answer:[0,1,2],explain:'制度确立不等于后续建设问题全部解决。'},
  {id:'q-pol-v38-11',subject:'pol',chapterId:'pol-12',type:'single',stem:'新时代我国社会主要矛盾强调的是：',options:['人民日益增长的物质文化需要同落后生产之间的矛盾','人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾','无产阶级同资产阶级的矛盾','城市和农村之间的矛盾'],answer:1,explain:'这是新时代社会主要矛盾的规范表述。'},
  {id:'q-pol-v38-12',subject:'pol',chapterId:'pol-13',type:'multi',stem:'新发展理念包含：',options:['创新','协调','绿色','开放','共享'],answer:[0,1,2,3,4],explain:'五大发展理念是一个相互贯通的整体。'},
  {id:'q-pol-v38-13',subject:'pol',chapterId:'pol-14',type:'single',stem:'全面深化改革的总目标强调：',options:['只改革经济体制','完善和发展中国特色社会主义制度，推进国家治理体系和治理能力现代化','取消一切既有制度','只依靠基层自发探索'],answer:1,explain:'制度完善与治理现代化是总目标的两个相互联系方面。'},
  {id:'q-pol-v38-14',subject:'pol',chapterId:'pol-15',type:'multi',stem:'关于共同富裕，正确的理解有：',options:['是全体人民共同富裕','不是整齐划一的平均主义','需要在高质量发展中推进','可以一蹴而就'],answer:[0,1,2],explain:'共同富裕是长期历史过程，不是平均主义，也不能一蹴而就。'},
  {id:'q-pol-v38-15',subject:'pol',chapterId:'pol-16',type:'single',stem:'生态文明建设中，“绿水青山就是金山银山”主要强调：',options:['生态保护与经济发展绝对对立','良好生态环境具有重要价值，保护生态也是发展生产力','只要保护环境就不需要发展经济','自然资源可以无限利用'],answer:1,explain:'核心是推动发展方式绿色转型，实现保护与发展的统一。'},
  {id:'q-pol-v38-16',subject:'pol',chapterId:'pol-17',type:'multi',stem:'坚持总体国家安全观，需要：',options:['统筹发展和安全','统筹传统安全和非传统安全','把安全理解为单一军事问题','增强维护国家安全能力'],answer:[0,1,3],explain:'国家安全是系统性问题，不能缩减为单一军事安全。'},
  {id:'q-pol-v38-17',subject:'pol',chapterId:'pol-18',type:'single',stem:'近代中国两大历史任务之间的关系，较准确的是：',options:['彼此无关','民族独立人民解放为国家富强人民幸福创造前提','国家富强必须先于民族独立','两者完全可以同时瞬间完成'],answer:1,explain:'前一任务为后一任务扫清障碍、创造必要前提。'},
  {id:'q-pol-v38-18',subject:'pol',chapterId:'pol-19',type:'multi',stem:'旧民主主义革命时期不同救国方案的历史考察应重点看：',options:['提出者及其阶级基础','时代条件和主要主张','实践结果及失败原因','只背事件年份而不理解逻辑'],answer:[0,1,2],explain:'史纲应建立“谁探索—为何—怎么做—结果—局限”的逻辑链。'},
  {id:'q-pol-v38-19',subject:'pol',chapterId:'pol-20',type:'single',stem:'五四运动成为新民主主义革命开端的重要原因之一是：',options:['资产阶级第一次出现','工人阶级以独立政治力量登上历史舞台','清政府宣布改革','封建制度立即结束'],answer:1,explain:'工人阶级登上政治舞台、马克思主义传播等构成重要转折。'},
  {id:'q-pol-v38-20',subject:'pol',chapterId:'pol-21',type:'multi',stem:'抗日民族统一战线的理解正确的有：',options:['民族矛盾上升推动广泛团结','统一战线意味着放弃独立自主','要团结一切可以团结的抗日力量','团结与坚持原则可以统一'],answer:[0,2,3],explain:'统一战线中仍须坚持独立自主和原则性。'},
  {id:'q-pol-v38-21',subject:'pol',chapterId:'pol-22',type:'single',stem:'评价社会主义建设探索和改革开放历史，应坚持：',options:['脱离历史条件用今天标准简单否定过去','把不同历史阶段完全割裂','历史地、具体地分析，并把探索放入连续发展进程','只记结论不看背景'],answer:2,explain:'史纲重在历史条件、实践逻辑和发展连续性。'},
  {id:'q-pol-v38-22',subject:'pol',chapterId:'pol-23',type:'multi',stem:'人生价值的实现需要：',options:['把个人发展同社会需要联系起来','通过社会实践创造价值','只追求个人索取','正确处理自我价值与社会价值关系'],answer:[0,1,3],explain:'人生价值包含自我价值与社会价值，并在实践中实现。'},
  {id:'q-pol-v38-23',subject:'pol',chapterId:'pol-24',type:'single',stem:'社会主义核心价值观中，公民个人层面的价值准则是：',options:['富强、民主、文明、和谐','自由、平等、公正、法治','爱国、敬业、诚信、友善','创新、协调、绿色、开放'],answer:2,explain:'爱国、敬业、诚信、友善属于公民个人层面。'},
  {id:'q-pol-v38-24',subject:'pol',chapterId:'pol-25',type:'multi',stem:'法治思维通常要求重视：',options:['法律至上','权力制约','公平正义和权利保障','正当程序'],answer:[0,1,2,3],explain:'这些是法治思维的重要内容。'},
  {id:'q-pol-v38-25',subject:'pol',chapterId:'pol-26',type:'single',stem:'政治选择题中看到“唯一、完全、任何条件下”等表述时，最合理的做法是：',options:['一律判错','一律判对','提高警惕，回到教材条件和题干范围逐项判断','凭眼熟程度选择'],answer:2,explain:'绝对词是风险信号但不是自动判错规则，仍须依据理论和题干判断。'},
  {id:'q-pol-v38-26',subject:'pol',chapterId:'pol-27',type:'multi',stem:'材料分析题形成完整得分闭环通常需要：',options:['规范理论点','材料关键词对应','围绕设问作结论','大量抄材料替代理论'],answer:[0,1,2],explain:'核心是“原理—材料—结论”，抄材料不能替代理论分析。'}
);

// V35 政治分析题原创训练库：用于方法训练，不冒充历年真题。
const POL_ANALYSIS = [
  {id:'pa35-01',chapterId:'pol-03',area:'马原',title:'矛盾分析法',material:'某单位推进改革时，既看到长期积累的共性问题，又根据不同部门的任务、人员和资源条件分别制定方案，并优先解决影响全局的关键环节。',ask:'结合矛盾分析法，说明这种做法体现了哪些方法论要求？',points:['矛盾具有普遍性，要承认矛盾、分析矛盾。','矛盾具有特殊性，要具体问题具体分析。','主要矛盾在复杂事物发展中处于支配地位，要抓重点。','坚持两点论和重点论相统一。'],hook:'都有矛盾→各有不同→先抓关键→兼顾两面',answer:'①矛盾具有普遍性，要正视并分析问题。②矛盾具有特殊性，不同部门条件不同，应具体问题具体分析。③主要矛盾对事物发展起支配作用，材料中优先解决影响全局的关键环节体现抓主要矛盾。④同时统筹其他问题，体现两点论和重点论相统一。'},
  {id:'pa35-02',chapterId:'pol-05',area:'马原',title:'实践与认识',material:'一项新技术先在小范围试点，根据运行中暴露的问题多次修改方案，随后扩大应用，并继续用新的实践结果检验和完善原有认识。',ask:'运用实践和认识的辩证关系分析材料。',points:['实践是认识的来源。','实践是认识发展的动力。','实践是检验认识真理性的唯一标准。','认识运动具有反复性和无限性，要在实践—认识—再实践中发展。'],hook:'实践来→问题推→实践验→循环升',answer:'①实践是认识的来源，方案认识来自试点实践。②实践提出新问题并推动认识深化。③实践是检验认识真理性的唯一标准，方案必须经运行效果检验。④认识发展是反复和无限的，需要在实践、认识、再实践中不断完善。'},
  {id:'pa35-03',chapterId:'pol-04',area:'马原',title:'发展与辩证否定',material:'某行业升级没有把旧体系全部推倒，而是保留有效经验，淘汰落后环节，并引入新技术形成新的运行模式。',ask:'从发展的观点和辩证否定观分析这一过程。',points:['发展是前进的、上升的运动，新事物具有强大生命力。','辩证否定是事物自身的否定，是发展的环节。','辩证否定的实质是扬弃，既克服又保留。'],hook:'发展向前；否定不是清零，而是扬弃',answer:'①发展是新事物产生、旧事物灭亡的过程。②辩证否定是事物自身发展的环节，不是简单外在否定。③其本质是扬弃，即克服旧事物中过时因素，同时保留和改造合理因素。材料中的保留、淘汰和创新正体现这一点。'},
  {id:'pa35-04',chapterId:'pol-09',area:'毛中特',title:'马克思主义中国化时代化',material:'解决中国问题不能照抄照搬外部模式，而要立足中国具体实际和时代条件，把基本原理同中国实际、中华优秀传统文化相结合。',ask:'为什么推进马克思主义中国化时代化必须立足中国实际？',points:['马克思主义具有实践性，理论必须同具体实际结合。','中国革命、建设、改革有自身具体国情和时代条件。','坚持基本原理与中国具体实际相结合。','坚持同中华优秀传统文化相结合，不断推进理论创新。'],hook:'原理不变成教条：落中国、接时代、融文化、再创新',answer:'①马克思主义不是教条，而是行动指南，必须在实践中运用和发展。②中国具体国情和时代任务决定不能照搬别国模式。③要把马克思主义基本原理同中国具体实际相结合、同中华优秀传统文化相结合。④在解决实际问题中不断推进理论创新和实践创新。'},
  {id:'pa35-05',chapterId:'pol-10',area:'毛中特',title:'新民主主义革命道路',material:'近代中国革命面对半殖民地半封建社会条件，必须从实际出发探索符合中国特点的革命道路。',ask:'分析中国革命道路选择体现的基本方法。',points:['社会性质和主要矛盾决定革命任务。','必须从中国具体国情出发。','把马克思主义基本原理同中国革命具体实际结合。','实践探索推动理论形成和发展。'],hook:'先看性质→再定任务→立足国情→走出道路',answer:'①近代中国社会性质和主要矛盾规定了革命任务。②道路选择必须立足中国国情，不能照搬外国经验。③中国共产党把马克思主义基本原理同中国革命具体实际结合，在实践中探索符合中国特点的革命道路。④体现了实事求是和理论联系实际。'},
  {id:'pa35-06',chapterId:'pol-13',area:'新时代',title:'新发展理念',material:'某地发展产业时同时考虑技术创新、城乡协同、资源环境约束、对外合作和公共服务共享，不再只用短期GDP增速评价成效。',ask:'结合新发展理念分析这种发展思路。',points:['创新解决发展动力问题。','协调解决发展不平衡问题。','绿色解决人与自然和谐问题。','开放解决发展内外联动问题。','共享解决社会公平正义、发展成果由人民共享问题。'],hook:'创新动力、协调平衡、绿色方式、开放联动、共享目的',answer:'材料体现创新、协调、绿色、开放、共享的新发展理念。创新增强动力，协调改善结构和平衡，绿色强调可持续，开放促进内外联动，共享强调发展为了人民、依靠人民、成果由人民共享。五者相互贯通，共同推动高质量发展。'},
  {id:'pa35-07',chapterId:'pol-14',area:'新时代',title:'全面深化改革',material:'改革进入深水区后，一项政策往往牵动多个领域，需要加强顶层设计，也要尊重基层探索，并处理好改革发展稳定关系。',ask:'如何理解改革的系统性、整体性和协同性？',points:['全面深化改革是一项复杂系统工程。','要加强顶层设计和整体谋划。','鼓励基层实践探索，顶层设计与摸着石头过河相结合。','处理好改革、发展、稳定关系。'],hook:'系统工程：顶层画图、基层试路、协同推进、守住稳定',answer:'①全面深化改革涉及多领域、多环节，是复杂系统工程。②要加强顶层设计和整体谋划，提高改革系统性、整体性、协同性。③同时尊重基层首创精神，使顶层设计与实践探索相结合。④统筹改革发展稳定，推动各项改革相互促进、良性互动。'},
  {id:'pa35-08',chapterId:'pol-15',area:'新时代',title:'共同富裕',material:'推进共同富裕既要把“蛋糕”做大，也要把“蛋糕”切好；既鼓励勤劳创新致富，也强调基本公共服务和机会公平。',ask:'结合共同富裕说明效率与公平如何统一。',points:['共同富裕是全体人民共同富裕，不是少数人的富裕。','共同富裕不是整齐划一的平均主义。','高质量发展为共同富裕奠定物质基础。','完善分配制度和公共服务，促进机会公平和成果共享。'],hook:'先做大、再切好；不是平均，是全体共享、长期推进',answer:'①共同富裕面向全体人民，不是少数人富裕，也不是平均主义。②发展是解决问题的基础，要通过高质量发展做大社会财富。③同时完善分配制度、公共服务和机会保障，把发展成果更公平惠及人民。④效率和公平不是简单对立，应在发展中促进公平、在公平中激发活力。'},
  {id:'pa35-09',chapterId:'pol-16',area:'新时代',title:'生态文明',material:'某地区不再以牺牲环境换取短期增长，而是推进节能降碳、生态修复和绿色产业，同时改善居民生活质量。',ask:'运用生态文明建设相关观点分析材料。',points:['人与自然是生命共同体。','尊重自然、顺应自然、保护自然。','绿水青山就是金山银山，保护生态环境就是保护生产力。','推动经济社会发展绿色化、低碳化，实现高质量发展。'],hook:'自然是家底；保护不是不要发展，而是换发展方式',answer:'①人与自然是生命共同体，发展必须尊重、顺应、保护自然。②良好生态环境本身具有重要价值，保护生态环境就是保护生产力。③材料通过节能降碳、生态修复和绿色产业改变发展方式，体现绿色发展。④目标是实现经济发展、生态保护和人民生活改善相统一。'},
  {id:'pa35-10',chapterId:'pol-18',area:'史纲',title:'近代两大历史任务',material:'近代中国既面临民族危亡和人民受压迫问题，也面临国家贫弱、现代化落后的问题。不同历史阶段的斗争围绕这些根本问题展开。',ask:'说明近代中国两大历史任务及其关系。',points:['争取民族独立、人民解放。','实现国家富强、人民幸福。','前一任务为后一任务扫清障碍、创造必要前提。','后一任务是前一任务的最终目的和必然要求。'],hook:'先站起来获得独立解放，再创造条件走向富强幸福',answer:'近代中国两大历史任务是争取民族独立、人民解放和实现国家富强、人民幸福。民族独立、人民解放为国家富强、人民幸福扫清障碍并创造前提；实现国家富强、人民幸福则体现民族独立和人民解放的最终目的与发展要求。'},
  {id:'pa35-11',chapterId:'pol-20',area:'史纲',title:'五四运动',material:'五四运动中，先进知识分子和青年学生积极行动，工人阶级随后以独立姿态登上政治舞台，马克思主义得到更广泛传播。',ask:'为什么说五四运动具有重要历史转折意义？',points:['表现了彻底反帝反封建的革命性。','工人阶级以独立政治力量登上历史舞台。','促进马克思主义在中国传播及同工人运动结合。','为中国共产党成立作了思想上干部上的准备，是新民主主义革命开端的重要标志。'],hook:'反帝反封建更彻底→工人登台→马克思主义传播→为建党准备',answer:'五四运动具有彻底反帝反封建的革命性，推动工人阶级以独立政治力量登上历史舞台，促进马克思主义在中国传播并同工人运动结合，为中国共产党成立作了思想和干部准备，因此成为中国新民主主义革命开端的重要标志。'},
  {id:'pa35-12',chapterId:'pol-21',area:'史纲',title:'抗日民族统一战线',material:'民族危机空前严重时，中国共产党推动建立广泛抗日民族统一战线，同时坚持独立自主原则，团结一切可以团结的力量抗击侵略。',ask:'分析抗日民族统一战线形成的历史逻辑和方法。',points:['民族矛盾上升为主要矛盾。','抗日救亡成为全国人民共同要求。','建立广泛统一战线有利于凝聚全民族抗战力量。','坚持统一战线中的独立自主，既团结又坚持原则。'],hook:'主要矛盾变→共同任务变→最广泛团结→团结中守原则',answer:'随着民族危机加深，中日民族矛盾上升，抗日救亡成为共同任务，因此需要建立最广泛的抗日民族统一战线，凝聚全民族力量。同时统一战线不是放弃原则，要坚持独立自主，实现团结抗战与原则性的统一。'},
  {id:'pa35-13',chapterId:'pol-23',area:'思法',title:'人生价值',material:'一名青年选择职业时既考虑个人成长，也把社会需要和服务群众作为重要标准，并通过长期实践提升自身能力。',ask:'如何理解个人价值与社会价值的关系？',points:['人生价值内在包含自我价值和社会价值。','社会价值是个人对社会和他人的贡献。','自我价值是社会对个人需要的满足以及个人发展。','二者相互联系，人生价值要在社会实践中实现。'],hook:'我成长+我贡献；最终都落在实践',answer:'①人生价值包含自我价值和社会价值两个方面。②个人通过劳动和创造满足社会需要、作出贡献，实现社会价值。③社会也为个人生存发展提供条件，实现自我价值。④二者相互联系，青年应把个人发展融入社会需要，在实践和奋斗中实现人生价值。'},
  {id:'pa35-14',chapterId:'pol-25',area:'思法',title:'法治思维',material:'面对公共争议，一方主张“只要目的正确就可以不按程序”，另一方认为应依法明确权责、遵循程序并保障各方合法权利。',ask:'运用法治思维评价上述观点。',points:['法治思维强调法律至上、权力制约、公平正义、权利保障、正当程序。','目的正当不能替代程序合法。','权利与义务相统一。','依法办事有助于维护公平正义和稳定预期。'],hook:'有依据、有边界、有权利、有程序',answer:'法治思维要求依照法律规则处理公共事务，强调权力受约束、权利受保障、公平正义和正当程序。即使目的正当，也不能以此否定法定程序。应明确主体权利义务，在程序框架内解决争议，以程序和实体的统一维护公平正义。'},
  {id:'pa35-15',chapterId:'pol-27',area:'综合',title:'分析题审题训练',material:'材料同时出现“因地制宜”“关键环节”“统筹兼顾”等词。',ask:'不直接写答案，先说明如何把材料词转换成可作答的理论点。',points:['因地制宜→矛盾特殊性/具体问题具体分析。','关键环节→主要矛盾/抓重点。','统筹兼顾→两点论与重点论统一。','最后必须把理论点重新贴回材料。'],hook:'材料词不是答案，是理论检索词',answer:'先圈出材料关键词，再把关键词映射到理论：因地制宜对应具体问题具体分析，关键环节对应抓主要矛盾，统筹兼顾对应两点论与重点论统一。随后每个理论点都用材料事实解释，形成“原理—材料—结论”的闭环。'},
  {id:'pa35-16',chapterId:'pol-27',area:'综合',title:'原因类材料题',material:'某项重大政策能够持续推进，材料给出了现实问题、制度基础、群众需求和实践成效四类信息。',ask:'面对“为什么”类分析题，如何组织答案？',points:['先回答必要性：现实问题/矛盾要求。','再回答理论或制度依据。','再回答人民立场或价值目标。','最后结合实践成效说明意义。'],hook:'为什么＝现实要＋理论撑＋人民需＋实践证',answer:'“为什么”类题不要只写意义。可按四层组织：现实问题说明必要性；理论或制度依据说明合理性；群众需求说明价值立场；实践成效说明现实意义。每层都引用材料关键词。'},
  {id:'pa35-17',chapterId:'pol-27',area:'综合',title:'措施类材料题',material:'材料描述一个领域存在结构失衡、动力不足、执行不协同和群众获得感不强等问题。',ask:'面对“怎么办”类分析题，如何避免空泛？',points:['问题与措施一一对应。','措施要有理论依据。','区分主体、对象和层次。','最后说明目标或效果。'],hook:'问题一条→措施一条→主体明确→目标收口',answer:'先把材料中的问题分点，再逐条提出对应措施，避免万能口号。每项措施写清谁来做、针对什么问题、依据什么原则，最后用目标或效果收束。形成“问题—依据—措施—目标”的结构。'},
  {id:'pa35-18',chapterId:'pol-27',area:'综合',title:'意义类材料题',material:'材料展示一项实践对经济、社会、生态和人民生活产生多方面积极影响。',ask:'“意义”类题怎样写得有层次？',points:['紧扣材料，不机械堆万能意义。','可从直接效果到长远影响展开。','可按经济/政治/文化/社会/生态或主体层次分类，但要与材料匹配。','最后回到题目要求的总体目标。'],hook:'先材料直接效果，再扩长远；分类服务材料，不为凑点',answer:'先写材料明确呈现的直接作用，再根据题目扩展长远意义；必要时按领域或主体分层，但每层必须有材料依据。最后回扣总体目标，避免与材料无关的万能套话。'}
];

// V37: current-affairs update slots. Stable study hooks only; never claim future 2027 events.
const POLITICS_CURRENT_AFFAIRS = [
  {id:'ca37-01',period:'长期稳定',title:'重大会议/文件学习槽位',status:'等待2027考试年度权威材料',hook:'事件→教材考点→为什么重要→可能怎样设问'},
  {id:'ca37-02',period:'长期稳定',title:'国内重大政策学习槽位',status:'按权威发布逐条更新',hook:'政策解决什么问题→理论依据→目标→措施'},
  {id:'ca37-03',period:'长期稳定',title:'国际重大事件学习槽位',status:'按考试年度实际事件更新',hook:'事件→中国立场→全球治理→教材对应点'},
  {id:'ca37-04',period:'考试年度',title:'2027年度时政清单',status:'未封板：等待考试年度持续发生',hook:'不预测必考，只做权威信息滚动校准'}
];

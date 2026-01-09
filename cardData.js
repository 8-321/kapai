// 卡牌数据库
const cardLibrary = {
    exploreCards: [
        {
            id: "EX001",
            type: "探索卡",
            title: "30小时体验新领域",
            difficulty: 3,
            color: "#4CAF50",
            content: {
                description: "在30小时内获得某个领域的入门级掌控感",
                steps: [
                    "第1步：选择一个你好奇的领域",
                    "第2步：花10小时学习核心概念",
                    "第3步：花10小时动手实践",
                    "第4步：花5小时与从业者交流",
                    "第5步：花5小时输出复盘报告"
                ],
                tips: ["关注过程而非结果", "记录能量消耗变化"],
                rewards: ["获得对该领域的判断力", "解锁一项新认知"]
            },
            suggestedTime: "30小时"
        },
        {
            id: "EX002",
            type: "探索卡",
            title: "深度访谈一位专家",
            difficulty: 2,
            color: "#4CAF50",
            content: {
                description: "通过与领域专家深度交流，快速获取关键洞察",
                steps: [
                    "第1步：确定你想了解的核心问题",
                    "第2步：找到合适的专家人选",
                    "第3步：准备15个高质量问题",
                    "第4步：进行60-90分钟深度访谈",
                    "第5步：整理访谈笔记并提炼3个关键洞察"
                ],
                tips: ["提前做足功课", "保持开放和好奇心"],
                rewards: ["获得第一手行业经验", "建立专业人脉"]
            },
            suggestedTime: "3-5小时"
        },
        {
            id: "EX003",
            type: "探索卡",
            title: "完成一个最小可行产品",
            difficulty: 4,
            color: "#4CAF50",
            content: {
                description: "快速验证一个想法的最小版本",
                steps: [
                    "第1步：明确要验证的核心假设",
                    "第2步：设计最小功能集合",
                    "第3步：快速实现原型（1-3天）",
                    "第4步：找到5个真实用户测试",
                    "第5步：收集反馈并迭代"
                ],
                tips: ["追求速度而非完美", "尽早与用户接触"],
                rewards: ["验证想法可行性", "积累实战经验"]
            },
            suggestedTime: "3-7天"
        },
        {
            id: "EX004",
            type: "探索卡",
            title: "阅读3本相关书籍",
            difficulty: 2,
            color: "#4CAF50",
            content: {
                description: "系统性地了解一个新主题",
                steps: [
                    "第1步：选择3本不同角度的经典书籍",
                    "第2步：快速浏览建立框架",
                    "第3步：精读关键章节",
                    "第4步：做读书笔记并整理思维导图",
                    "第5步：尝试向他人讲解核心概念"
                ],
                tips: ["不求全读，但求理解", "注重知识的连接"],
                rewards: ["建立系统认知", "提升学习效率"]
            },
            suggestedTime: "1-2周"
        },
        {
            id: "EX005",
            type: "探索卡",
            title: "参加一个行业会议",
            difficulty: 3,
            color: "#4CAF50",
            content: {
                description: "通过会议快速了解行业动态和趋势",
                steps: [
                    "第1步：筛选并选择一个有价值的会议",
                    "第2步：提前研究参会者和议题",
                    "第3步：准备名片和自我介绍",
                    "第4步：积极参与讨论和社交",
                    "第5步：会后整理收获并跟进联系"
                ],
                tips: ["主动交流", "记录关键信息"],
                rewards: ["拓展行业视野", "建立人脉网络"]
            },
            suggestedTime: "1-2天"
        },
        {
            id: "EX006",
            type: "探索卡",
            title: "完成一次实地调研",
            difficulty: 3,
            color: "#4CAF50",
            content: {
                description: "通过实地观察获得一手信息",
                steps: [
                    "第1步：确定调研目标和地点",
                    "第2步：设计观察清单和问题",
                    "第3步：进行实地观察和记录",
                    "第4步：与相关人员简短交流",
                    "第5步：整理观察报告"
                ],
                tips: ["保持客观", "注意细节"],
                rewards: ["获得真实场景洞察", "验证假设"]
            },
            suggestedTime: "1天"
        },
        {
            id: "EX007",
            type: "探索卡",
            title: "学习一项新技能",
            difficulty: 3,
            color: "#4CAF50",
            content: {
                description: "快速掌握一项实用技能",
                steps: [
                    "第1步：明确学习目标和应用场景",
                    "第2步：找到优质学习资源",
                    "第3步：制定10-20小时学习计划",
                    "第4步：边学边练，动手实践",
                    "第5步：完成一个小项目巩固技能"
                ],
                tips: ["专注一个技能", "刻意练习"],
                rewards: ["掌握新技能", "提升竞争力"]
            },
            suggestedTime: "20-30小时"
        },
        {
            id: "EX008",
            type: "探索卡",
            title: "分析一个成功案例",
            difficulty: 2,
            color: "#4CAF50",
            content: {
                description: "通过拆解成功案例学习经验",
                steps: [
                    "第1步：选择一个感兴趣的成功案例",
                    "第2步：收集相关信息和研究资料",
                    "第3步：分析成功的关键因素",
                    "第4步：总结可复用的方法和模式",
                    "第5步：思考如何应用到自己的场景"
                ],
                tips: ["深入挖掘", "保持批判思维"],
                rewards: ["学习成功经验", "形成方法库"]
            },
            suggestedTime: "5-8小时"
        },
        {
            id: "EX009",
            type: "探索卡",
            title: "进行一次用户画像研究",
            difficulty: 3,
            color: "#4CAF50",
            content: {
                description: "深入了解目标用户的需求和行为",
                steps: [
                    "第1步：确定目标用户群体",
                    "第2步：设计用户访谈问题",
                    "第3步：访谈5-10位典型用户",
                    "第4步：分析访谈数据找出共性",
                    "第5步：构建用户画像和需求地图"
                ],
                tips: ["保持同理心", "记录真实感受"],
                rewards: ["深度理解用户", "指导产品方向"]
            },
            suggestedTime: "1周"
        },
        {
            id: "EX010",
            type: "探索卡",
            title: "完成一次竞品分析",
            difficulty: 2,
            color: "#4CAF50",
            content: {
                description: "通过分析竞争对手获得市场洞察",
                steps: [
                    "第1步：确定3-5个主要竞品",
                    "第2步：从多个维度进行分析",
                    "第3步：对比优势和劣势",
                    "第4步：找出市场空白和机会点",
                    "第5步：形成差异化策略"
                ],
                tips: ["客观分析", "关注差异"],
                rewards: ["了解市场竞争", "找到定位"]
            },
            suggestedTime: "1周"
        }
    ],

    verifyCards: [
        {
            id: "VE001",
            type: "验证卡",
            title: "投入产出比计算器",
            difficulty: 2,
            color: "#2196F3",
            content: {
                description: "通过计算ROI评估活动的价值",
                formula: "ROI = (成果项 × 10) / 投入时间(小时)",
                thresholds: {
                    high: "≥3：值得继续投入",
                    medium: "1-3：保持观察",
                    low: "≤1：建议停止"
                },
                fields: ["投入时间", "成果数量", "能量消耗"],
                example: "投入20小时，获得5个成果，ROI = (5×10)/20 = 2.5"
            },
            suggestedTime: "即时"
        },
        {
            id: "VE002",
            type: "验证卡",
            title: "能量消耗记录表",
            difficulty: 1,
            color: "#2196F3",
            content: {
                description: "记录和追踪不同活动的能量消耗",
                fields: ["活动名称", "能量等级(1-10)", "持续时间", "产出效果"],
                tips: ["每天记录", "注意模式"],
                purpose: "识别高能耗低产出的活动"
            },
            suggestedTime: "持续"
        },
        {
            id: "VE003",
            type: "验证卡",
            title: "30天习惯验证",
            difficulty: 3,
            color: "#2196F3",
            content: {
                description: "通过30天实践验证一个习惯的价值",
                steps: [
                    "第1步：明确要验证的习惯",
                    "第2步：设定可量化的目标",
                    "第3步：每天记录执行情况",
                    "第4步：每周回顾和调整",
                    "第5步：30天后评估效果"
                ],
                criteria: ["是否持续执行", "是否产生预期效果", "是否带来正向改变"]
            },
            suggestedTime: "30天"
        },
        {
            id: "VE004",
            type: "验证卡",
            title: "A/B测试验证法",
            difficulty: 4,
            color: "#2196F3",
            content: {
                description: "通过对比实验验证哪个方案更好",
                steps: [
                    "第1步：明确要验证的假设",
                    "第2步：设计A和B两个方案",
                    "第3步：在相似条件下同时测试",
                    "第4步：收集数据并对比",
                    "第5步：选择更优方案"
                ],
                tips: ["控制变量", "足够样本量"],
                application: "适合验证方法、工具、流程等"
            },
            suggestedTime: "1-2周"
        },
        {
            id: "VE005",
            type: "验证卡",
            title: "关键指标追踪",
            difficulty: 2,
            color: "#2196F3",
            content: {
                description: "通过追踪关键指标验证进展",
                steps: [
                    "第1步：确定3-5个关键指标",
                    "第2步：设定目标值",
                    "第3步：建立追踪机制",
                    "第4步：每周/每月回顾",
                    "第5步：根据数据调整策略"
                ],
                tips: ["指标要可量化", "定期回顾"],
                example: "学习进度、项目里程碑、习惯打卡等"
            },
            suggestedTime: "持续"
        },
        {
            id: "VE006",
            type: "验证卡",
            title: "小规模试点验证",
            difficulty: 3,
            color: "#2196F3",
            content: {
                description: "在小范围内验证想法再全面推广",
                steps: [
                    "第1步：选择小规模试点范围",
                    "第2步：设定验证标准",
                    "第3步：执行并记录过程",
                    "第4步：收集反馈和数据",
                    "第5步：评估是否值得推广"
                ],
                tips: ["范围要小", "时间要短"],
                advantage: "降低风险，快速迭代"
            },
            suggestedTime: "1-2周"
        },
        {
            id: "VE007",
            type: "验证卡",
            title: "用户反馈验证",
            difficulty: 2,
            color: "#2196F3",
            content: {
                description: "通过用户反馈验证产品/服务的价值",
                steps: [
                    "第1步：确定反馈收集方式",
                    "第2步：找到目标用户",
                    "第3步：收集使用反馈",
                    "第4步：分析反馈数据",
                    "第5步：迭代改进"
                ],
                methods: ["问卷", "访谈", "观察", "数据分析"],
                focus: "用户真实使用体验"
            },
            suggestedTime: "1周"
        },
        {
            id: "VE008",
            type: "验证卡",
            title: "成本效益分析",
            difficulty: 2,
            color: "#2196F3",
            content: {
                description: "通过对比成本和效益做出决策",
                steps: [
                    "第1步：列出所有成本项",
                    "第2步：列出所有收益项",
                    "第3步：量化成本和收益",
                    "第4步：计算净收益",
                    "第5步：做出决策"
                ],
                costs: ["时间", "金钱", "精力", "机会成本"],
                benefits: ["直接收益", "长期价值", "学习成长"]
            },
            suggestedTime: "即时"
        },
        {
            id: "VE009",
            type: "验证卡",
            title: "里程碑检查点",
            difficulty: 1,
            color: "#2196F3",
            content: {
                description: "在关键节点检查进展并调整方向",
                steps: [
                    "第1步：设定里程碑节点",
                    "第2步：到达节点时暂停",
                    "第3步：评估当前状态",
                    "第4步：对比预期目标",
                    "第5步：决定继续或调整"
                ],
                frequency: "建议每月或每季度",
                questions: ["是否按计划进行？", "是否需要调整？"]
            },
            suggestedTime: "定期"
        },
        {
            id: "VE010",
            type: "验证卡",
            title: "结果对比验证",
            difficulty: 2,
            color: "#2196F3",
            content: {
                description: "通过对比前后结果验证改变的效果",
                steps: [
                    "第1步：记录初始状态",
                    "第2步：执行改变措施",
                    "第3步：记录改变后状态",
                    "第4步：对比前后差异",
                    "第5步：评估改变效果"
                ],
                tips: ["量化指标", "保持客观"],
                application: "适合验证方法、工具、习惯等的效果"
            },
            suggestedTime: "2-4周"
        }
    ],

    reviewCards: [
        {
            id: "RE001",
            type: "复盘卡",
            title: "L1/L2/L3责任分级器",
            difficulty: 4,
            color: "#9C27B0",
            content: {
                concept: "所有事情都应分为三个责任等级",
                description: "通过责任分级管理时间和精力",
                levels: {
                    L1: { name: "体验责任", rule: "参与但不背结果", example: "参加活动、体验产品" },
                    L2: { name: "阶段责任", rule: "有期限、有交付", example: "完成项目、阶段性任务" },
                    L3: { name: "核心责任", rule: "深度投入，同时≤2个", example: "核心业务、长期目标" }
                },
                decisionTree: [
                    "1. 这件事能带来新判断力吗？",
                    "2. 需要投入多久？",
                    "3. 我有多大概率会想做深？"
                ]
            },
            suggestedTime: "即时"
        },
        {
            id: "RE002",
            type: "复盘卡",
            title: "能量管理复盘",
            difficulty: 3,
            color: "#9C27B0",
            content: {
                concept: "通过复盘优化能量分配",
                description: "分析能量消耗模式，找出优化空间",
                questions: [
                    "哪些活动消耗了我最多能量？",
                    "哪些活动给了我最多能量？",
                    "我如何平衡消耗和恢复？",
                    "哪些高耗能低产出的事可以停止？"
                ],
                actions: [
                    "减少高耗能低产出活动",
                    "增加高能量来源",
                    "优化能量分配时间"
                ]
            },
            suggestedTime: "每周"
        },
        {
            id: "RE003",
            type: "复盘卡",
            title: "决策复盘模型",
            difficulty: 3,
            color: "#9C27B0",
            content: {
                concept: "通过复盘提升决策质量",
                description: "回顾重要决策的过程和结果",
                framework: [
                    "当时的情况是什么？",
                    "我的决策依据是什么？",
                    "决策结果如何？",
                    "如果重来，我会怎么做？",
                    "学到了什么？"
                ],
                tips: ["客观记录", "聚焦学习"],
                frequency: "重大决策后"
            },
            suggestedTime: "决策后"
        },
        {
            id: "RE004",
            type: "复盘卡",
            title: "项目复盘四象限",
            difficulty: 3,
            color: "#9C27B0",
            content: {
                concept: "从四个维度全面复盘项目",
                description: "系统性地回顾项目的各个方面",
                quadrants: {
                    "做得好的": "继续保持和发扬",
                    "做得不好的": "需要改进和避免",
                    "遇到的意外": "总结经验教训",
                    "新的发现": "可以应用到未来"
                },
                process: "每个象限列出3-5个要点"
            },
            suggestedTime: "项目结束后"
        },
        {
            id: "RE005",
            type: "复盘卡",
            title: "时间投资复盘",
            difficulty: 2,
            color: "#9C27B0",
            content: {
                concept: "时间是最宝贵的资源，需要复盘投资效果",
                description: "回顾时间投入的产出比",
                analysis: [
                    "本周/月的时间分配如何？",
                    "哪些时间投入产生了高价值？",
                    "哪些时间被浪费了？",
                    "如何优化时间分配？"
                ],
                metrics: ["投入时间", "产出成果", "ROI"],
                action: "调整下个周期的时间分配"
            },
            suggestedTime: "每周/每月"
        },
        {
            id: "RE006",
            type: "复盘卡",
            title: "学习复盘法",
            difficulty: 2,
            color: "#9C27B0",
            content: {
                concept: "通过复盘巩固学习效果",
                description: "回顾学习过程，提炼关键收获",
                questions: [
                    "我学到了什么新知识？",
                    "这些知识如何与我已有知识连接？",
                    "我可以在哪些场景应用？",
                    "还有哪些疑问需要继续探索？"
                ],
                output: "整理成笔记、思维导图或文章"
            },
            suggestedTime: "学习后"
        },
        {
            id: "RE007",
            type: "复盘卡",
            title: "关系复盘模型",
            difficulty: 3,
            color: "#9C27B0",
            content: {
                concept: "通过复盘优化人际关系",
                description: "回顾重要关系的互动和成长",
                dimensions: [
                    "沟通质量：是否有效？",
                    "信任程度：是否加深？",
                    "互相价值：是否共赢？",
                    "成长空间：如何改进？"
                ],
                focus: "关键关系和合作伙伴",
                action: "优化互动方式，提升关系质量"
            },
            suggestedTime: "定期"
        },
        {
            id: "RE008",
            type: "复盘卡",
            title: "目标达成复盘",
            difficulty: 2,
            color: "#9C27B0",
            content: {
                concept: "通过复盘提升目标达成率",
                description: "回顾目标设定和达成过程",
                analysis: [
                    "目标设定是否合理？",
                    "执行过程如何？",
                    "达成或未达成的原因？",
                    "从中学习到什么？"
                ],
                apply: "改进下个目标的设定和执行"
            },
            suggestedTime: "目标完成后"
        },
        {
            id: "RE009",
            type: "复盘卡",
            title: "错误复盘法",
            difficulty: 2,
            color: "#9C27B0",
            content: {
                concept: "错误是最好的老师，但需要复盘才能学到",
                description: "深度分析错误，避免重复犯错",
                process: [
                    "错误是什么？",
                    "为什么会发生？",
                    "造成什么影响？",
                    "如何避免再次发生？",
                    "有什么正面收获？"
                ],
                mindset: "不要责备，要学习",
                output: "形成检查清单或原则"
            },
            suggestedTime: "错误发生后"
        },
        {
            id: "RE010",
            type: "复盘卡",
            title: "成功复盘模型",
            difficulty: 2,
            color: "#9C27B0",
            content: {
                concept: "成功需要复盘才能复制",
                description: "分析成功的关键因素，形成可复用的方法",
                questions: [
                    "成功的关键因素是什么？",
                    "哪些是可以复制的？",
                    "哪些是偶然因素？",
                    "如何应用到其他场景？"
                ],
                output: "提炼成功模式和方法论",
                value: "让成功可重复，可规模化"
            },
            suggestedTime: "成功后"
        }
    ]
};

// 卡牌权重配置
const cardWeights = {
    explore: 50,    // 50%概率抽到探索卡
    verify: 30,     // 30%概率抽到验证卡
    review: 20      // 20%概率抽到复盘卡
};

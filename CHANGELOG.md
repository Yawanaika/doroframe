# Changelog

这里记录 DoroFrame 每个正式版本的用户可见变更。版本内容由发布工作流根据
[Changelog 模板](.github/CHANGELOG_TEMPLATE.md)和 Git 提交记录自动生成。

<!-- changelog:entries -->

<!-- changelog:v0.1.3:start -->
## [0.1.3] - 2026-07-20

[查看 GitHub Release](https://github.com/Yawanaika/doroframe/releases/tag/v0.1.3) | [查看完整变更](https://github.com/Yawanaika/doroframe/commits/v0.1.3)

### 新功能

- **menu：**添加应用菜单并完善应用元数据 ([3d12f09](https://github.com/Yawanaika/doroframe/commit/3d12f09648cde9db7e14403aa54521020ab7ea2a))
- **updater：**添加应用自动更新功能 ([6ea3de0](https://github.com/Yawanaika/doroframe/commit/6ea3de02bb0fd241868c7f6c9bfd51eb8522fcec))
- **wpep：**添加 itemDetail 函数并更新依赖 ([bcda67d](https://github.com/Yawanaika/doroframe/commit/bcda67d35195ac91a88c0f9839aeefa9f67b656c))
- **sidebar：**重构用户导航组件并移除个人市场页面 ([f0e6f2d](https://github.com/Yawanaika/doroframe/commit/f0e6f2d29bb34d59179ae7ea7ca77726e794e6aa))
- **auction：**添加紫卡预览功能并改进数值输入字段 ([04f684e](https://github.com/Yawanaika/doroframe/commit/04f684e494aeedd44f7df8babc36048263b9d871))
- **market：**添加创建拍卖和订单的浮动按钮功能 ([f09d640](https://github.com/Yawanaika/doroframe/commit/f09d64096c985b9c8a835df8c88f649c01ecd279))
- **market：**添加拍卖编辑和管理功能 ([ed8c13c](https://github.com/Yawanaika/doroframe/commit/ed8c13c9a6d01059065c74fe9cea2df11c27cacd))
- **market：**添加伤害数值和元素属性支持 ([d40e146](https://github.com/Yawanaika/doroframe/commit/d40e146e224696f32d3743e2bfc9742a733d6aec))
- **market：**添加杜卡德效率页面功能 ([78d5990](https://github.com/Yawanaika/doroframe/commit/78d5990196d8604792767dbfcfd1c7599ea51957))
- **market：**添加杜卡德效率统计数据获取功能 ([65e781d](https://github.com/Yawanaika/doroframe/commit/65e781defd8d4f120e770b17a2f3d1c8b70da913))
- **market：**更新拍卖出价接口以支持拍卖快照 ([5dc684d](https://github.com/Yawanaika/doroframe/commit/5dc684dc6275b3ef3308881d87f3da6f48244564))
- **auction：**更新拍卖出价界面交互体验 ([ae2c11b](https://github.com/Yawanaika/doroframe/commit/ae2c11bbfc7c7a90c6bec96a613ea6e46382f660))
- **market：**添加拍卖出价功能 ([e1f7fd0](https://github.com/Yawanaika/doroframe/commit/e1f7fd0cc88b9a3ff6f17f5e4d437816f2ce38cf))
- **market：**添加拍卖实时更新WebSocket功能 ([da7dfad](https://github.com/Yawanaika/doroframe/commit/da7dfad8efe1ebb54382d660320182bdcf36a3c3))
- **world：**添加节点信息显示到区域悬赏架组件 ([58c0dd0](https://github.com/Yawanaika/doroframe/commit/58c0dd073352c00eb3797f69de2b0777f0ff10f1))
- **auction：**添加紫卡属性显示和卖家信息保护 ([1f288cb](https://github.com/Yawanaika/doroframe/commit/1f288cbe6d954274b16c1fce851fef69ba9a6d94))
- **market：**添加用户个人中心的拍卖和竞拍功能 ([0cbd9b1](https://github.com/Yawanaika/doroframe/commit/0cbd9b1353b490b8288af86b3e82f49ef787dcff))
- **market：**在喊话功能中添加物品等级信息显示 ([1fb26c2](https://github.com/Yawanaika/doroframe/commit/1fb26c27c389f011314f1d5e211d985f687aa4e6))
- **auction：**添加属性选择排除功能 ([3defd83](https://github.com/Yawanaika/doroframe/commit/3defd83dfce4661b0deb8f641e9ed7036586e9e6))
- **market：**重构紫卡词条选择组件为分组式下拉选择 ([1dea079](https://github.com/Yawanaika/doroframe/commit/1dea07968581b74e6e3f9762e96219a0aa0f7bd0))
- **market：**实现按武器类型筛选紫卡词条功能 ([f2aaf30](https://github.com/Yawanaika/doroframe/commit/f2aaf305dbea4f92b8a93267c145b6e1af5cfebc))
- **market：**在拍卖卡片中显示白金图标 ([fd634a2](https://github.com/Yawanaika/doroframe/commit/fd634a2b69ed627a7843a561e9c4854f4cddcf07))
- **market：**为拍卖搜索添加武器分组功能 ([2493cc6](https://github.com/Yawanaika/doroframe/commit/2493cc653866a69bcab724793718ef56f3550e81))
- **market：**添加元素图标显示功能 ([44c667e](https://github.com/Yawanaika/doroframe/commit/44c667e403d871d7a29e6bff362f02990c5238e0))
- **auth：**添加会话过期检测和自动登出功能 ([8b151d8](https://github.com/Yawanaika/doroframe/commit/8b151d83f48d2359698744ed06b64b87482e167e))
- **auction：**添加拍卖创建对话框中的卡面预览功能 ([a920618](https://github.com/Yawanaika/doroframe/commit/a9206189ba91089241408fd218603323f4778e2e))
- **market：**添加拍卖功能支持 ([9530b06](https://github.com/Yawanaika/doroframe/commit/9530b06862a76ba67c5c446495b911f094a1b9eb))
- **market：**添加 rankLt 过滤参数支持未满级订单分组对比 ([94d04bc](https://github.com/Yawanaika/doroframe/commit/94d04bcd7a09b340d8cd8a38b7cfb0790c26ef9f))
- **market：**为市场订单接口添加变体过滤功能 ([5f8a92d](https://github.com/Yawanaika/doroframe/commit/5f8a92d048f9a871b5ff8f1e7d9ce2a293194ff5))
- **market：**添加批量交易功能支持 ([e4e25fa](https://github.com/Yawanaika/doroframe/commit/e4e25fac8378f7915d0cbfd98c063e6421976f8b))
- **wf-market：**添加物品批量交易属性 ([aedbe1f](https://github.com/Yawanaika/doroframe/commit/aedbe1fcfad0afceb1bc7fb8c3078bb88b589f20))
- **market：**更新订单操作以支持批量交易数量 ([70ccb7b](https://github.com/Yawanaika/doroframe/commit/70ccb7b23736f849ced8e73536e30e2a8a8a6bb7))
- **market：**添加订单编辑对话框中的子类型选择功能 ([0a3319b](https://github.com/Yawanaika/doroframe/commit/0a3319bf6fda91af3e822d0729d6e4793768a81d))
- **market：**添加订单编辑功能和相关组件 ([75fc4cd](https://github.com/Yawanaika/doroframe/commit/75fc4cdda1e01d57e76c2fe594f5c05fa8c4a7dc))
- **market：**添加市场物品页面深链接支持 ([d91e05d](https://github.com/Yawanaika/doroframe/commit/d91e05ddccb9e354bfa5d3338058e11a5e14cd01))
- **market：**添加紫卡赤毒姐妹相关API接口和数据类型 ([5c48aa1](https://github.com/Yawanaika/doroframe/commit/5c48aa1116aec00e0259029f80b66f68413b77e9))
- **market：**添加最近订单查询功能 ([c7caa37](https://github.com/Yawanaika/doroframe/commit/c7caa37672425916fad67ff827a61edba580fa05))
- **market：**添加订单批量可见性管理功能 ([1860338](https://github.com/Yawanaika/doroframe/commit/18603388824db281de3206d50e719a7e5f50c650))
- **market：**更新市场订单功能并优化UI界面 ([5a76d06](https://github.com/Yawanaika/doroframe/commit/5a76d064192f5883ac433d9c156b9f26f0f7c1f6))
- **market：**添加订单显示功能并优化订单操作界面 ([7c93b50](https://github.com/Yawanaika/doroframe/commit/7c93b50101795ae49d564396f3b64f6f9e5b93dd))
- **market：**添加订单关闭和删除功能 ([ee2e78b](https://github.com/Yawanaika/doroframe/commit/ee2e78b1f34fb28e1cc6167581b057bb1a081686))
- **market：**添加Top订单查询和编辑订单功能 ([3adfcd0](https://github.com/Yawanaika/doroframe/commit/3adfcd04cada8efcbef39e887ba38a5c63ec4377))
- **world：**添加倒计时功能到无尽回廊组件 ([6218df1](https://github.com/Yawanaika/doroframe/commit/6218df11458b09643bf7decab81771b207f707c5))
- **market：**添加用户订单页面功能 ([3b0e643](https://github.com/Yawanaika/doroframe/commit/3b0e643fd53612fbf5d0640489617c49d05397a2))
- **market-me：**重构用户个人资料页面界面 ([eb706a5](https://github.com/Yawanaika/doroframe/commit/eb706a5e1b86e735d12481968d0b714edb7f626c))
- **market：**重构订单创建对话框并优化国际化支持 ([9f6a1e0](https://github.com/Yawanaika/doroframe/commit/9f6a1e09477314e54aa74600d6f4c50ae8c0e901))
- **market：**添加市场下单功能和用户认证 ([7b9a6a1](https://github.com/Yawanaika/doroframe/commit/7b9a6a1d0b2ef9a152b4e7aeaae10775f7d267e6))
- **market：**重构市场订单列表为表格组件 ([45c30d0](https://github.com/Yawanaika/doroframe/commit/45c30d07a5d134e5d93f99d996910ad9b76b0580))
- **world：**添加倒计时功能到仲裁卡片和赛季信息卡片 ([8e58cfd](https://github.com/Yawanaika/doroframe/commit/8e58cfdcd812e926a134d7c2c75aee993d63ef72))
- **market：**添加市场交易功能支持 ([4ae2b2c](https://github.com/Yawanaika/doroframe/commit/4ae2b2c7b48b9ba00d73c9fa28aab8e0b5a89220))
- **i18n：**添加事件相关国际化支持并优化组件显示 ([1e644cb](https://github.com/Yawanaika/doroframe/commit/1e644cb11e8e0bc1519c8cad0970bb0515b6f825))
- **world：**添加钢铁侵袭功能支持 ([8cac1c9](https://github.com/Yawanaika/doroframe/commit/8cac1c9c6d7cf3b25ca24f10926020db8da76edc))
- **lang：**添加生日事件翻译并更新奖励和复活描述 ([562c913](https://github.com/Yawanaika/doroframe/commit/562c9131cbb00bbad19b042c23650593c95ab2f9))
- **calendar：**添加月历卡片组件并重构日历功能 ([b843d00](https://github.com/Yawanaika/doroframe/commit/b843d001e9502fbb6269aa106516e8f271f7c538))
- **theme：**添加哔哩哔哩主题样式支持 ([083e2ad](https://github.com/Yawanaika/doroframe/commit/083e2ad12c056a0af3847d6f98e52638237be55e))
- **calendar：**更新1999日历组件显示完整事件详情 ([df6fa69](https://github.com/Yawanaika/doroframe/commit/df6fa696bd99e679ba0b540f5dc893edbddd8c6f))
- **wpep：**添加奖励表解析功能 ([c2e7d8a](https://github.com/Yawanaika/doroframe/commit/c2e7d8ab0a40e57a5e29d49e8c4314f95363a55f))
- **world：**添加目标奖励阶梯展示功能 ([7811ec6](https://github.com/Yawanaika/doroframe/commit/7811ec60c56a77630238414788f97dc4409c79e8))
- **world：**优化i18n支持 ([412869e](https://github.com/Yawanaika/doroframe/commit/412869e520307e094a8bba5046125861f092cc8e))
- **lang：**添加隔离保险库分级名称翻译 ([5689a81](https://github.com/Yawanaika/doroframe/commit/5689a81543d628ce43ba6d5140e38797a87b0743))
- **home：**添加首页和赏金轮换功能 ([9de735e](https://github.com/Yawanaika/doroframe/commit/9de735e98b19f19436382f3b3542d40dd7d4c57e))
- **world：**更新沉沦之地功能和翻译 ([2318e2f](https://github.com/Yawanaika/doroframe/commit/2318e2f9ed7394894ea69cc8b2c08d48ed44899e))
- **world：**更新无尽回廊卡片显示样式 ([8e6eda1](https://github.com/Yawanaika/doroframe/commit/8e6eda1daaa4841741b4a25f21a36ec2cfb14e8d))
- **i18n：**添加入侵事件国际化支持并优化字典加载路径 ([bf69f25](https://github.com/Yawanaika/doroframe/commit/bf69f254f3ec0ac0de4e6258e478d48307236677))
- **world：**添加虚空裂缝难度筛选功能 ([a2bdf9b](https://github.com/Yawanaika/doroframe/commit/a2bdf9b59a1034138b9959918395af67333a620c))
- **state：**更新状态页面任务标题并重新排列组件 ([053f6df](https://github.com/Yawanaika/doroframe/commit/053f6dfd6ef8881cc1f8b009f147855a5f127c92))
- **event-card：**支持多图轮播并优化虚空事件显示 ([f5a7fa0](https://github.com/Yawanaika/doroframe/commit/f5a7fa0e0b23d7f74021f212aa926476775e09cf))
- **void：**添加虚空裂缝数据字典和界面优化 ([43fdacf](https://github.com/Yawanaika/doroframe/commit/43fdacf0f43aa71806b5261a1d323ceb433283c1))
- **i18n：**实现多语言支持和界面优化 ([85bbcc6](https://github.com/Yawanaika/doroframe/commit/85bbcc6da91346f58cc579687b955a77dac1141c))
- **world：**添加Prime宝库价格显示功能 ([d164c09](https://github.com/Yawanaika/doroframe/commit/d164c09c7794ea201ad6d2f16b9f3543ef294e93))
- **void-trader：**重构虚空商人卡片显示界面 ([72cbb88](https://github.com/Yawanaika/doroframe/commit/72cbb886093398c7596fbfb688a9f2db536daad6))
- **world：**更新征服任务显示和翻译配置 ([dbfe30a](https://github.com/Yawanaika/doroframe/commit/dbfe30a5c9584480f9c8514c7a29b13435d31ae9))
- **tooltip：**添加对齐属性支持并优化箭头样式 ([eab7a58](https://github.com/Yawanaika/doroframe/commit/eab7a582a69ea7afd8b9ea36828bd413041349d7))
- **settings：**添加主题切换功能和多色彩主题支持 ([f81d5e1](https://github.com/Yawanaika/doroframe/commit/f81d5e108879b312252bdcffb2f65031cdcf89b3))
- **void-trader：**更新虚空商人卡片显示和本地化支持 ([3431dc9](https://github.com/Yawanaika/doroframe/commit/3431dc92083b8d7ee7a6bce740735cd0784fa46d))
- **i18n：**添加新的国际化词条 ([9896ece](https://github.com/Yawanaika/doroframe/commit/9896ece92d8dea6822318376920b368bec0c0009))
- **ui：**添加进度条组件并优化事件卡片显示 ([a52716f](https://github.com/Yawanaika/doroframe/commit/a52716ff96aaf157b89ccdc6ac821b4a7bfd52c6))
- **i18n：**添加多语言支持并重构国际化系统 ([6d97f91](https://github.com/Yawanaika/doroframe/commit/6d97f913d6d288d2997a4d31b58736684180e901))
- **router：**添加设置页面路由配置 ([4ddfe1e](https://github.com/Yawanaika/doroframe/commit/4ddfe1e95273fa6c7f5529526d4f88b2f440d71d))
- **router：**添加路由配置和状态页面组件 ([8a9fedf](https://github.com/Yawanaika/doroframe/commit/8a9fedf27e1309233f0bbb238ff0b0e2e468405a))
- **ui：**添加基础UI组件库和世界状态获取功能 ([5e1a41c](https://github.com/Yawanaika/doroframe/commit/5e1a41cf0117248a2bf09f9a5a70da715d9f6083))

### 问题修复

- **market：**通过图片代理解决 warframe.market 静态资源跨域问题 ([8708abd](https://github.com/Yawanaika/doroframe/commit/8708abd024e8263c3c73e65be81d44d05738315b))
- **lang：**修复日历mod翻译文件中的键名和翻译 ([09afdc7](https://github.com/Yawanaika/doroframe/commit/09afdc7c2edd0b5b9577da92fdfdb803de02b93d))
- **auction：**修复我的拍卖组件中的可见性状态逻辑 ([0fc831b](https://github.com/Yawanaika/doroframe/commit/0fc831bddf13e23eee3a2c178246036a79e11e11))
- **lang：**修复日历升级数据的语言本地化问题 ([d4636ed](https://github.com/Yawanaika/doroframe/commit/d4636ed94e41c05980f6e0fa87144b4f3b644d6f))
- **auction：**修复拍卖卡片价格显示的HTML结构问题 ([6f6d909](https://github.com/Yawanaika/doroframe/commit/6f6d909fb4ea956c10cc559097955c4931c4c985))
- **lang：**修复日历技能翻译文件中的键名和内容 ([57aaff8](https://github.com/Yawanaika/doroframe/commit/57aaff826be3dc381e569842519e804539490eb3))
- **world：**修复角色图标显示问题 ([6047442](https://github.com/Yawanaika/doroframe/commit/60474422f1f2dcaf00ed80339ab2d788a4aa1a78))
- **market：**修复拍卖卡片语言检测并优化加载状态显示 ([7041357](https://github.com/Yawanaika/doroframe/commit/7041357d144fdf1109b78eb81bdfe95a8ba86fd8))
- **wf-market：**修复物品批量交易属性的空值处理 ([ef441ad](https://github.com/Yawanaika/doroframe/commit/ef441ad44f6ccf07452db6b67ca3e74829f640e1))
- **i18n：**更新市场导航标签文本 ([dc61e9c](https://github.com/Yawanaika/doroframe/commit/dc61e9c3a98cf08cf423f019f54b451c387c9fc5))
- **market：**修复我的订单组件中的项目链接功能 ([af9257b](https://github.com/Yawanaika/doroframe/commit/af9257b3671990404a6b94499632c0f27855c79e))
- **lang：**修复日历数据中的键名错误 ([cdf73e1](https://github.com/Yawanaika/doroframe/commit/cdf73e1d7cf51efb2857ac82890483c64d1333fa))
- **calendar：**修复事件卡片布局问题 ([7c03384](https://github.com/Yawanaika/doroframe/commit/7c03384610cbef334e9d2b50059d29005c6e523b))
- **world：**更新世界状态API端点URL ([3a187c6](https://github.com/Yawanaika/doroframe/commit/3a187c695130b0619c65003902fa6f7f0fa01a61))
- **world：**修复无尽回廊组件中的图标定位问题 ([2674b88](https://github.com/Yawanaika/doroframe/commit/2674b88bacc53ed3421abff51a36e4804cb4becb))
- **void：**修复虚空风暴事件排序和显示问题 ([fd592ec](https://github.com/Yawanaika/doroframe/commit/fd592ec26fb5655908dda980b57bc7e6a8b9a0cd))
- **goal：**修复活动进度百分比显示精度问题 ([84604dd](https://github.com/Yawanaika/doroframe/commit/84604dd7f5470779391158bc46a8a4c2159e7fce))

### 性能优化

- **market：**优化订单列表性能并改进组件结构 ([a148b97](https://github.com/Yawanaika/doroframe/commit/a148b97d896cdbc6faccd1947d249d3f4ef13928))

### 代码重构

- **world：**更新警报卡片组件以使用物品详情 ([939bbdd](https://github.com/Yawanaika/doroframe/commit/939bbdd7e6021e0a34b188b7cb7d31ba2ebfbbaa))
- **market：**重构创建拍卖和订单对话框组件 ([43b2475](https://github.com/Yawanaika/doroframe/commit/43b24755d65efe2ca39478595161e720ab15d4cb))
- **world：**重构仲裁卡片组件以提升性能 ([9e5c2a9](https://github.com/Yawanaika/doroframe/commit/9e5c2a9eb475a8468f4134993c47cb6db164418e))
- **market：**将竞拍出价状态管理迁移到zustand store ([d856088](https://github.com/Yawanaika/doroframe/commit/d85608839f8d9aec1db8bb5d8262b6430e5c45ed))
- **market：**重构拍卖卡片组件布局和价格显示逻辑 ([02d2ee4](https://github.com/Yawanaika/doroframe/commit/02d2ee4df3bb0394054fe43653c869c143c024f6))
- **market：**优化拍卖订单所有者数据处理逻辑 ([052ab71](https://github.com/Yawanaika/doroframe/commit/052ab7124c09248c80d832e385d613d403b6e284))
- **market：**提取极性图标为独立组件 ([e3818af](https://github.com/Yawanaika/doroframe/commit/e3818afa9ebc729bb9b1a876a64467ddb90b05b7))
- **market：**重构拍卖创建对话框为独立组件 ([d1507d5](https://github.com/Yawanaika/doroframe/commit/d1507d590641a5911377521f4e8531fb970dc345))
- **market：**重构拍卖创建对话框的词条管理逻辑 ([9853744](https://github.com/Yawanaika/doroframe/commit/985374422712f1debc7f8066961ae1b6e8febb4d))
- **world：**替换 itemName 函数为 rewardName 函数 ([ad5dd38](https://github.com/Yawanaika/doroframe/commit/ad5dd380f50fc6c09fc515ba7276855764ebaaa5))
- **auction：**更新组件导入路径并替换极性选择器实现 ([5c94462](https://github.com/Yawanaika/doroframe/commit/5c9446221285c4fd29353dbcc34d5f445c942ea4))
- **market：**重构极性选择组件为独立组件 ([f429977](https://github.com/Yawanaika/doroframe/commit/f42997749e75fcf12088818097da212c1a512970))
- **auction：**重构武器搜索组件为独立的组合框组件 ([5568d8f](https://github.com/Yawanaika/doroframe/commit/5568d8fb8fe35157a0b46c21c043fc565e16658a))
- **market：**重构拍卖搜索中的武器分组逻辑 ([f3a5a3e](https://github.com/Yawanaika/doroframe/commit/f3a5a3ef3adf3e150204aea1c65e8b24537dfc44))
- **auth：**简化令牌过期检查逻辑 ([f88e340](https://github.com/Yawanaika/doroframe/commit/f88e340572116333d6c85f88c514781e77b14f56))
- **market：**统一模块导入路径 ([1fa5c2e](https://github.com/Yawanaika/doroframe/commit/1fa5c2e671d674be6f3eaa8dddc401e06272160d))
- **market：**重构订单元信息显示组件并添加内融核心列 ([3a86548](https://github.com/Yawanaika/doroframe/commit/3a865483e9a0b83a38756ad65c457620a707bd3c))
- **market：**提取订单表单字段组件到共享模块 ([46c152c](https://github.com/Yawanaika/doroframe/commit/46c152c3dc92c7308bec3c4dc4dafc7b18b26108))
- **nav：**移除导航状态项的重复子菜单 ([232ac05](https://github.com/Yawanaika/doroframe/commit/232ac05ef5783f22bf695b9c27ea29d324446d3a))
- **router：**将路由历史记录从内存模式切换到哈希模式 ([e76fa4a](https://github.com/Yawanaika/doroframe/commit/e76fa4ad18ee3a4238089376d5f7f0aa1e309dba))
- **router：**将路由历史记录从内存模式切换到哈希模式 ([bb552cd](https://github.com/Yawanaika/doroframe/commit/bb552cdd38c0da9fcdef898d813dbfff9becac9a))
- **market：**优化订单统计显示逻辑 ([c0df452](https://github.com/Yawanaika/doroframe/commit/c0df452186849c0ea4ad7dc42d75dc5a6033868e))
- **market：**合并已售出、展示、+1功能，统一使用editOrder ([e9cd1ae](https://github.com/Yawanaika/doroframe/commit/e9cd1aefbdfb6a8949d9aae2ab1d9549422c8986))
- **market：**重构订单操作逻辑并添加多语言支持 ([1eef3a8](https://github.com/Yawanaika/doroframe/commit/1eef3a8c5a47c970a6f1c65e6a76ce6df0931ca4))
- **world：**重构无尽回廊组件以支持新数据结构 ([f2db8b7](https://github.com/Yawanaika/doroframe/commit/f2db8b7a3c271cf8142ffba7d2a1a3b30cd89bb1))
- **market：**优化市场组件类型定义和接口设计 ([3c16456](https://github.com/Yawanaika/doroframe/commit/3c164561cd44ac3b3a929d6f1c864d70bc59dffa))
- **market：**重构订单列表组件结构并优化样式 ([dfbd524](https://github.com/Yawanaika/doroframe/commit/dfbd5243dfd2b0168516358f3e4840b7805f21a6))
- **market：**重构市场相关功能的类型定义和组件结构 ([828dd02](https://github.com/Yawanaika/doroframe/commit/828dd02ff49e190a455fdce954e114eb23c0b7d6))
- **wpep：**优化物品名称获取逻辑 ([80fd06c](https://github.com/Yawanaika/doroframe/commit/80fd06c09937212a0adbac7d4939ed7fe468a78e))
- **world：**移除入侵卡片中多余的防御方派系图标 ([3a8df9a](https://github.com/Yawanaika/doroframe/commit/3a8df9a08b1f7d9783fc010edb0f36efaae78955))
- **world：**统一图片资源路径到images目录 ([6e4161c](https://github.com/Yawanaika/doroframe/commit/6e4161cfb1be803742ffa17f5b0fc807e32c13d2))
- **store：**调整设置模块的导入路径 - 在 src/store/index.ts 中添加 settings 模块的导出 - 更新世界查询逻辑以使用新的设置存储路径 ([0830ce8](https://github.com/Yawanaika/doroframe/commit/0830ce83b67cd1f4db4ca0ede652d007149e1299))
- **event-card：**重构事件卡片组件以支持前后缀图片 ([654916c](https://github.com/Yawanaika/doroframe/commit/654916c29849a2743af846f1179ff6adb0989259))
- **world：**重构赛季信息卡片挑战显示组件 ([80c3c4d](https://github.com/Yawanaika/doroframe/commit/80c3c4daff47ca0ec9ca7a6cecf6bd608aa0ae24))
- **wpep：**导出serializeValue函数并优化正则表达式替换 ([ea76d51](https://github.com/Yawanaika/doroframe/commit/ea76d5103e71da8818470fd268109b117679c13d))
- **world：**重构世界状态组件以优化物品展示 ([38dff99](https://github.com/Yawanaika/doroframe/commit/38dff99e23be12be58bfb5ae0a9c41b26fed059f))
- **world：**优化任务卡片布局和状态页面结构 ([003c44a](https://github.com/Yawanaika/doroframe/commit/003c44aaedfecb77662a6325ccefe5a07f568a68))
- **router：**重构路由配置并优化界面组件 ([f0377a7](https://github.com/Yawanaika/doroframe/commit/f0377a7534612daca1124f9c182a3574027d4ef4))

### 界面与样式

- **auction：**调整拍卖卡片组件样式 ([c7dac5f](https://github.com/Yawanaika/doroframe/commit/c7dac5fccc48d174c92ff48b855db59d47415032))
- **app：**统一应用标题和描述文案 ([ddaa211](https://github.com/Yawanaika/doroframe/commit/ddaa2115400b0e125ad0f1808d45989bd9e3e998))
- **components：**优化组件样式和代码注释 ([2dedf95](https://github.com/Yawanaika/doroframe/commit/2dedf957227d53f51acfbbb29746476f68ea69c8))
- **world：**统一任务卡片副标题中的空格格式 ([cbf67b5](https://github.com/Yawanaika/doroframe/commit/cbf67b588ad3b97f34077d7ac8c987f21377b4d8))
- **layout：**优化页面布局样式 ([bf529fd](https://github.com/Yawanaika/doroframe/commit/bf529fd4cec01daafebae1967ef49fb619c2ad34))
- **market：**移除订单列表项的透明度样式 ([a3e3567](https://github.com/Yawanaika/doroframe/commit/a3e35672f9843983887f84f025ba78fc73a35b97))
- **market：**添加等宽数字字体以改善表格对齐 ([c1086a1](https://github.com/Yawanaika/doroframe/commit/c1086a19f1de10bab30610ff3cdb6a3debcebb8e))
- **theme：**更新 bilibili 主题的颜色变量配置 ([1b0673c](https://github.com/Yawanaika/doroframe/commit/1b0673c8549aaf03fb104ba45786248179c172a2))
- **lang：**更新NPC名称翻译为英文 ([6a473b0](https://github.com/Yawanaika/doroframe/commit/6a473b07d92fb86f3e7f317613887fc30af48c57))
- **theme：**应用 Islands 主题设计系统 ([4d88113](https://github.com/Yawanaika/doroframe/commit/4d88113b0872e22bc2ad970794bcf1c78d5fe4f5))

### 移除内容

- **ux：**移除设置页面和登出功能 ([5643c3e](https://github.com/Yawanaika/doroframe/commit/5643c3e16c8f0d196d40b22eca375baf3a783fcb))
- **weekly：**删除周常页面及相关路由配置 ([96a0011](https://github.com/Yawanaika/doroframe/commit/96a001155ae2e75dfdc7906a97db50208d96db97))

### 文档

- **calender：**更新靶向治疗词条翻译 ([1340dc6](https://github.com/Yawanaika/doroframe/commit/1340dc6e5cb69b25551219f0a0e0200c58e1aa44))

### 测试

- **market：**添加市场功能相关单元测试 ([1e8c545](https://github.com/Yawanaika/doroframe/commit/1e8c5456a67272b14f6488ad229c13a1f4f9b61e))

### 工程与依赖

- **release：**更新版本号并移除 Apple 开发者凭据配置 ([df0e1b8](https://github.com/Yawanaika/doroframe/commit/df0e1b882acd13394835dff162e55086c5cc1a8c))
- **release：**更新版本号从 0.1.1 到 0.1.2 ([2569900](https://github.com/Yawanaika/doroframe/commit/25699003efcd9780b46d9033e7a2610260e953d5))
- **build：**更新 macOS 构建配置并增加内存限制 ([ce0dab7](https://github.com/Yawanaika/doroframe/commit/ce0dab727467ad9dbb260956d45ac8974b88e6f5))
- **release：**添加本地发布脚本和相关配置 ([0476051](https://github.com/Yawanaika/doroframe/commit/04760516e1d8a941ed06e23cb2398dfe41f8874b))
- **workflow：**添加 Warframe Public Export Plus 自动更新工作流 ([8d1d3b8](https://github.com/Yawanaika/doroframe/commit/8d1d3b897386e57b13be893db9a175d894fb3858))
- **deps：**移除 warframe-worldstate-data 依赖 ([804b90c](https://github.com/Yawanaika/doroframe/commit/804b90c685efb74787408a95888a6d4fd4054082))
- **config：**调整窗口尺寸配置 ([d780fb9](https://github.com/Yawanaika/doroframe/commit/d780fb9485049a7c7b0c72c886302eb5eac0f2fc))
- **lang：**update invasion dictionary translations ([47034d4](https://github.com/Yawanaika/doroframe/commit/47034d4d1188b14b2394a873340986965313e156))

### 其他变更

- **lang：**更改秋季季节标签从 AUTUMN 到 FALL ([6a477b6](https://github.com/Yawanaika/doroframe/commit/6a477b6913b58de9e9edbeae35ff60094ac1d8e0))
- Initial commit ([b73f7a1](https://github.com/Yawanaika/doroframe/commit/b73f7a12054cab53d3f53f855bd99c5d646d14ad))

### 贡献者

- Su
- Yika
<!-- changelog:v0.1.3:end -->

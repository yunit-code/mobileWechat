# 文本
此组件为轮播广告组件，支持高度设置，上下内边距设置，图片 圆角设置，可灵活配置接口显示图片数量
## 组件类名（className）
IBanner
## 组件类ID（classId）
idm.componet.mobilewechat.banner
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobilewechat@1.0.6
## 组件属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>

#### 标题【htmlTitle】
<font color="#CCCCCC">当前组件标题，页面中不显示，用来增加组件辨识度</font>

#### 显示数量【limit】
- limit: 图片显示数量限制
- 默认值: `5 `(最大值，如果总数量没有达到默认值，则显示总数量，例如：设置了5，总共4个，则显示4)

#### 跳转方式【jumpStyle】
> 点击事件跳转方式
- _self:当前页跳转
- _blank:新开窗口跳转

### 样式设置
#### 轮播高度【height】
- height: 设置轮播图片高度
- 默认值: `240px`

#### 图片圆角【imgBorderRadius】
- height: 设置轮播图片圆角
- 默认值: `8px`

#### 上外边距【marginTop】
- height: 设置轮播图片上外边距
- 默认值: `0`

#### 下外边距【marginBottom】
- height: 设置轮播图片下外边距
- 默认值: `0`

### 高级
#### 数据源【dataSource】
#### 数据接口【bannerInterfaceUrl】
#### 显示字段【dataFiled】
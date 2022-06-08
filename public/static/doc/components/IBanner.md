# 轮播广告
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
mobilewechat@1.0.7
## 组件属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>

#### 组件标题【title】
<font color="#CCCCCC">当前组件标题，页面中不显示，用来增加组件辨识度</font>

- 标识: `title`
- 默认值: 广告轮播

#### 显示方块【showBullet】
<font color="#CCCCCC">当前组件分页器是否显示，配置环境时不显示</font>

- 标识: `showBullet`
- 默认值: `true`显示

#### 跳转方式【jumpStyle】
> 点击事件跳转方式

- 标识: `jumpStyle`
- _self:当前页跳转
- _blank:新开窗口跳转
- _auto: 智能跳转打开

```json
智能跳转打开的方式是依据当前所在的环境并依据以下执行顺序来进行判定打开方式的：
1、优先判断是否在微信APP环境中，如果是在微信APP则会使用微信内置的新窗口方式打开
2、其次会执行其他环境的新窗口打开方式
3、最后如果所在环境不支持则会直接使用当前页跳转方式打开
```
- 默认值：`_self`

#### 显示数量【limit】
- 标识: `limit`
- 默认值: `5 `(最大值，如果总数量没有达到默认值，则显示总数量，例如：设置了5，总共4个，则显示4)

### 样式设置
#### 大屏高度【maxHeight】
- 标识: `maxHeight`
- 默认值: `32vw`

#### 小屏高度【height】
- 标识: `height`
- 默认值: `180px`

#### 大屏间隔【bigScreenStretch】
- 标识: `bigScreenStretch`
- 默认值: `-6%`

#### 小屏间隔【smallScreenStretch】
- 标识: `smallScreenStretch`
- 默认值: `-7%`

#### 分界点【dividingPoint】
- 标识: `smallScreenStretch`
- 默认值: `800`

#### 图片圆角【imgBorderRadius】
- 标识: `imgBorderRadius`
- 默认值:
```json
"default": {
  "inputVal": 8,
  "selectVal": "px"
}
```

#### 上外边距【marginTop】
- 标识: `marginTop`
- 默认值: `0`

#### 下外边距【marginBottom】
- 标识: `marginBottom`
- 默认值: `0`

#### 标题文字【titleFontStyle】
设置组件的标题文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`titleFontStyle`
- 默认值：空

### 主题设置【themeList】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。
- 标识：`themeList`
- 默认值：`[]`

### 高级
<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

##### 数据模式【showType】
用于设置轮播组件数据展示模式 可选 数据源 / 自定义上传图片
- 标识：`showType`
- 默认值：`dataSource`

##### 轮播配置【bannerTable】
用于设置轮播组件数据上传自定义上传图片
- 标识：`bannerTable`
- 默认值：
```json
{
    "type": "input",
    "layoutType": "inline",
    "text": "轮播标题",
    "bindKey": "title",
    "default": "标题"
},
{
    "type": "input",
    "layoutType": "inline",
    "text": "跳转链接",
    "bindKey": "jumpUrl",
    "default": ""
},
{
    "type": "uploadImage",
    "layoutType": "block",
    "text": "小屏图片",
    "bindKey": "image",
    "default": ""
}
{
    "type": "uploadImage",
    "layoutType": "block",
    "text": "大屏图片",
    "bindKey": "imagexl",
    "default": ""
}
```

##### 数据源【dataSource】
用于选择数据源
- 标识：`dataSource`
- 默认值：`/ctrl/dataSource/getDatasourceByGroup`

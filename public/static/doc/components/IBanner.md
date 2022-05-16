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
mobilewechat@1.0.7
## 组件属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>

#### 组件标题【htmlTitle】
<font color="#CCCCCC">当前组件标题，页面中不显示，用来增加组件辨识度</font>

- 标识: `htmlTitle`
- 默认值: 广告轮播

#### 跳转方式【jumpStyle】
> 点击事件跳转方式

- 标识: `htmlTitle`
- _self:当前页跳转
- _blank:新开窗口跳转
- 默认值: 广告轮播

#### 显示数量【limit】
- 标识: `limit`
- 默认值: `5 `(最大值，如果总数量没有达到默认值，则显示总数量，例如：设置了5，总共4个，则显示4)

### 样式设置
#### 轮播高度【height】
- 标识: `height`
- 默认值: `240px`

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

#### 下外边距【】
- 标识: `marginBottom`
- 默认值: `0`

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
    "text": "轮播图片",
    "bindKey": "image",
    "default": ""
}
```

##### 数据源【dataSource】
用于选择数据源
- 标识：`dataSource`
- 默认值：`/ctrl/dataSource/getDatasourceByGroup`

##### 数据接口【customInterfaceUrl】
通过自定义数据接口获取数据
- 标识：`customInterfaceUrl`
- 默认值：`/ctrl/dataSource/getDatas`
- 返回数据默认格式:
```json
"res": "200",
"message: "success",
"data" : {
    "value": [
        {
            "jumpUrl": '/dreamweb/',
            "image": "",
            "title": "标题",
        }
    ],
    "moreUrl": "更多跳转地址"
}
```

##### 显示字段【dataFiled】
根据接口返回数据显示轮播图片字段
- 标识：`dataFiled`
- 默认值：'image'
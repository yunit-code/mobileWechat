# 文本
统一待办组件
## 组件类名（className）
IUnifiedTodo
## 组件类ID（classId）
idm.componet.mobilewechat.unifiedTodo
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobilewechat@1.0.6
## 组件属性
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
#### 组件标题【htmlTitle】
<font color="#CCCCCC">当前组件标题，用来增加组件辨识度</font>

- 标识：`htmlTitle`
- 默认值： 紧急待办


#### 跳转方式【jumpStyle】
> 点击事件跳转方式
- _self:当前页跳转
- _blank:新开窗口跳转
- 默认值：`_self`

#### 显示更多【showMore】
<font color="#CCCCCC">是否显示更多按钮/icon</font>

- 标识：`showMore`
- 默认值： "true"

#### 显示角标【showTodoNumber】
<font color="#CCCCCC">是否待办数量，在显示更多为true的前提下，设置组件右上角待办数量，为false时显示省略号</font>

- 标识：`showTodoNumber`
- 默认值： "true"

#### 显示数量【limit】
<font color="#CCCCCC">当前组件标题，用来增加组件辨识度</font>

- 标识：`htmlTitle`
- 默认值： 紧急待办

#### 标题图标【titleIconClass】
<font color="#CCCCCC">当前组件标题右侧图标选择</font>

- 标识：`titleIconClass`
- 默认值： ``

#### 图标颜色【titleIconFontColor】
<font color="#CCCCCC">当前组件标题右侧图标颜色选择</font>

- 标识：`titleIconFontColor`
- 默认值： ``
#### 图标大小【titleIconFontSize】
<font color="#CCCCCC">当前组件标题右侧图标大小设置</font>

- 标识：`titleIconFontSize`
- 默认值： 18

### 样式设置
组件内部样式设置
#### 标题字体样式设置【titleFontStyle】
<font color="#CCCCCC">设置标题字体样式，样式四时设置页签字体样式，其他样式设置标题字体样式</font>

- 标识：`titleFontStyle`
- 默认值：
```json
"default": {
  "fontColors": {
      "hex": "#333333"
  },
  "fontSize": 16,
  "fontSizeUnit": "px"
}
```
#### 背景色【bgColor】
设置组件的整体背景颜色
- 标识：`bgColor`
- 默认值：空

#### 宽高
<font color="#CCCCCC">用于对容器的宽高进行行内分组，此处建议都设置为auto。</font>
##### 宽【width】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`width`

- 默认值：`auto`
##### 高【height】
组件的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`height`

- 默认值：`auto`

#### 内外边距【box】
设置组件的最外围的外边距和内边距
- 标识：`box`
- 默认值
```json
"default": {
  "marginTopVal": "",
  "marginRightVal": "",
  "marginBottomVal": "",
  "marginLeftVal": "",
  "paddingTopVal": "10px",
  "paddingRightVal": "10px",
  "paddingBottomVal": "10px",
  "paddingLeftVal": "10px"
}
```
#### 边框【border】
设置组件的最外层的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。

- 标识：`border`
- 默认值： ''

### 高级
<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

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
          "jumpUrl": "/14",
          "isHot": true,
          "readStatus": 1,
          "readStatusText": "已读",
          "department": "文档处",
          "time": "2022-05-09 09:00",
          "title": "标题标题标题，这是标题，这是他标题，
        }
    ],
    "moreUrl": "更多跳转地址"
}
```

##### 显示字段【dataFiled】
根据接口返回数据显示消息标题字段
- 标识：`dataFiled`

- 默认值：`title`

##### 点击单项动作【clickToDoItemFunction】
此设置用于点击时候执行自定义函数逻辑，如果设置了此函数则内置的根据数据跳转链接则失效
- 标识：`clickToDoItemFunction`

- 默认值：跳转接口返回地址

##### 更多链接【moreListLink】
此设置用于点击更多时候跳转链接，如果设置了链接地址则内置的根据数据跳转链接则失效
- 标识：`moreListLink`

- 默认值：跳转接口返回地址

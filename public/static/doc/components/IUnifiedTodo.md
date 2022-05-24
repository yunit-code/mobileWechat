# 统一待办
此组件为统一待办组件，支持自定义样式，角标，数据来源等设置。
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
- 默认值： 待办事项


#### 跳转方式【jumpStyle】
> 点击事件跳转方式
- _self:当前页跳转
- _blank:新开窗口跳转
- 默认值：`_self`

#### 显示标题【showTitle】
<font color="#CCCCCC">是否显示组件标题</font>

- 标识：`showTitle`
- 默认值： `true`显示

#### 显示图标【showIcon】
<font color="#CCCCCC">配置是否显示标题右侧图标，显示标题为true下生效</font>

- 标识：`showIcon`
- 默认值： `true`显示

#### 显示更多【showMore】
<font color="#CCCCCC">是否显示更多按钮/icon</font>

- 标识：`showMore`
- 默认值： `true`显示

#### 显示角标【showTodoNumber】
<font color="#CCCCCC">是否待办数量，在显示更多为true的前提下，设置组件右上角待办数量，为false时显示省略号</font>

- 标识：`showTodoNumber`
- 默认值： `false`隐藏


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
- 默认值： `18`

#### 未读图标【noReadIcon】
<font color="#CCCCCC">设置待办项未读状态时图标</font>

- 标识：`noReadIcon`
- 默认值： ''

#### 空白列表提示文字【emptyText】
<font color="#CCCCCC">设置待办列表为空时，空白数据提示文字</font>

- 标识：`emptyText`
- 默认值： ''

#### 空白列表提示高度【emptyBoxHeight】
<font color="#CCCCCC">设置待办列表为空时，空白数据提示内容高度</font>

- 标识：`emptyBoxHeight`
- 默认值： ''

#### 显示数量【limit】
<font color="#CCCCCC">当前组件标题，用来增加组件辨识度</font>

- 标识：`htmlTitle`
- 默认值： `紧急待办`

### 主题设置【themeList】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。
- 标识：`themeList`

- 默认值：`[]`

### 样式设置
设置组件外部样式
#### 标题字体样式设置【titleFontStyle】
<font color="#CCCCCC">设置标题字体样式</font>

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

#### 默认待办字体【todoFontStyle】
<font color="#CCCCCC">设置默认待办字体样式</font>

- 标识：`todoFontStyle`
- 默认值：
```json
"default": {
  "fontColors": {
      "hex": "#000000"
  },
  "fontSize": 15,
  "fontSizeUnit": "px",
  "fontWeight": "500"
}
```
#### 已读文字【readFontStyle】
<font color="#CCCCCC">设置已读文字字体样式</font>

- 标识：`readFontStyle`
- 默认值：
```json
"default": {
  "fontColors": {
      "hex": "#999999"
  },
  "fontSize": 15,
  "fontSizeUnit": "px",
  "fontWeight": "500"
}
```

#### 已读判断【readExpression】
<font color="#CCCCCC">已读判断表达式，满足结果为true时设置已读，反之未读</font>

- 标识：`readExpression`
- 默认值：`readStatus == '1'`

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
组件的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为
<font color="#FF0000">`auto`</font>

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

### 内层样式设置
设置组件内层样式，显示组件标题时生效

#### 背景色【subBgColor】
设置组件的内层背景颜色
- 标识：`bgColor`
- 默认值：空

#### 宽高
<font color="#CCCCCC">用于对容器的宽高进行行内分组，此处建议都设置为auto。</font>

##### 宽【subWidth】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`width`

- 默认值：`auto`
##### 高【subHeight】
组件的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为
<font color="#FF0000">`auto`</font>

- 标识：`height`
- 默认值：`auto`

#### 内外边距【subBox】
设置组件的内层的外边距和内边距
- 标识：`box`
- 默认值
```json
"default": {
  "marginTopVal": "",
  "marginRightVal": "",
  "marginBottomVal": "",
  "marginLeftVal": "",
  "paddingTopVal": "0",
  "paddingRightVal": "0",
  "paddingBottomVal": "0",
  "paddingLeftVal": "0"
}
```
#### 边框【subBorder】
设置组件的内层的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。

- 标识：`border`
- 默认值： ''

### 高级
<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

##### 设置待办数据来源【dataType】
根据接口返回数据显示消息标题字段
- 标识：`dataType`
- 默认值：`dataSource`
- 可选：
```json
{
  "label": "数据源",
  "value": "dataSource"
},
{
  "label": "自定义",
  "value": "custom"
}
```

##### 数据源【dataSource】
用于选择数据源
- 标识：`dataSource`
- 默认值：`/ctrl/dataSource/getDatasourceByGroup`


##### 自定义数据接口【customGetTodoDataInterfaceUrl】
根据接口返回数据显示消息标题字段
- 标识：`customGetTodoDataInterfaceUrl`
- 默认值：`/ctrl/customizeTodo/getTodoPage"`


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

##### 刷新KEY【messageRefreshKey】
根据组件接受到的websocket类型的消息KEY来刷新数据，可配置多个，以英文逗号分开
- 标识：`messageRefreshKey`
- 默认值：''

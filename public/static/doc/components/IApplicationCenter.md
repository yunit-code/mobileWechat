# 应用中心
此组件为应用中心组件，支持高度，上下内边距设置，圆角，展示行数，展示列数，是否展示应用角标可灵活配置接口显示应用
## 组件类名（className）
IApplicationCenter
## 组件类ID（classId）
idm.componet.mobilewechat.applicationcenter
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobilewechat@1.0.8
## 组件属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>

#### 显示标题【showTitle】
- showTitle: 是否是我的应用组件
- 默认值: `打开`

#### 标题【title】
<font color="#CCCCCC">当前组件标题，用来增加组件辨识度</font>

#### 显示图标【showTitleIcon】
- showTitleIcon: 是否是我的应用组件
- 默认值: `打开`

#### 我的应用【isMyApplication】
- isMyApplication: 是否是我的应用组件
- 默认值: `关闭`

#### 显示更多【showConfig】
> 设置用户是否可以配置我的应用里的数据
- 默认值: `关闭`

#### 显示角标【showTodoNumber】
> 设置是否显示角标提示，如果配置了角标服务接口且有数量的时候会显示红色背景的数量角标
- 默认值: `否`

#### 展示列数【showColumn】
> 设置组件一行展示多少列的应用
- 默认值: `5`

#### 最多行数【showRows】
> 设置组件最多展示多少行的应用，多出的应用会默认隐藏
- 默认值: `2`

#### 标题图标【titleIconClass】
> 设置组件标题后的图标，可上传图标；空值时显示默认图标
- 默认值: ``

#### 图标颜色【titleIconFontColor】
> 设置组件标题后的图标展示的颜色；空值时显示默认颜色
- 默认值: ``

#### 图标大小【titleIconFontSize】
> 设置组件标题后的图标的大小
- 默认值: `14`

#### 应用配置【applicationList】
> 设置组件展示的应用数据

##### 选择应用【selectApplication】
> 应用库中选择应用，选择后会展示应用信息

##### 应用名称【applicationName】
> 可输入应用的名称进行修改，输入口展示输入后的应用名称

##### 应用图标【applicationIconUrl】
> 可上传应用的图标，上传后会覆盖应用的默认图标

##### 显示角标【showTodoNumber】
> 是否展示应用的角标，可对单个应用进行单独的配置
- 默认值: `否`

### 标题容器样式
#### 图标位置【titleIconPosition】
设置组件标题图标的展示位置，可选择标题前展示或标题后展示
- 标识：`titleIconPosition`
- 默认值：`右边`

#### 标题图标设置
##### 标题图标【titleIconClass】
选择标题要展示的图标
- 标识：`titleIconClass`
- 默认值：``

##### 图标颜色【titleIconFontColor】
选择标题要展示的图标的颜色
- 标识：`titleIconFontColor`
- 默认值：``

##### 图标大小【titleIconFontSize】
选择标题要展示的图标的大小
- 标识：`titleIconFontSize`
- 默认值：`14`

#### 标题字体【titleFont】
设置组件标题的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。
- 标识：`titleFont`

### 外层容器样式
#### 内外边距【box】
设置组件的最外围的外边距和内边距
- 标识：`box`
- 默认值：空

#### 宽高
用于对容器的宽高进行行内分组，此处建议都设置为auto。

##### 宽【width】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`width`
- 默认值：`auto`

##### 高【height】
组件的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`height`
- 默认值：`auto`

#### 背景色【bgColor】
设置组件的整体背景颜色
- 标识：`bgColor`
- 默认值：空

#### 边框【border】
设置组件的整体边框样式
- 标识：`border`
- 默认值：空

### 内层容器样式
#### 图片宽度【applicationImgWidth】
填写应用图片的宽度，单位px
- 标识：`applicationImgWidth`

#### 字体【font】
设置组件内层的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。
- 标识：`font`

#### 内外边距【boxInner】
设置组件的内层容器的外边距和内边距
- 标识：`boxInner`
- 默认值：空

#### 宽高
##### 宽【widthInner】
组件内层容器的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`widthInner`
- 默认值：`auto`

##### 高【heightInner】
组件内层容器的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`heightInner`
- 默认值：`auto`

#### 背景色【bgColorInner】
设置组件内层容器的背景颜色
- 标识：`bgColorInner`
- 默认值：``

#### 边框【borderInner】
设置组件内层容器的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。
- 标识：`borderInner`
- 默认值：空

### 主题设置【themeList】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。
- 标识：`themeList`

- 默认值：`[]`

### 高级
#### 适配设置
##### 基准值【adaptationBase】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationBase`
- 默认值：`414`

##### 适配比例【adaptationPercent】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationPercent`
- 默认值：`1.2`

#### 角标字段【dataFiled】
应用显示角标选项打开的时候，根据应用右上角角标接口返回数据格式指定结果集的字段，若它的值为{data:{count:5}}，则这里应该填写count

- 标识：`dataFiled`
- 默认值：`count`

##### 刷新KEY【messageRefreshKey】
根据组件接受到的消息KEY来刷新数据，可配置多个，以英文逗号分开

- 标识：`messageRefreshKey`
- 默认值：``

### 应用管理配置
#### 标题容器样式
##### 字体【titleFontManage】
设置组件标题的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。
- 标识：`titleFontManage`

##### 背景色【titleBgColor】
设置组件标题的最外围的外边距和内边距
- 标识：`titleBgColor`
- 默认值：空

##### 内外边距【titleBox】
设置组件标题的最外围的外边距和内边距
- 标识：`titleBox`
- 默认值：空

#### 内层容器样式
##### 图片宽度【applicationImgWidthManage】
设置组件的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。
- 标识：`applicationImgWidthManage`
- 默认值：`40`

##### 字体【fontManage】
设置组件的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。
- 标识：`fontManage`

##### 内外边距【boxManage】
设置组件的最外围的外边距和内边距
- 标识：`boxManage`
- 默认值：空

##### 背景设置
###### 背景色【bgColorManage】
设置组件的整体背景颜色
- 标识：`bgColorManage`
- 默认值：`auto`

##### 边框【borderManage】
设置组件的最外层的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。

- 标识：`borderManage`
- 默认值：空

#### 主题设置【themeListManage】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。
- 标识：`themeListManage`

- 默认值：`[]`

#### 高级
##### 基准值【adaptationBaseManage】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationBaseManage`
- 默认值：`414`

##### 适配比例【adaptationPercentManage】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationPercentManage`
- 默认值：`1.2`

### 应用搜索配置
#### 内层容器样式
##### 字体【fontSearch】
设置组件的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`fontSearch`
- 默认值：空

##### 操作按钮样式
###### 背景色【bgColorButton】
组件的背景色
- 标识：`bgColorButton`
- 默认值：``

###### 字体【fontButton】
设置组件的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`fontButton`
- 默认值：空

##### 操作按钮样式(已添加)
###### 背景色【bgColorButtonDisabled】
组件的背景色
- 标识：`bgColorButtonDisabled`
- 默认值：``

###### 字体【fontButtonDisabled】
设置组件的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`fontButtonDisabled`
- 默认值：空

##### 内外边距【boxSearch】
设置组件的内层容器的外边距和内边距
- 标识：`boxSearch`
- 默认值：空

##### 宽高
###### 宽【widthSearch】
组件内层容器的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等
- 标识：`widthSearch`
- 默认值：`auto`

###### 高【heightSearch】
组件内层容器的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等
- 标识：`heightSearch`
- 默认值：`auto`

##### 背景色【bgColorSearch】
设置组件内层容器的背景颜色
- 标识：`bgColorSearch`
- 默认值：``

##### 边框【borderSearch】
设置组件内层容器的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。
- 标识：`borderSearch`
- 默认值：空

#### 主题设置【themeListSearch】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。

- 标识：`themeListSearch`
- 默认值：`[]`

#### 高级
##### 基准值【adaptationBaseSearch】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationBaseSearch`
- 默认值：`414`

##### 适配比例【adaptationPercentSearch】
此属性用于标记当前组件在显示效果最完美情况下的宽度大小（px），例如：此组件显示效果最佳宽度为414px，则此处设置为414即可，如果此组件最佳效果为当前配置的屏幕宽（px）的一半则只需要除以2即可。

- 标识：`adaptationPercentSearch`
- 默认值：`1.2`





# 快捷方式
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
IShortCut
## 组件类ID（classId）
idm.componet.mobileWechat.shortcut
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobileWechat@1.0.7
## 组件属性
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 标题【comTitle】
用于设置title
- 标识：`标题【comTitle】`
- 默认值：`快捷方式`
#### 每行展示【maxNumber】
用于设置每行展示多少卡片
- 标识：`每行展示【maxNumber】`
- 默认值：`3`
#### 标题图标【titleIconClass】
用于设置标题右侧的图标
- 标识：`标题图标【titleIconClass】`
- 默认值：``
#### 图标颜色【titleIconFontColor】
用于设置标题右侧的图标的色值
- 标识：`图标颜色【titleIconFontColor】`
- 默认值：``
#### 图标大小【titleIconFontSize】
用于设置标题右侧的图标的大小
- 标识：`图标大小【titleIconFontSize】`
- 默认值：``
#### 快捷方式配置【子表】【shortConfigList】
##### 名称【name】
用于设置卡片内容的名称
- 标识：`名称【name】`
- 默认值：`省政府领导分工`
##### 跳转方式【jumpType】
用于设置点击卡片跳转的方式
1. 跳转当前页
2. 新开页面
- 标识：`跳转方式【jumpType】`
- 默认值：`跳转当前页`
##### URL【shotUrl】
用于设置点击卡片跳转的链接
- 标识：`URL【shotUrl】`
- 默认值：``
##### 背景图片【bgUrl】
用于设置卡片的背景图
- 标识：`背景图片【bgUrl】`
- 默认值：`渐变色`
### 样式设置
#### 内外边距【box】
设置组件的最外围的外边距和内边距
- 标识：`box`
- 默认值：空
#### 宽高
<font color="#CCCCCC">用于对容器的宽高进行行内分组，此处建议都设置为auto。</font>
##### 宽【width】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`width`

- 默认值：`auto`
##### 宽【width】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`width`
- 默认值：`auto`
##### 高【height】
组件的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`height`

- 默认值：`auto`
#### 背景设置
##### 背景色【bgColor】
设置组件的整体背景颜色
- 标识：`bgColor`

- 默认值：空
##### 背景图片【bgImgUrl】
设置组件的整体背景图片，此处可以填写图片地址，也可直接上传图片，上传成功后都是会把地址回填到文本框中，地址是会经过[IDM.url.getWebPath](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)转换的，地址可填写的前缀方式可以点击[此处](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)参考。
- 标识：`bgImgUrl`

- 默认值：空
##### 横向偏移【positionX】
设置背景图片的横向偏移值，请参考 [background-position-x](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position-x)
- 标识：`positionX`

- 默认值：空
##### 纵向偏移【positionY】
设置背景图片的纵向偏移值，请参考 [background-position-y](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position-y)
- 标识：`positionY`

- 默认值：空
##### 背景大小【bgSize】
设置背景图片的背景类型，目前有以下三种方式提供选择：
1. **裁剪显示：** 缩放背景图片以完全覆盖背景区，可能背景图片部分看不见。
2. **完全显示：** 缩放背景图片以完全装入背景区，可能背景区部分空白。
3. **自定义：** 自定义设定宽度和高度值
- 标识：`bgSize`

- 默认值：空
🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 宽度【bgSizeWidth】
设置背景图片的背景宽度值
- 标识：`bgSizeWidth`

- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 高度【bgSizeHeight】
设置背景图片的背景高度值
- 标识：`bgSizeHeight`

- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 平铺模式【bgRepeat】
设置背景图片的背景平铺模式，目前有以下五种方式提供选择：
1. **双向重复：** 图片不够覆盖的时候X、Y轴都会重复显示
2. **水平重复：** 图片不够覆盖的时候X轴都会重复显示
3. **垂直重复：** 图片不够覆盖的时候Y轴都会重复显示
4. **不重复：** 图片不够覆盖的时候不重复显示
5. **继承：** 继承父容器属性

- 标识：`bgRepeat`

- 默认值：空

🍹更深刻的含义请参考 [background-repeat](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-repeat)
##### 背景模式【bgAttachment】
设置背景图像的位置是在视口内固定，或者随着包含它的区块滚动，目前有以下三种方式提供选择：
1. **固定：** 此关键属性值表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。
2. **滚动：** 此关键属性值表示背景相对于元素本身固定， 而不是随着它的内容滚动（对元素边框是有效的）。
3. **继承：** 继承父容器属性

- 标识：`bgAttachment`

- 默认值：空

🍹更深刻的含义请参考 [background-attachment](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment)
#### 边框【border】
设置组件的最外层的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。

- 标识：`border`

- 默认值：空
#### 标题文字【font】
设置组件的标题文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`font`

- 默认值：空
### 高级
#### 动态内容【dataSourceType】
#### 接口地址【customInterfaceUrl】
#### 结果集名【dataName】
#### 显示字段【dataFiled】
#### 自定义函数【customFunction】
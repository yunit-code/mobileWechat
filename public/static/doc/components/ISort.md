# 多页签待办列表组件
此组件为针对工作台组件进行排序的组件，支持对提醒信息和样式设置，每个功能都可以自由灵活定制，支持配置实现功能扩展，支持在线自定义扩展开发。
## 组件类名（className）
ISort
## 组件类ID（classId）
idm.componet.mobileWechat.sort
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobileWechat@1.0.6
## 组件属性
此章节主要介绍该组件的每个属性的含义以及如何使用说明
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
<font color="#CCCCCC">此章节主要用于存放设置组件所需要的一些基本信息的属性，以达到组件具备使用的基础条件</font>
#### 页面ID【pageid】
用于设置当前页面唯一值字段名，方便通过字段名获取到页面地址中的唯一值，从而获取页面组件数据
- 标识：`pageid`
- 默认值：`pageid`
#### 提示信息【tipText】
用于设置组件头部提示信息显示内容
- 标识：`tipText`
- 默认值：`你可以通过拖拽对功能组件进行排序，点击置顶图表快速置顶重要组件，点击隐藏图标隐藏当前组件。`


### 样式设置
<font color="#CCCCCC">用于设置组件的整体基础样式外观的组件属性的分组。</font>

#### 内外边距【box】
设置组件的最外围的外边距和内边距
- 标识：`box`

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

#### 背景设置
<font color="#CCCCCC">用于对容器的背景设置分组。</font>
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

#### 卡片阴影【cardBoxShadow】
设置组件最外层的阴影样式，填写格式如下：`10px 10px 5px #888888`。

- 标识：`cardBoxShadow`

- 默认值：`0px 0px 3px rgba(0,0,0,0.1)`

#### 文字【font】
设置组件的整体文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`font`

- 默认值：空

### 提示信息
<font color="#CCCCCC">用于对提示信息样式设置分组。</font>
#### 文字【tipFont】
设置提示信息文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`tipFont`

#### 背景色【tipBgColor】
设置组件的整体背景颜色

- 标识：`tipBgColor`

- 默认值：空

### 高级
<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

#### 默认列表【componentListUrl】
获取当前页面默认一级组件列表,接收参数格式为：
``` json
{	
	"pageId":"页面ID",
}
```
- 标识：`componentListUrl`

- 默认值：`/ctrl/idm/api/fetchPageSettingData`

#### 个性列表【userCustomizationUrl】
获取当前页面用户个性化一级组件列表,接收参数格式为：
``` json
{	
	"pageId":"页面ID",
	"version":"页面版本号",
}
```
- 标识：`userCustomizationUrl`

- 默认值：`/ctrl/idm/api/fetchUserCustomization`

#### 个性列表【componentListUrl】
用户保存排序后的数据,接收参数格式为：
``` json
{	
	"pageId":"页面ID",
	"version":"页面版本号",
	"customData":"个性化定制数据,结构为对象，对象下包含数组层级"
}
```
- 标识：`saveUserCustomizationUrl`

- 默认值：`/ctrl/idm/api/saveUserCustomization`


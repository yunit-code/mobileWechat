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
mobileWechat@1.0.8
## 组件属性
### 唯一标识【ctrlId】
只读属性，不可修改，作为每个组件实例的一个唯一标识
- 标识：`ctrlId`
- 默认值：`@[packageid]`
### 基本属性
#### 显示标题【isShowTitle】
用于设置title是否显示
- 标识：`是否显示标题【isShowTitle】`
- 默认值：`显示`
#### 标题【comTitle】
用于设置标题
- 标识：`标题【comTitle】`
- 默认值：`快捷方式`
#### 图标位置【titleIconPosition】
用于设置标题图标位置
- 标识：`图标位置【titleIconPosition】`
- 默认值：`右侧`
##### 标题图标【titleIconClass】
用于设置标题图标
- 标识：`标题【titleIconClass】`
- 默认值：`空`
#### 快捷方式样式【shortCutStyle】
用于设置快捷方式样式
- 标识：`是否显示标题【shortCutStyle】`
- 默认值：`样式1`
#### 每行展示【maxNumber】
用于设置每行展示多少卡片
- 标识：`每行展示【maxNumber】`
- 默认值：`3`
#### 每项宽度【shortItemWidth】
用于设置每项宽度
- 标识：`每项宽度【shortItemWidth】`
- 默认值：`100%`
#### 每项高度【shortItemHeight】
用于设置每项高度
- 标识：`每项高度【shortItemHeight】`
- 默认值：`72.5px`
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
##### 背景图片【bgImgUrl】
设置组件的整体背景图片，此处可以填写图片地址，也可直接上传图片，上传成功后都是会把地址回填到文本框中，地址是会经过[IDM.url.getWebPath](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)转换的，地址可填写的前缀方式可以点击[此处](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)参考。
- 标识：`bgImgUrl`

- 默认值：空
##### 背景宽度【bgSizeWidth】
设置背景图片的背景宽度值
- 标识：`bgSizeWidth`

- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 背景高度【bgSizeHeight】
设置背景图片的背景高度值
- 标识：`bgSizeHeight`

- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 背景平铺模式【bgRepeat】
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
##### 显示角标【showTodoNumber】
用于设置卡片是否显示角标
- 标识：`显示角标【showTodoNumber】`
- 默认值：`不显示`
##### 数据接口
应用显示角标选项打开的时候，用于获取应用右上角角标数据的接口地址

- 标识：`getApplicationMarkNumberUrl`
- 默认值：`/ctrl/dataSource/getDatas`
- 接口返回格式需要按照以下要求：
``` json
{
    "code":"200",
    "type":"success",
    "message":"操作成功",
    "metadata":null,
    "token":"",
    "data": {
        "count": 5, //应用角标显示值
    }
}
```

##### 角标字段【dataFiled】
应用显示角标选项打开的时候，根据应用右上角角标接口返回数据格式指定结果集的字段，若它的值为{data:{count:5}}，则这里应该填写count

- 标识：`dataFiled`
- 默认值：`count`
### 标题容器样式设置
#### 图标颜色
设置组件的title图标的颜色
- 标识：`titleIconFontColor`

- 默认值：空
#### 图标大小
设置组件的title图标的大小
- 标识：`titleIconFontSize`

- 默认值：14
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
### 内容容器样式设置
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

### 主题设置【themeList】
用于设置组件的主题样式表，此处可跟随自身主题进行随意设置，此属性是一个表结构集合的形式属性。
- 标识：`themeList`

- 默认值：`[]`

### 高级
<font color="#CCCCCC">用于对组件高级设置的属性的分组。</font>

#### 基准值属性【screenReferValue】
用于设置页面适配基准值属性
- 标识：`页面适配基准值属性【screenReferValue】`
- 默认值：`414`
#### 适配比例属性【screenAdaptiveRatio】
用于设置页面适配比例属性
- 标识：`适配比例属性【screenAdaptiveRatio】`
- 默认值：`1.2`
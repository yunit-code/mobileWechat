# 文本
此组件为应用中心组件，支持高度，上下内边距设置，圆角，展示行数，展示列数，是否展示应用角标可灵活配置接口显示应用
## 组件类名（className）
IApplicationManage
## 组件类ID（classId）
idm.componet.mobilewechat.applicationmanage
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

### 标题样式设置
#### 内外边距【titleBox】
设置组件标题的最外围的外边距和内边距
- 标识：`titleBox`
- 默认值：空

#### 宽高
<font color="#CCCCCC">用于对容器标题的宽高进行行内分组，此处建议都设置为auto。</font>

##### 宽【titleWidth】
组件标题的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`titleWidth`
- 默认值：`auto`

##### 高【titleHeight】
组件标题的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`height`
- 默认值：`auto`

#### 文字【titleFontManage】
设置组件标题的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

#### 背景设置
##### 背景色【titleBgColor】
设置组件标题的整体背景颜色
- 标识：`titleBgColor`
- 默认值：`auto`

### 样式设置
#### 内外边距【box】
设置组件的最外围的外边距和内边距
- 标识：`boxManage`
- 默认值：空

#### 宽高
<font color="#CCCCCC">用于对容器的宽高进行行内分组，此处建议都设置为auto。</font>
##### 宽【widthManage】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>

##### 宽【widthManage】
组件的宽度，填写auto则为自适应，或者使用px、%、vw等单位，比如100%、100px、100vw等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`widthManage`
- 默认值：`auto`

##### 高【heightManage】
组件的高度，填写auto则为自适应，或者使用px、%、vh等单位，比如100%、100px、100vh等等，不过此处建议设置为<font color="#FF0000">`auto`</font>
- 标识：`heightManage`
- 默认值：`auto`

#### 背景设置
##### 背景色【bgColorManage】
设置组件的整体背景颜色
- 标识：`bgColorManage`
- 默认值：`auto`

##### 背景图片【bgImgUrlManage】
设置组件的整体背景图片，此处可以填写图片地址，也可直接上传图片，上传成功后都是会把地址回填到文本框中，地址是会经过[IDM.url.getWebPath](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)转换的，地址可填写的前缀方式可以点击[此处](https://yunit-code.github.io/zh/coreapi/api.html#getwebpath)参考。
- 标识：`bgImgUrlManage`
- 默认值：空

##### 横向偏移【positionXManage】
设置背景图片的横向偏移值，请参考 [background-position-x](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position-x)
- 标识：`positionXManage`
- 默认值：空

##### 纵向偏移【positionYManage】
设置背景图片的纵向偏移值，请参考 [background-position-y](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position-y)
- 标识：`positionYManage`
- 默认值：空

##### 背景大小【bgSizeManage】
设置背景图片的背景类型，目前有以下三种方式提供选择：
1. **裁剪显示：** 缩放背景图片以完全覆盖背景区，可能背景图片部分看不见。
2. **完全显示：** 缩放背景图片以完全装入背景区，可能背景区部分空白。
3. **自定义：** 自定义设定宽度和高度值
- 标识：`bgSizeManage`
- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 宽度【bgSizeWidthManage】
设置背景图片的背景宽度值
- 标识：`bgSizeWidthManage`
- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 高度【bgSizeHeightManage】
设置背景图片的背景高度值
- 标识：`bgSizeHeightManage`
- 默认值：空

🍹更深刻的含义请参考 [background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)
##### 平铺模式【bgRepeatManage】
设置背景图片的背景平铺模式，目前有以下五种方式提供选择：
1. **双向重复：** 图片不够覆盖的时候X、Y轴都会重复显示
2. **水平重复：** 图片不够覆盖的时候X轴都会重复显示
3. **垂直重复：** 图片不够覆盖的时候Y轴都会重复显示
4. **不重复：** 图片不够覆盖的时候不重复显示
5. **继承：** 继承父容器属性

- 标识：`bgRepeatManage`
- 默认值：空

🍹更深刻的含义请参考 [background-repeat](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-repeat)
##### 背景模式【bgAttachmentManage】
设置背景图像的位置是在视口内固定，或者随着包含它的区块滚动，目前有以下三种方式提供选择：
1. **固定：** 此关键属性值表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。
2. **滚动：** 此关键属性值表示背景相对于元素本身固定， 而不是随着它的内容滚动（对元素边框是有效的）。
3. **继承：** 继承父容器属性

- 标识：`bgAttachmentManage`
- 默认值：空

🍹更深刻的含义请参考 [background-attachment](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment)
#### 边框【borderManage】
设置组件的最外层的边框和圆角，可点击中间加号统一设置四边或四角，也可单独一边一边设置不同的边框或圆角样式。

- 标识：`borderManage`
- 默认值：空

#### 文字【fontManage】
设置组件的文字的字体样式，可设置文字的字体、字重、样式、字体颜色、大小、行高、对齐、修饰等。

- 标识：`fontManage`
- 默认值：空



### 高级
#### 我的应用【getMyApplicationUrl】
用于获取组件中我的应用模块数据的接口地址。

- 标识：`getMyApplicationUrlManage`
- 默认值：`/ctrl/tencentApp/queryMyFavorite`
- 接口返回格式需要按照以下要求：
``` json
{
    "code":"200",
    "type":"success",
    "message":"操作成功",
    "metadata":null,
    "token":"",
    "data": [
        {
            "sourceId": 1, //应用数据源id
            "imageUrl": 1, //应用图标url
            "appUrl": 1, //应用地址
            "title": "应用名称", //应用名称
            "value": 1, //应用key
        }
    ]
}
```

#### 全部应用【getAllApplicationUrl】
用于获取组件中全部应用模块数据的接口地址。

- 标识：`getAllApplicationUrl`
- 默认值：`/ctrl/tencentApp/queryAppGroupByGrant`
- 接口返回格式需要按照以下要求：
``` json
{
    "code":"200",
    "type":"success",
    "message":"操作成功",
    "metadata":null,
    "token":"",
    "data": [
        {
            "title": "分组名称", //分组名称
            "value": 1, //分组值
            "key": 1, //分组key
            "children": [
                {
                    "is_favorite": "0",
                    "imageUrl": "", //应用图片url
                    "appUrl": "", //应用链接
                    "title": "应用名称", //应用名称
                    "value": "1", //应用id
                    "key": "1", //分组key
                }
            ]
        }
    ]
}
```

#### 保存接口【saveMyApplicationUrl】
保存用户设置的我的应用的接口地址

- 标识：`saveMyApplicationUrl`
- 默认值：`/ctrl/tencentApp/batchSetFavoriteApp`
- 参数格式需要按照以下要求：
``` json
{
    "appId":"1,2", //我的应用的集合以 , 拼接  
}
```


#### 搜索地址【clickSearchUrl】
点击搜索按钮时页面跳转的地址

- 标识：`clickSearchUrl`
- 默认值：``

#### 跳转方式【clickSearchJumpType】
点击搜索按钮时页面跳转的地址

- 标识：`clickSearchJumpType`
- 默认值：`_self`

#### 取消时动作【clickCancelFunction】
点击取消的时候会调用设置的自定义函数，接收参数为格式为{...自定义的}

- 标识：`clickCancelFunction`
